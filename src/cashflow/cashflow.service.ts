import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCashflowDto } from './dto/create-cashflow.dto';
import { UpdateCashflowDto } from './dto/update-cashflow.dto';
import { PrismaService } from '../prisma/prisma.service';
import { IPayload } from 'src/auth/auth.service';
import * as Excel from 'exceljs';
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
// import { FileUploadDto } from 'src/egg/dto/fileUpload.dto';
import { CoopService } from 'src/coop/coop.service';
import { ReportUploadDto } from './dto/reportUpload.dto';
import { Prisma } from '@prisma/client';

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
  constructor(
    private readonly coopService: CoopService,
    private readonly prisma: PrismaService,
  ) {}

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
      data: {
        periode: new Date(updateCashflowDto.periode),
        tipe: updateCashflowDto.tipe,
        nominal: updateCashflowDto.nominal,
      },
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

  async proccess(file: Express.Multer.File, body: ReportUploadDto) {
    try {
      if (!body?.coopId) {
        throw new BadRequestException('Something went wrong', {
          cause: new Error(),
          description: 'Id Kandang tidak boleh kosong.',
        });
      }

      if (!body?.period) {
        throw new BadRequestException('Something went wrong', {
          cause: new Error(),
          description: 'Periode harus dipilih.',
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
        // baca period dari nama sheet
        // const month = element.toLowerCase().match(monthRegex);

        // if (month) {
        //   console.log(month[0]); // Output: January
        // } else {
        //   console.log('No month found');
        //   throw new BadRequestException('Something went wrong', {
        //     cause: new Error(),
        //     description: 'Nama sheet tidak mengandung nama bulan.',
        //   });
        // }

        const listReport = [];
        for (let index = 6; index < 500; index++) {
          let data = <ILaporan>{};
          const no = sheet.getRow(index).getCell(1).value;

          if (no) {
            const jenis = sheet.getRow(index).getCell(2).value;
            const qty = sheet.getRow(index).getCell(3).value;
            const idx = sheet.getRow(index).getCell(4).value;
            const jumlah_pemasukan = sheet.getRow(index).getCell(9).value;
            const nota = sheet.getRow(index).getCell(6).value;
            const kg = sheet.getRow(index).getCell(7).value;
            const harga = sheet.getRow(index).getCell(8).value;
            const jumlan_pengeluaran = sheet.getRow(index).getCell(5).value;

            data = {
              coopId: Number(body?.coopId),
              transDate: new Date(body.period), // new Date(this.getTransDate(month[0])),
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

  getFirstLastDate(period: Date) {
    const firstDay = new Date(period.getFullYear(), period.getMonth(), 1); // First day of the month
    const lastDay = new Date(
      period.getFullYear(),
      period.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    ); // Last day of the month

    return { firstDay, lastDay };
  }

  getStyledPropsHeader(): Partial<Excel.Style> {
    return {
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'A0CD63' },
      },
      font: { bold: true },
      alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
      border: {
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
      },
    };
  }

  getHeader(ws: Excel.Worksheet): Excel.Worksheet {
    const styled = this.getStyledPropsHeader();
    ws.mergeCells('A2:J2');
    ws.getCell('A2').value = 'FORMAT LAPORAN PENDAPATAN';
    ws.getCell('A2').alignment = { horizontal: 'center' };
    ws.getCell('A2').font = { bold: true };

    ws.mergeCells('A4:A5');
    ws.getCell('A4').value = 'NO';
    ws.getCell('A4').style = styled;

    ws.mergeCells('B4:E4');
    ws.getCell('B4').value = 'PENGELUARAN';
    ws.getCell('B4').style = styled;

    ws.mergeCells('F4:I4');
    ws.getCell('F4').value = 'PEMASUKAN';
    ws.getCell('F4').style = styled;

    ws.mergeCells('J4:J5');
    ws.getCell('J4').value = 'PENDAPATAN BERSIH';
    ws.getCell('J4').style = styled;

    ws.getCell('B5').value = 'JENIS';
    ws.getCell('B5').style = styled;
    ws.getCell('C5').value = 'QTY';
    ws.getCell('C5').style = styled;
    ws.getCell('D5').value = 'INDEKS';
    ws.getCell('D5').style = styled;
    ws.getCell('E5').value = 'JUMLAH';
    ws.getCell('E5').style = styled;
    ws.getCell('F5').value = 'NOTA TELUR (PETI)';
    ws.getCell('F5').style = styled;
    ws.getCell('G5').value = 'KILO';
    ws.getCell('G5').style = styled;
    ws.getCell('H5').value = 'HARGA';
    ws.getCell('H5').style = styled;
    ws.getCell('I5').value = 'JUMLAH';
    ws.getCell('I5').style = styled;
    return ws;
  }

  async getContent(ws: Excel.Worksheet, period: string, coopId: number) {
    const { firstDay, lastDay } = this.getFirstLastDate(new Date(period));
    const reports = await this.prisma.report.findMany({
      where: {
        coopId: Number(coopId),
        transDate: { lte: lastDay, gte: firstDay },
      },
      orderBy: { id: 'asc' },
    });

    ws.columns = [
      {
        key: 'no',
        alignment: { horizontal: 'center', vertical: 'middle' },
        width: 5,
      },
      { key: 'jenis', alignment: { horizontal: 'left' }, width: 27 },
      { key: 'qty', alignment: { horizontal: 'center' }, width: 4.86 },
      { key: 'indexs', alignment: { horizontal: 'right' }, width: 11.6 },
      {
        key: 'totalExpenses',
        alignment: { horizontal: 'right' },
        width: 11.6,
      },
      { key: 'eggNotes', alignment: { horizontal: 'center' }, width: 11.3 },
      { key: 'kilo', alignment: { horizontal: 'center' }, width: 5 },
      { key: 'price', alignment: { horizontal: 'right' }, width: 11.6 },
      { key: 'totalIncome', alignment: { horizontal: 'right' }, width: 11.6 },
      {
        key: 'pendapatanBersih',
        alignment: { horizontal: 'right' },
        width: 13,
      },
    ];
    let idx = 6;
    reports.forEach((item, index) => {
      ws.addRow({
        no: index + 1,
        jenis: item.jenis ?? '',
        qty: item.qty ?? '',
        indexs: item.indexs ?? '',
        totalIncome:
          item.kilo && item.coopId
            ? { formula: `G${idx}*H${idx}`, value: item.totalIncome ?? '' }
            : (item.totalIncome ?? ''),
        eggNotes: item.eggNotes ?? '',
        kilo: item.kilo ?? '',
        price: item.price ?? '',
        _totalExpenses:
          item.qty && item.indexs
            ? {
                formula: `C${idx}*D${idx}`,
                value: item.totalExpenses ?? '',
              }
            : (item.totalExpenses ?? ''),
        get totalExpenses() {
          return this._totalExpenses;
        },
        set totalExpenses(value) {
          this._totalExpenses = value;
        },
        pendapatanBersih:
          item.jenis.toLowerCase() === 'total'
            ? item.totalIncome - item.totalExpenses
            : '',
      });
      ws.getCell(`A${idx}`).style = {
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: {
          top: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
        },
      };
      ws.getCell(`B${idx}`).border = {
        top: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
      };
      ws.getCell(`C${idx}`).style = {
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: {
          top: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
        },
      };
      ws.getCell(`D${idx}`).border = {
        top: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
      };
      ws.getCell(`E${idx}`).border = {
        top: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
      };
      ws.getCell(`F${idx}`).style = {
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: {
          top: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
        },
      };
      ws.getCell(`G${idx}`).border = {
        top: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
      };
      ws.getCell(`H${idx}`).border = {
        top: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
      };
      ws.getCell(`I${idx}`).border = {
        top: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
      };
      ws.getCell(`J${idx}`).border = {
        top: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
      };
      if (item.indexs) {
        ws.getCell(`D${idx}`).numFmt = '* #,##0';
      }
      if (item.totalExpenses) {
        ws.getCell(`E${idx}`).numFmt = '* #,##0';
      }
      if (item.price) {
        ws.getCell(`H${idx}`).numFmt = '* #,##0';
      }
      if (item.totalIncome) {
        ws.getCell(`I${idx}`).numFmt = '* #,##0';
      }
      if (item.totalExpenses > 0 || item.totalIncome > 0) {
        ws.getCell(`J${idx}`).numFmt = '* #,##0';
      }
      idx++;
    });
  }

  async download(coopId: number, period: string): Promise<any> {
    try {
      const coop = await this.coopService.findOne(Number(coopId));
      const sheetName = dayjs(period).tz('Asia/Jakarta').format('MMMM-YYYY');
      const wb = new Excel.Workbook();
      let ws = wb.addWorksheet(sheetName);

      ws = this.getHeader(ws);
      await this.getContent(ws, period, coopId);

      const buffer = await wb.xlsx.writeBuffer();
      const title = `Laporan Pendapatan ${coop.name} - ${sheetName}.xlsx`;
      return { buffer, title };
    } catch (error) {
      throw error;
    }
  }

  async getReportNetIncome(coopId?: number, period?: Date) {
    try {
      let report: any[] = [];

      if (period) {
        const p = new Date(period);

        // UTC-safe month range
        const startDate = new Date(
          Date.UTC(p.getFullYear(), p.getMonth() + 1, 1),
        );
        const endDate = new Date(
          Date.UTC(p.getFullYear(), p.getMonth() + 2, 1),
        );
        const coopFilter = coopId
          ? Prisma.sql`AND r."coopId" = ${Number(coopId)}`
          : Prisma.empty;

        report = await this.prisma.$queryRaw`
        SELECT 
          c.id,
          r."coopId",
          c.nik,
          c."name",
          date_trunc('month', r."transDate")::date AS "transDate",
          SUM(COALESCE(r."totalIncome", 0))::int AS "totalIncome",
          SUM(COALESCE(r."totalExpenses", 0))::int AS "totalExpenses",
          SUM(COALESCE(r."totalIncome", 0))::int 
            - SUM(COALESCE(r."totalExpenses", 0))::int AS "netIncome",
          ${startDate}::date AS "period"
        FROM public."Report" r
        INNER JOIN public."Coop" c 
          ON c.id = r."coopId"
        WHERE r."transDate" >= ${startDate}
          AND r."transDate" < ${endDate}
          ${coopFilter}
        GROUP BY 
          c.id, 
          r."coopId", 
          c.nik, 
          c."name", 
          date_trunc('month', r."transDate")
        ORDER BY c.nik ASC;
      `;
      } else {
        report = await this.prisma.$queryRaw`
        SELECT 
          c.id,
          r."coopId",
          c.nik,
          c."name",
          date_trunc('month', r."transDate")::date AS "transDate",
          SUM(COALESCE(r."totalIncome", 0))::int AS "totalIncome",
          SUM(COALESCE(r."totalExpenses", 0))::int AS "totalExpenses",
          SUM(COALESCE(r."totalIncome", 0))::int 
            - SUM(COALESCE(r."totalExpenses", 0))::int AS "netIncome",
          now()::date AS "period"
        FROM public."Report" r
        INNER JOIN public."Coop" c 
          ON c.id = r."coopId"
        GROUP BY 
          c.id, 
          r."coopId", 
          c.nik, 
          c."name", 
          date_trunc('month', r."transDate")
        ORDER BY c.nik ASC;
      `;
      }

      return report;
    } catch (error) {
      throw error;
    }
  }
}
