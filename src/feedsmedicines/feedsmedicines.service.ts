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

  findAll() {
    return this.prisma.feedsMedicines.findMany();
  }

  findOne(id: number) {
    return this.prisma.feedsMedicines.findUnique({ where: { id } });
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
