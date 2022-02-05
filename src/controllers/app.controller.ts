import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  @Get('/health')
  getHello() {
    return {
      status: 'ok',
    };
  }
}
