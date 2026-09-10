"use client";

import { useState } from "react";
import Link from "next/link";

// Função que pega a imagem do Pal direto da internet
const getImagemPal = (nome: string) => {
  const nomeLimpo = nome.toLowerCase().split(" ")[0];
  const mapa: any = {
    "anubis": "anubis",
    "jetragon": "jetragon",
    "esfera": "pal_sphere",
    "sela": "jetragon",
    "lingote": "ingot",
    "fragmento": "paldium"
  };
  // usa a API pública de imagens do Palworld
  const key = mapa[nomeLimpo] || nomeLimpo;
  return `https://raw.githubusercontent.com/mlg404/palworld-paldex-api/main/images/${key}.png`;
};

const MOCK_PRODUTOS = [
  { id: 1, nome: "Anubis Jetdragon", tipo: "Pall", preco: "R$ 45,00" },
  { id: 2, nome: "Jetragon Shiny", tipo: "Pall", preco: "R$ 80,00" },
  { id: 3, nome: "Esfera de Pal Lendária", tipo: "Equipamento", preco: "R$ 15,00" },
  { id: 4, nome: "Sela de Jetragon", tipo: "Equipamento", preco: "R$ 25,00" },
  { id: 5, nome: "Lingote de Pal metal", tipo: "Recursos", preco: "R$ 10,00" },
  { id: 6, nome: "Fragmento de Paldium", tipo: "Recursos", preco: "R$ 5,00" },
];

export default function Produto() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const produtosFiltrados = categoriaAtiva === "todos"
   ? MOCK_PRODUTOS
    : MOCK_PRODUTOS.filter((p) => p.tipo.toLowerCase() === categoriaAtiva.toLowerCase());

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 p-6 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-5xl flex justify-between items-center mb-8">
        <Link href="/" className="text-sm font-semibold text-slate-400 hover:text-blue-400 flex items-center gap-2">← Voltar para o Início</Link>
        <Link href="/produtos/novo" className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-semibold text-white">+ Novo Produto</Link>
      </div>

      <div className="w-full max-w-5xl mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Gestão de Produtos</h1>
        <p className="text-slate-400 text-sm">Gerencie e visualize o inventário completo da comunidade.</p>
      </div>

      <div className="w-full max-w-5xl mb-6 flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {[
          { id: "todos", label: "Todos os Produtos" },
          { id: "pall", label: "Palls" },
          { id: "equipamento", label: "Equipamentos" },
          { id: "recursos", label: "Recursos" },
        ].map((aba) => (
          <button key={aba.id} onClick={() => setCategoriaAtiva(aba.id)} className={`px-4 py-2 rounded-lg text-sm font-semibold ${categoriaAtiva === aba.id? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800"}`}>{aba.label}</button>
        ))}
      </div>

      <div className="w-full max-w-5xl overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-xs uppercase">
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Imagem</th>
              <th className="py-4 px-6">Nome</th>
              <th className="py-4 px-6">Tipo</th>
              <th className="py-4 px-6">Preço</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {produtosFiltrados.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40">
                <td className="py-4 px-6 font-mono text-slate-400">#{item.id}</td>
                <td className="py-4 px-6">
                  <img
                    src={getImagemPal(item.nome)}
                    alt={item.nome}
                    className="w-10 h-10 rounded-full object-cover bg-slate-800 border border-slate-700"
                    onError={(e) => { (e.target as any).src = `https://via.placeholder.com/40x40/1e293b/94a3b8?text=${item.nome[0]}` }}
                  />
                </td>
                <td className="py-4 px-6 font-medium">{item.nome}</td>
                <td className="py-4 px-6"><span className="px-2.5 py-0.5 rounded-full text-xs border bg-slate-800">{item.tipo}</span></td>
                <td className="py-4 px-6 font-semibold">{item.preco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}