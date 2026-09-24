"use client";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "@/lib/supabaseClient";

function format(tamanho: number, valor: string) {
  return `${String(tamanho).padStart(2, '0')}${valor}`;
}
function formatLen(valor: string) {
  return `${String(valor.length).padStart(2, '0')}${valor}`;
}
function crc16(payload: string) {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000)? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

export default function PixCheckout({ valor, pedidoId }: { valor: number, pedidoId: string }) {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("loja_config").select("*").single().then(({ data }) => {
      setConfig(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6 bg-[#162342] rounded-2xl text-zinc-400 text-sm">Carregando PIX...</div>;
  if (!config?.pix_chave) return <div className="p-6 bg-[#162342] rounded-2xl text-red-400 text-sm">PIX não configurado pelo administrador. Vá em /admin/config</div>;

  const chave = config.pix_chave.trim();
  const nome = (config.pix_nome || "PAL STORE").substring(0, 25).toUpperCase();
  const cidade = (config.pix_cidade || "CRICIUMA").substring(0, 15).toUpperCase();
  const valorStr = valor.toFixed(2);
  const txid = pedidoId.replace(/[^A-Za-z0-9]/g, '').substring(0, 25) || "***";

  // Monta campo 26
  const campo26Interno = `0014BR.GOV.BCB.PIX01${formatLen(chave)}`;
  const campo26 = `26${formatLen(campo26Interno)}`;

  const campo54 = `54${formatLen(valorStr)}`;
  const campo59 = `59${formatLen(nome)}`;
  const campo60 = `60${formatLen(cidade)}`;
  const campo62 = `62${formatLen(`05${formatLen(txid)}`)}05${formatLen(txid)}`;

  let payload = `000201${campo26}520400005303986${campo54}5802BR${campo59}${campo60}${campo62}6304`;
  payload += crc16(payload);

  return (
    <div className="bg-[#162342] border border-white/10 p-6 rounded-2xl text-center max-w-[340px] mx-auto">
      <h3 className="font-black text-[#E2C9A1] tracking-widest text-sm">PAGUE COM PIX</h3>
      <p className="text-[11px] text-zinc-400 mt-1">Conta do administrador: {nome}</p>

      <div className="bg-white p-4 rounded-xl mt-5 inline-block">
        <QRCodeCanvas value={payload} size={220} />
      </div>

      <p className="text-xs text-white mt-4 font-bold">R$ {valorStr}</p>
      <p className="text-[10px] text-zinc-500 break-all mt-3 bg-black/30 p-3 rounded-xl text-left">{payload}</p>

      <button
        onClick={() => {
          navigator.clipboard.writeText(payload);
          alert("Código PIX copiado!");
        }}
        className="w-full mt-4 bg-[#E2C9A1] text-black py-3 rounded-xl font-black text-sm"
      >
        COPIAR CÓDIGO PIX
      </button>
      <p className="text-[9px] text-zinc-600 mt-2">Pedido: {pedidoId}</p>
    </div>
  );
}