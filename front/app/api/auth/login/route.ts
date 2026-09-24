import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("FRONT MANDOU:", body);

    const res = await fetch(`http://127.0.0.1:8081/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await res.text();
    console.log("JAVA RESPONDEU:", res.status, text);

    // devolve exatamente o que o Java respondeu
    return new NextResponse(text, { 
      status: res.status,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e: any) {
    console.error("ERRO REAL DA PONTE:", e);
    return NextResponse.json({ message: "ERRO REAL: " + e.message }, { status: 500 });
  }
}