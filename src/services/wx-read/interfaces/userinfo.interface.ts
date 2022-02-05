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
