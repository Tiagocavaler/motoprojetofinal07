"use client";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [guiaAberto, setGuiaAberto] = useState(false);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black text-white">
      {/* GIF DE FUNDO QUE VC JÁ COLOCOU */}
      <img src="/home.gif" alt="bg" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/65" />

      {/* TOPO */}
      <div className="relative z-10 w-full min-h-screen flex flex-col p-6">
        <div className="w-full max-w-[1280px] mx-auto flex justify-end gap-3">

          {/* BOTÃO GUIA NOVO */}
          <div className="relative">
            <button
              onClick={() => setGuiaAberto(!guiaAberto)}
              className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 px-6 py-2 rounded-lg font-bold text-sm"
            >
              Guia {guiaAberto? "▲" : "▼"}
            </button>

            {/* MENU QUE APARECE IGUAL A SUA FOTO */}
            {guiaAberto && (
              <div className="absolute top-[50px] right-0 w-[240px] bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in">
                <div className="py-2 px-3 text-center">
                  <span className="text-[11px] tracking-[4px] text-white/50 font-black">GUIA</span>
                </div>

                <div className="flex flex-col">
                  <Link href="/guia/breeding" onClick={()=>setGuiaAberto(false)} className="py-3 text-center text-sm text-white/60 hover:text-white hover:bg-white/10 transition">
                    Breeding Calculadora
                  </Link>
                  <Link href="/guia/mapa" onClick={()=>setGuiaAberto(false)} className="py-3 text-center text-sm text-white/60 hover:text-white hover:bg-white/10 transition">
                    Mapa Interativo
                  </Link>
                  <Link href="/guia/pals" onClick={()=>setGuiaAberto(false)} className="py-3 text-center text-sm text-white/60 hover:text-white hover:bg-white/10 transition">
                    Tabela de Pals
                  </Link>
                  <Link href="/guia/tipos" onClick={()=>setGuiaAberto(false)} className="py-3 text-center text-sm text-white/60 hover:text-white hover:bg-white/10 transition">
                    Fraquezas
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/produto" className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-bold text-sm shadow-lg">
            Produto
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-black text-center drop-shadow-xl">
            Bem vindo a ComunidadeCIt!
          </h1>
        </div>
      </div>
    </div>
  );
}