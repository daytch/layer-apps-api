import { BadRequestException, Injectable } from '@nestjs/common';
import { CoopService } from 'src/coop/coop.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import * as Excel from 'exceljs';
import { Prisma } from '@prisma/client';
import { greenCol } from 'src/egg/upload';
import { alfaNumeric } from 'src/utils/randomizer.utils';
import { ResponseUpload } from './dto/ResponseUpload.dto';
import { AuthService } from 'src/auth/auth.service';
import { ParamGetAllData } from './dto/ParamsGetAllData.dto';
import { DeleteEggs } from './dto/DeleteEggs.dto';
import { FileUploadDto } from './dto/fileUpload.dto';
import { UpdateEggs } from './dto/UpdateEggs.dto';

export enum EResponseUpload {
  cancel,
  skip,
  replace,
}

export interface IResponseUpload {
  code: string;
  status: EResponseUpload;
}

export interface IEgg {
  coopId: number;
  transDate: Date;
  ageInDay: number;
  ageInWeek: number;
  pop: number;
  m: number;
  afk: number;
  sell: number;
  finalPop: number;
  feedType: string;
  feedWeight: number;
  feedFIT: number;
  prodPieceN: number;
  prodPieceP: number;
  prodPieceBS: number;
  prodTotalPiece: number;
  prodWeightN: number;
  prodWeightP: number;
  prodWeightBS: number;
  prodTotalWeight: number;
  HD: number;
  FCR: number;
  EggWeight: number;
  EggMass: number;
  OVK: number;
}

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

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function getFirstLastDate(tgl: any) {
  const date = new Date(tgl);
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    daysInMonth(date.getMonth() + 1, date.getFullYear()),
  );
  return { firstDay, lastDay };
}

