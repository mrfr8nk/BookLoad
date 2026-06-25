import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Image, FileText, BookOpen, Send, Plus, LogOut, Sparkles,
  Download, Search, X, ChevronDown, Loader, User, Zap, Crown, ArrowUpRight,
  AlertCircle, ChevronRight, RefreshCw, Copy, Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const C = {
  purple: '#7c3aed', purpleDk: '#6d28d9', purpleLt: '#f5f3ff',
  gray900: '#111827', gray800: '#1f2937', gray700: '#374151',
  gray600: '#4b5563', gray500: '#6b7280', gray400: '#9ca3af',
  gray300: '#d1d5db', gray200: '#e5e7eb', gray100: '#f3f4f6', gray50: '#f9fafb',
  green: '#059669', greenLt: '#ecfdf5',
};

const PLAN_COLOR = { FREE: '#6b7280', STARTER: '#2563eb', BASIC: '#059669', PRO: C.purple, PREMIUM: '#d97706' };
const PLAN_ICON  = { FREE: '🆓', STARTER: '⚡', BASIC: '📘', PRO: '🚀', PREMIUM: '👑' };

const SUBJECTS_BY_LEVEL = {
  primary: ['Mathematics','English','Shona','Ndebele','Science','Social Studies','Environmental Science'],
  olevel:  ['Mathematics','English Language','English Literature','History','Geography','Biology','Chemistry','Physics','Combined Science','Agriculture','Commerce','Accounting','Economics','Business Studies','Computer Science','Food & Nutrition','Fashion & Fabrics','Art','Shona','Ndebele'],
  alevel:  ['Mathematics','Pure Mathematics','Statistics','Further Mathematics','Physics','Chemistry','Biology','History','Geography','Economics','Business Studies','Accounting','Computer Science','English Literature'],
};

function token() { return localStorage.getItem('fundo_token') || ''; }

async function api(path, opts = {}) {
  const r = await fetch(path, {
    ...opts,
    headers: { 'Authorization': `Bearer ${token()}`, 'Content-Type': 'application/json', ...(opts.headers || {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Request failed');
  return d;
}

// ─── Usage progress bar ───────────────────────────────────────────────────────
function UsageBar({ label, used, limit, color }) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 100;
  const isNear = pct >= 80;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 11.5, color: C.gray500, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: isNear ? '#dc2626' : C.gray600 }}>
          {used}/{limit === 9999 ? '∞' : limit}
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: C.gray200, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: .7, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 99, background: isNear ? '#dc2626' : color }}
        />
      </div>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, onCopy }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  function handleCopy() {
    navigator.clipboard.writeText(msg.content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .25 }}
      style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 16 }}
    >
      {!isUser && (
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: 10, marginTop: 4, overflow: 'hidden' }}>
          <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
        </div>
      )}
      <div style={{ maxWidth: '76%' }}>
        <div style={{
          padding: isUser ? '10px 16px' : '14px 18px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
          background: isUser ? C.purple : '#fff',
          color: isUser ? '#fff' : C.gray900,
          fontSize: 14, lineHeight: 1.65,
          border: isUser ? 'none' : `1px solid ${C.gray200}`,
          boxShadow: isUser ? '0 2px 12px rgba(124,58,237,.25)' : '0 1px 4px rgba(0,0,0,.05)',
        }}>
          {isUser ? (
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
          ) : (
            <div className="markdown-body">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          )}
        </div>
        {!isUser && (
          <button onClick={handleCopy}
            style={{ marginTop: 4, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: C.gray400, padding: '3px 6px', borderRadius: 6 }}>
            {copied ? <><Check size={11} style={{ color: C.green }}/> Copied</> : <><Copy size={11}/> Copy</>}
          </button>
        )}
      </div>
      {isUser && (
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.gray200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 10, marginTop: 4 }}>
          <User size={15} style={{ color: C.gray600 }} />
        </div>
      )}
    </motion.div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'chat',      icon: MessageCircle, label: 'AI Chat'       },
  { id: 'image',     icon: Image,         label: 'Image Gen'     },
  { id: 'notes',     icon: FileText,      label: 'Study Notes'   },
  { id: 'materials', icon: BookOpen,      label: 'Materials'     },
];

