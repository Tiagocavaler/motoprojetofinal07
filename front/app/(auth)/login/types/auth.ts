// app/(auth)/login/types/auth.ts - VERSÃO LIMPA

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotRequest {
  email: string;
}

// FALTAVA ESSE - é o que sua tela de Nova Senha precisa
export interface ResetPasswordRequest {
  token: string;
  novaSenha: string;
}

// Opcional mas recomendado pelo professor: resposta padrão
export interface ApiError {
  error: string;
}