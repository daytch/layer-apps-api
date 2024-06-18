import { Injectable } from '@nestjs/common';
import { CreateCashflowDto } from './dto/create-cashflow.dto';
import { UpdateCashflowDto } from './dto/update-cashflow.dto';
import { PrismaService } from '../prisma/prisma.service';
import { IPayload } from 'src/auth/auth.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Jakarta');

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
}
