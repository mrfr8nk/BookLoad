import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Send, Mic, MicOff, Paperclip, Bot, Sparkles, ChevronDown, Zap } from 'lucide-react';

const SUGGESTIONS = [
  'How do I prepare for ZIMSEC Maths?',
  'Best past papers for O-Level Chemistry?',
  'Give me study tips for History',
  'What subjects are in A-Level?',
];

const BOT_GREET = {
  role: 'bot',
  text: "Hi! I'm Fundo AI 👋 Your ZIMSEC & Cambridge study assistant. Ask me anything or get started with a suggestion below.",
  time: new Date(),
};

const TYPING_REPLIES = [
  "Great question! Let me think through that for you…",
  "Sure thing! I'm pulling up the best resources for that.",
  "I can help with that. Here's what I know about ZIMSEC curricula…",
  "For best results, try our study materials library too! But here's a quick answer:",
];

function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
          style={{ width: 6, height: 6, borderRadius: '50%', background: '#a5b4fc' }}
        />
      ))}
    </div>
  );
}

function WaveBar({ i, active }) {
  return (
    <motion.div
      animate={active ? { height: [4, 16 + Math.random() * 10, 4], opacity: [0.5, 1, 0.5] } : { height: 4, opacity: 0.35 }}
      transition={active ? { duration: 0.5 + i * 0.08, repeat: Infinity, ease: 'easeInOut' } : {}}
      style={{ width: 3, borderRadius: 99, background: '#a5b4fc', alignSelf: 'center' }}
    />
  );
}

