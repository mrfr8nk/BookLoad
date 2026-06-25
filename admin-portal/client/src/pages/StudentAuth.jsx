import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Eye, EyeOff, Smartphone, Lock, User, School,
  CheckCircle, Sparkles, MessageCircle, BookOpen, Image, FileText,
  GraduationCap, ChevronRight, Star, Brain,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export default function StudentAuth() {
  const nav = useNavigate();
  const [mode, setMode]   = useState('login');
  const [step, setStep]   = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [form, setForm]   = useState({
    phone: '', password: '', name: '', school: '',
    levelType: 'olevel', grade: 'Form 1',
  });

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
        body: JSON.stringify({ phone: form.phone, password: form.password, name: form.name, school: form.school, levelType: form.levelType, levelLabel: levelLabels[form.levelType], grade: form.grade }),
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
      {/* Animated orbs */}
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />

      {/* Two-column layout */}
      <div className="auth-layout">
        {/* Left branding panel — hidden on mobile */}
        <motion.div className="auth-left" initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: .7 }}>
          <div className="brand-row">
            <div className="brand-logo">
              <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" onError={e => { e.target.style.display = 'none'; }} />
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
          <p className="auth-footer">© 2025 Fundo AI · Created by Darrell Mucheri</p>
        </motion.div>

        {/* Right form panel */}
        <div className="auth-right">
          {/* Mobile logo — only on small screens */}
          <div className="mobile-logo">
            <div className="brand-logo sm"><img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" onError={e => { e.target.style.display = 'none'; }} /></div>
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
                    <FInput icon={Smartphone} type="tel" placeholder="WhatsApp number  e.g. 263778123456" value={form.phone} onChange={v => set('phone', v)} />
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
                  {/* Step dots */}
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
                        <FInput icon={Smartphone} type="tel" placeholder="WhatsApp number  e.g. 263778123456" value={form.phone} onChange={v => set('phone', v)} required />
                        <FInput icon={Lock} type={showPw ? 'text' : 'password'} placeholder="Create a password (min 6 chars)" value={form.password} onChange={v => set('password', v)} required minLength={6}
                          rightEl={<button type="button" onClick={() => setShowPw(p => !p)} className="eye-btn">{showPw ? <EyeOff size={15}/> : <Eye size={15}/>}</button>} />
                        <ErrBox msg={error} />
                        <SubmitBtn label="Continue" icon={ChevronRight} />
                      </motion.form>
                    ) : (
                      <motion.form key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} onSubmit={handleSignup} className="form-stack">
                        <h2 className="card-title">Your study profile</h2>
                        <FInput icon={School} type="text" placeholder="School / Institution" value={form.school} onChange={v => set('school', v)} />
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
                    <FInput icon={School} type="text" placeholder="School / Institution" value={form.school} onChange={v => set('school', v)} />
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
          background: linear-gradient(135deg, #0c0521 0%, #1b0f3e 40%, #0a1a3f 100%);
          position: relative; overflow: hidden;
        }
        .orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .orb1 { width: 500px; height: 500px; top: -150px; left: -150px; background: rgba(124,58,237,0.22); }
        .orb2 { width: 400px; height: 400px; bottom: -100px; right: -100px; background: rgba(59,130,246,0.15); }
        .orb3 { width: 280px; height: 280px; top: 55%; left: 45%; background: rgba(139,92,246,0.12); }

        .auth-layout {
          position: relative; z-index: 1; min-height: 100vh; min-height: 100dvh;
          display: flex; align-items: stretch;
        }

        /* ── LEFT PANEL ── */
        .auth-left {
          width: 45%; padding: 48px 52px;
          display: flex; flex-direction: column; justify-content: center;
        }
        .brand-row { display: flex; align-items: center; gap: 12px; margin-bottom: 48px; }
        .brand-logo {
          width: 44px; height: 44px; border-radius: 13px; overflow: hidden;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .brand-logo img { width: 100%; height: 100%; object-fit: cover; }
        .brand-logo.sm { width: 36px; height: 36px; border-radius: 10px; }
        .brand-name { font-size: 22px; font-weight: 900; color: #fff; letter-spacing: -.5px; }
        .brand-name span { color: #a78bfa; }
        .brand-name.sm { font-size: 18px; }
        .auth-headline {
          font-size: clamp(26px, 3.2vw, 40px); font-weight: 900; color: #fff;
          line-height: 1.15; margin-bottom: 16px; letter-spacing: -.04em;
        }
        .pur-italic { color: #a78bfa; font-style: italic; }
        .auth-subhead { font-size: 14.5px; color: rgba(240,233,255,0.58); line-height: 1.75; margin-bottom: 36px; }
        .feature-list { display: flex; flex-direction: column; gap: 10px; }
        .feature-item {
          display: flex; align-items: center; gap: 13px; padding: 11px 15px; border-radius: 13px;
          background: rgba(255,255,255,0.05); backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .feature-icon {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          background: rgba(167,139,250,0.14); border: 1px solid rgba(167,139,250,0.18);
          display: flex; align-items: center; justify-content: center; color: #a78bfa;
        }
        .feature-label { font-size: 13px; font-weight: 700; color: #f0e9ff; }
        .feature-sub   { font-size: 11.5px; color: rgba(240,233,255,0.45); }
        .auth-footer   { margin-top: 36px; font-size: 12px; color: rgba(240,233,255,0.28); }

        /* ── RIGHT PANEL ── */
        .auth-right {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 32px 24px; overflow-y: auto;
        }
        .mobile-logo { display: none; align-items: center; gap: 10px; margin-bottom: 22px; }
        .auth-card {
          width: 100%; max-width: 420px; border-radius: 22px;
          padding: 32px 28px;
          background: rgba(255,255,255,0.06); backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.11);
          box-shadow: 0 28px 70px rgba(0,0,0,0.38);
        }

        /* ── FORM ELEMENTS ── */
        .card-title { font-size: 21px; font-weight: 900; color: #f0e9ff; margin: 0 0 5px; }
        .card-sub   { font-size: 13.5px; color: rgba(240,233,255,0.5); margin: 0 0 20px; }
        .form-stack { display: flex; flex-direction: column; gap: 13px; margin-top: 4px; }

        .f-input-wrap { position: relative; }
        .f-input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: rgba(240,233,255,0.32); pointer-events: none; }
        .f-input-right { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); }
        .f-input {
          width: 100%; padding: 12px 14px 12px 40px; border-radius: 11px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.07); font-size: 14px; color: #f0e9ff;
          outline: none; font-family: inherit; transition: border .18s, box-shadow .18s;
        }
        .f-input:focus { border-color: rgba(167,139,250,0.5); box-shadow: 0 0 0 3px rgba(124,58,237,0.14); }
        .f-input::placeholder { color: rgba(240,233,255,0.28); }
        .eye-btn { background: none; border: none; cursor: pointer; color: rgba(240,233,255,0.38); display: flex; padding: 0; }

        .submit-btn {
          width: 100%; padding: 13px; border: none; border-radius: 12px; cursor: pointer;
          font-size: 14.5px; font-weight: 700; color: #fff; display: flex; align-items: center;
          justify-content: center; gap: 8px; font-family: inherit; transition: all .18s;
          background: linear-gradient(135deg,#7c3aed,#6d28d9);
          box-shadow: 0 4px 18px rgba(124,58,237,0.38);
        }
        .submit-btn:disabled { background: rgba(124,58,237,0.3); box-shadow: none; cursor: not-allowed; }
        .spin-ring {
          width: 15px; height: 15px; border-radius: 50%; display: inline-block;
          border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff;
          animation: spin .7s linear infinite;
        }

        .tab-switch {
          display: flex; background: rgba(255,255,255,0.06); border-radius: 11px;
          padding: 3px; margin-bottom: 22px; border: 1px solid rgba(255,255,255,0.08);
        }
        .tab-switch-btn {
          flex: 1; padding: 9px; border-radius: 9px; border: none; cursor: pointer;
          font-size: 14px; font-weight: 700; transition: all .2s; font-family: inherit;
        }
        .tab-switch-btn.active  { background: rgba(167,139,250,0.22); color: #a78bfa; box-shadow: 0 0 14px rgba(124,58,237,0.28); }
        .tab-switch-btn.inactive{ background: transparent; color: rgba(240,233,255,0.4); }

        .switch-link { text-align: center; margin-top: 16px; font-size: 13px; color: rgba(240,233,255,0.42); }
        .link-btn { background: none; border: none; color: #a78bfa; font-weight: 700; cursor: pointer; font-size: 13px; padding: 0; }

        .wa-block { margin-top: 20px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; }
        .wa-label { font-size: 12.5px; color: rgba(240,233,255,0.38); margin-bottom: 10px; }
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
          background: rgba(255,255,255,0.08); color: rgba(240,233,255,0.38); transition: all .25s;
        }
        .step-dot.active { background: #7c3aed; color: #fff; box-shadow: 0 0 12px rgba(124,58,237,0.5); }
        .step-lbl { font-size: 12px; color: rgba(240,233,255,0.3); font-weight: 600; }
        .step-lbl.active { color: #a78bfa; }
        .step-line { width: 26px; height: 1.5px; background: rgba(255,255,255,0.1); transition: background .25s; }
        .step-line.active { background: #7c3aed; }

        .field-group { display: flex; flex-direction: column; gap: 7px; }
        .field-label { font-size: 11px; font-weight: 700; color: rgba(240,233,255,0.45); text-transform: uppercase; letter-spacing: .6px; }
        .level-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
        .level-btn {
          padding: 10px 6px; border-radius: 11px; border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04); cursor: pointer; text-align: center; transition: all .18s; font-family: inherit;
        }
        .level-btn.active { border-color: rgba(124,58,237,0.5); background: rgba(124,58,237,0.22); box-shadow: 0 0 12px rgba(124,58,237,0.28); }
        .level-icon { color: rgba(240,233,255,0.38); margin: 0 auto 4px; display: block; }
        .level-btn.active .level-icon { color: #a78bfa; }
        .level-name { font-size: 11.5px; font-weight: 700; color: rgba(240,233,255,0.45); }
        .level-btn.active .level-name { color: #a78bfa; }
        .level-sub  { font-size: 10px; color: rgba(240,233,255,0.28); }
        .glass-select {
          width: 100%; padding: 11px 14px; border-radius: 11px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.07); font-size: 14px; color: #f0e9ff;
          outline: none; font-family: inherit; appearance: none; cursor: pointer;
        }
        .glass-select option { background: #1b0f3e; }
        .two-btns { display: flex; gap: 9px; }
        .back-btn {
          flex: 1; padding: 13px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06); color: rgba(240,233,255,0.65); font-size: 14px;
          font-weight: 600; cursor: pointer; font-family: inherit;
        }
        .err-box {
          padding: 10px 13px; background: rgba(239,68,68,0.13);
          border: 1px solid rgba(239,68,68,0.28); border-radius: 10px;
          font-size: 13px; color: #fca5a5;
        }
        .onboard-header { text-align: center; margin-bottom: 12px; }
        .onboard-icon {
          width: 54px; height: 54px; border-radius: 50%; margin: 0 auto 8px;
          background: rgba(124,58,237,0.22); border: 1px solid rgba(124,58,237,0.38);
          display: flex; align-items: center; justify-content: center; color: #a78bfa;
        }

        /* ── MOBILE ── */
        @media (max-width: 700px) {
          .auth-left   { display: none !important; }
          .auth-right  { padding: 20px 16px; justify-content: flex-start; padding-top: 28px; }
          .mobile-logo { display: flex; }
          .auth-card   { padding: 24px 20px; border-radius: 18px; max-width: 100%; }
          .card-title  { font-size: 19px; }
          .auth-headline { font-size: 24px; }
          .f-input     { font-size: 16px; } /* prevents iOS zoom */
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
          -webkit-box-shadow: 0 0 0 1000px rgba(20,10,50,0.95) inset !important;
          -webkit-text-fill-color: #f0e9ff !important;
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

function SubmitBtn({ loading, label, icon: Icon }) {
  return (
    <button type="submit" disabled={loading} className="submit-btn">
      {loading ? <><span className="spin-ring" /> Working…</> : <>{label} {Icon && <Icon size={15}/>}</>}
    </button>
  );
}

function ErrBox({ msg }) {
  if (!msg) return null;
  return <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="err-box">{msg}</motion.div>;
}
