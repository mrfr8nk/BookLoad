import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Image, FileText, BookOpen, ClipboardCheck, User,
  Send, Plus, LogOut, Sparkles, Download, Search, Loader,
  Zap, Crown, ArrowUpRight, AlertCircle, RefreshCw, Copy, Check,
  ChevronRight, Brain, Trophy, Target, RotateCcw, PlayCircle,
  Smartphone, School, GraduationCap, Star, BarChart3, Flame,
  Menu, X, Moon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const BG = 'linear-gradient(135deg, #0c0521 0%, #150b35 40%, #0a1830 100%)';

const glass = (extra = {}) => ({
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.1)',
  ...extra,
});

const glassActive = (extra = {}) => ({
  background: 'rgba(124,58,237,0.2)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(124,58,237,0.45)',
  boxShadow: '0 0 20px rgba(124,58,237,0.25)',
  ...extra,
});

const T = {
  hi:   '#f0e9ff',
  mid:  'rgba(240,233,255,0.65)',
  lo:   'rgba(240,233,255,0.38)',
  pur:  '#a78bfa',
  purDk:'#7c3aed',
  glow: 'rgba(124,58,237,0.4)',
};

const PLAN_COLOR = { FREE: '#6b7280', STARTER: '#3b82f6', BASIC: '#10b981', PRO: '#a78bfa', PREMIUM: '#f59e0b' };

const SUBJECTS = {
  primary: ['Mathematics','English','Shona','Ndebele','Science','Social Studies'],
  olevel:  ['Mathematics','English Language','Biology','Chemistry','Physics','Combined Science','History','Geography','Commerce','Accounting','Computer Science','Agriculture','Food & Nutrition'],
  alevel:  ['Mathematics','Pure Mathematics','Further Mathematics','Physics','Chemistry','Biology','History','Geography','Economics','Business Studies','Accounting','Computer Science'],
};

function token() { return localStorage.getItem('fundo_token') || ''; }
async function api(path, opts = {}) {
  const r = await fetch(path, {
    ...opts,
    headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json', ...(opts.headers || {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Request failed');
  return d;
}

/* ─── Usage bar ──────────────────────────────────────────────────────────────── */
function UsageBar({ label, used, limit, icon: Icon }) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isNear = pct >= 80;
  const barColor = isNear ? '#ef4444' : '#7c3aed';
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {Icon && <Icon size={11} style={{ color: T.lo }} />}
          <span style={{ fontSize: 11.5, color: T.lo, fontWeight: 600 }}>{label}</span>
        </div>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: isNear ? '#fca5a5' : T.mid }}>
          {used} / {limit >= 9999 ? '∞' : limit}
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.08)' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: .8, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${barColor}, ${isNear ? '#f87171' : '#a78bfa'})`,
            boxShadow: pct > 0 ? `0 0 8px ${barColor}80` : 'none' }} />
      </div>
    </div>
  );
}

/* ─── Tab definitions ────────────────────────────────────────────────────────── */
const TABS = [
  { id: 'chat',      icon: MessageSquare,  label: 'AI Chat'       },
  { id: 'image',     icon: Image,          label: 'Image Creator' },
  { id: 'notes',     icon: FileText,       label: 'Study Notes'   },
  { id: 'exam',      icon: ClipboardCheck, label: 'Mock Exam'     },
  { id: 'materials', icon: BookOpen,       label: 'Materials'     },
  { id: 'profile',   icon: User,           label: 'My Profile'    },
];

