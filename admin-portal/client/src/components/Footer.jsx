import { motion } from 'framer-motion';
import { MessageCircle, Mail, Globe, BookOpen, FileText, Users, Shield, Zap, Heart } from 'lucide-react';
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

export default function Footer() {
  return (
    <footer style={{
      position: 'relative', zIndex: 1,
      borderTop: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(5,5,26,0.7)',
      backdropFilter: 'blur(24px)',
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 36px' }}>
        {/* Main grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.7fr 1fr 1fr 1fr',
          gap: 40,
          padding: '64px 0 48px',
        }}>
          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(99,102,241,0.35)', overflow: 'hidden', flexShrink: 0,
              }}>
                <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.3px' }}>Fundo AI</span>
            </div>
            <p style={{ fontSize: 13.5, color: 'rgba(240,242,255,0.5)', lineHeight: 1.7, maxWidth: 240, marginBottom: 24 }}>
              Empowering Zimbabwean students with AI-driven education and a community-built resource library.
            </p>

            {/* Stat pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                { icon: BookOpen, label: 'ZIMSEC + Cambridge', color: '#a5b4fc' },
                { icon: Users, label: 'Community Powered', color: '#6ee7b7' },
                { icon: Zap, label: 'AI Study Assistant', color: '#fcd34d' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={13} style={{ color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, color: 'rgba(240,242,255,0.45)' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { icon: MessageCircle, href: 'https://wa.me/263719647303', label: 'WhatsApp' },
                { icon: Mail, href: 'mailto:support@fundoai.com', label: 'Email' },
                { icon: Globe, href: '#', label: 'Website' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(240,242,255,0.45)', textDecoration: 'none',
                    transition: 'all .2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = '#a5b4fc'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = 'rgba(240,242,255,0.45)'; }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.title}>
              <div style={{
                fontSize: 10.5, fontWeight: 700, letterSpacing: '1.2px',
                textTransform: 'uppercase', color: 'rgba(240,242,255,0.4)',
                marginBottom: 18,
              }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                {col.links.map(link => (
                  <Link
                    key={link.label}
                    to={link.href}
                    style={{
                      color: 'rgba(240,242,255,0.5)', textDecoration: 'none',
                      fontSize: 13.5, transition: 'color .2s',
                    }}
                    onMouseEnter={e => e.target.style.color = '#f0f2ff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(240,242,255,0.5)'}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '20px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontSize: 12.5, color: 'rgba(240,242,255,0.35)' }}>
            © {new Date().getFullYear()} Fundo AI by Darrell Mucheri. All rights reserved.
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'rgba(240,242,255,0.35)' }}>
            <span>Built with</span>
            <Heart size={11} style={{ color: '#ef4444' }} fill="#ef4444" />
            <span>for Zimbabwean students</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
