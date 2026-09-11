import Link from "next/link";

export default function ProdutoPage() {
  return (
    <div className="w-full min-h-screen bg-[#020617] text-white p-6">
      <div className="w-full max-w-[1280px] mx-auto flex justify-between mb-8">
        <Link href="/home" className="text-slate-400">← Voltar</Link>
        <h1 className="text-2xl font-bold">Escolha a coleção</h1>
        <div className="w-[80px]" />
      </div>

      <div className="w-full max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/comunidade/palls" className="relative h-[520px] rounded-2xl overflow-hidden border border-slate-800 block group">
          <img src="/palls.gif" alt="Palls" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <h2 className="absolute top-4 left-4 font-bold text-xl">Palls</h2>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-xs">Ver Coleção</span>
        </Link>

        <Link href="/comunidade/equipamentos" className="relative h-[520px] rounded-2xl overflow-hidden border border-slate-800 block group">
          <img src="/equipamentos.gif" alt="Equip" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <h2 className="absolute top-4 left-4 font-bold text-xl">Equipamentos</h2>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-xs">Ver Inventário</span>
        </Link>

        <Link href="/comunidade/recursos" className="relative h-[520px] rounded-2xl overflow-hidden border border-slate-800 block group">
          <img src="/recursos.gif" alt="Recursos" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <h2 className="absolute top-4 left-4 font-bold text-xl">Recursos</h2>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-xs">Ver Estoque</span>
        </Link>
      </div>
    </div>
  );
}