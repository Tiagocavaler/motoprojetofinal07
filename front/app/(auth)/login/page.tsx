"use client"; // Diz pro Next.js que esse componente roda no NAVEGADOR, não no servidor. Precisa pra usar localStorage e useState.

import { useState } from "react"; // Hook pra guardar e atualizar valores na tela (email e senha)
import { useRouter } from "next/navigation"; // Hook pra fazer navegação entre páginas tipo router.push("/admin")
import Link from "next/link"; // Componente do Next pra criar links sem recarregar a página

export default function LoginPage() {
  // Estados que guardam o que o usuário digita
  const [email, setEmail] = useState(""); // Começa vazio
  const [senha, setSenha] = useState(""); // Começa vazio
  const router = useRouter(); // Instancia o roteador pra poder mandar pra /admin ou /catalogo

  // Função principal chamada quando clica em ENTRAR
  const entrar = () => {
    // --- 1. LOGIN DO ADMIN (FIXO PARA O TCC) ---
    // Se for exatamente esse email e senha, é o admin
    if (email === "admin@palworld.com" && senha === "admin123") {
      // Salva no localStorage quem está logado. O admin/page.tsx vai ler isso pra deixar entrar
      // role: "admin" é a permissão que libera a página restrita
      localStorage.setItem("usuario_logado", JSON.stringify({ email, role: "admin", nome: "Admin" }));
      router.push("/admin"); // Manda pra área restrita
      return; // Para a função aqui, não continua pro login de cliente
    }

    // --- 2. LOGIN DE CLIENTE ---
    // Pega todos os usuários que já foram cadastrados no sistema (se tiver página de cadastro)
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    // Procura se existe um usuário com esse email e senha na lista
    const user = usuarios.find((u: any) => u.email === email && u.senha === senha);

    // Se achou o usuário OU se o cara digitou qualquer coisa (modo fácil pro TCC sem cadastro)
    if (user || (email && senha)) {
      // Se achou, usa ele. Se não, cria um cliente na hora com o nome sendo o começo do email
      const cliente = user || { email, nome: email.split('@')[0], role: "cliente" };
      // Salva como cliente logado. role: "cliente" não tem acesso ao /admin
      localStorage.setItem("usuario_logado", JSON.stringify({...cliente, role: "cliente" }));
      router.push("/catalogo"); // Manda pra loja
    } else {
      // Se não digitou nada ou senha errada
      alert("E-mail ou senha incorretos");
    }
  };

  // --- PARTE VISUAL (JSX) ---
  return (
    <div className="min-h-screen bg-[#0B1325] flex items-center justify-center p-4 text-white">
      <div className="bg-[#162342] p-8 rounded-2xl w-full max-w-sm border border-white/10">
        <Link href="/" className="text-xs text-gray-400">← Voltar</Link>
        <h1 className="text-2xl font-black text-[#E2C9A1] mt-4">Entrar</h1>
        <p className="text-[11px] text-gray-400 mt-1">Admin: admin@palworld.com / admin123</p>

        {/* Input de email: value liga no estado, onChange atualiza o estado quando digita */}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-mail" className="w-full mt-6 bg-[#0B1325] p-3 rounded-lg border border-white/10 outline-none" />
        {/* Input de senha: type="password" esconde a senha */}
        <input value={senha} onChange={e=>setSenha(e.target.value)} type="password" placeholder="Senha" className="w-full mt-3 bg-[#0B1325] p-3 rounded-lg border border-white/10 outline-none" />

        {/* Botão que chama a função entrar() */}
        <button onClick={entrar} className="w-full mt-6 bg-[#E2C9A1] text-black py-3 rounded-lg font-black">ENTRAR</button>
      </div>
    </div>
  );
}