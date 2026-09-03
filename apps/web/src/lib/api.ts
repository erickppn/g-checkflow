import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.DEV
    ? import.meta.env.VITE_API_URL
    : "/api",
  withCredentials: true,
});

type OnUnauthorizedCallback = () => void;
let unauthorizedHandler: OnUnauthorizedCallback = () => {};

export const injectUnauthorizedHandler = (handler: OnUnauthorizedCallback) => {
  unauthorizedHandler = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';

    if (error.response?.status === 401 && !requestUrl.includes('/auth/me')) {
      unauthorizedHandler();
    }

    return Promise.reject(error);
  }
);