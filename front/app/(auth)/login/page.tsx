"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./style.css";

export default function LoginPage() {
  const router = useRouter();
  const [liberado, setLiberado] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        const token = data.token || data.accessToken;
        if (token) {
          localStorage.setItem("token", token);
        } else {
          localStorage.setItem("user", JSON.stringify(data));
        }
        router.push("/");
      } else {
        alert("Falhou: " + (data.message || JSON.stringify(data)));
      }
    } catch (error) {
      alert("Erro ao conectar no servidor (8081). Verifique o CORS ou se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="main-container">
        {/* CARD ESQUERDO DA COELHINHA */}
        <div className="magic-card">
          <div className="arch-frame" onClick={() => setLiberado(true)}>
            <div className="character-wrap">
              <video autoPlay loop muted playsInline className="bunny-video">
                <source src="/bunny-hat.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          {!liberado && (
            <button className="badge-btn" onClick={() => setLiberado(true)}>
              CLIQUE PARA LOGAR 👆
            </button>
          )}
        </div>

        {/* CARD DIREITO (LOCKED OU FORMULÁRIO) */}
        <div className="right-panel">
          {!liberado ? (
            <div className="locked-card">
              <h2>Fazer Login</h2>
              <p className="locked-message">
                🔒 Clique na coelhinha para liberar o login
              </p>
            </div>
          ) : (
            <div className="login-card">
              <h2>Bem-vindo</h2>
              <p className="subtitle">Faça login para continuar</p>
              <form onSubmit={handleLogin}>
                <label>E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
                <label>Senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Sua senha"
                  required
                />
                <button type="submit" className="enter-btn" disabled={loading}>
                  {loading ? "ENTRANDO..." : "ENTRAR"}
                </button>
                <div className="register">
                  Não tem conta? <Link href="/register">Cadastre-se</Link>
                </div>
                <Link href="/esqueci" className="forgot">
                  Esqueci minha senha
                </Link>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}