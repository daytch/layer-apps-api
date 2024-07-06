import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDiagnosticDto } from './dto/create-diagnostic.dto';
import { UpdateDiagnosticDto } from './dto/update-diagnostic.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Jakarta');

@Injectable()
export class DiagnosticService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDiagnosticDto: CreateDiagnosticDto) {
    const result = await this.prisma.coopDiagnostics.create({
      data: {
        ...createDiagnosticDto,
        transDate: dayjs(createDiagnosticDto.transDate).tz('UTC').toDate(),
      },
    });
    const users = await this.prisma.users.findMany({
      select: { id: true },
      where: { role: { name: { in: ['Admin', 'Superadmin'] } } },
    });
    const datas = [];
    users.forEach((id) => {
      datas.push({
        message: 'Membuat laporan Diagnosis Kandang',
        reporter: createDiagnosticDto.reporterId.toString(),
        isRead: false,
        listenerId: id.id,
      });
    });
    await this.prisma.notification.createMany({
      data: datas,
    });
    return result;
  }

  async findAll(from: string, to: string, userId: number) {
    let where = '';
    if (from && to) {
      where = `where cd."transDate" between '${from}' and '${to}' AND u."id"=${userId}`;
    }
    if (userId > 0 && userId) {
      where = where
        ? `${where} and u."id"=${userId}`
        : `where u."id"=${userId}`;
    }

    if (!where) {
      where = `where cd."transDate" between '${dayjs().startOf('month').add(1, 'day')}' and '${dayjs().endOf('month')}'`;
    }
    return await this.prisma
      .$queryRawUnsafe(`select cd."id", cd."coopId", c."nik", c.id as coop_id, c."name" as coop_name, u."name" as reporter, cd."transDate" as trans_date, cd."disease",
      fm."name" as medicine, cd."dose", cd."status" as progres
      from "CoopDiagnostics" cd 
      inner join "Coop" c on cd."coopId"=c."id"
      inner join "Users" u on u."id"=cd."reporterId"
    left join "FeedsMedicines" fm on cd."medicineId"=fm."id" ${where}`);
  }

  async update(id: number, updateDiagnosticDto: UpdateDiagnosticDto) {
    const report = await this.prisma.coopDiagnostics.count({ where: { id } });
    if (report === 0) {
      throw new BadRequestException('Something went wrong', {
        cause: new Error(),
        description: 'Laporan tidak ditemukan.',
      });
    }
    const result = await this.prisma.coopDiagnostics.update({
      where: { id },
      data: {
        medicineId: updateDiagnosticDto.medicineId,
        dose: updateDiagnosticDto.dose,
        status: updateDiagnosticDto.status,
      },
    });

    // history feed and medicine
    if (updateDiagnosticDto.medicineId) {
      const medicine = await this.prisma.feedsMedicines.findUnique({
        where: { id: updateDiagnosticDto.medicineId },
      });
      if (!medicine) {
        throw new BadRequestException('Something went wrong', {
          cause: new Error(),
          description: 'Obat tidak terdaftar.',
        });
      }
      if (medicine.quantity < updateDiagnosticDto.dose) {
        throw new BadRequestException('Something went wrong', {
          cause: new Error(),
          description: 'Stok obat tidak mencukupi.',
        });
      }
      // substract total food and medicines
      await this.prisma.feedsMedicines.update({
        where: { id: updateDiagnosticDto.medicineId },
        data: { quantity: { decrement: updateDiagnosticDto.dose } },
      });

      await this.prisma.historyFeedsMedicines.create({
        data: {
          quantity: updateDiagnosticDto.dose,
          feedId: updateDiagnosticDto.medicineId,
          tipe: 'medicine',
          transDate: dayjs().utc().toDate(),
          coopDiagnosticsId: id,
        },
      });
    }

    const users = await this.prisma.users.findMany({
      select: { id: true },
      where: { role: { name: { in: ['Admin', 'Superadmin'] } } },
    });
    const datas = [];
    users.forEach((id) => {
      datas.push({
        message: 'Update laporan Diagnosis Kandang',
        reporter: updateDiagnosticDto.reporter,
        isRead: false,
        listenerId: id.id,
      });
    });
    await this.prisma.notification.createMany({
      data: datas,
    });
    return result;
  }

  async remove(id: number) {
    return await this.prisma.coopDiagnostics.delete({ where: { id } });
  }
}
