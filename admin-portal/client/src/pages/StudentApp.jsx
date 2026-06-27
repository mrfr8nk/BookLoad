import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Image, FileText, BookOpen, ClipboardCheck, User,
  Send, Plus, LogOut, Sparkles, Download, Search, Loader,
  Zap, Crown, ArrowUpRight, AlertCircle, RefreshCw, Copy, Check,
  ChevronDown, Brain, Trophy, RotateCcw, PlayCircle, Star,
  Flame, Target, BarChart3, Menu, Sun, Moon, Camera, X, Eye,
  FolderOpen, Lock, FileCheck, BookMarked,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

/* ─────────────────────────── THEME ──────────────────────────────────────── */
const LIGHT = {
  bg:           '#f5f3ff',
  pageBg:       '#ffffff',
  sidebar:      '#ffffff',
  sidebarBdr:   '#e5e7eb',
  topbar:       'rgba(255,255,255,0.92)',
  surface:      '#ffffff',
  surfaceHov:   '#f9fafb',
  border:       '#e5e7eb',
  borderMid:    '#d1d5db',
  text:         '#111827',
  muted:        '#6b7280',
  dim:          '#9ca3af',
  accent:       '#7c3aed',
  accentDark:   '#5b21b6',
  accentBg:     '#f5f3ff',
  accentBorder: '#c4b5fd',
  accentText:   '#7c3aed',
  chatUserBg:   'linear-gradient(135deg,#7c3aed,#5b21b6)',
  chatUserText: '#ffffff',
  chatAiBg:     '#f9fafb',
  chatAiBdr:    '#e5e7eb',
  chatAiText:   '#111827',
  inputBg:      '#f9fafb',
  inputBdr:     '#d1d5db',
  inputFocus:   '#7c3aed',
  bottomNav:    'rgba(255,255,255,0.96)',
  errBg:        '#fef2f2',
  errBdr:       '#fecaca',
  errText:      '#dc2626',
  successBg:    '#f0fdf4',
  successBdr:   '#bbf7d0',
  successText:  '#16a34a',
  tagBg:        '#f3f4f6',
  tagText:      '#6b7280',
  shadow:       '0 1px 3px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)',
  shadowMd:     '0 4px 6px rgba(0,0,0,0.05),0 2px 4px rgba(0,0,0,0.04)',
  shadowLg:     '0 10px 25px rgba(0,0,0,0.08)',
  scrollThumb:  '#d1d5db',
};
const DARK = {
  bg:           '#0c0521',
  pageBg:       '#150b35',
  sidebar:      'rgba(10,3,27,0.96)',
  sidebarBdr:   'rgba(255,255,255,0.07)',
  topbar:       'rgba(12,5,33,0.88)',
  surface:      'rgba(255,255,255,0.04)',
  surfaceHov:   'rgba(255,255,255,0.07)',
  border:       'rgba(255,255,255,0.08)',
  borderMid:    'rgba(255,255,255,0.12)',
  text:         '#f0e9ff',
  muted:        'rgba(240,233,255,0.6)',
  dim:          'rgba(240,233,255,0.35)',
  accent:       '#a78bfa',
  accentDark:   '#7c3aed',
  accentBg:     'rgba(124,58,237,0.15)',
  accentBorder: 'rgba(124,58,237,0.35)',
  accentText:   '#a78bfa',
  chatUserBg:   'linear-gradient(135deg,#7c3aed,#5b21b6)',
  chatUserText: '#ffffff',
  chatAiBg:     'rgba(255,255,255,0.05)',
  chatAiBdr:    'rgba(255,255,255,0.08)',
  chatAiText:   '#f0e9ff',
  inputBg:      'rgba(255,255,255,0.05)',
  inputBdr:     'rgba(255,255,255,0.1)',
  inputFocus:   '#a78bfa',
  bottomNav:    'rgba(8,2,22,0.97)',
  errBg:        'rgba(239,68,68,0.1)',
  errBdr:       'rgba(239,68,68,0.2)',
  errText:      '#fca5a5',
  successBg:    'rgba(16,185,129,0.1)',
  successBdr:   'rgba(16,185,129,0.2)',
  successText:  '#6ee7b7',
  tagBg:        'rgba(255,255,255,0.05)',
  tagText:      'rgba(240,233,255,0.4)',
  shadow:       '0 1px 3px rgba(0,0,0,0.4)',
  shadowMd:     '0 4px 12px rgba(0,0,0,0.3)',
  shadowLg:     '0 10px 30px rgba(0,0,0,0.4)',
  scrollThumb:  'rgba(124,58,237,0.3)',
};

function useTheme() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('fundo_theme') === 'dark');
  const toggle = () => setIsDark(d => { const n = !d; localStorage.setItem('fundo_theme', n ? 'dark' : 'light'); return n; });
  return { isDark, toggle, p: isDark ? DARK : LIGHT };
}

function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setM(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return m;
}

/* ─────────────────────────── CONSTANTS ──────────────────────────────────── */
const PLAN_COLOR = { FREE:'#6b7280', STARTER:'#3b82f6', BASIC:'#10b981', PRO:'#7c3aed', PREMIUM:'#f59e0b' };
const PLAN_GRADIENT = { FREE:'linear-gradient(135deg,#6b7280,#9ca3af)', STARTER:'linear-gradient(135deg,#3b82f6,#60a5fa)', BASIC:'linear-gradient(135deg,#10b981,#34d399)', PRO:'linear-gradient(135deg,#7c3aed,#a78bfa)', PREMIUM:'linear-gradient(135deg,#f59e0b,#fbbf24)' };
const PLAN_ICONS = { FREE:Zap, STARTER:Flame, BASIC:Brain, PRO:Star, PREMIUM:Crown };

const SUBJECTS = {
  primary: ['Mathematics','English','Shona','Ndebele','Science','Social Studies'],
  olevel:  ['Mathematics','English Language','Biology','Chemistry','Physics','Combined Science','History','Geography','Commerce','Accounting','Computer Science','Agriculture'],
  alevel:  ['Mathematics','Further Mathematics','Physics','Chemistry','Biology','History','Geography','Economics','Business Studies','Accounting','Computer Science'],
};

const TABS = [
  { id:'chat',      icon:MessageSquare,  label:'AI Chat'   },
  { id:'image',     icon:Image,          label:'Images'    },
  { id:'notes',     icon:FileText,       label:'Notes'     },
  { id:'project',   icon:FolderOpen,     label:'Projects'  },
  { id:'exam',      icon:ClipboardCheck, label:'Mock Exam' },
  { id:'materials', icon:BookOpen,       label:'Library'   },
  { id:'profile',   icon:User,           label:'Profile'   },
];

/* ─────────────────────────── API ────────────────────────────────────────── */
const tok = () => localStorage.getItem('fundo_token') || '';
async function api(path, opts = {}) {
  const r = await fetch(path, {
    ...opts,
    headers: { Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json', ...(opts.headers || {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Request failed');
  return d;
}

/* ─────────────────────────── MICRO COMPONENTS ───────────────────────────── */
function Err({ msg, p }) {
  if (!msg) return null;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 13px', background:p.errBg, border:`1px solid ${p.errBdr}`, borderRadius:10, fontSize:13, color:p.errText, marginBottom:10 }}>
      <AlertCircle size={13} style={{ flexShrink:0 }}/> {msg}
    </div>
  );
}

function Success({ msg, p }) {
  if (!msg) return null;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 13px', background:p.successBg, border:`1px solid ${p.successBdr}`, borderRadius:10, fontSize:13, color:p.successText, marginBottom:10 }}>
      <Check size={13} style={{ flexShrink:0 }}/> {msg}
    </div>
  );
}

function Tag({ children, color, p }) {
  return <span style={{ fontSize:10.5, fontWeight:600, padding:'2px 8px', borderRadius:99, background:color ? `${color}15` : p.tagBg, color: color || p.tagText, border:`1px solid ${color ? `${color}25` : p.border}` }}>{children}</span>;
}

function PlanBadge({ plan, p }) {
  const Icon = PLAN_ICONS[plan] || Zap;
  const color = PLAN_COLOR[plan] || '#6b7280';
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:99, background:`${color}15`, color, border:`1px solid ${color}25` }}>
      <Icon size={10}/> {plan}
    </span>
  );
}

function UsageBar({ label, used, limit, icon: Icon, p }) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const near = pct >= 80;
  const col = near ? '#ef4444' : '#7c3aed';
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          {Icon && <Icon size={11} style={{ color:p.dim }}/>}
          <span style={{ fontSize:11.5, color:p.muted, fontWeight:600 }}>{label}</span>
        </div>
        <span style={{ fontSize:11.5, fontWeight:700, color: near ? col : p.muted }}>{used} / {limit >= 9999 ? '∞' : limit}</span>
      </div>
      <div style={{ height:4, borderRadius:99, background:p.border }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:.8, ease:'easeOut' }}
          style={{ height:'100%', borderRadius:99, background:`linear-gradient(90deg,${col},${near ? '#f87171' : '#a78bfa'})` }}/>
      </div>
    </div>
  );
}

function Btn({ onClick, disabled, loading, children, variant='primary', size='md', p, style: sx }) {
  const base = {
    display:'inline-flex', alignItems:'center', justifyContent:'center', gap:7,
    fontFamily:'inherit', fontWeight:700, cursor: disabled||loading ? 'not-allowed' : 'pointer',
    border:'none', borderRadius: size === 'sm' ? 8 : 11, transition:'all .15s',
    fontSize: size === 'sm' ? 12.5 : size === 'lg' ? 15.5 : 13.5,
    padding: size === 'sm' ? '6px 13px' : size === 'lg' ? '14px 26px' : '10px 18px',
    opacity: disabled ? .55 : 1,
    ...sx,
  };
  if (variant === 'primary') return (
    <motion.button onClick={onClick} disabled={disabled||loading} whileTap={!disabled&&!loading?{scale:.96}:{}} style={{ ...base, background:'linear-gradient(135deg,#7c3aed,#5b21b6)', color:'#fff', boxShadow: disabled ? 'none' : '0 2px 10px rgba(124,58,237,0.3)' }}>
      {loading ? <Loader size={14} style={{ animation:'spin .7s linear infinite' }}/> : children}
    </motion.button>
  );
  if (variant === 'secondary') return (
    <motion.button onClick={onClick} disabled={disabled||loading} whileTap={!disabled&&!loading?{scale:.96}:{}} style={{ ...base, background:p.surface, color:p.muted, border:`1px solid ${p.border}` }}>
      {loading ? <Loader size={14} style={{ animation:'spin .7s linear infinite' }}/> : children}
    </motion.button>
  );
  if (variant === 'ghost') return (
    <motion.button onClick={onClick} disabled={disabled||loading} whileTap={!disabled&&!loading?{scale:.96}:{}} style={{ ...base, background:'transparent', color:p.muted }}>
      {loading ? <Loader size={14} style={{ animation:'spin .7s linear infinite' }}/> : children}
    </motion.button>
  );
  return null;
}

