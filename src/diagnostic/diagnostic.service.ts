import { Injectable } from '@nestjs/common';
import { CreateDiagnosticDto } from './dto/create-diagnostic.dto';
import { UpdateDiagnosticDto } from './dto/update-diagnostic.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';

@Injectable()
export class DiagnosticService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDiagnosticDto: CreateDiagnosticDto) {
    return this.prisma.coopDiagnostics.create({
      data: {
        ...createDiagnosticDto,
        transDate: new Date(createDiagnosticDto.transDate),
      },
    });
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
      .$queryRawUnsafe(`select cd."id", c."nik" as id_kandang, c."name" as kandang, u."name" as pelapor, cd."transDate" as tanggal, cd."disease" as penyakit,
    fm."name" as obat, cd."dose" as dosis, cd."status" as progres
    from "CoopDiagnostics" cd 
    inner join "Coop" c on cd."coopId"=c."id"
    inner join "UserCoop" uc on c."id"=uc."coopId"
    inner join "Users" u on u."id"=uc."userId"
    left join "FeedsMedicines" fm on cd."medicineId"=fm."id" ${where}`);
  }

  update(id: number, updateDiagnosticDto: UpdateDiagnosticDto) {
    return this.prisma.coopDiagnostics.update({
      where: { id },
      data: updateDiagnosticDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.coopDiagnostics.delete({ where: { id } });
  }
}
