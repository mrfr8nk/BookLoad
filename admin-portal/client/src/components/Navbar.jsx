import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Shield } from 'lucide-react';

export default function Navbar({ rightSlot }) {
  const loc = useLocation();
  const isAdmin = loc.pathname === '/admin';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'sticky', top: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 36px', height: 64,
        background: 'rgba(5,5,26,0.75)',
        backdropFilter: 'blur(32px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, overflow: 'hidden',
          border: '1px solid rgba(99,102,241,0.4)',
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <img
            src="https://mrfranko-cdn.hf.space/edu/fundo.png"
            alt="Fundo AI"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#f0f2ff', letterSpacing: '-0.4px' }}>Fundo AI</div>
          <div style={{ fontSize: 10, color: 'rgba(240,242,255,0.45)', marginTop: 0 }}>
            {isAdmin ? 'Admin Dashboard' : 'Study Resource Hub'}
          </div>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {!isAdmin && (
          <NavLink to="/">Resources</NavLink>
        )}
        {rightSlot || (
          <Link
            to="/admin"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
              color: '#fff', padding: '9px 18px', borderRadius: 99,
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
              transition: 'all .2s',
            }}
          >
            <Shield size={13} strokeWidth={2.5} />
            Admin
          </Link>
        )}
      </div>
    </motion.nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        color: 'rgba(240,242,255,0.55)', textDecoration: 'none',
        fontSize: 13.5, fontWeight: 500, padding: '7px 14px',
        borderRadius: 8, transition: 'all .2s',
      }}
      onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.color = '#f0f2ff'; }}
      onMouseLeave={e => { e.target.style.background = ''; e.target.style.color = 'rgba(240,242,255,0.55)'; }}
    >
      {children}
    </Link>
  );
}
