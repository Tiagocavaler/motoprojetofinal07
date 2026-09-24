"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function EscolherPage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [itensPublic, setItensPublic] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const carregar = async () => {
    const { data } = await supabase.from("produtos").select("*").order("nome");
    if (data) setProdutos(data);
  };

  const carregarPublic = async () => {
    try {
      const res = await fetch("/api/itens");
      const data = await res.json();
      setItensPublic(data || []);
    } catch (e) {
      setItensPublic([]);
    }
  };

  useEffect(() => {
    carregar();
    carregarPublic();
  }, []);

  const cadastrarPublic = async (item: any, preco: string, qtd: string) => {
    const { error } = await supabase.from("produtos").insert({
      nome: item.nome,
      imagem: item.arquivo,
      preco: parseFloat(preco),
      estoque: parseInt(qtd),
      ativo_na_loja: true,
      categoria: item.categoria
    });
    if (error) alert(error.message);
    else carregar();
  };

  const filtradosPals = produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));

  const filtradosPublic = itensPublic.filter((i: any) => {
    const matchBusca = i.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCat = filtro === "todos" || i.categoria === filtro;
    return matchBusca && matchCat;
  });

  const jaExiste = (arquivo: string) => produtos.some(p => p.imagem === arquivo);

  return (
    <div className="min-h-screen bg-[#0B1325] p-6 text-white">
      <h1 className="text-2xl font-bold text-[#E2C9A1]">Admin - Escolha o Pal e Liste</h1>

      <input
        value={busca}
        onChange={e=>setBusca(e.target.value)}
        placeholder="Buscar Pal..."
        className="w-full bg-[#162342] p-4 rounded-xl mt-4 border border-white/10"
      />

      <div className="flex gap-2 mt-4 flex-wrap">
        {['todos','pal','arma','armadura','escudo','municao','esfera'].map(c => (
          <button key={c} onClick={()=>setFiltro(c)} className={`px-4 py-2 rounded-full text-xs font-bold ${filtro===c? 'bg-[#E2C9A1] text-black' : 'bg-[#162342] border border-white/10'}`}>
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      <h2 className="mt-8 font-bold text-[#E2C9A1]">Pals do Banco ({filtradosPals.length})</h2>

      <h2 className="mt-10 font-bold text-[#E2C9A1]">Itens da Public/ ({filtradosPublic.length}) - NOVO</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
        {filtradosPublic.map((item: any) => (
          <div key={item.arquivo} className="bg-[#162342] p-3 rounded-xl border border-white/10">
            <img src={item.arquivo} className="w-full h-20 object-contain" alt={item.nome} />
            <p className="text-xs mt-2 truncate">{item.nome}</p>
            <p className="text-[10px] text-zinc-400">{item.categoria}</p>
            {jaExiste(item.arquivo)?
              <span className="text-[10px] text-green-400">✅ NA LOJA</span> :
              <button onClick={()=>{ const preco=prompt("Preço?","99.90"); const qtd=prompt("Qtd?","10"); if(preco&&qtd) cadastrarPublic(item, preco, qtd)}} className="w-full mt-2 bg-[#E2C9A1] text-black py-2 rounded text-xs font-bold">Liberar p/ Loja</button>
            }
          </div>
        ))}
      </div>
    </div>
  );
}