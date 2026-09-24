import fs from 'fs' // fs: módulo do Node pra ler pastas e arquivos do servidor
import path from 'path' // path: junta caminhos de pastas de forma segura

// GET: essa API é chamada pelo fetch('/api/avatares') do perfil
export async function GET() {
  // process.cwd() = pasta raiz do projeto, + public/pals = onde estão as PNGs da loja
  const dir = path.join(process.cwd(), 'public/pals')

  // readdirSync lê TODOS os arquivos da pasta pals/
  // filter só deixa passar quem termina em.png (ignora.txt,.DS_Store etc)
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'))

  // retorna a lista de nomes em JSON: ["T_Female_01.png", "T_Kunoichi01.png",...]
  // isso economiza espaço porque o front só recebe nomes, não as imagens
  return Response.json(files)
}