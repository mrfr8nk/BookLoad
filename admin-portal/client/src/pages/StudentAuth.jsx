import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowRight, Eye, EyeOff, GraduationCap, Smartphone, Lock, User, School, CheckCircle, Sparkles, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const C = {
  purple: '#7c3aed', purpleDk: '#6d28d9', purpleLt: '#f5f3ff',
  gray900: '#111827', gray700: '#374151', gray500: '#6b7280', gray300: '#d1d5db', gray100: '#f3f4f6',
  green: '#059669', red: '#dc2626',
};

const LEVELS = [
  { value: 'primary', label: 'Primary School', sub: 'Grade 1 – 7', icon: '🏫' },
  { value: 'olevel',  label: 'O-Level',         sub: 'Form 1 – 4', icon: '📘' },
  { value: 'alevel',  label: 'A-Level',          sub: 'Form 5 – 6', icon: '🎓' },
];

const GRADES = {
  primary: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7'],
  olevel:  ['Form 1','Form 2','Form 3','Form 4'],
  alevel:  ['Lower 6','Upper 6'],
};

function inp(extra = {}) {
  return {
    style: {
      width: '100%', padding: '11px 14px', border: `1.5px solid ${C.gray300}`,
      borderRadius: 10, fontSize: 14, outline: 'none', background: '#fff',
      color: C.gray900, transition: 'border .15s', boxSizing: 'border-box',
      ...extra,
    },
    onFocus: e => e.target.style.borderColor = C.purple,
    onBlur:  e => e.target.style.borderColor = C.gray300,
  };
}

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

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleLogin(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const r = await fetch('/api/student/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone, password: form.password }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Login failed');
      localStorage.setItem('fundo_token', d.token);
      localStorage.setItem('fundo_user', JSON.stringify(d.user));
      nav('/student/app');
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
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
    } catch (e) {
      setError(e.message); setStep(2);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Left panel — branding */}
      <motion.div
        initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: .6 }}
        style={{
          width: '45%', background: 'linear-gradient(145deg, #4c1d95 0%, #7c3aed 45%, #8b5cf6 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 52px',
          position: 'relative', overflow: 'hidden',
        }}
        className="auth-left-panel"
      >
        {/* BG blobs */}
        <div style={{ position:'absolute',top:-120,right:-80,width:340,height:340,borderRadius:'50%',background:'rgba(255,255,255,.06)',pointerEvents:'none' }}/>
        <div style={{ position:'absolute',bottom:-100,left:-60,width:280,height:280,borderRadius:'50%',background:'rgba(255,255,255,.04)',pointerEvents:'none' }}/>

        {/* Logo */}
        <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:52 }}>
          <div style={{ width:44,height:44,borderRadius:12,background:'rgba(255,255,255,.18)',border:'1.5px solid rgba(255,255,255,.3)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden' }}>
            <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} onError={e=>{e.target.style.display='none';}} />
          </div>
          <span style={{ fontSize:22,fontWeight:900,color:'#fff',letterSpacing:'-.4px' }}>Fundo<span style={{ color:'#c4b5fd' }}>AI</span></span>
        </div>

        <div style={{ marginBottom:40 }}>
          <h1 style={{ fontSize:36,fontWeight:900,color:'#fff',lineHeight:1.15,marginBottom:16,letterSpacing:'-.04em' }}>
            Your AI study partner.<br/>
            <span style={{ color:'#c4b5fd' }}>Built for Zimbabwe.</span>
          </h1>
          <p style={{ fontSize:16,color:'rgba(255,255,255,.75)',lineHeight:1.7 }}>
            Powered by the same AI as ChatGPT — designed specifically for ZIMSEC and Cambridge students.
          </p>
        </div>

        {/* Feature bullets */}
        {[
          { icon:'💬', label:'AI Chat — ask anything, get expert answers' },
          { icon:'📚', label:'Past papers, syllabuses & textbooks' },
          { icon:'🎨', label:'AI image generator for projects & notes' },
          { icon:'📝', label:'AI study notes & summaries on demand' },
          { icon:'🏆', label:'ZIMSEC & Cambridge curriculum coverage' },
        ].map((f, i) => (
          <motion.div key={f.label} initial={{ x:-20, opacity:0 }} animate={{ x:0, opacity:1 }} transition={{ delay:.3+i*.08 }}
            style={{ display:'flex',alignItems:'center',gap:12,marginBottom:14 }}>
            <span style={{ fontSize:20 }}>{f.icon}</span>
            <span style={{ fontSize:14,color:'rgba(255,255,255,.82)',fontWeight:500 }}>{f.label}</span>
          </motion.div>
        ))}

        <div style={{ marginTop:40,paddingTop:28,borderTop:'1px solid rgba(255,255,255,.15)',fontSize:13,color:'rgba(255,255,255,.5)' }}>
          © 2025 Fundo AI · Created by Darrell Mucheri
        </div>
      </motion.div>

      {/* Right panel — form */}
      <div style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',background:'#fafafa',padding:'48px 24px' }}>
        <motion.div
          initial={{ y:20,opacity:0 }} animate={{ y:0,opacity:1 }} transition={{ duration:.5,delay:.1 }}
          style={{ width:'100%',maxWidth:440 }}
        >
          {/* Tabs */}
          <div style={{ display:'flex',background:'#fff',border:`1.5px solid ${C.gray300}`,borderRadius:12,padding:4,marginBottom:36 }}>
            {[['login','Log In'],['signup','Sign Up']].map(([m,label]) => (
              <button key={m} onClick={()=>{ setMode(m); setStep(1); setError(''); }}
                style={{ flex:1,padding:'10px',borderRadius:9,border:'none',cursor:'pointer',fontSize:14.5,fontWeight:700,transition:'all .18s',
                  background:mode===m?C.purple:'transparent', color:mode===m?'#fff':C.gray500 }}>
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div key="login" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:.25}}>
                <h2 style={{ fontSize:26,fontWeight:900,color:C.gray900,marginBottom:6 }}>Welcome back 👋</h2>
                <p style={{ fontSize:14,color:C.gray500,marginBottom:28 }}>Log in to continue your study sessions.</p>

                <form onSubmit={handleLogin} style={{ display:'flex',flexDirection:'column',gap:16 }}>
                  <div>
                    <label style={{ fontSize:13,fontWeight:600,color:C.gray700,display:'block',marginBottom:6 }}>WhatsApp Number</label>
                    <div style={{ position:'relative' }}>
                      <Smartphone size={16} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:C.gray500 }}/>
                      <input {...inp({ paddingLeft:38 })} type="tel" placeholder="e.g. 263778123456" value={form.phone}
                        onChange={e=>set('phone',e.target.value)} required />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize:13,fontWeight:600,color:C.gray700,display:'block',marginBottom:6 }}>Password</label>
                    <div style={{ position:'relative' }}>
                      <Lock size={16} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:C.gray500 }}/>
                      <input {...inp({ paddingLeft:38,paddingRight:40 })} type={showPw?'text':'password'} placeholder="Your password"
                        value={form.password} onChange={e=>set('password',e.target.value)} required />
                      <button type="button" onClick={()=>setShowPw(p=>!p)}
                        style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:C.gray500,padding:0 }}>
                        {showPw?<EyeOff size={16}/>:<Eye size={16}/>}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div style={{ background:'#fef2f2',border:'1.5px solid #fecaca',borderRadius:8,padding:'10px 14px',fontSize:13,color:C.red }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    style={{ background:loading?C.gray300:C.purple,color:'#fff',border:'none',borderRadius:10,padding:'13px',fontSize:15,fontWeight:700,cursor:loading?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all .18s' }}>
                    {loading ? <><span style={{ width:16,height:16,border:'2.5px solid rgba(255,255,255,.4)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite',display:'inline-block' }}/> Logging in…</> : <>Log In <ArrowRight size={15}/></>}
                  </button>
                </form>

                <p style={{ textAlign:'center',marginTop:20,fontSize:13.5,color:C.gray500 }}>
                  No account? <button onClick={()=>{setMode('signup');setStep(1);setError('');}} style={{ background:'none',border:'none',color:C.purple,fontWeight:700,cursor:'pointer',fontSize:13.5 }}>Sign Up Free</button>
                </p>
              </motion.div>
            ) : (
              <motion.div key="signup" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:.25}}>
                {/* Step indicator */}
                <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:28 }}>
                  {[1,2].map(n=>(
                    <div key={n} style={{ display:'flex',alignItems:'center',gap:8 }}>
                      <div style={{ width:28,height:28,borderRadius:'50%',background:step>=n?C.purple:C.gray100,color:step>=n?'#fff':C.gray500,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12.5,fontWeight:700,transition:'all .25s' }}>
                        {step>n?<CheckCircle size={14}/>:n}
                      </div>
                      <span style={{ fontSize:12.5,fontWeight:600,color:step>=n?C.gray900:C.gray500 }}>
                        {n===1?'Account':'Profile'}
                      </span>
                      {n<2&&<div style={{ width:32,height:1.5,background:step>1?C.purple:C.gray300,transition:'background .25s' }}/>}
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.form key="s1" initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}} transition={{duration:.2}}
                      onSubmit={handleSignup} style={{ display:'flex',flexDirection:'column',gap:16 }}>
                      <h2 style={{ fontSize:24,fontWeight:900,color:C.gray900,marginBottom:2 }}>Create your account ✨</h2>
                      <p style={{ fontSize:13.5,color:C.gray500,marginBottom:8 }}>Free forever. No credit card needed.</p>

                      <div>
                        <label style={{ fontSize:13,fontWeight:600,color:C.gray700,display:'block',marginBottom:6 }}>Your Name</label>
                        <div style={{ position:'relative' }}>
                          <User size={16} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:C.gray500 }}/>
                          <input {...inp({ paddingLeft:38 })} type="text" placeholder="Full name" value={form.name}
                            onChange={e=>set('name',e.target.value)} required />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize:13,fontWeight:600,color:C.gray700,display:'block',marginBottom:6 }}>WhatsApp Number</label>
                        <div style={{ position:'relative' }}>
                          <Smartphone size={16} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:C.gray500 }}/>
                          <input {...inp({ paddingLeft:38 })} type="tel" placeholder="e.g. 263778123456" value={form.phone}
                            onChange={e=>set('phone',e.target.value)} required />
                        </div>
                        <p style={{ fontSize:11.5,color:C.gray500,marginTop:5 }}>Use your Zim number with country code (263...)</p>
                      </div>

                      <div>
                        <label style={{ fontSize:13,fontWeight:600,color:C.gray700,display:'block',marginBottom:6 }}>Password</label>
                        <div style={{ position:'relative' }}>
                          <Lock size={16} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:C.gray500 }}/>
                          <input {...inp({ paddingLeft:38,paddingRight:40 })} type={showPw?'text':'password'} placeholder="Create a password"
                            value={form.password} onChange={e=>set('password',e.target.value)} required minLength={6} />
                          <button type="button" onClick={()=>setShowPw(p=>!p)}
                            style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:C.gray500,padding:0 }}>
                            {showPw?<EyeOff size={16}/>:<Eye size={16}/>}
                          </button>
                        </div>
                      </div>

                      <button type="submit"
                        style={{ background:C.purple,color:'#fff',border:'none',borderRadius:10,padding:'13px',fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginTop:4 }}>
                        Continue <ArrowRight size={15}/>
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form key="s2" initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}} transition={{duration:.2}}
                      onSubmit={handleSignup} style={{ display:'flex',flexDirection:'column',gap:16 }}>
                      <h2 style={{ fontSize:24,fontWeight:900,color:C.gray900,marginBottom:2 }}>Your study profile 📚</h2>
                      <p style={{ fontSize:13.5,color:C.gray500,marginBottom:8 }}>Helps Fundo AI tailor content for you.</p>

                      <div>
                        <label style={{ fontSize:13,fontWeight:600,color:C.gray700,display:'block',marginBottom:6 }}>School / Institution</label>
                        <div style={{ position:'relative' }}>
                          <School size={16} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:C.gray500 }}/>
                          <input {...inp({ paddingLeft:38 })} type="text" placeholder="Your school name" value={form.school}
                            onChange={e=>set('school',e.target.value)} />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize:13,fontWeight:600,color:C.gray700,display:'block',marginBottom:10 }}>Education Level</label>
                        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8 }}>
                          {LEVELS.map(l=>(
                            <button key={l.value} type="button" onClick={()=>{ set('levelType',l.value); set('grade',GRADES[l.value][0]||''); }}
                              style={{ padding:'12px 8px',borderRadius:10,border:`2px solid ${form.levelType===l.value?C.purple:C.gray300}`,background:form.levelType===l.value?C.purpleLt:'#fff',cursor:'pointer',transition:'all .15s',textAlign:'center' }}>
                              <div style={{ fontSize:20,marginBottom:4 }}>{l.icon}</div>
                              <div style={{ fontSize:12.5,fontWeight:700,color:form.levelType===l.value?C.purple:C.gray700 }}>{l.label}</div>
                              <div style={{ fontSize:11,color:C.gray500 }}>{l.sub}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize:13,fontWeight:600,color:C.gray700,display:'block',marginBottom:6 }}>
                          {form.levelType==='primary'?'Grade':'Form'}
                        </label>
                        <select value={form.grade} onChange={e=>set('grade',e.target.value)}
                          style={{ ...inp().style, appearance:'none', background:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center #fff` }}>
                          {(GRADES[form.levelType]||[]).map(g=>(
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>

                      {error && (
                        <div style={{ background:'#fef2f2',border:'1.5px solid #fecaca',borderRadius:8,padding:'10px 14px',fontSize:13,color:C.red }}>
                          {error}
                        </div>
                      )}

                      <div style={{ display:'flex',gap:10,marginTop:4 }}>
                        <button type="button" onClick={()=>setStep(1)}
                          style={{ flex:1,padding:'13px',borderRadius:10,border:`1.5px solid ${C.gray300}`,background:'#fff',color:C.gray700,fontSize:14.5,fontWeight:700,cursor:'pointer' }}>
                          Back
                        </button>
                        <button type="submit" disabled={loading}
                          style={{ flex:2,background:loading?C.gray300:C.purple,color:'#fff',border:'none',borderRadius:10,padding:'13px',fontSize:15,fontWeight:700,cursor:loading?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                          {loading?<><span style={{ width:16,height:16,border:'2.5px solid rgba(255,255,255,.4)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite',display:'inline-block' }}/> Creating…</>:<><Sparkles size={15}/> Create Account</>}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <p style={{ textAlign:'center',marginTop:20,fontSize:13.5,color:C.gray500 }}>
                  Have an account? <button onClick={()=>{setMode('login');setError('');}} style={{ background:'none',border:'none',color:C.purple,fontWeight:700,cursor:'pointer',fontSize:13.5 }}>Log In</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* WhatsApp CTA */}
          <div style={{ marginTop:28,padding:'16px',background:C.purpleLt,border:`1px solid #ddd6fe`,borderRadius:12,textAlign:'center' }}>
            <p style={{ fontSize:13,color:C.gray700,marginBottom:10 }}>
              Prefer WhatsApp? Use Fundo AI directly on your phone!
            </p>
            <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex',alignItems:'center',gap:8,background:'#25D366',color:'#fff',textDecoration:'none',padding:'9px 20px',borderRadius:8,fontSize:13.5,fontWeight:700 }}>
              <MessageCircle size={15}/> Open in WhatsApp
            </a>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
