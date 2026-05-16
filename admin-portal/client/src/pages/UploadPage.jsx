import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, BookOpen, List, CheckSquare, File,
  Users, Database, Send, X, Plus, CheckCircle, AlertCircle,
  ArrowRight, Star, Zap, Shield, Clock, Award, RefreshCw,
  ChevronDown, Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useToast } from '../hooks/useToast.jsx';

const SUBJECTS = {
  primary: ['Mathematics','English','Shona','Ndebele','Science','Social Studies','Environmental Science','Art & Craft'],
  olevel: ['Mathematics','English Language','English Literature','History','Geography','Biology','Chemistry','Physics','Combined Science','Agriculture','Commerce','Accounting','Economics','Business Studies','Computer Science','Food & Nutrition','Fashion & Fabrics','Art','Shona','Ndebele'],
  alevel: ['Mathematics','Pure Mathematics','Statistics','Further Mathematics','Physics','Chemistry','Biology','History','Geography','Economics','Business Studies','Accounting','Computer Science','English Literature'],
};
const GRADES = {
  primary: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7'],
  olevel: ['Form 1','Form 2','Form 3','Form 4'],
  alevel: ['Lower 6','Upper 6'],
};
const CAT_LABEL = { paper: 'Past Paper', textbook: 'Textbook', syllabus: 'Syllabus', marking_scheme: 'Marking Scheme' };
const LVL_LABEL = { primary: 'Primary', olevel: 'O-Level', alevel: 'A-Level' };
const CAT_COLOR = { paper: '#a5b4fc', textbook: '#67e8f9', syllabus: '#6ee7b7', marking_scheme: '#fcd34d' };
const CAT_BG = { paper: 'rgba(99,102,241,0.12)', textbook: 'rgba(6,182,212,0.12)', syllabus: 'rgba(16,185,129,0.12)', marking_scheme: 'rgba(245,158,11,0.12)' };

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };

function StatCard({ icon: Icon, val, label, delay = 0 }) {
  return (
    <motion.div
      initial="hidden" animate="visible"
      variants={fadeUp} transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      style={{
        flex: 1, padding: '24px 20px', textAlign: 'center',
        borderRight: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 11,
        background: 'linear-gradient(135deg,rgba(99,102,241,0.10),rgba(139,92,246,0.10) 50%,rgba(6,182,212,0.10))',
        border: '1px solid rgba(99,102,241,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 10px',
      }}>
        <Icon size={17} style={{ color: '#a5b4fc' }} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1.2px' }}>{val}</div>
      <div style={{ fontSize: 11.5, color: 'rgba(240,242,255,0.48)', marginTop: 2, fontWeight: 500 }}>{label}</div>
    </motion.div>
  );
}

