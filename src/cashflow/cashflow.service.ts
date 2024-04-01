import { Injectable } from '@nestjs/common';
import { CreateCashflowDto } from './dto/create-cashflow.dto';
import { UpdateCashflowDto } from './dto/update-cashflow.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CashflowService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCashflowDto: CreateCashflowDto) {
    return this.prisma.cashflow.create({ data: createCashflowDto });
  }

  findAll() {
    return this.prisma.cashflow.findMany({
      select: {
        id: true,
        periode: true,
        trans_date: true,
        tipe: true,
        nominal: true,
        total: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.cashflow.findUnique({ where: { id } });
  }

  update(id: number, updateCashflowDto: UpdateCashflowDto) {
    return this.prisma.cashflow.update({
      where: { id },
      data: updateCashflowDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.cashflow.delete({
      where: { id },
    });
  }
}
