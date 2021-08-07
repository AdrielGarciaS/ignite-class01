import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Router from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies'

import { api } from "../services/api";

interface User {
  email: string;
  permissions: string[];
  roles: string[];
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
}

const AuthContext = createContext({} as AuthContextData);

interface Props {
  children: ReactNode;
}

const thirtyDays = 60 * 60 * 24 * 30;

export const signOut = () => {
  destroyCookie(undefined, 'nextauth.token');
  destroyCookie(undefined, 'nextauth.refreshToken');

  Router.push('/');
}

export const AuthProvider = (props: Props) => {
  const { children } = props;
  const [user, setUser] = useState<User>(null);

  const isAuthenticated = Boolean(user);

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

      Router.push('/dashboard')
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
