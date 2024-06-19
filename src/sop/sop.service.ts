import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSopDto } from './dto/create-sop.dto';
import { UpdateSopDto } from './dto/update-sop.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteDto } from './dto/complete-sop.dto';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { IPayload } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('UTC');
//dayjs.tz.setDefault('Asia/Jakarta');

@Injectable()
export class SopService {
  constructor(
    private usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  create(createSopDto: CreateSopDto) {
    return this.prisma.sOP.create({ data: createSopDto });
  }

  async findAll(roleId: string) {
    const listSOP: any = roleId
      ? await this.prisma.sOP.findMany({
          where: {
            roleId: Number(roleId),
          },
        })
      : await this.prisma.sOP.findMany();
    return listSOP;
  }

  findOne(id: number) {
    return this.prisma.sOP.findUnique({ where: { id } });
  }

  update(id: number, updateSopDto: UpdateSopDto) {
    return this.prisma.sOP.update({
      where: { id },
      data: updateSopDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.sOP.delete({
      where: { id },
    });
  }

  async complete(completeDto: CompleteDto) {
    try {
      if (!completeDto.sopId || !completeDto.userId) {
        return 'SOP Id and User Id is mandatory';
      }
      const progress: { id: number; detail: any }[] = await this.prisma
        .$queryRaw`select ps."id", ps."detail" from "ProgressSOP" ps where CAST(ps."createdAt" as DATE)=CAST(${dayjs().utc().format('YYYY-MM-DD')} as DATE) and ps."userId"=${completeDto.userId}`;

      const detail = progress.length > 0 ? progress[0].detail : '';
      if (detail) {
        const sop = await this.prisma.sOP.findUnique({
          where: { id: completeDto.sopId },
        });
        detail[completeDto.sopId] = true;
        console.log(detail);
        this.prisma.progressSOP.update({
          where: { id: progress[0].id },
          data: { detail },
        });
        sop['status'] = true;
        return sop;
      }
      return 'field not found';
    } catch (error) {
      return error;
    }
  }

  async getProgressAllEmployee(roleId: string, date: string) {
    const progress = await this.prisma
      .$queryRawUnsafe(`SELECT u."id", u."name", ps."detail", ps."createdAt" as date
    FROM "ProgressSOP" ps
    inner join "Users" u on ps."userId"=u."id" 
    where u."roleId"=${roleId} and to_char(ps."createdAt",'YYYY-MM-DD') = '${date}'`);

    return progress;
  }

  async getSOPByUser(payload: IPayload) {
    const user = await this.usersService.findOneById(payload.uid);
    if (!user) {
      throw new UnauthorizedException();
    }

    const SOP = await this.prisma.sOP.findMany({
      where: { roleId: user?.roleId },
    });
    const progressSOP = await this.prisma
      .$queryRaw`select ps."id", ps."detail" from "ProgressSOP" ps where (ps."createdAt" AT TIME ZONE 'GMT')::date=CAST(${dayjs().utc().format('YYYY-MM-DD')} as DATE) and ps."userId"=${user.id}`;

    /* await this.prisma.progressSOP.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(),
          lt: new Date(dayjs().utc().add(1, 'day').format('YYYY-MM-DD')),
        },
      },
    }); */
    const detail = progressSOP[0]?.detail;
    return SOP.map((item) => {
      return { ...item, status: detail[item.id] };
    });
  }
}
