import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 p-6 md:p-10 flex flex-col items-center">
      <Link
        href="/produtos"
        className="absolute top-6 right-6 md:top-8 md:right-8 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950 z-10"
      >
        Produto
      </Link>

      <div className="text-center mt-6 mb-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-slate-100">
          Bem vindo a ComunidadeClt!
        </h1>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
        
        {/* Container 1: GIF do Palls */}
        <Link
          href="/palls"
          className="group relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-blue-950/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <img
            src="/gifs/palls.gif" 
            alt="Palls GIF"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-6 flex flex-col justify-between">
            <h2 className="text-2xl font-bold text-slate-100 drop-shadow-md">Palls</h2>
            <div className="self-center rounded-md bg-slate-900/80 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700/60 shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
              Ver Coleção
            </div>
          </div>
        </Link>

        {/* Container 2: GIF dos Equipamentos */}
        <Link
          href="/equipamentos"
          className="group relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-blue-950/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <img
            src="/gifs/equipamentos.gif" 
            alt="Equipamentos GIF"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-6 flex flex-col justify-between">
            <h2 className="text-2xl font-bold text-slate-100 drop-shadow-md">Equipamentos</h2>
            <div className="self-center rounded-md bg-slate-900/80 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700/60 shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
              Ver Inventário
            </div>
          </div>
        </Link>

        {/* Container 3: GIF dos Recursos */}
        <Link
          href="/recursos"
          className="group relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-blue-950/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <img
            src="/gifs/recursos.gif" 
            alt="Recursos GIF"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-6 flex flex-col justify-between">
            <h2 className="text-2xl font-bold text-slate-100 drop-shadow-md">Recursos</h2>
            <div className="self-center rounded-md bg-slate-900/80 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700/60 shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
              Ver Estoque
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}