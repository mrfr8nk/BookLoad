import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

const TYPES = {
  success: { icon: CheckCircle, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', textColor: '#065f46' },
  error:   { icon: AlertCircle, color: '#dc2626', bg: '#fef2f2', border: '#fecaca', textColor: '#7f1d1d' },
  info:    { icon: Info,        color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', textColor: '#1e3a8a' },
  warning: { icon: AlertTriangle, color: '#d97706', bg: '#fffbeb', border: '#fde68a', textColor: '#78350f' },
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
        maxWidth: 360, width: 'calc(100vw - 48px)',
        pointerEvents: 'none',
      }}>
        <AnimatePresence>
          {toasts.map(t => {
            const cfg = TYPES[t.type] || TYPES.info;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 60, scale: 0.94 }}
                animate={{ opacity: 1, x: 0,  scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.92 }}
                transition={{ duration: 0.26, ease: [0.34, 1.15, 0.64, 1] }}
                style={{ pointerEvents: 'all' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 11,
                  padding: '12px 14px',
                  background: '#fff',
                  border: `1.5px solid ${cfg.border}`,
                  borderLeft: `4px solid ${cfg.color}`,
                  borderRadius: 10,
                  boxShadow: '0 10px 30px rgba(0,0,0,.10), 0 2px 8px rgba(0,0,0,.06)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: cfg.bg, border: `1px solid ${cfg.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={14} style={{ color: cfg.color }} strokeWidth={2.2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '.7px', textTransform: 'uppercase', color: cfg.color, marginBottom: 2 }}>
                      {t.type}
                    </div>
                    <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.45, wordBreak: 'break-word' }}>{t.msg}</div>
                  </div>
                  <button
                    onClick={() => dismiss(t.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                      color: '#9ca3af', borderRadius: 4, display: 'flex', flexShrink: 0,
                      transition: 'color .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#374151'}
                    onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                  >
                    <X size={12} />
                  </button>
                  {t.duration > 0 && (
                    <motion.div
                      initial={{ scaleX: 1 }} animate={{ scaleX: 0 }}
                      transition={{ duration: t.duration / 1000, ease: 'linear' }}
                      style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                        background: cfg.color, transformOrigin: 'left', opacity: .45,
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
