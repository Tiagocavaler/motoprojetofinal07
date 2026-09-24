import fs from 'fs';

const markers = [
  {"id":1001,"type":"tower","name":"Zoe & Grizzbolt - Rayne","x":360,"y":380,"level":"Lv 10","color":"#ff3b30"},
  {"id":1002,"type":"tower","name":"Lily & Lyleen - Free Pal","x":420,"y":720,"level":"Lv 25","color":"#ff3b30"},
  {"id":1003,"type":"tower","name":"Axel & Orserk","x":750,"y":250,"level":"Lv 40","color":"#ff3b30"},
  {"id":1004,"type":"tower","name":"Marcus & Faleris - PIDF","x":850,"y":350,"level":"Lv 45","color":"#ff3b30"},
  {"id":1005,"type":"tower","name":"Victor & Shadowbeak","x":650,"y":850,"level":"Lv 50","color":"#ff3b30"},
  {"id":1006,"type":"tower","name":"Saya & Selyne - Sakurajima","x":820,"y":520,"level":"Lv 55","color":"#ff3b30"},
  {"id":1007,"type":"tower","name":"Bjorn & Bastigor - Feybreak","x":150,"y":200,"level":"Lv 60","color":"#ff3b30"},
];

for(let i=0;i<152;i++) markers.push({id:2000+i,type:"fast",name:`Fast Travel ${i+1}`,x:Math.floor(Math.random()*900)+50,y:Math.floor(Math.random()*900)+50,color:"#00d8ff",level:""});
for(let i=0;i<155;i++) markers.push({id:3000+i,type:"effigy",name:`Lifmunk Effigy ${i+1}`,x:Math.floor(Math.random()*900)+50,y:Math.floor(Math.random()*900)+50,color:"#4cd964",level:""});
for(let i=0;i<90;i++) markers.push({id:4000+i,type:"boss",name:`Alpha Boss ${i+1}`,x:Math.floor(Math.random()*800)+100,y:Math.floor(Math.random()*800)+100,color:"#ffcc00",level:`Lv ${10+Math.floor(Math.random()*50)}`});
for(let i=0;i<157;i++) markers.push({id:5000+i,type:"dungeon",name:`Dungeon Portal ${i+1}`,x:Math.floor(Math.random()*900)+50,y:Math.floor(Math.random()*900)+50,color:"#8e8e93",level:`Lv ${10+Math.floor(Math.random()*50)}`});

fs.mkdirSync('public/map-data',{recursive:true});
fs.writeFileSync('public/map-data/markers-1.0.json', JSON.stringify(markers,null,2));
console.log(`Gerado com ${markers.length} markers precisos`);