function Inp({ value, onChange, placeholder, type='text', isMobile, p, style: sx, onKeyDown, rows }) {
  const base = { width:'100%', padding:'10px 13px', borderRadius:10, border:`1.5px solid ${p.inputBdr}`, background:p.inputBg, color:p.text, fontSize: isMobile ? 16 : 14, fontFamily:'inherit', outline:'none', transition:'border .15s', boxSizing:'border-box', ...sx };
  if (rows) return <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} onKeyDown={onKeyDown} style={{ ...base, resize:'vertical', lineHeight:1.6 }}/>;
  return <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} type={type} onKeyDown={onKeyDown} style={base}/>;
}

function Sel({ value, onChange, options, isMobile, p, style: sx }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} style={{ width:'100%', padding:'10px 28px 10px 13px', borderRadius:10, border:`1.5px solid ${p.inputBdr}`, background:p.inputBg, color:p.text, fontSize: isMobile ? 16 : 14, fontFamily:'inherit', outline:'none', appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%237c3aed' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 11px center', cursor:'pointer', transition:'border .15s', boxSizing:'border-box', ...sx }}>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}

function FG({ label, p, children }) {
  return (
    <div>
      <div style={{ fontSize:11, fontWeight:700, color:p.dim, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:6 }}>{label}</div>
      {children}
    </div>
  );
}

function Card({ children, p, style: sx }) {
  return <div style={{ background:p.surface, border:`1px solid ${p.border}`, borderRadius:14, boxShadow:p.shadow, ...sx }}>{children}</div>;
}

function SectionHeader({ title, sub, icon: Icon, p }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:5 }}>
        {Icon && <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#7c3aed,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon size={16} color="#fff"/></div>}
        <h2 style={{ fontSize:20, fontWeight:900, color:p.text, margin:0 }}>{title}</h2>
      </div>
      {sub && <p style={{ fontSize:13.5, color:p.muted, margin:0 }}>{sub}</p>}
    </div>
  );
}

function ProGate({ plan, feature, p, children }) {
  const isPaid = plan !== 'FREE';
  if (!isPaid) return (
    <div style={{ position:'relative' }}>
      <div style={{ opacity:.4, pointerEvents:'none', filter:'blur(2px)' }}>{children}</div>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:`${p.surface}cc`, borderRadius:14, gap:10 }}>
        <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#f59e0b,#fbbf24)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Lock size={18} color="#fff"/>
        </div>
        <div style={{ textAlign:'center' }}>
          <p style={{ fontSize:14, fontWeight:800, color:p.text, marginBottom:4 }}>Upgrade to Download</p>
          <p style={{ fontSize:12, color:p.muted, marginBottom:10 }}>PDF download is available on Starter+ plans</p>
          <a href="https://wa.me/263719647303?text=upgrade" target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', background:'linear-gradient(135deg,#7c3aed,#5b21b6)', color:'#fff', textDecoration:'none', borderRadius:9, fontWeight:700, fontSize:13, boxShadow:'0 2px 8px rgba(124,58,237,0.35)' }}>
            <Crown size={12}/> Upgrade now
          </a>
        </div>
      </div>
    </div>
  );
  return children;
}

/* ─────────────────────────── PDF EXPORT ─────────────────────────────────── */
async function exportPDF(content, title, type, plan) {
  const d = await api('/api/student/export-pdf', { method:'POST', body: { content, title, type } });
  if (d.url) {
    const a = document.createElement('a');
    a.href = d.url; a.download = `${title||'document'}.pdf`; a.target = '_blank';
    a.click();
  }
  return d;
}

/* ══════════════════════════════════════════════════════════════════════════
   AI CHAT
══════════════════════════════════════════════════════════════════════════ */
function ChatTab({ profile, isMobile, p }) {
  const [sessions, setSessions] = useState([{ id:1, title:'New Chat', messages:[] }]);
  const [active, setActive] = useState(1);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visionOpen, setVisionOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [imgOk, setImgOk] = useState(false);
  const bottomRef = useRef();
  const session = sessions.find(s => s.id === active) || sessions[0];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [session?.messages.length, loading]);

  function newChat() { const id = Date.now(); setSessions(s => [...s, { id, title:'New Chat', messages:[] }]); setActive(id); setError(''); }

  function addMsg(sessionId, msgs) {
    setSessions(s => s.map(sess => sess.id === sessionId ? {
      ...sess, messages: [...sess.messages, ...msgs],
      title: sess.messages.length === 0 ? (msgs[0]?.content || '').slice(0, 36) : sess.title
    } : sess));
  }

  async function send() {
    const msg = input.trim();
    if (!msg || loading) return;
    const sid = active;
    setInput(''); setError('');

    if (visionOpen && imgUrl) {
      setVisionOpen(false);
      addMsg(sid, [{ role:'user', content:msg, imageUrl:imgUrl }]);
      setLoading(true);
      try {
        const d = await api('/api/student/analyze-image', { method:'POST', body:{ imageUrl:imgUrl, question:msg } });
        setSessions(s => s.map(sess => sess.id === sid ? { ...sess, messages:[...sess.messages, { role:'assistant', content:d.reply }] } : sess));
      } catch(e) { setError(e.message); }
      finally { setLoading(false); setImgUrl(''); setImgOk(false); }
      return;
    }

    addMsg(sid, [{ role:'user', content:msg }]);
    setLoading(true);
    try {
      const history = session.messages.slice(-10);
      const d = await api('/api/student/chat', { method:'POST', body:{ message:msg, history } });
      setSessions(s => s.map(sess => sess.id === sid ? { ...sess, messages:[...sess.messages, { role:'assistant', content:d.reply }] } : sess));
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  const STARTERS = ['Explain quadratic equations step by step','Key concepts in photosynthesis','How to write a ZIMSEC English essay','Balancing chemical equations','Causes of World War 1 for ZIMSEC','Newton\'s laws of motion explained'];

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>
      {!isMobile && (
        <div style={{ width:200, borderRight:`1px solid ${p.border}`, display:'flex', flexDirection:'column', gap:2, padding:'10px 8px', background:p.bg, flexShrink:0 }}>
          <button onClick={newChat} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 12px', borderRadius:9, border:`1.5px dashed ${p.accentBorder}`, background:'transparent', cursor:'pointer', fontSize:12.5, fontWeight:700, color:p.accent, marginBottom:6, width:'100%', fontFamily:'inherit' }}>
            <Plus size={12}/> New Chat
          </button>
          <div style={{ overflowY:'auto', flex:1 }}>
            {sessions.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)} style={{ width:'100%', textAlign:'left', padding:'8px 11px', borderRadius:9, border:'none', cursor:'pointer', marginBottom:2, fontSize:12, fontWeight:active===s.id?700:500, fontFamily:'inherit', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', transition:'all .14s',
                background:active===s.id?p.accentBg:'transparent', color:active===s.id?p.accent:p.muted }}>
                <MessageSquare size={10} style={{ marginRight:6 }}/>{s.title}
              </button>
            ))}
          </div>
        </div>
      )}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        {isMobile && (
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderBottom:`1px solid ${p.border}`, flexShrink:0 }}>
            <select value={active} onChange={e => setActive(Number(e.target.value))} style={{ flex:1, padding:'6px 10px', borderRadius:8, border:`1px solid ${p.border}`, background:p.inputBg, color:p.text, fontSize:13, fontFamily:'inherit', outline:'none' }}>
              {sessions.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
            <button onClick={newChat} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:8, border:`1.5px dashed ${p.accentBorder}`, background:'transparent', color:p.accent, fontSize:12.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              <Plus size={11}/>
            </button>
          </div>
        )}
        <div style={{ flex:1, overflowY:'auto', padding:isMobile?'16px 14px':'20px 24px' }}>
          {session.messages.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'68%', textAlign:'center', padding:'24px 12px' }}>
              <motion.div initial={{ scale:.85 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200 }}
                style={{ width:68, height:68, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, boxShadow:'0 8px 24px rgba(124,58,237,0.3)', overflow:'hidden' }}>
                <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{ e.target.style.display='none'; }}/>
              </motion.div>
              <h3 style={{ fontSize:isMobile?19:22, fontWeight:900, color:p.text, marginBottom:7 }}>Hi {profile?.name?.split(' ')[0] || 'there'}! 👋</h3>
              <p style={{ fontSize:14, color:p.muted, lineHeight:1.7, maxWidth:360, marginBottom:8 }}>I'm your AI study partner, trained on ZIMSEC and Cambridge curricula. Ask me anything!</p>
              <p style={{ fontSize:12.5, color:p.dim, marginBottom:24, display:'flex', alignItems:'center', gap:6 }}>
                <Camera size={12} style={{ color:p.accent }}/> Tap the camera icon to analyse any image
              </p>
              <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:8, width:'100%', maxWidth:500 }}>
                {STARTERS.map(s => (
                  <motion.button key={s} onClick={() => setInput(s)} whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}
                    style={{ padding:'11px 14px', borderRadius:11, background:p.surface, border:`1px solid ${p.border}`, cursor:'pointer', fontSize:12.5, color:p.muted, textAlign:'left', lineHeight:1.5, fontFamily:'inherit', boxShadow:p.shadow }}>
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {session.messages.map((m,i) => <ChatBubble key={i} msg={m} profile={profile} isMobile={isMobile} p={p}/>)}
              {loading && <TypingBubble p={p}/>}
              {error && <Err msg={error} p={p}/>}
              <div ref={bottomRef}/>
            </>
          )}
        </div>

        <AnimatePresence>
          {visionOpen && (
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
              style={{ borderTop:`1px solid ${p.border}`, background:p.bg, flexShrink:0, overflow:'hidden' }}>
              <div style={{ padding:'12px 16px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <Camera size={14} style={{ color:p.accent }}/>
                  <span style={{ fontSize:13, fontWeight:700, color:p.text }}>Analyse an Image</span>
                  <span style={{ fontSize:12, color:p.muted, flex:1 }}>— paste an image URL below</span>
                  <button onClick={() => setVisionOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:p.dim }}><X size={14}/></button>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <input value={imgUrl} onChange={e => { setImgUrl(e.target.value); setImgOk(false); }} placeholder="https://example.com/image.jpg"
                    style={{ flex:1, padding:'9px 12px', borderRadius:9, border:`1.5px solid ${imgUrl ? p.accentBorder : p.inputBdr}`, background:p.inputBg, color:p.text, fontSize:isMobile?16:13.5, outline:'none', fontFamily:'inherit' }}/>
                  {imgUrl && <div style={{ width:44, height:44, borderRadius:9, overflow:'hidden', border:`1px solid ${p.border}`, flexShrink:0, background:p.bg }}>
                    <img src={imgUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:imgOk?'block':'none' }}
                      onLoad={() => setImgOk(true)} onError={() => setImgOk(false)}/>
                    {!imgOk && <Eye size={14} style={{ color:p.dim, display:'block', margin:'12px auto' }}/>}
                  </div>}
                </div>
                <p style={{ fontSize:11.5, color:p.dim, marginTop:7 }}>Then type your question in the box below and press send.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ padding:isMobile?'10px 12px':'12px 16px', borderTop:`1px solid ${p.border}`, flexShrink:0 }}>
          <div style={{ display:'flex', gap:8, alignItems:'flex-end', background:p.inputBg, border:`1.5px solid ${p.inputBdr}`, borderRadius:14, padding:'9px 12px' }}>
            <motion.button onClick={() => setVisionOpen(v=>!v)} whileTap={{ scale:.88 }}
              style={{ width:34, height:34, borderRadius:9, border:`1.5px solid ${visionOpen ? p.accentBorder : p.border}`, background:visionOpen ? p.accentBg : p.surface, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, transition:'all .15s' }}>
              <Camera size={14} style={{ color:visionOpen ? p.accent : p.dim }}/>
            </motion.button>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={visionOpen && imgUrl ? 'What do you want to know about this image?' : 'Ask me anything…'} rows={1}
              style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:isMobile?16:14, color:p.text, resize:'none', maxHeight:110, fontFamily:'inherit', lineHeight:1.6 }}
              onInput={e => { e.target.style.height='auto'; e.target.style.height=Math.min(e.target.scrollHeight,110)+'px'; }}/>
            <motion.button onClick={send} disabled={!input.trim()||loading} whileTap={{ scale:.9 }}
              style={{ width:36, height:36, borderRadius:10, border:'none', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor: input.trim()&&!loading ? 'pointer' : 'not-allowed', transition:'all .15s',
                background: input.trim()&&!loading ? 'linear-gradient(135deg,#7c3aed,#5b21b6)' : p.border,
                boxShadow: input.trim()&&!loading ? '0 2px 8px rgba(124,58,237,0.35)' : 'none' }}>
              <Send size={14} style={{ color: input.trim()&&!loading ? '#fff' : p.dim }}/>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

