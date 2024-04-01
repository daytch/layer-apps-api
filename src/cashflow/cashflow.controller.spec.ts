import { Test, TestingModule } from '@nestjs/testing';
import { CashflowController } from './cashflow.controller';
import { CashflowService } from './cashflow.service';

describe('CashflowController', () => {
  let controller: CashflowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashflowController],
      providers: [CashflowService],
    }).compile();

    controller = module.get<CashflowController>(CashflowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
