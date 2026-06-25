import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Eye, EyeOff, Smartphone, Lock, User, School,
  CheckCircle, Sparkles, MessageCircle, BookOpen, Image, FileText,
  Zap, GraduationCap, ChevronRight, Star, Brain,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LEVELS = [
  { value: 'primary', label: 'Primary School', sub: 'Grade 1–7', icon: BookOpen },
  { value: 'olevel',  label: 'O-Level',         sub: 'Form 1–4',  icon: GraduationCap },
  { value: 'alevel',  label: 'A-Level',          sub: 'Form 5–6',  icon: Star },
];

const GRADES = {
  primary: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7'],
  olevel:  ['Form 1','Form 2','Form 3','Form 4'],
  alevel:  ['Lower 6','Upper 6'],
};

const FEATURES = [
  { icon: MessageCircle, label: 'AI Chat Tutor', sub: 'Ask anything, get expert answers' },
  { icon: FileText,      label: 'Study Notes',   sub: 'AI-generated curriculum notes' },
  { icon: Image,         label: 'Image Creator', sub: 'Visualise concepts instantly' },
  { icon: Brain,         label: 'Mock Exams',    sub: 'Practice with real-style questions' },
  { icon: BookOpen,      label: 'Past Papers',   sub: 'ZIMSEC & Cambridge library' },
];

const glass = {
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.12)',
};

const glassInput = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 12,
  fontSize: 14,
  color: '#f0e9ff',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border .2s, background .2s',
  boxSizing: 'border-box',
};

