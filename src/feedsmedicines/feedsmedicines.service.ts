import { Injectable } from '@nestjs/common';
import { CreateFeedsmedicineDto } from './dto/create-feedsmedicine.dto';
import { UpdateFeedsmedicineDto } from './dto/update-feedsmedicine.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';

@Injectable()
export class FeedsmedicinesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateFeedsmedicineDto) {
    const dt = {
      SKU: dto.SKU,
      coopId: dto.coopId,
      name: dto.name,
      userId: dto.userId,
      quantity: dto.quantity,
      uom: dto.uom,
      price: dto.price,
      total: dto.total,
    };
    return this.prisma.feedsMedicines.create({ data: dt });
  }

  async findAll() {
    const feeds = await this.prisma.feedsMedicines.findMany({
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
      },
    });
    return feeds?.map((item) => {
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
      };
    });
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
    return this.prisma.coop.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return await this.prisma.feedsMedicines.delete({
      where: { id },
    });
  }

  async getReport(
    start_date: Date = new Date(),
    end_date: Date = new Date(),
    coop_id: number = 1,
  ) {
    const feed = await this.prisma.$queryRaw`select  
                  fm."SKU" as sku, 
                  u."name" pic, 
                  (cd."transDate" AT TIME ZONE 'Asia/Jakarta')::date as transaction_date,
                  fm."name" as medicine,
                  'KREDIT' as tipe, 
                  cd.dose as qty, 
                  cd.dose * fm.price as total
                from "HistoryFeedsMedicines" hfm
                  join "CoopDiagnostics" cd on hfm."coopDiagnosticsId" = cd.id 
                  join "Coop" c on cd."coopId" = c.id 
                  join "Users" u on cd."reporterId"=u.id 
                  join "FeedsMedicines" fm on cd."medicineId" = fm.id
                where (cd."transDate" AT TIME ZONE 'GMT')::date>=CAST(${dayjs(start_date).utc().format('YYYY-MM-DD')} as DATE) 
                and (cd."transDate" AT TIME ZONE 'GMT')::date<=CAST(${dayjs(end_date).utc().format('YYYY-MM-DD')} as DATE) 
                and cd."coopId" = ${parseInt(coop_id.toString())} 
                group by fm."SKU",cd."transDate", c.nik, u."name", fm."name", cd.dose, fm.price`;
    return feed;
  }
}
