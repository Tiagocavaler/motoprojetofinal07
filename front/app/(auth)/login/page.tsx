"use client";
import "./style.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [liberado, setLiberado] = useState(false);
  const [email,setEmail] = useState("");
  const [senha,setSenha] = useState("");
  const [loading,setLoading] = useState(false);

  async function handleLogin(e:any){
    e.preventDefault();
    setLoading(true);
    try{
      const res = await fetch("http://localhost:3000/auth/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,senha})
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message);
      localStorage.setItem("token", data.access_token);
      router.push("/home");
    }catch(err:any){ alert(err.message); }
    finally{ setLoading(false); }
  }

  return (
    <div className="page">
      <h1>moto<span>track</span></h1>
      <div className="stage">
        {/* AQUI O VIDEO É O BOTÃO */}
        <div className="magic-area" onClick={()=>setLiberado(true)} style={{cursor:"pointer"}}>
          <div className="character-wrap">
            <video 
              src="/bunny-hat.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              className="bunny-video"
            />
          </div>
          <div className="floor-glow"></div>
          {!liberado && <p style={{position:'absolute', bottom:25, color:'#39df82', fontWeight:'900', background:'rgba(0,0,0,0.5)', padding:'6px 12px', borderRadius:20}}>CLIQUE NA COELHINHA PARA LOGAR 👆</p>}
        </div>

        <div className="login-area">
          <div className="login-card">
            <h2>Bem-vindo</h2>
            {!liberado ? (
              <p>🔒 Formulário bloqueado. Clique na coelhinha ao lado para liberar.</p>
            ) : (
              <>
                <p>Faça login para continuar</p>
                <form onSubmit={handleLogin}>
                  <label>E-mail</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" />
                  <label>Senha</label><input type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Sua senha" />
                  <button className="enter" disabled={loading}>{loading?"ENTRANDO...":"ENTRAR"}</button>
                  <div className="register">Não tem conta? <Link href="/register">Cadastre-se</Link></div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}