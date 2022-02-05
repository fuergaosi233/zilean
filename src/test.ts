import axios from 'axios';
import * as qrCode from 'qrcode-terminal';

export interface User {
  vid: number;
  skey: string;
  name: string;
  avatar: string;
  gender: number;
  pf: number;
}

export interface Vid {
  vid: number;
}

export interface User2 {
  vid: Vid;
  avatar: string;
  name: string;
}

export interface Book {
  bookId: string;
  title: string;
  author: string;
}

export interface Shelf {
  books: Book[];
}

export interface SState {
  user: User2;
  shelf: Shelf;
}

export interface Query {}

export interface Params {}

export interface Meta {}

export interface Query2 {}

export interface Params2 {}

export interface Meta2 {}

export interface From {
  name?: any;
  path: string;
  hash: string;
  query: Query2;
  params: Params2;
  fullPath: string;
  meta: Meta2;
}

export interface Route {
  path: string;
  hash: string;
  query: Query;
  params: Params;
  fullPath: string;
  meta: Meta;
  from: From;
}

export interface Book2 {
  bookId: string;
  title: string;
  author: string;
  cover: string;
  secret: number;
  format: string;
  soldout: number;
  payType: number;
  finished: number;
  finishReading: number;
  lastChapterIdx: number;
  readUpdateTime: number;
  updateTime: number;
  progress: number;
  updated: number;
  isTrial: boolean;
}

export interface BookProgress {
  bookId: string;
  progress: number;
  chapterUid: number;
  chapterOffset: number;
  chapterIdx: number;
  appId: string;
  updateTime: number;
  synckey?: number;
}

export interface MemberCardSummary {}

export interface Shelf2 {
  books: Book2[];
  bookProgress: BookProgress[];
  balanceIOS: number;
  balanceAndroid: number;
  memberCardSummary: MemberCardSummary;
}

export interface RootObject {
  platform: string;
  deviceInfo: string;
  httpReferer: string;
  error?: any;
  user: User;
  isWhiteTheme: boolean;
  isNavBarShown: boolean;
  isFooterShown: boolean;
  isShelfFullShown: boolean;
  pageName: string;
  pageTitle: string;
  pageKeywords: string;
  pageDescription: string;
  pageBodyClass: string;
  customReaderStyle: string;
  environment: string;
  sState: SState;
  route: Route;
  shelf: Shelf2;
}

interface IWxErrorResponse {
  errCode: number;
  errMsg: string;
  errlog: string;
}
interface IpollingResponse {
  code: string;
  expireMode: number;
  pf: number;
  redirect_uri: string;
  skey: string;
  vid: number;
}
interface IwebLoginResponse {
  vid: number;
  refreshToken: string;
  accessToken: string;
}
const longPolling = async (uid): Promise<IpollingResponse> => {
  const url = 'https://weread.qq.com/web/login/getinfo';
  const response = await axios.post(
    url,
    {
      uid,
    },
    {
      timeout: 60 * 1000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }
  );
  return response.data;
};
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
  const response = await axios.post(
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
  const response = await axios.post(url, {
    vid,
    skey,
    rt,
    pf,
  });
  console.log(response.headers);
  const cookies = response.headers['set-cookie'].join(';');
  return cookies;
};
const getAllInfos = async (cookie: string): Promise<RootObject> => {
  const url = 'https://weread.qq.com/web/shelf';
  const response = await axios.get(url, { headers: { Cookie: cookie } });
  const pageInfo = response.data;
  const initValueReg = /window.__INITIAL_STATE__=(\{[\s\S]*?\});/;
  const initValue = initValueReg.exec(pageInfo)[0];
  const valueReg = /\{.*\}/;
  const value = valueReg.exec(initValue)[0];
  return JSON.parse(value);
};
const getUserInfo = async (userVid: number, cookie: string) => {
  const url = 'https://weread.qq.com/web/user';
  const response = await axios.get(url, {
    params: { userVid },
    headers: { Cookie: cookie },
  });
  return response.data;
};
const generateCookie = async () => {
  const response = await axios.post('https://weread.qq.com/web/login/getuid', {
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  });
  const { uid } = response.data;
  console.log(uid);
  qrCode.generate(
    `https://weread.qq.com/web/confirm?pf=2&uid=${uid}`,
    { small: true },
    function (qrcode) {
      console.log(qrcode);
    }
  );
  const longPollingInfo = await longPolling(uid);
  console.log(longPollingInfo);
  const { code, skey, vid } = longPollingInfo;
  const webLoginInfo = await webLogin({ code, skey, vid });
  console.log(webLoginInfo);
  const cookies = await sessionInit({
    vid,
    skey,
    rt: webLoginInfo.refreshToken,
    pf: 0,
  });
  console.log(cookies);
  return cookies;
};
const getAllBookMark = async (bookId: string, type: number, cookie: string) => {
  const url = 'https://weread.qq.com/web/book/bookmarklist';
  const response = await axios.get(url, {
    params: {
      bookId,
      type,
    },
    headers: { Cookie: cookie },
  });
  return response.data;
};
async function main() {
  const cookie = await generateCookie();
  console.log(cookie);
  const userInfo = await getUserInfo(298329854, cookie);
  console.log(userInfo);
  const value = await getAllInfos(cookie);
  const bookId = value.shelf.books[0].bookId;
  const bookMark = await getAllBookMark(bookId, 1, cookie);
  console.log(bookMark);
}
main().then(console.log).catch(console.error);
