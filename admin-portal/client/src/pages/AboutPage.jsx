import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Linkedin, Twitter, Mail, Users, BookOpen, Zap, Clock } from 'lucide-react';

const C = {
  purple:   '#7c3aed',
  purpleDk: '#6d28d9',
  dark:     '#1a0a2e',
  gray50:   '#f9fafb',
  gray100:  '#f3f4f6',
  gray200:  '#e5e7eb',
  gray500:  '#6b7280',
  gray600:  '#4b5563',
  gray700:  '#374151',
  gray900:  '#111827',
};

const FALLBACK_TEAM = [
  { name:'Darrell Mucheri',       title:'Chief Executive Officer',         role:'CEO & Lead Engineer',  order:0, quote:'"Every Zimbabwean student deserves world-class AI tools — built for their curriculum, not borrowed from elsewhere."', photo:'' },
  { name:'Crejinai Makanyisa',    title:'Chief Financial Officer',         role:'CFO',                   order:1, quote:'"Sound financial strategy is what turns a vision into a product that truly reaches the students who need it."', photo:'' },
  { name:'Vincent Ganiza',        title:'Chief Technology Officer',        role:'CTO',                   order:2, quote:'"We build for reliability and scale — so every student gets the same fast, intelligent experience."', photo:'' },
  { name:'Denzel Muchevhi',       title:'Chief Operations Officer',        role:'COO',                   order:3, quote:'"Operational excellence means that the technology we build actually reaches students in the classroom."', photo:'' },
];

const STATS = [
  { value:'2,000+', label:'Students Helped',     icon:Users },
  { value:'270+',   label:'Past Papers',          icon:BookOpen },
  { value:'5+',     label:'AI Tools',             icon:Zap },
  { value:'24/7',   label:'Always Available',     icon:Clock },
];

function Avatar({ member, size = 96 }) {
  const [imgErr, setImgErr] = useState(false);
  const initials = member.name.split(' ').map(n => n[0]).slice(0, 2).join('');
  const colors = ['#7c3aed','#059669','#2563eb','#d97706','#9333ea','#dc2626'];
  const color = colors[member.order % colors.length];

  if (member.photo && !imgErr) {
    return (
      <img src={member.photo} alt={member.name} onError={() => setImgErr(true)}
        style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', border:`3px solid ${color}30` }}/>
    );
  }
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:`linear-gradient(135deg,${color},${color}cc)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 6px 24px ${color}33` }}>
      <span style={{ fontSize:size*0.33, fontWeight:900, color:'#fff', letterSpacing:'-1px' }}>{initials}</span>
    </div>
  );
}

