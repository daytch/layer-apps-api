import { Test, TestingModule } from '@nestjs/testing';
import { SopService } from './sop.service';

describe('SopService', () => {
  let service: SopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SopService],
    }).compile();

    service = module.get<SopService>(SopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
