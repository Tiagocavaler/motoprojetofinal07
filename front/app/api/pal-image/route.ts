import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  if(!key) return new NextResponse('missing key', { status: 400 });

  const urls = [
    `https://palworld.gg/images/pals/${key}.png`,
    `https://palworld.gg/_next/image?url=%2Fimages%2Fpals%2F${key}.png&w=256&q=75`,
  ];

  for(const url of urls){
    try{
      const res = await fetch(url, { headers: { 'User-Agent':'Mozilla/5.0' } });
      if(res.ok){
        const buf = await res.arrayBuffer();
        return new NextResponse(buf, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control':'public, max-age=86400'
          }
        });
      }
    }catch{}
  }
  return new NextResponse(null, { status: 404 });
}