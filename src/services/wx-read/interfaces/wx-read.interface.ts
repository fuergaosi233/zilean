export interface IpollingResponse {
  code: string;
  expireMode: number;
  pf: number;
  redirect_uri: string;
  skey: string;
  vid: number;
}
export interface IwebLoginResponse {
  vid: number;
  refreshToken: string;
  accessToken: string;
}