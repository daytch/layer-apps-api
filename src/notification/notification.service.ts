import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Jakarta');

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(req: any) {
    const notifs = await this.prisma.notification.findMany({
      where: { listenerId: req.user.uid },
    });
    return notifs.map((item) => {
      return {
        id: item.id,
        message: item.message,
        reporter: item.reporter,
        isRead: item.isRead,
        diagnosticId: item.diagnosticId,
        transaction_date: dayjs(item.createdAt)
          .tz('UTC')
          .tz('Asia/Jakarta')
          .format(),
      };
    });
  }

  async update(id: number) {
    await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return await this.prisma.notification.findUnique({ where: { id } });
  }
}
