import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { WxReadBookService } from './wx-read-book.service';
import { IpollingResponse, IwebLoginResponse, RootObject } from './interfaces';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
@Injectable()
export class WxReadService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
    private bookService: WxReadBookService,
    @InjectQueue('wx-read') private wxReadQueue: Queue
  ) {}
  logger = new Logger('WxReadService');
  // 获取用户的所有信息
  async getAllUserInfoByCookies(cookie: string): Promise<RootObject> {
    const url = 'https://weread.qq.com/web/shelf';
    const response = await lastValueFrom(
      this.http.get(url, { headers: { Cookie: cookie } })
    );
    const pageInfo = response.data;
    const initValueReg = /window.__INITIAL_STATE__=(\{[\s\S]*?\});/;
    const initValue = initValueReg.exec(pageInfo)[0];
    const valueReg = /\{.*\}/;
    const value = valueReg.exec(initValue)[0];
    return JSON.parse(value);
  }
  async getWxUserByVid(userVid: number) {
    const user = await this.prisma.wxUser.findUnique({
      where: {
        userVid,
      },
    });
    return user;
  }
  // 生成登录用到的 UID,登录的 URL https://weread.qq.com/web/confirm?pf=2&uid=${uid}
  async getUid() {
    const response = await lastValueFrom(
      this.http.post('https://weread.qq.com/web/login/getuid', {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      })
    );
    const { uid } = response.data;
    this.logger.debug(response.data);
    await this.wxReadQueue.add(
      'login-long-polling',
      {
        uid,
      },
      {
        removeOnComplete: true,
        jobId: `login-long-polling-${uid}`,
      }
    );
    this.logger.log(`uid: ${uid} add to queue successfully`);
    return uid as string;
  }
  // LongPolling For genretate Get Token
  async longPolling(uid: string): Promise<IpollingResponse> {
    this.logger.log(`uid: ${uid} start longPolling`);
    const response = await lastValueFrom(
      this.http.post(
        'https://weread.qq.com/web/login/getinfo',
        {
          uid,
        },
        {
          timeout: 60 * 1000,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        }
      )
    );
    return response.data;
  }
  // use code skey vid by LongPolling to get accessToken and refreshToken
  async loginByCode({
    code,
    skey,
    vid,
  }: {
    code: string;
    skey: string;
    vid: number;
  }) {
    const webLogin = async ({
      vid,
      skey,
      code,
    }: {
      vid: number;
      skey: string;
      code: string;
    }): Promise<IwebLoginResponse> => {
      const url = 'https://weread.qq.com/web/login/weblogin';
      const response = await lastValueFrom(
        this.http.post(
          url,
          {
            vid,
            skey,
            code,
          },
          {
            timeout: 60 * 1000,
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
            },
          }
        )
      );
      return response.data;
    };
    const sessionInit = async ({
      vid,
      skey,
      rt,
      pf,
    }: {
      vid: number;
      skey: string;
      rt: string;
      pf: number;
    }) => {
      const url = 'https://weread.qq.com/web/login/session/init';
      const response = await lastValueFrom(
        this.http.post(url, {
          vid,
          skey,
          rt,
          pf,
        })
      );
      const cookies = response.headers['set-cookie'].join(';');
      return cookies;
    };
    const { refreshToken, accessToken } = await webLogin({ code, skey, vid });
    const cookies = await sessionInit({
      vid,
      skey,
      rt: refreshToken,
      pf: 0,
    });
    return {
      vid,
      accessToken,
      refreshToken,
      cookies,
    };
  }
  // It's will save or update Login Info and insert all books to Db.
  async saveLoginInfo({
    vid,
    accessToken,
    refreshToken,
    cookies,
  }: {
    vid: number;
    accessToken: string;
    refreshToken: string;
    cookies: string;
  }) {
    const userInfos = await this.getAllUserInfoByCookies(cookies);
    this.logger.debug(userInfos);
    const {
      user: { name, avatar },
      shelf: { books },
    } = userInfos;
    // create Or update Books
    const wxUser = await this.prisma.wxUser.upsert({
      where: {
        userVid: vid,
      },
      create: {
        userVid: vid,
        accessToken,
        refreshToken,
        cookies,
        name,
        avatar,
      },
      update: {
        accessToken,
        refreshToken,
        cookies,
        name,
        avatar,
      },
    });
    await this.bookService.findOrCreateBooks(books, vid);
    return await wxUser;
  }
  async getUserInfoByVid(vid: number) {
    const user = await this.prisma.wxUser.findUnique({
      where: {
        userVid: vid,
      },
    });
    return user;
  }
}
