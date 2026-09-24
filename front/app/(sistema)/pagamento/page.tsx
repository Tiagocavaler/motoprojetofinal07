"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// Cria Supabase aqui pra não dar erro de import igual antes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PagamentoPage() {
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [metodo, setMetodo] = useState<"pix" | "cartao">("pix");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Carrega carrinho do Supabase - SELECT * FROM carrinho + produtos
  const carregarCarrinho = async () => {
    const { data } = await supabase.from("carrinho").select("*, produtos(*)").order("created_at", { ascending: false });
    if (data) setCarrinho(data);
  };

  useEffect(() => { carregarCarrinho(); }, []);

  const total = carrinho.reduce((acc, item) => acc + (item.produtos.preco * item.quantidade), 0);

  // Função final do TCC - cria pedido e da baixa no estoque
  const finalizarPagamento = async () => {
    if (carrinho.length === 0) return alert("Carrinho vazio!");
    setLoading(true);

    try {
      // 1. Cria pedido na tabela pedidos - INSERT INTO pedidos
      const { data: pedido, error } = await supabase.from("pedidos").insert([{
        total: total,
        itens: carrinho, // Salva o carrinho inteiro como JSON
        status: metodo === "pix"? "pago" : "pago", // Simula pagamento aprovado
        metodo_pagamento: metodo
      }]).select().single();

      if (error) throw error;

      // 2. Da baixa no estoque dos Pals vendidos - UPDATE produtos SET estoque = estoque - qtd
      for (const item of carrinho) {
        const novoEstoque = item.produtos.estoque - item.quantidade;
        await supabase.from("produtos").update({
          estoque: novoEstoque,
          ativo_na_loja: novoEstoque > 0 // Se zerou, sai da loja
        }).eq("id", item.produto_id);
      }

      // 3. Limpa carrinho - DELETE FROM carrinho
      await supabase.from("carrinho").delete().gt("quantidade", 0);

      alert(`Pagamento ${metodo.toUpperCase()} aprovado! Pedido #${pedido.id.slice(0,8)}`);
      router.push("/pedidos"); // Vai pra meus pedidos

    } catch (e: any) {
      alert("Erro: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1325] p-4 md:p-8 text-white">
      <h1 className="text-2xl font-black text-[#E2C9A1] mb-6">Método de Pagamento</h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Escolher método */}
        <div className="bg-[#162342] p-6 rounded-2xl border border-white/10">
          <h2 className="font-bold mb-4">Escolha como pagar</h2>

          <button onClick={()=>setMetodo("pix")} className={`w-full p-4 rounded-xl border mb-3 text-left ${metodo==="pix"? "bg-[#E2C9A1] text-black border-[#E2C9A1]" : "bg-[#0B1325] border-white/10"}`}>
            <p className="font-bold">PIX - Aprovação Instantânea</p>
            <p className="text-xs">QR Code gerado na hora</p>
          </button>

          <button onClick={()=>setMetodo("cartao")} className={`w-full p-4 rounded-xl border text-left ${metodo==="cartao"? "bg-[#E2C9A1] text-black border-[#E2C9A1]" : "bg-[#0B1325] border-white/10"}`}>
            <p className="font-bold">Cartão de Crédito</p>
            <p className="text-xs">Simulado para o TCC</p>
          </button>

          {metodo==="pix" && (
            <div className="mt-6 bg-white p-4 rounded-xl text-black text-center">
              <p className="text-xs">QR CODE PIX SIMULADO</p>
              <div className="w-40 h-40 bg-black/10 mx-auto my-2 flex items-center justify-center text-[10px]">QR CODE AQUI</div>
              <p className="text-[10px]">Copia e cola: 00020126...</p>
            </div>
          )}
        </div>

        {/* Resumo */}
        <div className="bg-[#162342] p-6 rounded-2xl border border-white/10 h-fit">
          <h2 className="font-bold mb-4">Resumo do Pedido</h2>
          {carrinho.map(item => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.produtos.nome} x{item.quantidade}</span>
              <span>R$ {(item.produtos.preco * item.quantidade).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-white/10 mt-4 pt-4 flex justify-between font-black text-[#E2C9A1]">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>

          <button onClick={finalizarPagamento} disabled={loading} className="w-full mt-6 bg-[#E2C9A1] text-black py-4 rounded-xl font-black">
            {loading? "Processando..." : `PAGAR COM ${metodo.toUpperCase()} - R$ ${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}