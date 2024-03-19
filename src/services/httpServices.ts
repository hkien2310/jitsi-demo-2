import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import AuthServices from "./Auth.services";

const refreshToken = async (config: any) => {
  try {
    const res = await AuthServices.refreshToken(AuthServices.getRefreshToken() ?? "");
    AuthServices.saveToken(res.data.accessToken);
    AuthServices.saveRefreshToken(res.data.refresh);
    if (config.headers) {
      config.headers[`Authorization`] = `Bearer ${res.data.accessToken}`;
    }
  } catch (err) {
    //
  }
}

class Services {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios;
    this.axios.defaults.withCredentials = false;

    //! Default token when was login
    this.axios.interceptors.request.use(function (config) {
      const token = AuthServices.getToken();
      if (config.headers) {
        config.headers[`Authorization`] = `Bearer ${token}`;
      }

      return config;
    });

    //! Interceptor request
    this.axios.interceptors.request.use(
      function (config) {
        console.log(config, "config");
        const token = AuthServices.getToken();
        if (config.headers) {
          config.headers[`Authorization`] = `Bearer ${token}`;
        }

        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    //! Interceptor response
    this.axios.interceptors.response.use(
      function (config) {
        return config;
      },
      function (errors: AxiosError) {
        const { response, config } = errors;

        if (response?.status === 401) {
          refreshToken(config)
        }

        return Promise.reject(errors);
      }
    );
  }

  attachTokenToHeader(token: string) {
    this.axios.interceptors.request.use(
      function (config) {
        if (config.headers) {
          // Do something before request is sent
          // config.headers.sessionId = token;
          config.headers[`Authorization`] = `Bearer ${token}`;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }

  get(url: string, config?: AxiosRequestConfig) {
    return this.axios.get(url, config);
  }

  post(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axios.post(url, data, config);
  }

  delete(url: string, config?: AxiosRequestConfig) {
    return this.axios.delete(url, config);
  }

  put(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axios.put(url, data, config);
  }

  patch(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axios.patch(url, data, config);
  }
}

export default new Services();
