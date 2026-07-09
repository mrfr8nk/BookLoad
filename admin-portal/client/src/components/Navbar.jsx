import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Upload, Menu, X, Bot, Sparkles } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Resources', href: '/', icon: BookOpen },
  { label: 'Upload', href: '/#upload', icon: Upload },
];

export default function Navbar() {
  const loc = useLocation();
  const isAdmin = loc.pathname === '/admin';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  if (isAdmin) return <AdminBar />;

  return (
    <>
      {/* Gradient top line */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 1, zIndex: 999,
        background: 'linear-gradient(90deg, transparent, #6366f1 20%, #8b5cf6 50%, #06b6d4 80%, transparent)',
      }} />

      {/* Floating pill nav */}
      <div style={{ position: 'fixed', top: 18, left: 0, right: 0, zIndex: 300, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
        <motion.nav
          initial={{ y: -28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          style={{
            pointerEvents: 'all',
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 8px 6px 10px',
            background: scrolled ? 'rgba(5,5,20,0.92)' : 'rgba(5,5,20,0.70)',
            backdropFilter: 'blur(48px) saturate(200%)',
            WebkitBackdropFilter: 'blur(48px) saturate(200%)',
            border: scrolled ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.10)',
            borderRadius: 99,
            boxShadow: scrolled
              ? '0 12px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(99,102,241,0.1), 0 0 40px rgba(99,102,241,0.05)'
              : '0 4px 24px rgba(0,0,0,0.25)',
            transition: 'background .35s, border-color .35s, box-shadow .35s',
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', padding: '3px 8px 3px 3px', borderRadius: 99, marginRight: 4 }}>
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 280, damping: 14 }}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(99,102,241,0.5)',
                overflow: 'hidden', flexShrink: 0,
                boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(255,255,255,0.22),transparent)', borderRadius: '50%' }} />
              <img
                src="https://media.mrfrankofc.gleeze.com/media/fcnd.png"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </motion.div>
            <span style={{ fontSize: 14.5, fontWeight: 800, color: '#eef0ff', letterSpacing: '-0.3px' }}>Fundo AI</span>
          </Link>

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)', marginRight: 4 }} />

          {/* Nav links */}
          {NAV_LINKS.map(link => (
            <NavPill key={link.label} href={link.href} icon={link.icon} label={link.label} />
          ))}

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)', marginLeft: 4 }} />

          {/* AI badge */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 99, cursor: 'default',
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.28)',
              fontSize: 12.5, fontWeight: 700, color: '#a5b4fc',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.12), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 2.5s linear infinite' }} />
            <Bot size={12} style={{ position: 'relative' }} />
            <span style={{ position: 'relative' }}>AI Study Bot</span>
          </motion.div>
        </motion.nav>
      </div>

      {/* Spacer for fixed nav */}
      <div style={{ height: 80 }} />

      {/* Mobile menu button */}
      <motion.button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(o => !o)}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{
          position: 'fixed', top: 18, right: 18, zIndex: 400,
          width: 42, height: 42, borderRadius: '50%',
          background: 'rgba(5,5,20,0.85)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
          display: 'none', alignItems: 'center', justifyContent: 'center', color: '#eef0ff',
        }}
      >
        {menuOpen ? <X size={17} /> : <Menu size={17} />}
      </motion.button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 350, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={e => e.stopPropagation()}
              style={{
                position: 'absolute', top: 0, right: 0, bottom: 0, width: 260,
                background: 'rgba(6,6,22,0.98)', backdropFilter: 'blur(32px)',
                borderLeft: '1px solid rgba(255,255,255,0.1)', padding: '80px 20px 32px',
                display: 'flex', flexDirection: 'column', gap: 6,
              }}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.label} initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.07 }}>
                  <Link
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 16px', borderRadius: 12, color: 'rgba(238,240,255,0.8)', textDecoration: 'none', fontSize: 15, fontWeight: 600, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <link.icon size={17} style={{ color: '#a5b4fc' }} />
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AdminBar() {
  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 1, zIndex: 999, background: 'linear-gradient(90deg, transparent, #6366f1 20%, #8b5cf6 50%, #06b6d4 80%, transparent)' }} />
    </>
  );
}

function NavPill({ href, icon: Icon, label }) {
  const [hov, setHov] = useState(false);
  const Tag = href.includes('#') ? 'a' : Link;
  const props = href.includes('#') ? { href } : { to: href };
  return (
    <Tag
      {...props}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '7px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600,
        textDecoration: 'none',
        color: hov ? '#eef0ff' : 'rgba(238,240,255,0.6)',
        background: hov ? 'rgba(255,255,255,0.08)' : 'transparent',
        transition: 'all .18s', cursor: 'pointer',
      }}
    >
      <Icon size={13} style={{ color: hov ? '#a5b4fc' : 'rgba(238,240,255,0.38)', transition: 'color .18s' }} strokeWidth={2} />
      {label}
    </Tag>
  );
}
