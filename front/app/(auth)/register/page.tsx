"use client";
import "./style.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../login/types/cliente";
import Link from "next/link";

export default function RegisterPage(){
  const [liberado,setLiberado] = useState(false);
  const [form,setForm] = useState({nome:"",email:"",senha:"",confirma:""});
  const [loading,setLoading] = useState(false);
  const [aceitouPrivacidade,setAceitouPrivacidade]=useState(false);
  const [aceitouTermos,setAceitouTermos]=useState(false);
  const router = useRouter();

  const podeCadastrar = aceitouPrivacidade && aceitouTermos;

  async function handleRegister(e:any){
    e.preventDefault();
    if(!podeCadastrar) return alert("Você precisa aceitar a Política e os Termos");
    if(form.senha !== form.confirma) return alert("Senhas diferentes");
    if(form.senha.length < 6) return alert("Senha mínimo 6 caracteres");
    setLoading(true);
    try{
      await authClient.register({ 
        name: form.nome, 
        email: form.email.toLowerCase().trim(), // evita duplicata Teste@ e teste@
        password: form.senha,
        // PROVA DE CONSENTIMENTO LGPD - vai pro auth.users
        options: {
          data: {
            consent_privacidade: true,
            consent_termos: true,
            consent_data: new Date().toISOString(),
            finalidade: "manutencao_servidor_palworld"
          }
        }
      } as any);
      
      alert("Conta criada!"); 
      router.push("/login");
    }catch(err:any){ 
      // TRAVA 1 E-MAIL = 1 CONTA
      if(err.message.includes("already registered") || err.message.includes("already exists")){
        alert("Este e-mail já está cadastrado.");
      } else {
        alert(err.message); 
      }
    }
    finally{ setLoading(false); }
  }

  return(
    <div className="page">
      <h1>moto<span>track</span></h1>
      <div className="stage">
        <div className="magic-area" onClick={()=>setLiberado(true)} style={{cursor:"pointer"}}>
          <div className="character-wrap">
            <video src="/bunny-hat.mp4" autoPlay loop muted playsInline className="bunny-video" />
          </div>
          <div className="floor-glow"></div>
          {!liberado && <p style={{position:'absolute', bottom:25, color:'#39df82', fontWeight:'900', background:'rgba(0,0,0,0.5)', padding:'6px 12px', borderRadius:20}}>CLIQUE PARA CRIAR CONTA 👆</p>}
        </div>
        <div className="login-area">
          <div className="login-card">
            <h2>Criar conta</h2>
            {!liberado ? <p>🔒 Clique na coelhinha para liberar o cadastro</p> : (
              <form onSubmit={handleRegister}>
                <label>Nome</label><input value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} required />
                <label>E-mail</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
                <label>Senha</label><input type="password" value={form.senha} onChange={e=>setForm({...form,senha:e.target.value})} required />
                <label>Confirma Senha</label><input type="password" value={form.confirma} onChange={e=>setForm({...form,confirma:e.target.value})} required />

                {/* 2 CHECKBOX OBRIGATÓRIOS PLAY STORE */}
                <label style={{display:'flex', gap:8, alignItems:'flex-start', fontSize:13, marginTop:10, cursor:'pointer'}}>
                  <input type="checkbox" checked={aceitouPrivacidade} onChange={e=>setAceitouPrivacidade(e.target.checked)} />
                  <span>Li e aceito a <Link href="/privacidade" target="_blank" style={{color:'#39df82', textDecoration:'underline'}}>Política de Privacidade</Link></span>
                </label>

                <label style={{display:'flex', gap:8, alignItems:'flex-start', fontSize:13, cursor:'pointer'}}>
                  <input type="checkbox" checked={aceitouTermos} onChange={e=>setAceitouTermos(e.target.checked)} />
                  <span>Li e aceito os <Link href="/termos" target="_blank" style={{color:'#39df82', textDecoration:'underline'}}>Termos de Uso</Link> e que a renda mantém o servidor privado de Palworld</span>
                </label>

                <button className="enter" disabled={loading || !podeCadastrar} style={{opacity: !podeCadastrar ? 0.4 : 1}}>{loading?"CRIANDO...":"CRIAR CONTA"}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}