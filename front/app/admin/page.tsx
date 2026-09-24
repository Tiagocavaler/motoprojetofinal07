"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Cria o supabase aqui mesmo - não precisa importar
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<any>({});

  const carregar = async () => {
    const { data } = await supabase.from("produtos").select("*").order("nome");
    if (data) setProdutos(data);
  };

  useEffect(() => { carregar(); }, []);

  const aoDigitar = (id: string, campo: "preco" | "estoque", valor: string) => {
    setEditando((prev: any) => ({
     ...prev,
      [id]: {...prev[id], [campo]: valor }
    }));
  };

  const liberar = async (p: any) => {
    const dados = editando[p.id];
    if (!dados?.preco ||!dados?.estoque) return alert("Digite preço e quantidade!");
    const { error } = await supabase.from("produtos").update({
      preco: parseFloat(dados.preco),
      estoque: parseInt(dados.estoque),
      ativo_na_loja: true
    }).eq("id", p.id);
    if (!error) {
      alert(`${p.nome} listado!`);
      carregar();
    } else {
      alert("Erro: " + error.message);
    }
  };

  const removerDaLoja = async (id: string) => {
    await supabase.from("produtos").update({ ativo_na_loja: false, estoque: 0 }).eq("id", id);
    carregar();
  };

  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0B1325] p-4 text-white">
      <h1 className="text-2xl font-black text-[#E2C9A1] mb-4">Admin - Escolha o Pal e Liste</h1>
      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar Pal..." className="w-full bg-[#162342] p-3 rounded-xl border border-white/10 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtrados.slice(0,100).map(p => {
          const estaFora =!p.ativo_na_loja;
          return (
            <div key={p.id} className={`p-4 rounded-xl border ${estaFora? "bg-[#162342] border-white/10" : "bg-green-900/20 border-green-500/50"}`}>
              <img src={p.imagem} className="w-full h-20 object-contain" />
              <p className="text-sm mt-2 text-[#E2C9A1] truncate">{p.nome}</p>
              <p className="text-xs">Estoque: {p.estoque} | R$ {p.preco}</p>
              {estaFora? (
                <div className="mt-3 space-y-2">
                  <input type="number" placeholder="Preço ex: 99.90" onChange={e=>aoDigitar(p.id, "preco", e.target.value)} className="w-full bg-[#0B1325] p-2 rounded text-sm border border-white/10" />
                  <input type="number" placeholder="Qtd ex: 10" onChange={e=>aoDigitar(p.id, "estoque", e.target.value)} className="w-full bg-[#0B1325] p-2 rounded text-sm border border-white/10" />
                  <button onClick={()=>liberar(p)} className="w-full bg-[#E2C9A1] text-black py-2 rounded font-bold text-sm">Liberar p/ Loja</button>
                </div>
              ) : (
                <button onClick={()=>removerDaLoja(p.id)} className="w-full mt-3 bg-red-500/20 text-red-400 py-2 rounded text-xs border border-red-500/30">Remover da Loja</button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
}