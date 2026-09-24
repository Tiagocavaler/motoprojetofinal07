"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function PedidoPage() {
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagando, setPagando] = useState(false);
  const router = useRouter();

  const carregar = async () => {
    const { data } = await supabase.from("carrinho").select("*, produtos(*)").order("created_at", {ascending:false});
    if(data) setCarrinho(data);
    setLoading(false);
  };
  useEffect(()=>{carregar()},[]);
  const total = carrinho.reduce((acc,i)=>acc+(i.produtos.preco*i.quantidade),0);

  const finalizar = async () => {
    setPagando(true);
    // Cria pedido fake que vai pro localStorage
    const novoPedido = {
      id: Math.random().toString(36).substring(2,10).toUpperCase(),
      total: total,
      itens: carrinho,
      status: "pago",
      created_at: new Date().toISOString()
    };

    // 1. Tenta salvar no Supabase (se falhar não importa)
    await supabase.from("pedidos").insert([{ total, itens: carrinho, status: "pago" }]);

    // 2. Salva no navegador - GARANTIDO que vai aparecer no /pedidos
    const pedidosAntigos = JSON.parse(localStorage.getItem("meus_pedidos") || "[]");
    localStorage.setItem("meus_pedidos", JSON.stringify([novoPedido,...pedidosAntigos]));

    // Limpa carrinho
    await supabase.from("carrinho").delete().neq("id","00000000-0000-0000-0000-000000000000");

    alert("Pagamento aprovado! ID: "+novoPedido.id);
    router.push("/pedidos");
  };

  if(loading) return <div className="min-h-screen bg-[#0B1325] flex items-center justify-center text-white">Carregando...</div>;
  if(carrinho.length===0) return <div className="min-h-screen bg-[#0B1325] flex items-center justify-center"><Link href="/catalogo" className="bg-[#E2C9A1] text-black px-6 py-3 rounded-xl font-bold">Ver Catálogo</Link></div>;

  return (
    <div className="min-h-screen bg-[#0B1325] p-8 text-white">
      <h1 className="text-2xl font-black text-[#E2C9A1] mb-6">Finalizar</h1>
      <p className="mb-4">Total: R$ {total.toFixed(2)} - {carrinho.length} itens</p>
      <button onClick={finalizar} disabled={pagando} className="w-full bg-[#E2C9A1] text-black py-4 rounded-xl font-black">{pagando?"PROCESSANDO...":"PAGAR COM PIX"}</button>
    </div>
  );
}