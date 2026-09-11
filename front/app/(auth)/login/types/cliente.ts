// app/(auth)/login/types/cliente.ts
import { LoginRequest, LoginResponse, RegisterRequest, ForgotRequest } from './auth';

const API = '/api/auth';

export const authClient = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if(!res.ok) throw new Error(await res.text());
    return res.json();
  },

  register: async (data: RegisterRequest) => {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if(!res.ok) throw new Error(await res.text());
    return res.json();
  },

  forgot: async (data: ForgotRequest) => {
    const res = await fetch(`${API}/esqueci`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if(!res.ok) throw new Error(await res.text());
    return res.json();
  }
}