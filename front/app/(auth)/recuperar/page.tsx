"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AtualizarSenha(){
  const [novaSenha, setNovaSenha] = useState(""); // Nova senha digitada
  const [loading, setLoading] = useState(false); // Loading
  const router = useRouter();

  // O Supabase lê o #access_token da URL sozinho quando a página abre
  useEffect(()=> {
    supabase.auth.getSession(); // Força carregar a sessão de recuperação
  },[]);

  const salvar = async (e:any) => {
    e.preventDefault();
    if(novaSenha.length < 6) return alert("Mínimo 6 caracteres");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: novaSenha }); // Atualiza senha do user do token
    setLoading(false);
    if(error) return alert(error.message);
    alert("Senha trocada! Faça login.");
    router.push("/"); // Volta pra home com modal de login
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1325] p-4">
      <form onSubmit={salvar} className="bg-[#162342] p-8 rounded-2xl w-full max-w-sm space-y-4">
        <h1 className="text-white font-bold text-xl">Nova senha</h1>
        <input value={novaSenha} onChange={e=>setNovaSenha(e.target.value)} type="password" placeholder="Nova senha" className="w-full p-3 rounded-lg bg-black/30 text-white" required />
        <button disabled={loading} className="w-full bg-[#E2C9A1] text-black py-3 rounded-lg font-bold">{loading?"Salvando...":"Salvar nova senha"}</button>
      </form>
    </div>
  )
}