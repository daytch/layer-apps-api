import { Injectable } from '@nestjs/common';
import { CreateCoopDto } from './dto/create-coop.dto';
import { UpdateCoopDto } from './dto/update-coop.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Coop } from '@prisma/client';

@Injectable()
export class CoopService {
  constructor(private readonly prisma: PrismaService) {}

  generateNIK = (total: number, code: string) => {
    return `${total + 1}CK${code}`;
  };

  async create(createCoopDto: CreateCoopDto) {
    const coops = await this.prisma.$queryRaw<Coop[]>`SELECT * FROM "Coop"`;

    const dt = {
      nik: this.generateNIK(coops.length, createCoopDto.code),
      name: createCoopDto.name,
      address: createCoopDto.address,
    };
    return this.prisma.coop.create({ data: dt });
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
