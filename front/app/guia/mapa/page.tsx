// Informa ao Next.js que esse componente deve rodar no navegador (client component)
"use client";

// Componente da página do Mapa
export default function MapaPage() {
  return (
    // Div principal que ocupa toda a largura e a altura da tela menos 64px do header
    // bg-[#0b1620] é a cor de fundo escura, relative para posicionar filhos absolute, overflow-hidden para não ter scroll
    <div className="w-full h-[calc(100vh-64px)] bg-[#0b1620] relative overflow-hidden">

      {/* Iframe que carrega o mapa externo do site palworld.gg */}
      <iframe
        src="https://palworld.gg/map" // URL do mapa que será embutido
        className="absolute top-0 left-0 w-full h-full border-0" // Posiciona absoluto ocupando tudo, sem borda
        style={{ marginTop: '-56px', height: 'calc(100% + 56px)' }} // Sobe 56px pra esconder o header original do site do iframe e aumenta a altura pra compensar
        allowFullScreen // Permite colocar o iframe em tela cheia
      />

      {/* Faixa com seu título por cima do iframe, sem bloquear cliques no mapa */}
      <div className="absolute top-0 left-0 w-full h-[56px] bg-[#0b1620] z-10 flex items-center px-4 pointer-events-none">
        {/* Texto do título. pointer-events-auto faz só o texto receber clique, o resto da div deixa passar o clique pro mapa */}
        <span className="text-white text-sm font-bold pointer-events-auto">
          Mapa Interativo - Pal Dex
        </span>
      </div>
    </div>
  );
}