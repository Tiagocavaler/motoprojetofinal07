"use client"; // Componente de cliente, precisa usar useState e Supabase no navegador
import { useState, useEffect } from "react"; // useState guarda dados, useEffect roda quando carrega a página
import { supabase } from "../../lib/supabase"; // Importa conexão com Supabase - troque pra @/lib/supabase se seu alias funcionar
import Link from "next/link"; // Pra navegar entre páginas

export default function CadastroProduto() {
  // Estado que guarda todos os 413 Pals que vieram do Supabase
  const [produtos, setProdutos] = useState<any[]>([]);
  // Estado pra busca/filtro por nome
  const [busca, setBusca] = useState("");

  // Função que carrega tudo do Supabase - substitui o localStorage antigo
  const carregar = async () => {
    // SELECT * FROM produtos ORDER BY nome - pega os 413 Pals do banco
    const { data } = await supabase.from("produtos").select("*").order("nome");
    if (data) setProdutos(data); // Guarda no estado pra mostrar na tela
  };

  // useEffect roda 1 vez quando entra na página, igual componentDidMount
  useEffect(() => { carregar(); }, []);

  // Função pra editar quantidade - atualiza no Supabase direto
  const atualizarQtd = async (p: any) => {
    const qtd = prompt(`Nova quantidade para ${p.nome}:`, p.estoque);
    if (qtd === null) return; // Se clicou cancelar, não faz nada
    
    // UPDATE produtos SET estoque = X, ativo_na_loja = true/false WHERE id = Y
    // Se quantidade > 0, ativa na loja automaticamente
    await supabase.from("produtos").update({ 
      estoque: parseInt(qtd), 
      ativo_na_loja: parseInt(qtd) > 0 
    }).eq("id", p.id);
    
    carregar(); // Recarrega lista pra mostrar valor novo
  };

  // Função pra remover da loja - não apaga do banco, só desativa
  const remover = async (id: string) => {
    if (!confirm("Remover da loja? (vai ficar com estoque 0)")) return;
    // UPDATE produtos SET ativo_na_loja = false, estoque = 0 WHERE id = id
    // Isso faz sumir do catálogo porque o catálogo só mostra ativo_na_loja = true
    await supabase.from("produtos").update({ ativo_na_loja: false, estoque: 0 }).eq("id", id);
    carregar();
  };

  // Filtro de busca - filtra os 413 por nome digitado
  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0B1325] p-4 md:p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#E2C9A1]">Cadastro de Produto (Supabase)</h1>
        <Link href="/admin" className="bg-[#E2C9A1] text-black px-6 py-2 rounded-lg font-bold">CLIQUE PARA ESCOLHER</Link>
      </div>

      {/* Campo de busca pra filtrar os 413 */}
      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar Pal..." className="w-full mb-6 bg-[#162342] p-3 rounded-xl border border-white/10" />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* slice(0, 100) mostra só 100 por vez pra não travar o navegador com 413 */}
        {filtrados.slice(0, 100).map(p => (
          <div key={p.id} className="bg-[#162342] p-4 rounded-xl border border-white/10">
            <img src={p.imagem} className="w-full h-24 object-contain" alt={p.nome} />
            <p className="text-sm mt-2 text-[#E2C9A1] truncate">{p.nome}</p>
            <p className="font-bold">R$ {Number(p.preco).toFixed(2)}</p>
            {/* Mostra quantidade real do Supabase, não mais do localStorage */}
            <p className="text-xs">Qtd: {p.estoque} {p.estoque <=0 && <span className="text-red-400">- INDISPONÍVEL</span>}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={()=>atualizarQtd(p)} className="flex-1 bg-[#E2C9A1] text-black py-1 rounded text-xs font-bold">Editar</button>
              <button onClick={()=>remover(p.id)} className="flex-1 bg-red-500/20 text-red-400 py-1 rounded text-xs">Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}