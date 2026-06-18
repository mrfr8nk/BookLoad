import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function SimplePage({ title, subtitle, children }) {
  return (
    <div style={{ minHeight:'100vh', background:'#fff' }}>
      {/* Minimal nav */}
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,.97)', backdropFilter:'blur(12px)', borderBottom:'1px solid #e5e7eb', padding:'0 clamp(16px,4vw,56px)', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#8b5cf6)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}} />
          </div>
          <span style={{ fontSize:16, fontWeight:900, color:'#111827', letterSpacing:'-.2px' }}>Fundo<span style={{ color:'#7c3aed' }}>AI</span></span>
        </a>
        <a href="/" style={{ display:'flex', alignItems:'center', gap:6, fontSize:13.5, fontWeight:600, color:'#6b7280', textDecoration:'none', padding:'7px 12px', borderRadius:8, border:'1px solid #e5e7eb', background:'#fff', transition:'all .15s' }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='#7c3aed';e.currentTarget.style.color='#7c3aed';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.color='#6b7280';}}>
          <ArrowLeft size={13}/> Back to Home
        </a>
      </nav>

      {/* Header */}
      <div style={{ background:'linear-gradient(180deg,#f3eeff 0%,#fff 100%)', padding:'64px clamp(16px,4vw,56px) 56px', textAlign:'center' }}>
        <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4 }}
          style={{ fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:900, color:'#111827', letterSpacing:'-.04em', marginBottom:12 }}>
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4, delay:.07 }}
            style={{ fontSize:16, color:'#6b7280' }}>
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Content */}
      <div style={{ padding:'48px clamp(16px,4vw,56px) 80px' }}>
        {children}
      </div>

      {/* Mini footer */}
      <div style={{ borderTop:'1px solid #e5e7eb', background:'#f9fafb', padding:'20px clamp(16px,4vw,56px)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <p style={{ fontSize:12.5, color:'#9ca3af' }}>© 2026 Fundo AI. All rights reserved.</p>
        <div style={{ display:'flex', gap:20 }}>
          {[['Privacy','/privacy'],['Terms','/terms'],['Help','/help'],['Contact','/contact']].map(([l,h])=>(
            <a key={l} href={h} style={{ fontSize:12.5, color:'#9ca3af', textDecoration:'none' }}
              onMouseEnter={e=>e.target.style.color='#7c3aed'} onMouseLeave={e=>e.target.style.color='#9ca3af'}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  );
}
