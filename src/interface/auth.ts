export interface LoginBody {
  username: string;
  password: string;
}
export interface ResponseLogin {
  data: {
    refresh: string;
    accessToken: string;
    user: any
  }
}
