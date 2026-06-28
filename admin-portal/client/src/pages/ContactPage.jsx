import { motion } from 'framer-motion';
import { MessageCircle, Mail, Globe, ArrowRight } from 'lucide-react';
import SimplePage from '../components/SimplePage.jsx';

export default function ContactPage() {
  return (
    <SimplePage title="Contact Us" subtitle="We're here to help you succeed.">
      <style>{`@media(max-width:600px){.contact-grid{grid-template-columns:1fr!important;gap:16px!important;}}`}</style>
      <div className="contact-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, maxWidth:860, margin:'0 auto' }}>
        {[
          { icon:MessageCircle, color:'#25D366', bg:'#f0fdf4', border:'#bbf7d0', title:'WhatsApp (Fastest)', desc:'Chat with us directly on WhatsApp. Get answers in seconds.', cta:'Chat on WhatsApp', href:'https://wa.me/263719647303' },
          { icon:Mail, color:'#7c3aed', bg:'#f5f3ff', border:'#ddd6fe', title:'Email Support', desc:'Send us a detailed message and we\'ll respond within 24 hours.', cta:'Send Email', href:'mailto:support.fundo.ai@gmail.com' },
          { icon:Globe, color:'#2563eb', bg:'#eff6ff', border:'#bfdbfe', title:'WhatsApp Channel', desc:'Follow our channel for updates, tips and new features.', cta:'Join Channel', href:'https://whatsapp.com/channel/0029VbCigmv96H4JhJDwsd0X' },
          { icon:MessageCircle, color:'#d97706', bg:'#fffbeb', border:'#fde68a', title:'Upload Materials', desc:'Share past papers and study resources with fellow students.', cta:'Go to Upload', href:'/upload' },
        ].map((c, i) => (
          <motion.a key={c.title} href={c.href} target={c.href.startsWith('http')?'_blank':undefined}
            rel={c.href.startsWith('http')?'noopener noreferrer':undefined}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.08, duration:.4 }}
            style={{ display:'block', padding:32, borderRadius:20, background:'#fff', border:`1.5px solid ${c.border}`, textDecoration:'none', transition:'all .2s', boxShadow:'0 2px 8px rgba(0,0,0,.04)' }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow=`0 12px 32px ${c.bg}`;}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,.04)';}}>
            <div style={{ width:52, height:52, borderRadius:14, background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
              <c.icon size={22} style={{ color:c.color }} />
            </div>
            <div style={{ fontSize:17, fontWeight:800, color:'#111827', marginBottom:8 }}>{c.title}</div>
            <p style={{ fontSize:14, color:'#6b7280', lineHeight:1.65, marginBottom:16 }}>{c.desc}</p>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:14, fontWeight:700, color:c.color }}>
              {c.cta} <ArrowRight size={14}/>
            </div>
          </motion.a>
        ))}
      </div>
    </SimplePage>
  );
}
