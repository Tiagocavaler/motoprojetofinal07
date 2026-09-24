import { NextResponse } from "next/server";
export async function GET() {
  try {
    const res = await fetch("https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=1623730&count=1&tags=patchnotes&format=json", { next: { revalidate: 3600 } });
    const data = await res.json();
    return NextResponse.json(data.appnews.newsitems[0]);
  } catch (e) {
    return NextResponse.json(null);
  }
}