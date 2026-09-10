"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Recuperar(){
  const search = useSearchParams(); const token = search.get("token");
  const [novaSenha,setSenha]=useState(""); const router=useRouter();
  const handle = async (e:any)=>{
    e.preventDefault();
    const res = await fetch("http://localhost:8081/auth/login/recuperar-senha",{
      method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({token, novaSenha})
    });
    if(res.ok){ alert("Senha alterada!"); router.push("/login"); } else alert("Token inválido ou expirado");
  }
  return(
    <div className="min-h-screen flex items-center justify-center bg-emerald-950 p-4">
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[24px] p-8">
        <h1 className="text-2xl font-bold text-white">Nova senha</h1>
        <form onSubmit={handle} className="space-y-4 mt-6">
          <input type="password" required placeholder="Digite sua nova senha" value={novaSenha} onChange={e=>setSenha(e.target.value)} className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white" />
          <button className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold">Alterar senha</button>
        </form>
      </div>
    </div>
  )
}