function RewardCard({ icon: Icon, color, bg, title, text, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true }}
      variants={fadeUp} transition={{ duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ y: hovered ? -6 : 0, boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.3),0 0 80px rgba(99,102,241,0.08)' : '0 0 0 rgba(0,0,0,0)' }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        background: hovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.09)'}`,
        borderRadius: 20, padding: '28px 24px', cursor: 'default',
        position: 'relative', overflow: 'hidden', transition: 'background .25s, border-color .25s',
      }}
    >
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08) 50%,rgba(6,182,212,0.08))', pointerEvents: 'none' }}
      />
      <div style={{ width: 46, height: 46, borderRadius: 13, background: bg, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, position: 'relative', zIndex: 1 }}>
        <Icon size={21} style={{ color, strokeWidth: 1.8 }} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, position: 'relative', zIndex: 1 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'rgba(240,242,255,0.5)', lineHeight: 1.65, position: 'relative', zIndex: 1 }}>{text}</div>
    </motion.div>
  );
}

function StepBubble({ icon: Icon, num, title, text, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true }}
      variants={fadeUp} transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 16px', position: 'relative', zIndex: 1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        animate={{ scale: hovered ? 1.1 : 1, borderColor: hovered ? 'rgba(99,102,241,0.7)' : 'rgba(99,102,241,0.35)', background: hovered ? 'rgba(99,102,241,0.12)' : 'rgba(5,5,26,0.9)', boxShadow: hovered ? '0 0 24px rgba(99,102,241,0.25)' : 'none' }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          width: 52, height: 52, borderRadius: '50%',
          border: '1px solid rgba(99,102,241,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 22, position: 'relative', backdropFilter: 'blur(12px)',
        }}
      >
        <Icon size={21} style={{ color: '#a5b4fc', strokeWidth: 1.8 }} />
        <div style={{
          position: 'absolute', top: -7, right: -7,
          width: 20, height: 20, borderRadius: '50%',
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
          fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          boxShadow: '0 2px 8px rgba(99,102,241,0.5)',
        }}>{num}</div>
      </motion.div>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 12.5, color: 'rgba(240,242,255,0.5)', lineHeight: 1.65 }}>{text}</div>
    </motion.div>
  );
}

export default function UploadPage() {
  const toast = useToast();
  const fileInputRef = useRef();
  const [stats, setStats] = useState({ totalResources: 0, totalUsers: 0 });
  const [recent, setRecent] = useState([]);
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [level, setLevel] = useState('olevel');
  const [category, setCategory] = useState('paper');
  const [grade, setGrade] = useState('Form 1');
  const [subject, setSubject] = useState('');
  const [curriculum, setCurriculum] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, label: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/community/stats').then(r => r.json()).then(d => {
      setStats({ totalResources: d.totalResources || 0, totalUsers: d.totalUsers || 0 });
      setRecent(d.recentApproved || []);
    }).catch(() => {});
  }, []);

  const onDrop = useCallback(e => {
    e.preventDefault(); setDragging(false);
    addFiles([...e.dataTransfer.files]);
  }, []);

  function addFiles(newFiles) {
    setFiles(prev => [...prev, ...newFiles.filter(f => prev.length < 30)].slice(0, 30));
  }

  function removeFile(i) { setFiles(prev => prev.filter((_, idx) => idx !== i)); }

  async function doUpload() {
    setError('');
    if (!files.length) { setError('Please select at least one file.'); return; }
    if (!subject) { setError('Please select a subject.'); return; }
    setUploading(true);
    const total = files.length;
    let done = 0, ok = 0, fail = 0;
    const subjectFull = curriculum ? `${subject} (${curriculum})` : subject;

    for (const f of files) {
      setProgress({ done, total, label: `Uploading ${done + 1} of ${total}…` });
      const fd = new FormData();
      fd.append('file', f, f.name);
      fd.append('title', f.name.replace(/\.[^.]+$/, ''));
      fd.append('category', category);
      fd.append('level', level);
      fd.append('grade', grade);
      fd.append('subject', subjectFull);
      fd.append('uploaderName', name);
      fd.append('uploaderPhone', phone);
      try {
        const res = await fetch('/api/public/upload', { method: 'POST', body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        ok++;
      } catch { fail++; }
      done++;
    }

    setProgress({ done: total, total, label: `Done — ${ok} uploaded${fail ? `, ${fail} failed` : ''}` });
    setUploading(false);

    if (ok > 0) {
      setTimeout(() => {
        setSuccess(true);
        fetch('/api/community/stats').then(r => r.json()).then(d => {
          setStats({ totalResources: d.totalResources || 0, totalUsers: d.totalUsers || 0 });
          setRecent(d.recentApproved || []);
        }).catch(() => {});
      }, 700);
    } else {
      setError(`All ${fail} upload(s) failed. Please try again.`);
    }
  }

  function reset() {
    setFiles([]); setSuccess(false); setError(''); setProgress({ done: 0, total: 0, label: '' });
  }

  const subjects = SUBJECTS[level] || [];
  const grades = GRADES[level] || [];

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="bg-mesh" />
      <div className="bg-grid" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />

        {/* ── Hero ── */}
        <section style={{ position: 'relative', textAlign: 'center', padding: '96px 36px 80px' }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.28)',
              borderRadius: 99, padding: '6px 16px', fontSize: 11.5, fontWeight: 700,
              color: '#a5b4fc', letterSpacing: '.6px', textTransform: 'uppercase', marginBottom: 32,
            }}
          >
            <Sparkles size={12} />
            Community Resource Hub
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.06, ease: [0.4, 0, 0.2, 1] }}
            style={{
              fontSize: 'clamp(2.8rem, 6.5vw, 4.4rem)',
              fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.08,
              marginBottom: 24,
            }}
          >
            Share Knowledge,<br />
            <span className="grad-text">Earn Rewards</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.4, 0, 0.2, 1] }}
            style={{
              fontSize: 18, color: 'rgba(240,242,255,0.55)',
              maxWidth: 520, margin: '0 auto 56px', lineHeight: 1.7,
            }}
          >
            Upload past papers, textbooks, and syllabuses. Get rewarded when your
            materials get approved and help thousands of students excel.
          </motion.p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
            style={{
              display: 'flex', alignItems: 'stretch', justifyContent: 'center',
              flexWrap: 'wrap', border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 20, background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)', maxWidth: 620, margin: '0 auto',
              overflow: 'hidden', boxShadow: '0 0 80px rgba(99,102,241,0.1)',
            }}
          >
            <StatCard icon={Database} val={stats.totalResources.toLocaleString()} label="Study Materials" delay={0.2} />
            <StatCard icon={Users} val={stats.totalUsers.toLocaleString()} label="Active Students" delay={0.26} />
            <StatCard icon={Award} val="Free" label="Always Free" delay={0.32} />
          </motion.div>
        </section>

        {/* ── How It Works ── */}
        <section style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 36px' }}>
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ duration: 0.5 }}
              style={{ marginBottom: 52 }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: '1.6px', color: '#a5b4fc', textTransform: 'uppercase', marginBottom: 12 }}>
                <Zap size={12} /> How it works
              </div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.8px', lineHeight: 1.2 }}>
                Four simple steps to share
              </h2>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, position: 'relative' }}>
              {/* Connector line */}
              <div style={{
                position: 'absolute', top: 26, left: 'calc(12.5% + 14px)', right: 'calc(12.5% + 14px)',
                height: 1, background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.4) 20%,rgba(6,182,212,0.4) 80%,transparent)',
              }} />
              <StepBubble icon={Upload} num={1} title="Upload Files" text="Drag & drop your PDFs, documents, or any study material." delay={0.05} />
              <StepBubble icon={FileText} num={2} title="Fill Details" text="Add subject, level, category and your contact info." delay={0.12} />
              <StepBubble icon={Shield} num={3} title="Admin Review" text="Our team reviews your submission for quality and accuracy." delay={0.19} />
              <StepBubble icon={Award} num={4} title="Get Rewarded" text="Earn bonus messages and images for every approved upload." delay={0.26} />
            </div>
          </div>
        </section>

        {/* ── Rewards ── */}
        <section style={{ padding: '20px 0 88px' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 36px' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} style={{ marginBottom: 44 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: '1.6px', color: '#a5b4fc', textTransform: 'uppercase', marginBottom: 12 }}>
                <Star size={12} /> Rewards
              </div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.8px', lineHeight: 1.2 }}>
                Why upload with us?
              </h2>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
              <RewardCard icon={Zap} color="#a5b4fc" bg="rgba(99,102,241,0.12)" title="Bonus AI Messages" text="Each approved upload earns you extra AI chat messages to use on the bot." delay={0.05} />
              <RewardCard icon={Star} color="#67e8f9" bg="rgba(6,182,212,0.10)" title="Extra Image Credits" text="Unlock additional AI image generation credits with every 3 uploads." delay={0.10} />
              <RewardCard icon={Award} color="#c4b5fd" bg="rgba(139,92,246,0.10)" title="Project Slots" text="Get additional AI project slots unlocked as you hit upload milestones." delay={0.15} />
              <RewardCard icon={Users} color="#6ee7b7" bg="rgba(16,185,129,0.10)" title="Community Impact" text="Your materials help thousands of students across Zimbabwe every day." delay={0.20} />
              <RewardCard icon={Shield} color="#fcd34d" bg="rgba(245,158,11,0.10)" title="Quality Guarantee" text="All materials are reviewed by our team before going live on the platform." delay={0.25} />
            </div>
          </div>
        </section>

        {/* ── Upload Form ── */}
        <section style={{ padding: '0 0 88px' }} id="upload">
          <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 36px' }}>
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  style={{
                    background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: 28, padding: '56px 48px', textAlign: 'center',
                    backdropFilter: 'blur(32px)',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.5),0 0 120px rgba(99,102,241,0.07)',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 12 }}
                    style={{
                      width: 76, height: 76, borderRadius: '50%',
                      background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 24px', position: 'relative',
                    }}
                  >
                    <CheckCircle size={32} style={{ color: '#6ee7b7' }} />
                    <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1px solid rgba(16,185,129,0.2)', animation: 'pulse-ring 1.5s ease-out infinite' }} />
                  </motion.div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#6ee7b7', marginBottom: 10 }}>Upload Submitted!</h3>
                  <p style={{ fontSize: 14, color: 'rgba(240,242,255,0.5)', lineHeight: 1.7, maxWidth: 360, margin: '0 auto 28px' }}>
                    Your materials are under review. You'll be rewarded once they're approved and go live.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                    {[{ icon: Zap, text: '+10 messages' }, { icon: Star, text: '+2 images' }, { icon: Award, text: 'Per 3 uploads' }].map(({ icon: Icon, text }) => (
                      <div key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.22)', borderRadius: 99, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#a5b4fc' }}>
                        <Icon size={12} /> {text}
                      </div>
                    ))}
                  </div>
                  <button onClick={reset} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', color: '#f0f2ff', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <RefreshCw size={14} /> Upload More
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: 28, padding: '48px 48px 44px',
                    backdropFilter: 'blur(32px) saturate(160%)',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.5),0 0 120px rgba(99,102,241,0.07)',
                  }}
                >
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>Upload Study Materials</h2>
                  <p style={{ fontSize: 13.5, color: 'rgba(240,242,255,0.48)', marginBottom: 32, lineHeight: 1.55 }}>
                    Submit past papers, syllabuses, textbooks, or marking schemes for the community.
                  </p>

                  {/* Drop zone */}
                  <motion.div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    animate={{ borderColor: dragging ? 'rgba(99,102,241,0.65)' : 'rgba(99,102,241,0.35)', background: dragging ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.025)', scale: dragging ? 1.01 : 1 }}
                    style={{
                      border: '1.5px dashed rgba(99,102,241,0.35)', borderRadius: 14,
                      padding: '44px 24px', textAlign: 'center', cursor: 'pointer',
                      position: 'relative', overflow: 'hidden', marginBottom: 20, transition: 'background .25s',
                    }}
                  >
                    <motion.div animate={{ opacity: dragging ? 1 : 0 }} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08) 50%,rgba(6,182,212,0.08))', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <motion.div
                        animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}
                      >
                        <Upload size={26} style={{ color: '#a5b4fc', strokeWidth: 1.6 }} />
                      </motion.div>
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>Drop files here or click to browse</div>
                      <div style={{ fontSize: 12.5, color: 'rgba(240,242,255,0.45)' }}>PDF, DOC, DOCX, PPTX — up to 80MB per file</div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 99, padding: '5px 12px', fontSize: 11, fontWeight: 600, color: '#a5b4fc' }}>
                        <Plus size={11} /> Add up to 30 files at once
                      </div>
                    </div>
                    <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.pptx,.ppt" style={{ display: 'none' }} onChange={e => { addFiles([...e.target.files]); e.target.value = ''; }} />
                  </motion.div>

                  {/* File queue */}
                  <AnimatePresence>
                    {files.length > 0 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'rgba(240,242,255,0.45)', padding: '0 2px', marginBottom: 10 }}>
                          <span>{files.length} file{files.length !== 1 ? 's' : ''} selected</span>
                          <button onClick={() => setFiles([])} style={{ background: 'none', border: 'none', color: 'rgba(240,242,255,0.4)', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', padding: '3px 8px', borderRadius: 6, transition: 'all .2s' }}>Clear all</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
                          {files.map((f, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '12px 14px' }}>
                              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <FileText size={16} style={{ color: '#a5b4fc' }} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                                <div style={{ fontSize: 11, color: 'rgba(240,242,255,0.4)', marginTop: 1 }}>{(f.size / 1024 / 1024).toFixed(2)} MB</div>
                              </div>
                              <button onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', color: 'rgba(240,242,255,0.4)', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', transition: 'all .2s' }}>
                                <X size={15} />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Progress */}
                  <AnimatePresence>
                    {uploading && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 16 }}>
                        <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 10, padding: '14px 16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                            <span>{progress.label}</span>
                            <span style={{ color: 'rgba(240,242,255,0.45)' }}>{progress.done}/{progress.total}</span>
                          </div>
                          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                            <motion.div
                              animate={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
                              transition={{ duration: 0.3 }}
                              style={{ height: '100%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', borderRadius: 99 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#fca5a5' }}>
                          <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <FormGroup label="Category *">
                      <select value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="paper">Past Paper</option>
                        <option value="textbook">Textbook</option>
                        <option value="syllabus">Syllabus</option>
                        <option value="marking_scheme">Marking Scheme</option>
                      </select>
                    </FormGroup>
                    <FormGroup label="Level *">
                      <select value={level} onChange={e => { setLevel(e.target.value); setSubject(''); setGrade(GRADES[e.target.value]?.[0] || ''); }}>
                        <option value="primary">Primary School</option>
                        <option value="olevel">O-Level</option>
                        <option value="alevel">A-Level</option>
                      </select>
                    </FormGroup>
                    <FormGroup label="Subject *">
                      <select value={subject} onChange={e => setSubject(e.target.value)}>
                        <option value="">— Select subject —</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </FormGroup>
                    <FormGroup label="Grade / Form">
                      <select value={grade} onChange={e => setGrade(e.target.value)}>
                        {grades.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </FormGroup>
                    <FormGroup label="Curriculum">
                      <select value={curriculum} onChange={e => setCurriculum(e.target.value)}>
                        <option value="">General</option>
                        <option value="ZIMSEC">ZIMSEC</option>
                        <option value="Cambridge">Cambridge</option>
                      </select>
                    </FormGroup>
                  </div>

                  <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '20px 0' }} />
                  <p style={{ fontSize: 12, color: 'rgba(240,242,255,0.4)', marginBottom: 14 }}>Optional: Add your info to receive rewards on the bot</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                    <FormGroup label="Your Name">
                      <input type="text" placeholder="e.g. Tendai M." value={name} onChange={e => setName(e.target.value)} />
                    </FormGroup>
                    <FormGroup label="WhatsApp Number">
                      <input type="text" placeholder="e.g. 263719647303" value={phone} onChange={e => setPhone(e.target.value)} />
                    </FormGroup>
                  </div>

                  <motion.button
                    onClick={doUpload}
                    disabled={uploading || !files.length}
                    whileHover={{ translateY: -2, boxShadow: '0 14px 40px rgba(99,102,241,0.5)' }}
                    whileTap={{ translateY: 0 }}
                    style={{
                      width: '100%', padding: '15px',
                      background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
                      color: '#fff', fontSize: 15, fontWeight: 700, border: 'none',
                      borderRadius: 10, cursor: uploading || !files.length ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                      boxShadow: '0 8px 32px rgba(99,102,241,0.4)', opacity: uploading || !files.length ? 0.6 : 1,
                      transition: 'opacity .2s',
                    }}
                  >
                    {uploading ? <><span className="spinner" style={{ width: 17, height: 17 }} /> Uploading…</> : <><Send size={17} strokeWidth={2.3} /> Submit for Review</>}
                  </motion.button>
                  <p style={{ fontSize: 12, color: 'rgba(240,242,255,0.3)', textAlign: 'center', marginTop: 14, lineHeight: 1.65 }}>
                    By uploading, you confirm these materials are for educational use. Rewards are credited after admin approval.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── Recent Materials ── */}
        {recent.length > 0 && (
          <section style={{ padding: '0 0 88px' }}>
            <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 36px' }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} style={{ marginBottom: 40 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: '1.6px', color: '#a5b4fc', textTransform: 'uppercase', marginBottom: 12 }}>
                  <Clock size={12} /> Recently Added
                </div>
                <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 800, letterSpacing: '-0.6px' }}>
                  Latest community uploads
                </h2>
              </motion.div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
                {recent.map((m, i) => (
                  <motion.div
                    key={m._id || i}
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={fadeUp} transition={{ duration: 0.45, delay: i * 0.05 }}
                    whileHover={{ y: -4, borderColor: 'rgba(99,102,241,0.28)', background: 'rgba(255,255,255,0.07)' }}
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, padding: '20px 18px', transition: 'background .22s, border-color .22s' }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: CAT_BG[m.category] || 'rgba(99,102,241,0.12)', border: `1px solid ${CAT_COLOR[m.category] || '#a5b4fc'}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <FileText size={15} style={{ color: CAT_COLOR[m.category] || '#a5b4fc', strokeWidth: 1.8 }} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(240,242,255,0.45)', lineHeight: 1.55 }}>
                      {CAT_LABEL[m.category] || m.category} · {LVL_LABEL[m.level] || m.level}<br />{m.subject}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </div>
  );
}

function FormGroup({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'rgba(240,242,255,0.45)' }}>{label}</label>
      {children}
    </div>
  );
}
