import { Injectable } from '@nestjs/common';
import { CreateNotifDto } from './dto/create-notif.dto';
import { UpdateNotifDto } from './dto/update-notif.dto';

@Injectable()
export class NotifService {
  create(createNotifDto: CreateNotifDto) {
    return 'This action adds a new notif';
  }

  findAll() {
    return `This action returns all notif`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notif`;
  }

  update(id: number, updateNotifDto: UpdateNotifDto) {
    return `This action updates a #${id} notif`;
  }

  remove(id: number) {
    return `This action removes a #${id} notif`;
  }
}
