import { Controller, Query, Get, Logger } from '@nestjs/common';
import { WxReadService } from 'src/services/wx-read/wx-read.service';
import { WxReadBookService } from 'src/services/wx-read/wx-read-book.service';
import { ApiQuery } from '@nestjs/swagger';
import * as qrCode from 'qrcode-terminal';
@Controller('wx-read')
export class WxReadController {
  logger = new Logger('WxReadController');
  constructor(
    private wxService: WxReadService,
    private wxBookService: WxReadBookService
  ) {}
  // 获取的所有用户信息
  @ApiQuery({ name: 'vid', type: Number })
  @Get('/userinfo')
  async getUserInfo(@Query('vid') vid: number) {
    const user = await this.wxService.getUserInfoByVid(Number(vid));
    if (!user) {
      const uid = await this.wxService.getUid();
      qrCode.generate(
        `https://weread.qq.com/web/confirm?pf=2&uid=${uid}`,
        { small: true },
        (qrcode) => {
          this.logger.log(qrcode);
        }
      );
      return {
        isActive: false,
        uid: uid,
      };
    }
    return {
      isActive: true,
      userInfo: user,
    };
  }

  @Get('/books')
  async getBook(@Query('vid') vid: number) {
    const books = await this.wxBookService.getAllBooksByVid(Number(vid));
    return books;
  }
}
