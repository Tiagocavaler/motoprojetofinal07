import fs from 'fs'
import path from 'path'

function limparNome(file: string) {
  return file
    .replace(/T_ItemIcon_/gi, '')
    .replace(/\.png/gi, '')
    .replace(/_/g, ' ')
    .trim()
}

function listar(pasta: string, categoria: string) {
  const dir = path.join(process.cwd(), 'public', pasta)
  if (!fs.existsSync(dir)) return []
  
  return fs.readdirSync(dir)
    .filter(f => f.toLowerCase().endsWith('.png'))
    .map(file => ({
      nome: limparNome(file),
      arquivo: `/${pasta}/${file}`,
      imagem: `/${pasta}/${file}`,
      categoria
    }))
}

export async function GET() {
  const itens = [
    ...listar('armas', 'arma'),
    ...listar('arma', 'arma'),
    ...listar('armaduras', 'armadura'),
    ...listar('armadura', 'armadura'),
    ...listar('escudos', 'escudo'),
    ...listar('escudo', 'escudo'),
    ...listar('municao', 'municao'),
    ...listar('munição', 'municao'),
    ...listar('esferas', 'esfera'),
    ...listar('spheres', 'esfera'),
    ...listar('sphere', 'esfera'),
  ]

  // Remove duplicado pelo nome do arquivo
  const unicos = Array.from(new Map(itens.map(i => [i.arquivo, i])).values())
  
  // Ordena por nome
  unicos.sort((a,b) => a.nome.localeCompare(b.nome))

  return Response.json(unicos)
}