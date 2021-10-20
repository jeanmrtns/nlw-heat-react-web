import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

interface AuthProvider {
  children: ReactNode
}

interface AuthResponse {
  token: string,
  user: {
    id: string,
    avatar_url: string,
    name: string,
    login: string
  }
}

interface IUser {
  id: string,
  name: string,
  login: string,
  avatar_url: string
}

interface AuthContextData {
  user: IUser | null,
  signInUrl: string,
  signOut: () => void
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider( { children } : AuthProvider) {
  
  const [user, setUser] = useState<IUser | null>(null);

  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=0007bc2beff848f8e9da`;

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode
    });

    const { token, user } = response.data;

    localStorage.setItem('@dowhile:token', token);

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user);
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem('@dowhile:token');
  }

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if(hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');

      window.history.pushState({}, '', urlWithoutCode);

      signIn(githubCode);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token');

    if(token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<IUser>('profile').then(response => {
        setUser(response.data);
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      { children }
    </AuthContext.Provider>
  );
}