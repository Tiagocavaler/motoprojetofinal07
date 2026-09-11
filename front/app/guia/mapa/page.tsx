"use client";

export default function MapaPage() {
  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#0b1620] relative overflow-hidden">

      <iframe
        src="https://palworld.gg/map"
        className="absolute top-0 left-0 w-full h-full border-0"
        style={{ marginTop: '-56px', height: 'calc(100% + 56px)' }}
        allowFullScreen
      />

      {/* Só seu título por cima, sem bloquear nada */}
      <div className="absolute top-0 left-0 w-full h-[56px] bg-[#0b1620] z-10 flex items-center px-4 pointer-events-none">
        <span className="text-white text-sm font-bold pointer-events-auto">
          Mapa Interativo - Pal Dex
        </span>
      </div>
    </div>
  );
}