/* ══════════════════════════════════════════════════════════════════════════════
   AI CHAT TAB
══════════════════════════════════════════════════════════════════════════════ */
function ChatTab({ profile }) {
  const [sessions, setSessions]     = useState([{ id: 1, title: 'New Chat', messages: [] }]);
  const [active, setActive]         = useState(1);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const bottomRef = useRef();
  const session = sessions.find(s => s.id === active) || sessions[0];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [session?.messages, loading]);

  function newChat() {
    const id = Date.now();
    setSessions(s => [...s, { id, title: 'New Chat', messages: [] }]);
    setActive(id);
    setError('');
  }

  async function send() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput(''); setError('');
    const userMsg = { role: 'user', content: msg };
    setSessions(s => s.map(sess => sess.id === active
      ? { ...sess, messages: [...sess.messages, userMsg], title: sess.messages.length === 0 ? msg.slice(0, 38) : sess.title }
      : sess));
    setLoading(true);
    try {
      const history = session.messages.slice(-10);
      const d = await api('/api/student/chat', { method: 'POST', body: { message: msg, history } });
      setSessions(s => s.map(sess => sess.id === active
        ? { ...sess, messages: [...sess.messages, userMsg, { role: 'assistant', content: d.reply }] }
        : sess));
    } catch (e) {
      setError(e.message);
      setSessions(s => s.map(sess => sess.id === active ? { ...sess, messages: [...sess.messages, userMsg] } : sess));
    } finally { setLoading(false); }
  }

  const STARTERS = [
    'Explain surds and indices for O-Level Maths',
    'Photosynthesis step by step (Form 3 Biology)',
    'How do I write a strong essay introduction?',
    'Explain atomic structure for A-Level Chemistry',
    'Key causes of World War 1 (Zimbabwe History)',
    'Solve quadratic equations by completing the square',
  ];

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Session list */}
      <div style={{ width: 210, borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', padding: '12px 8px', gap: 4, flexShrink: 0 }}>
        <button onClick={newChat} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10, border: '1px dashed rgba(167,139,250,0.4)', background: 'transparent', cursor: 'pointer', fontSize: 12.5, fontWeight: 700, color: T.pur, marginBottom: 8, transition: 'all .18s', width: '100%' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <Plus size={14} /> New Chat
        </button>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {sessions.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)} style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 9, border: 'none', cursor: 'pointer', marginBottom: 2, fontSize: 12, fontWeight: active === s.id ? 700 : 500, transition: 'all .15s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              background: active === s.id ? 'rgba(124,58,237,0.2)' : 'transparent', color: active === s.id ? T.pur : T.lo }}>
              <MessageSquare size={12} style={{ marginRight: 6 }} />{s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {session.messages.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                style={{ width: 70, height: 70, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 0 40px rgba(124,58,237,0.5)', overflow: 'hidden' }}>
                <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
              </motion.div>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: T.hi, marginBottom: 8 }}>
                Hi {profile?.name?.split(' ')[0] || 'there'}!
              </h3>
              <p style={{ fontSize: 14, color: T.mid, lineHeight: 1.7, maxWidth: 400, marginBottom: 32 }}>
                Ask me anything — maths, sciences, history, essays — I'm tuned for ZIMSEC and Cambridge.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxWidth: 540 }}>
                {STARTERS.map(s => (
                  <motion.button key={s} onClick={() => setInput(s)} whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
                    style={{ padding: '11px 14px', borderRadius: 12, ...glass(), cursor: 'pointer', fontSize: 12.5, color: T.mid, textAlign: 'left', lineHeight: 1.5, fontFamily: 'inherit', transition: 'all .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.2)'; e.currentTarget.style.color = T.pur; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = T.mid; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {session.messages.map((m, i) => <ChatBubble key={i} msg={m} />)}
              {loading && <TypingIndicator />}
              {error && <ErrorRow msg={error} />}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input bar */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', ...glass(), borderRadius: 14, padding: '10px 14px', transition: 'border .18s', border: '1px solid rgba(255,255,255,0.12)' }}>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask anything — Shift+Enter for new line…"
              rows={1} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: T.hi, resize: 'none', maxHeight: 120, fontFamily: 'inherit', lineHeight: 1.6 }}
              onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }} />
            <motion.button onClick={send} disabled={!input.trim() || loading} whileTap={{ scale: .92 }}
              style={{ width: 38, height: 38, borderRadius: 10, border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s',
                background: input.trim() && !loading ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : 'rgba(255,255,255,0.08)',
                boxShadow: input.trim() && !loading ? '0 0 14px rgba(124,58,237,0.4)' : 'none' }}>
              <Send size={15} style={{ color: '#fff' }} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user';
  const [copied, setCopied] = useState(false);
  function copy() { navigator.clipboard.writeText(msg.content).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }}
      style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 18, gap: 10 }}>
      {!isUser && (
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', flexShrink: 0, marginTop: 4, overflow: 'hidden', boxShadow: '0 0 12px rgba(124,58,237,0.4)' }}>
          <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
        </div>
      )}
      <div style={{ maxWidth: '76%' }}>
        <div style={{ padding: isUser ? '10px 16px' : '14px 18px', borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px', fontSize: 14, lineHeight: 1.7,
          background: isUser ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : 'rgba(255,255,255,0.07)',
          border: isUser ? 'none' : '1px solid rgba(255,255,255,0.1)',
          color: T.hi, boxShadow: isUser ? '0 4px 16px rgba(124,58,237,0.3)' : '0 2px 8px rgba(0,0,0,0.2)' }}>
          {isUser ? <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
            : <div className="md-body"><ReactMarkdown>{msg.content}</ReactMarkdown></div>}
        </div>
        {!isUser && (
          <button onClick={copy} style={{ marginTop: 5, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: T.lo, display: 'flex', alignItems: 'center', gap: 4, padding: '3px 6px' }}>
            {copied ? <><Check size={10} style={{ color: '#4ade80' }} /> Copied</> : <><Copy size={10} /> Copy</>}
          </button>
        )}
      </div>
      {isUser && <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4, fontSize: 12, fontWeight: 700, color: T.pur }}>
        U
      </div>}
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', overflow: 'hidden', boxShadow: '0 0 12px rgba(124,58,237,0.4)' }}>
        <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
      </div>
      <div style={{ ...glass(), padding: '12px 18px', borderRadius: '4px 18px 18px 18px', display: 'flex', gap: 5 }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: T.pur }}
            animate={{ y: [0, -7, 0], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: .9, delay: i * .18 }} />
        ))}
      </div>
    </motion.div>
  );
}

function ErrorRow({ msg }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, fontSize: 13, color: '#fca5a5', marginBottom: 12 }}>
      <AlertCircle size={14} style={{ flexShrink: 0 }} /> {msg}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   IMAGE CREATOR TAB
