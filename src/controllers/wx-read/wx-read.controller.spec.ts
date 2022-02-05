import { Test, TestingModule } from '@nestjs/testing';
import { WxReadController } from './wx-read.controller';

describe('WxReadController', () => {
  let controller: WxReadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WxReadController],
    }).compile();

    controller = module.get<WxReadController>(WxReadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