@Injectable()
export class EggService {
  constructor(
    private readonly coopService: CoopService,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {
    prisma.$on('query' as never, (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });
  }

  async findAll(params: ParamGetAllData, req: any) {
    let where = {};

    const user = await this.authService.getProfile(req.user);
    where = { coopId: Number(params?.coopId || user?.coops[0].coopId) };
    console.log(
      dayjs(params.period || '')
        .startOf('month')
        .add(1, 'day'),
    );
    where = {
      ...where,
      transDate: {
        lte: params.period
          ? dayjs(params.period).endOf('month')
          : dayjs().endOf('month'),
        gte: params.period
          ? dayjs(params.period).startOf('month').add(1, 'day')
          : dayjs().startOf('month').add(1, 'day'),
      },
    };

    const eggs = await this.prisma.eggProduction.findMany({ where });
    return eggs;
  }

  async delete(data: DeleteEggs) {
    return this.prisma.eggProduction.deleteMany({
      where: { id: { in: data.ids } },
    });
  }

  async update(data: UpdateEggs[]) {
    try {
      for (let i = 0; i < data.length; i++) {
        await this.prisma.eggProduction.updateMany({
          where: { id: data[i].id },
          data: {
            pop: data[i].pop,
            m: data[i].m,
            afk: data[i].afk,
            sell: data[i].sell,
            finalPop: data[i].finalPop,
            feedType: data[i].feedType,
            feedWeight: data[i].feedWeight,
            feedFIT: data[i].feedFIT,
            prodPieceN: data[i].prodPieceN,
            prodPieceP: data[i].prodPieceP,
            prodPieceBS: data[i].prodPieceBS,
            prodTotalPiece: data[i].prodTotalPiece,
            prodWeightN: data[i].prodPieceN,
            prodWeightP: data[i].prodPieceN,
            prodWeightBS: data[i].prodWeightBS,
            prodTotalWeight: data[i].prodTotalWeight,
            HD: data[i].HD,
            FCR: data[i].FCR,
            EggWeight: data[i].EggWeight,
            EggMass: data[i].EggMass,
            OVK: data[i].OVK,
          },
        });
      }
      return 'data berhasil di update';
    } catch (error) {
      throw error;
    }
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

      const sheet = workBook.getWorksheet('Sheet1');

      const listEggs = await this.prisma.eggProduction.findMany();

      const insertData = [];
      const duplicateData = [];
      const duplicateDate = [];
      let isAnyDuplicate = false;
      let code = '';
      for (let index = 10; index < 500; index++) {
        let data = <IEgg>{};
        const tgl = sheet.getRow(index).getCell(2).value;
        if (tgl) {
          const day = sheet.getRow(index).getCell(3).value;
          const week = sheet.getRow(index).getCell(4).value;
          const pop = sheet.getRow(index).getCell(5).value;
          const m = sheet.getRow(index).getCell(6).value;
          const afk = sheet.getRow(index).getCell(7).value;
          const jual = sheet.getRow(index).getCell(8).value;
          const pop_a = sheet.getRow(index).getCell(9).value;
          const p_jenis = sheet.getRow(index).getCell(10).value;
          const p_kg = sheet.getRow(index).getCell(11).value;
          const p_fit = sheet.getRow(index).getCell(12).value;
          const prod_b_n = sheet.getRow(index).getCell(13).value;
          const prod_b_p = sheet.getRow(index).getCell(14).value;
          const prod_b_b = sheet.getRow(index).getCell(15).value;
          const prod_b_total = sheet.getRow(index).getCell(16).value;
          const prod_k_n = sheet.getRow(index).getCell(17).value;
          const prod_k_p = sheet.getRow(index).getCell(18).value;
          const prod_k_b = sheet.getRow(index).getCell(19).value;
          const prod_k_total = sheet.getRow(index).getCell(20).value;
          const hd = sheet.getRow(index).getCell(21).value;
          const fcr = sheet.getRow(index).getCell(22).value;
          const w = sheet.getRow(index).getCell(23).value;
          const mass = sheet.getRow(index).getCell(24).value;
          const ovk = sheet.getRow(index).getCell(25).value;

          data = {
            coopId: Number(body?.coopId),
            transDate: getValue(tgl, 'date'),
            ageInDay: getValue(day, 'number'),
            ageInWeek: getValue(week, 'number'),
            pop: getValue(pop, 'number'),
            m: getValue(m, 'number'),
            afk: getValue(afk, 'number'),
            sell: getValue(jual, 'number'),
            finalPop: getValue(pop_a, 'number'),
            feedType: getValue(p_jenis, 'string'),
            feedWeight: getValue(p_kg, 'number'),
            feedFIT: getValue(p_fit, 'float'),
            prodPieceN: getValue(prod_b_n, 'number'),
            prodPieceP: getValue(prod_b_p, 'number'),
            prodPieceBS: getValue(prod_b_b, 'number'),
            prodTotalPiece: getValue(prod_b_total, 'number'),
            prodWeightN: getValue(prod_k_n, 'float'),
            prodWeightP: getValue(prod_k_p, 'float'),
            prodWeightBS: getValue(prod_k_b, 'float'),
            prodTotalWeight: getValue(prod_k_total, 'float'),
            HD: getValue(hd, 'float'),
            FCR: getValue(fcr, 'float'),
            EggWeight: getValue(w, 'float'),
            EggMass: getValue(mass, 'float'),
            OVK: getValue(ovk, 'float'),
          };
          const activeData = listEggs.filter((egg) => {
            return (
              egg.coopId === data.coopId &&
              dayjs(egg.transDate).isSame(dayjs(data.transDate)) &&
              egg.ageInDay === data.ageInDay
            );
          });

          if (activeData.length > 0 || isAnyDuplicate) {
            code = code || alfaNumeric(8);
            isAnyDuplicate = true;
            duplicateDate.push(dayjs(data.transDate).format('DD MMM YYYY'));
            duplicateData.push({
              ...data,
              isDuplicate: activeData.length > 0,
              code,
            });
          } else {
            insertData.push(data);
          }
        } else {
          break;
        }
      }
      if (insertData.length > 0) {
        await this.prisma.eggProduction.createMany({ data: insertData });
        return {
          message: 'Import data produksi telur berhasil.',
          isAnyDuplicate,
          duplicateDate,
          code,
        };
      } else {
        await this.prisma.eggProductionTemp.createMany({ data: duplicateData });
        return {
          message: 'Ada duplikasi data',
          isAnyDuplicate,
          duplicateDate,
          code,
        };
      }
    } catch (error) {
      console.log('error: ', error);
      throw error;
    }
  }

