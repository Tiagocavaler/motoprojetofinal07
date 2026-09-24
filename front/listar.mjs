import fs from 'fs';

const dir = './public/palicons';
const files = fs.readdirSync(dir);

console.log("Total arquivos:", files.length);

// Filtra só Pals de verdade (tira MobuCitizen, Female, etc)
const palsOnly = files.filter(f =>
 !f.includes('Mobu') &&
 !f.includes('Female') &&
 !f.includes('Male') &&
 !f.includes('Shop') &&
  f.startsWith('T_')
);

console.log("Só Pals:", palsOnly.length);

const map = {};
palsOnly.forEach(f => {
  const key = f.replace('T_','').replace('_icon_normal.png','').replace('_icon.png','').replace('.png','');
  if(!map[key]) map[key] = [];
  map[key].push(f);
});

console.log("\n--- DUPLICADOS ---");
Object.entries(map).forEach(([k,v]) => {
  if(v.length > 1) console.log(k, "=>", v.length, "arquivos");
});

const uniqueKeys = Object.keys(map);
fs.writeFileSync('./public/palicons-keys.json', JSON.stringify(uniqueKeys, null, 2));
console.log("\n✅ Gerado: public/palicons-keys.json com", uniqueKeys.length, "Pals únicos!");