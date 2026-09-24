"use client"; // Página de cliente pra usar Supabase
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; // Conexão com banco
import Link from "next/link";

export default function EscolherProduto() {
  // Guarda os 413 Pals do Supabase
  const [produtos, setProdutos] = useState<any[]>([]);
  const [busca, setBusca] = useState(""); // Pra filtrar

  // Carrega todos do banco - SELECT * FROM produtos
  const carregar = async () => {
    const { data } = await supabase.from("produtos").select("*").order("nome");
    if (data) setProdutos(data);
  };

  useEffect(() => { carregar(); }, []); // Roda quando entra na página

  // FUNÇÃO PRINCIPAL DO TCC: Listar produto na loja
  const listarProduto = async (p: any) => {
    // Pede preço e quantidade pro admin - seu fluxo
    const preco = prompt(`Qual preço para ${p.nome}?`, p.preco || "99.90");
    if (!preco) return;
    const qtd = prompt(`Quantas unidades de ${p.nome}?`, "10");
    if (!qtd) return;

    // UPDATE que faz aparecer no catálogo - o pulo do gato
    // O catálogo só mostra WHERE ativo_na_loja = true
    const { error } = await supabase.from("produtos").update({
      preco: parseFloat(preco),
      estoque: parseInt(qtd),
      ativo_na_loja: true // ESSA LINHA FAZ APARECER NO CATÁLOGO
    }).eq("id", p.id);

    if (!error) {
      alert(`${p.nome} LISTADO com sucesso! Vai aparecer no /catalogo`);
      carregar();
    }
  };

  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0B1325] p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-[#E2C9A1]">Escolher Produto para Loja - 413 Pals</h1>
        <Link href="/catalogo" className="bg-[#E2C9A1] text-black px-4 py-2 rounded-lg font-bold">Ver Catálogo</Link>
      </div>

      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Busque Anubis, Jetragon..." className="w-full bg-[#162342] p-4 rounded-xl border border-white/10 mb-6" />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {filtrados.slice(0, 120).map(p => (
          <div key={p.id} className={`p-3 rounded-xl border ${p.ativo_na_loja? "bg-green-900/30 border-green-500" : "bg-[#162342] border-white/10"}`}>
            <img src={p.imagem} className="w-full h-20 object-contain" />
            <p className="text-xs mt-2 truncate text-[#E2C9A1]">{p.nome}</p>
            <p className="text-[10px]">Estoque: {p.estoque} | R$ {p.preco}</p>
            {p.ativo_na_loja? (
              <span className="text-[10px] text-green-400 font-bold">✅ JÁ NA LOJA</span>
            ) : (
              <button onClick={()=>listarProduto(p)} className="w-full mt-2 bg-[#E2C9A1] text-black py-2 rounded text-xs font-bold">CLIQUE PARA LISTAR</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}