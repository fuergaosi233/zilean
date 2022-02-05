import { Test, TestingModule } from '@nestjs/testing';
import { WxReadController } from './wx-read.controller';
import { WxReadService } from 'src/services/wx-read/wx-read.service';
import { WxReadBookService } from 'src/services/wx-read/wx-read-book.service';
describe('WxReadController', () => {
  let controller: WxReadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WxReadService,
          useValue: {
            getBook: jest.fn(),
            getUserInfo: jest.fn(),
            getUid: jest.fn(),
          },
        },
        {
          provide: WxReadBookService,
          useValue: {
            getBook: jest.fn(),
            getUserInfo: jest.fn(),
            getUid: jest.fn(),
          },
        },
      ],
      controllers: [WxReadController],
    }).compile();

    controller = module.get<WxReadController>(WxReadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