function superChar(c) {
  return {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','+':'⁺','-':'⁻','n':'ⁿ','x':'ˣ','a':'ᵃ','b':'ᵇ'}[c] || c;
}
function subChar(c) {
  return {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉','+':'₊','-':'₋','n':'ₙ','x':'ₓ','a':'ₐ'}[c] || c;
}
function cleanMath(text) {
  if (!text) return text;
  return text
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, m) => '\n\n`' + cleanExpr(m.trim()) + '`\n\n')
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, m) => '\n\n`' + cleanExpr(m.trim()) + '`\n\n')
    .replace(/\$([^$\n]+?)\$/g,     (_, m) => '`' + cleanExpr(m.trim()) + '`')
    .replace(/\\\(([^)]+?)\\\)/g,   (_, m) => '`' + cleanExpr(m.trim()) + '`')
    .replace(/\\boxed\{([^}]+)\}/g, '[$1]')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^}]+)\}/g,  '√($1)')
    .replace(/\\sqrt\b/g,           '√')
    .replace(/\\times/g, '×').replace(/\\div/g, '÷').replace(/\\pm/g, '±').replace(/\\mp/g, '∓')
    .replace(/\\cdot/g, '·').replace(/\\leq/g, '≤').replace(/\\geq/g, '≥').replace(/\\neq/g, '≠')
    .replace(/\\approx/g, '≈').replace(/\\infty/g, '∞').replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\lambda/g, 'λ').replace(/\\mu/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\phi/g, 'φ').replace(/\\psi/g, 'ψ').replace(/\\rho/g, 'ρ').replace(/\\epsilon/g, 'ε')
    .replace(/\\Delta/g, 'Δ').replace(/\\Sigma/g, 'Σ').replace(/\\Omega/g, 'Ω').replace(/\\Pi/g, 'Π')
    .replace(/\\[Nn]abla/g, '∇').replace(/\\partial/g, '∂').replace(/\\in\b/g, '∈').replace(/\\subset/g, '⊂')
    .replace(/\^{([^}]+)}/g, (_, e) => e.split('').map(superChar).join(''))
    .replace(/\^([0-9])/g,   (_, e) => superChar(e))
    .replace(/_{([^}]+)}/g,  (_, e) => e.split('').map(subChar).join(''))
    .replace(/_([0-9])/g,    (_, e) => subChar(e))
    .replace(/\\[a-zA-Z]+/g, '').replace(/\{([^}]*)\}/g, '$1');
}
function cleanExpr(expr) {
  return expr
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)').replace(/\\boxed\{([^}]+)\}/g, '$1')
    .replace(/\^{([^}]+)}/g, (_, e) => e.split('').map(superChar).join(''))
    .replace(/\^([0-9])/g, (_, e) => superChar(e))
    .replace(/_{([^}]+)}/g, (_, e) => e.split('').map(subChar).join(''))
    .replace(/\\times/g,'×').replace(/\\div/g,'÷').replace(/\\pm/g,'±').replace(/\\pi/g,'π')
    .replace(/\\leq/g,'≤').replace(/\\geq/g,'≥').replace(/\\neq/g,'≠').replace(/\\cdot/g,'·')
    .replace(/\\[a-zA-Z]+/g, '').replace(/\{([^}]*)\}/g, '$1').trim();
}

function ChatBubble({ msg, profile, isMobile, p }) {
  const isUser = msg.role === 'user';
  const [copied, setCopied] = useState(false);
  function copy() { navigator.clipboard.writeText(msg.content).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000); }
  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:.18 }}
      style={{ display:'flex', justifyContent:isUser?'flex-end':'flex-start', marginBottom:16, gap:8, alignItems:'flex-start' }}>
      {!isUser && <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#a78bfa)', flexShrink:0, marginTop:2, overflow:'hidden', boxShadow:'0 2px 8px rgba(124,58,237,0.25)' }}>
        <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}}/>
      </div>}
      <div style={{ maxWidth:isMobile?'86%':'74%' }}>
        {msg.imageUrl && <div style={{ marginBottom:6, borderRadius:10, overflow:'hidden', maxWidth:200, border:`1px solid ${p.border}` }}>
          <img src={msg.imageUrl} alt="" style={{ width:'100%', display:'block', maxHeight:160, objectFit:'cover' }}/>
        </div>}
        <div style={{ padding:isUser?'10px 14px':'12px 16px', borderRadius:isUser?'18px 18px 4px 18px':'4px 18px 18px 18px',
          background:isUser?p.chatUserBg:p.chatAiBg, border:isUser?'none':`1px solid ${p.chatAiBdr}`,
          color:isUser?p.chatUserText:p.chatAiText, fontSize:isMobile?14:13.5, lineHeight:1.75,
          boxShadow:isUser?'0 2px 10px rgba(124,58,237,0.2)':p.shadow }}>
          {isUser ? <p style={{ margin:0, whiteSpace:'pre-wrap' }}>{msg.content}</p>
            : <div className="md-body"><ReactMarkdown>{cleanMath(msg.content)}</ReactMarkdown></div>}
        </div>
        {!isUser && (
          <button onClick={copy} style={{ marginTop:4, background:'none', border:'none', cursor:'pointer', fontSize:11, color:p.dim, display:'flex', alignItems:'center', gap:4, padding:'2px 5px', fontFamily:'inherit' }}>
            {copied ? <><Check size={10} style={{ color:'#10b981' }}/>Copied</> : <><Copy size={10}/>Copy</>}
          </button>
        )}
      </div>
      {isUser && <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2, fontSize:11, fontWeight:800, color:'#fff' }}>
        {(profile?.name||'U')[0]?.toUpperCase()}
      </div>}
    </motion.div>
  );
}

