import { Test, TestingModule } from '@nestjs/testing';
import { WxReadBookService } from './wx-read-book.service';
import { PrismaService } from 'nestjs-prisma';
describe('WxReadBookService', () => {
  let service: WxReadBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WxReadBookService,
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
      ],
    }).compile();

    service = module.get<WxReadBookService>(WxReadBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
