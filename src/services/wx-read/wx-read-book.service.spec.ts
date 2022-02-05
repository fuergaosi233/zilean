import { Test, TestingModule } from '@nestjs/testing';
import { WxReadBookService } from './wx-read-book.service';

describe('WxReadBookService', () => {
  let service: WxReadBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WxReadBookService],
    }).compile();

    service = module.get<WxReadBookService>(WxReadBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
