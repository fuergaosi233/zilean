import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { WxReadService } from 'src/services/wx-read/wx-read.service';
@Processor('wx-read')
export class WxReadConsumer {
  logger = new Logger('WxReadConsumer');
  constructor(private wxReadService: WxReadService) {}
  @Process({
    name: 'login-long-polling',
    concurrency: 100,
  })
  async LoginLongPolling(job, done) {
    const { uid } = job.data;
    this.logger.log(`uid: ${uid} start to login`);
    const longPollingResponse = await this.wxReadService.longPolling(uid);
    const { code, skey, vid } = longPollingResponse;
    if (!code) {
      this.logger.log(
        `${uid} 登录失败,Respons:{${JSON.stringify(longPollingResponse)}}`
      );
      done();
      return;
    }
    this.logger.log(`${uid} 扫码成功`);
    // Login Response
    const loginResponse = await this.wxReadService.loginByCode({
      code,
      skey,
      vid,
    });
    const { accessToken, refreshToken, cookies } = loginResponse;
    this.logger.log(
      `uid: ${uid} vid: ${vid} 登录成功 获取登录信息完成,Respons:{${JSON.stringify(
        loginResponse
      )}}`
    );
    // Save Info
    await this.wxReadService.saveLoginInfo({
      accessToken,
      refreshToken,
      cookies,
      vid,
    });
    this.logger.log(`uid: ${uid} vid: ${vid} 保存登录信息完成`);
    done();
    return;
  }
}
