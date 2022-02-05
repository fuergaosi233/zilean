import { Test, TestingModule } from '@nestjs/testing';
import { WxReadService } from './wx-read.service';
import { PrismaService } from 'nestjs-prisma';
import { HttpService } from '@nestjs/axios';
import { WxReadBookService } from './wx-read-book.service';
describe('WxReadService', () => {
  let service: WxReadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WxReadService,
        {
          provide: PrismaService,
          useValue: {
            book: {
              findMany: jest.fn(),
              findOne: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            wxUser: {
              findMany: jest.fn(),
              findOne: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
        {
          provide: WxReadBookService,
          useValue: {},
        },
        {
          provide: 'BullQueue_wx-read',
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WxReadService>(WxReadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
