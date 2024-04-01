import { Injectable } from '@nestjs/common';
import { CreateSopDto } from './dto/create-sop.dto';
import { UpdateSopDto } from './dto/update-sop.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteDto } from './dto/complete-sop.dto';
import { ProgressSOP } from '@prisma/client';
import dayjs from 'dayjs';

@Injectable()
export class SopService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSopDto: CreateSopDto) {
    return this.prisma.sOP.create({ data: createSopDto });
  }

  async findAll() {
    const listSOP: any = await this.prisma.sOP.findMany();
    return listSOP;
  }

  findOne(id: number) {
    return this.prisma.sOP.findUnique({ where: { id } });
  }

  findByRoleId(roleId: number) {
    return this.prisma.sOP.findMany({
      where: {
        roleId,
      },
    });
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
    const progress = await this.prisma.progressSOP.findMany({
      where: {
        userId: completeDto.userId,
        createdAt: { gte: new Date() },
      },
    });
    const detail = progress.length > 0 ? progress[0].detail : '';
    if (detail) {
      detail[completeDto.sopId] = true;
      console.log(detail);
      return this.prisma.progressSOP.update({
        where: { id: progress[0].id },
        data: { detail },
      });
    }
    return 'field not found';
  }
}
