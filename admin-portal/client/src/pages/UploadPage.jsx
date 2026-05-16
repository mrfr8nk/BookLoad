import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  Upload, FileText, Database, Send, X, Plus, CheckCircle, AlertCircle,
  RefreshCw, Star, Zap, Shield, Clock, Award, Users, Sparkles, ArrowRight,
  BookOpen, ChevronRight, Globe,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import SpotlightCard from '../components/SpotlightCard.jsx';
import { useToast } from '../hooks/useToast.jsx';

/* ── Constants ──────────────────────────────────────────────────── */
const SUBJECTS = {
  primary: ['Mathematics','English','Shona','Ndebele','Science','Social Studies','Environmental Science','Art & Craft'],
  olevel: ['Mathematics','English Language','English Literature','History','Geography','Biology','Chemistry','Physics','Combined Science','Agriculture','Commerce','Accounting','Economics','Business Studies','Computer Science','Food & Nutrition','Fashion & Fabrics','Art','Shona','Ndebele'],
  alevel: ['Mathematics','Pure Mathematics','Statistics','Further Mathematics','Physics','Chemistry','Biology','History','Geography','Economics','Business Studies','Accounting','Computer Science','English Literature'],
};
const GRADES = {
  primary: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7'],
  olevel:  ['Form 1','Form 2','Form 3','Form 4'],
  alevel:  ['Lower 6','Upper 6'],
};
const CAT_LABEL = { paper:'Past Paper', textbook:'Textbook', syllabus:'Syllabus', marking_scheme:'Marking Scheme' };
const LVL_LABEL = { primary:'Primary', olevel:'O-Level', alevel:'A-Level' };
const CAT_COLOR = { paper:'#a5b4fc', textbook:'#67e8f9', syllabus:'#6ee7b7', marking_scheme:'#fcd34d' };
const CAT_BG    = { paper:'rgba(99,102,241,0.12)', textbook:'rgba(6,182,212,0.12)', syllabus:'rgba(16,185,129,0.12)', marking_scheme:'rgba(245,158,11,0.12)' };

/* ── Animation variants ─────────────────────────────────────────── */
const fadeUp   = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const fadeIn   = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const stagger  = { visible: { transition: { staggerChildren: 0.08 } } };

/* ── Tilt Card (3-D hover) ──────────────────────────────────────── */
function TiltCard({ children, style, className }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 25 });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]),  { stiffness: 200, damping: 25 });

  function onMove(e) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width  - 0.5);
    y.set((e.clientY - rect.top)  / rect.height - 0.5);
  }
  function onLeave() { x.set(0); y.set(0); }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ ...style, rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Stat counter ───────────────────────────────────────────────── */
function StatPill({ icon: Icon, val, label, delay }) {
  return (
    <motion.div
      initial="hidden" animate="visible" variants={fadeUp}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      style={{
        flex: 1, padding: '26px 20px', textAlign: 'center',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: 'linear-gradient(135deg,rgba(99,102,241,.14),rgba(139,92,246,.12) 50%,rgba(6,182,212,.1))',
        border: '1px solid rgba(99,102,241,.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 12px',
        boxShadow: '0 0 24px rgba(99,102,241,.12)',
      }}>
        <Icon size={18} style={{ color: '#a5b4fc' }} />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2, type: 'spring', stiffness: 260, damping: 14 }}
        style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1 }}
      >
        {val}
      </motion.div>
      <div style={{ fontSize: 11.5, color: 'rgba(238,240,255,0.42)', marginTop: 4, fontWeight: 500, letterSpacing: '.2px' }}>{label}</div>
    </motion.div>
  );
}