// ─── Chat Tab ─────────────────────────────────────────────────────────────────
function ChatTab({ profile }) {
  const [sessions, setSessions] = useState([{ id: 1, title: 'New Chat', messages: [] }]);
  const [activeSession, setActiveSession] = useState(1);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef();

  const session = sessions.find(s => s.id === activeSession);
  const messages = session?.messages || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  function newChat() {
    const id = Date.now();
    setSessions(s => [...s, { id, title: 'New Chat', messages: [] }]);
    setActiveSession(id);
    setError('');
  }

  async function send() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput(''); setError('');

    const userMsg = { role: 'user', content: msg };
    setSessions(s => s.map(sess => sess.id === activeSession
      ? { ...sess, messages: [...sess.messages, userMsg], title: sess.messages.length === 0 ? msg.slice(0, 40) : sess.title }
      : sess
    ));

    setLoading(true);
    try {
      const history = messages.slice(-10);
      const d = await api('/api/student/chat', { method: 'POST', body: { message: msg, history } });
      const aiMsg = { role: 'assistant', content: d.reply };
      setSessions(s => s.map(sess => sess.id === activeSession
        ? { ...sess, messages: [...sess.messages, userMsg, aiMsg] }
        : sess
      ));
    } catch (e) {
      setError(e.message);
      setSessions(s => s.map(sess => sess.id === activeSession
        ? { ...sess, messages: [...sess.messages, userMsg] }
        : sess
      ));
    } finally { setLoading(false); }
  }

  const STARTERS = [
    '📐 Explain surds and indices for O-Level Maths',
    '🧬 What is photosynthesis? (Form 3 Biology)',
    '📝 Help me write an essay introduction',
    '⚛️ Explain atomic structure for A-Level Chemistry',
    '🗺️ Key causes of World War 1 (History)',
    '💻 Write a simple Python program for me',
  ];

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Sessions sidebar */}
      <div style={{ width: 220, borderRight: `1px solid ${C.gray200}`, display: 'flex', flexDirection: 'column', background: C.gray50 }}>
        <div style={{ padding: '12px 12px 8px' }}>
          <button onClick={newChat} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 9, border: `1.5px dashed ${C.gray300}`, background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: C.purple, transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.purpleLt; e.currentTarget.style.borderColor = C.purple; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.gray300; }}>
            <Plus size={15}/> New Chat
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
          {sessions.map(s => (
            <button key={s.id} onClick={() => setActiveSession(s.id)}
              style={{ width: '100%', textAlign: 'left', padding: '9px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2, fontSize: 12.5, fontWeight: activeSession === s.id ? 700 : 500, color: activeSession === s.id ? C.purple : C.gray700, background: activeSession === s.id ? C.purpleLt : 'transparent', transition: 'all .15s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {messages.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(124,58,237,.3)' }}>
                <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: C.gray900, marginBottom: 8 }}>
                Hi {profile?.name?.split(' ')[0] || 'there'}! 👋
              </h3>
              <p style={{ fontSize: 15, color: C.gray500, lineHeight: 1.6, maxWidth: 420, marginBottom: 28 }}>
                I'm Fundo AI — your personal study assistant for ZIMSEC and Cambridge. Ask me anything!
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxWidth: 560 }}>
                {STARTERS.map(s => (
                  <button key={s} onClick={() => { setInput(s.slice(2).trim()); }}
                    style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${C.gray200}`, background: '#fff', cursor: 'pointer', fontSize: 12.5, color: C.gray700, textAlign: 'left', transition: 'all .15s', lineHeight: 1.5 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.background = C.purpleLt; e.currentTarget.style.color = C.purple; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.gray200; e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = C.gray700; }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) => <MessageBubble key={i} msg={m} />)}
              {loading && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: '#fff', borderRadius: '4px 18px 18px 18px', border: `1px solid ${C.gray200}`, width: 'fit-content', boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0,1,2].map(i => (
                      <motion.div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: C.purple }}
                        animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: .8, delay: i * .15 }} />
                    ))}
                  </div>
                </motion.div>
              )}
              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, fontSize: 13, color: '#dc2626', marginTop: 8 }}>
                  <AlertCircle size={14}/> {error}
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.gray200}`, background: '#fff' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: C.gray50, border: `1.5px solid ${C.gray200}`, borderRadius: 14, padding: '10px 14px', transition: 'border .15s' }}
            onFocus={() => {}} >
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask anything — maths, science, history, essays…"
              rows={1}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: C.gray900, resize: 'none', lineHeight: 1.6, maxHeight: 120, fontFamily: 'inherit' }}
              onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
            />
            <button onClick={send} disabled={!input.trim() || loading}
              style={{ width: 38, height: 38, borderRadius: 10, background: input.trim() && !loading ? C.purple : C.gray300, border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .15s' }}>
              <Send size={16} style={{ color: '#fff' }} />
            </button>
          </div>
          <p style={{ fontSize: 11, color: C.gray400, textAlign: 'center', marginTop: 8 }}>
            Fundo AI is specialized for ZIMSEC & Cambridge. Press Enter to send, Shift+Enter for new line.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Image Generator Tab ──────────────────────────────────────────────────────
function ImageTab() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const EXAMPLES = [
    'A Zimbabwean student studying under a mango tree',
    'Diagram showing the water cycle for science class',
    'Beautiful sunset over Victoria Falls',
    'An atom model showing electrons orbiting the nucleus',
    'A vibrant classroom in Zimbabwe',
    'DNA double helix structure in bright colors',
  ];

  async function generate() {
    if (!prompt.trim() || loading) return;
    setError(''); setLoading(true); setResult(null);
    try {
      const d = await api(`/api/student/generate-image?prompt=${encodeURIComponent(prompt)}`);
      setResult(d);
      setHistory(h => [{ prompt, imageUrl: d.imageUrl }, ...h.slice(0, 7)]);
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: C.gray900, marginBottom: 6 }}>🎨 AI Image Generator</h2>
        <p style={{ fontSize: 14, color: C.gray500 }}>Create any image for your projects, study materials, or just for fun!</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input
          value={prompt} onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder="Describe the image you want to create…"
          style={{ flex: 1, padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${C.gray300}`, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
          onFocus={e => e.target.style.borderColor = C.purple}
          onBlur={e => e.target.style.borderColor = C.gray300}
        />
        <button onClick={generate} disabled={!prompt.trim() || loading}
          style={{ padding: '12px 24px', background: prompt.trim() && !loading ? C.purple : C.gray300, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14.5, fontWeight: 700, cursor: prompt.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, transition: 'background .15s' }}>
          {loading ? <><Loader size={15} style={{ animation: 'spin .7s linear infinite' }}/> Generating…</> : <><Sparkles size={15}/> Generate</>}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {EXAMPLES.map(e => (
          <button key={e} onClick={() => setPrompt(e)}
            style={{ padding: '6px 12px', borderRadius: 99, border: `1px solid ${C.gray200}`, background: '#fff', fontSize: 12.5, color: C.gray600, cursor: 'pointer', transition: 'all .15s' }}
            onMouseEnter={e2 => { e2.currentTarget.style.borderColor = C.purple; e2.currentTarget.style.color = C.purple; e2.currentTarget.style.background = C.purpleLt; }}
            onMouseLeave={e2 => { e2.currentTarget.style.borderColor = C.gray200; e2.currentTarget.style.color = C.gray600; e2.currentTarget.style.background = '#fff'; }}>
            {e}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, fontSize: 13.5, color: '#dc2626', marginBottom: 20 }}>
          <AlertCircle size={15}/> {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            style={{ width: 52, height: 52, borderRadius: '50%', border: `3px solid ${C.purpleLt}`, borderTopColor: C.purple, margin: '0 auto 16px' }} />
          <p style={{ fontSize: 14.5, color: C.gray500, fontWeight: 500 }}>Creating your image with AI…</p>
          <p style={{ fontSize: 12.5, color: C.gray400, marginTop: 6 }}>This usually takes 10–20 seconds</p>
        </div>
      )}

      {result && !loading && (
        <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} style={{ marginBottom: 28 }}>
          <div style={{ border: `1px solid ${C.gray200}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,.08)' }}>
            <img src={result.imageUrl} alt={prompt} style={{ width: '100%', maxHeight: 520, objectFit: 'contain', background: '#000', display: 'block' }} />
            <div style={{ padding: '14px 18px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: C.gray600, flex: 1, marginRight: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prompt}</span>
              <a href={result.imageUrl} download target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: C.purpleLt, color: C.purple, borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                <Download size={14}/> Download
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {history.length > 0 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.gray700, marginBottom: 12 }}>Recent Images</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
            {history.map((h, i) => (
              <div key={i} style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.gray200}`, cursor: 'pointer' }}
                onClick={() => { setResult(h); setPrompt(h.prompt); }}>
                <img src={h.imageUrl} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '6px 8px', fontSize: 11, color: C.gray500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.prompt}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Study Notes Tab ──────────────────────────────────────────────────────────
function NotesTab({ profile }) {
  const [form, setForm] = useState({ topic: '', subject: '', level: profile?.levelType || 'olevel', grade: profile?.grade || '' });
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function generate(e) {
    e.preventDefault();
    if (!form.topic.trim() || loading) return;
    setError(''); setLoading(true); setNotes('');
    try {
      const d = await api('/api/student/generate-notes', { method: 'POST', body: form });
      setNotes(d.notes);
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  function copyNotes() {
    navigator.clipboard.writeText(notes).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadNotes() {
    const blob = new Blob([notes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${form.topic || 'notes'}.txt`; a.click();
    URL.revokeObjectURL(url);
  }

  const subjects = SUBJECTS_BY_LEVEL[form.level] || SUBJECTS_BY_LEVEL.olevel;

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: C.gray900, marginBottom: 6 }}>📝 AI Study Notes Generator</h2>
        <p style={{ fontSize: 14, color: C.gray500 }}>Get comprehensive, curriculum-aligned notes on any topic instantly.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: notes ? '340px 1fr' : '1fr', gap: 24, alignItems: 'start' }}>
        <form onSubmit={generate} style={{ background: '#fff', border: `1px solid ${C.gray200}`, borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.gray700, display: 'block', marginBottom: 6 }}>Topic *</label>
            <input value={form.topic} onChange={e => set('topic', e.target.value)}
              placeholder="e.g. Photosynthesis, Quadratic Equations, World War 1…"
              required style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1.5px solid ${C.gray300}`, fontSize: 13.5, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
              onFocus={e => e.target.style.borderColor = C.purple}
              onBlur={e => e.target.style.borderColor = C.gray300} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.gray700, display: 'block', marginBottom: 6 }}>Level</label>
            <select value={form.level} onChange={e => set('level', e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1.5px solid ${C.gray300}`, fontSize: 13.5, outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
              <option value="primary">Primary School</option>
              <option value="olevel">O-Level</option>
              <option value="alevel">A-Level</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.gray700, display: 'block', marginBottom: 6 }}>Subject</label>
            <select value={form.subject} onChange={e => set('subject', e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1.5px solid ${C.gray300}`, fontSize: 13.5, outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
              <option value="">— Select subject —</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.gray700, display: 'block', marginBottom: 6 }}>Grade / Form</label>
            <input value={form.grade} onChange={e => set('grade', e.target.value)}
              placeholder="e.g. Form 4, Grade 7, A-Level"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1.5px solid ${C.gray300}`, fontSize: 13.5, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
              onFocus={e => e.target.style.borderColor = C.purple}
              onBlur={e => e.target.style.borderColor = C.gray300} />
          </div>

          <button type="submit" disabled={!form.topic.trim() || loading}
            style={{ padding: '12px', background: form.topic.trim() && !loading ? C.purple : C.gray300, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14.5, fontWeight: 700, cursor: form.topic.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? <><Loader size={15} style={{ animation: 'spin .7s linear infinite' }}/> Generating…</> : <><Sparkles size={15}/> Generate Notes</>}
          </button>

          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, color: '#dc2626' }}>
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }}/> {error}
            </div>
          )}
        </form>

        {(loading || notes) && (
          <div style={{ background: '#fff', border: `1px solid ${C.gray200}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.gray200}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.gray900 }}>
                {form.topic ? `Notes: ${form.topic}` : 'Study Notes'}
              </span>
              {notes && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={copyNotes} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: C.gray100, color: C.gray700, border: 'none', borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                    {copied ? <><Check size={12}/> Copied!</> : <><Copy size={12}/> Copy</>}
                  </button>
                  <button onClick={downloadNotes} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: C.purpleLt, color: C.purple, border: 'none', borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                    <Download size={12}/> Download
                  </button>
                </div>
              )}
            </div>
            <div style={{ padding: '20px 24px', maxHeight: 600, overflowY: 'auto' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${C.purpleLt}`, borderTopColor: C.purple, margin: '0 auto 14px' }} />
                  <p style={{ fontSize: 14, color: C.gray500 }}>Generating your study notes…</p>
                </div>
              ) : (
                <div className="markdown-body" style={{ fontSize: 14, lineHeight: 1.75 }}>
                  <ReactMarkdown>{notes}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Materials Tab ────────────────────────────────────────────────────────────
function MaterialsTab({ profile }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canDownload, setCanDownload] = useState(true);

  const [filters, setFilters] = useState({ level: '', category: '', subject: '', search: '' });

  function setF(k, v) { setFilters(f => ({ ...f, [k]: v })); setPage(1); }

  const fetchMaterials = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ page, limit: 16 });
      if (filters.level) params.set('level', filters.level);
      if (filters.category) params.set('category', filters.category);
      if (filters.subject) params.set('subject', filters.subject);
      if (filters.search) params.set('search', filters.search);
      const d = await api(`/api/student/materials?${params}`);
      setItems(d.items || []); setTotal(d.total || 0); setPages(d.pages || 1);
      setCanDownload(d.canDownload !== false);
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => { fetchMaterials(); }, [fetchMaterials]);

  const CAT_LABEL = { paper: '📄 Past Paper', textbook: '📗 Textbook', syllabus: '📋 Syllabus', marking_scheme: '✅ Marking Scheme' };
  const CAT_COLOR = { paper: '#2563eb', textbook: '#059669', syllabus: '#7c3aed', marking_scheme: '#d97706' };
  const LEVEL_LABEL = { primary: 'Primary', olevel: 'O-Level', alevel: 'A-Level' };
  const subjects = profile?.levelType ? SUBJECTS_BY_LEVEL[profile.levelType] : [];

  return (
    <div style={{ padding: '20px 24px' }}>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: C.gray900, marginBottom: 4 }}>📚 Study Materials Library</h2>
          <p style={{ fontSize: 13, color: C.gray500 }}>{total} resources · ZIMSEC & Cambridge</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.gray400 }}/>
            <input value={filters.search} onChange={e => setF('search', e.target.value)}
              placeholder="Search materials…"
              style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: `1.5px solid ${C.gray300}`, fontSize: 13, outline: 'none', width: 200 }}
              onFocus={e => e.target.style.borderColor = C.purple}
              onBlur={e => e.target.style.borderColor = C.gray300} />
          </div>
          {[
            ['level', [['','All Levels'],['primary','Primary'],['olevel','O-Level'],['alevel','A-Level']]],
            ['category', [['','All Types'],['paper','Past Papers'],['textbook','Textbooks'],['syllabus','Syllabuses'],['marking_scheme','Marking Schemes']]],
          ].map(([key, opts]) => (
            <select key={key} value={filters[key]} onChange={e => setF(key, e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: `1.5px solid ${C.gray300}`, fontSize: 13, outline: 'none', background: '#fff', cursor: 'pointer' }}>
              {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, fontSize: 13.5, color: '#dc2626', marginBottom: 16 }}>
          <AlertCircle size={14}/> {error}
          <button onClick={fetchMaterials} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
            <RefreshCw size={12}/> Retry
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ borderRadius: 12, border: `1px solid ${C.gray200}`, padding: 16, background: '#fff' }}>
              {[80, 60, 40].map((w, j) => (
                <div key={j} style={{ height: j === 0 ? 16 : 12, borderRadius: 6, background: C.gray100, width: `${w}%`, marginBottom: 8, animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <BookOpen size={48} style={{ color: C.gray300, marginBottom: 12 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.gray700, marginBottom: 8 }}>No materials found</h3>
          <p style={{ fontSize: 14, color: C.gray500 }}>Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12, marginBottom: 20 }}>
            {items.map(item => (
              <motion.div key={item._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: '#fff', border: `1px solid ${C.gray200}`, borderRadius: 12, padding: '16px', transition: 'all .15s', cursor: 'default' }}
                whileHover={{ y: -2, boxShadow: '0 4px 20px rgba(0,0,0,.08)', borderColor: C.gray300 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: (CAT_COLOR[item.category] || C.purple) + '15', color: CAT_COLOR[item.category] || C.purple }}>
                    {CAT_LABEL[item.category] || item.category}
                  </span>
                  <span style={{ fontSize: 11, color: C.gray400 }}>{item.year || ''}</span>
                </div>
                <h4 style={{ fontSize: 13.5, fontWeight: 700, color: C.gray900, marginBottom: 6, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.title}
                </h4>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: C.gray500, background: C.gray100, padding: '2px 7px', borderRadius: 99 }}>
                    {LEVEL_LABEL[item.level] || item.level}
                  </span>
                  {item.grade && <span style={{ fontSize: 11, color: C.gray500, background: C.gray100, padding: '2px 7px', borderRadius: 99 }}>{item.grade}</span>}
                  <span style={{ fontSize: 11, color: C.gray500, background: C.gray100, padding: '2px 7px', borderRadius: 99 }}>{item.subject}</span>
                </div>
                {canDownload ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', background: C.purpleLt, color: C.purple, borderRadius: 8, fontSize: 12.5, fontWeight: 700, textDecoration: 'none', transition: 'all .15s', border: `1px solid #ddd6fe` }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.purple; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.purpleLt; e.currentTarget.style.color = C.purple; }}>
                    <Download size={13}/> Download
                  </a>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', background: C.gray100, color: C.gray500, borderRadius: 8, fontSize: 12.5 }}>
                    <Crown size={13}/> Upgrade to download
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {pages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${C.gray200}`, background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 13, color: page === 1 ? C.gray300 : C.gray700 }}>
                Previous
              </button>
              <span style={{ fontSize: 13, color: C.gray600 }}>Page {page} of {pages}</span>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${C.gray200}`, background: '#fff', cursor: page === pages ? 'not-allowed' : 'pointer', fontSize: 13, color: page === pages ? C.gray300 : C.gray700 }}>
                Next
              </button>
            </div>
          )}
        </>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function StudentApp() {
  const nav = useNavigate();
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fundo_user') || 'null'); } catch { return null; }
  });
  const [usage, setUsage] = useState(null);
  const [limits, setLimits] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!token()) { nav('/student'); return; }
    api('/api/student/me').then(d => {
      setProfile(d);
      setUsage(d.usage);
      setLimits(d.limits);
      localStorage.setItem('fundo_user', JSON.stringify(d));
    }).catch(() => nav('/student'));
  }, []);

  function signOut() {
    localStorage.removeItem('fundo_token');
    localStorage.removeItem('fundo_user');
    nav('/student');
  }

  const plan = profile?.plan || 'FREE';
  const planColor = PLAN_COLOR[plan] || C.gray500;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Inter', system-ui, sans-serif", background: '#fff', overflow: 'hidden' }}>
      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarOpen ? 260 : 0 }}
        style={{ borderRight: `1px solid ${C.gray200}`, background: C.gray50, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ width: 260 }}>
          {/* Logo */}
          <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${C.gray200}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 900, color: C.gray900, lineHeight: 1 }}>Fundo<span style={{ color: C.purple }}>AI</span></div>
                <div style={{ fontSize: 10.5, color: C.gray500, marginTop: 2 }}>Study Assistant</div>
              </div>
            </div>
          </div>

          {/* User info */}
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.gray200}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${planColor}, ${planColor}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 800, color: '#fff' }}>
                {(profile?.name || 'S')[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.gray900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.name || 'Student'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 10.5 }}>{PLAN_ICON[plan]}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: planColor }}>{plan}</span>
                  {profile?.levelLabel && <span style={{ fontSize: 10.5, color: C.gray400 }}>· {profile.levelLabel}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation tabs */}
          <div style={{ padding: '10px 10px' }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, border: 'none', cursor: 'pointer', marginBottom: 2, fontSize: 13.5, fontWeight: activeTab === tab.id ? 700 : 500, color: activeTab === tab.id ? C.purple : C.gray700, background: activeTab === tab.id ? C.purpleLt : 'transparent', transition: 'all .15s', textAlign: 'left' }}>
                <tab.icon size={17} style={{ color: activeTab === tab.id ? C.purple : C.gray500, flexShrink: 0 }}/>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Usage bars */}
          {usage && limits && (
            <div style={{ margin: '8px 12px', padding: '14px', background: '#fff', border: `1px solid ${C.gray200}`, borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: C.gray700, textTransform: 'uppercase', letterSpacing: '.5px' }}>Today's Usage</span>
                <Zap size={12} style={{ color: C.purple }}/>
              </div>
              <UsageBar label="AI Chats" used={usage.chatToday || 0} limit={limits.chat || 25} color={C.purple} />
              <UsageBar label="Images" used={usage.imagesToday || 0} limit={limits.images || 3} color="#2563eb" />
              <UsageBar label="Study Notes" used={usage.pdfToday || 0} limit={limits.pdf || 1} color="#059669" />
            </div>
          )}

          {/* Upgrade CTA */}
          {plan === 'FREE' && (
            <div style={{ margin: '8px 12px' }}>
              <a href="https://wa.me/263719647303?text=upgrade" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
                <Crown size={14}/> Upgrade Plan
                <ArrowUpRight size={12} style={{ marginLeft: 'auto' }}/>
              </a>
            </div>
          )}

          {/* Sign out */}
          <div style={{ padding: '8px 10px', marginTop: 'auto' }}>
            <button onClick={signOut}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, color: C.gray500, background: 'transparent', transition: 'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.gray500; }}>
              <LogOut size={15}/> Sign Out
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{ height: 54, borderBottom: `1px solid ${C.gray200}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0, background: '#fff' }}>
          <button onClick={() => setSidebarOpen(o => !o)}
            style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.gray200}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gray500 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.gray900 }}>
            {TABS.find(t => t.id === activeTab)?.label}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: C.gray500 }}>{profile?.school || ''}</span>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg, ${planColor}, ${planColor}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>
              {(profile?.name || 'S')[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}
              style={{ height: '100%', overflow: activeTab === 'chat' ? 'hidden' : 'auto' }}>
              {activeTab === 'chat'      && <ChatTab profile={profile} />}
              {activeTab === 'image'     && <ImageTab />}
              {activeTab === 'notes'     && <NotesTab profile={profile} />}
              {activeTab === 'materials' && <MaterialsTab profile={profile} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .markdown-body p { margin: 0 0 10px; }
        .markdown-body h1,.markdown-body h2,.markdown-body h3 { margin: 16px 0 8px; font-weight: 800; color: #111827; }
        .markdown-body h1 { font-size: 1.3em; }
        .markdown-body h2 { font-size: 1.15em; }
        .markdown-body h3 { font-size: 1em; }
        .markdown-body ul,.markdown-body ol { padding-left: 20px; margin: 8px 0; }
        .markdown-body li { margin-bottom: 4px; }
        .markdown-body strong { font-weight: 700; }
        .markdown-body code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: .88em; font-family: monospace; }
        .markdown-body pre { background: #1f2937; color: #e5e7eb; padding: 14px; border-radius: 8px; overflow-x: auto; margin: 10px 0; }
        .markdown-body pre code { background: none; padding: 0; color: inherit; }
        .markdown-body table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        .markdown-body th,.markdown-body td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
        .markdown-body th { background: #f9fafb; font-weight: 700; }
        .markdown-body blockquote { border-left: 3px solid #7c3aed; padding-left: 14px; color: #6b7280; margin: 10px 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
