import { Test, TestingModule } from '@nestjs/testing';
import { WxReadService } from './wx-read.service';

describe('WxReadService', () => {
  let service: WxReadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WxReadService],
    }).compile();

    service = module.get<WxReadService>(WxReadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
