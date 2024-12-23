import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCashflowDto } from './dto/create-cashflow.dto';
import { UpdateCashflowDto } from './dto/update-cashflow.dto';
import { PrismaService } from '../prisma/prisma.service';
import { IPayload } from 'src/auth/auth.service';
import * as dayjs from 'dayjs';
import * as Excel from 'exceljs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { FileUploadDto } from 'src/egg/dto/fileUpload.dto';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Jakarta');

export interface ILaporan {
  coopId: number;
  transDate: Date;
  jenis: string;
  qty: number;
  indexs: number;
  totalIncome: number;
  eggNotes: number;
  kilo: number;
  price: number;
  totalExpenses: number;
}

const month = {
  januari: '01',
  februari: '02',
  maret: '03',
  april: '04',
  mei: '05',
  juni: '06',
  juli: '07',
  agustus: '08',
  september: '09',
  oktober: '10',
  november: '11',
  desember: '12',
};

const monthRegex =
  /\b(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\b/;

const convertValue = {
  string: (e) => (e ? e.toString() : null),
  number: (e) => (e ? parseInt(e) : null),
  float: (e) => (e ? parseFloat(e).toFixed(2) : null),
  date: (e) => (e ? e : new Date()),
};

function getValue(data: any, tipe: string) {
  try {
    return data instanceof Date
      ? data
      : typeof data === 'object'
        ? convertValue[tipe](data?.result)
        : convertValue[tipe](data);
  } catch (error) {
    return convertValue[tipe](data);
  }
}

@Injectable()
export class CashflowService {
  constructor(private readonly prisma: PrismaService) {}

  async getTotalDebitCredit() {
    await this.prisma.$executeRaw`with cte_sum as (
      select id,
      sum(case when LOWER(tipe) = 'debit' then nominal else 0 end) over(order by id) - sum(case when LOWER(tipe) = 'kredit' then nominal else 0 end) over(order by id)  as balance 
      from "Cashflow" c 
      group by id order by id asc
      )
      update "Cashflow" set total = cte_sum.balance, tipe = LOWER(tipe)
      from cte_sum
      where cte_sum.id = "Cashflow".id `;

    const result = await this.prisma.cashflow.groupBy({
      by: ['tipe'],
      _sum: {
        nominal: true,
      },
    });
    const total_debit =
      result.filter((x) => x.tipe.toLowerCase() === 'debit')[0]?._sum
        ?.nominal || 0;
    const total_credit =
      result.filter((x) => x.tipe.toLowerCase() === 'kredit')[0]?._sum
        ?.nominal || 0;
    return { total_debit, total_credit };
  }
  async create(createCashflowDto: CreateCashflowDto, req: IPayload) {
    try {
      if (
        ['debit', 'kredit'].indexOf(createCashflowDto.tipe.toLowerCase()) < 0
      ) {
        return 'please use credit / debit to fill type transaction.';
      }
      const { total_debit, total_credit } = await this.getTotalDebitCredit();
      const total =
        createCashflowDto.tipe.toLowerCase() === 'debit'
          ? total_debit + createCashflowDto.nominal - total_credit
          : total_debit - (total_credit + createCashflowDto.nominal);
      const data = {
        ...createCashflowDto,
        trans_date: dayjs().tz('UTC').toDate(),
        periode: dayjs(createCashflowDto.periode).tz('UTC').toDate(),
        total: total,
        userId: req.uid,
      };

      return this.prisma.cashflow.create({ data });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const { total_debit, total_credit } = await this.getTotalDebitCredit();
    const cashflow = await this.prisma.cashflow.findMany({
      orderBy: {
        trans_date: 'desc',
      },
      select: {
        id: true,
        periode: true,
        trans_date: true,
        tipe: true,
        nominal: true,
        total: true,
      },
    });
    return { cashflow, total: total_debit - total_credit };
  }

  findOne(id: number) {
    return this.prisma.cashflow.findUnique({ where: { id } });
  }

  async update(id: number, updateCashflowDto: UpdateCashflowDto) {
    await this.prisma.cashflow.update({
      where: { id },
      data: updateCashflowDto,
    });

    return await this.prisma.$executeRaw`with cte_sum as (
      select id,
      sum(case when LOWER(tipe) = 'debit' then nominal else 0 end) over(order by id) - sum(case when LOWER(tipe) = 'kredit' then nominal else 0 end) over(order by id)  as balance 
      from "Cashflow" c 
      group by id order by id asc
      )
      update "Cashflow" set total = cte_sum.balance, tipe = LOWER(tipe)
      from cte_sum
      where cte_sum.id = "Cashflow".id `;
  }

  async remove(id: number) {
    return await this.prisma.cashflow.delete({
      where: { id },
    });
  }

  stringToDate(dateString: string) {
    const t =
      typeof dateString === 'number' ? dateString : parseInt(dateString);
    const date0 = new Date(0);
    const utcOffset = date0.getTimezoneOffset();

    return new Date(0, 0, t - 1, 0, -utcOffset, 0);
  }

  getTransDate(monthString: string) {
    const dateString = `${new Date().getFullYear()}-${month[monthString]}-01`;
    const transDate = dayjs(dateString).tz('Asia/Jakarta').format('YYYY-MM-DD');
    return transDate;
  }

  async proccess(file: Express.Multer.File, body: FileUploadDto) {
    try {
      if (!body?.coopId) {
        throw new BadRequestException('Something went wrong', {
          cause: new Error(),
          description: 'Id Kandang tidak boleh kosong.',
        });
      }

      const coop = await this.prisma.coop.findUnique({
        where: { id: Number(body.coopId) },
      });
      if (!coop) {
        throw new BadRequestException('Something went wrong', {
          cause: new Error(),
          description: 'Anda harus memilih kandang yang valid.',
        });
      }
      const workBook = new Excel.Workbook();
      await workBook.xlsx.readFile(file.path);

      let sheet: Excel.Worksheet;
      const sheetNames = workBook.worksheets.map((s) => s.name);
      sheetNames.forEach(async (element) => {
        sheet = workBook.getWorksheet(element);
        const month = element.toLowerCase().match(monthRegex);

        if (month) {
          console.log(month[0]); // Output: January
        } else {
          console.log('No month found');
          throw new BadRequestException('Something went wrong', {
            cause: new Error(),
            description: 'Nama sheet tidak mengandung nama bulan.',
          });
        }

        const listReport = [];
        for (let index = 6; index < 500; index++) {
          let data = <ILaporan>{};
          const no = sheet.getRow(index).getCell(1).value;

          if (no) {
            const jenis = sheet.getRow(index).getCell(2).value;
            const qty = sheet.getRow(index).getCell(3).value;
            const idx = sheet.getRow(index).getCell(4).value;
            const jumlah_pemasukan = sheet.getRow(index).getCell(5).value;
            const nota = sheet.getRow(index).getCell(6).value;
            const kg = sheet.getRow(index).getCell(7).value;
            const harga = sheet.getRow(index).getCell(8).value;
            const jumlan_pengeluaran = sheet.getRow(index).getCell(9).value;

            data = {
              coopId: Number(body?.coopId),
              transDate: new Date(this.getTransDate(month[0])),
              jenis: jenis.toString(),
              qty: getValue(qty, 'number'),
              indexs: getValue(idx, 'number'),
              totalIncome: getValue(jumlah_pemasukan, 'number'),
              eggNotes: getValue(nota, 'number'),
              kilo: getValue(kg, 'number'),
              price: getValue(harga, 'number'),
              totalExpenses: getValue(jumlan_pengeluaran, 'number'),
            };
            listReport.push(data);
          } else {
            break;
          }
        }
        return await this.prisma.report.createMany({ data: listReport });
      });

      if (!sheet) {
        throw new BadRequestException('Something went wrong', {
          cause: new Error(),
          description:
            'Nama sheet tidak valid (Sheet 1 atau RECORDING PRODUKSI).',
        });
      }
    } catch (error) {
      console.log('error: ', error);
      throw error;
    }
  }

  async getReport(coopId: number, period: string) {
    const listReport = await this.prisma.report.findMany({ where: { coopId } });

    return listReport.filter((x) => {
      const date = new Date(x.transDate);
      const paramDate = new Date(period);
      return (
        date.getMonth() + 1 === paramDate.getMonth() + 1 &&
        date.getFullYear() === paramDate.getFullYear()
      );
    });
  }
}
