import { Test, TestingModule } from '@nestjs/testing';
import { SopController } from './sop.controller';
import { SopService } from './sop.service';

describe('SopController', () => {
  let controller: SopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SopController],
      providers: [SopService],
    }).compile();

    controller = module.get<SopController>(SopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
