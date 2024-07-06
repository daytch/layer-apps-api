import { Controller, Get, Put, Request, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/')
  async findAll(@Request() req) {
    return await this.notificationService.findAll(req);
  }

  @Put(':id')
  async update(@Param('id') id: string) {
    return await this.notificationService.update(+id);
  }
}
