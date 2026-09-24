"use client"; // Componente de cliente (usa useState)

import { useState } from "react"; // Hook para criar estados
import Link from "next/link"; // Componente de link do Next.js sem reload
import { authClient } from "../login/types/cliente"; // Importa seu client de auth que tem o método forgot

// Componente da página Esqueci Senha
export default function EsqueciSenha(){
  const [email,setEmail] = useState(""); // Estado do campo de e-mail
  const [loading,setLoading]=useState(false); // Estado para saber se está enviando
  const [ok,setOk]=useState(false); // Estado para saber se já enviou o link

  // Função chamada ao enviar o formulário
  const handle = async (e:any)=>{
    e.preventDefault(); // Impede reload da página
    setLoading(true); // Ativa loading
    try{
      // Chama o método forgot do seu authClient passando o e-mail
      // Esse método vai disparar o ForgotRequest que você mostrou na foto
      await authClient.forgot({ email });
      setOk(true); // Marca como enviado com sucesso
    }catch(err:any){
      // Por segurança sempre mostra OK mesmo se o e-mail não existir
      // Isso evita que descubram quais e-mails estão cadastrados
      setOk(true);
    }finally{
      setLoading(false); // Desativa loading em qualquer caso
    }
  }

  return(
    // Container principal ocupando tela toda, centralizado, fundo verde escuro
    <div className="min-h-screen flex items-center justify-center bg-emerald-950 p-4">
      {/* Card com efeito vidro, borda e cantos arredondados */}
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[24px] p-8">
        <h1 className="text-2xl font-bold text-white">Recuperar senha</h1>
        <p className="text-emerald-200/60 text-sm mt-1 mb-6">Vamos enviar um link no seu e-mail.</p>
        {/* Se ok for true mostra mensagem de sucesso, se não mostra o formulário */}
        {ok? <p className="text-emerald-300 bg-emerald-500/10 p-3 rounded-xl text-sm text-center">Link enviado! Verifique seu e-mail.</p> :
        <form onSubmit={handle} className="space-y-4">
          {/* Input controlado pelo estado email */}
          <input value={email} onChange={e=>setEmail(e.target.value)} required type="email" placeholder="seu@email.com" className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none" />
          {/* Botão que desabilita enquanto está enviando e troca o texto */}
          <button disabled={loading} className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold">{loading?"Enviando...":"Enviar link"}</button>
        </form>}
        {/* Link para voltar ao login */}
        <Link href="/login" className="block text-center text-sm text-white/50 mt-6 hover:text-white">Voltar ao login</Link>
      </div>
    </div>
  )
}