export default function ChatWidget() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState([BOT_GREET]);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const [recording, setRecording] = useState(false);
  const [pulse, setPulse]     = useState(false);
  const [unread, setUnread]   = useState(0);
  const listRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const t = setTimeout(() => setPulse(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [msgs, typing]);

  useEffect(() => {
    if (!open && msgs.length > 1) setUnread(prev => prev + 0);
  }, [open]);

  function sendMsg(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMsgs(prev => [...prev, { role: 'user', text: msg, time: new Date() }]);
    setTyping(true);
    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      setTyping(false);
      const reply = TYPING_REPLIES[Math.floor(Math.random() * TYPING_REPLIES.length)];
      setMsgs(prev => [...prev, { role: 'bot', text: reply, time: new Date() }]);
      if (!open) setUnread(n => n + 1);
    }, delay);
  }

  function toggleRecord() {
    setRecording(r => {
      if (!r) {
        setTimeout(() => setRecording(false), 4000);
        return true;
      }
      return false;
    });
  }

  return (
    <>
      {/* ── Floating Button ── */}
      <div style={{ position: 'fixed', bottom: 28, left: 28, zIndex: 8000 }}>
        <AnimatePresence>
          {!open && pulse && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0, transition: { duration: 0.15 } }}
              style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: 12, zIndex: 1 }}
            >
              <div style={{
                background: 'rgba(8,8,28,0.95)', backdropFilter: 'blur(28px)',
                border: '1px solid rgba(99,102,241,0.3)', borderRadius: 14,
                padding: '10px 16px', fontSize: 13, fontWeight: 600,
                color: '#eef0ff', whiteSpace: 'nowrap',
                boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Sparkles size={13} style={{ color: '#a5b4fc' }} />
                Need help studying?
              </div>
              {/* Tail */}
              <div style={{ position: 'absolute', bottom: -6, left: 20, width: 12, height: 12, background: 'rgba(8,8,28,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderTop: 'none', borderLeft: 'none', transform: 'rotate(45deg)', borderRadius: '0 0 3px 0' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse rings */}
        {!open && (
          <>
            <motion.div
              animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(99,102,241,0.3)', pointerEvents: 'none' }}
            />
            <motion.div
              animate={{ scale: [1, 2.2], opacity: [0.25, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', pointerEvents: 'none' }}
            />
          </>
        )}

        <motion.button
          onClick={() => { setOpen(o => !o); setUnread(0); setPulse(false); setTimeout(() => inputRef.current?.focus(), 300); }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          animate={open ? { rotate: 0, scale: 1 } : { rotate: [0, -5, 5, 0], scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            width: 58, height: 58, borderRadius: '50%',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
            border: 'none', cursor: 'pointer', position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(99,102,241,0.55), 0 0 0 1px rgba(255,255,255,0.15)',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(255,255,255,0.22),transparent)' }} />
          <AnimatePresence mode="wait">
            {open
              ? <motion.div key="close" initial={{ scale:0, rotate:-90 }} animate={{ scale:1, rotate:0 }} exit={{ scale:0 }} style={{ position:'relative',zIndex:1 }}><X size={22} color="#fff" /></motion.div>
              : <motion.div key="bot" initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }} style={{ position:'relative',zIndex:1 }}><Bot size={24} color="#fff" strokeWidth={1.8} /></motion.div>
            }
          </AnimatePresence>
          {unread > 0 && !open && (
            <div style={{ position:'absolute', top:-2, right:-2, width:18, height:18, borderRadius:'50%', background:'#ef4444', fontSize:10, fontWeight:900, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #050510' }}>{unread}</div>
          )}
        </motion.button>
      </div>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24, originX: 0, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 16 }}
            transition={{ duration: 0.3, ease: [0.34, 1.1, 0.64, 1] }}
            style={{
              position: 'fixed', bottom: 100, left: 28, zIndex: 7999,
              width: 340, maxWidth: 'calc(100vw - 56px)',
              background: 'rgba(7,7,22,0.97)', backdropFilter: 'blur(48px) saturate(200%)',
              border: '1px solid rgba(255,255,255,0.13)',
              borderRadius: 22,
              boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.1), 0 0 80px rgba(99,102,241,0.07)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 18px 14px',
              background: 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08) 50%,rgba(6,182,212,0.08))',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                  <Bot size={20} color="#fff" strokeWidth={1.8} />
                </div>
                <div style={{ position:'absolute', bottom:1, right:1, width:10, height:10, borderRadius:'50%', background:'#10b981', border:'2px solid #07071a', animation:'pulse-ring 2s ease-out infinite' }} />
              </div>
              <div>
                <div style={{ fontSize:14.5, fontWeight:800, letterSpacing:'-0.2px' }}>Fundo AI</div>
                <div style={{ fontSize:11, color:'#6ee7b7', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'#10b981' }} />
                  Online · ZIMSEC & Cambridge
                </div>
              </div>
              <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
                <div style={{ background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.22)', borderRadius:99, padding:'4px 10px', fontSize:10.5, fontWeight:700, color:'#a5b4fc', display:'flex', alignItems:'center', gap:4 }}>
                  <Zap size={9} /> AI
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={listRef} style={{ flex:1, overflowY:'auto', padding:'14px 14px 8px', display:'flex', flexDirection:'column', gap:10, maxHeight:320, minHeight:220 }}>
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity:0, y:10, scale:0.96 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  transition={{ duration:0.25, ease:[0.34,1.2,.64,1] }}
                  style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start' }}
                >
                  {m.role === 'bot' && (
                    <div style={{ width:24, height:24, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginRight:7, marginTop:2 }}>
                      <Bot size={12} color="#fff" />
                    </div>
                  )}
                  <div style={{
                    maxWidth:'76%', padding:'9px 13px', borderRadius:m.role==='user'?'14px 14px 4px 14px':'14px 14px 14px 4px',
                    background:m.role==='user'?'linear-gradient(135deg,#6366f1,#8b5cf6)':'rgba(255,255,255,0.07)',
                    border:m.role==='user'?'none':'1px solid rgba(255,255,255,0.09)',
                    fontSize:13.5, lineHeight:1.55, color:m.role==='user'?'#fff':'#eef0ff',
                    boxShadow:m.role==='user'?'0 4px 16px rgba(99,102,241,0.35)':'none',
                  }}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <div style={{ width:24, height:24, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Bot size={12} color="#fff" />
                  </div>
                  <div style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:'14px 14px 14px 4px', padding:'9px 14px' }}>
                    <TypingDots />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Suggestions */}
            {msgs.length <= 2 && (
              <div style={{ padding:'4px 14px 8px', display:'flex', gap:6, flexWrap:'wrap' }}>
                {SUGGESTIONS.map((s,i) => (
                  <motion.button
                    key={s} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:i*0.07 }}
                    onClick={() => sendMsg(s)}
                    style={{
                      padding:'5px 11px', borderRadius:99, fontSize:11.5, fontWeight:600, cursor:'pointer',
                      background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.22)',
                      color:'#c4b5fd', fontFamily:'inherit', whiteSpace:'nowrap', transition:'all .15s',
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(99,102,241,0.18)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(99,102,241,0.08)';}}
                  >{s}</motion.button>
                ))}
              </div>
            )}

            {/* Recording indicator */}
            <AnimatePresence>
              {recording && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden' }}>
                  <div style={{ padding:'10px 14px', background:'rgba(239,68,68,0.07)', borderTop:'1px solid rgba(239,68,68,0.15)', display:'flex', alignItems:'center', gap:8 }}>
                    <motion.div animate={{ scale:[1, 1.4, 1], opacity:[1, 0.5, 1] }} transition={{ duration:.7, repeat:Infinity }} style={{ width:8, height:8, borderRadius:'50%', background:'#ef4444', flexShrink:0 }} />
                    <span style={{ fontSize:12, color:'#fca5a5', fontWeight:600 }}>Recording…</span>
                    <div style={{ display:'flex', gap:2, marginLeft:6, alignItems:'center' }}>
                      {Array.from({length:18},(_,i)=><WaveBar key={i} i={i} active={recording} />)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div style={{ padding:'10px 14px 14px', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:8 }}>
              <button
                onClick={toggleRecord}
                style={{ width:34, height:34, borderRadius:10, background:recording?'rgba(239,68,68,0.15)':'rgba(255,255,255,0.06)', border:`1px solid ${recording?'rgba(239,68,68,0.4)':'rgba(255,255,255,0.1)'}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .2s' }}
              >
                {recording ? <MicOff size={14} style={{ color:'#fca5a5' }} /> : <Mic size={14} style={{ color:'rgba(238,240,255,.5)' }} />}
              </button>
              <input
                ref={inputRef}
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendMsg(); } }}
                placeholder="Ask anything about ZIMSEC…"
                style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:10, padding:'9px 13px', fontSize:13, color:'#eef0ff', outline:'none', fontFamily:'inherit' }}
                onFocus={e=>{ e.target.style.borderColor='rgba(99,102,241,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,0.12)'; }}
                onBlur={e=>{ e.target.style.borderColor='rgba(255,255,255,0.09)'; e.target.style.boxShadow='none'; }}
              />
              <motion.button
                onClick={()=>sendMsg()}
                whileHover={{ scale:1.08 }} whileTap={{ scale:0.93 }}
                disabled={!input.trim()}
                style={{ width:34, height:34, borderRadius:10, background:input.trim()?'linear-gradient(135deg,#6366f1,#8b5cf6)':'rgba(255,255,255,0.05)', border:'none', cursor:input.trim()?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background .2s', boxShadow:input.trim()?'0 4px 14px rgba(99,102,241,0.4)':'none' }}
              >
                <Send size={14} style={{ color:input.trim()?'#fff':'rgba(238,240,255,0.3)' }} />
              </motion.button>
            </div>

            {/* Footer */}
            <div style={{ padding:'0 14px 12px', textAlign:'center', fontSize:10.5, color:'rgba(238,240,255,0.28)', lineHeight:1.4 }}>
              Fundo AI · Powered by ZIMSEC & Cambridge Curriculum
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
