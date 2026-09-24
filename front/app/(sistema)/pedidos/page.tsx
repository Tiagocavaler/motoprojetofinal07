"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const ETAPAS = [
  { id: "pago", titulo: "Pagamento Aprovado", desc: "Pagamento confirmado" },
  { id: "embalando", titulo: "Sendo Embalado", desc: "Preparando seu Pal" },
  { id: "saiu_para_entrega", titulo: "Saiu para Entrega", desc: "A caminho" },
  { id: "entregue", titulo: "Entregue", desc: "Entregue!" },
];

export default function MeusPedidosPage() {
  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
    // Lê do navegador onde salvamos no passo 1
    const salvos = JSON.parse(localStorage.getItem("meus_pedidos") || "[]");
    setPedidos(salvos);
  }, []);

  if (pedidos.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B1325] flex items-center justify-center">
        <div className="bg-[#1A2A4A] p-8 rounded-2xl text-center">
          <p className="text-white/60 mb-4">Nenhum pedido encontrado ainda</p>
          <Link href="/catalogo" className="bg-[#E2C9A1] text-black px-6 py-3 rounded-xl font-bold">Ver Catálogo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1325] p-6 text-white">
      <h1 className="text-2xl font-black text-[#E2C9A1] mb-6">Meus Pedidos</h1>
      <div className="grid gap-6 max-w-4xl mx-auto">
        {pedidos.map(pedido => {
          const etapaAtualIndex = ETAPAS.findIndex(e => e.id === pedido.status);
          return (
            <div key={pedido.id} className="bg-[#162342] p-6 rounded-2xl border border-white/10">
              <div className="flex justify-between mb-6">
                <p className="font-black text-[#E2C9A1]">Pedido #{pedido.id}</p>
                <p>R$ {Number(pedido.total).toFixed(2)}</p>
              </div>
              <div className="relative flex justify-between mb-6">
                <div className="absolute top-4 left-0 right-0 h-1 bg-white/10"></div>
                <div className="absolute top-4 left-0 h-1 bg-[#E2C9A1]" style={{width: `${(etapaAtualIndex/(ETAPAS.length-1))*100}%`}}></div>
                {ETAPAS.map((etapa, index) => {
                  const concluida = index <= etapaAtualIndex;
                  return (
                    <div key={etapa.id} className="flex flex-col items-center z-10 w-1/4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${concluida?"bg-[#E2C9A1] text-black":"bg-[#0B1325] border border-white/20 text-white/40"}`}>{concluida?"✓":index+1}</div>
                      <p className="text-[10px] mt-2 text-center font-bold">{etapa.titulo}</p>
                    </div>
                  );
                })}
              </div>
              <div className="bg-[#0B1325] p-3 rounded-xl text-sm">
                {pedido.itens?.map((item:any,i:number)=><div key={i}>{item.quantidade}x {item.produtos?.nome}</div>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}