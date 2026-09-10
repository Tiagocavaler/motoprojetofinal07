"use client";
import "./style.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage(){
  const [liberado,setLiberado] = useState(false);
  const [form,setForm] = useState({nome:"",email:"",senha:"",confirma:""});
  const [loading,setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e:any){
    e.preventDefault();
    if(form.senha !== form.confirma) return alert("Senhas diferentes");
    setLoading(true);
    try{
      const res = await fetch("http://localhost:3000/auth/register",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({nome:form.nome, email:form.email, senha:form.senha})
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message);
      alert("Conta criada!"); router.push("/login");
    }catch(err:any){ alert(err.message); }
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
                <label>Nome</label><input value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} />
                <label>E-mail</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
                <label>Senha</label><input type="password" value={form.senha} onChange={e=>setForm({...form,senha:e.target.value})} />
                <label>Confirma Senha</label><input type="password" value={form.confirma} onChange={e=>setForm({...form,confirma:e.target.value})} />
                <button className="enter" disabled={loading}>{loading?"CRIANDO...":"CRIAR CONTA"}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}