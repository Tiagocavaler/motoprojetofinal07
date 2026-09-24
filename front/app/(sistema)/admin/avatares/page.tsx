"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminAvataresPage() {
  const [avatares, setAvatares] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [uploading, setUploading] = useState(false);

  const carregar = async () => {
    const { data } = await supabase.from("avatares_loja").select("*").order("created_at", { ascending: false });
    setAvatares(data || []);
  };

  useEffect(() => { carregar(); }, []);

  const upload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const fileName = `${Date.now()}-${file.name}`;
    const { error: upError } = await supabase.storage.from("avatares").upload(fileName, file);
    if (upError) { alert(upError.message); setUploading(false); return; }

    const { data: { publicUrl } } = supabase.storage.from("avatares").getPublicUrl(fileName);

    await supabase.from("avatares_loja").insert({ nome: nome || file.name, url: publicUrl });
    setNome("");
    await carregar();
    setUploading(false);
  };

  const deletar = async (id: string, url: string) => {
    if (!confirm("Deletar avatar?")) return;
    const path = url.split("/avatares/")[1];
    await supabase.storage.from("avatares").remove([path]);
    await supabase.from("avatares_loja").delete().eq("id", id);
    carregar();
  };

  return (
    <div className="p-6 bg-[#0B1325] min-h-screen text-white">
      <h1 className="text-xl font-black text-[#E2C9A1] tracking-widest">AVATARES DA LOJA</h1>
      <p className="text-[11px] text-zinc-500 mt-1">Esses PNGs aparecem para o usuário personalizar o perfil</p>

      <div className="mt-6 bg-[#162342] border border-white/10 p-5 rounded-2xl max-w-xl">
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do avatar (ex: Pal Dourado)" className="w-full bg-black/30 border border-white/10 p-3 rounded-xl text-sm mb-3 outline-none" />
        <label className="w-full bg-[#E2C9A1] text-black py-3 rounded-xl font-black text-xs flex justify-center cursor-pointer">
          {uploading? "ENVIANDO..." : "📤 SUBIR PNG"}
          <input type="file" accept="image/png,image/webp,image/jpeg" onChange={upload} className="hidden" />
        </label>
      </div>

      <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-3">
        {avatares.map((av) => (
          <div key={av.id} className="bg-[#162342] border border-white/10 p-2 rounded-xl relative group">
            <img src={av.url} className="w-full aspect-square object-contain bg-black/20 rounded-lg p-2" />
            <p className="text-[9px] text-center mt-2 text-zinc-400 truncate">{av.nome}</p>
            <button onClick={() => deletar(av.id, av.url)} className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] hidden group-hover:flex items-center justify-center">x</button>
          </div>
        ))}
      </div>
    </div>
  );
}