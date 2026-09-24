import { NextRequest, NextResponse } from 'next/server';

const JAVA_URL = process.env.JAVA_API_URL || 'http://localhost:8080';

export async function GET() {
  const res = await fetch(`${JAVA_URL}/api/pedidos`, { cache: 'no-store' });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json(); // { clienteId, produtosIds, status }

  const javaBody = {
    status: body.status, // "PENDENTE" ou "ENTREGUE"
    cliente: { id: body.clienteId },
    produtos: body.produtosIds.map((id: number) => ({ id })),
  };

  const res = await fetch(`${JAVA_URL}/api/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(javaBody),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}