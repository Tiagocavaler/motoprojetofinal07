import { NextResponse } from "next/server";
export async function GET() {
  try {
    const res = await fetch("https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=1623730&count=50&format=json", { next: { revalidate: 3600 } });
    const data = await res.json();
    // FILTRO: remove tudo que é patch notes, sobra só novidade do jogo
    const novidades = data.appnews.newsitems.filter((n: any) =>!n.tags?.includes("patchnotes"));
    return NextResponse.json(novidades.slice(0, 10));
  } catch (e) {
    return NextResponse.json([]);
  }
}