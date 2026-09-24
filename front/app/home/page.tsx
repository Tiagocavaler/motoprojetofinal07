"use client";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [guiaAberto, setGuiaAberto] = useState(false);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0B1325] text-white">
      <img src="/home.gif" alt="background palworld" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />

      <div className="relative z-10 w-full min-h-screen flex flex-col p-6">
        <div className="w-full max-w-[1280px] mx-auto flex justify-end gap-3">

          <div className="relative">
            <button
              onClick={() => setGuiaAberto(!guiaAberto)}
              className="bg-[rgba(17,28,53,0.85)] hover:bg-[rgba(22,35,66,0.9)] border border-[rgba(226,201,161,0.2)] px-6 py-2 rounded-full font-bold text-sm text-[#FAF9F6] backdrop-blur-md transition-all"
            >
              Guia {guiaAberto? "▲" : "▼"}
            </button>

            {guiaAberto && (
              <div className="absolute top-[50px] right-0 w-[240px] bg-[#162342] border border-[rgba(226,201,161,0.2)] rounded-xl overflow-hidden shadow-2xl">
                <div className="py-2 px-3 text-center border-b border-white/5">
                  <span className="text-[11px] tracking-[4px] text-[#E2C9A1] font-black">GUIA</span>
                </div>
                <div className="flex flex-col">
                  <Link href="/guia/breeding" onClick={()=>setGuiaAberto(false)} className="py-3 text-center text-sm text-[#D3C9BF] hover:text-[#E2C9A1] hover:bg-white/5 transition">
                    Breeding Calculadora
                  </Link>
                  <Link href="/guia/mapa" onClick={()=>setGuiaAberto(false)} className="py-3 text-center text-sm text-[#D3C9BF] hover:text-[#E2C9A1] hover:bg-white/5 transition">
                    Mapa Interativo
                  </Link>
                  <Link href="/guia/pals" onClick={()=>setGuiaAberto(false)} className="py-3 text-center text-sm text-[#D3C9BF] hover:text-[#E2C9A1] hover:bg-white/5 transition">
                    Tabela de Pals
                  </Link>
                  <Link href="/guia/tipos" onClick={()=>setGuiaAberto(false)} className="py-3 text-center text-sm text-[#D3C9BF] hover:text-[#E2C9A1] hover:bg-white/5 transition">
                    Fraquezas
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* MUDADO AQUI: Produto -> Catálogo */}
          <Link href="/catalogo" className="bg-[#E2C9A1] hover:bg-white text-[#0B1325] px-6 py-2 rounded-full font-bold text-sm shadow-lg transition">
            Catálogo
          </Link>

          <Link href="/login" className="bg-white text-black hover:bg-zinc-200 px-6 py-2 rounded-full font-bold text-sm shadow-lg">
            Área Restrita
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-black text-center drop-shadow-xl text-[#FAF9F6]">
            Bem vindo a ComunidadeClt!
          </h1>
          <p className="mt-4 text-[#D3C9BF]">Guia aberto pra todos. Produtos só para o vendedor.</p>
        </div>
      </div>
    </div>
  );
}