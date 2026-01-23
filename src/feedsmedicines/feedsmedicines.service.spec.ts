import { Test, TestingModule } from '@nestjs/testing';
import { FeedsmedicinesService } from './feedsmedicines.service';

describe('FeedsmedicinesService', () => {
  let service: FeedsmedicinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedsmedicinesService],
    }).compile();

    service = module.get<FeedsmedicinesService>(FeedsmedicinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
