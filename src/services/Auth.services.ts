
import { LOGIN, REFRESH_TOKEN } from "../const/api";
import { KEY_LOCALSTORAGE } from "../const/keyLocalstorage";
import { LoginBody, ResponseLogin } from "../interface/auth";
import httpServices from "./httpServices";

const SAVE_USER_LOCAL_STORAGE = "SAVE_USER_LOCAL_STORAGE";
class AuthService {
  saveUserToLocalStorage(data = {}) {
    localStorage.setItem(SAVE_USER_LOCAL_STORAGE, JSON.stringify(data));
  }

  getUserLocalStorage() {
    const dataUser = localStorage.getItem(SAVE_USER_LOCAL_STORAGE);
    if (!!dataUser) {
      return JSON.parse(dataUser);
    }
    return {};
  }

  clearUserLocalStorage() {
    localStorage.removeItem(SAVE_USER_LOCAL_STORAGE);
  }
  saveToken(token: string) {
    localStorage.setItem(KEY_LOCALSTORAGE.TOKEN, token);
  }
  saveRefreshToken(token: string) {
    localStorage.setItem(KEY_LOCALSTORAGE.REFRESH_TOKEN, token);
  }
  getToken() {
    return localStorage.getItem(KEY_LOCALSTORAGE.TOKEN);
  }

  getRefreshToken() {
    return localStorage.getItem(KEY_LOCALSTORAGE.REFRESH_TOKEN);
  }

  logout() {
    localStorage.removeItem(KEY_LOCALSTORAGE.TOKEN);
    localStorage.removeItem(SAVE_USER_LOCAL_STORAGE);
  }

  login(body: LoginBody): Promise<ResponseLogin> {
    return httpServices.axios.post(LOGIN, body);
  }
  refreshToken(token: string): Promise<ResponseLogin> {
    return httpServices.axios.post(REFRESH_TOKEN, token);
  }
}

export default new AuthService();
