import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Image, FileText, BookOpen, ClipboardCheck, User,
  Send, Plus, LogOut, Sparkles, Download, Search, Loader,
  Zap, Crown, ArrowUpRight, AlertCircle, RefreshCw, Copy, Check,
  ChevronRight, Brain, Trophy, Target, RotateCcw, PlayCircle,
  Smartphone, School, GraduationCap, Star, BarChart3, Flame,
  Menu, Sun, Moon, Camera, X, Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

/* ─── Theme ─────────────────────────────────────────────────────────────────── */
const DARK = {
  bg:              'linear-gradient(135deg,#0c0521 0%,#150b35 50%,#0a1830 100%)',
  surface:         'rgba(255,255,255,0.05)',
  surfaceHov:      'rgba(255,255,255,0.08)',
  border:          'rgba(255,255,255,0.08)',
  borderStrong:    'rgba(255,255,255,0.12)',
  text:            '#f0e9ff',
  muted:           'rgba(240,233,255,0.52)',
  dim:             'rgba(240,233,255,0.3)',
  sidebarBg:       'rgba(10,3,27,0.82)',
  sidebarOverlay:  'rgba(8,2,22,0.96)',
  topbarBg:        'rgba(10,3,27,0.6)',
  inputBg:         'rgba(255,255,255,0.06)',
  chatUserBg:      'linear-gradient(135deg,#7c3aed,#5b21b6)',
  chatUserText:    '#fff',
  chatAiBg:        'rgba(255,255,255,0.06)',
  chatAiBorder:    'rgba(255,255,255,0.08)',
  chatAiText:      '#f0e9ff',
  bottomNav:       'rgba(8,2,22,0.96)',
  accent:          '#a78bfa',
  accentMain:      '#7c3aed',
  accentBg:        'rgba(124,58,237,0.18)',
  accentBorder:    'rgba(124,58,237,0.35)',
  orbA:            'rgba(124,58,237,0.18)',
  orbB:            'rgba(59,130,246,0.11)',
  starterBg:       'rgba(255,255,255,0.04)',
  starterBorder:   'rgba(255,255,255,0.08)',
  starterText:     'rgba(240,233,255,0.55)',
  errBg:           'rgba(239,68,68,0.11)',
  errBorder:       'rgba(239,68,68,0.22)',
  errText:         '#fca5a5',
  tagBg:           'rgba(255,255,255,0.04)',
  tagBorder:       'rgba(255,255,255,0.07)',
  tagText:         'rgba(240,233,255,0.35)',
  scrollThumb:     'rgba(124,58,237,0.28)',
  visionPanelBg:   'rgba(10,3,27,0.92)',
};

const LIGHT = {
  bg:              'linear-gradient(135deg,#f3eeff 0%,#f9f7ff 50%,#edf0ff 100%)',
  surface:         'rgba(255,255,255,0.88)',
  surfaceHov:      'rgba(255,255,255,0.98)',
  border:          'rgba(124,58,237,0.13)',
  borderStrong:    'rgba(124,58,237,0.2)',
  text:            '#18063a',
  muted:           'rgba(24,6,58,0.55)',
  dim:             'rgba(24,6,58,0.38)',
  sidebarBg:       'rgba(246,241,255,0.92)',
  sidebarOverlay:  'rgba(244,239,255,0.98)',
  topbarBg:        'rgba(248,244,255,0.9)',
  inputBg:         'rgba(124,58,237,0.05)',
  chatUserBg:      'linear-gradient(135deg,#7c3aed,#5b21b6)',
  chatUserText:    '#fff',
  chatAiBg:        'rgba(255,255,255,0.92)',
  chatAiBorder:    'rgba(124,58,237,0.13)',
  chatAiText:      '#18063a',
  bottomNav:       'rgba(246,241,255,0.97)',
  accent:          '#6d28d9',
  accentMain:      '#7c3aed',
  accentBg:        'rgba(124,58,237,0.1)',
  accentBorder:    'rgba(124,58,237,0.22)',
  orbA:            'rgba(124,58,237,0.09)',
  orbB:            'rgba(59,130,246,0.07)',
  starterBg:       'rgba(255,255,255,0.78)',
  starterBorder:   'rgba(124,58,237,0.13)',
  starterText:     'rgba(24,6,58,0.55)',
  errBg:           'rgba(239,68,68,0.07)',
  errBorder:       'rgba(239,68,68,0.2)',
  errText:         '#b91c1c',
  tagBg:           'rgba(124,58,237,0.06)',
  tagBorder:       'rgba(124,58,237,0.1)',
  tagText:         'rgba(24,6,58,0.45)',
  scrollThumb:     'rgba(124,58,237,0.22)',
  visionPanelBg:   'rgba(246,241,255,0.98)',
};

