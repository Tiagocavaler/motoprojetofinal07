import fs from 'fs';
import { createCanvas } from 'canvas';

// se não tiver canvas, faz sem: só cria JPG escuro válido
try {
  const canvas = createCanvas(2048, 1536);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0a1a2a';
  ctx.fillRect(0,0,2048,1536);
  // desenha ilhas fake pra parecer mapa
  ctx.fillStyle = '#1e3a2a';
  ctx.beginPath(); ctx.ellipse(400,400,200,200,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#2a3d1e';
  ctx.beginPath(); ctx.ellipse(1500,300,250,150,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#3d3420';
  ctx.beginPath(); ctx.ellipse(400,1000,250,250,0,0,Math.PI*2); ctx.fill();
  
  fs.mkdirSync('public/map',{recursive:true});
  fs.writeFileSync('public/map/palworld-official.jpg', canvas.toBuffer('image/jpeg'));
  console.log('Mapa gerado em public/map/palworld-official.jpg');
} catch {
  // fallback se não tiver canvas instalado - só cria pasta
  fs.mkdirSync('public/map',{recursive:true});
  console.log('Pasta public/map criada. Coloca qualquer JPG de 2048x1536 lá como palworld-official.jpg');
}