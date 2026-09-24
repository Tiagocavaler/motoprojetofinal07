import fs from 'fs'
import path from 'path'
import { supabase } from '../../lib/supabase'

export async function GET() {
  const mapa = [
    { pasta: 'armas', categoria: 'arma' },
    { pasta: 'armaduras', categoria: 'armadura' },
    { pasta: 'armadura', categoria: 'armadura' },
    { pasta: 'escudos', categoria: 'escudo' },
    { pasta: 'escudo', categoria: 'escudo' },
    { pasta: 'municao', categoria: 'municao' },
    { pasta: 'esferas', categoria: 'esfera' },
    { pasta: 'spheres', categoria: 'esfera' },
  ]

  let total = 0
  for (const { pasta, categoria } of mapa) {
    const dir = path.join(process.cwd(), 'public', pasta)
    if (!fs.existsSync(dir)) continue
    const files = fs.readdirSync(dir).filter(f=>f.toLowerCase().endsWith('.png'))
    
    for (const file of files) {
      const nome = file.replace(/T_ItemIcon_/gi,'').replace(/\.png/gi,'').replace(/_/g,' ').trim()
      
      // não duplica
      const { data: existe } = await supabase.from('produtos').select('id').eq('nome', nome).eq('categoria', categoria).maybeSingle()
      if (existe) continue

      await supabase.from('produtos').insert([{
        nome,
        imagem: `/${pasta}/${file}`,
        arquivo: `/${pasta}/${file}`,
        categoria,
        preco: 100, // muda depois no admin
        estoque: 99,
        ativo_na_loja: true
      }])
      total++
    }
  }
  return Response.json({ mensagem: `Subiu ${total} produtos novos!`, total })
}