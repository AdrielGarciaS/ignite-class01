import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../context/AuthContext';

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestQueue = [];

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['nextauth.token']}`,
  }
});

const thirtyDays = 60 * 60 * 24 * 30;

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        cookies = parseCookies();
        
        if (!isRefreshing) {
          isRefreshing = true;

          const { 'nextauth.refreshToken': refreshToken } = cookies;

          api.post('/refresh', { refreshToken })
          .then(response => {
            const { token } = response.data;

            setCookie(undefined, 'nextauth.token', token, {
              maxAge: thirtyDays,
              path: '/',
            });
            setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken, {
              maxAge: thirtyDays,
              path: '/',
            });

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            failedRequestQueue.forEach(request => request.onSuccess(token));
            failedRequestQueue = [];
          })
          .catch(err => {
            failedRequestQueue.forEach(request => request.onFailure(err));
            failedRequestQueue = [];
          })
          .finally(() => {
            isRefreshing = false;
          });
        };

        const originalConfig = error.config;
          
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`;

              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          })
        });
      } 

      signOut();
    }

    return Promise.reject(error);
  }
);