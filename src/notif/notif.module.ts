import { Module } from '@nestjs/common';
import { NotifService } from './notif.service';
import { NotifGateway } from './notif.gateway';

@Module({
  providers: [NotifGateway, NotifService],
})
export class NotifModule {}