══════════════════════════════════════════════════════════════════════════════ */
function ImageTab() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [style, setStyle] = useState('ultra realistic');

  const STYLES = ['Ultra Realistic', 'Digital Art', 'Anime Style', '3D Render', 'Watercolor', 'Pencil Sketch', 'Cinematic'];
  const EXAMPLES = [
    'Diagram of the water cycle with labels',
    'Human heart anatomy cross-section',
    'A student studying under a mango tree',
    'Atom model with electron shells',
    'Map of Zimbabwe showing major cities',
    'Photosynthesis process diagram',
  ];

  async function generate() {
    if (!prompt.trim() || loading) return;
    setError(''); setLoading(true); setResult(null);
    try {
      const d = await api(`/api/student/generate-image?prompt=${encodeURIComponent(prompt + ', ' + style)}`);
      setResult(d);
      setHistory(h => [{ prompt, imageUrl: d.imageUrl, style }, ...h.slice(0, 7)]);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: T.hi, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image size={22} style={{ color: T.pur }} /> AI Image Creator
        </h2>
        <p style={{ fontSize: 14, color: T.mid }}>Generate diagrams, illustrations, and concept visuals for your studies.</p>
      </div>

      {/* Style selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {STYLES.map(s => (
          <button key={s} onClick={() => setStyle(s.toLowerCase())}
            style={{ padding: '6px 14px', borderRadius: 99, border: `1px solid ${style === s.toLowerCase() ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.1)'}`, background: style === s.toLowerCase() ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)', color: style === s.toLowerCase() ? T.pur : T.lo, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', transition: 'all .15s',
              boxShadow: style === s.toLowerCase() ? '0 0 10px rgba(124,58,237,0.2)' : 'none' }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder="Describe what you want to create…"
          style={{ flex: 1, padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', fontSize: 14, color: T.hi, outline: 'none', fontFamily: 'inherit' }}
          onFocus={e => e.target.style.borderColor = 'rgba(167,139,250,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
        <motion.button onClick={generate} disabled={!prompt.trim() || loading} whileTap={{ scale: .95 }}
          style={{ padding: '12px 22px', background: prompt.trim() && !loading ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: prompt.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, transition: 'all .18s',
            boxShadow: prompt.trim() && !loading ? '0 4px 16px rgba(124,58,237,0.4)' : 'none' }}>
          {loading ? <Loader size={15} style={{ animation: 'spin .7s linear infinite' }} /> : <Sparkles size={15} />}
          {loading ? 'Generating…' : 'Generate'}
        </motion.button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 24 }}>
        {EXAMPLES.map(ex => (
          <button key={ex} onClick={() => setPrompt(ex)} style={{ padding: '5px 12px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: T.lo, fontSize: 12, cursor: 'pointer', transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.color = T.pur; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = T.lo; }}>
            {ex}
          </button>
        ))}
      </div>

      {error && <ErrorRow msg={error} />}

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid rgba(124,58,237,0.2)', borderTopColor: T.pur, margin: '0 auto 16px' }} />
          <p style={{ fontSize: 15, color: T.mid }}>Creating your image with AI…</p>
          <p style={{ fontSize: 12.5, color: T.lo, marginTop: 6 }}>Usually takes 10–20 seconds</p>
        </div>
      )}

      {result && !loading && (
        <motion.div initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} style={{ marginBottom: 28, borderRadius: 16, overflow: 'hidden', ...glass(), boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
          <img src={result.imageUrl} alt={prompt} style={{ width: '100%', maxHeight: 500, objectFit: 'contain', background: '#000', display: 'block' }} />
          <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: T.mid, flex: 1, marginRight: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prompt}</span>
            <a href={result.imageUrl} download target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.35)', color: T.pur, borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              <Download size={13} /> Download
            </a>
          </div>
        </motion.div>
      )}

      {history.length > 0 && (
        <div>
          <p style={{ fontSize: 12, color: T.lo, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 }}>Recent Images</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10 }}>
            {history.map((h, i) => (
              <motion.div key={i} whileHover={{ scale: 1.03 }} onClick={() => { setResult(h); setPrompt(h.prompt); }}
                style={{ borderRadius: 10, overflow: 'hidden', ...glass(), cursor: 'pointer' }}>
                <img src={h.imageUrl} alt="" style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '6px 8px', fontSize: 11, color: T.lo, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.prompt}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   STUDY NOTES TAB
══════════════════════════════════════════════════════════════════════════════ */
function NotesTab({ profile }) {
  const [form, setForm] = useState({ topic: '', subject: '', level: profile?.levelType || 'olevel', grade: profile?.grade || '' });
  const [loading, setLoading] = useState(false);
  const [notes, setNotes]     = useState('');
  const [error, setError]     = useState('');
  const [copied, setCopied]   = useState(false);
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function generate(e) {
    e.preventDefault();
    if (!form.topic.trim() || loading) return;
    setError(''); setLoading(true); setNotes('');
    try { const d = await api('/api/student/generate-notes', { method: 'POST', body: form }); setNotes(d.notes); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  function copy() { navigator.clipboard.writeText(notes).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2200); }
  function download() {
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([notes], { type: 'text/plain' })), download: `${form.topic || 'notes'}.txt` });
    a.click();
  }

  const subjects = SUBJECTS[form.level] || SUBJECTS.olevel;

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: T.hi, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={22} style={{ color: T.pur }} /> AI Study Notes
        </h2>
        <p style={{ fontSize: 14, color: T.mid }}>Comprehensive, curriculum-aligned notes on any topic — instantly generated.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: notes ? '300px 1fr' : '1fr', gap: 20 }}>
        <form onSubmit={generate} style={{ ...glass(), borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="Topic *">
            <input value={form.topic} onChange={e => set('topic', e.target.value)} placeholder="e.g. Photosynthesis, Quadratic Equations…" required
              style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(167,139,250,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          </FormField>
          <FormField label="Level">
            <GlassSelect value={form.level} onChange={v => set('level', v)} options={[['primary','Primary School'],['olevel','O-Level'],['alevel','A-Level']]} />
          </FormField>
          <FormField label="Subject">
            <GlassSelect value={form.subject} onChange={v => set('subject', v)} options={[['','— Select subject —'], ...subjects.map(s => [s, s])]} />
          </FormField>
          <FormField label="Grade / Form">
            <input value={form.grade} onChange={e => set('grade', e.target.value)} placeholder="e.g. Form 4, Grade 7"
              style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(167,139,250,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          </FormField>
          {error && <ErrorRow msg={error} />}
          <motion.button type="submit" disabled={!form.topic.trim() || loading} whileTap={{ scale: .97 }}
            style={{ padding: '12px', background: form.topic.trim() && !loading ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14.5, fontWeight: 700, cursor: form.topic.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: form.topic.trim() && !loading ? '0 4px 16px rgba(124,58,237,0.4)' : 'none' }}>
            {loading ? <><Loader size={14} style={{ animation: 'spin .7s linear infinite' }} /> Generating…</> : <><Sparkles size={14} /> Generate Notes</>}
          </motion.button>
        </form>

        {(loading || notes) && (
          <div style={{ ...glass(), borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: T.hi }}>{form.topic || 'Study Notes'}</span>
              {notes && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <GlassIconBtn onClick={copy} icon={copied ? Check : Copy} label={copied ? 'Copied!' : 'Copy'} />
                  <GlassIconBtn onClick={download} icon={Download} label="Download" />
                </div>
              )}
            </div>
            <div style={{ padding: '20px 24px', maxHeight: 560, overflowY: 'auto' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
                    style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(124,58,237,0.2)', borderTopColor: T.pur, margin: '0 auto 14px' }} />
                  <p style={{ fontSize: 14, color: T.mid }}>Generating your notes…</p>
                </div>
              ) : <div className="md-body" style={{ fontSize: 13.5, lineHeight: 1.8 }}><ReactMarkdown>{notes}</ReactMarkdown></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MOCK EXAM TAB
══════════════════════════════════════════════════════════════════════════════ */
function ExamTab({ profile }) {
  const [phase, setPhase] = useState('setup'); // setup | loading | quiz | result
  const [form, setForm]   = useState({ subject: '', level: profile?.levelType || 'olevel', grade: profile?.grade || '', topic: '', count: 10, difficulty: 'medium' });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers]     = useState({});
  const [current, setCurrent]     = useState(0);
  const [error, setError]         = useState('');
  const [showExpl, setShowExpl]   = useState({});
  function setF(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function startExam(e) {
    e.preventDefault();
    if (!form.subject) return setError('Please select a subject');
    setError(''); setPhase('loading');
    try {
      const d = await api('/api/student/generate-mock-exam', { method: 'POST', body: form });
      setQuestions(d.questions || []);
      setAnswers({}); setCurrent(0); setShowExpl({});
      setPhase('quiz');
    } catch (e) { setError(e.message); setPhase('setup'); }
  }

  function answer(qId, letter) {
    if (answers[qId]) return;
    setAnswers(a => ({ ...a, [qId]: letter }));
  }

  function finish() { setPhase('result'); }
  function restart() { setPhase('setup'); setQuestions([]); setAnswers({}); }

  const answered = Object.keys(answers).length;
  const correct  = questions.filter(q => answers[q.id] === q.answer).length;
  const pct      = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
  const subjects  = SUBJECTS[form.level] || SUBJECTS.olevel;

  if (phase === 'loading') return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 20 }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
        style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid rgba(124,58,237,0.15)', borderTopColor: T.pur }} />
      <p style={{ fontSize: 16, color: T.mid, fontWeight: 600 }}>Generating your mock exam…</p>
      <p style={{ fontSize: 13, color: T.lo }}>AI is creating {form.count} questions for {form.subject}</p>
    </div>
  );

  if (phase === 'result') {
    const grade = pct >= 80 ? 'A' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 40 ? 'D' : 'F';
    const gradeColor = { A: '#4ade80', B: '#60a5fa', C: '#fbbf24', D: '#fb923c', F: '#f87171' }[grade];
    return (
      <div style={{ padding: '32px', maxWidth: 700, margin: '0 auto' }}>
        <motion.div initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ ...glass(), borderRadius: 20, padding: '36px', textAlign: 'center', marginBottom: 24 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: .2 }}
            style={{ width: 100, height: 100, borderRadius: '50%', border: `3px solid ${gradeColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', background: `${gradeColor}15`, boxShadow: `0 0 30px ${gradeColor}40` }}>
            <span style={{ fontSize: 48, fontWeight: 900, color: gradeColor }}>{grade}</span>
          </motion.div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: T.hi, marginBottom: 8 }}>{correct} / {questions.length}</h2>
          <p style={{ fontSize: 18, color: T.mid, marginBottom: 4 }}>{pct}% — {pct >= 70 ? 'Excellent work!' : pct >= 50 ? 'Good effort, keep studying!' : 'More revision needed.'}</p>
          <p style={{ fontSize: 13, color: T.lo }}>{form.subject} · {form.level.toUpperCase()}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 }}>
            <motion.button onClick={restart} whileTap={{ scale: .97 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', ...glass(), color: T.mid, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 11, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              <RotateCcw size={14} /> New Exam
            </motion.button>
            <motion.button onClick={() => setPhase('quiz')} whileTap={{ scale: .97 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff', border: 'none', borderRadius: 11, cursor: 'pointer', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>
              <BookOpen size={14} /> Review Answers
            </motion.button>
          </div>
        </motion.div>

        {/* Answer review */}
        {questions.map((q, i) => {
          const userAns = answers[q.id];
          const isCorrect = userAns === q.answer;
          return (
            <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }}
              style={{ ...glass(), borderRadius: 14, padding: '16px 20px', marginBottom: 10, borderColor: isCorrect ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)', background: isCorrect ? 'rgba(74,222,128,0.06)' : 'rgba(248,113,113,0.06)' }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: isCorrect ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)', border: `1px solid ${isCorrect ? '#4ade80' : '#f87171'}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 800, color: isCorrect ? '#4ade80' : '#f87171' }}>
                  {isCorrect ? '✓' : '✗'}
                </div>
                <p style={{ fontSize: 13.5, color: T.hi, fontWeight: 600, lineHeight: 1.5 }}>{i + 1}. {q.q}</p>
              </div>
              <div style={{ paddingLeft: 36, fontSize: 12.5, color: T.lo, lineHeight: 1.6 }}>
                {!isCorrect && <p>Your answer: <span style={{ color: '#f87171', fontWeight: 700 }}>{userAns || 'Not answered'}</span></p>}
                <p>Correct: <span style={{ color: '#4ade80', fontWeight: 700 }}>{q.answer}</span></p>
                <button onClick={() => setShowExpl(s => ({ ...s, [q.id]: !s[q.id] }))} style={{ background: 'none', border: 'none', color: T.pur, cursor: 'pointer', fontSize: 12, fontWeight: 600, marginTop: 4 }}>
                  {showExpl[q.id] ? '▲ Hide' : '▼ Explanation'}
                </button>
                {showExpl[q.id] && <p style={{ marginTop: 6, color: T.mid, fontStyle: 'italic' }}>{q.explanation}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  if (phase === 'quiz') {
    const q = questions[current];
    const userAns = answers[q?.id];
    const LETTERS = ['A', 'B', 'C', 'D'];
    const optColor = (opt) => {
      const letter = opt.charAt(0);
      if (!userAns) return { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', color: T.mid };
      if (letter === q.answer) return { bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.4)', color: '#4ade80' };
      if (letter === userAns && letter !== q.answer) return { bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.35)', color: '#f87171' };
      return { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.06)', color: T.lo };
    };

    return (
      <div style={{ padding: '28px 32px', maxWidth: 700, margin: '0 auto' }}>
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: T.lo, fontWeight: 600 }}>Question {current + 1} of {questions.length}</span>
          <span style={{ fontSize: 13, color: T.lo }}>{answered} answered</span>
        </div>
        <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.08)', marginBottom: 24 }}>
          <motion.div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#7c3aed,#a78bfa)', boxShadow: '0 0 8px rgba(124,58,237,0.5)' }}
            animate={{ width: `${((current + 1) / questions.length) * 100}%` }} transition={{ duration: .3 }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: .22 }}
            style={{ ...glass(), borderRadius: 18, padding: '28px', marginBottom: 20 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: T.hi, lineHeight: 1.6, marginBottom: 24 }}>{q.q}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map(opt => {
                const c = optColor(opt);
                return (
                  <motion.button key={opt} onClick={() => answer(q.id, opt.charAt(0))} whileHover={!userAns ? { scale: 1.01 } : {}} whileTap={!userAns ? { scale: .99 } : {}}
                    style={{ padding: '13px 16px', borderRadius: 12, border: `1.5px solid ${c.border}`, background: c.bg, color: c.color, cursor: userAns ? 'default' : 'pointer', fontSize: 14, fontWeight: 500, textAlign: 'left', transition: 'all .18s', fontFamily: 'inherit' }}>
                    {opt}
                  </motion.button>
                );
              })}
            </div>
            {userAns && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontSize: 13, color: T.mid, fontStyle: 'italic' }}><span style={{ color: T.pur, fontWeight: 700 }}>Explanation:</span> {q.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
            style={{ padding: '10px 20px', ...glass(), color: current === 0 ? T.lo : T.mid, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, cursor: current === 0 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 13.5 }}>
            Previous
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {current < questions.length - 1 ? (
              <motion.button onClick={() => setCurrent(c => c + 1)} disabled={!userAns} whileTap={{ scale: .97 }}
                style={{ padding: '10px 20px', background: userAns ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', borderRadius: 10, cursor: userAns ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: 13.5, boxShadow: userAns ? '0 4px 16px rgba(124,58,237,0.35)' : 'none' }}>
                Next <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </motion.button>
            ) : (
              <motion.button onClick={finish} whileTap={{ scale: .97 }}
                style={{ padding: '10px 22px', background: 'linear-gradient(135deg,#059669,#047857)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 16px rgba(5,150,105,0.3)' }}>
                <Trophy size={15} /> Finish Exam
              </motion.button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Setup
  return (
    <div style={{ padding: '28px 32px', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: T.hi, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <ClipboardCheck size={22} style={{ color: T.pur }} /> Mock Exam Generator
        </h2>
        <p style={{ fontSize: 14, color: T.mid }}>AI-generated MCQ exams in ZIMSEC/Cambridge style. Get instant feedback and explanations.</p>
      </div>

      <form onSubmit={startExam} style={{ ...glass(), borderRadius: 18, padding: '28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <FormField label="Level">
          <GlassSelect value={form.level} onChange={v => setF('level', v)} options={[['primary','Primary School'],['olevel','O-Level'],['alevel','A-Level']]} />
        </FormField>
        <FormField label="Subject *">
          <GlassSelect value={form.subject} onChange={v => setF('subject', v)} options={[['','— Select subject —'], ...subjects.map(s => [s, s])]} />
        </FormField>
        <FormField label="Grade / Form">
          <input value={form.grade} onChange={e => setF('grade', e.target.value)} placeholder="e.g. Form 4, Grade 7" style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'rgba(167,139,250,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
        </FormField>
        <FormField label="Topic (optional)">
          <input value={form.topic} onChange={e => setF('topic', e.target.value)} placeholder="e.g. Photosynthesis, World War 1…" style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'rgba(167,139,250,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Questions">
            <GlassSelect value={form.count} onChange={v => setF('count', Number(v))} options={[[5,'5 Questions'],[10,'10 Questions'],[15,'15 Questions'],[20,'20 Questions']]} />
          </FormField>
          <FormField label="Difficulty">
            <GlassSelect value={form.difficulty} onChange={v => setF('difficulty', v)} options={[['easy','Easy'],['medium','Medium'],['hard','Hard'],['mixed','Mixed']]} />
          </FormField>
        </div>

        {error && <ErrorRow msg={error} />}

        <motion.button type="submit" whileTap={{ scale: .97 }}
          style={{ padding: '14px', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 6px 24px rgba(124,58,237,0.45)', letterSpacing: '.2px' }}>
          <PlayCircle size={18} /> Start Mock Exam
        </motion.button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MATERIALS TAB
══════════════════════════════════════════════════════════════════════════════ */
function MaterialsTab({ profile }) {
  const [items, setItems]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [canDownload, setCanDownload] = useState(true);
  const [filters, setFilters] = useState({ level: '', category: '', subject: '', search: '' });
  function setF(k, v) { setFilters(f => ({ ...f, [k]: v })); setPage(1); }

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const p = new URLSearchParams({ page, limit: 15 });
      if (filters.level) p.set('level', filters.level);
      if (filters.category) p.set('category', filters.category);
      if (filters.subject) p.set('subject', filters.subject);
      if (filters.search) p.set('search', filters.search);
      const d = await api(`/api/student/materials?${p}`);
      setItems(d.items || []); setTotal(d.total || 0); setPages(d.pages || 1);
      setCanDownload(d.canDownload !== false);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => { fetch(); }, [fetch]);

  const CAT_LABEL = { paper: 'Past Paper', textbook: 'Textbook', syllabus: 'Syllabus', marking_scheme: 'Mark Scheme' };
  const CAT_COLOR = { paper: '#3b82f6', textbook: '#10b981', syllabus: '#a78bfa', marking_scheme: '#f59e0b' };
  const LEVEL_LABEL = { primary: 'Primary', olevel: 'O-Level', alevel: 'A-Level' };

  return (
    <div style={{ padding: '20px 24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: T.hi, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={20} style={{ color: T.pur }} /> Materials Library
          </h2>
          <p style={{ fontSize: 12.5, color: T.lo }}>{total} resources · ZIMSEC & Cambridge · WhatsApp usage shared</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T.lo }} />
            <input value={filters.search} onChange={e => setF('search', e.target.value)} placeholder="Search…"
              style={{ ...inputStyle, paddingLeft: 30, width: 160 }} />
          </div>
          {[
            ['level', [['','All Levels'],['primary','Primary'],['olevel','O-Level'],['alevel','A-Level']]],
            ['category', [['','All Types'],['paper','Past Papers'],['textbook','Textbooks'],['syllabus','Syllabuses'],['marking_scheme','Mark Schemes']]],
          ].map(([key, opts]) => (
            <select key={key} value={filters[key]} onChange={e => setF(key, e.target.value)}
              style={{ ...inputStyle, width: 'auto', paddingRight: 28 }}>
              {opts.map(([v, l]) => <option key={v} value={v} style={{ background: '#150b35' }}>{l}</option>)}
            </select>
          ))}
        </div>
      </div>

      {error && <ErrorRow msg={error} />}

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10 }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={{ ...glass(), borderRadius: 12, padding: 16, animation: 'pulse 1.5s infinite' }}>
                {[80, 60, 40].map((w, j) => <div key={j} style={{ height: j === 0 ? 14 : 10, borderRadius: 6, background: 'rgba(255,255,255,0.06)', width: `${w}%`, marginBottom: 8 }} />)}
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <BookOpen size={44} style={{ color: 'rgba(167,139,250,0.3)', marginBottom: 12 }} />
            <p style={{ fontSize: 16, fontWeight: 700, color: T.mid, marginBottom: 6 }}>No materials found</p>
            <p style={{ fontSize: 13.5, color: T.lo }}>Try adjusting your filters or search.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10, marginBottom: 16 }}>
              {items.map(item => (
                <motion.div key={item._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
                  style={{ ...glass(), borderRadius: 12, padding: '14px', transition: 'all .18s' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: `${CAT_COLOR[item.category] || '#7c3aed'}20`, color: CAT_COLOR[item.category] || '#7c3aed', border: `1px solid ${CAT_COLOR[item.category] || '#7c3aed'}30` }}>
                      {CAT_LABEL[item.category] || item.category}
                    </span>
                    {item.year && <span style={{ fontSize: 10.5, color: T.lo }}>{item.year}</span>}
                  </div>
                  <h4 style={{ fontSize: 12.5, fontWeight: 700, color: T.hi, marginBottom: 6, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h4>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                    {[LEVEL_LABEL[item.level] || item.level, item.grade, item.subject].filter(Boolean).map(tag => (
                      <span key={tag} style={{ fontSize: 10.5, color: T.lo, background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.08)' }}>{tag}</span>
                    ))}
                  </div>
                  {canDownload ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', ...glass(), color: T.pur, borderRadius: 9, fontSize: 12.5, fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(124,58,237,0.25)', transition: 'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.25)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)'; }}>
                      <Download size={12} /> Download
                    </a>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', background: 'rgba(255,255,255,0.03)', color: T.lo, borderRadius: 9, fontSize: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <Crown size={12} /> Upgrade to download
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            {pages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ padding: '7px 14px', ...glass(), color: T.lo, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 13 }}>
                  Previous
                </button>
                <span style={{ fontSize: 13, color: T.lo }}>Page {page} of {pages}</span>
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                  style={{ padding: '7px 14px', ...glass(), color: T.lo, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, cursor: page === pages ? 'not-allowed' : 'pointer', fontSize: 13 }}>
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PROFILE TAB
══════════════════════════════════════════════════════════════════════════════ */
function ProfileTab({ profile, usage, limits }) {
  const plan = profile?.plan || 'FREE';
  const planColor = PLAN_COLOR[plan] || '#6b7280';
  const PLAN_ICONS = { FREE: Zap, STARTER: Flame, BASIC: Brain, PRO: Target, PREMIUM: Crown };
  const PIcon = PLAN_ICONS[plan] || Zap;

  const stats = [
    { label: 'AI Chats Today', used: usage?.chatToday || 0, limit: limits?.chat || 25, icon: MessageSquare, color: '#7c3aed' },
    { label: 'Images Today',   used: usage?.imagesToday || 0, limit: limits?.images || 3, icon: Image, color: '#3b82f6' },
    { label: 'Notes / Exams',  used: usage?.pdfToday || 0, limit: limits?.pdf || 1, icon: FileText, color: '#10b981' },
  ];

  return (
    <div style={{ padding: '28px 32px', maxWidth: 700, margin: '0 auto' }}>
      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ ...glass(), borderRadius: 20, padding: '28px', marginBottom: 20, background: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg,${planColor},${planColor}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#fff', boxShadow: `0 0 24px ${planColor}50`, flexShrink: 0 }}>
            {(profile?.name || 'S')[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: T.hi, marginBottom: 4 }}>{profile?.name || 'Student'}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 700, color: planColor, background: `${planColor}20`, border: `1px solid ${planColor}40`, padding: '3px 10px', borderRadius: 99 }}>
                <PIcon size={11} /> {plan}
              </span>
              {profile?.levelLabel && <span style={{ fontSize: 12.5, color: T.lo }}>{profile.levelLabel} · {profile.grade}</span>}
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            { icon: Smartphone, label: 'Phone', value: profile?.phone ? `+${profile.phone}` : '—' },
            { icon: School, label: 'School', value: profile?.school || '—' },
            { icon: GraduationCap, label: 'Level', value: profile?.levelLabel || '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ ...glass({ background: 'rgba(255,255,255,0.04)' }), borderRadius: 12, padding: '12px 14px' }}>
              <Icon size={13} style={{ color: T.lo, marginBottom: 5 }} />
              <div style={{ fontSize: 10.5, color: T.lo, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.hi, wordBreak: 'break-all' }}>{value}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Usage — shared WhatsApp + Web */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }}
        style={{ ...glass(), borderRadius: 20, padding: '24px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: T.hi, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart3 size={15} style={{ color: T.pur }} /> Today's Usage
            </h3>
            <p style={{ fontSize: 12, color: T.lo }}>Combined WhatsApp + Web — resets at midnight</p>
          </div>
          <Smartphone size={18} style={{ color: T.lo }} />
        </div>
        {stats.map(s => <UsageBar key={s.label} {...s} />)}
        <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(167,139,250,0.08)', borderRadius: 10, border: '1px solid rgba(167,139,250,0.15)', fontSize: 12.5, color: T.lo, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Smartphone size={13} style={{ color: T.pur, flexShrink: 0 }} />
          WhatsApp and web usage are shared — messages sent on WhatsApp count toward your daily web limits too.
        </div>
      </motion.div>

      {/* Upgrade CTA */}
      {plan !== 'PREMIUM' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}
          style={{ borderRadius: 20, padding: '24px', background: 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(109,40,217,0.15))', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: T.hi, marginBottom: 4 }}>Upgrade your plan</h3>
            <p style={{ fontSize: 13.5, color: T.mid, lineHeight: 1.6 }}>Get more chats, images, and mock exams. Plans from $1/month.</p>
          </div>
          <a href="https://wa.me/263719647303?text=upgrade" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 22px', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff', textDecoration: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, boxShadow: '0 4px 16px rgba(124,58,237,0.4)', flexShrink: 0 }}>
            <Crown size={15} /> Upgrade on WhatsApp <ArrowUpRight size={13} />
          </a>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Shared UI helpers ───────────────────────────────────────────────────── */
const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.06)', fontSize: 13.5, color: '#f0e9ff', outline: 'none',
  fontFamily: 'inherit', transition: 'border .18s', boxSizing: 'border-box',
};

function FormField({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(240,233,255,0.5)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</div>
      {children}
    </div>
  );
}

function GlassSelect({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a78bfa' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 32 }}>
      {options.map(([v, l]) => <option key={v} value={v} style={{ background: '#150b35', color: '#f0e9ff' }}>{l}</option>)}
    </select>
  );
}

function GlassIconBtn({ onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', ...glass(), color: T.lo, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
      <Icon size={12} /> {label}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN STUDENT APP
══════════════════════════════════════════════════════════════════════════════ */
export default function StudentApp() {
  const nav = useNavigate();
  const [profile, setProfile] = useState(() => { try { return JSON.parse(localStorage.getItem('fundo_user') || 'null'); } catch { return null; } });
  const [usage, setUsage]     = useState(null);
  const [limits, setLimits]   = useState(null);
  const [tab, setTab]         = useState('chat');
  const [sidebar, setSidebar] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!token()) { nav('/student'); return; }
    api('/api/student/me').then(d => {
      setProfile(d); setUsage(d.usage); setLimits(d.limits);
      localStorage.setItem('fundo_user', JSON.stringify(d));
    }).catch(() => nav('/student'));
  }, [refreshKey]);

  function signOut() { localStorage.removeItem('fundo_token'); localStorage.removeItem('fundo_user'); nav('/student'); }

  const plan = profile?.plan || 'FREE';
  const planColor = PLAN_COLOR[plan] || '#6b7280';

  // Animated background orbs
  const orbs = [
    { size: 500, top: -200, left: -150, color: 'rgba(124,58,237,0.2)' },
    { size: 350, bottom: -100, right: -80, color: 'rgba(59,130,246,0.12)' },
    { size: 250, top: '40%', left: '50%', color: 'rgba(139,92,246,0.1)' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Inter', system-ui, sans-serif", position: 'relative', overflow: 'hidden', background: BG }}>
      {/* Orbs */}
      {orbs.map((o, i) => (
        <div key={i} style={{ position: 'absolute', width: o.size, height: o.size, borderRadius: '50%', background: o.color, filter: 'blur(80px)', top: o.top, left: o.left, right: o.right, bottom: o.bottom, pointerEvents: 'none', zIndex: 0 }} />
      ))}

      {/* Sidebar */}
      <motion.div animate={{ width: sidebar ? 255 : 0 }} transition={{ duration: .25, ease: 'easeInOut' }}
        style={{ position: 'relative', zIndex: 10, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0, ...glass({ background: 'rgba(12,5,33,0.7)' }) }}>
        <div style={{ width: 255 }}>
          {/* Logo */}
          <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 0 16px rgba(124,58,237,0.4)', flexShrink: 0 }}>
                <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1 }}>Fundo<span style={{ color: T.pur }}>AI</span></div>
                <div style={{ fontSize: 10, color: T.lo, marginTop: 2 }}>Student Portal</div>
              </div>
            </div>
          </div>

          {/* User card */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,${planColor},${planColor}70)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0, boxShadow: `0 0 12px ${planColor}40` }}>
                {(profile?.name || 'S')[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.hi, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.name || 'Student'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: planColor }}>{plan}</span>
                  {profile?.grade && <span style={{ fontSize: 10, color: T.lo }}>· {profile.grade}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div style={{ padding: '10px 8px' }}>
            {TABS.map(t => {
              const active = tab === t.id;
              return (
                <motion.button key={t.id} onClick={() => setTab(t.id)} whileTap={{ scale: .97 }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', borderRadius: 11, border: active ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent', cursor: 'pointer', marginBottom: 2, fontSize: 13.5, fontWeight: active ? 700 : 500, textAlign: 'left', transition: 'all .18s', fontFamily: 'inherit',
                    background: active ? 'rgba(124,58,237,0.2)' : 'transparent', color: active ? T.pur : T.lo,
                    boxShadow: active ? '0 0 16px rgba(124,58,237,0.2)' : 'none' }}>
                  <t.icon size={16} style={{ color: active ? T.pur : T.lo, flexShrink: 0 }} />
                  {t.label}
                  {active && <motion.div layoutId="activeTab" style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: T.pur, boxShadow: `0 0 6px ${T.purDk}` }} />}
                </motion.button>
              );
            })}
          </div>

          {/* Usage */}
          {usage && limits && (
            <div style={{ margin: '8px 10px', padding: '14px', ...glass({ background: 'rgba(255,255,255,0.04)', borderRadius: 14 }) }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: T.lo, textTransform: 'uppercase', letterSpacing: '.6px' }}>Daily Usage</span>
                <button onClick={() => setRefreshKey(k => k + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.lo, padding: 0, display: 'flex' }}><RefreshCw size={11} /></button>
              </div>
              <UsageBar label="Chats" used={usage.chatToday || 0} limit={limits.chat || 25} icon={MessageSquare} />
              <UsageBar label="Images" used={usage.imagesToday || 0} limit={limits.images || 3} icon={Image} />
              <UsageBar label="Notes & Exams" used={usage.pdfToday || 0} limit={limits.pdf || 1} icon={FileText} />
            </div>
          )}

          {/* Upgrade */}
          {plan === 'FREE' && (
            <div style={{ margin: '6px 10px' }}>
              <a href="https://wa.me/263719647303?text=upgrade" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontSize: 13, fontWeight: 700, boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}>
                <Crown size={13} /> Upgrade Plan <ArrowUpRight size={12} style={{ marginLeft: 'auto' }} />
              </a>
            </div>
          )}

          {/* Sign out */}
          <div style={{ padding: '8px 10px', marginTop: 8 }}>
            <button onClick={signOut}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, color: T.lo, background: 'transparent', fontFamily: 'inherit', transition: 'all .18s', textAlign: 'left' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#fca5a5'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.lo; }}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 10 }}>
        {/* Top bar */}
        <div style={{ height: 54, borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 18px', gap: 12, flexShrink: 0, ...glass({ background: 'rgba(12,5,33,0.5)', borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.07)' }) }}>
          <motion.button onClick={() => setSidebar(s => !s)} whileTap={{ scale: .92 }}
            style={{ width: 32, height: 32, borderRadius: 9, ...glass(), display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
            {sidebar ? <X size={14} style={{ color: T.lo }} /> : <Menu size={14} style={{ color: T.lo }} />}
          </motion.button>
          <span style={{ fontSize: 15, fontWeight: 800, color: T.hi }}>
            {TABS.find(t => t.id === tab)?.label}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {profile?.school && <span style={{ fontSize: 12, color: T.lo }}>{profile.school}</span>}
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg,${planColor},${planColor}70)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', boxShadow: `0 0 10px ${planColor}40` }}>
              {(profile?.name || 'S')[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}
              style={{ height: '100%', overflowY: tab === 'chat' || tab === 'exam' ? 'hidden' : 'auto' }}>
              {tab === 'chat'      && <ChatTab profile={profile} />}
              {tab === 'image'     && <ImageTab />}
              {tab === 'notes'     && <NotesTab profile={profile} />}
              {tab === 'exam'      && <ExamTab profile={profile} />}
              {tab === 'materials' && <MaterialsTab profile={profile} />}
              {tab === 'profile'   && <ProfileTab profile={profile} usage={usage} limits={limits} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .md-body p { margin: 0 0 10px; color: rgba(240,233,255,0.85); }
        .md-body h1,.md-body h2,.md-body h3 { margin: 16px 0 8px; font-weight: 800; color: #f0e9ff; }
        .md-body h1 { font-size: 1.25em; }
        .md-body h2 { font-size: 1.12em; color: #a78bfa; }
        .md-body h3 { font-size: 1em; color: #c4b5fd; }
        .md-body ul,.md-body ol { padding-left: 20px; margin: 8px 0; }
        .md-body li { margin-bottom: 4px; color: rgba(240,233,255,0.8); }
        .md-body strong { font-weight: 700; color: #f0e9ff; }
        .md-body em { color: #a78bfa; }
        .md-body code { background: rgba(124,58,237,0.2); color: #c4b5fd; padding: 2px 6px; border-radius: 4px; font-size: .88em; font-family: monospace; border: 1px solid rgba(124,58,237,0.2); }
        .md-body pre { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08); padding: 14px; border-radius: 10px; overflow-x: auto; margin: 10px 0; }
        .md-body pre code { background: none; border: none; padding: 0; color: #c4b5fd; }
        .md-body table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        .md-body th,.md-body td { border: 1px solid rgba(255,255,255,0.1); padding: 8px 12px; text-align: left; font-size: 13px; color: rgba(240,233,255,0.8); }
        .md-body th { background: rgba(124,58,237,0.15); font-weight: 700; color: #f0e9ff; }
        .md-body blockquote { border-left: 3px solid #7c3aed; padding-left: 14px; color: rgba(240,233,255,0.6); margin: 10px 0; }
        input::placeholder, textarea::placeholder { color: rgba(240,233,255,0.25); }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(124,58,237,0.5); }
        select option { background: #150b35; color: #f0e9ff; }
      `}</style>
    </div>
  );
}
