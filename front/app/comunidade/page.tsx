import Link from 'next/link';

export default function Comunidade(){
  return(
    <div style={{minHeight:'100vh', background:'#0a1929', color:'white', padding:24}}>
      <h1>Comunidade</h1>
      <Link href="/comunidade/breeding" style={{display:'inline-block', marginTop:20, background:'#39df82', color:'#0a1929', padding:'12px 20px', borderRadius:12, textDecoration:'none', fontWeight:700}}>
        🧬 Abrir Calculadora de Breeding - 199 Pals
      </Link>
    </div>
  )
}