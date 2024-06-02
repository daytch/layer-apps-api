import { Test, TestingModule } from '@nestjs/testing';
import { NotifGateway } from './notif.gateway';
import { NotifService } from './notif.service';

describe('NotifGateway', () => {
  let gateway: NotifGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotifGateway, NotifService],
    }).compile();

    gateway = module.get<NotifGateway>(NotifGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
