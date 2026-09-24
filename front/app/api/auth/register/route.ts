import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch(`http://127.0.0.1:8081/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text, { 
      status: res.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e: any) {
    return NextResponse.json({ message: "ERRO REAL: " + e.message }, { status: 500 });
  }
}