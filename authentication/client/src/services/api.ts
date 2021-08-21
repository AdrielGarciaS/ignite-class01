import axios, { AxiosError } from 'axios';
import { GetServerSidePropsContext } from 'next';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../context/AuthContext';

let isRefreshing = false;
let failedRequestQueue = [];
const thirtyDays = 60 * 60 * 24 * 30;

export const setupAPIClient = (context: GetServerSidePropsContext = undefined) => {
  let cookies = parseCookies(context);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['nextauth.token']}`,
    }
  });
  
  
  api.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      if (error.response.status === 401) {
        if (error.response.data?.code === 'token.expired') {
          cookies = parseCookies(context);
          
          if (!isRefreshing) {
            isRefreshing = true;
  
            const { 'nextauth.refreshToken': refreshToken } = cookies;
  
            api.post('/refresh', { refreshToken })
            .then(response => {
              const { token } = response.data;
  
              setCookie(context, 'nextauth.token', token, {
                maxAge: thirtyDays,
                path: '/',
              });
              setCookie(context, 'nextauth.refreshToken', response.data.refreshToken, {
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
  
        if (process.browser) {
          signOut();
        }
      }
  
      return Promise.reject(error);
    }
  );

  return api;
}