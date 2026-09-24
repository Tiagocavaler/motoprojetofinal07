import { NextRequest, NextResponse } from 'next/server';
const JAVA_URL = process.env.JAVA_API_URL || 'http://localhost:8080';

export async function GET() {
  const res = await fetch(`${JAVA_URL}/api/clientes`);
  const data = await res.json();
  return NextResponse.json(data);
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${JAVA_URL}/api/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}