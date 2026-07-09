import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Eye, EyeOff, Lock, User,
  CheckCircle, Sparkles, MessageCircle, BookOpen, Image, FileText,
  GraduationCap, ChevronRight, Star, Brain, ChevronDown, Gift,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SchoolAutocomplete from '../components/SchoolAutocomplete.jsx';

const COUNTRIES = [
  { code: 'ZW', dial: '263', flag: '🇿🇼', name: 'Zimbabwe' },
  { code: 'ZA', dial: '27',  flag: '🇿🇦', name: 'South Africa' },
  { code: 'ZM', dial: '260', flag: '🇿🇲', name: 'Zambia' },
  { code: 'BW', dial: '267', flag: '🇧🇼', name: 'Botswana' },
  { code: 'MZ', dial: '258', flag: '🇲🇿', name: 'Mozambique' },
  { code: 'MW', dial: '265', flag: '🇲🇼', name: 'Malawi' },
  { code: 'TZ', dial: '255', flag: '🇹🇿', name: 'Tanzania' },
  { code: 'KE', dial: '254', flag: '🇰🇪', name: 'Kenya' },
  { code: 'NG', dial: '234', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'GH', dial: '233', flag: '🇬🇭', name: 'Ghana' },
  { code: 'ET', dial: '251', flag: '🇪🇹', name: 'Ethiopia' },
  { code: 'UG', dial: '256', flag: '🇺🇬', name: 'Uganda' },
  { code: 'RW', dial: '250', flag: '🇷🇼', name: 'Rwanda' },
  { code: 'AO', dial: '244', flag: '🇦🇴', name: 'Angola' },
  { code: 'NA', dial: '264', flag: '🇳🇦', name: 'Namibia' },
  { code: 'SZ', dial: '268', flag: '🇸🇿', name: 'Eswatini' },
  { code: 'LS', dial: '266', flag: '🇱🇸', name: 'Lesotho' },
  { code: 'GB', dial: '44',  flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'US', dial: '1',   flag: '🇺🇸', name: 'United States' },
  { code: 'CA', dial: '1',   flag: '🇨🇦', name: 'Canada' },
  { code: 'AU', dial: '61',  flag: '🇦🇺', name: 'Australia' },
  { code: 'IN', dial: '91',  flag: '🇮🇳', name: 'India' },
  { code: 'DE', dial: '49',  flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', dial: '33',  flag: '🇫🇷', name: 'France' },
  { code: 'CN', dial: '86',  flag: '🇨🇳', name: 'China' },
];

const LEVELS = [
  { value: 'primary', label: 'Primary', sub: 'Grade 1–7', icon: BookOpen },
  { value: 'olevel',  label: 'O-Level',  sub: 'Form 1–4',  icon: GraduationCap },
  { value: 'alevel',  label: 'A-Level',  sub: 'Form 5–6',  icon: Star },
];

const GRADES = {
  primary: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7'],
  olevel:  ['Form 1','Form 2','Form 3','Form 4'],
  alevel:  ['Lower 6','Upper 6'],
};

const FEATURES = [
  { icon: MessageCircle, label: 'AI Chat Tutor',   sub: 'Ask anything, get expert answers' },
  { icon: FileText,      label: 'Study Notes',     sub: 'AI-generated curriculum notes' },
  { icon: Image,         label: 'Image Creator',   sub: 'Visualise concepts instantly' },
  { icon: Brain,         label: 'Mock Exams',      sub: 'Practice with real-style questions' },
  { icon: BookOpen,      label: 'Past Papers',     sub: 'ZIMSEC & Cambridge library' },
];

function normalizePhone(dial, local) {
  const digits = local.replace(/\D/g, '');
  const stripped = digits.startsWith('0') ? digits.slice(1) : digits;
  if (stripped.startsWith(dial)) return stripped;
  return dial + stripped;
}

function PhoneInput({ value, onChange, required }) {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [local, setLocal] = useState('');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapRef = useRef();

  useEffect(() => {
    function handle(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const filtered = search
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search))
    : COUNTRIES;

  function handleLocal(v) {
    setLocal(v);
    onChange(normalizePhone(country.dial, v));
  }

  function pickCountry(c) {
    setCountry(c); setOpen(false); setSearch('');
    onChange(normalizePhone(c.dial, local));
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', borderRadius: 11, border: '1.5px solid #e5e7eb', overflow: 'visible', background: '#f9fafb', transition: 'border .18s, box-shadow .18s' }}
        onFocus={() => {}} className="phone-wrap">
        <button type="button" onClick={() => setOpen(o => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '12px 10px 12px 13px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, color: '#111827', flexShrink: 0, fontFamily: 'inherit', whiteSpace: 'nowrap', borderRight: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>{country.flag}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>+{country.dial}</span>
          <ChevronDown size={12} style={{ color: '#9ca3af', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}/>
        </button>
        <input type="tel" value={local} onChange={e => handleLocal(e.target.value)}
          placeholder="e.g. 0719647303" required={required}
          style={{ flex: 1, padding: '12px 14px', border: 'none', background: 'transparent', fontSize: 14, color: '#111827', outline: 'none', fontFamily: 'inherit', minWidth: 0 }}/>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: .97 }} transition={{ duration: .15 }}
            style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 500, background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 13, boxShadow: '0 12px 40px rgba(0,0,0,0.13)', width: '100%', minWidth: 240, overflow: 'hidden' }}>
            <div style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6' }}>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search country…"
                autoFocus style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#f9fafb', color: '#111827' }}/>
            </div>
            <div style={{ maxHeight: 260, overflowY: 'auto' }}>
              {filtered.map(c => (
                <button key={c.code} type="button" onClick={() => pickCountry(c)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 14px', border: 'none', background: country.code === c.code ? '#f5f3ff' : 'transparent', cursor: 'pointer', fontSize: 13.5, fontFamily: 'inherit', textAlign: 'left', color: '#111827', transition: 'background .12s' }}>
                  <span style={{ fontSize: 20 }}>{c.flag}</span>
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <span style={{ color: '#9ca3af', fontSize: 12.5, fontWeight: 600 }}>+{c.dial}</span>
                </button>
              ))}
              {filtered.length === 0 && <div style={{ padding: '16px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No results</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StudentAuth() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode]   = useState('login');
  const [step, setStep]   = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [form, setForm]   = useState({
    phone: '', password: '', name: '', school: '',
    levelType: 'olevel', grade: 'Form 1',
    referredBy: searchParams.get('ref') || '',
  });

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) { setForm(f => ({ ...f, referredBy: ref })); setMode('signup'); }
  }, []);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setError(''); }

  async function handleLogin(e) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const r = await fetch('/api/student/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone, password: form.password }),
      });
      const d = await r.json();
      if (!r.ok) {
        if (d.error?.includes('No account')) { setMode('signup'); setStep(1); return; }
        throw new Error(d.error || 'Login failed');
      }
      localStorage.setItem('fundo_token', d.token);
      localStorage.setItem('fundo_user', JSON.stringify(d.user));
      if (!d.user?.school || !d.user?.levelLabel) { setMode('onboard'); return; }
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
        body: JSON.stringify({ phone: form.phone, password: form.password, name: form.name, school: form.school, levelType: form.levelType, levelLabel: levelLabels[form.levelType], grade: form.grade, referredBy: form.referredBy || undefined }),
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
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const levelLabels = { primary: 'Primary', olevel: 'O-Level', alevel: 'A-Level' };
      const token = localStorage.getItem('fundo_token');
      const r = await fetch('/api/student/update-profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, school: form.school, levelType: form.levelType, levelLabel: levelLabels[form.levelType], grade: form.grade }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Update failed');
      localStorage.setItem('fundo_user', JSON.stringify({ ...JSON.parse(localStorage.getItem('fundo_user') || '{}'), ...d.user }));
      nav('/student/app');
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-root">
      <div className="auth-layout">
        {/* Left branding panel */}
        <motion.div className="auth-left" initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: .7 }}>
          <div className="brand-row">
            <div className="brand-logo">
              <img src="https://media.mrfrankofc.gleeze.com/media/fcnd.png" alt="" onError={e => { e.target.style.display = 'none'; }} />
            </div>
            <span className="brand-name">Fundo<span>AI</span></span>
          </div>
          <h1 className="auth-headline">
            Your AI study partner.<br />
            <span className="pur-italic">Built for Zimbabwe.</span>
          </h1>
          <p className="auth-subhead">Powered by the same AI as ChatGPT — designed specifically for ZIMSEC and Cambridge students.</p>
          <div className="feature-list">
            {FEATURES.map((f, i) => (
              <motion.div key={f.label} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: .3 + i * .08 }} className="feature-item">
                <div className="feature-icon"><f.icon size={16} /></div>
                <div>
                  <div className="feature-label">{f.label}</div>
                  <div className="feature-sub">{f.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="auth-footer">© 2025 Fundo AI · Team: Darrell Mucheri & Crejinai Makanyisa</p>
        </motion.div>

        {/* Right form panel */}
        <div className="auth-right">
          <div className="mobile-logo">
            <div className="brand-logo sm"><img src="https://media.mrfrankofc.gleeze.com/media/fcnd.png" alt="" onError={e => { e.target.style.display = 'none'; }} /></div>
            <span className="brand-name sm">Fundo<span>AI</span></span>
          </div>

          <motion.div className="auth-card" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .6, delay: .1 }}>
            <AnimatePresence mode="wait">

              {/* ── LOGIN ── */}
              {mode === 'login' && (
                <motion.div key="login" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: .2 }}>
                  <TabSwitch mode={mode} onSwitch={m => { setMode(m); setStep(1); setError(''); }} />
                  <h2 className="card-title">Welcome back</h2>
                  <p className="card-sub">Log in to your study session.</p>
                  <form onSubmit={handleLogin} className="form-stack">
                    <div className="field-group">
                      <div className="field-label">WhatsApp Number</div>
                      <PhoneInput value={form.phone} onChange={v => set('phone', v)} required />
                    </div>
                    <FInput icon={Lock} type={showPw ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={v => set('password', v)}
                      rightEl={<button type="button" onClick={() => setShowPw(p => !p)} className="eye-btn">{showPw ? <EyeOff size={15}/> : <Eye size={15}/>}</button>} />
                    <ErrBox msg={error} />
                    <SubmitBtn loading={loading} label="Log In" icon={ArrowRight} />
                  </form>
                  <p className="switch-link">No account? <button onClick={() => { setMode('signup'); setError(''); }} className="link-btn">Sign Up Free</button></p>
                  <div className="wa-block">
                    <p className="wa-label">Prefer WhatsApp?</p>
                    <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer" className="wa-btn"><MessageCircle size={14}/> Open in WhatsApp</a>
                  </div>
                </motion.div>
              )}

              {/* ── SIGN UP ── */}
              {mode === 'signup' && (
                <motion.div key="signup" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: .2 }}>
                  <TabSwitch mode={mode} onSwitch={m => { setMode(m); setStep(1); setError(''); }} />
                  <div className="step-dots">
                    {[1,2].map(n => (
                      <div key={n} className="step-row">
                        <div className={`step-dot ${step >= n ? 'active' : ''} ${step > n ? 'done' : ''}`}>
                          {step > n ? <CheckCircle size={12}/> : n}
                        </div>
                        <span className={`step-lbl ${step >= n ? 'active' : ''}`}>{n === 1 ? 'Account' : 'Profile'}</span>
                        {n < 2 && <div className={`step-line ${step > 1 ? 'active' : ''}`} />}
                      </div>
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.form key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} onSubmit={handleSignup} className="form-stack">
                        <h2 className="card-title">Create account</h2>
                        <FInput icon={User} type="text" placeholder="Your full name" value={form.name} onChange={v => set('name', v)} required />
                        <div className="field-group">
                          <div className="field-label">WhatsApp Number</div>
                          <PhoneInput value={form.phone} onChange={v => set('phone', v)} required />
                        </div>
                        <FInput icon={Lock} type={showPw ? 'text' : 'password'} placeholder="Create a password (min 6 chars)" value={form.password} onChange={v => set('password', v)} required minLength={6}
                          rightEl={<button type="button" onClick={() => setShowPw(p => !p)} className="eye-btn">{showPw ? <EyeOff size={15}/> : <Eye size={15}/>}</button>} />
                        <ErrBox msg={error} />
                        <SubmitBtn label="Continue" icon={ChevronRight} />
                      </motion.form>
                    ) : (
                      <motion.form key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} onSubmit={handleSignup} className="form-stack">
                        <h2 className="card-title">Your study profile</h2>
                        <SchoolAutocomplete value={form.school} onChange={v => set('school', v)} />
                        <div className="field-group">
                          <div className="field-label">Education Level</div>
                          <div className="level-grid">
                            {LEVELS.map(l => (
                              <button key={l.value} type="button" onClick={() => { set('levelType', l.value); set('grade', GRADES[l.value][0]); }}
                                className={`level-btn ${form.levelType === l.value ? 'active' : ''}`}>
                                <l.icon size={17} className="level-icon" />
                                <div className="level-name">{l.label}</div>
                                <div className="level-sub">{l.sub}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="field-group">
                          <div className="field-label">Grade / Form</div>
                          <select value={form.grade} onChange={e => set('grade', e.target.value)} className="glass-select">
                            {(GRADES[form.levelType] || []).map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>
                        <div className="field-group">
                          <div className="field-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Gift size={11}/> Referral Code (optional)
                          </div>
                          <FInput icon={Gift} type="text" placeholder="Enter a friend's referral code" value={form.referredBy} onChange={v => set('referredBy', v.toUpperCase())} />
                        </div>
                        <ErrBox msg={error} />
                        <div className="two-btns">
                          <button type="button" onClick={() => setStep(1)} className="back-btn">Back</button>
                          <div style={{ flex: 2 }}><SubmitBtn loading={loading} label="Create Account" icon={Sparkles} /></div>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                  <p className="switch-link">Have an account? <button onClick={() => { setMode('login'); setError(''); }} className="link-btn">Log In</button></p>
                </motion.div>
              )}

              {/* ── ONBOARD ── */}
              {mode === 'onboard' && (
                <motion.div key="onboard" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .22 }}>
                  <div className="onboard-header">
                    <div className="onboard-icon"><GraduationCap size={24}/></div>
                    <h2 className="card-title" style={{ marginTop: 12 }}>Complete your profile</h2>
                    <p className="card-sub">Tell us about your studies so Fundo AI can personalise your experience.</p>
                  </div>
                  <form onSubmit={handleOnboard} className="form-stack">
                    <FInput icon={User} type="text" placeholder="Your full name" value={form.name} onChange={v => set('name', v)} />
                    <SchoolAutocomplete value={form.school} onChange={v => set('school', v)} />
                    <div className="field-group">
                      <div className="field-label">Education Level</div>
                      <div className="level-grid">
                        {LEVELS.map(l => (
                          <button key={l.value} type="button" onClick={() => { set('levelType', l.value); set('grade', GRADES[l.value][0]); }}
                            className={`level-btn ${form.levelType === l.value ? 'active' : ''}`}>
                            <l.icon size={17} className="level-icon" />
                            <div className="level-name">{l.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="field-group">
                      <div className="field-label">Grade / Form</div>
                      <select value={form.grade} onChange={e => set('grade', e.target.value)} className="glass-select">
                        {(GRADES[form.levelType] || []).map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <ErrBox msg={error} />
                    <SubmitBtn loading={loading} label="Enter Fundo AI" icon={ArrowRight} />
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-root {
          min-height: 100vh; min-height: 100dvh;
          font-family: 'Inter', system-ui, sans-serif;
          background: #f8f5ff;
          position: relative; overflow: hidden;
        }

        .auth-layout {
          position: relative; z-index: 1; min-height: 100vh; min-height: 100dvh;
          display: flex; align-items: stretch;
        }

        /* ── LEFT PANEL ── */
        .auth-left {
          width: 44%; padding: 48px 52px;
          display: flex; flex-direction: column; justify-content: center;
          background: linear-gradient(145deg, #7c3aed 0%, #6d28d9 55%, #4c1d95 100%);
          position: relative; overflow: hidden;
        }
        .auth-left::before {
          content: ''; position: absolute; top: -120px; right: -80px;
          width: 320px; height: 320px; border-radius: 50%;
          background: rgba(255,255,255,0.06); pointer-events: none;
        }
        .auth-left::after {
          content: ''; position: absolute; bottom: -80px; left: -60px;
          width: 240px; height: 240px; border-radius: 50%;
          background: rgba(255,255,255,0.05); pointer-events: none;
        }

        .brand-row { display: flex; align-items: center; gap: 12px; margin-bottom: 48px; position: relative; z-index: 1; }
        .brand-logo {
          width: 44px; height: 44px; border-radius: 13px; overflow: hidden;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .brand-logo img { width: 100%; height: 100%; object-fit: cover; }
        .brand-logo.sm { width: 36px; height: 36px; border-radius: 10px; background: #ede9fe; border: 1px solid #ddd6fe; }
        .brand-name { font-size: 22px; font-weight: 900; color: #fff; letter-spacing: -.5px; }
        .brand-name span { color: rgba(255,255,255,0.7); }
        .brand-name.sm { font-size: 18px; color: #111827; }
        .brand-name.sm span { color: #7c3aed; }

        .auth-headline {
          font-size: clamp(24px, 3vw, 38px); font-weight: 900; color: #fff;
          line-height: 1.15; margin-bottom: 16px; letter-spacing: -.04em; position: relative; z-index: 1;
        }
        .pur-italic { color: rgba(255,255,255,0.78); font-style: italic; }
        .auth-subhead { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.75; margin-bottom: 36px; position: relative; z-index: 1; }

        .feature-list { display: flex; flex-direction: column; gap: 9px; position: relative; z-index: 1; }
        .feature-item {
          display: flex; align-items: center; gap: 13px; padding: 11px 14px; border-radius: 13px;
          background: rgba(255,255,255,0.09); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.13);
        }
        .feature-icon {
          width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center; color: #fff;
        }
        .feature-label { font-size: 12.5px; font-weight: 700; color: #fff; }
        .feature-sub   { font-size: 11px; color: rgba(255,255,255,0.55); }
        .auth-footer   { margin-top: 36px; font-size: 11.5px; color: rgba(255,255,255,0.35); position: relative; z-index: 1; }

        /* ── RIGHT PANEL ── */
        .auth-right {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 32px 28px; overflow-y: auto; background: #fff;
        }
        .mobile-logo { display: none; align-items: center; gap: 10px; margin-bottom: 22px; }
        .auth-card {
          width: 100%; max-width: 420px; border-radius: 20px;
          padding: 32px 28px;
          background: #fff; border: 1.5px solid #e5e7eb;
          box-shadow: 0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(124,58,237,0.06);
        }

        /* ── FORM ELEMENTS ── */
        .card-title { font-size: 21px; font-weight: 900; color: #111827; margin: 0 0 5px; }
        .card-sub   { font-size: 13.5px; color: #6b7280; margin: 0 0 20px; }
        .form-stack { display: flex; flex-direction: column; gap: 12px; margin-top: 4px; }

        .f-input-wrap { position: relative; }
        .f-input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
        .f-input-right { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); }
        .f-input {
          width: 100%; padding: 12px 14px 12px 40px; border-radius: 11px;
          border: 1.5px solid #e5e7eb;
          background: #f9fafb; font-size: 14px; color: #111827;
          outline: none; font-family: inherit; transition: border .18s, box-shadow .18s, background .18s;
        }
        .f-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
        .f-input::placeholder { color: #9ca3af; }
        .eye-btn { background: none; border: none; cursor: pointer; color: #9ca3af; display: flex; padding: 0; }

        .phone-wrap:focus-within { border-color: #7c3aed !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff !important; }

        .submit-btn {
          width: 100%; padding: 13px; border: none; border-radius: 12px; cursor: pointer;
          font-size: 14.5px; font-weight: 700; color: #fff; display: flex; align-items: center;
          justify-content: center; gap: 8px; font-family: inherit; transition: all .18s;
          background: linear-gradient(135deg,#7c3aed,#6d28d9);
          box-shadow: 0 4px 16px rgba(124,58,237,0.32);
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.4); }
        .submit-btn:disabled { background: #c4b5fd; box-shadow: none; cursor: not-allowed; }
        .spin-ring {
          width: 15px; height: 15px; border-radius: 50%; display: inline-block;
          border: 2.5px solid rgba(255,255,255,0.4); border-top-color: #fff;
          animation: spin .7s linear infinite;
        }

        .tab-switch {
          display: flex; background: #f5f3ff; border-radius: 11px;
          padding: 3px; margin-bottom: 22px; border: 1.5px solid #ede9fe;
        }
        .tab-switch-btn {
          flex: 1; padding: 9px; border-radius: 9px; border: none; cursor: pointer;
          font-size: 14px; font-weight: 700; transition: all .2s; font-family: inherit;
        }
        .tab-switch-btn.active  { background: #7c3aed; color: #fff; box-shadow: 0 2px 10px rgba(124,58,237,0.3); }
        .tab-switch-btn.inactive{ background: transparent; color: #9ca3af; }

        .switch-link { text-align: center; margin-top: 16px; font-size: 13px; color: #6b7280; }
        .link-btn { background: none; border: none; color: #7c3aed; font-weight: 700; cursor: pointer; font-size: 13px; padding: 0; }

        .wa-block { margin-top: 20px; padding-top: 18px; border-top: 1px solid #e5e7eb; text-align: center; }
        .wa-label { font-size: 12.5px; color: #6b7280; margin-bottom: 10px; }
        .wa-btn {
          display: inline-flex; align-items: center; gap: 7px; background: #25D366;
          color: #fff; text-decoration: none; padding: 9px 20px; border-radius: 10px;
          font-size: 13.5px; font-weight: 700;
        }

        .step-dots { display: flex; align-items: center; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
        .step-row { display: flex; align-items: center; gap: 6px; }
        .step-dot {
          width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center;
          justify-content: center; font-size: 11.5px; font-weight: 700; flex-shrink: 0;
          background: #f3f4f6; color: #9ca3af; transition: all .25s; border: 1.5px solid #e5e7eb;
        }
        .step-dot.active { background: #7c3aed; color: #fff; border-color: #7c3aed; box-shadow: 0 0 10px rgba(124,58,237,0.35); }
        .step-lbl { font-size: 12px; color: #9ca3af; font-weight: 600; }
        .step-lbl.active { color: #7c3aed; }
        .step-line { width: 26px; height: 1.5px; background: #e5e7eb; transition: background .25s; }
        .step-line.active { background: #7c3aed; }

        .field-group { display: flex; flex-direction: column; gap: 7px; }
        .field-label { font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: .6px; }
        .level-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
        .level-btn {
          padding: 10px 6px; border-radius: 11px; border: 1.5px solid #e5e7eb;
          background: #f9fafb; cursor: pointer; text-align: center; transition: all .18s; font-family: inherit;
        }
        .level-btn:hover { border-color: #c4b5fd; background: #f5f3ff; }
        .level-btn.active { border-color: #7c3aed; background: #ede9fe; box-shadow: 0 0 10px rgba(124,58,237,0.15); }
        .level-icon { color: #9ca3af; margin: 0 auto 4px; display: block; }
        .level-btn.active .level-icon { color: #7c3aed; }
        .level-name { font-size: 11.5px; font-weight: 700; color: #4b5563; }
        .level-btn.active .level-name { color: #7c3aed; }
        .level-sub  { font-size: 10px; color: #9ca3af; }
        .glass-select {
          width: 100%; padding: 11px 14px; border-radius: 11px; border: 1.5px solid #e5e7eb;
          background: #f9fafb; color: #111827; font-size: 14px; outline: none;
          font-family: inherit; transition: border .18s;
          appearance: none; cursor: pointer;
        }
        .glass-select:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
        .glass-select option { background: #fff; color: #111827; }
        .two-btns { display: flex; gap: 9px; }
        .back-btn {
          flex: 1; padding: 13px; border-radius: 12px; border: 1.5px solid #e5e7eb;
          background: #f9fafb; color: #4b5563; font-size: 14px;
          font-weight: 600; cursor: pointer; font-family: inherit; transition: all .15s;
        }
        .back-btn:hover { background: #f3f4f6; border-color: #d1d5db; }
        .err-box {
          padding: 10px 13px; background: #fef2f2;
          border: 1px solid #fecaca; border-radius: 10px;
          font-size: 13px; color: #dc2626;
        }
        .onboard-header { text-align: center; margin-bottom: 12px; }
        .onboard-icon {
          width: 54px; height: 54px; border-radius: 50%; margin: 0 auto 8px;
          background: #ede9fe; border: 1.5px solid #c4b5fd;
          display: flex; align-items: center; justify-content: center; color: #7c3aed;
        }

        /* ── MOBILE ── */
        @media (max-width: 700px) {
          .auth-left   { display: none !important; }
          .auth-right  { padding: 20px 16px; justify-content: flex-start; padding-top: 28px; background: #f8f5ff; }
          .mobile-logo { display: flex; }
          .auth-card   { padding: 24px 20px; border-radius: 18px; max-width: 100%; }
          .card-title  { font-size: 19px; }
          .f-input     { font-size: 16px; }
          .glass-select { font-size: 16px; }
          .level-grid  { grid-template-columns: repeat(3,1fr); gap: 6px; }
          .level-btn   { padding: 9px 4px; }
          .level-name  { font-size: 10.5px; }
          .level-sub   { display: none; }
          .wa-block    { padding-top: 14px; margin-top: 14px; }
        }
        @media (max-width: 380px) {
          .auth-card   { padding: 20px 14px; }
          .level-name  { font-size: 9.5px; }
        }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #f9fafb inset !important;
          -webkit-text-fill-color: #111827 !important;
        }
      `}</style>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */
function TabSwitch({ mode, onSwitch }) {
  return (
    <div className="tab-switch">
      {[['login','Log In'],['signup','Sign Up']].map(([m,l]) => (
        <button key={m} onClick={() => onSwitch(m)} className={`tab-switch-btn ${mode === m ? 'active' : 'inactive'}`}>{l}</button>
      ))}
    </div>
  );
}

function FInput({ icon: Icon, rightEl, onChange, ...props }) {
  return (
    <div className="f-input-wrap">
      <Icon size={15} className="f-input-icon" />
      <input {...props} onChange={e => onChange(e.target.value)} className="f-input"
        style={{ paddingRight: rightEl ? 40 : 14 }} />
      {rightEl && <div className="f-input-right">{rightEl}</div>}
    </div>
  );
}

function ErrBox({ msg }) { return msg ? <div className="err-box">{msg}</div> : null; }

function SubmitBtn({ loading, label, icon: Icon }) {
  return (
    <button type="submit" disabled={loading} className="submit-btn">
      {loading ? <span className="spin-ring"/> : <>{label} <Icon size={15}/></>}
    </button>
  );
}
