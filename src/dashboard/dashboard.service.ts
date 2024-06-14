import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import { ParamGetAllData } from 'src/egg/dto/ParamsGetAllData.dto';
import { CashflowService } from 'src/cashflow/cashflow.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cashflow: CashflowService,
  ) {}

  async FCRChart(params: ParamGetAllData) {
    try {
      const periodStart = params.period
        ? dayjs(params.period).startOf('month').add(1, 'day')
        : dayjs().startOf('month').add(1, 'day');
      const periodEnd = params.period
        ? dayjs(params.period).endOf('month')
        : dayjs().endOf('month');

      const where = {
        coopId: Number(params.coopId),
        transDate: {
          gte: periodStart.toISOString(),
          lte: periodEnd.toISOString(),
        },
      };

      const data = await this.prisma.eggProduction.groupBy({
        by: ['transDate'],
        _sum: {
          FCR: true,
        },
        where,
      });

      return data.map((item) => {
        return {
          transDate: item.transDate,
          FCR: Number(item._sum.FCR) || 0,
        };
      });
    } catch (error) {
      console.error('Error in FCRChart:', error);
      throw error;
    }
  }

  async getAllData() {
    const { total_debit, total_credit } =
      await this.cashflow.getTotalDebitCredit();
    const users = await this.prisma.users.findMany({
      select: {
        id: true,
        name: true,
        role: {
          select: { name: true },
        },
      },
    });
    debugger;

    return { total: total_debit - total_credit, total_debit, total_credit };
  }
}