export default function StudentAuth() {
  const nav = useNavigate();
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    phone: '', password: '', name: '', school: '',
    levelType: 'olevel', grade: 'Form 1',
  });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setError(''); }

  async function handleLogin(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const r = await fetch('/api/student/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone, password: form.password }),
      });
      const d = await r.json();
      if (!r.ok) {
        if (d.error?.includes('No account')) {
          setMode('signup'); setStep(1); setError('');
          return;
        }
        throw new Error(d.error || 'Login failed');
      }
      localStorage.setItem('fundo_token', d.token);
      localStorage.setItem('fundo_user', JSON.stringify(d.user));
      // Check if profile is complete
      const needsProfile = !d.user?.school || !d.user?.levelLabel;
      if (needsProfile) {
        setMode('onboard');
        return;
      }
      nav('/student/app');
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setError(''); setLoading(true);
    try {
      const levelLabels = { primary: 'Primary', olevel: 'O-Level', alevel: 'A-Level' };
      const r = await fetch('/api/student/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: form.phone, password: form.password, name: form.name,
          school: form.school, levelType: form.levelType,
          levelLabel: levelLabels[form.levelType] || form.levelType,
          grade: form.grade,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Signup failed');
      localStorage.setItem('fundo_token', d.token);
      localStorage.setItem('fundo_user', JSON.stringify(d.user));
      nav('/student/app');
    } catch (e) { setError(e.message); setStep(2); }
    finally { setLoading(false); }
  }

  async function handleOnboard(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const token = localStorage.getItem('fundo_token');
      const levelLabels = { primary: 'Primary', olevel: 'O-Level', alevel: 'A-Level' };
      const r = await fetch('/api/student/update-profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name, school: form.school, levelType: form.levelType,
          levelLabel: levelLabels[form.levelType] || form.levelType, grade: form.grade,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Update failed');
      localStorage.setItem('fundo_user', JSON.stringify({ ...JSON.parse(localStorage.getItem('fundo_user') || '{}'), ...d.user }));
      nav('/student/app');
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  // Animated orbs background
  const orbs = [
    { w: 500, h: 500, top: -120, left: -180, color: 'rgba(124,58,237,0.25)' },
    { w: 400, h: 400, top: '60%', right: -120, color: 'rgba(59,130,246,0.18)' },
    { w: 300, h: 300, bottom: -80, left: '40%', color: 'rgba(139,92,246,0.15)' },
  ];

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0c0521 0%, #1b0f3e 40%, #0a1a3f 100%)' }}>
      {/* Background orbs */}
      {orbs.map((o, i) => (
        <motion.div key={i} style={{ position: 'absolute', width: o.w, height: o.h, borderRadius: '50%', background: o.color, filter: 'blur(80px)', top: o.top, left: o.left, right: o.right, bottom: o.bottom, pointerEvents: 'none' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 6 + i * 2, ease: 'easeInOut' }} />
      ))}

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex' }}>
        {/* Left panel */}
        <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: .7 }}
          style={{ width: '44%', padding: '48px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="auth-left-hide">

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, ...glass, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
            </div>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-.5px' }}>Fundo<span style={{ color: '#a78bfa' }}>AI</span></span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 900, color: '#fff', lineHeight: 1.12, marginBottom: 16, letterSpacing: '-.04em' }}>
            Your AI study partner.<br />
            <span style={{ color: '#a78bfa', fontStyle: 'italic' }}>Built for Zimbabwe.</span>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(240,233,255,0.6)', lineHeight: 1.75, marginBottom: 40 }}>
            Powered by the same AI as ChatGPT — designed specifically for ZIMSEC and Cambridge students.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f.label} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: .3 + i * .08 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 14, ...glass, transition: 'all .2s' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <f.icon size={17} style={{ color: '#a78bfa' }} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#f0e9ff' }}>{f.label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(240,233,255,0.5)' }}>{f.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ marginTop: 40, fontSize: 12.5, color: 'rgba(240,233,255,0.3)' }}>
            © 2025 Fundo AI · Created by Darrell Mucheri
          </div>
        </motion.div>

        {/* Right panel */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
          <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .6, delay: .1 }}
            style={{ width: '100%', maxWidth: 420, borderRadius: 24, padding: '36px 32px', ...glass, boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>

            <AnimatePresence mode="wait">
              {/* ── LOGIN ── */}
              {mode === 'login' && (
                <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .22 }}>
                  <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 4, marginBottom: 28, border: '1px solid rgba(255,255,255,0.08)' }}>
                    {[['login','Log In'],['signup','Sign Up']].map(([m, l]) => (
                      <button key={m} onClick={() => { setMode(m); setStep(1); setError(''); }}
                        style={{ flex: 1, padding: '9px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, transition: 'all .2s',
                          background: mode === m ? 'rgba(167,139,250,0.25)' : 'transparent', color: mode === m ? '#a78bfa' : 'rgba(240,233,255,0.45)',
                          boxShadow: mode === m ? '0 0 16px rgba(124,58,237,0.3)' : 'none' }}>
                        {l}
                      </button>
                    ))}
                  </div>

                  <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f0e9ff', marginBottom: 6 }}>Welcome back</h2>
                  <p style={{ fontSize: 13.5, color: 'rgba(240,233,255,0.5)', marginBottom: 24 }}>Log in to your study session.</p>

                  <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <GlassInput icon={Smartphone} type="tel" placeholder="WhatsApp number  e.g. 263778123456"
                      value={form.phone} onChange={v => set('phone', v)} />
                    <GlassInput icon={Lock} type={showPw ? 'text' : 'password'} placeholder="Password"
                      value={form.password} onChange={v => set('password', v)}
                      rightEl={<button type="button" onClick={() => setShowPw(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,233,255,0.4)', padding: 0, display: 'flex' }}>{showPw ? <EyeOff size={15} /> : <Eye size={15} />}</button>} />

                    <ErrBox msg={error} />

                    <GlassBtn loading={loading} label="Log In" icon={ArrowRight} />
                  </form>

                  <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'rgba(240,233,255,0.45)' }}>
                    No account? <button onClick={() => { setMode('signup'); setStep(1); setError(''); }} style={{ background: 'none', border: 'none', color: '#a78bfa', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Sign Up Free</button>
                  </p>

                  <div style={{ marginTop: 22, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                    <p style={{ fontSize: 12.5, color: 'rgba(240,233,255,0.4)', marginBottom: 10 }}>Prefer WhatsApp?</p>
                    <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#25D366', color: '#fff', textDecoration: 'none', padding: '9px 20px', borderRadius: 10, fontSize: 13.5, fontWeight: 700 }}>
                      <MessageCircle size={14} /> Open in WhatsApp
                    </a>
                  </div>
                </motion.div>
              )}

              {/* ── SIGNUP ── */}
              {mode === 'signup' && (
                <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .22 }}>
                  <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 4, marginBottom: 28, border: '1px solid rgba(255,255,255,0.08)' }}>
                    {[['login','Log In'],['signup','Sign Up']].map(([m, l]) => (
                      <button key={m} onClick={() => { setMode(m); setStep(1); setError(''); }}
                        style={{ flex: 1, padding: '9px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, transition: 'all .2s',
                          background: mode === m ? 'rgba(167,139,250,0.25)' : 'transparent', color: mode === m ? '#a78bfa' : 'rgba(240,233,255,0.45)' }}>
                        {l}
                      </button>
                    ))}
                  </div>

                  {/* Step dots */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                    {[1, 2].map(n => (
                      <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, transition: 'all .3s',
                          background: step >= n ? '#7c3aed' : 'rgba(255,255,255,0.08)', color: step >= n ? '#fff' : 'rgba(240,233,255,0.4)',
                          boxShadow: step === n ? '0 0 14px rgba(124,58,237,0.5)' : 'none' }}>
                          {step > n ? <CheckCircle size={13} /> : n}
                        </div>
                        <span style={{ fontSize: 12, color: step >= n ? '#a78bfa' : 'rgba(240,233,255,0.3)', fontWeight: 600 }}>{n === 1 ? 'Account' : 'Profile'}</span>
                        {n < 2 && <div style={{ width: 28, height: 1.5, background: step > 1 ? '#7c3aed' : 'rgba(255,255,255,0.1)', transition: 'background .3s' }} />}
                      </div>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.form key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: .18 }}
                        onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#f0e9ff', marginBottom: 4 }}>Create account</h2>
                        <GlassInput icon={User} type="text" placeholder="Your full name" value={form.name} onChange={v => set('name', v)} required />
                        <GlassInput icon={Smartphone} type="tel" placeholder="WhatsApp number  e.g. 263778123456" value={form.phone} onChange={v => set('phone', v)} required />
                        <GlassInput icon={Lock} type={showPw ? 'text' : 'password'} placeholder="Create a password (min 6 chars)" value={form.password} onChange={v => set('password', v)} required minLength={6}
                          rightEl={<button type="button" onClick={() => setShowPw(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,233,255,0.4)', padding: 0, display: 'flex' }}>{showPw ? <EyeOff size={15} /> : <Eye size={15} />}</button>} />
                        <ErrBox msg={error} />
                        <GlassBtn label="Continue" icon={ChevronRight} />
                      </motion.form>
                    ) : (
                      <motion.form key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: .18 }}
                        onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#f0e9ff', marginBottom: 4 }}>Your study profile</h2>
                        <GlassInput icon={School} type="text" placeholder="School / Institution" value={form.school} onChange={v => set('school', v)} />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(240,233,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.5px' }}>Education Level</div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                            {LEVELS.map(l => (
                              <button key={l.value} type="button" onClick={() => { set('levelType', l.value); set('grade', GRADES[l.value][0]); }}
                                style={{ padding: '10px 6px', borderRadius: 12, border: `1.5px solid ${form.levelType === l.value ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`, background: form.levelType === l.value ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', textAlign: 'center', transition: 'all .18s',
                                  boxShadow: form.levelType === l.value ? '0 0 14px rgba(124,58,237,0.3)' : 'none' }}>
                                <l.icon size={18} style={{ color: form.levelType === l.value ? '#a78bfa' : 'rgba(240,233,255,0.4)', margin: '0 auto 4px' }} />
                                <div style={{ fontSize: 11.5, fontWeight: 700, color: form.levelType === l.value ? '#a78bfa' : 'rgba(240,233,255,0.5)' }}>{l.label}</div>
                                <div style={{ fontSize: 10, color: 'rgba(240,233,255,0.3)' }}>{l.sub}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(240,233,255,0.5)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                            {form.levelType === 'primary' ? 'Grade' : 'Form'}
                          </div>
                          <select value={form.grade} onChange={e => set('grade', e.target.value)}
                            style={{ ...glassInput }}>
                            {(GRADES[form.levelType] || []).map(g => <option key={g} value={g} style={{ background: '#1b0f3e' }}>{g}</option>)}
                          </select>
                        </div>
                        <ErrBox msg={error} />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button type="button" onClick={() => setStep(1)}
                            style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'rgba(240,233,255,0.7)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                            Back
                          </button>
                          <div style={{ flex: 2 }}><GlassBtn loading={loading} label="Create Account" icon={Sparkles} /></div>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                  <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'rgba(240,233,255,0.4)' }}>
                    Have an account? <button onClick={() => { setMode('login'); setError(''); }} style={{ background: 'none', border: 'none', color: '#a78bfa', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Log In</button>
                  </p>
                </motion.div>
              )}

              {/* ── ONBOARDING (login but no profile) ── */}
              {mode === 'onboard' && (
                <motion.div key="onboard" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}>
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <GraduationCap size={26} style={{ color: '#a78bfa' }} />
                    </div>
                    <h2 style={{ fontSize: 20, fontWeight: 900, color: '#f0e9ff', marginBottom: 6 }}>Complete your profile</h2>
                    <p style={{ fontSize: 13, color: 'rgba(240,233,255,0.5)' }}>Tell us about your studies so Fundo AI can personalise your experience.</p>
                  </div>
                  <form onSubmit={handleOnboard} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <GlassInput icon={User} type="text" placeholder="Your full name" value={form.name} onChange={v => set('name', v)} />
                    <GlassInput icon={School} type="text" placeholder="School / Institution" value={form.school} onChange={v => set('school', v)} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(240,233,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.5px' }}>Level</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                        {LEVELS.map(l => (
                          <button key={l.value} type="button" onClick={() => { set('levelType', l.value); set('grade', GRADES[l.value][0]); }}
                            style={{ padding: '10px 6px', borderRadius: 12, border: `1.5px solid ${form.levelType === l.value ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`, background: form.levelType === l.value ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', textAlign: 'center', transition: 'all .18s' }}>
                            <l.icon size={18} style={{ color: form.levelType === l.value ? '#a78bfa' : 'rgba(240,233,255,0.4)', margin: '0 auto 4px' }} />
                            <div style={{ fontSize: 11, fontWeight: 700, color: form.levelType === l.value ? '#a78bfa' : 'rgba(240,233,255,0.5)' }}>{l.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <select value={form.grade} onChange={e => set('grade', e.target.value)} style={{ ...glassInput }}>
                      {(GRADES[form.levelType] || []).map(g => <option key={g} value={g} style={{ background: '#1b0f3e' }}>{g}</option>)}
                    </select>
                    <ErrBox msg={error} />
                    <GlassBtn loading={loading} label="Enter Fundo AI" icon={ArrowRight} />
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .auth-left-hide { display: none !important; } }
        select option { background: #1b0f3e; color: #f0e9ff; }
        input::placeholder { color: rgba(240,233,255,0.35); }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px rgba(20,10,50,0.9) inset !important; -webkit-text-fill-color: #f0e9ff !important; }
      `}</style>
    </div>
  );
}

function GlassInput({ icon: Icon, rightEl, onChange, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <Icon size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,233,255,0.35)', pointerEvents: 'none' }} />
      <input
        {...props}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...glassInput, paddingLeft: 40, paddingRight: rightEl ? 40 : 16,
          border: `1px solid ${focused ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.12)'}`,
          boxShadow: focused ? '0 0 0 3px rgba(124,58,237,0.15), 0 0 16px rgba(124,58,237,0.1)' : 'none',
        }}
      />
      {rightEl && <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>{rightEl}</div>}
    </div>
  );
}

function GlassBtn({ loading, label, icon: Icon }) {
  return (
    <button type="submit" disabled={loading}
      style={{ width: '100%', padding: '13px', background: loading ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14.5, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all .2s', boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.4), 0 0 0 1px rgba(167,139,250,0.2)' }}>
      {loading ? <><span style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} /> Working…</> : <>{label} <Icon size={15} /></>}
    </button>
  );
}

function ErrBox({ msg }) {
  if (!msg) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, fontSize: 13, color: '#fca5a5', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ flex: 1 }}>{msg}</span>
    </motion.div>
  );
}