function useTheme() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('fundo_theme') !== 'light');
  const toggle = useCallback(() => {
    setIsDark(d => {
      const next = !d;
      localStorage.setItem('fundo_theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);
  const p = isDark ? DARK : LIGHT;
  return { isDark, toggle, p };
}

/* ─── Mobile detection ───────────────────────────────────────────────────────── */
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

/* ─── Constants ─────────────────────────────────────────────────────────────── */
const PLAN_COLOR = { FREE:'#6b7280',STARTER:'#3b82f6',BASIC:'#10b981',PRO:'#a78bfa',PREMIUM:'#f59e0b' };

const SUBJECTS = {
  primary: ['Mathematics','English','Shona','Ndebele','Science','Social Studies'],
  olevel:  ['Mathematics','English Language','Biology','Chemistry','Physics','Combined Science','History','Geography','Commerce','Accounting','Computer Science','Agriculture','Food & Nutrition'],
  alevel:  ['Mathematics','Further Mathematics','Physics','Chemistry','Biology','History','Geography','Economics','Business Studies','Accounting','Computer Science'],
};

const GRADES = {
  primary: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7'],
  olevel:  ['Form 1','Form 2','Form 3','Form 4'],
  alevel:  ['Lower 6','Upper 6'],
};

const TABS = [
  { id:'chat',      icon:MessageSquare, label:'Chat'    },
  { id:'image',     icon:Image,         label:'Images'  },
  { id:'notes',     icon:FileText,      label:'Notes'   },
  { id:'exam',      icon:ClipboardCheck,label:'Exam'    },
  { id:'materials', icon:BookOpen,      label:'Library' },
  { id:'profile',   icon:User,          label:'Profile' },
];

/* ─── API helper ─────────────────────────────────────────────────────────────── */
function token() { return localStorage.getItem('fundo_token') || ''; }
async function api(path, opts = {}) {
  const r = await fetch(path, {
    ...opts,
    headers: { Authorization:`Bearer ${token()}`, 'Content-Type':'application/json', ...(opts.headers||{}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Request failed');
  return d;
}

/* ─── Shared small components ────────────────────────────────────────────────── */
function ErrRow({ msg, p }) {
  if (!msg) return null;
  return (
    <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
      style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 13px', background:p.errBg, border:`1px solid ${p.errBorder}`, borderRadius:10, fontSize:13, color:p.errText, marginBottom:10 }}>
      <AlertCircle size={13} style={{ flexShrink:0 }}/> {msg}
    </motion.div>
  );
}

function UsageBar({ label, used, limit, icon: Icon, p }) {
  const pct = limit > 0 ? Math.min((used/limit)*100, 100) : 0;
  const near = pct >= 80;
  return (
    <div style={{ marginBottom:11 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          {Icon && <Icon size={11} style={{ color:p.dim }}/>}
          <span style={{ fontSize:11.5, color:p.dim, fontWeight:600 }}>{label}</span>
        </div>
        <span style={{ fontSize:11.5, fontWeight:700, color:near ? p.errText : p.muted }}>
          {used} / {limit >= 9999 ? '∞' : limit}
        </span>
      </div>
      <div style={{ height:5, borderRadius:99, background:p.border }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${pct}%`}} transition={{ duration:.8, ease:'easeOut' }}
          style={{ height:'100%', borderRadius:99, background: near ? 'linear-gradient(90deg,#ef4444,#f87171)' : 'linear-gradient(90deg,#7c3aed,#a78bfa)',
            boxShadow: pct > 0 ? (near ? '0 0 6px rgba(239,68,68,0.5)' : '0 0 6px rgba(124,58,237,0.5)') : 'none' }}/>
      </div>
    </div>
  );
}

function FGroup({ label, p, children }) {
  return (
    <div>
      <div style={{ fontSize:11, fontWeight:700, color:p.dim, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:6 }}>{label}</div>
      {children}
    </div>
  );
}

function GSelect({ value, onChange, options, p, isMobile }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width:'100%', padding:'10px 28px 10px 13px', borderRadius:10, border:`1px solid ${p.borderStrong}`, background:p.inputBg, color:p.text, fontSize:isMobile?16:14, outline:'none', fontFamily:'inherit', appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a78bfa' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 11px center', cursor:'pointer', transition:'border .15s' }}>
      {options.map(([v,l]) => <option key={v} value={v} style={{ background:'#150b35', color:'#f0e9ff' }}>{l}</option>)}
    </select>
  );
}

function GInput({ value, onChange, placeholder, type='text', required, minLength, p, isMobile, style: sx }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type} required={required} minLength={minLength}
      style={{ width:'100%', padding:'10px 13px', borderRadius:10, border:`1px solid ${p.borderStrong}`, background:p.inputBg, color:p.text, fontSize:isMobile?16:14, outline:'none', fontFamily:'inherit', transition:'border .15s, box-shadow .15s', boxSizing:'border-box', ...sx }}/>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   AI CHAT TAB  (with image analysis)
══════════════════════════════════════════════════════════════════════════════ */
function ChatTab({ profile, isMobile, p }) {
  const [sessions, setSessions] = useState([{ id:1, title:'New Chat', messages:[] }]);
  const [active, setActive]     = useState(1);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [showSessions, setShowSessions] = useState(false);
  /* vision */
  const [visionOpen, setVisionOpen] = useState(false);
  const [imgUrl, setImgUrl]     = useState('');
  const [imgPreviewOk, setImgPreviewOk] = useState(false);
  const bottomRef = useRef();
  const session = sessions.find(s => s.id === active) || sessions[0];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [session?.messages, loading]);

  function newChat() {
    const id = Date.now();
    setSessions(s => [...s, { id, title:'New Chat', messages:[] }]);
    setActive(id); setError(''); setShowSessions(false);
  }

  function pushMessage(msg) {
    setSessions(s => s.map(sess => sess.id === active
      ? { ...sess, messages: [...sess.messages, msg], title: sess.messages.length === 0 ? (msg.content||'').slice(0,38) : sess.title }
      : sess));
  }

  async function send() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput(''); setError('');

    if (visionOpen && imgUrl) {
      // Vision mode
      setVisionOpen(false);
      pushMessage({ role:'user', content:msg, imageUrl:imgUrl });
      setLoading(true);
      try {
        const d = await api('/api/student/analyze-image', { method:'POST', body:{ imageUrl:imgUrl, question:msg } });
        setSessions(s => s.map(sess => sess.id === active
          ? { ...sess, messages:[...sess.messages, { role:'user', content:msg, imageUrl:imgUrl }, { role:'assistant', content:d.reply }] }
          : sess));
      } catch(e) { setError(e.message); }
      finally { setLoading(false); setImgUrl(''); setImgPreviewOk(false); }
      return;
    }

    pushMessage({ role:'user', content:msg });
    setLoading(true);
    try {
      const history = session.messages.slice(-10);
      const d = await api('/api/student/chat', { method:'POST', body:{ message:msg, history } });
      setSessions(s => s.map(sess => sess.id === active
        ? { ...sess, messages:[...sess.messages, { role:'user', content:msg }, { role:'assistant', content:d.reply }] }
        : sess));
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  const STARTERS = ['Explain surds for O-Level Maths','Photosynthesis step by step','How to write a strong essay intro','Atomic structure A-Level Chemistry','Key causes of World War 1','Solving quadratics by formula'];

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>
      {/* Desktop session list */}
      {!isMobile && (
        <div style={{ width:210, borderRight:`1px solid ${p.border}`, display:'flex', flexDirection:'column', padding:'10px 8px', gap:4, flexShrink:0, background:p.sidebarBg }}>
          <button onClick={newChat} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 11px', borderRadius:9, border:`1px dashed ${p.accentBorder}`, background:'transparent', cursor:'pointer', fontSize:12.5, fontWeight:700, color:p.accent, marginBottom:8, width:'100%', fontFamily:'inherit' }}>
            <Plus size={13}/> New Chat
          </button>
          <div style={{ overflowY:'auto', flex:1 }}>
            {sessions.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)} style={{ width:'100%', textAlign:'left', padding:'8px 10px', borderRadius:9, border:'none', cursor:'pointer', marginBottom:2, fontSize:12, fontWeight:active===s.id?700:500, fontFamily:'inherit', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', transition:'all .15s',
                background:active===s.id ? p.accentBg : 'transparent', color:active===s.id ? p.accent : p.dim }}>
                <MessageSquare size={11} style={{ marginRight:6 }}/>{s.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        {/* Mobile session bar */}
        {isMobile && (
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderBottom:`1px solid ${p.border}`, flexShrink:0 }}>
            <button onClick={() => setShowSessions(s => !s)} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:8, border:`1px solid ${p.borderStrong}`, background:p.surface, color:p.muted, fontSize:12.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
              <MessageSquare size={12}/> {session.title.slice(0,22)||'Chat'} <ChevronRight size={11}/>
            </button>
            <button onClick={newChat} style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:8, border:`1px dashed ${p.accentBorder}`, background:'transparent', color:p.accent, fontSize:12.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              <Plus size={12}/> New
            </button>
          </div>
        )}
        <AnimatePresence>
          {isMobile && showSessions && (
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
              style={{ borderBottom:`1px solid ${p.border}`, overflow:'hidden', background:p.visionPanelBg, flexShrink:0 }}>
              <div style={{ padding:'8px', maxHeight:180, overflowY:'auto' }}>
                {sessions.map(s => (
                  <button key={s.id} onClick={() => { setActive(s.id); setShowSessions(false); }}
                    style={{ width:'100%', textAlign:'left', padding:'9px 12px', borderRadius:9, border:'none', cursor:'pointer', fontSize:13, fontWeight:active===s.id?700:500, fontFamily:'inherit', display:'block', marginBottom:3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                      background:active===s.id ? p.accentBg : p.surface, color:active===s.id ? p.accent : p.muted }}>
                    {s.title}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:isMobile?'16px 14px':'22px 26px' }}>
          {session.messages.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'70%', textAlign:'center', padding:'20px 8px' }}>
              <motion.div initial={{ scale:.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring', stiffness:200 }}
                style={{ width:66, height:66, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, boxShadow:'0 0 36px rgba(124,58,237,0.5)', overflow:'hidden' }}>
                <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{ e.target.style.display='none'; }}/>
              </motion.div>
              <h3 style={{ fontSize:isMobile?18:21, fontWeight:900, color:p.text, marginBottom:7 }}>Hi {profile?.name?.split(' ')[0]||'there'}!</h3>
              <p style={{ fontSize:13.5, color:p.muted, lineHeight:1.7, maxWidth:340, marginBottom:6 }}>Ask me anything — maths, sciences, history, essays — tuned for ZIMSEC and Cambridge.</p>
              <p style={{ fontSize:12.5, color:p.dim, marginBottom:20, display:'flex', alignItems:'center', gap:6 }}>
                <Camera size={12} style={{ color:p.accent }}/> Tap the camera to analyse an image
              </p>
              <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:8, width:'100%', maxWidth:isMobile?320:500 }}>
                {STARTERS.map(s => (
                  <motion.button key={s} onClick={() => setInput(s)} whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}
                    style={{ padding:'10px 13px', borderRadius:11, background:p.starterBg, border:`1px solid ${p.starterBorder}`, cursor:'pointer', fontSize:12.5, color:p.starterText, textAlign:'left', lineHeight:1.5, fontFamily:'inherit', transition:'all .15s' }}>
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {session.messages.map((m,i) => <ChatBubble key={i} msg={m} isMobile={isMobile} p={p}/>)}
              {loading && <TypingBubble p={p}/>}
              {error && <ErrRow msg={error} p={p}/>}
              <div ref={bottomRef}/>
            </>
          )}
        </div>

        {/* Vision panel (image URL input) */}
        <AnimatePresence>
          {visionOpen && (
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
              style={{ borderTop:`1px solid ${p.border}`, background:p.visionPanelBg, flexShrink:0, overflow:'hidden' }}>
              <div style={{ padding:'12px 14px', display:'flex', flexDirection:'column', gap:9 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Camera size={14} style={{ color:p.accent }}/>
                  <span style={{ fontSize:13, fontWeight:700, color:p.text }}>Image Analysis</span>
                  <span style={{ fontSize:12, color:p.muted, flex:1 }}>Paste an image URL to analyse</span>
                  <button onClick={() => setVisionOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:p.dim, display:'flex' }}><X size={14}/></button>
                </div>
                <div style={{ display:'flex', gap:9, alignItems:'center' }}>
                  <input value={imgUrl} onChange={e => { setImgUrl(e.target.value); setImgPreviewOk(false); }} placeholder="https://example.com/image.jpg"
                    style={{ flex:1, padding:'9px 12px', borderRadius:10, border:`1px solid ${imgUrl ? p.accentBorder : p.borderStrong}`, background:p.inputBg, color:p.text, fontSize:isMobile?16:13.5, outline:'none', fontFamily:'inherit' }}/>
                  {imgUrl && (
                    <div style={{ width:42, height:42, borderRadius:8, overflow:'hidden', border:`1px solid ${p.border}`, flexShrink:0, background:p.surface }}>
                      <img src={imgUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:imgPreviewOk?'block':'none' }}
                        onLoad={() => setImgPreviewOk(true)} onError={() => setImgPreviewOk(false)}/>
                      {!imgPreviewOk && <Eye size={14} style={{ color:p.dim, margin:'12px auto', display:'block' }}/>}
                    </div>
                  )}
                </div>
                <p style={{ fontSize:11.5, color:p.dim, margin:0 }}>Then type your question in the text box below and tap send.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input bar */}
        <div style={{ padding:isMobile?'10px 12px':'12px 18px', borderTop:`1px solid ${p.border}`, flexShrink:0 }}>
          <div style={{ display:'flex', gap:8, alignItems:'flex-end', background:p.inputBg, borderRadius:14, padding:'9px 12px', border:`1px solid ${p.borderStrong}` }}>
            {/* Vision toggle */}
            <motion.button onClick={() => setVisionOpen(v => !v)} whileTap={{ scale:.9 }} title="Analyse an image"
              style={{ width:34, height:34, borderRadius:9, border:`1px solid ${visionOpen ? p.accentBorder : p.border}`, background:visionOpen ? p.accentBg : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, transition:'all .15s' }}>
              <Camera size={14} style={{ color:visionOpen ? p.accent : p.dim }}/>
            </motion.button>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={visionOpen && imgUrl ? 'What would you like to know about this image?' : 'Ask anything…'} rows={1}
              style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:isMobile?16:14, color:p.text, resize:'none', maxHeight:100, fontFamily:'inherit', lineHeight:1.6 }}
              onInput={e => { e.target.style.height='auto'; e.target.style.height=Math.min(e.target.scrollHeight,100)+'px'; }}/>
            <motion.button onClick={send} disabled={!input.trim()||loading} whileTap={{ scale:.9 }}
              style={{ width:36, height:36, borderRadius:10, border:'none', cursor:input.trim()&&!loading?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .15s',
                background:input.trim()&&!loading?'linear-gradient(135deg,#7c3aed,#6d28d9)':'rgba(124,58,237,0.1)',
                boxShadow:input.trim()&&!loading?'0 0 12px rgba(124,58,237,0.4)':'none' }}>
              <Send size={14} style={{ color:input.trim()&&!loading?'#fff':p.dim }}/>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ msg, isMobile, p }) {
  const isUser = msg.role === 'user';
  const [copied, setCopied] = useState(false);
  function copy() { navigator.clipboard.writeText(msg.content).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000); }
  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:.2 }}
      style={{ display:'flex', justifyContent:isUser?'flex-end':'flex-start', marginBottom:16, gap:8, alignItems:'flex-start' }}>
      {!isUser && (
        <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#a78bfa)', flexShrink:0, marginTop:3, overflow:'hidden', boxShadow:'0 0 10px rgba(124,58,237,0.4)' }}>
          <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{ e.target.style.display='none'; }}/>
        </div>
      )}
      <div style={{ maxWidth:isMobile?'86%':'76%' }}>
        {msg.imageUrl && (
          <div style={{ marginBottom:6, borderRadius:10, overflow:'hidden', maxWidth:200, border:`1px solid ${p.border}` }}>
            <img src={msg.imageUrl} alt="analysed" style={{ width:'100%', display:'block', maxHeight:160, objectFit:'cover' }}/>
          </div>
        )}
        <div style={{ padding:isUser?'10px 14px':'12px 16px', borderRadius:isUser?'16px 16px 3px 16px':'3px 16px 16px 16px', fontSize:isMobile?14.5:14, lineHeight:1.75,
          background:isUser?p.chatUserBg:p.chatAiBg, border:isUser?'none':`1px solid ${p.chatAiBorder}`,
          color:isUser?p.chatUserText:p.chatAiText, boxShadow:isUser?'0 3px 14px rgba(124,58,237,0.28)':'none' }}>
          {isUser ? <p style={{ margin:0, whiteSpace:'pre-wrap' }}>{msg.content}</p>
            : <div className="md-body"><ReactMarkdown>{msg.content}</ReactMarkdown></div>}
        </div>
        {!isUser && (
          <button onClick={copy} style={{ marginTop:4, background:'none', border:'none', cursor:'pointer', fontSize:11, color:p.dim, display:'flex', alignItems:'center', gap:4, padding:'2px 5px' }}>
            {copied ? <><Check size={10} style={{ color:'#4ade80' }}/>Copied</> : <><Copy size={10}/>Copy</>}
          </button>
        )}
      </div>
      {isUser && <div style={{ width:30, height:30, borderRadius:'50%', background:p.accentBg, border:`1px solid ${p.accentBorder}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:3, fontSize:12, fontWeight:700, color:p.accent }}>
        {(profile?.name||'U')[0]?.toUpperCase?.() || 'U'}
      </div>}
    </motion.div>
  );
}
// fix profile scope in ChatBubble (not in closure — use default fallback)
const profile = null;

function TypingBubble({ p }) {
  return (
    <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
      <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#a78bfa)', overflow:'hidden', boxShadow:'0 0 10px rgba(124,58,237,0.4)' }}>
        <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{ e.target.style.display='none'; }}/>
      </div>
      <div style={{ background:p.chatAiBg, border:`1px solid ${p.chatAiBorder}`, padding:'10px 16px', borderRadius:'3px 16px 16px 16px', display:'flex', gap:5 }}>
        {[0,1,2].map(i => (
          <motion.div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'#a78bfa' }}
            animate={{ y:[0,-6,0], opacity:[.5,1,.5] }} transition={{ repeat:Infinity, duration:.9, delay:i*.18 }}/>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   IMAGE CREATOR
══════════════════════════════════════════════════════════════════════════════ */
function ImageTab({ isMobile, p }) {
  const [prompt, setPrompt]   = useState('');
  const [style, setStyle]     = useState('ultra realistic');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');
  const [history, setHistory] = useState([]);

  const STYLES = ['Ultra Realistic','Digital Art','Anime','3D Render','Watercolor','Pencil Sketch'];
  const EXAMPLES = ['Water cycle diagram','Human heart anatomy','Atom model','Photosynthesis diagram','Student studying under tree','Map of Zimbabwe'];

  async function generate() {
    if (!prompt.trim() || loading) return;
    setError(''); setLoading(true); setResult(null);
    try {
      const d = await api(`/api/student/generate-image?prompt=${encodeURIComponent(prompt+', '+style)}`);
      setResult(d);
      setHistory(h => [{ prompt, imageUrl:d.imageUrl }, ...h.slice(0,7)]);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ padding:isMobile?'18px 14px':'26px 30px', maxWidth:820, margin:'0 auto', overflowY:'auto', height:'100%' }}>
      <h2 className="tab-heading" style={{ color:p.text }}><Image size={19} style={{ color:p.accent }}/> AI Image Creator</h2>
      <p className="tab-sub" style={{ color:p.muted }}>Generate diagrams, illustrations, and concept visuals for your studies.</p>
      <p style={{ fontSize:11.5, color:p.dim, marginBottom:14, marginTop:4 }}>Powered by NanoBanana Pro · Pollinations fallback</p>

      <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:14 }}>
        {STYLES.map(s => (
          <button key={s} onClick={() => setStyle(s.toLowerCase())}
            style={{ padding:'6px 13px', borderRadius:99, border:`1px solid ${style===s.toLowerCase()?p.accentBorder:p.border}`, background:style===s.toLowerCase()?p.accentBg:p.surface, color:style===s.toLowerCase()?p.accent:p.dim, fontSize:12.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all .15s' }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ display:'flex', gap:9, marginBottom:12 }}>
        <input value={prompt} onChange={e=>setPrompt(e.target.value)} onKeyDown={e=>e.key==='Enter'&&generate()}
          placeholder="Describe what you want to create…"
          style={{ flex:1, padding:'12px 14px', borderRadius:12, border:`1px solid ${p.borderStrong}`, background:p.inputBg, fontSize:isMobile?16:14, color:p.text, outline:'none', fontFamily:'inherit' }}/>
        <motion.button onClick={generate} disabled={!prompt.trim()||loading} whileTap={{ scale:.95 }}
          style={{ padding:'12px 18px', background:prompt.trim()&&!loading?'linear-gradient(135deg,#7c3aed,#6d28d9)':p.surface, color:prompt.trim()&&!loading?'#fff':p.dim, border:'none', borderRadius:12, fontSize:13.5, fontWeight:700, cursor:prompt.trim()&&!loading?'pointer':'not-allowed', display:'flex', alignItems:'center', gap:7, flexShrink:0, fontFamily:'inherit', transition:'all .15s',
            boxShadow:prompt.trim()&&!loading?'0 4px 14px rgba(124,58,237,0.4)':'none' }}>
          {loading ? <Loader size={14} style={{ animation:'spin .7s linear infinite' }}/> : <Sparkles size={14}/>}
          {isMobile?'':(loading?'Creating…':'Generate')}
        </motion.button>
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
        {EXAMPLES.map(ex => (
          <button key={ex} onClick={() => setPrompt(ex)} style={{ padding:'5px 11px', borderRadius:99, border:`1px solid ${p.border}`, background:p.surface, color:p.dim, fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
            {ex}
          </button>
        ))}
      </div>

      {error && <ErrRow msg={error} p={p}/>}
      {loading && (
        <div style={{ textAlign:'center', padding:'50px 20px' }}>
          <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.8, ease:'linear' }}
            style={{ width:52, height:52, borderRadius:'50%', border:`3px solid ${p.border}`, borderTopColor:p.accent, margin:'0 auto 14px' }}/>
          <p style={{ fontSize:14, color:p.muted }}>Generating with NanoBanana Pro…</p>
        </div>
      )}
      {result && !loading && (
        <motion.div initial={{ opacity:0, scale:.97 }} animate={{ opacity:1, scale:1 }} style={{ borderRadius:14, overflow:'hidden', background:p.surface, border:`1px solid ${p.border}`, marginBottom:22 }}>
          <img src={result.imageUrl} alt={prompt} style={{ width:'100%', maxHeight:isMobile?300:480, objectFit:'contain', background:'#000', display:'block' }}/>
          <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <span style={{ fontSize:12.5, color:p.muted, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{prompt}</span>
            <a href={result.imageUrl} download target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:p.accentBg, border:`1px solid ${p.accentBorder}`, color:p.accent, borderRadius:9, fontSize:13, fontWeight:700, textDecoration:'none', flexShrink:0 }}>
              <Download size={12}/> Save
            </a>
          </div>
        </motion.div>
      )}
      {history.length > 0 && (
        <div>
          <p style={{ fontSize:11.5, color:p.dim, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:10 }}>Recent</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:8 }}>
            {history.map((h,i) => (
              <motion.div key={i} whileHover={{ scale:1.03 }} onClick={() => { setResult(h); setPrompt(h.prompt); }}
                style={{ borderRadius:10, overflow:'hidden', background:p.surface, border:`1px solid ${p.border}`, cursor:'pointer' }}>
                <img src={h.imageUrl} alt="" style={{ width:'100%', height:90, objectFit:'cover' }}/>
                <div style={{ padding:'5px 7px', fontSize:11, color:p.dim, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{h.prompt}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   STUDY NOTES
══════════════════════════════════════════════════════════════════════════════ */
function NotesTab({ profile, isMobile, p }) {
  const [form, setForm] = useState({ topic:'', subject:'', level:profile?.levelType||'olevel', grade:profile?.grade||'' });
  const [loading, setLoading] = useState(false);
  const [notes, setNotes]     = useState('');
  const [error, setError]     = useState('');
  const [copied, setCopied]   = useState(false);
  const [showForm, setShowForm] = useState(true);
  function setF(k,v) { setForm(f=>({...f,[k]:v})); }

  async function generate(e) {
    e.preventDefault();
    if (!form.topic.trim()||loading) return;
    setError(''); setLoading(true); setNotes('');
    if (isMobile) setShowForm(false);
    try { const d = await api('/api/student/generate-notes', { method:'POST', body:form }); setNotes(d.notes); }
    catch(e) { setError(e.message); if (isMobile) setShowForm(true); }
    finally { setLoading(false); }
  }

  function copy() { navigator.clipboard.writeText(notes).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2200); }
  const subjects = SUBJECTS[form.level]||SUBJECTS.olevel;

  return (
    <div style={{ padding:isMobile?'16px 14px':'24px 28px', height:'100%', overflowY:'auto' }}>
      <h2 className="tab-heading" style={{ color:p.text }}><FileText size={19} style={{ color:p.accent }}/> AI Study Notes</h2>
      <p className="tab-sub" style={{ color:p.muted }}>Comprehensive, curriculum-aligned notes — instantly generated.</p>

      {isMobile && notes && (
        <div style={{ display:'flex', gap:8, marginTop:12, marginBottom:14 }}>
          {[['form','Setup'],['notes','Notes']].map(([v,l]) => (
            <button key={v} onClick={() => setShowForm(v==='form')}
              style={{ flex:1, padding:'9px', borderRadius:10, border:`1px solid ${(showForm?v==='form':v==='notes')?p.accentBorder:p.border}`, background:(showForm?v==='form':v==='notes')?p.accentBg:'transparent', color:(showForm?v==='form':v==='notes')?p.accent:p.muted, cursor:'pointer', fontSize:13.5, fontWeight:700, fontFamily:'inherit' }}>
              {l}
            </button>
          ))}
        </div>
      )}

      <div style={{ display:isMobile?'block':'grid', gridTemplateColumns:notes?'280px 1fr':'1fr', gap:18, marginTop:isMobile?0:16 }}>
        {(!isMobile||showForm) && (
          <form onSubmit={generate} style={{ background:p.surface, border:`1px solid ${p.border}`, borderRadius:16, padding:'18px', display:'flex', flexDirection:'column', gap:13 }}>
            <FGroup label="Topic *" p={p}><GInput value={form.topic} onChange={v=>setF('topic',v)} placeholder="e.g. Photosynthesis, Quadratic Equations…" required p={p} isMobile={isMobile}/></FGroup>
            <FGroup label="Level" p={p}><GSelect value={form.level} onChange={v=>setF('level',v)} options={[['primary','Primary'],['olevel','O-Level'],['alevel','A-Level']]} p={p} isMobile={isMobile}/></FGroup>
            <FGroup label="Subject" p={p}><GSelect value={form.subject} onChange={v=>setF('subject',v)} options={[['','— Subject —'],...subjects.map(s=>[s,s])]} p={p} isMobile={isMobile}/></FGroup>
            <FGroup label="Grade / Form" p={p}><GInput value={form.grade} onChange={v=>setF('grade',v)} placeholder="e.g. Form 4" p={p} isMobile={isMobile}/></FGroup>
            {error && <ErrRow msg={error} p={p}/>}
            <motion.button type="submit" disabled={!form.topic.trim()||loading} whileTap={{ scale:.97 }}
              style={{ padding:'12px', background:form.topic.trim()&&!loading?'linear-gradient(135deg,#7c3aed,#6d28d9)':p.surface, color:form.topic.trim()&&!loading?'#fff':p.muted, border:'none', borderRadius:11, fontSize:14.5, fontWeight:700, cursor:form.topic.trim()&&!loading?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'inherit',
                boxShadow:form.topic.trim()&&!loading?'0 4px 16px rgba(124,58,237,0.4)':'none' }}>
              {loading?<><Loader size={14} style={{ animation:'spin .7s linear infinite' }}/> Generating…</>:<><Sparkles size={14}/> Generate Notes</>}
            </motion.button>
          </form>
        )}
        {(!isMobile||!showForm) && (loading||notes) && (
          <div style={{ background:p.surface, border:`1px solid ${p.border}`, borderRadius:16, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:`1px solid ${p.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:13.5, fontWeight:700, color:p.text }}>{form.topic||'Study Notes'}</span>
              {notes && (
                <button onClick={copy} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 11px', background:p.surface, border:`1px solid ${p.border}`, borderRadius:8, cursor:'pointer', fontSize:12, fontWeight:600, color:p.muted, fontFamily:'inherit' }}>
                  {copied?<><Check size={11} style={{ color:'#4ade80' }}/>Copied</>:<><Copy size={11}/>Copy</>}
                </button>
              )}
            </div>
            <div style={{ padding:'18px 20px', maxHeight:isMobile?420:520, overflowY:'auto' }}>
              {loading?(
                <div style={{ textAlign:'center', padding:'36px 0' }}>
                  <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.4, ease:'linear' }}
                    style={{ width:38, height:38, borderRadius:'50%', border:`3px solid ${p.border}`, borderTopColor:p.accent, margin:'0 auto 12px' }}/>
                  <p style={{ fontSize:13.5, color:p.muted }}>Generating notes…</p>
                </div>
              ):<div className="md-body" style={{ fontSize:isMobile?14:13.5, lineHeight:1.8, color:p.text }}><ReactMarkdown>{notes}</ReactMarkdown></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MOCK EXAM
══════════════════════════════════════════════════════════════════════════════ */
function ExamTab({ profile, isMobile, p }) {
  const [phase, setPhase] = useState('setup');
  const [form, setForm]   = useState({ subject:'', level:profile?.levelType||'olevel', grade:profile?.grade||'', topic:'', count:10, difficulty:'medium' });
  const [questions, setQs] = useState([]);
  const [answers, setAns]  = useState({});
  const [current, setCur]  = useState(0);
  const [error, setError]  = useState('');
  const [showExpl, setExpl] = useState({});
  function setF(k,v) { setForm(f=>({...f,[k]:v})); }

  async function startExam(e) {
    e.preventDefault();
    if (!form.subject) return setError('Please select a subject.');
    setError(''); setPhase('loading');
    try {
      const d = await api('/api/student/generate-mock-exam', { method:'POST', body:form });
      setQs(d.questions||[]); setAns({}); setCur(0); setExpl({});
      setPhase('quiz');
    } catch(e) { setError(e.message); setPhase('setup'); }
  }

  function answer(id, letter) { if (answers[id]) return; setAns(a=>({...a,[id]:letter})); }
  const answered = Object.keys(answers).length;
  const correct  = questions.filter(q => answers[q.id] === q.answer).length;
  const pct      = questions.length > 0 ? Math.round((correct/questions.length)*100) : 0;
  const subjects = SUBJECTS[form.level]||SUBJECTS.olevel;

  if (phase==='loading') return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', flexDirection:'column', gap:18, padding:20 }}>
      <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.6, ease:'linear' }}
        style={{ width:60, height:60, borderRadius:'50%', border:`3px solid ${p.border}`, borderTopColor:p.accent }}/>
      <p style={{ fontSize:15, color:p.muted, fontWeight:600, textAlign:'center' }}>Generating your mock exam…</p>
      <p style={{ fontSize:13, color:p.dim, textAlign:'center' }}>Creating {form.count} questions for {form.subject}</p>
    </div>
  );

  if (phase==='result') {
    const grade = pct>=80?'A':pct>=60?'B':pct>=50?'C':pct>=40?'D':'F';
    const gc = { A:'#4ade80',B:'#60a5fa',C:'#fbbf24',D:'#fb923c',F:'#f87171' }[grade];
    return (
      <div style={{ padding:isMobile?'16px 14px':'28px 30px', maxWidth:680, margin:'0 auto', overflowY:'auto', height:'100%' }}>
        <motion.div initial={{ scale:.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
          style={{ background:p.surface, border:`1px solid ${p.border}`, borderRadius:18, padding:isMobile?'24px 18px':'32px', textAlign:'center', marginBottom:20 }}>
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200, delay:.2 }}
            style={{ width:88, height:88, borderRadius:'50%', border:`3px solid ${gc}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', background:`${gc}14`, boxShadow:`0 0 28px ${gc}3a` }}>
            <span style={{ fontSize:42, fontWeight:900, color:gc }}>{grade}</span>
          </motion.div>
          <h2 style={{ fontSize:isMobile?24:28, fontWeight:900, color:p.text, marginBottom:6 }}>{correct} / {questions.length}</h2>
          <p style={{ fontSize:16, color:p.muted, marginBottom:3 }}>{pct}% — {pct>=70?'Excellent!':pct>=50?'Good effort!':'Needs more revision.'}</p>
          <p style={{ fontSize:12.5, color:p.dim }}>{form.subject} · {form.level.toUpperCase()}</p>
          <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:20, flexWrap:'wrap' }}>
            <motion.button onClick={() => { setPhase('setup'); setQs([]); setAns({}); }} whileTap={{ scale:.97 }}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 18px', background:p.surface, border:`1px solid ${p.border}`, color:p.muted, borderRadius:10, cursor:'pointer', fontWeight:600, fontSize:13.5, fontFamily:'inherit' }}>
              <RotateCcw size={13}/> New Exam
            </motion.button>
            <motion.button onClick={() => setPhase('quiz')} whileTap={{ scale:.97 }}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 18px', background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontWeight:700, fontSize:13.5, boxShadow:'0 4px 14px rgba(124,58,237,0.38)', fontFamily:'inherit' }}>
              <BookOpen size={13}/> Review Answers
            </motion.button>
          </div>
        </motion.div>
        {questions.map((q,i) => {
          const ua = answers[q.id]; const ok = ua===q.answer;
          return (
            <motion.div key={q.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.03 }}
              style={{ background:ok?'rgba(74,222,128,0.05)':'rgba(248,113,113,0.05)', border:`1px solid ${ok?'rgba(74,222,128,0.22)':'rgba(248,113,113,0.18)'}`, borderRadius:13, padding:'14px 16px', marginBottom:8 }}>
              <div style={{ display:'flex', gap:8, marginBottom:6 }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:ok?'rgba(74,222,128,0.16)':'rgba(248,113,113,0.13)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:ok?'#4ade80':'#f87171', flexShrink:0 }}>{ok?'✓':'✗'}</div>
                <p style={{ fontSize:13, color:p.text, fontWeight:600, lineHeight:1.5, margin:0 }}>{i+1}. {q.q}</p>
              </div>
              <div style={{ paddingLeft:30, fontSize:12.5, color:p.muted, lineHeight:1.6 }}>
                {!ok && <p style={{ margin:'0 0 2px' }}>Your answer: <span style={{ color:'#f87171', fontWeight:700 }}>{ua||'Not answered'}</span></p>}
                <p style={{ margin:'0 0 4px' }}>Correct: <span style={{ color:'#4ade80', fontWeight:700 }}>{q.answer}</span></p>
                <button onClick={() => setExpl(s=>({...s,[q.id]:!s[q.id]}))} style={{ background:'none', border:'none', color:p.accent, cursor:'pointer', fontSize:12, fontWeight:600, padding:0 }}>
                  {showExpl[q.id]?'▲ Hide':'▼ Explanation'}
                </button>
                {showExpl[q.id] && <p style={{ marginTop:5, color:p.muted, fontStyle:'italic' }}>{q.explanation}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  if (phase==='quiz') {
    const q = questions[current]; const ua = answers[q?.id];
    const optSty = opt => {
      const l = opt.charAt(0);
      if (!ua) return { bg:p.surface, br:p.borderStrong, col:p.muted };
      if (l===q.answer) return { bg:'rgba(74,222,128,0.12)', br:'rgba(74,222,128,0.35)', col:'#4ade80' };
      if (l===ua && l!==q.answer) return { bg:'rgba(248,113,113,0.09)', br:'rgba(248,113,113,0.3)', col:'#f87171' };
      return { bg:p.surface, br:p.border, col:p.dim };
    };
    return (
      <div style={{ padding:isMobile?'16px 14px':'24px 28px', maxWidth:680, margin:'0 auto', overflowY:'auto', height:'100%' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontSize:12.5, color:p.dim, fontWeight:600 }}>Question {current+1} / {questions.length}</span>
          <span style={{ fontSize:12.5, color:p.dim }}>{answered} answered</span>
        </div>
        <div style={{ height:5, borderRadius:99, background:p.border, marginBottom:20 }}>
          <motion.div style={{ height:'100%', borderRadius:99, background:'linear-gradient(90deg,#7c3aed,#a78bfa)', boxShadow:'0 0 8px rgba(124,58,237,0.5)' }}
            animate={{ width:`${((current+1)/questions.length)*100}%` }} transition={{ duration:.3 }}/>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity:0, x:22 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-22 }} transition={{ duration:.18 }}
            style={{ background:p.surface, border:`1px solid ${p.border}`, borderRadius:16, padding:isMobile?'18px 16px':'24px', marginBottom:18 }}>
            <p style={{ fontSize:isMobile?15.5:16, fontWeight:700, color:p.text, lineHeight:1.6, marginBottom:20 }}>{q.q}</p>
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {q.options.map(opt => {
                const c = optSty(opt);
                return (
                  <motion.button key={opt} onClick={() => answer(q.id, opt.charAt(0))} whileHover={!ua?{ scale:1.01 }:{}} whileTap={!ua?{ scale:.99 }:{}}
                    style={{ padding:isMobile?'13px 14px':'12px 15px', borderRadius:11, border:`1.5px solid ${c.br}`, background:c.bg, color:c.col, cursor:ua?'default':'pointer', fontSize:isMobile?14.5:14, fontWeight:500, textAlign:'left', fontFamily:'inherit', lineHeight:1.4, transition:'all .18s' }}>
                    {opt}
                  </motion.button>
                );
              })}
            </div>
            {ua && (
              <motion.div initial={{ opacity:0, y:7 }} animate={{ opacity:1, y:0 }} style={{ marginTop:14, padding:'11px 13px', background:p.surface, borderRadius:9, border:`1px solid ${p.border}` }}>
                <p style={{ fontSize:13, color:p.muted, fontStyle:'italic', margin:0 }}><span style={{ color:p.accent, fontWeight:700 }}>Explanation:</span> {q.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        <div style={{ display:'flex', justifyContent:'space-between', gap:10 }}>
          <button onClick={() => setCur(c=>Math.max(0,c-1))} disabled={current===0}
            style={{ padding:'10px 18px', background:p.surface, border:`1px solid ${p.border}`, color:current===0?p.dim:p.muted, borderRadius:10, cursor:current===0?'not-allowed':'pointer', fontWeight:600, fontSize:13.5, fontFamily:'inherit' }}>← Prev</button>
          {current<questions.length-1?(
            <motion.button onClick={() => setCur(c=>c+1)} disabled={!ua} whileTap={{ scale:.97 }}
              style={{ padding:'10px 20px', background:ua?'linear-gradient(135deg,#7c3aed,#6d28d9)':p.surface, color:ua?'#fff':p.dim, border:'none', borderRadius:10, cursor:ua?'pointer':'not-allowed', fontWeight:700, fontSize:13.5, boxShadow:ua?'0 3px 14px rgba(124,58,237,0.35)':'none', fontFamily:'inherit' }}>Next →</motion.button>
          ):(
            <motion.button onClick={() => setPhase('result')} whileTap={{ scale:.97 }}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 20px', background:'linear-gradient(135deg,#059669,#047857)', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontWeight:700, fontSize:13.5, boxShadow:'0 3px 14px rgba(5,150,105,0.3)', fontFamily:'inherit' }}>
              <Trophy size={14}/> Finish
            </motion.button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:isMobile?'16px 14px':'24px 28px', maxWidth:580, margin:'0 auto', overflowY:'auto', height:'100%' }}>
      <h2 className="tab-heading" style={{ color:p.text }}><ClipboardCheck size={19} style={{ color:p.accent }}/> Mock Exam Generator</h2>
      <p className="tab-sub" style={{ color:p.muted }}>AI-generated MCQ exams in ZIMSEC/Cambridge style — instant feedback & explanations.</p>
      <form onSubmit={startExam} style={{ background:p.surface, border:`1px solid ${p.border}`, borderRadius:16, padding:isMobile?'18px 16px':'24px', display:'flex', flexDirection:'column', gap:16, marginTop:16 }}>
        <FGroup label="Level" p={p}><GSelect value={form.level} onChange={v=>setF('level',v)} options={[['primary','Primary School'],['olevel','O-Level'],['alevel','A-Level']]} p={p} isMobile={isMobile}/></FGroup>
        <FGroup label="Subject *" p={p}><GSelect value={form.subject} onChange={v=>setF('subject',v)} options={[['','— Select subject —'],...subjects.map(s=>[s,s])]} p={p} isMobile={isMobile}/></FGroup>
        <FGroup label="Grade / Form" p={p}><GInput value={form.grade} onChange={v=>setF('grade',v)} placeholder="e.g. Form 4" p={p} isMobile={isMobile}/></FGroup>
        <FGroup label="Topic (optional)" p={p}><GInput value={form.topic} onChange={v=>setF('topic',v)} placeholder="e.g. Photosynthesis, World War 1…" p={p} isMobile={isMobile}/></FGroup>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <FGroup label="Questions" p={p}><GSelect value={form.count} onChange={v=>setF('count',Number(v))} options={[[5,'5 Qs'],[10,'10 Qs'],[15,'15 Qs'],[20,'20 Qs']]} p={p} isMobile={isMobile}/></FGroup>
          <FGroup label="Difficulty" p={p}><GSelect value={form.difficulty} onChange={v=>setF('difficulty',v)} options={[['easy','Easy'],['medium','Medium'],['hard','Hard'],['mixed','Mixed']]} p={p} isMobile={isMobile}/></FGroup>
        </div>
        {error && <ErrRow msg={error} p={p}/>}
        <motion.button type="submit" whileTap={{ scale:.97 }}
          style={{ padding:'14px', background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff', border:'none', borderRadius:12, fontSize:15, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:9, boxShadow:'0 5px 22px rgba(124,58,237,0.42)', fontFamily:'inherit' }}>
          <PlayCircle size={17}/> Start Mock Exam
        </motion.button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MATERIALS LIBRARY
══════════════════════════════════════════════════════════════════════════════ */
function MaterialsTab({ isMobile, p }) {
  const [items, setItems]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [canDL, setCanDL]     = useState(true);
  const [filters, setFilters] = useState({ level:'', category:'', search:'' });
  function setF(k,v) { setFilters(f=>({...f,[k]:v})); setPage(1); }

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const pr = new URLSearchParams({ page, limit:12 });
      if (filters.level) pr.set('level', filters.level);
      if (filters.category) pr.set('category', filters.category);
      if (filters.search) pr.set('search', filters.search);
      const d = await api(`/api/student/materials?${pr}`);
      setItems(d.items||[]); setTotal(d.total||0); setPages(d.pages||1);
      setCanDL(d.canDownload !== false);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => { load(); }, [load]);

  const CAT_COLOR = { paper:'#3b82f6', textbook:'#10b981', syllabus:'#a78bfa', marking_scheme:'#f59e0b' };
  const CAT_LABEL = { paper:'Past Paper', textbook:'Textbook', syllabus:'Syllabus', marking_scheme:'Mark Scheme' };
  const LVL_LABEL = { primary:'Primary', olevel:'O-Level', alevel:'A-Level' };

  return (
    <div style={{ padding:isMobile?'14px 12px':'18px 22px', height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ marginBottom:12, display:'flex', flexDirection:isMobile?'column':'row', gap:10, flexShrink:0 }}>
        <div style={{ display:'flex', gap:8, flex:1, flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:130 }}>
            <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:p.dim }}/>
            <input value={filters.search} onChange={e=>setF('search',e.target.value)} placeholder="Search…"
              style={{ width:'100%', padding:'9px 12px 9px 30px', borderRadius:10, border:`1px solid ${p.borderStrong}`, background:p.inputBg, color:p.text, fontSize:isMobile?16:14, outline:'none', fontFamily:'inherit' }}/>
          </div>
          <GSelect value={filters.level} onChange={v=>setF('level',v)} options={[['','All Levels'],['primary','Primary'],['olevel','O-Level'],['alevel','A-Level']]} p={p} isMobile={isMobile}/>
          <GSelect value={filters.category} onChange={v=>setF('category',v)} options={[['','All Types'],['paper','Past Papers'],['textbook','Textbooks'],['syllabus','Syllabuses'],['marking_scheme','Mark Schemes']]} p={p} isMobile={isMobile}/>
        </div>
      </div>
      <p style={{ fontSize:12, color:p.dim, marginBottom:10, flexShrink:0 }}>{total} resources · ZIMSEC & Cambridge</p>
      {error && <ErrRow msg={error} p={p}/>}
      <div style={{ flex:1, overflowY:'auto' }}>
        {loading?(
          <div style={{ display:'grid', gridTemplateColumns:`repeat(auto-fill,minmax(${isMobile?'155px':'200px'},1fr))`, gap:9 }}>
            {Array.from({ length:8 }).map((_,i)=>(
              <div key={i} style={{ background:p.surface, borderRadius:12, padding:14, animation:'pulse 1.5s infinite' }}>
                {[80,60,40].map((w,j)=><div key={j} style={{ height:j===0?13:10, borderRadius:6, background:p.border, width:`${w}%`, marginBottom:8 }}/>)}
              </div>
            ))}
          </div>
        ):items.length===0?(
          <div style={{ textAlign:'center', padding:'50px 20px' }}>
            <BookOpen size={40} style={{ color:p.dim, marginBottom:10 }}/>
            <p style={{ fontSize:15, fontWeight:700, color:p.muted, marginBottom:5 }}>No materials found</p>
            <p style={{ fontSize:13, color:p.dim }}>Try adjusting your filters.</p>
          </div>
        ):(
          <>
            <div style={{ display:'grid', gridTemplateColumns:`repeat(auto-fill,minmax(${isMobile?'155px':'200px'},1fr))`, gap:9, marginBottom:14 }}>
              {items.map(item=>(
                <motion.div key={item._id} initial={{ opacity:0, y:7 }} animate={{ opacity:1, y:0 }} whileHover={{ y:-2 }}
                  style={{ background:p.surface, border:`1px solid ${p.border}`, borderRadius:12, padding:'13px', transition:'all .16s' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:7 }}>
                    <span style={{ fontSize:10, fontWeight:700, padding:'3px 7px', borderRadius:99, background:`${CAT_COLOR[item.category]||'#7c3aed'}18`, color:CAT_COLOR[item.category]||'#7c3aed', border:`1px solid ${CAT_COLOR[item.category]||'#7c3aed'}22` }}>
                      {CAT_LABEL[item.category]||item.category}
                    </span>
                    {item.year && <span style={{ fontSize:10, color:p.dim }}>{item.year}</span>}
                  </div>
                  <h4 style={{ fontSize:12.5, fontWeight:700, color:p.text, marginBottom:6, lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{item.title}</h4>
                  <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:10 }}>
                    {[LVL_LABEL[item.level]||item.level, item.subject].filter(Boolean).map(tag=>(
                      <span key={tag} style={{ fontSize:10, color:p.dim, background:p.tagBg, padding:'2px 6px', borderRadius:99, border:`1px solid ${p.tagBorder}` }}>{tag}</span>
                    ))}
                  </div>
                  {canDL?(
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5, padding:'7px', background:p.accentBg, border:`1px solid ${p.accentBorder}`, color:p.accent, borderRadius:9, fontSize:12.5, fontWeight:700, textDecoration:'none' }}>
                      <Download size={11}/> Download
                    </a>
                  ):(
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5, padding:'7px', background:p.surface, color:p.dim, borderRadius:9, fontSize:12, border:`1px solid ${p.border}` }}>
                      <Crown size={11}/> Upgrade
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            {pages>1 && (
              <div style={{ display:'flex', justifyContent:'center', gap:10, paddingBottom:16 }}>
                <button onClick={()=>setPage(pp=>Math.max(1,pp-1))} disabled={page===1}
                  style={{ padding:'7px 14px', background:p.surface, border:`1px solid ${p.border}`, color:p.muted, borderRadius:9, cursor:page===1?'not-allowed':'pointer', fontSize:13, fontFamily:'inherit' }}>Prev</button>
                <span style={{ padding:'7px 10px', fontSize:13, color:p.dim }}>{page} / {pages}</span>
                <button onClick={()=>setPage(pp=>Math.min(pages,pp+1))} disabled={page===pages}
                  style={{ padding:'7px 14px', background:p.surface, border:`1px solid ${p.border}`, color:p.muted, borderRadius:9, cursor:page===pages?'not-allowed':'pointer', fontSize:13, fontFamily:'inherit' }}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PROFILE
══════════════════════════════════════════════════════════════════════════════ */
function ProfileTab({ profile, usage, limits, isMobile, p }) {
  const plan = profile?.plan||'FREE';
  const pc   = PLAN_COLOR[plan]||'#6b7280';
  const PLAN_ICONS = { FREE:Zap, STARTER:Flame, BASIC:Brain, PRO:Target, PREMIUM:Crown };
  const PIcon = PLAN_ICONS[plan]||Zap;

  return (
    <div style={{ padding:isMobile?'16px 14px':'24px 28px', maxWidth:640, margin:'0 auto', overflowY:'auto', height:'100%' }}>
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
        style={{ background:p.surface, border:`1px solid ${p.accentBorder}`, borderRadius:18, padding:isMobile?'20px 16px':'24px', marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
          <div style={{ width:58, height:58, borderRadius:'50%', background:`linear-gradient(135deg,${pc},${pc}80)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, color:'#fff', boxShadow:`0 0 20px ${pc}45`, flexShrink:0 }}>
            {(profile?.name||'S')[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize:isMobile?19:21, fontWeight:900, color:p.text, marginBottom:5 }}>{profile?.name||'Student'}</h2>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, fontWeight:700, color:pc, background:`${pc}1a`, border:`1px solid ${pc}30`, padding:'3px 9px', borderRadius:99 }}>
                <PIcon size={10}/> {plan}
              </span>
              {profile?.grade && <span style={{ fontSize:12, color:p.muted }}>{profile.levelLabel} · {profile.grade}</span>}
            </div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr 1fr':'repeat(3,1fr)', gap:10 }}>
          {[
            { icon:Smartphone, label:'Phone',  val:profile?.phone?`+${profile.phone}`:'—' },
            { icon:School,     label:'School', val:profile?.school||'—' },
            { icon:GraduationCap, label:'Level', val:profile?.levelLabel||'—' },
          ].map(({ icon:Ic, label, val }) => (
            <div key={label} style={{ background:p.inputBg, border:`1px solid ${p.border}`, borderRadius:11, padding:'11px 13px' }}>
              <Ic size={12} style={{ color:p.dim, marginBottom:4 }}/>
              <div style={{ fontSize:10.5, color:p.dim, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:3 }}>{label}</div>
              <div style={{ fontSize:12.5, fontWeight:700, color:p.text, wordBreak:'break-all' }}>{val}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {usage && limits && (
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.07 }}
          style={{ background:p.surface, border:`1px solid ${p.border}`, borderRadius:18, padding:isMobile?'18px 16px':'22px', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <h3 style={{ fontSize:14.5, fontWeight:800, color:p.text, marginBottom:2, display:'flex', alignItems:'center', gap:7 }}>
                <BarChart3 size={14} style={{ color:p.accent }}/> Today's Usage
              </h3>
              <p style={{ fontSize:11.5, color:p.dim }}>Combined WhatsApp + Web — resets at midnight</p>
            </div>
          </div>
          <UsageBar label="AI Chats Today"  used={usage.chatToday||0}   limit={limits.chat||25}  icon={MessageSquare} p={p}/>
          <UsageBar label="Images Today"    used={usage.imagesToday||0} limit={limits.images||3}  icon={Image} p={p}/>
          <UsageBar label="Notes & Exams"   used={usage.pdfToday||0}    limit={limits.pdf||1}     icon={FileText} p={p}/>
          <div style={{ marginTop:14, padding:'10px 12px', background:p.accentBg, borderRadius:10, border:`1px solid ${p.accentBorder}`, fontSize:12, color:p.muted, display:'flex', alignItems:'flex-start', gap:7 }}>
            <Smartphone size={12} style={{ color:p.accent, flexShrink:0, marginTop:1 }}/>
            WhatsApp and web usage are shared — chats sent on WhatsApp count toward your daily web limits too.
          </div>
        </motion.div>
      )}

      {plan!=='PREMIUM' && (
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.13 }}
          style={{ borderRadius:18, padding:isMobile?'18px 16px':'22px', background:`linear-gradient(135deg,${p.accentBg},rgba(109,40,217,0.08))`, border:`1px solid ${p.accentBorder}` }}>
          <h3 style={{ fontSize:16, fontWeight:900, color:p.text, marginBottom:5 }}>Upgrade your plan</h3>
          <p style={{ fontSize:13, color:p.muted, lineHeight:1.65, marginBottom:14 }}>More chats, images, and mock exams. Plans from $1/month.</p>
          <a href="https://wa.me/263719647303?text=upgrade" target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 20px', background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff', textDecoration:'none', borderRadius:11, fontWeight:700, fontSize:13.5, boxShadow:'0 4px 14px rgba(124,58,237,0.4)' }}>
            <Crown size={14}/> Upgrade on WhatsApp <ArrowUpRight size={12}/>
          </a>
        </motion.div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SIDEBAR CONTENTS
══════════════════════════════════════════════════════════════════════════════ */
function SidebarContents({ profile, usage, limits, tab, setTab, signOut, pc, plan, onRefresh, p, isDark, onToggleTheme }) {
  const PLAN_ICONS = { FREE:Zap, STARTER:Flame, BASIC:Brain, PRO:Target, PREMIUM:Crown };
  const PIcon = PLAN_ICONS[plan]||Zap;

  return (
    <>
      <div style={{ padding:'14px 14px 10px', borderBottom:`1px solid ${p.border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:11, background:'linear-gradient(135deg,#7c3aed,#a78bfa)', overflow:'hidden', boxShadow:'0 0 14px rgba(124,58,237,0.38)', flexShrink:0 }}>
            <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{ e.target.style.display='none'; }}/>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:16, fontWeight:900, color:p.text, lineHeight:1 }}>Fundo<span style={{ color:p.accent }}>AI</span></div>
            <div style={{ fontSize:10, color:p.dim, marginTop:1 }}>Student Portal</div>
          </div>
          <motion.button onClick={onToggleTheme} whileTap={{ scale:.88 }} title={isDark?'Switch to light mode':'Switch to dark mode'}
            style={{ width:30, height:30, borderRadius:8, background:p.inputBg, border:`1px solid ${p.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
            {isDark ? <Sun size={13} style={{ color:p.accent }}/> : <Moon size={13} style={{ color:p.accent }}/>}
          </motion.button>
        </div>
      </div>

      <div style={{ padding:'10px 12px', borderBottom:`1px solid ${p.border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:35, height:35, borderRadius:'50%', background:`linear-gradient(135deg,${pc},${pc}70)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#fff', flexShrink:0, boxShadow:`0 0 10px ${pc}40` }}>
            {(profile?.name||'S')[0].toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:p.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{profile?.name||'Student'}</div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:10.5, fontWeight:700, color:pc }}><PIcon size={9} style={{ display:'inline', marginRight:3 }}/>{plan}</span>
              {profile?.grade && <span style={{ fontSize:10, color:p.dim }}>· {profile.grade}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:'8px 7px', flex:1, overflowY:'auto' }}>
        {TABS.map(t => {
          const active = tab===t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, border:`1px solid ${active?p.accentBorder:'transparent'}`, cursor:'pointer', marginBottom:2, fontSize:13.5, fontWeight:active?700:500, textAlign:'left', fontFamily:'inherit', transition:'all .15s',
                background:active?p.accentBg:'transparent', color:active?p.accent:p.muted,
                boxShadow:active?'0 0 14px rgba(124,58,237,0.14)':'none' }}>
              <t.icon size={15} style={{ color:active?p.accent:p.dim, flexShrink:0 }}/>
              {t.label}
              {active && <div style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:p.accent, boxShadow:`0 0 6px ${p.accentMain}` }}/>}
            </button>
          );
        })}
      </div>

      {usage && limits && (
        <div style={{ margin:'0 8px 8px', padding:'13px', background:p.inputBg, border:`1px solid ${p.border}`, borderRadius:13 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:11 }}>
            <span style={{ fontSize:10.5, fontWeight:700, color:p.dim, textTransform:'uppercase', letterSpacing:'.5px' }}>Daily Usage</span>
            <button onClick={onRefresh} style={{ background:'none', border:'none', cursor:'pointer', color:p.dim, padding:0, display:'flex' }}><RefreshCw size={11}/></button>
          </div>
          <UsageBar label="Chats"  used={usage.chatToday||0}   limit={limits.chat||25}  icon={MessageSquare} p={p}/>
          <UsageBar label="Images" used={usage.imagesToday||0} limit={limits.images||3}  icon={Image} p={p}/>
          <UsageBar label="Notes"  used={usage.pdfToday||0}    limit={limits.pdf||1}     icon={FileText} p={p}/>
        </div>
      )}

      {plan==='FREE' && (
        <div style={{ margin:'0 8px 8px' }}>
          <a href="https://wa.me/263719647303?text=upgrade" target="_blank" rel="noopener noreferrer"
            style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 13px', background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff', borderRadius:11, textDecoration:'none', fontSize:13, fontWeight:700, boxShadow:'0 3px 14px rgba(124,58,237,0.32)' }}>
            <Crown size={13}/> Upgrade Plan <ArrowUpRight size={11} style={{ marginLeft:'auto' }}/>
          </a>
        </div>
      )}

      <div style={{ padding:'4px 8px 12px' }}>
        <button onClick={signOut}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:9, border:'none', cursor:'pointer', fontSize:13, color:p.dim, background:'transparent', fontFamily:'inherit', transition:'all .15s' }}
          onMouseEnter={e=>{ e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.color='#fca5a5'; }}
          onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color=p.dim; }}>
          <LogOut size={13}/> Sign Out
        </button>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════════════════ */
export default function StudentApp() {
  const nav      = useNavigate();
  const isMobile = useIsMobile();
  const { isDark, toggle, p } = useTheme();
  const [profile, setProfile] = useState(() => { try { return JSON.parse(localStorage.getItem('fundo_user')||'null'); } catch { return null; } });
  const [usage, setUsage]     = useState(null);
  const [limits, setLimits]   = useState(null);
  const [tab, setTab]         = useState('chat');
  const [sideOpen, setSideOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!token()) { nav('/student'); return; }
    api('/api/student/me').then(d => {
      setProfile(d); setUsage(d.usage); setLimits(d.limits);
      localStorage.setItem('fundo_user', JSON.stringify(d));
    }).catch(() => nav('/student'));
  }, [refreshKey]);

  function signOut() { localStorage.removeItem('fundo_token'); localStorage.removeItem('fundo_user'); nav('/student'); }
  function switchTab(t) { setTab(t); setSideOpen(false); }

  const plan = profile?.plan||'FREE';
  const pc   = PLAN_COLOR[plan]||'#6b7280';

  return (
    <div style={{ display:'flex', height:'100dvh', fontFamily:"'Inter',system-ui,sans-serif", background:p.bg, overflow:'hidden', position:'relative' }}>
      {/* Background orbs */}
      <div style={{ position:'absolute', width:500, height:500, top:-180, left:-140, borderRadius:'50%', background:p.orbA, filter:'blur(80px)', pointerEvents:'none', zIndex:0 }}/>
      <div style={{ position:'absolute', width:350, height:350, bottom:-80, right:-80, borderRadius:'50%', background:p.orbB, filter:'blur(80px)', pointerEvents:'none', zIndex:0 }}/>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobile && sideOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setSideOpen(false)}
              style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:40, backdropFilter:'blur(4px)' }}/>
            <motion.div initial={{ x:-280 }} animate={{ x:0 }} exit={{ x:-280 }} transition={{ type:'spring', stiffness:300, damping:30 }}
              style={{ position:'fixed', top:0, left:0, bottom:0, width:268, zIndex:50, display:'flex', flexDirection:'column', background:p.sidebarOverlay, backdropFilter:'blur(24px)', borderRight:`1px solid ${p.border}` }}>
              <SidebarContents profile={profile} usage={usage} limits={limits} tab={tab} setTab={switchTab} signOut={signOut} pc={pc} plan={plan} onRefresh={() => setRefreshKey(k=>k+1)} p={p} isDark={isDark} onToggleTheme={toggle}/>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      {!isMobile && (
        <div style={{ width:252, flexShrink:0, display:'flex', flexDirection:'column', background:p.sidebarBg, backdropFilter:'blur(20px)', borderRight:`1px solid ${p.border}`, position:'relative', zIndex:10 }}>
          <SidebarContents profile={profile} usage={usage} limits={limits} tab={tab} setTab={switchTab} signOut={signOut} pc={pc} plan={plan} onRefresh={() => setRefreshKey(k=>k+1)} p={p} isDark={isDark} onToggleTheme={toggle}/>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative', zIndex:10 }}>
        {/* Top bar */}
        <div style={{ height:isMobile?50:52, display:'flex', alignItems:'center', padding:isMobile?'0 12px':'0 18px', gap:10, borderBottom:`1px solid ${p.border}`, background:p.topbarBg, backdropFilter:'blur(16px)', flexShrink:0 }}>
          {isMobile && (
            <motion.button onClick={() => setSideOpen(s=>!s)} whileTap={{ scale:.9 }}
              style={{ width:34, height:34, borderRadius:9, background:p.inputBg, border:`1px solid ${p.borderStrong}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
              <Menu size={16} style={{ color:p.muted }}/>
            </motion.button>
          )}
          <span style={{ fontSize:isMobile?15:15.5, fontWeight:800, color:p.text }}>
            {TABS.find(t=>t.id===tab)?.label||''}
          </span>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
            {/* Theme toggle in top bar (mobile only) */}
            {isMobile && (
              <motion.button onClick={toggle} whileTap={{ scale:.88 }}
                style={{ width:30, height:30, borderRadius:8, background:p.inputBg, border:`1px solid ${p.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                {isDark ? <Sun size={13} style={{ color:p.accent }}/> : <Moon size={13} style={{ color:p.accent }}/>}
              </motion.button>
            )}
            {!isMobile && profile?.school && <span style={{ fontSize:12, color:p.dim, maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{profile.school}</span>}
            <div style={{ width:30, height:30, borderRadius:'50%', background:`linear-gradient(135deg,${pc},${pc}70)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', boxShadow:`0 0 10px ${pc}40`, flexShrink:0 }}>
              {(profile?.name||'S')[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div style={{ flex:1, overflow:'hidden', paddingBottom:isMobile?62:0 }}>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:.13 }}
              style={{ height:'100%', overflow:tab==='chat'||tab==='exam'?'hidden':'auto' }}>
              {tab==='chat'      && <ChatTab profile={profile} isMobile={isMobile} p={p}/>}
              {tab==='image'     && <ImageTab isMobile={isMobile} p={p}/>}
              {tab==='notes'     && <NotesTab profile={profile} isMobile={isMobile} p={p}/>}
              {tab==='exam'      && <ExamTab profile={profile} isMobile={isMobile} p={p}/>}
              {tab==='materials' && <MaterialsTab isMobile={isMobile} p={p}/>}
              {tab==='profile'   && <ProfileTab profile={profile} usage={usage} limits={limits} isMobile={isMobile} p={p}/>}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile bottom nav */}
        {isMobile && (
          <div style={{ position:'fixed', bottom:0, left:0, right:0, height:62, display:'flex', alignItems:'stretch', background:p.bottomNav, backdropFilter:'blur(20px)', borderTop:`1px solid ${p.border}`, zIndex:30, paddingBottom:'env(safe-area-inset-bottom)' }}>
            {TABS.map(t => {
              const active = tab===t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, border:'none', background:'transparent', cursor:'pointer', fontFamily:'inherit', position:'relative' }}>
                  {active && (
                    <motion.div layoutId="bottomNav" style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:36, height:2.5, borderRadius:99, background:'#7c3aed', boxShadow:'0 0 8px rgba(124,58,237,0.7)' }}/>
                  )}
                  <t.icon size={20} style={{ color:active?p.accent:p.dim, transition:'color .15s' }}/>
                  <span style={{ fontSize:9.5, fontWeight:active?700:500, color:active?p.accent:p.dim, letterSpacing:'.2px', transition:'color .15s' }}>{t.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .tab-heading { font-size: 19px; font-weight: 900; margin: 0 0 5px; display: flex; align-items: center; gap: 9px; }
        .tab-sub     { font-size: 13px; margin: 0; }
        .md-body p   { margin: 0 0 9px; }
        .md-body h1,.md-body h2,.md-body h3 { margin: 14px 0 7px; font-weight: 800; }
        .md-body h2  { font-size: 1.1em; color: #a78bfa; }
        .md-body h3  { font-size: 1em; color: #c4b5fd; }
        .md-body ul,.md-body ol { padding-left: 18px; margin: 7px 0; }
        .md-body li  { margin-bottom: 3px; }
        .md-body strong { font-weight: 700; }
        .md-body em  { color: #a78bfa; }
        .md-body code { background: rgba(124,58,237,0.18); color: #c4b5fd; padding: 2px 5px; border-radius: 4px; font-size: .87em; font-family: monospace; }
        .md-body pre  { background: rgba(0,0,0,0.28); border: 1px solid rgba(255,255,255,0.07); padding: 12px; border-radius: 9px; overflow-x: auto; margin: 9px 0; }
        .md-body pre code { background: none; padding: 0; }
        .md-body table { border-collapse: collapse; width: 100%; margin: 9px 0; font-size: 12.5px; }
        .md-body th,.md-body td { border: 1px solid rgba(124,58,237,0.15); padding: 7px 10px; }
        .md-body th  { background: rgba(124,58,237,0.14); font-weight: 700; }
        .md-body blockquote { border-left: 3px solid #7c3aed; padding-left: 12px; margin: 9px 0; }
        input::placeholder, textarea::placeholder { color: rgba(160,140,200,0.4); }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.28); border-radius: 99px; }
        select option { background: #150b35; color: #f0e9ff; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px rgba(20,10,50,0.95) inset !important; -webkit-text-fill-color: #f0e9ff !important; }
        textarea { scrollbar-width: thin; }
      `}</style>
    </div>
  );
}
