import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://cdn.jsdelivr.net/gh/dgonzalez2019/palworldbreeding@main/data/pals.json', {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error('cdn falhou');
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    try {
      const res2 = await fetch('https://raw.githubusercontent.com/dgonzalez2019/palworldbreeding/main/data/pals.json');
      const data2 = await res2.json();
      return NextResponse.json(data2);
    } catch {
      return NextResponse.json({ pals: [], uniqueCombos: [] }, { status: 500 });
    }
  }
}