import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import { ParamGetAllData } from 'src/egg/dto/ParamsGetAllData.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

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

  create(createDashboardDto: CreateDashboardDto) {
    return 'This action adds a new dashboard';
  }

  findAll() {
    return `This action returns all dashboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  update(id: number, updateDashboardDto: UpdateDashboardDto) {
    return `This action updates a #${id} dashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
