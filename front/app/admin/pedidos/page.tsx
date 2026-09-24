"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [auto, setAuto] = useState(false);
  const intervalRef = useRef<any>(null);

  const carregar = () => {
    const salvos = JSON.parse(localStorage.getItem("meus_pedidos") || "[]");
    setPedidos(salvos);
  };
  useEffect(() => { carregar(); }, []);

  const mudarStatus = (id: string, novoStatus: string) => {
    const salvos = JSON.parse(localStorage.getItem("meus_pedidos") || "[]");
    const atualizados = salvos.map((p: any) => p.id === id? {...p, status: novoStatus } : p);
    localStorage.setItem("meus_pedidos", JSON.stringify(atualizados));
    carregar();
  };

  // MODO AUTOMÁTICO PRA BANCA - avança sozinho a cada 4 segundos
  const ativarAutomatico = () => {
    if (auto) { // Desativa
      clearInterval(intervalRef.current);
      setAuto(false);
      return;
    }
    setAuto(true);
    let etapa = 0;
    const ordem = ["pago", "embalando", "saiu_para_entrega", "entregue"];
    intervalRef.current = setInterval(() => {
      etapa++;
      if (etapa >= ordem.length) {
        clearInterval(intervalRef.current);
        setAuto(false);
        return;
      }
      // Pega o último pedido e avança
      const salvos = JSON.parse(localStorage.getItem("meus_pedidos") || "[]");
      if (salvos.length > 0) {
        const ultimoId = salvos[0].id;
        mudarStatus(ultimoId, ordem[etapa]);
      }
    }, 4000); // 4 segundos por etapa
  };

  return (
    <div className="min-h-screen bg-[#0B1325] p-6 text-white">
      <div className="flex justify-between items-center mb-6 max-w-5xl mx-auto">
        <h1 className="text-xl font-black text-[#E2C9A1]">Admin - Controle</h1>
        <div className="flex gap-2">
          <button onClick={ativarAutomatico} className={`px-4 py-2 rounded-xl text-xs font-bold ${auto?"bg-red-500 text-white":"bg-[#E2C9A1] text-black"}`}>
            {auto?"⏹️ Parar Auto":"▶️ Modo Automático Banca"}
          </button>
          <Link href="/pedidos" className="bg-white/10 px-4 py-2 rounded-xl text-xs">Ver Cliente</Link>
        </div>
      </div>

      {auto && <div className="max-w-5xl mx-auto mb-4 bg-green-500/20 border border-green-500/30 text-green-300 p-3 rounded-xl text-center text-sm animate-pulse">MODO AUTOMÁTICO ATIVO - Mudando status a cada 4 segundos pra demonstração</div>}

      <div className="space-y-4 max-w-5xl mx-auto">
        {pedidos.map(p => (
          <div key={p.id} className="bg-[#162342] p-5 rounded-2xl border border-white/10">
            <div className="flex justify-between mb-2">
              <p className="font-black text-[#E2C9A1]">Pedido #{p.id} - R$ {Number(p.total).toFixed(2)}</p>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 border">{p.status.toUpperCase()}</span>
            </div>
            <div className="bg-[#0B1325] p-3 rounded-xl mb-4 text-sm">
              {p.itens?.map((item:any,i:number)=><div key={i}>{item.quantidade}x {item.produtos?.nome}</div>)}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button onClick={()=>mudarStatus(p.id, "pago")} className="bg-white/10 py-2 rounded-xl text-xs">1. Pago</button>
              <button onClick={()=>mudarStatus(p.id, "embalando")} className="bg-yellow-500/20 text-yellow-300 py-2 rounded-xl text-xs">2. 📦 Embalando</button>
              <button onClick={()=>mudarStatus(p.id, "saiu_para_entrega")} className="bg-blue-500/20 text-blue-300 py-2 rounded-xl text-xs">3. 🚚 Entrega</button>
              <button onClick={()=>mudarStatus(p.id, "entregue")} className="bg-green-500/20 text-green-300 py-2 rounded-xl text-xs">4. ✅ Entregue</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}