export default function AboutPage() {
  const [team, setTeam] = useState(null);

  useEffect(() => {
    fetch('/api/team')
      .then(r => r.json())
      .then(d => setTeam(Array.isArray(d) && d.length > 0 ? d : FALLBACK_TEAM))
      .catch(() => setTeam(FALLBACK_TEAM));
  }, []);

  const displayTeam = team || FALLBACK_TEAM;

  return (
    <div style={{ minHeight:'100vh', fontFamily:"'Inter', system-ui, sans-serif", background:'#fff' }}>
      {/* Navbar */}
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,.95)', backdropFilter:'blur(12px)', borderBottom:`1px solid ${C.gray200}`, padding:'0 clamp(16px,4vw,56px)', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none' }}>
          <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#8b5cf6)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <img src="https://media.mrfrankofc.gleeze.com/media/fcnd.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}}/>
          </div>
          <span style={{ fontSize:17, fontWeight:900, color:C.gray900 }}>fundo<span style={{ color:C.purple }}>ai</span></span>
        </a>
        <div style={{ display:'flex', gap:10 }}>
          <a href="/" style={{ fontSize:14, color:C.gray600, textDecoration:'none', padding:'8px 14px', borderRadius:8, fontWeight:500 }}>Home</a>
          <a href="/student" style={{ fontSize:14, fontWeight:700, color:'#fff', background:C.purple, textDecoration:'none', padding:'8px 18px', borderRadius:9 }}>Open App</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background:`linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#f3eeff 100%)`, padding:'96px clamp(16px,4vw,56px) 80px', textAlign:'center' }}>
        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:.55 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#fff', border:`1px solid ${C.gray200}`, borderRadius:99, padding:'6px 16px', fontSize:13, fontWeight:700, color:C.purple, marginBottom:24, boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
            🇿🇼 Built in Zimbabwe
          </div>
          <h1 style={{ fontSize:'clamp(2.2rem,5vw,3.8rem)', fontWeight:900, color:C.gray900, letterSpacing:'-.05em', lineHeight:1.1, marginBottom:20 }}>
            Meet the team building<br/>
            <span style={{ background:'linear-gradient(135deg,#7c3aed,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Africa's AI study platform</span>
          </h1>
          <p style={{ fontSize:'clamp(16px,2vw,18px)', color:C.gray500, lineHeight:1.75, maxWidth:560, margin:'0 auto 36px' }}>
            We're a passionate team of Zimbabweans who believe every student deserves access to the best educational tools — regardless of their background.
          </p>
          <a href="/student" style={{ display:'inline-flex', alignItems:'center', gap:8, background:C.purple, color:'#fff', textDecoration:'none', padding:'13px 28px', borderRadius:10, fontSize:15, fontWeight:700, boxShadow:'0 4px 20px rgba(124,58,237,.35)' }}>
            Start Learning Free <ArrowRight size={15}/>
          </a>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ background:'#fff', padding:'64px clamp(16px,4vw,56px)', borderBottom:`1px solid ${C.gray100}` }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:20 }}>
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.4, delay:i*.07 }}
              style={{ textAlign:'center', padding:'28px 16px', borderRadius:20, background:i===0?C.purple:C.gray50, border:`1px solid ${i===0?C.purple:C.gray200}` }}>
              <s.icon size={24} style={{ color:i===0?'rgba(255,255,255,.7)':'#7c3aed', marginBottom:12 }}/>
              <div style={{ fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:900, color:i===0?'#fff':C.gray900, letterSpacing:'-.04em', lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:13, color:i===0?'rgba(255,255,255,.75)':C.gray500, marginTop:7, fontWeight:500 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding:'80px clamp(16px,4vw,56px)', background:C.gray50 }}>
        <div style={{ maxWidth:780, margin:'0 auto', textAlign:'center' }}>
          <div style={{ fontSize:12.5, fontWeight:700, color:C.purple, textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:14 }}>Our Mission</div>
          <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:900, color:C.gray900, lineHeight:1.15, letterSpacing:'-.04em', marginBottom:20 }}>
            Democratise quality education<br/>across Zimbabwe — and beyond
          </h2>
          <p style={{ fontSize:16, color:C.gray500, lineHeight:1.8 }}>
            Fundo AI was founded with a single belief: that geography, income, or access to tutors should never determine the quality of a student's education. We've built an AI system that knows the ZIMSEC and Cambridge curricula as deeply as any private tutor — and we're making it available to every student with a smartphone.
          </p>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding:'80px clamp(16px,4vw,56px) 96px', background:'#fff' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ fontSize:12.5, fontWeight:700, color:C.purple, textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:12 }}>Leadership</div>
            <h2 style={{ fontSize:'clamp(1.9rem,4vw,3rem)', fontWeight:900, color:C.gray900, letterSpacing:'-.05em' }}>The people behind Fundo AI</h2>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(clamp(240px,40vw,280px),1fr))', gap:28 }}>
            {displayTeam.map((member, i) => {
              const colors = ['#7c3aed','#059669','#2563eb','#d97706'];
              const color = colors[i % colors.length];
              return (
                <motion.div key={member._id || member.name}
                  initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.5, delay:i*.1 }}
                  whileHover={{ y:-6, boxShadow:'0 20px 48px rgba(0,0,0,0.12)' }}
                  style={{ background:'#fff', border:`1.5px solid ${C.gray200}`, borderRadius:24, padding:'36px 28px', textAlign:'center', transition:'box-shadow .2s', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${color},${color}80)` }}/>

                  <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
                    <Avatar member={{ ...member, order:i }} size={88}/>
                  </div>

                  <div style={{ fontSize:11.5, fontWeight:700, color:color, textTransform:'uppercase', letterSpacing:'.8px', marginBottom:8 }}>{member.title}</div>
                  <h3 style={{ fontSize:20, fontWeight:900, color:C.gray900, letterSpacing:'-.03em', marginBottom:4 }}>{member.name}</h3>
                  <div style={{ fontSize:13, color:C.gray500, fontWeight:500, marginBottom:20 }}>{member.role}</div>

                  {member.quote && (
                    <blockquote style={{ fontSize:13.5, color:C.gray600, lineHeight:1.7, fontStyle:'italic', borderLeft:`3px solid ${color}`, paddingLeft:14, textAlign:'left', margin:0 }}>
                      {member.quote}
                    </blockquote>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background:`linear-gradient(135deg,${C.dark},#2d1b69)`, padding:'80px clamp(16px,4vw,56px)', color:'#fff' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontSize:'clamp(1.9rem,4vw,2.8rem)', fontWeight:900, letterSpacing:'-.04em', marginBottom:12 }}>What drives us</h2>
            <p style={{ fontSize:16, color:'rgba(255,255,255,.65)', maxWidth:480, margin:'0 auto' }}>Every decision we make comes back to these core values.</p>
          </motion.div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:20 }}>
            {[
              { emoji:'🇿🇼', title:'Zimbabwe First', desc:'Built specifically for ZIMSEC and Cambridge curricula, not adapted from foreign tools.' },
              { emoji:'💡', title:'Accessibility',   desc:'Every student with a smartphone should have access to a world-class AI tutor.' },
              { emoji:'🎯', title:'Accuracy',        desc:'We obsess over curriculum alignment so students get correct, exam-ready answers.' },
              { emoji:'🚀', title:'Innovation',      desc:'We move fast — constantly improving Fundo AI with the latest AI breakthroughs.' },
            ].map((v, i) => (
              <motion.div key={v.title} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*.08 }}
                style={{ background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', borderRadius:18, padding:'28px 22px', backdropFilter:'blur(8px)' }}>
                <div style={{ fontSize:32, marginBottom:14 }}>{v.emoji}</div>
                <h3 style={{ fontSize:17, fontWeight:800, marginBottom:8 }}>{v.title}</h3>
                <p style={{ fontSize:13.5, color:'rgba(255,255,255,.65)', lineHeight:1.7, margin:0 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:'#fff', padding:'80px clamp(16px,4vw,56px)', textAlign:'center' }}>
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:900, color:C.gray900, letterSpacing:'-.04em', marginBottom:14 }}>Ready to study smarter?</h2>
          <p style={{ fontSize:16, color:C.gray500, marginBottom:32 }}>Join 2,000+ Zimbabwean students learning with Fundo AI.</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="/student" style={{ display:'inline-flex', alignItems:'center', gap:8, background:C.purple, color:'#fff', textDecoration:'none', padding:'13px 28px', borderRadius:10, fontSize:15, fontWeight:700, boxShadow:'0 4px 20px rgba(124,58,237,.35)' }}>
              Start Learning Free <ArrowRight size={15}/>
            </a>
            <a href="/contact" style={{ display:'inline-flex', alignItems:'center', gap:8, color:C.gray700, textDecoration:'none', padding:'13px 28px', borderRadius:10, fontSize:15, fontWeight:700, border:`1.5px solid ${C.gray200}` }}>
              Contact Us
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ background:C.gray50, borderTop:`1px solid ${C.gray200}`, padding:'32px clamp(16px,4vw,56px)', textAlign:'center' }}>
        <p style={{ fontSize:13, color:C.gray500 }}>© 2026 Fundo AI — Built in Zimbabwe 🇿🇼</p>
      </footer>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        @media (max-width: 600px) {
          section { text-align: center !important; }
          blockquote { text-align: left !important; }
        }
      `}</style>
    </div>
  );
}
