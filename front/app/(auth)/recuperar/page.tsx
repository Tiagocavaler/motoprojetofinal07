// Força a rota a ser dinâmica - padrão da aula
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

// URL do seu backend Java/Spring - fica só no servidor, não expõe no client
const BACKEND_URL = "http://localhost:8081/auth/login/recuperar-senha";

type Body = {
  token: string;
  novaSenha: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const { token, novaSenha } = body;

    // 1. Validação - camada de apresentação -> API
    if (!token || !novaSenha) {
      return NextResponse.json(
        { error: "Token e nova senha são obrigatórios." },
        { status: 400 }
      );
    }

    if (novaSenha.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter no mínimo 6 caracteres." },
        { status: 400 }
      );
    }

    // 2. Persistência - API Next.js -> Backend Java
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, novaSenha }),
    });

    const data = await res.json().catch(() => null);

    // 3. Tratamento de erro vindo do backend
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || data?.error || "Token inválido ou expirado." },
        { status: res.status }
      );
    }

    // 4. Sucesso - resposta padronizada
    return NextResponse.json(
      { message: "Senha alterada com sucesso!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro em /api/auth/forgot/reset:", error);
    return NextResponse.json(
      { error: "Erro interno ao redefinir a senha." },
      { status: 500 }
    );
  }
}