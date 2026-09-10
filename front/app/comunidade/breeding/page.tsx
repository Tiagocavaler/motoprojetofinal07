'use client';
import { useState, useEffect, useMemo } from 'react';

type Pal = {
  key: string;
  name: string;
  combiRank: number;
  combiPriority: number;
  uniqueOnly: boolean;
  paldex: number;
};

export default function BreedingCalculator(){
  const [pals, setPals] = useState<Pal[]>([]);
  const [uniqueCombos, setUniqueCombos] = useState<Record<string,string>>({});
  const [p1, setP1] = useState<Pal|null>(null);
  const [p2, setP2] = useState<Pal|null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function loadLive(){
      try{
        const res = await fetch('/api/pals');
        const data = await res.json();
        const rawPals = Array.isArray(data)? data : (data.pals || []);
        const list: Pal[] = rawPals.map((p:any)=>({
          key: p.key,
          name: p.name,
          combiRank: p.combiRank,
          combiPriority: p.combiPriority || p.combiRank*100,
          uniqueOnly:!!p.uniqueOnly,
          paldex: p.paldex || 0
        }));
        setPals(list);
        const combos: Record<string,string> = {};
        if(data.uniqueCombos){
          for(const c of data.uniqueCombos){
            const childName = rawPals.find((pp:any)=>pp.key===c.child)?.name || c.child;
            const a = rawPals.find((pp:any)=>pp.key===c.parents[0])?.name || c.parents[0];
            const b = rawPals.find((pp:any)=>pp.key===c.parents[1])?.name || c.parents[1];
            combos[`${a}+${b}`]=childName;
            combos[`${b}+${a}`]=childName;
          }
        }
        setUniqueCombos(combos);
      }finally{ setLoading(false); }
    }
    loadLive();
  },[]);

  function getChild(a:Pal|null,b:Pal|null){
    if(!a||!b) return null;
    const k=`${a.name}+${b.name}`;
    if(uniqueCombos[k]){
      const f=pals.find(p=>p.name===uniqueCombos[k]);
      if(f) return {...f,avg:f.combiRank,isSpecial:true} as any;
    }
    if(a.name===b.name) return {...a,avg:a.combiRank,isSpecial:false} as any;
    const avg=Math.floor((a.combiRank+b.combiRank+1)/2);
    let best=pals[0], bestDist=Infinity, bestPrio=-Infinity;
    for(const pal of pals){
      if(pal.uniqueOnly) continue;
      const d=Math.abs(pal.combiRank-avg);
      if(d<bestDist||(d===bestDist&&pal.combiPriority>bestPrio)){
        bestDist=d;bestPrio=pal.combiPriority;best=pal;
      }
    }
    return {...best,avg,isSpecial:false} as any;
  }

  const child = useMemo(()=>getChild(p1,p2),[p1,p2,pals,uniqueCombos]);

  if(loading) return (
    <div style={{minHeight:'100vh',background:'#0a1929',color:'white',display:'flex',alignItems:'center',justifyContent:'center'}}>
      Carregando 299 Pals AO VIVO...
    </div>
  );

  const filtered = pals.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>a.paldex - b.paldex);

  // COMPONENTE DE IMAGEM QUE USA NOSSA PONTE /api/pal-image
  const PalImg = ({ palKey, name, size=64 }: { palKey:string, name:string, size?:number }) => {
    const [failed, setFailed] = useState(false);

    if(failed){
      return (
        <div style={{
          width:size, height:size, background:'#1e3a5f', borderRadius:'50%',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontWeight:900, fontSize:size*0.4, color:'#60a5fa'
        }}>
          {name[0]}
        </div>
      )
    }

    return (
      <img
        src={`/api/pal-image?key=${palKey}`}
        alt={name}
        style={{width:size, height:size, objectFit:'contain'}}
        loading="lazy"
        onError={()=> setFailed(true)}
      />
    )
  };

  return(
    <div style={{minHeight:'100vh', background:'#0a1929', color:'white'}}>
      <div style={{padding:16, borderBottom:'1px solid #1e3a5f', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <b>AO VIVO - palworld.gg - {pals.length} Pals</b>
        <a href="/comunidade" style={{background:'#39df82', color:'#0a1929', padding:'6px 14px', borderRadius:20, textDecoration:'none', fontWeight:700}}>Voltar</a>
      </div>

      <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:16, padding:24, flexWrap:'wrap'}}>
        <div onClick={()=>setP1(null)} style={{width:190, height:190, background:'#0f2340', border:'2px solid #60a5fa', borderRadius:16, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', gap:6}}>
          {p1? <><PalImg palKey={p1.key} name={p1.name} size={72}/><b>{p1.name}</b><small style={{opacity:.6}}>#{p1.paldex} • {p1.combiRank}</small></> : <><b>Parent 1</b><small style={{opacity:.5}}>Clique abaixo</small></>}
        </div>
        <div style={{fontSize:32}}>+</div>
        <div onClick={()=>setP2(null)} style={{width:190, height:190, background:'#0f2340', border:'2px solid #f472b6', borderRadius:16, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', gap:6}}>
          {p2? <><PalImg palKey={p2.key} name={p2.name} size={72}/><b>{p2.name}</b><small style={{opacity:.6}}>#{p2.paldex} • {p2.combiRank}</small></> : <><b>Parent 2</b><small style={{opacity:.5}}>Clique abaixo</small></>}
        </div>
        <div style={{fontSize:32}}>=</div>
        <div style={{width:190, height:190, background:'#1a1a0e', border:'2px solid #facc15', borderRadius:16, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6}}>
          {child? <><PalImg palKey={child.key} name={child.name} size={72}/><b style={{color:'#fde047'}}>{child.name}</b><small>Média {(child as any).avg}</small>{(child as any).isSpecial && <small style={{color:'#39df82'}}>Especial!</small>}</> : <><span style={{fontSize:28}}>🥚</span><b>Child</b></>}
        </div>
      </div>

      <div style={{padding:'0 16px'}}>
        <input
          value={search}
          onChange={e=>setSearch(e.target.value)}
          placeholder="Buscar Pal (ex: Penking, Fenglope, Petallia)..."
          style={{width:'100%', height:44, background:'#0f2340', border:'1px solid #1e3a5f', borderRadius:22, padding:'0 18px', color:'white', outline:'none'}}
        />
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:10, padding:16}}>
        {filtered.map(pal=>(
          <div
            key={pal.key}
            onClick={()=>{ if(!p1) setP1(pal); else if(!p2) setP2(pal); else { setP1(pal); setP2(null); } }}
            style={{
              background: p1?.key===pal.key||p2?.key===pal.key?'#0f3d2a':'#122a4a',
              border:'1px solid #1e3a5f', borderRadius:12, padding:10,
              textAlign:'center', cursor:'pointer', display:'flex', flexDirection:'column',
              alignItems:'center', gap:6, minHeight:135, justifyContent:'center'
            }}
          >
            <div style={{width:72, height:72, background:'#0a1929', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <PalImg palKey={pal.key} name={pal.name} size={60}/>
            </div>
            <div style={{fontWeight:700, fontSize:12}}>{pal.name}</div>
            <div style={{fontSize:10, opacity:.6}}>#{pal.paldex} • {pal.combiRank}</div>
          </div>
        ))}
      </div>
    </div>
  )
}