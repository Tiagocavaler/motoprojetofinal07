"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SistemaHeader() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <header className="bg-[#162342] border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/admin/pedidos" className="font-black text-[#E2C9A1]">ADMIN</Link>
        <div className="flex gap-2">
          <Link href="/admin/pedidos" className="bg-[#E2C9A1] text-black px-4 py-2 rounded-xl text-xs font-bold">Pedidos</Link>
          <Link href="/catalogo" className="bg-white/10 px-4 py-2 rounded-xl text-xs text-white">Ver Loja</Link>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-[#162342] border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/catalogo" className="font-black text-[#E2C9A1] text-lg">PAL STORE</Link>
      <nav className="flex gap-3 items-center">
        <Link href="/catalogo" className="text-xs px-3 py-2 rounded-lg bg-white/10 text-white">Catálogo</Link>
        <Link href="/carrinho" className="text-xs px-3 py-2 rounded-lg bg-white/10 text-white">Carrinho</Link>
        <Link href="/pedidos" className="text-xs px-4 py-2 rounded-xl font-bold bg-[#E2C9A1] text-black">Meus Pedidos</Link>
      </nav>
    </header>
  );
}