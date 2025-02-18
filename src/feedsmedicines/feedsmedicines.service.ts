import { Injectable } from '@nestjs/common';
import { CreateFeedsmedicineDto } from './dto/create-feedsmedicine.dto';
import { UpdateFeedsmedicineDto } from './dto/update-feedsmedicine.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConsumptionDto } from './dto/consumption.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class FeedsmedicinesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFeedsmedicineDto) {
    try {
      const existingData = await this.prisma.feedsMedicines.findUnique({
        where: { SKU: dto.SKU },
      });
      if (existingData) {
        throw new Error(
          'SKU sudah ada pada kami, jika ingin update silahkan masuk ke menu update',
        );
      } else {
        const dt = {
          SKU: dto.SKU,
          coopId: dto.coopId,
          name: dto.name,
          userId: dto.userId,
          quantity: Number(dto.quantity),
          uom: dto.uom,
          price: Number(dto.price),
          total: Number(dto.quantity) * Number(dto.price),
          isEatable: dto.isEatable ?? false,
          isActive: true,
        };
        return await this.prisma.feedsMedicines.create({ data: dt });
      }
    } catch (error) {
      return error?.message
        ? error.message
        : error?.stack
          ? error.stack
          : error;
    }
  }

  async findAll(coopId?: number) {
    const feeds = await this.prisma.feedsMedicines.findMany({
      where: { isActive: true },
      select: {
        coopId: true,
        name: true,
        SKU: true,
        userId: true,
        quantity: true,
        uom: true,
        price: true,
        total: true,
        coop: {
          select: { name: true },
        },
        id: true,
        isEatable: true,
      },
    });
    const listFeeds = feeds?.map((item) => {
      return {
        id: item.id,
        coopId: item.coopId,
        name: item.name,
        SKU: item.SKU,
        userId: item.userId,
        quantity: item.quantity,
        uom: item.uom,
        price: item.price,
        total: item.total,
        coop_name: item.coop.name,
        isEatable: item.isEatable,
      };
    });
    if (coopId && listFeeds) {
      return listFeeds.filter((x) => x.coopId == Number(coopId));
    }
    return listFeeds;
  }

  async findOne(id: number) {
    const feed = await this.prisma.feedsMedicines.findUnique({
      where: { id },
      select: {
        id: true,
        coopId: true,
        name: true,
        SKU: true,
        userId: true,
        quantity: true,
        uom: true,
        price: true,
        total: true,
        coop: {
          select: { name: true },
        },
      },
    });
    return {
      id: feed.id,
      coopId: feed.coopId,
      name: feed.name,
      SKU: feed.SKU,
      userId: feed.userId,
      quantity: feed.quantity,
      uom: feed.uom,
      price: feed.price,
      total: feed.total,
      coop_name: feed.coop.name,
    };
  }

  update(id: number, dto: UpdateFeedsmedicineDto) {
    try {
      return this.prisma.feedsMedicines.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      return error?.message
        ? error.message
        : error?.stack
          ? error.stack
          : error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.feedsMedicines.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error) {}
  }

  async getReport(start_date?: Date, end_date?: Date, coop_id?: number) {
    try {
      if (!start_date && !end_date) {
        return await this.prisma.$queryRaw`select  
                      fm."SKU" as sku, 
                      u."name" pic, 
                      (cd."transDate" AT TIME ZONE 'Asia/Jakarta')::date as transaction_date,
                      fm."name" as medicine,
                      'KREDIT' as tipe, 
                      cd.dose as qty, 
                      cd.dose * fm.price as total,
                      cd."coopId",
                      cd."name" as coop_name
                    from "HistoryFeedsMedicines" hfm
                      join "CoopDiagnostics" cd on hfm."coopDiagnosticsId" = cd.id 
                      join "Coop" c on cd."coopId" = c.id 
                      join "Users" u on cd."reporterId"=u.id 
                      join "FeedsMedicines" fm on cd."medicineId" = fm.id
                    where cd."coopId" = ${Number(coop_id)}
                    group by fm."SKU",cd."transDate", c.nik, u."name", fm."name", cd.dose, fm.price, cd."coopId"`;
      }
      return await this.prisma.$queryRaw`select  
                    fm."SKU" as sku, 
                    u."name" pic, 
                    (cd."transDate" AT TIME ZONE 'Asia/Jakarta')::date as transaction_date,
                    fm."name" as medicine,
                    'KREDIT' as tipe, 
                    cd.dose as qty, 
                    cd.dose * fm.price as total,
                    cd."coopId",
                    cd."name" as coop_name
                  from "HistoryFeedsMedicines" hfm
                    join "CoopDiagnostics" cd on hfm."coopDiagnosticsId" = cd.id 
                    join "Coop" c on cd."coopId" = c.id 
                    join "Users" u on cd."reporterId"=u.id 
                    join "FeedsMedicines" fm on cd."medicineId" = fm.id
                  where (cd."transDate" AT TIME ZONE 'GMT')::date>=CAST(${dayjs(start_date).utc().format('YYYY-MM-DD')} as DATE) 
                  and (cd."transDate" AT TIME ZONE 'GMT')::date<=CAST(${dayjs(end_date).utc().format('YYYY-MM-DD')} as DATE) 
                  and cd."coopId" = ${parseInt(coop_id.toString())} 
                  group by fm."SKU",cd."transDate", c.nik, u."name", fm."name", cd.dose, fm.price, cd."coopId"`;
    } catch (error) {
      throw error;
    }
  }

  async getDropdownPakan(coopId?: number) {
    const feeds = await this.prisma.feedsMedicines.findMany({
      where: { isEatable: true },
      select: {
        coopId: true,
        name: true,
        quantity: true,
        id: true,
      },
    });
    const listFeeds = feeds?.map((item) => {
      return {
        id: item.id,
        coopId: item.coopId,
        name: item.name,
        quantity: item.quantity,
      };
    });
    if (coopId && listFeeds) {
      return listFeeds.filter((x) => x.coopId == coopId);
    }
    return listFeeds;
  }

  async consumption(consumptionDto: ConsumptionDto) {
    return await this.prisma.historyFeedsMedicines.create({
      data: {
        transDate: consumptionDto.transDate,
        //feedId: consumptionDto.feedId,
        quantity: consumptionDto.total,
        coopId: consumptionDto.coopId,
        feed: {
          connect: { id: consumptionDto.feedId },
        },
        tipe: 'KREDIT',
      },
    });
  }
}
