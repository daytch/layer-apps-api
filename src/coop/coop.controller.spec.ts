import { Test, TestingModule } from '@nestjs/testing';
import { CoopController } from './coop.controller';
import { CoopService } from './coop.service';

describe('CoopController', () => {
  let controller: CoopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoopController],
      providers: [CoopService],
    }).compile();

    controller = module.get<CoopController>(CoopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
