import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  const fileName = searchParams.get('file');
  if(!key && !fileName) return new NextResponse('missing key', { status: 400 });

  // 1. Tenta local primeiro - você já tem 154 arquivos
  if(fileName){
    const localPath = path.join(process.cwd(), 'public', 'palicons', fileName);
    if(fs.existsSync(localPath)){
      const buf = fs.readFileSync(localPath);
      return new NextResponse(buf, {
        headers: { 'Content-Type': 'image/png', 'Cache-Control':'public, max-age=86400, immutable' }
      });
    }
  }

  // 2. Fallback externo só se não tiver local (Terraria novo)
  const urls = [
    `https://paldb.cc/images/pals/${key}.png`,
    `https://paldb.cc/images/pals/${key}_1.png`,
    `https://palworld.gg/images/pals/${key}.png`,
  ];

  for(const url of urls){
    try{
      const res = await fetch(url, { headers: { 'User-Agent':'Mozilla/5.0' } });
      if(res.ok){
        const buf = await res.arrayBuffer();
        return new NextResponse(buf, {
          headers: { 'Content-Type': 'image/png', 'Cache-Control':'public, max-age=86400' }
        });
      }
    }catch{}
  }
  return new NextResponse(null, { status: 404 });
}