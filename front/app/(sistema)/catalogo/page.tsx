"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getProdutos, getCarrinho, addCarrinho } from "../../lib/api";

type Produto = { id: string; nome: string; imagem: string; preco: number; estoque: number; };

export default function CatalogoPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDoSupabase() {
      try {
        setLoading(true);
        const produtosDoBanco = await getProdutos();
        const carrinhoDoBanco = await getCarrinho();
        setProdutos(produtosDoBanco as any);
        setCarrinho(carrinhoDoBanco);
      } catch (erro) {
        console.error("Erro:", erro);
      } finally {
        setLoading(false);
      }
    }
    carregarDoSupabase();
  }, []);

  const adicionarAoCarrinho = async (produto: Produto) => {
    if (produto.estoque <= 0) return alert("Indisponível!");
    const existe = carrinho.find((i: any) => i.produto_id === produto.id);
    if (existe && existe.quantidade >= produto.estoque) return alert(`Só temos ${produto.estoque} unidades!`);
    try {
      await addCarrinho(produto.id);
      const novo = await getCarrinho();
      setCarrinho(novo);
    } catch (e) { alert("Erro ao adicionar"); }
  };

  const totalItens = carrinho.reduce((acc, i) => acc + i.quantidade, 0);
  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));

  if (loading) return <div className="min-h-screen bg-[#0B1325] flex items-center justify-center text-white">Carregando do Supabase...</div>

  return (
    <div className="min-h-screen bg-[#0B1325] p-4 md:p-8 text-white">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[#E2C9A1]">Catálogo</h1>
        <div className="flex gap-2">
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar..." className="bg-[#162342] p-3 rounded-lg border border-white/10 outline-none w-full md:w-64" />
          <Link href="/pedido" className="bg-[#E2C9A1] text-[#0B1325] px-6 py-3 rounded-lg font-bold">Carrinho ({totalItens})</Link>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtrados.map(p => {
          const indisponivel = p.estoque <= 0;
          return (
            <div key={p.id} className="relative bg-[#162342] p-4 rounded-xl border border-white/10">
              {indisponivel && <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center"><span className="bg-red-600 px-4 py-1 rounded-full font-bold text-sm">INDISPONÍVEL</span></div>}
              <img src={p.imagem} alt={p.nome} className={`w-full h-32 object-contain ${indisponivel?'grayscale':''}`} />
              <h3 className="text-[#E2C9A1] mt-2 truncate text-sm font-bold">{p.nome.replace(/_/g," ")}</h3>
              <p className="font-bold">R$ {Number(p.preco).toFixed(2)}</p>
              <button disabled={indisponivel} onClick={()=>adicionarAoCarrinho(p)} className={`w-full mt-3 py-2 rounded-lg font-bold text-sm ${indisponivel?'bg-gray-600':'bg-[#E2C9A1] text-[#0B1325]'}`}>{indisponivel?'Indisponível':'Adicionar'}</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}