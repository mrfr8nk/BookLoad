import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, Zap } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = { success: CheckCircle, error: AlertCircle, info: Info, warning: Zap };
const COLORS = {
  success: { color: '#6ee7b7', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.26)', glow: 'rgba(16,185,129,0.14)' },
  error:   { color: '#fca5a5', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.26)',  glow: 'rgba(239,68,68,0.12)' },
  info:    { color: '#a5b4fc', bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.26)', glow: 'rgba(99,102,241,0.12)' },
  warning: { color: '#fcd34d', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.26)', glow: 'rgba(245,158,11,0.12)' },
};

let uid = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((msg, type = 'info', duration = 3800) => {
    const id = ++uid;
    setToasts(prev => [...prev.slice(-4), { id, msg, type, duration }]);
    if (duration > 0) {
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }
    return id;
  }, []);

  const dismiss = useCallback(id => setToasts(prev => prev.filter(t => t.id !== id)), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        display: 'flex', flexDirection: 'column-reverse', gap: 10,
        maxWidth: 380, width: 'calc(100vw - 48px)',
        pointerEvents: 'none',
      }}>
        <AnimatePresence>
          {toasts.map(t => {
            const c = COLORS[t.type] || COLORS.info;
            const Icon = ICONS[t.type] || Info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 64, scale: 0.9 }}
                animate={{ opacity: 1, x: 0,  scale: 1 }}
                exit={{ opacity: 0, x: 64, scale: 0.88 }}
                transition={{ duration: 0.3, ease: [0.34, 1.2, 0.64, 1] }}
                style={{ pointerEvents: 'all' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '13px 15px',
                  background: 'rgba(7,7,22,0.96)',
                  backdropFilter: 'blur(40px)',
                  border: `1px solid ${c.border}`,
                  borderRadius: 14,
                  boxShadow: `0 20px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,0.04), 0 0 48px ${c.glow}`,
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Left accent bar */}
                  <div style={{ position: 'absolute', left: 0, top: '15%', bottom: '15%', width: 3, borderRadius: '0 3px 3px 0', background: c.color, boxShadow: `0 0 12px ${c.color}` }} />
                  {/* Shimmer */}
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${c.bg}, transparent 60%)`, pointerEvents: 'none' }} />

                  <div style={{
                    width: 32, height: 32, borderRadius: 9,
                    background: c.bg, border: `1px solid ${c.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, position: 'relative', zIndex: 1,
                  }}>
                    <Icon size={15} style={{ color: c.color }} strokeWidth={2.2} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.8px', textTransform: 'uppercase', color: c.color, marginBottom: 3, opacity: .85 }}>
                      {t.type}
                    </div>
                    <div style={{ fontSize: 13.5, color: '#eef0ff', lineHeight: 1.5, wordBreak: 'break-word' }}>{t.msg}</div>
                  </div>

                  <button
                    onClick={() => dismiss(t.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
                      color: 'rgba(238,240,255,0.3)', borderRadius: 5, display: 'flex',
                      transition: 'color .15s', flexShrink: 0, position: 'relative', zIndex: 1,
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(238,240,255,.75)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(238,240,255,.3)'}
                  >
                    <X size={13} />
                  </button>

                  {t.duration > 0 && (
                    <motion.div
                      initial={{ scaleX: 1 }} animate={{ scaleX: 0 }}
                      transition={{ duration: t.duration / 1000, ease: 'linear' }}
                      style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                        background: `linear-gradient(90deg, ${c.color}cc, transparent)`,
                        transformOrigin: 'left',
                      }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
