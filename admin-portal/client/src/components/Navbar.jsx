import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Shield, BookOpen, Upload, Menu, X, Sparkles, Zap, Users, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Resources', href: '/', icon: BookOpen },
  { label: 'Upload', href: '/#upload', icon: Upload },
];

export default function Navbar() {
  const loc = useLocation();
  const isAdmin = loc.pathname === '/admin';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 14);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      {/* Gradient top line */}
      <div className="page-top-line" />

      <motion.nav
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'sticky', top: 0, zIndex: 300,
          padding: '0 24px',
          height: 64,
          background: scrolled
            ? 'rgba(5,5,16,0.88)'
            : 'rgba(5,5,16,0.55)',
          backdropFilter: 'blur(48px) saturate(200%)',
          WebkitBackdropFilter: 'blur(48px) saturate(200%)',
          borderBottom: scrolled
            ? '1px solid rgba(255,255,255,0.10)'
            : '1px solid rgba(255,255,255,0.06)',
          transition: 'background .35s, border-color .35s, box-shadow .35s',
          boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,.4), 0 1px 0 rgba(99,102,241,.08)' : 'none',
          display: 'flex', alignItems: 'center',
        }}
      >
        <div style={{
          maxWidth: 1200, width: '100%', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* ── Logo ── */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', flexShrink: 0 }}>
            <motion.div
              whileHover={{ scale: 1.06, rotate: 3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              style={{
                width: 36, height: 36, borderRadius: 11,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(99,102,241,0.45)',
                overflow: 'hidden', flexShrink: 0,
                boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,.2), transparent)', borderRadius: 'inherit' }} />
              <img
                src="https://mrfranko-cdn.hf.space/edu/fundo.png"
                alt="Fundo AI"
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </motion.div>
            <div>
              <div style={{
                fontSize: 15.5, fontWeight: 800, color: '#eef0ff',
                letterSpacing: '-0.5px', lineHeight: 1.1,
              }}>Fundo AI</div>
              <div style={{ fontSize: 10, color: 'rgba(238,240,255,0.4)', fontWeight: 500, letterSpacing: '.3px' }}>
                {isAdmin ? 'Admin Dashboard' : 'Study Resource Hub'}
              </div>
            </div>
          </Link>

          {/* ── Desktop nav links ── */}
          {!isAdmin && (
            <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {NAV_LINKS.map(link => (
                <NavPill
                  key={link.label}
                  href={link.href}
                  icon={link.icon}
                  label={link.label}
                  active={loc.pathname === link.href.split('#')[0]}
                  hovered={hovered === link.label}
                  onHover={v => setHovered(v ? link.label : null)}
                />
              ))}
            </div>
          )}

          {/* ── Right side ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!isAdmin && (
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/admin"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '9px 18px', borderRadius: 99, fontSize: 13, fontWeight: 700,
                    textDecoration: 'none', color: '#fff',
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.45)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(255,255,255,.12),transparent)', borderRadius: 'inherit' }} />
                  <Shield size={13} strokeWidth={2.5} style={{ position: 'relative', zIndex: 1 }} />
                  <span style={{ position: 'relative', zIndex: 1 }}>Admin</span>
                </Link>
              </motion.div>
            )}

            {/* Mobile hamburger */}
            {!isAdmin && (
              <button
                className="hide-desktop"
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  display: 'none',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 9, padding: '8px', cursor: 'pointer',
                  color: 'rgba(238,240,255,0.7)',
                }}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: 'hidden', position: 'sticky', top: 64, zIndex: 250,
              background: 'rgba(5,5,20,0.96)', backdropFilter: 'blur(32px)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div style={{ padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {NAV_LINKS.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px', borderRadius: 10,
                    color: 'rgba(238,240,255,0.8)', textDecoration: 'none',
                    fontSize: 14, fontWeight: 600,
                    transition: 'background .15s',
                  }}
                >
                  <link.icon size={16} style={{ color: '#a5b4fc' }} />
                  {link.label}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px', borderRadius: 10, marginTop: 4,
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                  color: '#a5b4fc', textDecoration: 'none', fontSize: 14, fontWeight: 700,
                }}
              >
                <Shield size={16} />
                Admin Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavPill({ href, icon: Icon, label, active, hovered, onHover }) {
  const isExternal = href.startsWith('http');
  const Tag = isExternal ? 'a' : Link;
  const props = isExternal
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { to: href };

  return (
    <motion.div
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      style={{ position: 'relative' }}
    >
      <Tag
        {...props}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '8px 14px', borderRadius: 9, fontSize: 13.5, fontWeight: 500,
          textDecoration: 'none',
          color: active ? '#eef0ff' : 'rgba(238,240,255,0.55)',
          background: active ? 'rgba(99,102,241,0.1)' : hovered ? 'rgba(255,255,255,0.055)' : 'transparent',
          border: active ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
          transition: 'all .2s', cursor: 'pointer',
        }}
      >
        <Icon size={14} style={{ color: active ? '#a5b4fc' : 'rgba(238,240,255,0.4)', transition: 'color .2s' }} strokeWidth={2} />
        {label}
      </Tag>
    </motion.div>
  );
}
