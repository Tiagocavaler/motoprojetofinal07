'use client'

export default function BreedingInterno() {
  return (
    <div className="w-full h-screen bg-[#0f172a] flex flex-col">
      {/* Header seu, pra parecer que é seu */}
      <div className="bg-[#008069] p-4 text-white flex items-center gap-3">
        <button onClick={() => history.back()} className="text-xl">←</button>
        <div>
          <h1 className="font-bold leading-none">Calculadora de Breeding</h1>
          <p className="text-[11px] opacity-80">Dados do 1.0 - Interno</p>
        </div>
      </div>

      {/* AVISO DE CARREGAMENTO */}
      <div className="bg-yellow-500/10 text-yellow-300 text-[11px] p-2 text-center">
        Carregando calculadora oficial de forma interna, sem sair da sua loja
      </div>

      {/* O TRUQUE: iframe ocupando tudo */}
      <iframe
        src="https://palworld.gg/breeding-calculator"
        className="w-full flex-1 border-0"
        // sandbox deixa rodar mas sem redirecionar pra fora
        sandbox="allow-scripts allow-same-origin allow-forms"
        loading="lazy"
        title="Breeding Calculator"
      />
    </div>
  )
}