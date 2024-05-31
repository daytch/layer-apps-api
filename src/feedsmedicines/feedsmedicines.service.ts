import { Injectable } from '@nestjs/common';
import { CreateFeedsmedicineDto } from './dto/create-feedsmedicine.dto';
import { UpdateFeedsmedicineDto } from './dto/update-feedsmedicine.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