/* ── Reward Card ─────────────────────────────────────────────────── */
function RewardCard({ icon: Icon, color, bg, title, text, delay }) {
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true }}
      variants={fadeUp} transition={{ duration: 0.5, delay }}
    >
      <TiltCard style={{ height: '100%' }}>
        <SpotlightCard
          glowColor={`${color}18`}
          style={{
            height: '100%',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 20, padding: '28px 24px',
            cursor: 'default', position: 'relative', overflow: 'hidden',
            transition: 'border-color .25s, background .25s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = `${color}33`;
            e.currentTarget.style.background = 'rgba(255,255,255,0.065)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          }}
        >
          {/* Top gradient line */}
          <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: `linear-gradient(90deg, transparent, ${color}44, transparent)` }} />

          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: bg, border: `1px solid ${color}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 18,
            boxShadow: `0 0 20px ${color}20`,
          }}>
            <Icon size={22} style={{ color, strokeWidth: 1.8 }} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.2px' }}>{title}</div>
          <div style={{ fontSize: 13, color: 'rgba(238,240,255,0.48)', lineHeight: 1.7 }}>{text}</div>
        </SpotlightCard>
      </TiltCard>
    </motion.div>
  );
}

/* ── Step bubble ─────────────────────────────────────────────────── */
function Step({ icon: Icon, num, title, text, delay }) {
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true }}
      variants={fadeUp} transition={{ duration: 0.5, delay }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 12px', position: 'relative', zIndex: 1 }}
    >
      <motion.div
        whileHover={{ scale: 1.12, boxShadow: '0 0 32px rgba(99,102,241,0.4)' }}
        style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(5,5,26,.95)',
          border: '1px solid rgba(99,102,241,0.38)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 22, backdropFilter: 'blur(16px)',
          position: 'relative', transition: 'box-shadow .3s',
        }}
      >
        <Icon size={22} style={{ color: '#a5b4fc', strokeWidth: 1.8 }} />
        <div style={{
          position: 'absolute', top: -8, right: -8,
          width: 22, height: 22, borderRadius: '50%',
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
          fontSize: 10, fontWeight: 900, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(99,102,241,.6)',
        }}>{num}</div>
      </motion.div>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.2px' }}>{title}</div>
      <div style={{ fontSize: 12.5, color: 'rgba(238,240,255,0.48)', lineHeight: 1.7 }}>{text}</div>
    </motion.div>
  );
}

/* ── Form group ──────────────────────────────────────────────────── */
function FormGroup({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(238,240,255,0.4)' }}>{label}</label>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function UploadPage() {
  const toast = useToast();
  const fileInputRef = useRef();
  const [stats, setStats]   = useState({ totalResources: 0, totalUsers: 0 });
  const [recent, setRecent] = useState([]);
  const [files, setFiles]   = useState([]);
  const [dragging, setDragging] = useState(false);
  const [level, setLevel]     = useState('olevel');
  const [category, setCategory] = useState('paper');
  const [grade, setGrade]     = useState('Form 1');
  const [subject, setSubject] = useState('');
  const [curriculum, setCurriculum] = useState('');
  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState({ done: 0, total: 0, label: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

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
    setFiles(prev => [...prev, ...newFiles].slice(0, 30));
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

  function reset() { setFiles([]); setSuccess(false); setError(''); setProgress({ done: 0, total: 0, label: '' }); }

  const subjects = SUBJECTS[level] || [];
  const grades   = GRADES[level]   || [];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', textAlign: 'center', padding: '100px 36px 88px', overflow: 'hidden' }}>
        {/* Hero blob */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-55%)',
          width: 700, height: 500,
          background: 'radial-gradient(ellipse, rgba(99,102,241,.12) 0%, rgba(139,92,246,.06) 40%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(40px)',
        }} />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ marginBottom: 36 }}
        >
          <span className="glow-badge">
            <Sparkles size={11} /> Community Resource Hub
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.07, ease: [0.4, 0, 0.2, 1] }}
          style={{
            fontSize: 'clamp(3rem, 7vw, 5rem)',
            fontWeight: 900, letterSpacing: '-3px', lineHeight: 1.04,
            marginBottom: 26, maxWidth: 800, margin: '0 auto 26px',
          }}
        >
          Share Knowledge,
          <br />
          <span className="grad-text">Earn Rewards</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.14 }}
          style={{
            fontSize: 19, color: 'rgba(238,240,255,0.52)',
            maxWidth: 500, margin: '0 auto 60px', lineHeight: 1.72, fontWeight: 400,
          }}
        >
          Upload past papers, textbooks, and syllabuses.
          Get rewarded when your materials are approved.
        </motion.p>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          style={{
            display: 'flex', alignItems: 'stretch', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 22,
            background: 'rgba(255,255,255,0.035)',
            backdropFilter: 'blur(28px) saturate(160%)',
            maxWidth: 580, margin: '0 auto',
            overflow: 'hidden',
            boxShadow: '0 0 0 1px rgba(99,102,241,.06), 0 24px 80px rgba(0,0,0,.35), 0 0 120px rgba(99,102,241,.07)',
          }}
        >
          <StatPill icon={Database} val={stats.totalResources.toLocaleString()} label="Study Materials" delay={0.25} />
          <StatPill icon={Users}    val={stats.totalUsers.toLocaleString()}     label="Active Students"  delay={0.31} />
          <StatPill icon={Award}    val="Free"                                  label="Always Free"      delay={0.37} />
        </motion.div>

        {/* CTA arrow */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{ marginTop: 52, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}
        >
          <motion.a
            href="#upload"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              padding: '13px 28px', borderRadius: 12,
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
              color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 8px 36px rgba(99,102,241,.5)',
              border: '1px solid rgba(255,255,255,.12)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(255,255,255,.15),transparent)', borderRadius: 'inherit' }} />
            <Upload size={17} strokeWidth={2.2} style={{ position: 'relative' }} />
            <span style={{ position: 'relative' }}>Upload Materials</span>
          </motion.a>
          <motion.a
            href="#how"
            whileHover={{ scale: 1.04, y: -2 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 24px', borderRadius: 12,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(238,240,255,.75)', fontSize: 15, fontWeight: 600, textDecoration: 'none',
              backdropFilter: 'blur(12px)',
            }}
          >
            How it works <ChevronRight size={16} />
          </motion.a>
        </motion.div>
      </section>

      {/* ── TRUST LOGOS ─────────────────────────────────────────── */}
      <section style={{ padding: '0 36px 72px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: 'rgba(238,240,255,0.28)', marginBottom: 28 }}>
              Supporting Zimbabwe's top exam boards
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              {['ZIMSEC O-Level', 'ZIMSEC A-Level', 'Cambridge IGCSE', 'Cambridge A-Level', 'Primary Curriculum'].map((b, i) => (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  style={{
                    padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                    color: 'rgba(238,240,255,0.5)', letterSpacing: '.2px',
                  }}
                >{b}</motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section id="how" style={{ padding: '0 0 84px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 36px' }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} transition={{ duration: 0.5 }}
            style={{ marginBottom: 56 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: '1.6px', color: '#a5b4fc', textTransform: 'uppercase', marginBottom: 14 }}>
              <Zap size={12} /> How it works
            </div>
            <h2 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.9px', lineHeight: 1.15 }}>
              Four simple steps
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, position: 'relative' }}>
            <div style={{
              position: 'absolute', top: 27, left: 'calc(12.5% + 16px)', right: 'calc(12.5% + 16px)',
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(99,102,241,.5) 20%, rgba(6,182,212,.4) 80%, transparent)',
            }} />
            <Step icon={Upload}      num={1} title="Choose Files"      text="Drag & drop up to 30 PDFs or documents at once."             delay={0.05} />
            <Step icon={FileText}    num={2} title="Add Details"       text="Set the subject, level, and type of material."               delay={0.12} />
            <Step icon={Shield}      num={3} title="Admin Review"      text="Our team verifies quality before publishing."                delay={0.19} />
            <Step icon={Award}       num={4} title="Get Rewarded"      text="Earn bonus messages & image credits after approval."         delay={0.26} />
          </div>
        </div>
      </section>

      {/* ── REWARDS ─────────────────────────────────────────────── */}
      <section style={{ padding: '0 0 88px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 36px' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} style={{ marginBottom: 44 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: '1.6px', color: '#a5b4fc', textTransform: 'uppercase', marginBottom: 14 }}>
              <Star size={12} /> Rewards
            </div>
            <h2 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.9px' }}>Why upload with us?</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            <RewardCard icon={Zap}    color="#a5b4fc" bg="rgba(99,102,241,0.12)"  title="Bonus AI Messages"   text="Each approved upload earns extra AI chat messages."            delay={0.04} />
            <RewardCard icon={Star}   color="#67e8f9" bg="rgba(6,182,212,0.10)"   title="Extra Image Credits" text="Unlock image generation credits for every 3 uploads."          delay={0.09} />
            <RewardCard icon={Award}  color="#c4b5fd" bg="rgba(139,92,246,0.10)"  title="Project Slots"       text="Earn additional AI project slots as you hit milestones."       delay={0.14} />
            <RewardCard icon={Users}  color="#6ee7b7" bg="rgba(16,185,129,0.10)"  title="Community Impact"    text="Your materials help thousands of students every day."           delay={0.19} />
            <RewardCard icon={Shield} color="#fcd34d" bg="rgba(245,158,11,0.10)"  title="Quality Guarantee"   text="All submissions are reviewed before going live."               delay={0.24} />
          </div>
        </div>
      </section>

      {/* ── UPLOAD FORM ─────────────────────────────────────────── */}
      <section style={{ padding: '0 0 96px' }} id="upload">
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 36px' }}>
          <AnimatePresence mode="wait">
            {success ? (
              /* ── Success State ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{
                  background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.16)',
                  borderRadius: 28, padding: '64px 48px', textAlign: 'center',
                  backdropFilter: 'blur(40px)',
                  boxShadow: '0 40px 80px rgba(0,0,0,.5), 0 0 120px rgba(16,185,129,.06)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(16,185,129,.5),transparent)' }} />
                <div style={{ position: 'absolute', top: -100, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.18, type: 'spring', stiffness: 220, damping: 12 }}
                  style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.28)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px', position: 'relative',
                  }}
                >
                  <CheckCircle size={34} style={{ color: '#6ee7b7' }} />
                  <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: '1px solid rgba(16,185,129,.18)', animation: 'pulse-ring 1.6s ease-out infinite' }} />
                </motion.div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#6ee7b7', marginBottom: 10, letterSpacing: '-0.5px' }}>Upload Submitted!</h3>
                <p style={{ fontSize: 14.5, color: 'rgba(238,240,255,.5)', lineHeight: 1.7, maxWidth: 360, margin: '0 auto 32px' }}>
                  Your materials are under review. You'll be rewarded once they're approved and go live.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
                  {[{ icon: Zap, text: '+10 messages' }, { icon: Star, text: '+2 images' }, { icon: Award, text: 'Per 3 uploads' }].map(({ icon: Icon, text }) => (
                    <div key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.22)', borderRadius: 99, padding: '7px 14px', fontSize: 12, fontWeight: 600, color: '#a5b4fc' }}>
                      <Icon size={12} /> {text}
                    </div>
                  ))}
                </div>
                <motion.button
                  onClick={reset}
                  whileHover={{ scale: 1.03, y: -2 }}
                  style={{
                    background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.16)',
                    color: '#eef0ff', padding: '12px 28px', borderRadius: 10,
                    fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <RefreshCw size={14} /> Upload More
                </motion.button>
              </motion.div>
            ) : (
              /* ── Upload Form ── */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              >
                <SpotlightCard
                  glowColor="rgba(99,102,241,0.10)"
                  style={{
                    background: 'rgba(255,255,255,0.035)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    borderRadius: 28, padding: '48px 48px 44px',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    boxShadow: '0 40px 80px rgba(0,0,0,.5), 0 0 120px rgba(99,102,241,.06)',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* Card top glow line */}
                  <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(99,102,241,.5),transparent)' }} />

                  <h2 style={{ fontSize: '1.55rem', fontWeight: 900, letterSpacing: '-0.6px', marginBottom: 6 }}>Upload Study Materials</h2>
                  <p style={{ fontSize: 13.5, color: 'rgba(238,240,255,.47)', marginBottom: 32, lineHeight: 1.6 }}>
                    Submit past papers, syllabuses, textbooks, or marking schemes for the community.
                  </p>

                  {/* Drop zone */}
                  <motion.div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    animate={{
                      borderColor: dragging ? 'rgba(99,102,241,.7)' : 'rgba(99,102,241,.35)',
                      background: dragging ? 'rgba(99,102,241,.08)' : 'rgba(99,102,241,.025)',
                      scale: dragging ? 1.015 : 1,
                    }}
                    transition={{ duration: 0.22 }}
                    style={{
                      border: '1.5px dashed rgba(99,102,241,.35)', borderRadius: 14,
                      padding: '48px 24px', textAlign: 'center', cursor: 'pointer',
                      marginBottom: 20, position: 'relative', overflow: 'hidden',
                    }}
                  >
                    {dragging && (
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(99,102,241,.07),rgba(139,92,246,.05) 50%,rgba(6,182,212,.05))', borderRadius: 14, pointerEvents: 'none' }} />
                    )}
                    <motion.div
                      animate={{ y: [0, -9, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        width: 60, height: 60, borderRadius: 18,
                        background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.24)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 18px',
                        boxShadow: '0 0 28px rgba(99,102,241,.15)',
                      }}
                    >
                      <Upload size={28} style={{ color: '#a5b4fc', strokeWidth: 1.6 }} />
                    </motion.div>
                    <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 6 }}>
                      {dragging ? 'Drop to add files' : 'Drop files here or click to browse'}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'rgba(238,240,255,.4)', marginBottom: 16 }}>
                      PDF, DOC, DOCX, PPTX — up to 80MB per file
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.2)', borderRadius: 99, padding: '5px 13px', fontSize: 11.5, fontWeight: 600, color: '#a5b4fc' }}>
                      <Plus size={11} /> Add up to 30 files at once
                    </div>
                    <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.pptx,.ppt" style={{ display: 'none' }} onChange={e => { addFiles([...e.target.files]); e.target.value = ''; }} />
                  </motion.div>

                  {/* File queue */}
                  <AnimatePresence>
                    {files.length > 0 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, letterSpacing: '.7px', textTransform: 'uppercase', color: 'rgba(238,240,255,.4)', marginBottom: 10 }}>
                          <span>{files.length} file{files.length !== 1 ? 's' : ''} queued</span>
                          <button onClick={() => setFiles([])} style={{ background: 'none', border: 'none', color: 'rgba(238,240,255,.4)', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', padding: '3px 8px', borderRadius: 6 }}>Clear all</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 200, overflowY: 'auto' }}>
                          {files.map((f, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                              style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '10px 14px' }}
                            >
                              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <FileText size={15} style={{ color: '#a5b4fc' }} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                                <div style={{ fontSize: 11, color: 'rgba(238,240,255,.4)', marginTop: 1 }}>{(f.size / 1024 / 1024).toFixed(2)} MB</div>
                              </div>
                              <button onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', color: 'rgba(238,240,255,.4)', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex' }}><X size={14} /></button>
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
                        <div style={{ background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.18)', borderRadius: 10, padding: '14px 16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 9 }}>
                            <span>{progress.label}</span>
                            <span style={{ color: 'rgba(238,240,255,.4)' }}>{progress.done}/{progress.total}</span>
                          </div>
                          <div style={{ height: 5, background: 'rgba(255,255,255,.07)', borderRadius: 99, overflow: 'hidden' }}>
                            <motion.div
                              animate={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
                              transition={{ duration: 0.35 }}
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
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.22)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#fca5a5' }}>
                          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Fields */}
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

                  <div style={{ height: 1, background: 'rgba(255,255,255,.07)', margin: '20px 0' }} />
                  <p style={{ fontSize: 12, color: 'rgba(238,240,255,.38)', marginBottom: 14 }}>Optional — add your info to receive rewards on the bot</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
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
                    whileHover={!uploading && files.length ? { y: -2, boxShadow: '0 16px 48px rgba(99,102,241,.6)' } : {}}
                    whileTap={!uploading && files.length ? { y: 0 } : {}}
                    style={{
                      width: '100%', padding: '15px',
                      background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
                      color: '#fff', fontSize: 15.5, fontWeight: 700, border: 'none',
                      borderRadius: 12, cursor: uploading || !files.length ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      boxShadow: '0 8px 36px rgba(99,102,241,.45)',
                      opacity: uploading || !files.length ? 0.55 : 1,
                      transition: 'opacity .2s',
                      position: 'relative', overflow: 'hidden',
                    }}
                  >
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(255,255,255,.12),transparent)', borderRadius: 'inherit' }} />
                    {uploading
                      ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Uploading…</>
                      : <><Send size={17} strokeWidth={2.3} style={{ position: 'relative' }} /><span style={{ position: 'relative' }}>Submit for Review</span></>
                    }
                  </motion.button>
                  <p style={{ fontSize: 12, color: 'rgba(238,240,255,.28)', textAlign: 'center', marginTop: 14, lineHeight: 1.7 }}>
                    By uploading, you confirm these materials are for educational use.
                    Rewards are credited after admin approval.
                  </p>
                </SpotlightCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── RECENT MATERIALS ───────────────────────────────────── */}
      {recent.length > 0 && (
        <section style={{ padding: '0 0 88px' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 36px' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} style={{ marginBottom: 40 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: '1.6px', color: '#a5b4fc', textTransform: 'uppercase', marginBottom: 14 }}>
                <Clock size={12} /> Recently Added
              </div>
              <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 900, letterSpacing: '-0.6px' }}>Latest community uploads</h2>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: 12 }}>
              {recent.map((m, i) => (
                <motion.div
                  key={m._id || i}
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="glass-card"
                  style={{ padding: '20px 18px' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: CAT_BG[m.category] || 'rgba(99,102,241,.12)', border: `1px solid ${CAT_COLOR[m.category] || '#a5b4fc'}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <FileText size={15} style={{ color: CAT_COLOR[m.category] || '#a5b4fc', strokeWidth: 1.8 }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                  <div style={{ fontSize: 11, color: 'rgba(238,240,255,.42)', lineHeight: 1.6 }}>
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
  );
}
