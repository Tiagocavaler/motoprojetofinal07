"use client";
import { useState } from "react";
import Link from "next/link";

export default function EsqueciSenha(){
  const [email,setEmail] = useState(""); const [loading,setLoading]=useState(false); const [ok,setOk]=useState(false);
  const handle = async (e:any)=>{
    e.preventDefault(); setLoading(true);
    const res = await fetch("http://localhost:8081/auth/login/esqueci-senha",{
      method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({email})
    });
    setLoading(false);
    if(res.ok) setOk(true);
  }
  return(
    <div className="min-h-screen flex items-center justify-center bg-emerald-950 p-4">
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[24px] p-8">
        <h1 className="text-2xl font-bold text-white">Recuperar senha</h1>
        <p className="text-emerald-200/60 text-sm mt-1 mb-6">Vamos enviar um link no seu e-mail.</p>
        {ok? <p className="text-emerald-300 bg-emerald-500/10 p-3 rounded-xl text-sm text-center">Link enviado! Verifique seu e-mail.</p> :
        <form onSubmit={handle} className="space-y-4">
          <input value={email} onChange={e=>setEmail(e.target.value)} required type="email" placeholder="seu@email.com" className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none" />
          <button disabled={loading} className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold">{loading?"Enviando...":"Enviar link"}</button>
        </form>}
        <Link href="/login" className="block text-center text-sm text-white/50 mt-6 hover:text-white">Voltar ao login</Link>
      </div>
    </div>
  )
}