  async download(coopId: number, date: string): Promise<any> {
    try {
      const { firstDay, lastDay } = getFirstLastDate(date);
      const eggs = await this.prisma.eggProduction.findMany({
        where: {
          coopId,
          transDate: { lte: lastDay, gte: firstDay },
        },
        orderBy: { id: 'asc' },
      });
      const listCoop = await this.coopService.findAll();
      const coop = await this.coopService.findOne(coopId);

      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('Sheet1');
      const coopSheet = wb.addWorksheet('Kandang');

      ws.mergeCells('B2:Y2');
      ws.getCell('B2').value = 'CATATAN HARIAN TELUR';
      ws.getCell('B2').alignment = { horizontal: 'center' };
      ws.getCell('B2').font = { bold: true };

      ws.getCell('B3').value = 'FARM';
      ws.getCell('C3').value = ':';
      ws.mergeCells('D3:F3');
      ws.getCell('D3').value = 'COKRO FARM';
      ws.getCell('B3').font = { bold: true };
      ws.getCell('B3').border = { bottom: { style: 'thin' } };
      ws.getCell('C3').font = { bold: true };
      ws.getCell('C3').border = { bottom: { style: 'thin' } };
      ws.getCell('D3').font = { bold: true };
      ws.getCell('D3').border = { bottom: { style: 'thin' } };
      ws.getCell('D3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
      };

      ws.getCell('B4').value = 'KANDANG';
      ws.getCell('C4').value = ':';
      ws.mergeCells('D4:F4');
      ws.getCell('D4').value = coop.name;
      ws.getCell('B4').font = { bold: true };
      ws.getCell('B4').border = { bottom: { style: 'thin' } };

      ws.getCell('C4').font = { bold: true };
      ws.getCell('C4').border = { bottom: { style: 'thin' } };
      ws.getCell('D4').font = { bold: true };
      ws.getCell('D4').border = { bottom: { style: 'thin' } };
      ws.getCell('E4').font = { bold: true };
      ws.getCell('E4').border = { bottom: { style: 'thin' } };
      ws.getCell('F4').font = { bold: true };
      ws.getCell('F4').border = { bottom: { style: 'thin' } };
      ws.getCell('D4').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
      };

      ws.getCell('B5').value = 'POPULASI';
      ws.getCell('C5').value = ':';
      ws.mergeCells('D5:F5');
      ws.getCell('B5').font = { bold: true };
      ws.getCell('B5').border = { bottom: { style: 'thin' } };
      ws.getCell('C5').font = { bold: true };
      ws.getCell('C5').border = { bottom: { style: 'thin' } };
      ws.getCell('D5').font = { bold: true };
      ws.getCell('D5').border = { bottom: { style: 'thin' } };
      ws.getCell('E5').font = { bold: true };
      ws.getCell('E5').border = { bottom: { style: 'thin' } };
      ws.getCell('F5').font = { bold: true };
      ws.getCell('F5').border = { bottom: { style: 'thin' } };
      ws.getCell('D5').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
      };

      ws.mergeCells('U3:V3');
      ws.getCell('U3').value = 'Tanggal Chik In';
      ws.getCell('W3').value = ':';
      ws.getCell('U3').font = { bold: true };
      ws.getCell('U3').border = { bottom: { style: 'thin' } };
      ws.getCell('V3').font = { bold: true };
      ws.getCell('V3').border = { bottom: { style: 'thin' } };
      ws.getCell('W3').font = { bold: true };
      ws.getCell('W3').border = { bottom: { style: 'thin' } };
      ws.getCell('X3').font = { bold: true };
      ws.getCell('X3').border = { bottom: { style: 'thin' } };
      ws.getCell('Y3').font = { bold: true };
      ws.getCell('Y3').border = { bottom: { style: 'thin' } };

      ws.mergeCells('X3:Y3');
      ws.getCell('X3').value = new Date(date);
      ws.getCell('X3').numFmt = 'dd-mmm';
      ws.getCell('X3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
      };

      ws.getCell('U4').value = 'STRAIN';
      ws.getCell('W4').value = ':';
      ws.getCell('U4').font = { bold: true };
      ws.getCell('U4').border = { bottom: { style: 'thin' } };
      ws.getCell('V4').font = { bold: true };
      ws.getCell('V4').border = { bottom: { style: 'thin' } };
      ws.getCell('W4').font = { bold: true };
      ws.getCell('W4').border = { bottom: { style: 'thin' } };
      ws.getCell('X4').font = { bold: true };
      ws.getCell('X4').border = { bottom: { style: 'thin' } };
      ws.getCell('Y4').font = { bold: true };
      ws.getCell('Y4').border = { bottom: { style: 'thin' } };

