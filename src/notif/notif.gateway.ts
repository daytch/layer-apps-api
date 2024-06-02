import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { NotifService } from './notif.service';
import { CreateNotifDto } from './dto/create-notif.dto';
import { UpdateNotifDto } from './dto/update-notif.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Notif')
@WebSocketGateway()
export class NotifGateway {
  constructor(private readonly notifService: NotifService) {}

  @SubscribeMessage('createNotif')
  create(@MessageBody() createNotifDto: CreateNotifDto) {
    return this.notifService.create(createNotifDto);
  }

  @SubscribeMessage('findAllNotif')
  findAll() {
    return this.notifService.findAll();
  }

  @SubscribeMessage('findOneNotif')
  findOne(@MessageBody() id: number) {
    return this.notifService.findOne(id);
  }

  @SubscribeMessage('updateNotif')
  update(@MessageBody() updateNotifDto: UpdateNotifDto) {
    return this.notifService.update(updateNotifDto.id, updateNotifDto);
  }

  @SubscribeMessage('removeNotif')
  remove(@MessageBody() id: number) {
    return this.notifService.remove(id);
  }
}
