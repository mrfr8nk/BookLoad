import { motion } from 'framer-motion';
import { MessageCircle, Mail, Globe, BookOpen, FileText, Users, Shield, Zap, Heart, ArrowUpRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const cols = [
  {
    title: 'Platform',
    links: [
      { label: 'Upload Materials', href: '/' },
      { label: 'Admin Dashboard', href: '/admin' },
      { label: 'Community Hub', href: '/' },
      { label: 'Study Resources', href: '/' },
    ],
  },
  {
    title: 'Curriculum',
    links: [
      { label: 'ZIMSEC O-Level', href: '#' },
      { label: 'ZIMSEC A-Level', href: '#' },
      { label: 'Cambridge IGCSE', href: '#' },
      { label: 'Primary School', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Past Papers', href: '#' },
      { label: 'Syllabuses', href: '#' },
      { label: 'Marking Schemes', href: '#' },
      { label: 'Textbooks', href: '#' },
    ],
  },
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function Footer() {
  return (
    <footer style={{
      position: 'relative', zIndex: 1,
      borderTop: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(4,4,18,0.85)',
      backdropFilter: 'blur(32px)',
    }}>
      {/* Top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,.4) 30%, rgba(139,92,246,.5) 50%, rgba(6,182,212,.4) 70%, transparent)',
      }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 36px' }}>
        {/* CTA Banner */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.6, ease: [0.4,0,.2,1] }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 20,
            margin: '52px 0',
            padding: '32px 36px',
            background: 'rgba(99,102,241,0.07)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 20,
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 5, letterSpacing: '-0.4px' }}>
              Share your study materials today
            </div>
            <div style={{ fontSize: 13.5, color: 'rgba(238,240,255,0.52)', lineHeight: 1.6 }}>
              Help 1,000+ students and earn bonus credits for every approved upload.
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <Link
              to="/#upload"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                textDecoration: 'none', color: '#fff',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
                boxShadow: '0 4px 24px rgba(99,102,241,.5)',
                border: '1px solid rgba(255,255,255,.1)',
                flexShrink: 0,
              }}
            >
              Upload Now <ArrowUpRight size={15} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Main grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.8fr 1fr 1fr 1fr',
          gap: 40,
          padding: '20px 0 52px',
        }}>
          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(99,102,241,.4)', overflow: 'hidden', flexShrink: 0,
                boxShadow: '0 4px 16px rgba(99,102,241,.35)',
              }}>
                <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
              </div>
              <span style={{ fontSize: 15.5, fontWeight: 800, letterSpacing: '-0.4px' }}>Fundo AI</span>
            </div>

            <p style={{ fontSize: 13.5, color: 'rgba(238,240,255,0.5)', lineHeight: 1.75, maxWidth: 230, marginBottom: 24 }}>
              Empowering Zimbabwean students with AI-driven education and a community-built resource library.
            </p>

            {/* Feature pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
              {[
                { icon: BookOpen, label: 'ZIMSEC + Cambridge', color: '#a5b4fc' },
                { icon: Users, label: 'Community Powered', color: '#6ee7b7' },
                { icon: Zap, label: 'AI Study Assistant', color: '#fcd34d' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: `${color}16`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={12} style={{ color }} />
                  </div>
                  <span style={{ fontSize: 12.5, color: 'rgba(238,240,255,0.48)' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 7 }}>
              {[
                { icon: MessageCircle, href: 'https://wa.me/263719647303', label: 'WhatsApp' },
                { icon: Mail, href: 'mailto:support.fundo.ai@gmail.com', label: 'Email' },
                { icon: Globe, href: 'https://fundoai.gleeze.com', label: 'Website' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(238,240,255,0.45)', textDecoration: 'none',
                    transition: 'all .2s',
                  }}
                  onHoverStart={e => {}}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.14)';
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.32)';
                    e.currentTarget.style.color = '#a5b4fc';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
                    e.currentTarget.style.color = 'rgba(238,240,255,0.45)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col, colIdx) => (
            <div key={col.title}>
              <div style={{
                fontSize: 10.5, fontWeight: 800, letterSpacing: '1.4px',
                textTransform: 'uppercase', color: 'rgba(238,240,255,0.38)',
                marginBottom: 20,
              }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={fadeUp}
                    transition={{ duration: 0.4, delay: colIdx * 0.06 + i * 0.04 }}
                  >
                    <Link
                      to={link.href}
                      style={{
                        color: 'rgba(238,240,255,0.48)', textDecoration: 'none',
                        fontSize: 13.5, transition: 'color .18s',
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                      }}
                      onMouseEnter={e => { e.target.style.color = '#eef0ff'; }}
                      onMouseLeave={e => { e.target.style.color = 'rgba(238,240,255,0.48)'; }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '18px 0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontSize: 12, color: 'rgba(238,240,255,0.3)' }}>
            © {new Date().getFullYear()} Fundo AI · Darrell Mucheri · All rights reserved.
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {['Privacy', 'Terms', 'Support'].map(l => (
              <span key={l} style={{ fontSize: 12, color: 'rgba(238,240,255,0.3)', cursor: 'pointer', transition: 'color .15s' }}
                onMouseEnter={e => e.target.style.color = 'rgba(238,240,255,0.65)'}
                onMouseLeave={e => e.target.style.color = 'rgba(238,240,255,0.3)'}
              >{l}</span>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(238,240,255,0.3)' }}>
              <span>Built with</span>
              <Heart size={11} style={{ color: '#ef4444' }} fill="#ef4444" />
              <span>for Zimbabwean students</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