      /*Column headers*/
      ws.getRow(7).values = [
        '',
        'Tanggal',
        'Umur (hr)',
        'Umur Mgg',
        'Pop',
        'M',
        'Afk',
        'Jual',
        'Pop Akhir',
        'Jenis', //pakan
        'KG',
        'FIT (gr/Ek)',
        'N', // BUTIR
        'P',
        'BS',
        'Total Btr',
        'N', // Kg
        'P',
        'BS',
        'Total Kg',
        'HD',
        'FCR',
        'Egg Weight (Gr/Btr)',
        'Egg Mass (Kg Telur/1000Ek)',
        'OVK',
      ];
      ws.columns = [
        {},
        {
          key: 'transDate',
          alignment: { horizontal: 'center' },
          width: 9.67,
          style: { numFmt: 'dd-mmm' },
        },
        { key: 'ageInDay', alignment: { horizontal: 'center' }, width: 5.33 },
        { key: 'ageInWeek', alignment: { horizontal: 'center' }, width: 5.33 },
        { key: 'pop', alignment: { horizontal: 'center' }, width: 7.83 },
        { key: 'm', alignment: { horizontal: 'center' }, width: 5.8 },
        { key: 'afk', alignment: { horizontal: 'center' }, width: 5.8 },
        { key: 'sell', alignment: { horizontal: 'center' }, width: 5.8 },
        { key: 'finalPop', alignment: { horizontal: 'center' }, width: 6.5 },
        { key: 'feedType', alignment: { horizontal: 'center' }, width: 8.67 },
        { key: 'feedWeight', alignment: { horizontal: 'center' }, width: 7.17 },
        { key: 'feedFIT', alignment: { horizontal: 'center' }, width: 6.67 },
        { key: 'prodPieceN', alignment: { horizontal: 'center' }, width: 5.8 },
        { key: 'prodPieceP', alignment: { horizontal: 'center' }, width: 5.8 },
        {
          key: 'prodPieceBS',
          alignment: { horizontal: 'center' },
          width: 5.8,
        },
        {
          key: 'prodTotalPiece',
          alignment: { horizontal: 'center' },
          width: 7.5,
        },
        {
          key: 'prodWeightN',
          alignment: { horizontal: 'center' },
          width: 5.8,
        },
        {
          key: 'prodWeightP',
          alignment: { horizontal: 'center' },
          width: 5.8,
        },
        {
          key: 'prodWeightBS',
          alignment: { horizontal: 'center' },
          width: 5.8,
        },
        {
          key: 'prodTotalWeight',
          alignment: { horizontal: 'center' },
          width: 7.5,
        },
        { key: 'HD', alignment: { horizontal: 'center' }, width: 8.5 },
        { key: 'FCR', alignment: { horizontal: 'center' }, width: 8.5 },
        {
          key: 'EggWeight',
          alignment: { horizontal: 'center' },
          width: 8.5,
        },
        {
          key: 'EggMass',
          alignment: { horizontal: 'center' },
          width: 8.5,
        },
        { key: 'OVK', alignment: { horizontal: 'center' }, width: 8.5 },
      ];
      ws.getCell('B7:B9').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FBDECD' },
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
      ws.mergeCells('B7:B9');

      ws.getCell('C7:C9').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FBDECD' },
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
      ws.mergeCells('C7:C9');

      ws.getCell('D7:D9').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FBDECD' },
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
      ws.mergeCells('D7:D9');

      ws.getCell('E7:E9').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FBDECD' },
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
      ws.mergeCells('E7:E9');

      ws.getCell('F7:F9').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FBDECD' },
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
      ws.mergeCells('F7:F9');

      ws.getCell('G7:G9').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FBDECD' },
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
      ws.mergeCells('G7:G9');

      ws.getCell('H7:H9').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FBDECD' },
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
      ws.mergeCells('H7:H9');

      ws.getCell('I7:I9').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FBDECD' },
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
      ws.mergeCells('I7:I9');

      ws.getCell('J8').value = 'Jenis';
      ws.getCell('J8').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF1C1' },
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
      ws.mergeCells('J8:J9');

      ws.getCell('K8').value = 'KG';
      ws.getCell('K8').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF1C1' },
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
      ws.mergeCells('K8:K9');

      ws.getCell('L8').value = 'FIT (gr/Ek)';
      ws.getCell('L8').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF1C1' },
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
      ws.mergeCells('L8:L9');

      ws.getCell('M9').value = 'N';
      ws.getCell('M9').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D6E5F5' },
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
      ws.getCell('N9').value = 'P';
      ws.getCell('N9').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D6E5F5' },
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
      ws.getCell('O9').value = 'BS';
      ws.getCell('O9').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D6E5F5' },
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
      ws.getCell('P9').value = 'Total Btr';
      ws.getCell('P9').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D6E5F5' },
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

