import { motion } from 'framer-motion';
import { MessageCircle, Mail, Globe, BookOpen, Users, Zap, Heart, ArrowUpRight, Star, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stag   = { visible: { transition: { staggerChildren: 0.06 } } };

export default function Footer() {
  return (
    <footer style={{ position: 'relative', zIndex: 1, marginTop: 40 }}>
      {/* Top glow separator */}
      <div style={{ position: 'relative', height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5) 30%, rgba(139,92,246,0.6) 50%, rgba(6,182,212,0.5) 70%, transparent)' }} />

      {/* Main footer */}
      <div style={{ background: 'rgba(4,4,14,0.90)', backdropFilter: 'blur(40px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

          {/* CTA strip */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp} transition={{ duration: 0.6, ease: [0.4,0,.2,1] }}
            style={{
              margin: '52px 0 48px',
              padding: '36px 36px',
              borderRadius: 24,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.07), rgba(139,92,246,0.05) 50%, rgba(6,182,212,0.07))',
              border: '1px solid rgba(99,102,241,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 20,
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(99,102,241,0.04), transparent 60%)', pointerEvents:'none' }} />
            <div style={{ position:'absolute', top:-80, right:-60, width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 6 }}>
                Start sharing today
              </div>
              <div style={{ fontSize: 14, color: 'rgba(238,240,255,0.48)', lineHeight: 1.6 }}>
                Help 1,000+ students and earn bonus credits for every upload approved.
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} style={{ position:'relative', zIndex:1 }}>
              <Link to="/#upload" style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                padding: '13px 26px', borderRadius: 12, textDecoration: 'none',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
                color: '#fff', fontSize: 14.5, fontWeight: 700,
                boxShadow: '0 6px 28px rgba(99,102,241,0.5)',
                border: '1px solid rgba(255,255,255,0.14)',
                position: 'relative', overflow: 'hidden', flexShrink: 0,
              }}>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.14),transparent)', borderRadius:'inherit' }} />
                <span style={{ position:'relative' }}>Upload Now</span>
                <ArrowUpRight size={15} style={{ position:'relative' }} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Main grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(3, 1fr)', gap: 36, paddingBottom: 48 }} className="footer-grid">

            {/* Brand */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12,
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(99,102,241,0.4)', overflow: 'hidden', flexShrink: 0,
                  boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
                  position: 'relative',
                }}>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.18),transparent)', borderRadius:'inherit' }} />
                  <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', position:'relative', zIndex:1 }} onError={e=>e.target.style.display='none'} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-0.4px' }}>Fundo AI</div>
                  <div style={{ fontSize: 10.5, color: 'rgba(238,240,255,0.38)', fontWeight: 500 }}>Study Resource Hub</div>
                </div>
              </div>

              <p style={{ fontSize: 13.5, color: 'rgba(238,240,255,0.45)', lineHeight: 1.75, maxWidth: 220, marginBottom: 24 }}>
                Empowering Zimbabwean students with AI education and a community-built resource library.
              </p>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {[
                  { icon: BookOpen, label: 'ZIMSEC + Cambridge', c: '#a5b4fc' },
                  { icon: Users,    label: 'Community Powered',  c: '#6ee7b7' },
                  { icon: Bot,      label: 'AI Study Assistant', c: '#c4b5fd' },
                ].map(({ icon: Icon, label, c }) => (
                  <div key={label} style={{ display:'flex', alignItems:'center', gap:9 }}>
                    <div style={{ width:24, height:24, borderRadius:7, background:`${c}16`, border:`1px solid ${c}28`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon size={12} style={{ color:c }} />
                    </div>
                    <span style={{ fontSize:12.5, color:'rgba(238,240,255,0.42)', fontWeight:500 }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { icon: MessageCircle, href:'https://wa.me/263719647303', c:'#6ee7b7', bg:'rgba(16,185,129,0.1)' },
                  { icon: Mail, href:'mailto:support.fundo.ai@gmail.com', c:'#a5b4fc', bg:'rgba(99,102,241,0.1)' },
                  { icon: Globe, href:'https://fundoai.gleeze.com', c:'#67e8f9', bg:'rgba(6,182,212,0.1)' },
                ].map(({ icon:Icon, href, c, bg }) => (
                  <motion.a
                    key={href} href={href} target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale:1.12, y:-2 }}
                    style={{ width:36, height:36, borderRadius:10, background:bg, border:`1px solid ${c}22`, display:'flex', alignItems:'center', justifyContent:'center', color:c, textDecoration:'none', boxShadow:`0 0 14px ${c}14` }}
                  >
                    <Icon size={15} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Link columns */}
            {[
              { title:'Platform', links:[['Upload Materials','/'],['Study Resources','/'],['Community Hub','/'],['Admin Dashboard','/admin']] },
              { title:'Curriculum', links:[['ZIMSEC O-Level','#'],['ZIMSEC A-Level','#'],['Cambridge IGCSE','#'],['Primary School','#']] },
              { title:'Resources', links:[['Past Papers','#'],['Syllabuses','#'],['Marking Schemes','#'],['Textbooks','#']] },
            ].map((col, ci) => (
              <motion.div key={col.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stag} transition={{ delay: ci*0.07 }}>
                <motion.div variants={fadeUp} style={{ fontSize:10.5, fontWeight:800, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(238,240,255,0.35)', marginBottom:20 }}>
                  {col.title}
                </motion.div>
                <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
                  {col.links.map(([label, href]) => (
                    <motion.div key={label} variants={fadeUp}>
                      <Link
                        to={href}
                        style={{ color:'rgba(238,240,255,0.45)', textDecoration:'none', fontSize:13.5, fontWeight:500, transition:'color .18s', display:'inline-flex', alignItems:'center', gap:5 }}
                        onMouseEnter={e => { e.target.style.color='#eef0ff'; }}
                        onMouseLeave={e => { e.target.style.color='rgba(238,240,255,0.45)'; }}
                      >
                        {label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', padding:'18px 0 28px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <span style={{ fontSize:12, color:'rgba(238,240,255,0.28)' }}>
              © {new Date().getFullYear()} Fundo AI · Darrell Mucheri
            </span>
            <div style={{ display:'flex', alignItems:'center', gap:18, flexWrap:'wrap' }}>
              {['Privacy','Terms','Support'].map(l=>(
                <span key={l} style={{ fontSize:12, color:'rgba(238,240,255,0.28)', cursor:'pointer', transition:'color .15s' }}
                  onMouseEnter={e=>e.target.style.color='rgba(238,240,255,0.6)'}
                  onMouseLeave={e=>e.target.style.color='rgba(238,240,255,0.28)'}
                >{l}</span>
              ))}
              <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'rgba(238,240,255,0.28)' }}>
                <span>Built with</span><Heart size={11} style={{ color:'#ef4444' }} fill="#ef4444" /><span>for Zimbabwe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
