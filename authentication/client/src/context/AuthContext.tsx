import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Router from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies'

import { api } from "../services/apiClient";

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  isAuthenticated: boolean;
  user: User;
}

const AuthContext = createContext({} as AuthContextData);

interface Props {
  children: ReactNode;
}

const thirtyDays = 60 * 60 * 24 * 30;

let authChannel: BroadcastChannel;

export const signOut = () => {
  destroyCookie(undefined, 'nextauth.token');
  destroyCookie(undefined, 'nextauth.refreshToken');

  authChannel.postMessage('signOut');

  Router.push('/');
}

export const AuthProvider = (props: Props) => {
  const { children } = props;
  const [user, setUser] = useState<User>(null);

  const isAuthenticated = Boolean(user);

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          Router.push('/');
          break;
        case 'signIn':
          Router.push('/dashboard');
          break;
        default:
          break;
      }
    }
  }, [])

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();

    if (!token) return;

    api.get('/me')
    .then(response => {
      const { email, permissions, roles } = response.data;

      setUser({ email, permissions, roles });
    })
    .catch(() => {
      signOut();
    })
  }, [])

  const signIn = async (data: SignInCredentials) => {
    try {
      const { email, password } = data;
      const response = await api.post('sessions', { email, password });

      const { permissions, roles, token, refreshToken } = response.data;

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: thirtyDays,
        path: '/',
      });
      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: thirtyDays,
        path: '/',
      });
      
      setUser({ email, permissions, roles });

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push('/dashboard');

      authChannel.postMessage('signIn');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
