import { Test, TestingModule } from '@nestjs/testing';
import { FeedsmedicinesController } from './feedsmedicines.controller';
import { FeedsmedicinesService } from './feedsmedicines.service';

describe('FeedsmedicinesController', () => {
  let controller: FeedsmedicinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedsmedicinesController],
      providers: [FeedsmedicinesService],
    }).compile();

    controller = module.get<FeedsmedicinesController>(FeedsmedicinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