      ws.getCell('Q9').value = 'N';
      ws.getCell('Q9').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D6E5F5' },
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
      ws.getCell('R9').value = 'P';
      ws.getCell('R9').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D6E5F5' },
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
      ws.getCell('S9').value = 'BS';
      ws.getCell('S9').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D6E5F5' },
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
      ws.getCell('T9').value = 'Total Kg';
      ws.getCell('T9').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D6E5F5' },
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

      ws.getCell('U7').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'E9E9E9' },
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
      ws.mergeCells('U7:U9');

      ws.getCell('V7').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'E9E9E9' },
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
      ws.mergeCells('V7:V9');

      ws.getCell('W7').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'E9E9E9' },
        },
        font: { bold: true, size: 9 },
        alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
        border: {
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          top: { style: 'thin' },
        },
      };
      ws.mergeCells('W7:W9');

      ws.getCell('X7').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'E9E9E9' },
        },
        font: { bold: true, size: 8 },
        alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
        border: {
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          top: { style: 'thin' },
        },
      };
      ws.mergeCells('X7:X9');

      ws.getCell('Y7').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'E9E9E9' },
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
      ws.mergeCells('Y7:Y9');

      // Custom Header
      ws.getCell('J7').value = 'Pakan';
      ws.getCell('J7').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF1C1' },
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
      ws.mergeCells('J7:L7');

      ws.getCell('M7').value = 'Prod';
      ws.getCell('M7').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D6E5F5' },
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
      ws.mergeCells('M7:T7');

      ws.getCell('M8').value = 'Btr';
      ws.getCell('M8').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D6E5F5' },
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
      ws.mergeCells('M8:P8');

      ws.getCell('Q8').value = 'Kg';
      ws.getCell('Q8').style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D6E5F5' },
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
      ws.mergeCells('Q8:T8');

      ws.getCell('AC4').value = 'List Kandang';
      ws.columns = [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {
          key: 'list_coop',
          alignment: { horizontal: 'center' },
          width: 9.67,
        },
      ];
      eggs.forEach((item) => {
        ws.addRow({
          coopId: item.coopId,
          transDate: item.transDate,
          ageInDay: item.ageInDay,
          ageInWeek: item.ageInWeek,
          pop: item.pop ?? '',
          m: item.m ?? '',
          afk: item.afk ?? '',
          sell: item.sell ?? '',
          finalPop: item.finalPop ?? '',
          feedType: item.feedType ?? '',
          feedWeight: item.feedWeight ?? '',
          feedFIT: item.feedFIT ? Number(item.feedFIT) : '',
          prodPieceN: item.prodPieceN ?? '',
          prodPieceP: item.prodPieceP ?? '',
          prodPieceBS: item.prodPieceBS ?? '',
          prodTotalPiece: item.prodTotalPiece ?? '',
          prodWeightN: item.prodWeightN ? Number(item.prodWeightN) : '',
          prodWeightP: item.prodWeightP ? Number(item.prodWeightP) : '',
          prodWeightBS: item.prodWeightBS ? Number(item.prodWeightBS) : '',
          prodTotalWeight: item.prodTotalWeight
            ? Number(item.prodTotalWeight)
            : '',
          HD: item.HD ? Number(item.HD) : '',
          FCR: item.FCR ? Number(item.FCR) : '',
          EggWeight: item.EggWeight ? Number(item.EggWeight) : '',
          EggMass: item.EggMass ? Number(item.EggMass) : '',
          OVK: item.OVK ? Number(item.OVK) : '',
        });
      });

      listCoop.forEach((item) => {
        ws.addRow({ list_coop: item.name });
      });

      let lastMergedCell = 10;
      for (let index = 10; index < eggs.length + 10; index++) {
        let blueCell = 0;
        for (let idxCol = 2; idxCol <= 25; idxCol++) {
          const { address } = ws.getRow(index).getCell(idxCol);
          if (greenCol.indexOf(address[0]) > -1) {
            ws.getRow(index).getCell(idxCol).style = {
              ...ws.getRow(index).getCell(idxCol).style,
              fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'BBDAA5' },
              },
              border: {
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' },
                top: { style: 'thin' },
              },
            };
          } else if (idxCol === 2) {
            ws.getRow(index).getCell(idxCol).style = {
              ...ws.getRow(index).getCell(idxCol).style,
              alignment: {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true,
              },
              border: {
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' },
                top: { style: 'thin' },
              },
            };
          } else {
            ws.getRow(index).getCell(idxCol).style = {
              alignment: {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true,
              },
              border: {
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' },
                top: { style: 'thin' },
              },
            };
          }
          if (
            Number(ws.getRow(index).getCell(3).value) % 7 === 0 &&
            index >= lastMergedCell
          ) {
            blueCell = index;
            ws.mergeCells(`D${lastMergedCell}:D${index}`);
            lastMergedCell = index + 1;
          }
          if (blueCell === index) {
            ws.getRow(index).getCell(idxCol).style = {
              ...ws.getRow(index).getCell(idxCol).style,
              fill: {
                pattern: 'solid',
                type: 'pattern',
                fgColor: { argb: '159FE9' },
              },
            };
          }
          if (idxCol > 20) ws.getColumn(idxCol).width = 8.5;
        }
      }

      const buffer = await wb.xlsx.writeBuffer();
      return buffer;
    } catch (error) {
      throw error;
    }
  }

  async confirm(respUpload: ResponseUpload) {
    try {
      switch (respUpload.status) {
        case EResponseUpload.cancel:
          await this.prisma.eggProductionTemp.deleteMany({
            where: { code: respUpload.code },
          });
          break;
        case EResponseUpload.replace:
          const dupData = await this.prisma.eggProductionTemp.findMany({
            where: { code: respUpload.code, isDuplicate: true },
          });

          for (let i = 0; i < dupData.length; i++) {
            await this.prisma.eggProduction.updateMany({
              where: {
                transDate: dupData[i].transDate,
                coopId: dupData[i].coopId,
              },
              data: {
                pop: dupData[i].pop,
                m: dupData[i].m,
                afk: dupData[i].afk,
                sell: dupData[i].sell,
                finalPop: dupData[i].finalPop,
                feedType: dupData[i].feedType,
                feedWeight: dupData[i].feedWeight,
                feedFIT: dupData[i].feedFIT,
                prodPieceN: dupData[i].prodPieceN,
                prodPieceP: dupData[i].prodPieceP,
                prodPieceBS: dupData[i].prodPieceBS,
                prodTotalPiece: dupData[i].prodTotalPiece,
                prodWeightN: dupData[i].prodPieceN,
                prodWeightP: dupData[i].prodPieceN,
                prodWeightBS: dupData[i].prodWeightBS,
                prodTotalWeight: dupData[i].prodTotalWeight,
                HD: dupData[i].HD,
                FCR: dupData[i].FCR,
                EggWeight: dupData[i].EggWeight,
                EggMass: dupData[i].EggMass,
                OVK: dupData[i].OVK,
              },
            });
          }

          await this.prisma.eggProductionTemp.deleteMany({
            where: { code: respUpload.code },
          });
          break;
        case EResponseUpload.skip:
          const newData = await this.prisma.eggProductionTemp.findMany({
            where: { code: respUpload.code, isDuplicate: false },
          });

          for (let i = 0; i < newData.length; i++) {
            await this.prisma.eggProduction.updateMany({
              where: {
                transDate: newData[i].transDate,
                coopId: newData[i].coopId,
              },
              data: {
                pop: dupData[i].pop,
                m: dupData[i].m,
                afk: dupData[i].afk,
                sell: dupData[i].sell,
                finalPop: dupData[i].finalPop,
                feedType: dupData[i].feedType,
                feedWeight: dupData[i].feedWeight,
                feedFIT: dupData[i].feedFIT,
                prodPieceN: dupData[i].prodPieceN,
                prodPieceP: dupData[i].prodPieceP,
                prodPieceBS: dupData[i].prodPieceBS,
                prodTotalPiece: dupData[i].prodTotalPiece,
                prodWeightN: dupData[i].prodPieceN,
                prodWeightP: dupData[i].prodPieceN,
                prodWeightBS: dupData[i].prodWeightBS,
                prodTotalWeight: dupData[i].prodTotalWeight,
                HD: dupData[i].HD,
                FCR: dupData[i].FCR,
                EggWeight: dupData[i].EggWeight,
                EggMass: dupData[i].EggMass,
                OVK: dupData[i].OVK,
              },
            });
          }

          await this.prisma.eggProductionTemp.deleteMany({
            where: { code: respUpload.code },
          });
          break;

        default:
          break;
      }
      return { message: 'Data telah berhasil disimpan.' };
    } catch (error) {}
  }
}
