import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  }, []);

  const icons = { success: CheckCircle, error: XCircle, info: Info };
  const styles = {
    success: { bg: 'rgba(10,40,22,0.95)', border: 'rgba(16,185,129,0.35)', color: '#6ee7b7' },
    error:   { bg: 'rgba(40,10,10,0.95)', border: 'rgba(239,68,68,0.35)',   color: '#fca5a5' },
    info:    { bg: 'rgba(10,10,40,0.95)', border: 'rgba(99,102,241,0.35)',  color: '#a5b4fc' },
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = icons[t.type] || Info;
            const s = styles[t.type] || styles.info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 18px', borderRadius: 12,
                  background: s.bg, border: `1px solid ${s.border}`, color: s.color,
                  fontSize: 13, fontWeight: 600, minWidth: 240,
                  backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
                }}
              >
                <Icon size={15} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                <span>{t.msg}</span>
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
