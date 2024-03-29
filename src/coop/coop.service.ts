import { Injectable } from '@nestjs/common';
import { CreateCoopDto } from './dto/create-coop.dto';
import { UpdateCoopDto } from './dto/update-coop.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoopService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCoopDto: CreateCoopDto) {
    return this.prisma.coop.create({ data: createCoopDto });
  }

  findAll() {
    return this.prisma.coop.findMany();
  }

  findOne(id: number) {
    return this.prisma.coop.findUnique({ where: { id } });
  }

  update(id: number, updateCoopDto: UpdateCoopDto) {
    return this.prisma.coop.update({
      where: { id },
      data: updateCoopDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.coop.delete({
      where: { id },
    });
  }
}
