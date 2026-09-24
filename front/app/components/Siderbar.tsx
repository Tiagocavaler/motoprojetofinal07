"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Siderbar(){
  const pathname = usePathname();
  const active = (p: string) => pathname === p;
  return (
    <aside style={{ width: 260, minHeight: '100%', backgroundColor: 'rgba(17, 28, 53, 0.85)', backdropFilter: 'blur(10px)', borderRight: '1px solid rgba(226, 201, 161, 0.1)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E2C9A1', marginBottom: '0.5rem' }}>Menu</p>
      <Link href="/home" style={{ padding: '0.7rem 1rem', borderRadius: 12, background: active('/home') ? 'rgba(226,201,161,0.15)' : 'transparent', color: active('/home') ? '#E2C9A1' : '#D3C9BF', border: '1px solid', borderColor: active('/home') ? '#E2C9A1' : 'transparent', textDecoration: 'none' }}>🏪 Loja</Link>
      <Link href="/guia" style={{ padding: '0.7rem 1rem', borderRadius: 12, background: active('/guia') ? 'rgba(226,201,161,0.15)' : 'transparent', color: active('/guia') ? '#E2C9A1' : '#D3C9BF', border: '1px solid', borderColor: active('/guia') ? '#E2C9A1' : 'transparent', textDecoration: 'none' }}>🗺️ Guia / Mapa</Link>
      <Link href="/produto" style={{ padding: '0.7rem 1rem', borderRadius: 12, background: active('/produto') ? 'rgba(226,201,161,0.15)' : 'transparent', color: active('/produto') ? '#E2C9A1' : '#D3C9BF', border: '1px solid', borderColor: active('/produto') ? '#E2C9A1' : 'transparent', textDecoration: 'none' }}>🧮 Calculadora</Link>
    </aside>
  );
}