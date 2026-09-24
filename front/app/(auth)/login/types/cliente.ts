// app/(auth)/login/types/cliente.ts
import { LoginRequest, LoginResponse, RegisterRequest, ForgotRequest } from './auth';

const API = '/api/auth';

// Fetcher genérico - é isso que você vai replicar para os outros módulos
async function request<T>(url: string, data: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include', // ESSENCIAL pra persistir o cookie de auth
  });

  // Tenta pegar o body como JSON sempre
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    // Usa a mensagem padronizada que vem do NextResponse.json({ error: ... })
    throw new Error(json?.error || `Erro na requisição: ${res.status}`);
  }

  return json as T;
}

export const authClient = {
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return request<LoginResponse>(`${API}/login`, data);
  },

  register: (data: RegisterRequest) => {
    return request(`${API}/register`, data);
  },

  forgot: (data: ForgotRequest) => {
    // troquei de /esqueci pra /forgot pra manter o padrão REST em inglês
    return request(`${API}/forgot`, data);
  }
}