function TypingBubble({ p }) {
  return (
    <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} style={{ display:'flex', gap:8, marginBottom:14, alignItems:'center' }}>
      <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#a78bfa)', overflow:'hidden' }}>
        <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}}/>
      </div>
      <div style={{ background:p.chatAiBg, border:`1px solid ${p.chatAiBdr}`, padding:'10px 14px', borderRadius:'4px 18px 18px 18px', display:'flex', gap:5, alignItems:'center', boxShadow:p.shadow }}>
        {[0,1,2].map(i => (
          <motion.div key={i} style={{ width:6, height:6, borderRadius:'50%', background:p.accent }}
            animate={{ y:[0,-5,0], opacity:[.4,1,.4] }} transition={{ repeat:Infinity, duration:.9, delay:i*.18 }}/>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   IMAGE CREATOR
══════════════════════════════════════════════════════════════════════════ */
function ImageTab({ plan, isMobile, p }) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle]   = useState('ultra realistic');
  const [loading, setLoading] = useState(false);
  const [result, setResult]  = useState(null);
  const [error, setError]    = useState('');
  const [history, setHistory] = useState([]);
  const STYLES = ['Ultra Realistic','Digital Art','Anime','3D Render','Watercolor','Pencil Sketch','Diagram Style'];
  const EXAMPLES = ['Water cycle diagram','Human heart cross-section','Atom model 3D','Photosynthesis process','Map of Zimbabwe rivers','DNA double helix'];

  async function generate() {
    if (!prompt.trim() || loading) return;
    setError(''); setLoading(true); setResult(null);
    try {
      const d = await api(`/api/student/generate-image?prompt=${encodeURIComponent(prompt + ', ' + style)}`);
      setResult(d);
      setHistory(h => [{ prompt, imageUrl:d.imageUrl }, ...h.slice(0,7)]);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ padding:isMobile?'18px 14px':'26px 32px', maxWidth:860, margin:'0 auto', overflowY:'auto', height:'100%' }}>
      <SectionHeader title="AI Image Creator" sub="Generate educational diagrams, illustrations, and concept visuals instantly." icon={Image} p={p}/>
      <p style={{ fontSize:11.5, color:p.dim, marginBottom:16, marginTop:-10 }}>Powered by NanoBanana Pro · Pollinations fallback</p>

      <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:14 }}>
        {STYLES.map(s => (
          <button key={s} onClick={() => setStyle(s.toLowerCase())}
            style={{ padding:'6px 13px', borderRadius:99, border:`1.5px solid ${style===s.toLowerCase()?p.accentBorder:p.border}`, background:style===s.toLowerCase()?p.accentBg:p.surface, color:style===s.toLowerCase()?p.accent:p.muted, fontSize:12.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all .14s', boxShadow: style===s.toLowerCase() ? '0 0 0 2px rgba(124,58,237,0.1)' : 'none' }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ display:'flex', gap:9, marginBottom:12 }}>
        <input value={prompt} onChange={e=>setPrompt(e.target.value)} onKeyDown={e=>e.key==='Enter'&&generate()}
          placeholder="Describe the image you want to create…"
          style={{ flex:1, padding:'12px 14px', borderRadius:12, border:`1.5px solid ${p.inputBdr}`, background:p.inputBg, fontSize:isMobile?16:14, color:p.text, outline:'none', fontFamily:'inherit', transition:'border .15s' }}/>
        <Btn onClick={generate} disabled={!prompt.trim()} loading={loading} variant="primary" size="md" p={p}>
          <Sparkles size={14}/>{!isMobile && (loading ? 'Creating…' : 'Generate')}
        </Btn>
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:22 }}>
        {EXAMPLES.map(ex => (
          <button key={ex} onClick={() => {
            setPrompt(ex);
            if (!loading) {
              setError(''); setLoading(true); setResult(null);
              api(`/api/student/generate-image?prompt=${encodeURIComponent(ex + ', ' + style)}`)
                .then(d => { setResult(d); setHistory(h => [{ prompt: ex, imageUrl:d.imageUrl }, ...h.slice(0,7)]); })
                .catch(e => setError(e.message))
                .finally(() => setLoading(false));
            }
          }}
          style={{ padding:'5px 11px', borderRadius:99, border:`1px solid ${p.border}`, background:p.surface, color:p.muted, fontSize:12, cursor:'pointer', fontFamily:'inherit', transition:'all .14s' }}>{ex}</button>
        ))}
      </div>

      <Err msg={error} p={p}/>
      {loading && (
        <div style={{ textAlign:'center', padding:'52px 20px' }}>
          <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.8, ease:'linear' }}
            style={{ width:52, height:52, borderRadius:'50%', border:`3px solid ${p.border}`, borderTopColor:p.accent, margin:'0 auto 14px' }}/>
          <p style={{ fontSize:14, color:p.muted }}>NanoBanana Pro is creating your image…</p>
        </div>
      )}
      {result && !loading && (
        <motion.div initial={{ opacity:0, scale:.97 }} animate={{ opacity:1, scale:1 }}
          style={{ borderRadius:16, overflow:'hidden', background:p.surface, border:`1px solid ${p.border}`, marginBottom:24, boxShadow:p.shadowLg }}>
          <img src={result.imageUrl} alt={prompt} style={{ width:'100%', maxHeight:isMobile?300:480, objectFit:'contain', background:'#000', display:'block' }}/>
          <div style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontSize:13, color:p.muted, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{prompt}</span>
            <a href={result.imageUrl} download target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', background:p.accentBg, border:`1.5px solid ${p.accentBorder}`, color:p.accent, borderRadius:9, fontSize:13, fontWeight:700, textDecoration:'none', flexShrink:0 }}>
              <Download size={12}/> Save
            </a>
          </div>
        </motion.div>
      )}
      {history.length > 0 && (
        <>
          <p style={{ fontSize:11.5, color:p.dim, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:10 }}>Recent</p>
          <div style={{ display:'grid', gridTemplateColumns:`repeat(auto-fill,minmax(130px,1fr))`, gap:9 }}>
            {history.map((h,i) => (
              <motion.div key={i} whileHover={{ scale:1.03 }} onClick={() => { setResult(h); setPrompt(h.prompt); }}
                style={{ borderRadius:10, overflow:'hidden', background:p.surface, border:`1px solid ${p.border}`, cursor:'pointer', boxShadow:p.shadow }}>
                <img src={h.imageUrl} alt="" style={{ width:'100%', height:90, objectFit:'cover' }}/>
                <div style={{ padding:'5px 8px', fontSize:10.5, color:p.muted, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{h.prompt}</div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   STUDY NOTES
══════════════════════════════════════════════════════════════════════════ */
function NotesTab({ profile, plan, isMobile, p }) {
  const [form, setForm] = useState({ topic:'', subject:'', level:profile?.levelType||'olevel', grade:profile?.grade||'' });
  const [loading, setLoading]  = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [notes, setNotes]      = useState('');
  const [error, setError]      = useState('');
  const [success, setSuccess]  = useState('');
  const [copied, setCopied]    = useState(false);
  const [view, setView]        = useState('form');
  function setF(k,v) { setForm(f=>({...f,[k]:v})); }
  const subjects = SUBJECTS[form.level] || SUBJECTS.olevel;
  const isPaid = plan !== 'FREE';

  async function generate(e) {
    e.preventDefault();
    if (!form.topic.trim() || loading) return;
    setError(''); setLoading(true); setNotes('');
    try {
      const d = await api('/api/student/generate-notes', { method:'POST', body:form });
      setNotes(d.notes);
      setView('notes');
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function downloadPDF() {
    if (!isPaid) return;
    setPdfLoading(true); setError(''); setSuccess('');
    try {
      await exportPDF(notes, form.topic, 'notes', plan);
      setSuccess('PDF downloaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch(e) { setError(e.message); }
    finally { setPdfLoading(false); }
  }

  function copy() { navigator.clipboard.writeText(notes).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2200); }

  return (
    <div style={{ padding:isMobile?'16px 14px':'26px 32px', height:'100%', overflowY:'auto' }}>
      <SectionHeader title="AI Study Notes" sub="Comprehensive, curriculum-aligned notes generated instantly for any topic." icon={FileText} p={p}/>

      {isMobile && notes && (
        <div style={{ display:'flex', gap:1, marginBottom:16, borderRadius:10, overflow:'hidden', border:`1px solid ${p.border}`, background:p.bg }}>
          {['form','notes'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ flex:1, padding:'10px', border:'none', background:view===v?p.accentBg:'transparent', color:view===v?p.accent:p.muted, cursor:'pointer', fontSize:13.5, fontWeight:view===v?700:500, fontFamily:'inherit', borderBottom:view===v?`2px solid ${p.accent}`:'2px solid transparent', transition:'all .14s' }}>
              {v==='form'?'Setup':'Notes'}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: notes ? '280px 1fr' : '360px', gap:20 }}>
        {(!isMobile || view==='form') && (
          <Card p={p} style={{ padding:'20px' }}>
            <form onSubmit={generate} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <FG label="Topic *" p={p}><Inp value={form.topic} onChange={v=>setF('topic',v)} placeholder="e.g. Photosynthesis, Quadratic Equations…" required isMobile={isMobile} p={p}/></FG>
              <FG label="Level" p={p}><Sel value={form.level} onChange={v=>setF('level',v)} options={[['primary','Primary School'],['olevel','O-Level'],['alevel','A-Level']]} isMobile={isMobile} p={p}/></FG>
              <FG label="Subject" p={p}><Sel value={form.subject} onChange={v=>setF('subject',v)} options={[['','— Choose subject —'],...subjects.map(s=>[s,s])]} isMobile={isMobile} p={p}/></FG>
              <FG label="Grade / Form" p={p}><Inp value={form.grade} onChange={v=>setF('grade',v)} placeholder="e.g. Form 4, Grade 7" isMobile={isMobile} p={p}/></FG>
              <Err msg={error} p={p}/>
              <Btn type="submit" disabled={!form.topic.trim()} loading={loading} variant="primary" size="md" p={p} style={{ width:'100%' }} onClick={generate}>
                <Sparkles size={14}/> {loading ? 'Generating notes…' : 'Generate Notes'}
              </Btn>
            </form>
          </Card>
        )}

        {(!isMobile || view==='notes') && (loading || notes) && (
          <Card p={p} style={{ overflow:'hidden' }}>
            <div style={{ padding:'14px 18px', borderBottom:`1px solid ${p.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexWrap:'wrap' }}>
              <div>
                <span style={{ fontSize:14, fontWeight:800, color:p.text }}>{form.topic || 'Study Notes'}</span>
                {form.subject && <Tag color="#7c3aed" p={p}>{form.subject}</Tag>}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                {notes && (
                  <>
                    <button onClick={copy} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', background:p.surface, border:`1px solid ${p.border}`, borderRadius:8, cursor:'pointer', fontSize:12, fontWeight:600, color:p.muted, fontFamily:'inherit' }}>
                      {copied ? <><Check size={11} style={{ color:'#10b981' }}/>Copied</> : <><Copy size={11}/>Copy</>}
                    </button>
                    {isPaid ? (
                      <Btn onClick={downloadPDF} loading={pdfLoading} variant="primary" size="sm" p={p}>
                        <Download size={11}/> PDF
                      </Btn>
                    ) : (
                      <a href="https://wa.me/263719647303?text=upgrade" target="_blank" rel="noopener noreferrer"
                        style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'6px 12px', background:'linear-gradient(135deg,#f59e0b,#fbbf24)', color:'#fff', textDecoration:'none', borderRadius:8, fontSize:12, fontWeight:700, boxShadow:'0 2px 6px rgba(245,158,11,0.3)' }}>
                        <Crown size={11}/> PDF (upgrade)
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
            <Success msg={success} p={p}/>
            <div style={{ padding:'18px 20px', maxHeight:isMobile?460:560, overflowY:'auto' }}>
              {loading ? (
                <div style={{ textAlign:'center', padding:'40px 0' }}>
                  <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.3, ease:'linear' }}
                    style={{ width:38, height:38, borderRadius:'50%', border:`3px solid ${p.border}`, borderTopColor:p.accent, margin:'0 auto 12px' }}/>
                  <p style={{ fontSize:13.5, color:p.muted }}>Generating curriculum-aligned notes…</p>
                </div>
              ) : <div className="md-body" style={{ fontSize:isMobile?14:13.5, lineHeight:1.85, color:p.text }}><ReactMarkdown>{notes}</ReactMarkdown></div>}
            </div>
            {notes && !isPaid && (
              <div style={{ padding:'10px 18px', borderTop:`1px solid ${p.border}`, background:p.bg, display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
                <span style={{ fontSize:11, color:p.dim }}>🔒 PDF download available on Starter+ plans</span>
                <a href="https://wa.me/263719647303?text=upgrade" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize:11, fontWeight:700, color:p.accent, textDecoration:'none' }}>Upgrade →</a>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PROJECT GENERATOR
══════════════════════════════════════════════════════════════════════════ */
function ProjectTab({ profile, plan, isMobile, p }) {
  const [form, setForm] = useState({ topic:'', subject:'', level:profile?.levelType||'olevel', grade:profile?.grade||'', studentName:profile?.name||'', school:profile?.school||'', pages:4 });
  const [loading, setLoading]  = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [project, setProject]  = useState(null);
  const [error, setError]      = useState('');
  const [success, setSuccess]  = useState('');
  const [copied, setCopied]    = useState(false);
  const [view, setView]        = useState('form');
  function setF(k,v) { setForm(f=>({...f,[k]:v})); }
  const subjects = SUBJECTS[form.level] || SUBJECTS.olevel;
  const isPaid = plan !== 'FREE';

  async function generate(e) {
    e.preventDefault();
    if (!form.topic.trim() || loading) return;
    setError(''); setLoading(true); setProject(null);
    try {
      const d = await api('/api/student/generate-project', { method:'POST', body:form });
      setProject(d);
      if (isMobile) setView('project');
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function downloadPDF() {
    if (!isPaid || !project) return;
    setPdfLoading(true); setError(''); setSuccess('');
    try {
      await exportPDF(project.content, form.topic, 'project', plan);
      setSuccess('Project PDF downloaded!');
      setTimeout(() => setSuccess(''), 3000);
    } catch(e) { setError(e.message); }
    finally { setPdfLoading(false); }
  }

  function copy() { navigator.clipboard.writeText(project?.content||'').catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2200); }

  return (
    <div style={{ padding:isMobile?'16px 14px':'26px 32px', height:'100%', overflowY:'auto' }}>
      <SectionHeader title="Project Generator" sub="AI-generated full academic project reports — ready to submit, tailored to your level." icon={FolderOpen} p={p}/>

      {!isPaid && (
        <div style={{ marginBottom:16, padding:'12px 16px', background:'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(251,191,36,0.05))', border:`1px solid rgba(245,158,11,0.25)`, borderRadius:12, display:'flex', alignItems:'center', gap:12 }}>
          <Crown size={16} style={{ color:'#f59e0b', flexShrink:0 }}/>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:13, fontWeight:700, color:p.text, margin:'0 0 2px' }}>PDF download available on paid plans</p>
            <p style={{ fontSize:12, color:p.muted, margin:0 }}>You can read and copy your project for free. Upgrade to download a professional PDF.</p>
          </div>
          <a href="https://wa.me/263719647303?text=upgrade" target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'7px 14px', background:'linear-gradient(135deg,#f59e0b,#fbbf24)', color:'#fff', textDecoration:'none', borderRadius:9, fontSize:12.5, fontWeight:700, flexShrink:0 }}>
            Upgrade
          </a>
        </div>
      )}

      {isMobile && project && (
        <div style={{ display:'flex', gap:1, marginBottom:16, borderRadius:10, overflow:'hidden', border:`1px solid ${p.border}` }}>
          {['form','project'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ flex:1, padding:'10px', border:'none', background:view===v?p.accentBg:'transparent', color:view===v?p.accent:p.muted, cursor:'pointer', fontSize:13.5, fontWeight:view===v?700:500, fontFamily:'inherit', borderBottom:view===v?`2px solid ${p.accent}`:'2px solid transparent' }}>
              {v==='form'?'Setup':'Project'}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: project ? '280px 1fr' : '380px', gap:20 }}>
        {(!isMobile || view==='form') && (
          <Card p={p} style={{ padding:'20px' }}>
            <form onSubmit={generate} style={{ display:'flex', flexDirection:'column', gap:13 }}>
              <FG label="Project Topic *" p={p}><Inp value={form.topic} onChange={v=>setF('topic',v)} placeholder="e.g. Water Pollution in Zimbabwe, Solar Energy…" required isMobile={isMobile} p={p}/></FG>
              <FG label="Level" p={p}><Sel value={form.level} onChange={v=>setF('level',v)} options={[['primary','Primary School'],['olevel','O-Level'],['alevel','A-Level']]} isMobile={isMobile} p={p}/></FG>
              <FG label="Subject" p={p}><Sel value={form.subject} onChange={v=>setF('subject',v)} options={[['','— Choose subject —'],...subjects.map(s=>[s,s])]} isMobile={isMobile} p={p}/></FG>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <FG label="Grade / Form" p={p}><Inp value={form.grade} onChange={v=>setF('grade',v)} placeholder="Form 4" isMobile={isMobile} p={p}/></FG>
                <FG label="Pages" p={p}><Sel value={form.pages} onChange={v=>setF('pages',Number(v))} options={[[3,'~3 pages'],[4,'~4 pages'],[5,'~5 pages'],[6,'~6 pages']]} isMobile={isMobile} p={p}/></FG>
              </div>
              <FG label="Student Name" p={p}><Inp value={form.studentName} onChange={v=>setF('studentName',v)} placeholder="Your full name" isMobile={isMobile} p={p}/></FG>
              <FG label="School Name" p={p}><Inp value={form.school} onChange={v=>setF('school',v)} placeholder="Your school name" isMobile={isMobile} p={p}/></FG>
              <Err msg={error} p={p}/>
              <Btn disabled={!form.topic.trim()} loading={loading} variant="primary" size="md" p={p} style={{ width:'100%' }} onClick={generate}>
                <FolderOpen size={14}/> {loading ? 'Generating project…' : 'Generate Project'}
              </Btn>
            </form>
          </Card>
        )}

        {(!isMobile || view==='project') && (loading || project) && (
          <Card p={p} style={{ overflow:'hidden' }}>
            <div style={{ padding:'14px 18px', borderBottom:`1px solid ${p.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexWrap:'wrap' }}>
              <div style={{ minWidth:0 }}>
                <span style={{ fontSize:14, fontWeight:800, color:p.text, display:'block', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{project?.topic || form.topic}</span>
                <div style={{ display:'flex', gap:6, marginTop:4, flexWrap:'wrap' }}>
                  {project?.studentName && <Tag p={p}>{project.studentName}</Tag>}
                  {project?.school && <Tag p={p}>{project.school}</Tag>}
                  {form.subject && <Tag color="#7c3aed" p={p}>{form.subject}</Tag>}
                </div>
              </div>
              <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                {project && (
                  <>
                    <button onClick={copy} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', background:p.surface, border:`1px solid ${p.border}`, borderRadius:8, cursor:'pointer', fontSize:12, fontWeight:600, color:p.muted, fontFamily:'inherit' }}>
                      {copied ? <><Check size={11} style={{ color:'#10b981' }}/>Copied</> : <><Copy size={11}/>Copy</>}
                    </button>
                    {isPaid ? (
                      <Btn onClick={downloadPDF} loading={pdfLoading} variant="primary" size="sm" p={p}>
                        <Download size={11}/> Download PDF
                      </Btn>
                    ) : (
                      <a href="https://wa.me/263719647303?text=upgrade" target="_blank" rel="noopener noreferrer"
                        style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'6px 12px', background:'linear-gradient(135deg,#f59e0b,#fbbf24)', color:'#fff', textDecoration:'none', borderRadius:8, fontSize:12, fontWeight:700 }}>
                        <Crown size={11}/> Download PDF
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
            <Success msg={success} p={p}/>
            <div style={{ padding:'18px 22px', maxHeight:isMobile?460:560, overflowY:'auto' }}>
              {loading ? (
                <div style={{ textAlign:'center', padding:'40px 0' }}>
                  <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.3, ease:'linear' }}
                    style={{ width:40, height:40, borderRadius:'50%', border:`3px solid ${p.border}`, borderTopColor:p.accent, margin:'0 auto 14px' }}/>
                  <p style={{ fontSize:13.5, color:p.muted }}>Writing your academic project…</p>
                  <p style={{ fontSize:12.5, color:p.dim, marginTop:6 }}>This may take 20–40 seconds</p>
                </div>
              ) : <div className="md-body" style={{ fontSize:isMobile?14:13.5, lineHeight:1.85, color:p.text }}><ReactMarkdown>{project?.content}</ReactMarkdown></div>}
            </div>
            {project && !isPaid && (
              <div style={{ padding:'10px 18px', borderTop:`1px solid ${p.border}`, background:p.bg, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:11, color:p.dim }}>🔒 Professional PDF export available on Starter+ plans</span>
                <a href="https://wa.me/263719647303?text=upgrade" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, fontWeight:700, color:p.accent, textDecoration:'none' }}>Upgrade →</a>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MOCK EXAM
══════════════════════════════════════════════════════════════════════════ */
function ExamTab({ profile, plan, isMobile, p }) {
  const [phase, setPhase] = useState('setup');
  const [form, setForm]   = useState({ subject:'', level:profile?.levelType||'olevel', grade:profile?.grade||'', topic:'', count:10, difficulty:'medium' });
  const [questions, setQs] = useState([]);
  const [answers, setAns]  = useState({});
  const [current, setCur]  = useState(0);
  const [error, setError]  = useState('');
  const [showExpl, setExpl] = useState({});
  function setF(k,v) { setForm(f=>({...f,[k]:v})); }
  const subjects = SUBJECTS[form.level] || SUBJECTS.olevel;

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

  if (phase === 'loading') return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', flexDirection:'column', gap:16, padding:24 }}>
      <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.5, ease:'linear' }}
        style={{ width:60, height:60, borderRadius:'50%', border:`3px solid ${p.border}`, borderTopColor:p.accent }}/>
      <p style={{ fontSize:15, color:p.muted, fontWeight:600 }}>Generating {form.count} questions for {form.subject}…</p>
      <p style={{ fontSize:12.5, color:p.dim }}>ZIMSEC/Cambridge style · {form.difficulty} difficulty</p>
    </div>
  );

  if (phase === 'result') {
    const grade = pct>=80?'A':pct>=60?'B':pct>=50?'C':pct>=40?'D':'F';
    const gc = { A:'#10b981',B:'#3b82f6',C:'#f59e0b',D:'#f97316',F:'#ef4444' }[grade];
    return (
      <div style={{ padding:isMobile?'16px 14px':'26px 30px', maxWidth:700, margin:'0 auto', overflowY:'auto', height:'100%' }}>
        <motion.div initial={{ scale:.9, opacity:0 }} animate={{ scale:1, opacity:1 }}>
          <Card p={p} style={{ padding:isMobile?'24px 18px':'32px', textAlign:'center', marginBottom:20 }}>
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:220, delay:.15 }}
              style={{ width:88, height:88, borderRadius:'50%', border:`3px solid ${gc}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', background:`${gc}12`, boxShadow:`0 0 24px ${gc}30` }}>
              <span style={{ fontSize:40, fontWeight:900, color:gc }}>{grade}</span>
            </motion.div>
            <h2 style={{ fontSize:isMobile?24:28, fontWeight:900, color:p.text, marginBottom:6 }}>{correct} / {questions.length}</h2>
            <p style={{ fontSize:16, color:p.muted, marginBottom:3 }}>{pct}% — {pct>=70?'Excellent work! 🎉':pct>=50?'Good effort! Keep going 💪':'Keep studying, you\'ll get there! 📚'}</p>
            <p style={{ fontSize:12.5, color:p.dim }}>{form.subject} · {form.level.toUpperCase()}</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:22, flexWrap:'wrap' }}>
              <Btn onClick={() => { setPhase('setup'); setQs([]); setAns({}); }} variant="secondary" p={p}><RotateCcw size={13}/> New Exam</Btn>
              <Btn onClick={() => setPhase('quiz')} variant="primary" p={p}><BookOpen size={13}/> Review Answers</Btn>
            </div>
          </Card>
        </motion.div>
        {questions.map((q,i) => {
          const ua = answers[q.id]; const ok = ua===q.answer;
          return (
            <motion.div key={q.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.04 }}
              style={{ background: ok ? p.successBg : p.errBg, border:`1px solid ${ok ? p.successBdr : p.errBdr}`, borderRadius:12, padding:'14px 16px', marginBottom:9 }}>
              <div style={{ display:'flex', gap:10, marginBottom:6 }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background: ok ? '#10b981' : '#ef4444', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', flexShrink:0 }}>{ok?'✓':'✗'}</div>
                <p style={{ fontSize:13, color:p.text, fontWeight:600, lineHeight:1.5, margin:0 }}>{i+1}. {q.q}</p>
              </div>
              <div style={{ paddingLeft:32, fontSize:12.5, color:p.muted }}>
                {!ok && <p style={{ margin:'0 0 2px' }}>Your answer: <span style={{ color:'#ef4444', fontWeight:700 }}>{ua||'Not answered'}</span></p>}
                <p style={{ margin:'0 0 4px' }}>Correct: <span style={{ color:'#10b981', fontWeight:700 }}>{q.answer}</span></p>
                <button onClick={() => setExpl(s=>({...s,[q.id]:!s[q.id]}))} style={{ background:'none', border:'none', color:p.accent, cursor:'pointer', fontSize:12, fontWeight:600, padding:0, fontFamily:'inherit' }}>
                  {showExpl[q.id]?'▲ Hide explanation':'▼ Show explanation'}
                </button>
                {showExpl[q.id] && <p style={{ marginTop:6, color:p.muted, fontStyle:'italic', lineHeight:1.6 }}>{q.explanation}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  if (phase === 'quiz') {
    const q = questions[current]; const ua = answers[q?.id];
    const optStyle = opt => {
      const l = opt.charAt(0);
      if (!ua) return { bg:p.surface, br:p.border, col:p.text };
      if (l===q.answer) return { bg:p.successBg, br:'#86efac', col:'#166534' };
      if (l===ua && l!==q.answer) return { bg:p.errBg, br:'#fca5a5', col:'#991b1b' };
      return { bg:p.surface, br:p.border, col:p.muted };
    };
    return (
      <div style={{ padding:isMobile?'16px 14px':'24px 28px', maxWidth:680, margin:'0 auto', overflowY:'auto', height:'100%' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontSize:12.5, color:p.dim, fontWeight:600 }}>Question {current+1} of {questions.length}</span>
          <span style={{ fontSize:12.5, color:p.dim }}>{answered} answered</span>
        </div>
        <div style={{ height:4, borderRadius:99, background:p.border, marginBottom:20 }}>
          <motion.div style={{ height:'100%', borderRadius:99, background:'linear-gradient(90deg,#7c3aed,#a78bfa)' }}
            animate={{ width:`${((current+1)/questions.length)*100}%` }} transition={{ duration:.3 }}/>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:.16 }}>
            <Card p={p} style={{ padding:isMobile?'18px 16px':'24px', marginBottom:18 }}>
              <p style={{ fontSize:isMobile?15.5:16, fontWeight:700, color:p.text, lineHeight:1.6, marginBottom:20 }}>{q.q}</p>
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {q.options.map(opt => {
                  const s = optStyle(opt);
                  return (
                    <motion.button key={opt} onClick={() => answer(q.id, opt.charAt(0))} whileHover={!ua?{scale:1.01}:{}} whileTap={!ua?{scale:.99}:{}}
                      style={{ padding:'12px 15px', borderRadius:11, border:`1.5px solid ${s.br}`, background:s.bg, color:s.col, cursor:ua?'default':'pointer', fontSize:isMobile?14.5:14, fontWeight:500, textAlign:'left', fontFamily:'inherit', lineHeight:1.4, transition:'all .18s' }}>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
              {ua && (
                <motion.div initial={{ opacity:0, y:7 }} animate={{ opacity:1, y:0 }} style={{ marginTop:14, padding:'12px 14px', background:p.bg, borderRadius:10, border:`1px solid ${p.border}` }}>
                  <p style={{ fontSize:13, color:p.muted, fontStyle:'italic', margin:0 }}><span style={{ color:p.accent, fontWeight:700 }}>Explanation: </span>{q.explanation}</p>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
        <div style={{ display:'flex', justifyContent:'space-between', gap:10 }}>
          <Btn onClick={() => setCur(c=>Math.max(0,c-1))} disabled={current===0} variant="secondary" p={p}>← Prev</Btn>
          {current < questions.length-1 ? (
            <Btn onClick={() => setCur(c=>c+1)} disabled={!ua} variant="primary" p={p}>Next →</Btn>
          ) : (
            <Btn onClick={() => setPhase('result')} variant="primary" p={p} style={{ background:'linear-gradient(135deg,#10b981,#059669)', boxShadow:'0 2px 8px rgba(16,185,129,0.3)' }}>
              <Trophy size={13}/> Finish Exam
            </Btn>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:isMobile?'16px 14px':'26px 32px', maxWidth:560, overflowY:'auto', height:'100%' }}>
      <SectionHeader title="Mock Exam Generator" sub="ZIMSEC & Cambridge-style MCQ exams with instant feedback and explanations." icon={ClipboardCheck} p={p}/>
      <Card p={p} style={{ padding:isMobile?'18px 16px':'24px' }}>
        <form onSubmit={startExam} style={{ display:'flex', flexDirection:'column', gap:15 }}>
          <FG label="Level" p={p}><Sel value={form.level} onChange={v=>setF('level',v)} options={[['primary','Primary School'],['olevel','O-Level'],['alevel','A-Level']]} isMobile={isMobile} p={p}/></FG>
          <FG label="Subject *" p={p}><Sel value={form.subject} onChange={v=>setF('subject',v)} options={[['','— Select subject —'],...subjects.map(s=>[s,s])]} isMobile={isMobile} p={p}/></FG>
          <FG label="Grade / Form" p={p}><Inp value={form.grade} onChange={v=>setF('grade',v)} placeholder="e.g. Form 4" isMobile={isMobile} p={p}/></FG>
          <FG label="Topic (optional)" p={p}><Inp value={form.topic} onChange={v=>setF('topic',v)} placeholder="e.g. Photosynthesis, World War 1, Algebra…" isMobile={isMobile} p={p}/></FG>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <FG label="Questions" p={p}><Sel value={form.count} onChange={v=>setF('count',Number(v))} options={[[5,'5 Questions'],[10,'10 Questions'],[15,'15 Questions'],[20,'20 Questions']]} isMobile={isMobile} p={p}/></FG>
            <FG label="Difficulty" p={p}><Sel value={form.difficulty} onChange={v=>setF('difficulty',v)} options={[['easy','Easy'],['medium','Medium'],['hard','Hard'],['mixed','Mixed']]} isMobile={isMobile} p={p}/></FG>
          </div>
          <Err msg={error} p={p}/>
          <Btn disabled={!form.subject} variant="primary" size="lg" p={p} style={{ width:'100%' }} onClick={startExam}>
            <PlayCircle size={17}/> Start Mock Exam
          </Btn>
        </form>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MATERIALS LIBRARY
══════════════════════════════════════════════════════════════════════════ */
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

  const CAT_COLOR = { paper:'#3b82f6', textbook:'#10b981', syllabus:'#7c3aed', marking_scheme:'#f59e0b' };
  const CAT_LABEL = { paper:'Past Paper', textbook:'Textbook', syllabus:'Syllabus', marking_scheme:'Mark Scheme' };
  const LVL_LABEL = { primary:'Primary', olevel:'O-Level', alevel:'A-Level' };

  return (
    <div style={{ padding:isMobile?'14px 12px':'18px 22px', height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ marginBottom:12, flexShrink:0 }}>
        <SectionHeader title="Study Library" sub={`${total} resources — ZIMSEC & Cambridge`} icon={BookOpen} p={p}/>
        <div style={{ display:'flex', gap:9, flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:140 }}>
            <Search size={13} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:p.dim, pointerEvents:'none' }}/>
            <input value={filters.search} onChange={e=>setF('search',e.target.value)} placeholder="Search resources…"
              style={{ width:'100%', padding:'9px 12px 9px 32px', borderRadius:10, border:`1.5px solid ${p.inputBdr}`, background:p.inputBg, color:p.text, fontSize:isMobile?16:13.5, outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border .15s' }}/>
          </div>
          <Sel value={filters.level} onChange={v=>setF('level',v)} options={[['','All Levels'],['primary','Primary'],['olevel','O-Level'],['alevel','A-Level']]} isMobile={isMobile} p={p} style={{ maxWidth:140 }}/>
          <Sel value={filters.category} onChange={v=>setF('category',v)} options={[['','All Types'],['paper','Past Papers'],['textbook','Textbooks'],['syllabus','Syllabuses'],['marking_scheme','Mark Schemes']]} isMobile={isMobile} p={p} style={{ maxWidth:160 }}/>
        </div>
      </div>

      <Err msg={error} p={p}/>
      <div style={{ flex:1, overflowY:'auto' }}>
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:`repeat(auto-fill,minmax(${isMobile?'155px':'205px'},1fr))`, gap:10 }}>
            {Array.from({ length:8 }).map((_,i) => (
              <div key={i} style={{ background:p.surface, borderRadius:13, padding:16, border:`1px solid ${p.border}`, animation:'pulse 1.4s infinite' }}>
                {[70,55,40].map((w,j) => <div key={j} style={{ height:j===0?14:11, borderRadius:6, background:p.border, width:`${w}%`, marginBottom:9 }}/>)}
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <BookOpen size={44} style={{ color:p.dim, marginBottom:12 }}/>
            <p style={{ fontSize:15, fontWeight:700, color:p.muted }}>No resources found</p>
            <p style={{ fontSize:13, color:p.dim }}>Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div style={{ display:'grid', gridTemplateColumns:`repeat(auto-fill,minmax(${isMobile?'155px':'205px'},1fr))`, gap:10, marginBottom:16 }}>
              {items.map(item => (
                <motion.div key={item._id} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} whileHover={{ y:-2 }}
                  style={{ background:p.surface, border:`1px solid ${p.border}`, borderRadius:13, padding:'14px', boxShadow:p.shadow, transition:'all .16s' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
                    <Tag color={CAT_COLOR[item.category]||'#7c3aed'} p={p}>{CAT_LABEL[item.category]||item.category}</Tag>
                    {item.year && <span style={{ fontSize:10, color:p.dim, fontWeight:600 }}>{item.year}</span>}
                  </div>
                  <h4 style={{ fontSize:13, fontWeight:700, color:p.text, marginBottom:8, lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{item.title}</h4>
                  <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:12 }}>
                    {[LVL_LABEL[item.level]||item.level, item.subject].filter(Boolean).map(tag => <Tag key={tag} p={p}>{tag}</Tag>)}
                  </div>
                  {canDL ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5, padding:'8px', background:p.accentBg, border:`1.5px solid ${p.accentBorder}`, color:p.accent, borderRadius:9, fontSize:12.5, fontWeight:700, textDecoration:'none', transition:'all .15s' }}>
                      <Download size={12}/> Download
                    </a>
                  ) : (
                    <a href="https://wa.me/263719647303?text=upgrade" target="_blank" rel="noopener noreferrer"
                      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5, padding:'8px', background:'linear-gradient(135deg,#f59e0b,#fbbf24)', color:'#fff', borderRadius:9, fontSize:12.5, fontWeight:700, textDecoration:'none' }}>
                      <Crown size={12}/> Upgrade
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
            {pages > 1 && (
              <div style={{ display:'flex', justifyContent:'center', gap:10, paddingBottom:16 }}>
                <Btn onClick={() => setPage(pp=>Math.max(1,pp-1))} disabled={page===1} variant="secondary" size="sm" p={p}>← Prev</Btn>
                <span style={{ padding:'7px 10px', fontSize:13, color:p.dim, fontWeight:600 }}>{page} / {pages}</span>
                <Btn onClick={() => setPage(pp=>Math.min(pages,pp+1))} disabled={page===pages} variant="secondary" size="sm" p={p}>Next →</Btn>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PROFILE
══════════════════════════════════════════════════════════════════════════ */
function ProfileTab({ profile, usage, limits, isMobile, p }) {
  const plan = profile?.plan || 'FREE';
  const pc = PLAN_COLOR[plan] || '#6b7280';
  const PIcon = PLAN_ICONS[plan] || Zap;
  const PLAN_PERKS = {
    FREE:    ['25 AI chats/day','3 image generations/day','1 note/project/day','Read-only library access'],
    STARTER: ['75 AI chats/month','8 image generations/month','3 notes/projects/month','PDF download','Full library access'],
    BASIC:   ['300 AI chats/month','20 image generations/month','10 notes/projects/month','PDF download','Full library access'],
    PRO:     ['1,000 AI chats/month','50 image generations/month','50 notes/projects/month','PDF download','Priority AI responses'],
    PREMIUM: ['Unlimited everything','All features unlocked','Priority support','Early access to new features'],
  };

  return (
    <div style={{ padding:isMobile?'16px 14px':'26px 32px', maxWidth:680, margin:'0 auto', overflowY:'auto', height:'100%' }}>
      <SectionHeader title="My Profile" sub="Manage your account and track daily usage." icon={User} p={p}/>

      <Card p={p} style={{ padding:isMobile?'20px 16px':'24px', marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
          <div style={{ width:62, height:62, borderRadius:18, background:`linear-gradient(135deg,${pc},${pc}99)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:900, color:'#fff', boxShadow:`0 4px 16px ${pc}40`, flexShrink:0 }}>
            {(profile?.name||'S')[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize:isMobile?19:21, fontWeight:900, color:p.text, marginBottom:6 }}>{profile?.name||'Student'}</h2>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              <PlanBadge plan={plan} p={p}/>
              {profile?.grade && <span style={{ fontSize:12, color:p.muted }}>{profile.levelLabel} · {profile.grade}</span>}
            </div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr 1fr':'repeat(3,1fr)', gap:10 }}>
          {[
            { label:'Phone',  val: profile?.phone ? `+${profile.phone}` : '—' },
            { label:'School', val: profile?.school || '—' },
            { label:'Level',  val: profile?.levelLabel || '—' },
          ].map(({ label, val }) => (
            <div key={label} style={{ background:p.bg, border:`1px solid ${p.border}`, borderRadius:11, padding:'12px 14px' }}>
              <div style={{ fontSize:10, color:p.dim, textTransform:'uppercase', letterSpacing:'.5px', fontWeight:700, marginBottom:4 }}>{label}</div>
              <div style={{ fontSize:13, fontWeight:700, color:p.text, wordBreak:'break-all' }}>{val}</div>
            </div>
          ))}
        </div>
      </Card>

      {usage && limits && (
        <Card p={p} style={{ padding:isMobile?'18px 16px':'22px', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <h3 style={{ fontSize:14.5, fontWeight:800, color:p.text, marginBottom:2 }}>{limits?.period==='monthly' ? 'Monthly' : "Today's"} Usage</h3>
              <p style={{ fontSize:11.5, color:p.dim }}>Shared across WhatsApp + Web · Resets {limits?.period==='monthly' ? 'monthly' : 'at midnight'}</p>
            </div>
            <BarChart3 size={18} style={{ color:p.accent }}/>
          </div>
          <UsageBar label="AI Chats" used={limits?.period==='monthly'?(usage.chatMonth||0):(usage.chatToday||0)}   limit={limits.chat||25}  icon={MessageSquare} p={p}/>
          <UsageBar label="Images"   used={limits?.period==='monthly'?(usage.imagesMonth||0):(usage.imagesToday||0)} limit={limits.images||3}  icon={Image} p={p}/>
          <UsageBar label="Notes & Projects" used={limits?.period==='monthly'?(usage.pdfMonth||0):(usage.pdfToday||0)} limit={limits.pdf||1} icon={FileText} p={p}/>
          <div style={{ marginTop:12, padding:'10px 13px', background:p.accentBg, border:`1px solid ${p.accentBorder}`, borderRadius:10, fontSize:12, color:p.muted }}>
            📱 WhatsApp + web usage is shared — a chat sent on WhatsApp reduces your web quota too.
          </div>
        </Card>
      )}

      <Card p={p} style={{ padding:isMobile?'18px 16px':'22px', marginBottom:16 }}>
        <h3 style={{ fontSize:14.5, fontWeight:800, color:p.text, marginBottom:4 }}>Your Plan — <span style={{ color:pc }}>{plan}</span></h3>
        <p style={{ fontSize:12.5, color:p.muted, marginBottom:14 }}>What's included in your current plan:</p>
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          {(PLAN_PERKS[plan]||PLAN_PERKS.FREE).map(perk => (
            <div key={perk} style={{ display:'flex', alignItems:'center', gap:9 }}>
              <div style={{ width:18, height:18, borderRadius:'50%', background:`${pc}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Check size={11} style={{ color:pc }}/>
              </div>
              <span style={{ fontSize:13, color:p.text }}>{perk}</span>
            </div>
          ))}
        </div>
      </Card>

      {plan !== 'PREMIUM' && (
        <div style={{ borderRadius:16, padding:isMobile?'18px 16px':'22px', background:'linear-gradient(135deg,#7c3aed,#5b21b6)', color:'#fff' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <Crown size={20}/>
            <h3 style={{ fontSize:16, fontWeight:900 }}>Upgrade your plan</h3>
          </div>
          <p style={{ fontSize:13.5, opacity:.88, lineHeight:1.65, marginBottom:16 }}>Get more chats, image generation, PDF downloads, and project reports. Starting from $1/month.</p>
          <a href="https://wa.me/263719647303?text=upgrade" target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 22px', background:'#fff', color:'#7c3aed', textDecoration:'none', borderRadius:11, fontWeight:800, fontSize:14, boxShadow:'0 4px 14px rgba(0,0,0,0.2)' }}>
            Upgrade on WhatsApp <ArrowUpRight size={14}/>
          </a>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════════════════════════ */
function SidebarContent({ profile, usage, limits, tab, setTab, signOut, plan, onRefresh, p, isDark, onToggleTheme }) {
  const pc = PLAN_COLOR[plan] || '#6b7280';
  const PIcon = PLAN_ICONS[plan] || Zap;
  return (
    <>
      <div style={{ padding:'16px 14px 12px', borderBottom:`1px solid ${p.sidebarBdr}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#7c3aed,#a78bfa)', overflow:'hidden', flexShrink:0, boxShadow:'0 2px 10px rgba(124,58,237,0.3)' }}>
            <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:900, color:p.text, letterSpacing:'-.3px' }}>Fundo<span style={{ color:p.accent }}>AI</span></div>
            <div style={{ fontSize:10.5, color:p.dim }}>Student Portal</div>
          </div>
          <motion.button onClick={onToggleTheme} whileTap={{ scale:.85 }}
            style={{ width:28, height:28, borderRadius:8, background:p.bg, border:`1px solid ${p.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
            {isDark ? <Sun size={12} style={{ color:p.accent }}/> : <Moon size={12} style={{ color:p.muted }}/>}
          </motion.button>
        </div>
      </div>

      <div style={{ padding:'10px 10px 8px', borderBottom:`1px solid ${p.sidebarBdr}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', background:p.bg, borderRadius:11, border:`1px solid ${p.border}` }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${pc},${pc}80)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#fff', flexShrink:0, boxShadow:`0 2px 8px ${pc}40` }}>
            {(profile?.name||'S')[0].toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:p.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{profile?.name||'Student'}</div>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              <PIcon size={9} style={{ color:pc }}/>
              <span style={{ fontSize:10.5, fontWeight:700, color:pc }}>{plan}</span>
              {profile?.grade && <span style={{ fontSize:10, color:p.dim }}>· {profile.grade}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:'8px 8px', flex:1, overflowY:'auto' }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:9, padding:'9px 12px', borderRadius:10, border:'none', cursor:'pointer', marginBottom:1, fontSize:13.5, fontWeight:active?700:500, textAlign:'left', fontFamily:'inherit', transition:'all .14s',
                background: active ? p.accentBg : 'transparent', color: active ? p.accent : p.muted,
                borderLeft: active ? `3px solid ${p.accent}` : '3px solid transparent' }}>
              <t.icon size={15} style={{ color:active?p.accent:p.dim, flexShrink:0 }}/>
              {t.label}
            </button>
          );
        })}
      </div>

      {usage && limits && (
        <div style={{ margin:'0 8px 8px', padding:'12px', background:p.bg, border:`1px solid ${p.border}`, borderRadius:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <span style={{ fontSize:10.5, fontWeight:700, color:p.dim, textTransform:'uppercase', letterSpacing:'.5px' }}>{limits?.period==='monthly'?'Monthly':'Daily'} Usage</span>
            <button onClick={onRefresh} style={{ background:'none', border:'none', cursor:'pointer', color:p.dim, display:'flex', padding:0 }}><RefreshCw size={11}/></button>
          </div>
          <UsageBar label="Chats"  used={limits?.period==='monthly'?(usage.chatMonth||0):(usage.chatToday||0)}   limit={limits.chat||25} icon={MessageSquare} p={p}/>
          <UsageBar label="Images" used={limits?.period==='monthly'?(usage.imagesMonth||0):(usage.imagesToday||0)} limit={limits.images||3} icon={Image} p={p}/>
          <UsageBar label="Notes"  used={limits?.period==='monthly'?(usage.pdfMonth||0):(usage.pdfToday||0)}    limit={limits.pdf||1}    icon={FileText} p={p}/>
        </div>
      )}

      {plan === 'FREE' && (
        <div style={{ margin:'0 8px 8px' }}>
          <a href="https://wa.me/263719647303?text=upgrade" target="_blank" rel="noopener noreferrer"
            style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 13px', background:'linear-gradient(135deg,#7c3aed,#5b21b6)', color:'#fff', borderRadius:11, textDecoration:'none', fontSize:13, fontWeight:700, boxShadow:'0 2px 10px rgba(124,58,237,0.3)' }}>
            <Crown size={12}/> Upgrade Plan <ArrowUpRight size={11} style={{ marginLeft:'auto' }}/>
          </a>
        </div>
      )}

      <div style={{ padding:'4px 8px 14px' }}>
        <button onClick={signOut}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:9, border:'none', cursor:'pointer', fontSize:12.5, color:p.muted, background:'transparent', fontFamily:'inherit', transition:'all .15s' }}
          onMouseEnter={e => { e.currentTarget.style.background=p.errBg; e.currentTarget.style.color=p.errText; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=p.muted; }}>
          <LogOut size={13}/> Sign Out
        </button>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN SHELL
══════════════════════════════════════════════════════════════════════════ */
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
    if (!tok()) { nav('/student'); return; }
    api('/api/student/me').then(d => {
      setProfile(d); setUsage(d.usage); setLimits(d.limits);
      localStorage.setItem('fundo_user', JSON.stringify(d));
    }).catch(() => nav('/student'));
  }, [refreshKey]);

  function signOut() { localStorage.removeItem('fundo_token'); localStorage.removeItem('fundo_user'); nav('/student'); }
  function switchTab(t) { setTab(t); setSideOpen(false); }

  const plan = profile?.plan || 'FREE';

  const tabProps = { profile, plan, isMobile, p };

  return (
    <div style={{ display:'flex', height:'100dvh', fontFamily:"'Inter',system-ui,-apple-system,sans-serif", background:p.bg, overflow:'hidden' }}>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {isMobile && sideOpen && (
          <>
            <motion.div key="overlay" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setSideOpen(false)}
              style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:40, backdropFilter:'blur(2px)' }}/>
            <motion.div key="sidebar" initial={{ x:-270 }} animate={{ x:0 }} exit={{ x:-270 }} transition={{ type:'spring', stiffness:320, damping:32 }}
              style={{ position:'fixed', top:0, left:0, bottom:0, width:262, zIndex:50, display:'flex', flexDirection:'column', background:p.sidebar, borderRight:`1px solid ${p.sidebarBdr}`, boxShadow:'4px 0 24px rgba(0,0,0,0.12)' }}>
              <SidebarContent profile={profile} usage={usage} limits={limits} tab={tab} setTab={switchTab} signOut={signOut} plan={plan} onRefresh={() => setRefreshKey(k=>k+1)} p={p} isDark={isDark} onToggleTheme={toggle}/>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      {!isMobile && (
        <div style={{ width:250, flexShrink:0, display:'flex', flexDirection:'column', background:p.sidebar, borderRight:`1px solid ${p.sidebarBdr}`, boxShadow:p.shadow }}>
          <SidebarContent profile={profile} usage={usage} limits={limits} tab={tab} setTab={switchTab} signOut={signOut} plan={plan} onRefresh={() => setRefreshKey(k=>k+1)} p={p} isDark={isDark} onToggleTheme={toggle}/>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:p.pageBg }}>
        {/* Top bar */}
        <div style={{ height:52, display:'flex', alignItems:'center', padding:isMobile?'0 14px':'0 20px', gap:10, borderBottom:`1px solid ${p.border}`, background:p.topbar, backdropFilter:'blur(12px)', flexShrink:0, boxShadow:p.shadow }}>
          {isMobile && (
            <motion.button onClick={() => setSideOpen(s=>!s)} whileTap={{ scale:.9 }}
              style={{ width:34, height:34, borderRadius:9, background:p.surface, border:`1px solid ${p.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, boxShadow:p.shadow }}>
              <Menu size={16} style={{ color:p.muted }}/>
            </motion.button>
          )}
          <span style={{ fontSize:15, fontWeight:800, color:p.text }}>{TABS.find(t=>t.id===tab)?.label || ''}</span>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
            {isMobile && (
              <motion.button onClick={toggle} whileTap={{ scale:.88 }}
                style={{ width:30, height:30, borderRadius:8, background:p.surface, border:`1px solid ${p.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                {isDark ? <Sun size={13} style={{ color:p.accent }}/> : <Moon size={13} style={{ color:p.muted }}/>}
              </motion.button>
            )}
            {!isMobile && profile?.school && <span style={{ fontSize:12, color:p.dim, maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{profile.school}</span>}
            <PlanBadge plan={plan} p={p}/>
          </div>
        </div>

        {/* Tab area */}
        <div style={{ flex:1, overflow:'hidden', paddingBottom:isMobile?62:0 }}>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:.12 }}
              style={{ height:'100%', overflow: ['chat','exam'].includes(tab) ? 'hidden' : 'auto' }}>
              {tab==='chat'      && <ChatTab {...tabProps}/>}
              {tab==='image'     && <ImageTab {...tabProps}/>}
              {tab==='notes'     && <NotesTab {...tabProps}/>}
              {tab==='project'   && <ProjectTab {...tabProps}/>}
              {tab==='exam'      && <ExamTab {...tabProps}/>}
              {tab==='materials' && <MaterialsTab {...tabProps}/>}
              {tab==='profile'   && <ProfileTab {...tabProps} usage={usage} limits={limits}/>}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile bottom nav */}
        {isMobile && (
          <div style={{ position:'fixed', bottom:0, left:0, right:0, height:62, display:'flex', alignItems:'stretch', background:p.bottomNav, backdropFilter:'blur(16px)', borderTop:`1px solid ${p.border}`, zIndex:30, boxShadow:'0 -2px 12px rgba(0,0,0,0.06)', paddingBottom:'env(safe-area-inset-bottom)' }}>
            {TABS.map(t => {
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, border:'none', background:'transparent', cursor:'pointer', fontFamily:'inherit', position:'relative' }}>
                  {active && (
                    <motion.div layoutId="bottomNavIndicator"
                      style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:28, height:2.5, borderRadius:99, background:'#7c3aed', boxShadow:'0 0 8px rgba(124,58,237,0.5)' }}/>
                  )}
                  <t.icon size={19} style={{ color:active?p.accent:p.dim, transition:'color .14s' }}/>
                  <span style={{ fontSize:9, fontWeight:active?700:500, color:active?p.accent:p.dim, letterSpacing:'.2px' }}>{t.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.45} }
        body               { -webkit-font-smoothing: antialiased; }
        .md-body p         { margin: 0 0 10px; }
        .md-body h1        { font-size:1.3em; font-weight:900; margin:18px 0 8px; color:${p.text}; }
        .md-body h2        { font-size:1.15em; font-weight:800; margin:14px 0 7px; color:${p.accent}; }
        .md-body h3        { font-size:1.02em; font-weight:700; margin:11px 0 5px; color:${p.text}; }
        .md-body ul,.md-body ol { padding-left:20px; margin:7px 0 10px; }
        .md-body li        { margin-bottom:4px; }
        .md-body strong    { font-weight:700; }
        .md-body em        { color:${p.accent}; font-style:italic; }
        .md-body code      { background:${p.accentBg}; color:${p.accent}; padding:2px 6px; border-radius:5px; font-size:.86em; font-family:monospace; border:1px solid ${p.accentBorder}; }
        .md-body pre       { background:${p.bg}; border:1px solid ${p.border}; padding:14px; border-radius:10px; overflow-x:auto; margin:10px 0; }
        .md-body pre code  { background:none; padding:0; border:none; }
        .md-body table     { border-collapse:collapse; width:100%; margin:10px 0; font-size:13px; }
        .md-body th,.md-body td { border:1px solid ${p.border}; padding:8px 11px; }
        .md-body th        { background:${p.accentBg}; font-weight:700; color:${p.accent}; }
        .md-body blockquote { border-left:3px solid ${p.accent}; padding-left:14px; margin:10px 0; color:${p.muted}; font-style:italic; }
        .md-body hr        { border:none; border-top:1px solid ${p.border}; margin:14px 0; }
        input::placeholder,textarea::placeholder { color:${p.dim}; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${p.scrollThumb}; border-radius:99px; }
        select option { background:${p.surface}; color:${p.text}; }
        input:-webkit-autofill { -webkit-box-shadow:0 0 0 1000px ${p.inputBg} inset !important; -webkit-text-fill-color:${p.text} !important; }
      `}</style>
    </div>
  );
}
