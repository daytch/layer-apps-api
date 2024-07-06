import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(req: any) {
    const notifs = await this.prisma.notification.findMany({
      where: { listenerId: req.user.uid },
    });
    return notifs;
  }

  async update(id: number) {
    await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return await this.prisma.notification.findUnique({ where: { id } });
  }
}
