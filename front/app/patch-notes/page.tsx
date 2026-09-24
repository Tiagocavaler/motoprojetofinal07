import Link from "next/link";

function limpar(texto: string) {
  if(!texto) return "";
  return texto.replace(/\[p\]/g,"").replace(/\[\/p\]/g,"\n\n").replace(/\[list\]/g,"").replace(/\[\/list\]/g,"").replace(/\[\*\]/g,"• ").replace(/\[img\].*?\[\/img\]/g,"").replace(/\[url=?.*?\]/g,"").replace(/\[\/url\]/g,"").replace(/<[^>]*>/g,"").trim();
}

async function getPatch() {
  const res = await fetch("https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=1623730&count=1&tags=patchnotes&format=json", { next: { revalidate: 3600 } });
  const data = await res.json();
  return data.appnews.newsitems[0];
}

export default async function PatchNotesPage() {
  const patch = await getPatch();

  return (
    <div className="min-h-screen bg-[#0B1325] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block mb-6 bg-[#162342] border border-[#E2C9A1]/20 px-6 py-2 rounded-full text-sm font-bold">← Voltar</Link>

        <div className="flex items-center gap-3">
          <span className="text-[11px] tracking-[4px] text-[#E2C9A1] font-black">PATCH ATUAL</span>
          <span className="text-[10px] bg-[#E2C9A1] text-[#0B1325] px-2 py-1 rounded-full font-bold">AUTO-ATUALIZÁVEL</span>
        </div>

        <h1 className="text-3xl font-black mt-3">{patch.title}</h1>
        <p className="text-xs text-[#E2C9A1] mt-2">{new Date(patch.date*1000).toLocaleDateString('pt-BR')}</p>

        <div className="mt-6 bg-[#162342] border border-white/5 rounded-2xl p-6 text-[14px] leading-7 text-[#D3C9BF] whitespace-pre-wrap">
          {limpar(patch.contents)}
        </div>

        <p className="text-[11px] text-zinc-500 mt-4">Quando sair o v1.0.6, essa página atualiza sozinha e o v1.0.5 apaga.</p>
      </div>
    </div>
  );
}