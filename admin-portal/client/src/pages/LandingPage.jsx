import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, MessageCircle, Check, X as XIcon, Play,
  BookOpen, FileSearch, Mic, HelpCircle, Calculator, Bot,
  FlaskConical, Code2, GraduationCap, Users, TrendingUp,
  Sparkles, Zap, Clock, Volume2, Image as Img, FileText,
  ChevronDown, Star, Menu, X, Shield, Rocket, Brain,
  BookMarked, FolderOpen, ClipboardList, Youtube, Search,
  Award, CheckCircle2, Lightbulb,
} from 'lucide-react';

/* ─────────────── DESIGN TOKENS ─────────────── */
const C = {
  hero:     '#f3eeff',
  purple:   '#7c3aed',
  purpleDk: '#6d28d9',
  dark:     '#1a0a2e',
  gray50:   '#f9fafb',
  gray100:  '#f3f4f6',
  gray200:  '#e5e7eb',
  gray500:  '#6b7280',
  gray700:  '#374151',
  gray900:  '#111827',
};
const serif = { fontFamily:"'Playfair Display', Georgia, serif", fontStyle:'italic', color:C.purple };

/* ─────────────── DATA ─────────────── */
const SCHOOLS = [
  'ZIMSEC', 'University of Zimbabwe', 'NUST',
  'Midlands State University', 'Harare Institute of Technology',
  'Great Zimbabwe University', 'Chinhoyi University',
  'Lupane State University', 'Bindura University',
];

const PAIN_CARDS = [
  { icon:FileSearch, title:'Lost in Past Papers', quote:'"I downloaded 20 papers but have no idea which ones to study."' },
  { icon:FolderOpen, title:'Scattered Resources', quote:'"My notes are in 5 different places — it\'s a mess every exam season."' },
  { icon:Brain,      title:'Read It. Forgot It.', quote:'"I studied chapter 3 four times and still can\'t remember it on exam day."' },
  { icon:HelpCircle, title:'Stuck with No Help', quote:'"It\'s midnight, I\'m confused, and there\'s no one to explain this to me."' },
];

const FEATURES = [
  { icon:Bot,        title:'AI Notes',         sub:'Notes that write themselves',     desc:'Ask Fundo AI any topic and get structured, curriculum-aligned notes in seconds. Less copying, more understanding.',  color:'#7c3aed', bg:'#f5f3ff', mockup:'notes' },
  { icon:Volume2,    title:'Voice Learning',   sub:'Learn by listening',              desc:'Send voice notes, get voice replies. Fundo AI transcribes, understands, and teaches through audio — perfect for on-the-go studying.', color:'#059669', bg:'#ecfdf5', mockup:'voice' },
  { icon:ClipboardList,title:'Past Papers',    sub:'Practice like it\'s the real exam', desc:'Access 270+ ZIMSEC and Cambridge past papers organised by subject, level, and year. With marking scheme guidance.',   color:'#2563eb', bg:'#eff6ff', mockup:'papers' },
  { icon:Img,        title:'Image Analysis',   sub:'Visual problem solving',          desc:'Photograph a complex diagram, textbook page, or exam question. Fundo AI reads, analyses, and explains it all.',        color:'#d97706', bg:'#fffbeb', mockup:'image' },
];

const STEPS = [
  { n:1, title:'Start a Chat Session',       desc:'Open WhatsApp and send any message to the Fundo AI number. A dedicated study space where everything stays organised from the start.' },
  { n:2, title:'Ask or Upload Anything',     desc:'Send text, voice notes, images, PDFs, or questions. Fundo AI instantly understands your subject and level.' },
  { n:3, title:'Instant AI Processing',      desc:'Within seconds, you receive structured explanations, past paper answers, AI notes, quiz questions, or voice guidance.' },
  { n:4, title:'Learn, Practice, Master',    desc:'Use flash quizzes, mock exams, and study plans to track your progress and master every topic before exam day.' },
];

const WHO_TABS = [
  { label:'O-Level Students',   sub:'Forms 3 & 4',          icon:BookOpen,      color:'#7c3aed', features:['ZIMSEC O-Level past papers & marking schemes','Step-by-step Maths & Science explanations','AI notes for all subjects','24/7 exam prep support'] },
  { label:'A-Level Students',   sub:'Upper & Lower 6',      icon:GraduationCap, color:'#059669', features:['A-Level syllabus alignment','Advanced concept breakdowns','Project & coursework guidance','Stage 5 automated completion'] },
  { label:'Primary School',     sub:'Grades 1–7',           icon:BookMarked,    color:'#2563eb', features:['Age-appropriate explanations','Fun interactive quizzes','Homework & assignment help','Simple voice-note learning'] },
  { label:'University Students',sub:'Tertiary Level',       icon:Award,         color:'#d97706', features:['Research & project support','PDF document summarization','Complex topic breakdowns','Career & professional guidance'] },
  { label:'Self-Learners',      sub:'Independent Study',    icon:Lightbulb,     color:'#9333ea', features:['Custom study plans','Cross-subject resource library','Practice tests & mock exams','Flexible 24/7 access'] },
];

const OLD_WAY  = ['Scattered materials','Random study methods','Manual note-taking','Hours searching for papers','No immediate help'];
const NEW_WAY  = ['Everything in one WhatsApp chat','Smart, structured study plans','AI-generated notes instantly','270+ organised past papers','24/7 AI tutor on demand'];

const TOOLS = [
  { icon:ClipboardList, label:'AI Past Papers',       color:'#7c3aed' },
  { icon:FileSearch,    label:'AI PDF Analysis',      color:'#e11d48' },
  { icon:Volume2,       label:'AI Voice Learning',    color:'#059669' },
  { icon:HelpCircle,    label:'AI Quiz Generator',    color:'#d97706' },
  { icon:FileText,      label:'AI Project Generator', color:'#2563eb' },
  { icon:Img,           label:'AI Image Solver',      color:'#9333ea' },
  { icon:Calculator,    label:'AI Maths Solver',      color:'#db2777' },
  { icon:FlaskConical,  label:'AI Science Guide',     color:'#0891b2' },
  { icon:FileText,      label:'AI Essay Writer',      color:'#059669' },
  { icon:Zap,           label:'AI Flash Cards',       color:'#7c3aed' },
  { icon:CheckCircle2,  label:'AI Marking Schemes',   color:'#2563eb' },
  { icon:Code2,         label:'AI Coding Helper',     color:'#d97706' },
];

/* ─────────────── HELPERS ─────────────── */
function useCountUp(target, inView) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let c = 0, s = target / 60;
    const t = setInterval(() => { c += s; if (c >= target) { setV(target); clearInterval(t); } else setV(Math.floor(c)); }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return v;
}

/* ─────────────── NAVBAR ─────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:500, background:'rgba(255,255,255,.98)', backdropFilter:'blur(16px)', borderBottom:`1px solid ${scrolled ? C.gray200 : 'transparent'}`, boxShadow:scrolled?'0 1px 12px rgba(0,0,0,.06)':'none', transition:'all .25s', height:64, display:'flex', alignItems:'center', padding:'0 clamp(16px,4vw,56px)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {/* Logo */}
        <a href="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none', flexShrink:0 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#7c3aed,#8b5cf6)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="Fundo" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}} />
          </div>
          <div>
            <div style={{ fontSize:17, fontWeight:900, color:C.gray900, letterSpacing:'-.3px', lineHeight:1 }}>fundo<span style={{ color:C.purple }}>ai</span><sup style={{ fontSize:8, color:C.gray500, fontWeight:700, letterSpacing:'.3px' }}>®</sup></div>
          </div>
        </a>

        {/* Desktop links */}
        <div style={{ display:'flex', alignItems:'center', gap:0 }} className="hide-mobile">
          {[['Features','#features'],['How It Works','#how'],['Pricing','#pricing'],['Upload','#upload-cta']].map(([l,h]) => (
            <a key={h} href={h} style={{ fontSize:14, fontWeight:500, color:C.gray500, padding:'8px 16px', textDecoration:'none', borderRadius:8, transition:'all .15s' }}
              onMouseEnter={e=>{e.target.style.color=C.gray900;e.target.style.background=C.gray100;}}
              onMouseLeave={e=>{e.target.style.color=C.gray500;e.target.style.background='none';}}>
              {l}
            </a>
          ))}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10 }} className="hide-mobile">
          <a href="/admin" style={{ fontSize:14, fontWeight:500, color:C.gray500, textDecoration:'none', padding:'7px 16px', borderRadius:8, transition:'all .15s' }}
            onMouseEnter={e=>e.target.style.color=C.gray900} onMouseLeave={e=>e.target.style.color=C.gray500}>
            Sign in
          </a>
          <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
            style={{ background:C.purple, color:'#fff', textDecoration:'none', padding:'8px 20px', borderRadius:8, fontSize:14, fontWeight:700, boxShadow:`0 2px 8px rgba(124,58,237,.25)`, transition:'all .15s' }}
            onMouseEnter={e=>{e.currentTarget.style.background=C.purpleDk;e.currentTarget.style.transform='translateY(-1px)';}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.purple;e.currentTarget.style.transform='none';}}>
            Try for Free
          </a>
        </div>

        <button onClick={()=>setOpen(p=>!p)} style={{ display:'none', background:'none', border:'1px solid '+C.gray200, borderRadius:8, padding:8, cursor:'pointer' }} className="hide-desktop">
          {open?<X size={17}/>:<Menu size={17}/>}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
              style={{ position:'absolute', top:64, left:0, right:0, background:'#fff', borderBottom:`1px solid ${C.gray200}`, boxShadow:'0 8px 24px rgba(0,0,0,.08)', padding:'16px clamp(16px,4vw,56px)', display:'flex', flexDirection:'column', gap:4 }} className="hide-desktop">
              {[['Features','#features'],['How It Works','#how'],['Pricing','#pricing'],['Upload Materials','/upload'],['Admin','/admin']].map(([l,h])=>(
                <a key={h} href={h} onClick={()=>setOpen(false)} style={{ fontSize:15, fontWeight:600, color:C.gray700, padding:'10px 12px', borderRadius:8, textDecoration:'none', background:C.gray50 }}>{l}</a>
              ))}
              <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
                style={{ background:C.purple, color:'#fff', textDecoration:'none', padding:'12px', borderRadius:9, fontSize:15, fontWeight:700, textAlign:'center', marginTop:8 }}>
                Try for Free
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

/* ─────────────── HERO ─────────────── */
function Hero() {
  return (
    <section style={{ background:`linear-gradient(180deg, ${C.hero} 0%, #ffffff 85%)`, paddingTop:64, minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <div style={{ maxWidth:760, margin:'0 auto', padding:'72px clamp(16px,4vw,32px) 0', textAlign:'center' }}>
        {/* Badge */}
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{duration:.4}}
          style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#ede8ff', border:'none', borderRadius:99, padding:'5px 16px', marginBottom:20 }}>
          <span style={{ fontSize:12.5, fontWeight:700, color:C.purple }}>#1 AI Study Tool for Zimbabwe</span>
        </motion.div>

        {/* Avatars + social proof */}
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.4,delay:.06}}
          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginBottom:28 }}>
          <div style={{ display:'flex' }}>
            {['#7c3aed','#059669','#2563eb','#d97706'].map((c,i)=>(
              <div key={i} style={{ width:30, height:30, borderRadius:'50%', background:c, border:'2.5px solid #fff', marginLeft:i?-10:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff', flexShrink:0 }}>
                {['Z','T','K','R'][i]}
              </div>
            ))}
          </div>
          <span style={{ fontSize:14, color:C.gray500 }}>Used by <strong style={{ color:C.gray900 }}>2,000+</strong> students to study smarter, not longer.</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.55,delay:.1,ease:[.4,0,.2,1]}}
          style={{ fontSize:'clamp(2.8rem,6vw,4.2rem)', fontWeight:900, color:C.gray900, lineHeight:1.08, letterSpacing:'-.05em', marginBottom:22 }}>
          Study Smarter with AI.<br />
          Remember More.{' '}
          <span style={{ ...serif, fontSize:'clamp(2.8rem,6vw,4.2rem)', fontWeight:900 }}>Stress Less</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.5,delay:.18}}
          style={{ fontSize:'clamp(1rem,2vw,1.15rem)', color:C.gray500, lineHeight:1.75, maxWidth:560, margin:'0 auto 36px' }}>
          Turn any question, past paper, or topic into a complete AI study session — so you understand more, remember longer, and stress less.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.45,delay:.24}}
          style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:56 }}>
          <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:9, background:C.purple, color:'#fff', textDecoration:'none', padding:'13px 28px', borderRadius:9, fontSize:15.5, fontWeight:700, boxShadow:`0 4px 20px rgba(124,58,237,.30)`, transition:'all .18s' }}
            onMouseEnter={e=>{e.currentTarget.style.background=C.purpleDk;e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 28px rgba(124,58,237,.36)';}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.purple;e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=`0 4px 20px rgba(124,58,237,.30)`;}}>
            Start My Free Study Session <ArrowRight size={16}/>
          </a>
          <a href="#how"
            style={{ display:'inline-flex', alignItems:'center', gap:9, background:'#fff', color:C.gray700, textDecoration:'none', padding:'13px 24px', borderRadius:9, fontSize:15, fontWeight:600, border:`1.5px solid ${C.gray200}`, boxShadow:'0 1px 4px rgba(0,0,0,.06)', transition:'all .15s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.purple;e.currentTarget.style.color=C.purple;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.gray200;e.currentTarget.style.color=C.gray700;}}>
            <Play size={14} fill="currentColor"/> Watch How It Works
          </a>
        </motion.div>
      </div>

      {/* App preview */}
      <motion.div initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:.65,delay:.32,ease:[.4,0,.2,1]}}
        style={{ width:'100%', maxWidth:940, margin:'0 auto', padding:'0 clamp(16px,4vw,40px) 0' }}>
        <div style={{ background:'#fff', border:`1px solid ${C.gray200}`, borderRadius:'20px 20px 0 0', boxShadow:'0 -4px 40px rgba(124,58,237,.10), 0 0 0 1px rgba(0,0,0,.05)', overflow:'hidden' }}>
          {/* Browser chrome */}
          <div style={{ background:'#f9fafb', borderBottom:`1px solid ${C.gray200}`, padding:'10px 16px', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ display:'flex', gap:6 }}>
              {['#ff5f57','#ffbd2e','#28c840'].map(c=><div key={c} style={{ width:11, height:11, borderRadius:'50%', background:c }}/>)}
            </div>
            <div style={{ flex:1, background:'#fff', border:`1px solid ${C.gray200}`, borderRadius:6, padding:'4px 12px', display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:C.purple }}/>
              <span style={{ fontSize:12, color:C.gray500, fontWeight:500 }}>fundo.ai — Your AI Study Partner</span>
            </div>
          </div>
          {/* App body */}
          <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', minHeight:340 }}>
            {/* Sidebar */}
            <div style={{ background:'#faf9fe', borderRight:`1px solid ${C.gray200}`, padding:'16px 12px' }}>
              <div style={{ fontSize:10.5, fontWeight:700, color:C.gray500, letterSpacing:'.8px', textTransform:'uppercase', marginBottom:10, paddingLeft:8 }}>My Study Sessions</div>
              {['O-Level Maths 2024','ZIMSEC Biology','English Literature','Physics Past Papers','Chemistry Notes'].map((s,i)=>(
                <div key={s} style={{ padding:'8px 10px', borderRadius:8, marginBottom:2, background:i===0?'#ede8ff':'transparent', cursor:'pointer' }}>
                  <div style={{ fontSize:12.5, fontWeight:i===0?700:500, color:i===0?C.purple:C.gray700, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s}</div>
                </div>
              ))}
              <div style={{ marginTop:16, padding:'8px 10px', borderRadius:8, border:`1px dashed ${C.gray200}`, display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
                <span style={{ fontSize:18, color:C.purple, lineHeight:1 }}>+</span>
                <span style={{ fontSize:12.5, color:C.purple, fontWeight:600 }}>New Session</span>
              </div>
            </div>
            {/* Main chat area */}
            <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', borderBottom:`1px solid ${C.gray200}`, paddingBottom:12, marginBottom:4 }}>
                {['AI Chat','AI Notes','Past Papers','Quiz','AI Tutor'].map((t,i)=>(
                  <div key={t} style={{ padding:'5px 14px', borderRadius:99, fontSize:12.5, fontWeight:600, background:i===0?C.purple:'transparent', color:i===0?'#fff':C.gray500, border:`1px solid ${i===0?C.purple:C.gray200}`, cursor:'pointer' }}>{t}</div>
                ))}
              </div>
              {[
                { from:'user', text:'Can you help me with O-Level Maths, specifically surds and indices?' },
                { from:'ai', text:'Absolutely! Let me break down surds and indices for you.\n\n**Surds** are irrational numbers that can\'t be simplified to remove a square root. For example, √2, √3, √5.\n\n**Key rules:**\n• √a × √b = √(ab)\n• √a ÷ √b = √(a/b)\n\nShall I give you some practice questions from the 2023 ZIMSEC paper?' },
                { from:'user', text:'Yes please!' },
              ].map((m,i)=>(
                <div key={i} style={{ display:'flex', justifyContent:m.from==='user'?'flex-end':'flex-start' }}>
                  <div style={{ maxWidth:'70%', padding:'10px 14px', borderRadius:m.from==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px', background:m.from==='user'?C.purple:'#f3f4f6', color:m.from==='user'?'#fff':C.gray900, fontSize:13, lineHeight:1.55, whiteSpace:'pre-line', fontWeight:m.from==='user'?500:400 }}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────── TRUSTED BY ─────────────── */
function TrustedBy() {
  return (
    <section style={{ background:'#fff', padding:'52px clamp(16px,4vw,56px)', borderTop:`1px solid ${C.gray200}` }}>
      <div style={{ maxWidth:1100, margin:'0 auto', textAlign:'center' }}>
        <p style={{ fontSize:11.5, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:C.gray500, marginBottom:32 }}>
          Trusted by Students Across Zimbabwe's Top Institutions
        </p>
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', alignItems:'center', gap:'28px 48px', opacity:.55 }}>
          {SCHOOLS.map(s => (
            <span key={s} style={{ fontSize:14, fontWeight:800, color:C.gray700, letterSpacing:'-.2px', whiteSpace:'nowrap' }}>{s}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── PAIN SECTION ─────────────── */
function PainSection() {
  return (
    <section style={{ background:'#fff', padding:'96px clamp(16px,4vw,56px)' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5}}
          style={{ textAlign:'center', marginBottom:56 }}>
          <p style={{ fontSize:15, color:C.gray500, marginBottom:14 }}>Sound familiar?</p>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:900, color:C.gray900, letterSpacing:'-.05em', lineHeight:1.15 }}>
            Studying feels <span style={serif}>harder</span><br/>
            <span style={serif}>than it should</span>
          </h2>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:20, marginBottom:28 }}>
          {PAIN_CARDS.map((c, i) => (
            <motion.div key={c.title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.4,delay:i*.08}}>
              <div style={{ background:'#fff', border:`1px solid ${C.gray200}`, borderRadius:20, padding:'28px 24px', height:'100%', boxShadow:'0 1px 4px rgba(0,0,0,.04)' }}>
                <div style={{ width:52, height:52, borderRadius:14, background:'#f5f3ff', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
                  <c.icon size={22} style={{ color:C.purple }} strokeWidth={1.5} />
                </div>
                <div style={{ fontSize:15.5, fontWeight:700, color:C.gray900, marginBottom:10 }}>{c.title}</div>
                <p style={{ fontSize:13.5, color:C.gray500, lineHeight:1.65, fontStyle:'italic' }}>{c.quote}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Better way banner */}
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5,delay:.2}}
          style={{ background:C.gray50, border:`1px solid ${C.gray200}`, borderRadius:20, padding:'28px 36px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
          <p style={{ fontSize:17, color:C.gray700, maxWidth:600 }}>
            <strong style={{ color:C.gray900 }}>There's a better way.</strong> Fundo AI turns chaos into a structured study system — automatically, on WhatsApp.
          </p>
          <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:8, background:C.purple, color:'#fff', textDecoration:'none', padding:'12px 24px', borderRadius:8, fontSize:14.5, fontWeight:700, boxShadow:`0 3px 12px rgba(124,58,237,.28)`, flexShrink:0, transition:'all .15s' }}
            onMouseEnter={e=>e.currentTarget.style.background=C.purpleDk} onMouseLeave={e=>e.currentTarget.style.background=C.purple}>
            Start My Free Study Session <ArrowRight size={15}/>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────── FEATURES ─────────────── */
function FeaturesSection() {
  const [active, setActive] = useState(0);
  const f = FEATURES[active];

  const mockups = {
    notes: (
      <div style={{ background:'#fff', border:`1px solid ${C.gray200}`, borderRadius:16, padding:24, boxShadow:'0 4px 20px rgba(0,0,0,.06)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <span style={{ fontSize:14, fontWeight:700, color:C.gray900 }}>AI Notes</span>
          <div style={{ display:'flex', gap:8, fontSize:11 }}>
            {['A−','A','A+','↓'].map(b=><div key={b} style={{ padding:'3px 8px', borderRadius:4, background:C.gray100, color:C.gray600, fontWeight:600, cursor:'pointer' }}>{b}</div>)}
          </div>
        </div>
        {['Introduction to Photosynthesis','Key Reactants & Products','The Light-Dependent Stage','The Calvin Cycle','Summary'].map((t,i)=>(
          <div key={t} style={{ marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.gray900, marginBottom:5 }}>{t}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {[1,2].map(j=><div key={j} style={{ height:8, borderRadius:4, background:i===0&&j===1?'#ddd6fe':C.gray200, width:j===2?'65%':'100%' }}/>)}
            </div>
            {i===0&&<div style={{ marginTop:8, fontSize:11, color:C.purple, fontWeight:600, cursor:'pointer' }}>› Explain More — Page 1.2</div>}
          </div>
        ))}
      </div>
    ),
    voice: (
      <div style={{ background:'#fff', border:`1px solid ${C.gray200}`, borderRadius:16, padding:28, textAlign:'center', boxShadow:'0 4px 20px rgba(0,0,0,.06)' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#ecfdf5,#d1fae5)', border:'2px solid #a7f3d0', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <Mic size={32} style={{ color:'#059669' }} />
        </div>
        <div style={{ fontSize:15, fontWeight:700, color:C.gray900, marginBottom:8 }}>Voice Note Received</div>
        <div style={{ background:C.gray50, borderRadius:12, padding:'12px 16px', marginBottom:16 }}>
          <div style={{ fontSize:12, color:C.gray500, marginBottom:8 }}>Transcription</div>
          <div style={{ fontSize:13, color:C.gray900, fontStyle:'italic' }}>"Explain the water cycle for me in simple terms"</div>
        </div>
        <div style={{ display:'flex', gap:4, justifyContent:'center', marginBottom:12 }}>
          {[40,60,80,50,70,45,65,55,75,50].map((h,i)=><div key={i} style={{ width:5, height:h*0.4, borderRadius:3, background:C.purple }}/>)}
        </div>
        <div style={{ fontSize:12, color:C.gray500 }}>Fundo AI is preparing your voice reply...</div>
      </div>
    ),
    papers: (
      <div style={{ background:'#fff', border:`1px solid ${C.gray200}`, borderRadius:16, padding:24, boxShadow:'0 4px 20px rgba(0,0,0,.06)' }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.gray900, marginBottom:16 }}>Past Papers Library</div>
        {[['O-Level Maths','2023','ZIMSEC','#7c3aed'],['A-Level Biology','2022','ZIMSEC','#059669'],['O-Level Physics','2023','Cambridge','#2563eb'],['A-Level Chem','2021','ZIMSEC','#d97706']].map(([sub,yr,bd,c])=>(
          <div key={sub} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${C.gray200}` }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.gray900 }}>{sub} — {yr}</div>
              <div style={{ fontSize:11.5, color:C.gray500 }}>{bd} · With Marking Scheme</div>
            </div>
            <div style={{ padding:'3px 10px', borderRadius:99, background:c+'15', fontSize:11, fontWeight:700, color:c }}>Download</div>
          </div>
        ))}
        <div style={{ textAlign:'center', paddingTop:12 }}>
          <span style={{ fontSize:12.5, color:C.purple, fontWeight:600 }}>+ 270 more past papers</span>
        </div>
      </div>
    ),
    image: (
      <div style={{ background:'#fff', border:`1px solid ${C.gray200}`, borderRadius:16, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,.06)' }}>
        <div style={{ background:'#fffbeb', padding:'20px 24px', borderBottom:`1px solid ${C.gray200}`, display:'flex', gap:12, alignItems:'center' }}>
          <div style={{ width:44, height:44, borderRadius:10, background:'#fde68a', display:'flex', alignItems:'center', justifyContent:'center' }}><Img size={20} style={{ color:'#d97706' }}/></div>
          <div><div style={{ fontSize:13, fontWeight:700, color:C.gray900 }}>Image Uploaded</div><div style={{ fontSize:12, color:C.gray500 }}>Maths exam question — photo</div></div>
        </div>
        <div style={{ padding:'16px 24px' }}>
          <div style={{ fontSize:12.5, color:C.gray500, marginBottom:8 }}>AI Analysis</div>
          <div style={{ fontSize:13, color:C.gray900, lineHeight:1.65 }}>I can see this is a quadratic equation problem. The equation is <strong>2x² + 5x − 3 = 0</strong>. Let me solve it step by step using factorisation...</div>
          <div style={{ marginTop:12, height:8, borderRadius:4, background:'#ddd6fe', width:'80%' }}/>
          <div style={{ marginTop:6, height:8, borderRadius:4, background:C.gray200, width:'60%' }}/>
        </div>
      </div>
    ),
  };

  return (
    <section id="features" style={{ background:C.gray50, padding:'100px clamp(16px,4vw,56px)' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5}}
          style={{ textAlign:'center', marginBottom:56 }}>
          <h2 style={{ fontSize:'clamp(1.9rem,4vw,3rem)', fontWeight:900, color:C.gray900, letterSpacing:'-.05em', lineHeight:1.15 }}>
            We turn your WhatsApp into a<br/>
            <span style={serif}>complete AI study system</span>
          </h2>
          <p style={{ fontSize:16, color:C.gray500, lineHeight:1.75, maxWidth:540, margin:'20px auto 0' }}>
            Send any question, past paper, topic, or file — Fundo AI builds your entire study session with notes, quizzes, summaries, and AI tutor included.
          </p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:52, alignItems:'start' }}>
          {/* Feature tabs */}
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.4,delay:i*.07}}
                onClick={()=>setActive(i)}
                style={{ padding:'20px 24px', borderRadius:14, cursor:'pointer', border:`1px solid ${active===i?f.color+'40':C.gray200}`, background:active===i?'#fff':'transparent', borderLeft:`${active===i?'4px':'1px'} solid ${active===i?f.color:C.gray200}`, transition:'all .2s', boxShadow:active===i?`0 2px 16px rgba(0,0,0,.06)`:'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <f.icon size={20} style={{ color:f.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize:16, fontWeight:700, color:active===i?C.gray900:C.gray700 }}>{f.title}</div>
                    <div style={{ fontSize:13, color:active===i?f.color:C.gray500, fontWeight:500 }}>{f.sub}</div>
                  </div>
                </div>
                <AnimatePresence>
                  {active===i && (
                    <motion.p initial={{height:0,opacity:0,marginTop:0}} animate={{height:'auto',opacity:1,marginTop:14}} exit={{height:0,opacity:0,marginTop:0}} transition={{duration:.25}}
                      style={{ fontSize:14, color:C.gray500, lineHeight:1.65, overflow:'hidden' }}>
                      {f.desc}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Mockup */}
          <motion.div key={active} initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:.3}}
            style={{ position:'sticky', top:96 }}>
            <div style={{ background:'linear-gradient(135deg,#f5f3ff,#ede8ff)', borderRadius:24, padding:24 }}>
              {mockups[FEATURES[active].mockup]}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── HOW IT WORKS ─────────────── */
function HowItWorks() {
  const [active, setActive] = useState(0);

  const visuals = [
    <div style={{ background:'linear-gradient(135deg,#f5f3ff,#ede8ff)', borderRadius:20, padding:40, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:280 }}>
      <div style={{ background:'#fff', borderRadius:14, padding:'16px 28px', boxShadow:'0 4px 16px rgba(124,58,237,.12)', fontSize:20, fontWeight:800, color:C.gray900, display:'flex', alignItems:'center', gap:14 }}>
        <MessageCircle size={26} style={{ color:C.purple }}/> New Session <span style={{ color:C.purple, fontSize:28 }}>+</span>
      </div>
      <div style={{ marginTop:20, fontSize:13, color:C.gray500 }}>One session per subject or exam topic</div>
    </div>,
    <div style={{ background:'linear-gradient(135deg,#ecfdf5,#d1fae5)', borderRadius:20, padding:28, minHeight:280 }}>
      <div style={{ fontSize:13, fontWeight:700, color:'#065f46', marginBottom:16 }}>Upload Options</div>
      {[['📄','PDF Past Paper'],['🖼','Photo of textbook'],['🎤','Voice question'],['🔗','YouTube video link'],['💬','Text question']].map(([e,l])=>(
        <div key={l} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'#fff', borderRadius:10, marginBottom:8, boxShadow:'0 1px 4px rgba(0,0,0,.05)', fontSize:13.5, fontWeight:500, color:C.gray700 }}>
          <span style={{ fontSize:20 }}>{e}</span>{l}
        </div>
      ))}
    </div>,
    <div style={{ background:'linear-gradient(135deg,#eff6ff,#dbeafe)', borderRadius:20, padding:28, minHeight:280 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <div style={{ width:10, height:10, borderRadius:'50%', background:'#2563eb', animation:'pulse 1.5s infinite' }}/>
        <span style={{ fontSize:13, fontWeight:700, color:'#1e40af' }}>AI Processing...</span>
      </div>
      {['Analysing subject & level','Generating structured notes','Building quiz questions','Creating marking guide','Preparing voice reply'].map((t,i)=>(
        <div key={t} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:i<4?`1px solid #bfdbfe`:'none' }}>
          <div style={{ width:18, height:18, borderRadius:'50%', background:i<3?'#2563eb':'#bfdbfe', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            {i<3 && <Check size={10} style={{ color:'#fff' }} strokeWidth={3}/>}
          </div>
          <span style={{ fontSize:13, color:i<3?C.gray900:C.gray500 }}>{t}</span>
        </div>
      ))}
    </div>,
    <div style={{ background:'linear-gradient(135deg,#fffbeb,#fef3c7)', borderRadius:20, padding:28, minHeight:280 }}>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
        {['AI Notes','Past Papers','Quiz','Flash Cards','Mock Exam','AI Tutor'].map(t=>(
          <div key={t} style={{ padding:'6px 14px', borderRadius:99, background:t==='Quiz'?'#d97706':'#fff', color:t==='Quiz'?'#fff':'#92400e', border:'1px solid #fde68a', fontSize:12, fontWeight:700 }}>{t}</div>
        ))}
      </div>
      {[['📊','Progress: 78% of syllabus covered'],['🏆','Quiz score: 8/10 — Great job!'],['📅','Next: Past paper 2022 Section B']].map(([e,t])=>(
        <div key={t} style={{ display:'flex', gap:10, alignItems:'center', background:'#fff', borderRadius:10, padding:'10px 14px', marginBottom:8, fontSize:13, color:C.gray700, boxShadow:'0 1px 4px rgba(0,0,0,.05)' }}>
          <span>{e}</span><span>{t}</span>
        </div>
      ))}
    </div>,
  ];

  return (
    <section id="how" style={{ background:'#fff', padding:'100px clamp(16px,4vw,56px)' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5}}
          style={{ textAlign:'center', marginBottom:60 }}>
          <h2 style={{ fontSize:'clamp(1.9rem,4vw,2.8rem)', fontWeight:900, color:C.gray900, letterSpacing:'-.05em' }}>
            Upload anything.{' '}
            <span style={serif}>Learn everything</span>
          </h2>
          <p style={{ fontSize:15.5, color:C.gray500, lineHeight:1.7, maxWidth:500, margin:'16px auto 0' }}>
            Send any message on WhatsApp and Fundo AI instantly turns it into a complete, structured study system.
          </p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'start' }}>
          {/* Steps list */}
          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {STEPS.map((s, i) => (
              <motion.div key={s.n} initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.4,delay:i*.07}}
                onClick={()=>setActive(i)}
                style={{ display:'flex', gap:16, padding:'20px 0', borderLeft:`3px solid ${active===i?C.purple:'#e5e7eb'}`, paddingLeft:20, cursor:'pointer', transition:'all .2s' }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:active===i?C.purple:C.gray200, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background .2s' }}>
                  <span style={{ fontSize:14, fontWeight:800, color:active===i?'#fff':C.gray500 }}>{s.n}</span>
                </div>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:active===i?C.gray900:C.gray500, marginBottom:active===i?6:0, transition:'all .2s' }}>{s.title}</div>
                  <AnimatePresence>
                    {active===i && (
                      <motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.25}}
                        style={{ fontSize:14, color:C.gray500, lineHeight:1.65, overflow:'hidden' }}>
                        {s.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Visual */}
          <motion.div key={active} initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:.3}}
            style={{ position:'sticky', top:96 }}>
            {visuals[active]}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── COMPARISON ─────────────── */
function Comparison() {
  return (
    <section style={{ background:'#fff', padding:'96px clamp(16px,4vw,56px)', borderTop:`1px solid ${C.gray200}` }}>
      <div style={{ maxWidth:1000, margin:'0 auto' }}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5}}
          style={{ textAlign:'center', marginBottom:52 }}>
          <h2 style={{ fontSize:'clamp(1.9rem,4vw,2.8rem)', fontWeight:900, color:C.gray900, letterSpacing:'-.05em', lineHeight:1.15 }}>
            Study smarter.{' '}
            <span style={serif}>Learn faster</span>
          </h2>
          <p style={{ fontSize:15.5, color:C.gray500, lineHeight:1.7, maxWidth:480, margin:'16px auto 0' }}>
            Fundo AI turns your WhatsApp into a structured study system, so you can stop spinning and start learning.
          </p>
        </motion.div>

        <div style={{ position:'relative', display:'grid', gridTemplateColumns:'1fr 1fr', gap:0 }}>
          {/* Old way */}
          <motion.div initial={{opacity:0,x:-24}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.5}}
            style={{ background:'#fff5f5', borderRadius:'20px 0 0 20px', padding:'32px 36px', borderRight:'none' }}>
            <div style={{ fontSize:18, fontWeight:800, color:C.gray900, marginBottom:28 }}>The Old Way</div>
            {OLD_WAY.map(item => (
              <div key={item} style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'#fee2e2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <XIcon size={13} style={{ color:'#ef4444' }} strokeWidth={3}/>
                </div>
                <div style={{ fontSize:14.5, color:C.gray700, background:'#fff', borderRadius:99, padding:'8px 18px', boxShadow:'0 1px 4px rgba(0,0,0,.06)', flex:1, textAlign:'center' }}>
                  {item}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Centre brain */}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:2 }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:'#fff', border:`3px solid ${C.gray200}`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(0,0,0,.10)' }}>
              <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:32, height:32, objectFit:'cover', borderRadius:'50%' }} onError={e=>{e.target.style.display='none';}}/>
            </div>
          </div>

          {/* New way */}
          <motion.div initial={{opacity:0,x:24}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.5,delay:.08}}
            style={{ background:'#f0fdf4', borderRadius:'0 20px 20px 0', padding:'32px 36px' }}>
            <div style={{ fontSize:18, fontWeight:800, color:C.gray900, marginBottom:28 }}>The Fundo AI Way</div>
            {NEW_WAY.map(item => (
              <div key={item} style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Check size={13} style={{ color:'#16a34a' }} strokeWidth={3}/>
                </div>
                <div style={{ fontSize:14.5, color:C.gray700, background:'#fff', borderRadius:99, padding:'8px 18px', boxShadow:'0 1px 4px rgba(0,0,0,.06)', flex:1, textAlign:'center' }}>
                  {item}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── WHO IS IT FOR ─────────────── */
function WhoSection() {
  const [tab, setTab] = useState(0);
  const t = WHO_TABS[tab];
  return (
    <section style={{ background:C.gray50, padding:'96px clamp(16px,4vw,56px)' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5}}
          style={{ textAlign:'center', marginBottom:52 }}>
          <h2 style={{ fontSize:'clamp(1.9rem,4vw,2.8rem)', fontWeight:900, color:C.gray900, letterSpacing:'-.05em' }}>
            Built for <span style={serif}>every student</span>
          </h2>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:0, background:'#fff', border:`1px solid ${C.gray200}`, borderRadius:20, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,.05)' }}>
          {/* Tabs */}
          <div style={{ borderRight:`1px solid ${C.gray200}`, padding:8 }}>
            {WHO_TABS.map((w, i) => (
              <button key={w.label} onClick={()=>setTab(i)}
                style={{ width:'100%', display:'block', padding:'16px 20px', border:'none', borderRadius:12, background:tab===i?'#f5f3ff':'transparent', cursor:'pointer', textAlign:'left', transition:'all .15s', marginBottom:2 }}>
                <div style={{ fontSize:15, fontWeight:700, color:tab===i?C.purple:C.gray900 }}>{w.label}</div>
                <div style={{ fontSize:12.5, color:tab===i?C.purple:C.gray500, marginTop:2 }}>{w.sub}</div>
              </button>
            ))}
          </div>
          {/* Content */}
          <motion.div key={tab} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} transition={{duration:.3}}
            style={{ padding:36, borderLeft:`4px solid ${t.color}` }}>
            <div style={{ width:56, height:56, borderRadius:14, background:t.color+'15', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
              <t.icon size={24} style={{ color:t.color }} />
            </div>
            <div style={{ fontSize:24, fontWeight:900, color:C.gray900, marginBottom:16, letterSpacing:'-.03em' }}>{t.label}</div>
            <p style={{ fontSize:14.5, color:C.gray500, lineHeight:1.75, marginBottom:24 }}>
              Fundo AI gives {t.label.toLowerCase()} everything they need to succeed — from comprehensive curriculum support to real-time AI guidance, available 24/7 on WhatsApp.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {t.features.map(f => (
                <div key={f} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:22, height:22, borderRadius:'50%', background:t.color+'20', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Check size={11} style={{ color:t.color }} strokeWidth={3}/>
                  </div>
                  <span style={{ fontSize:14.5, color:C.gray700 }}>{f}</span>
                </div>
              ))}
            </div>
            <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:8, marginTop:28, background:t.color, color:'#fff', textDecoration:'none', padding:'11px 22px', borderRadius:8, fontSize:14, fontWeight:700, boxShadow:`0 3px 12px ${t.color}35`, transition:'all .15s' }}
              onMouseEnter={e=>e.currentTarget.style.opacity='.9'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
              Get Started as {t.label.split(' ')[0]} <ArrowRight size={14}/>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── TOOL GRID ─────────────── */
function ToolGrid() {
  return (
    <section id="features-grid" style={{ background:C.gray50, padding:'0 clamp(16px,4vw,56px) 96px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
          {TOOLS.map((t, i) => (
            <motion.div key={t.label} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.35,delay:i*.04}}>
              <div style={{ background:'#fff', border:`1px solid ${C.gray200}`, borderRadius:14, padding:'16px 18px', display:'flex', alignItems:'center', gap:12, boxShadow:'0 1px 4px rgba(0,0,0,.04)', transition:'all .2s', cursor:'default' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=t.color+'40';e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 6px 20px ${t.color}15`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.gray200;e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,.04)';}}>
                <div style={{ width:36, height:36, borderRadius:9, background:t.color+'15', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <t.icon size={16} style={{ color:t.color }} />
                </div>
                <span style={{ fontSize:13, fontWeight:600, color:C.gray800 }}>{t.label}</span>
              </div>
            </motion.div>
          ))}
          <motion.div initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.35,delay:.48}}>
            <a href="/#features" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:'transparent', border:`1px solid ${C.gray200}`, borderRadius:14, padding:'16px 18px', textDecoration:'none', transition:'all .2s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.purple;e.currentTarget.style.color=C.purple;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.gray200;e.currentTarget.style.color=C.gray700;}}>
              <span style={{ fontSize:13, fontWeight:700, color:'inherit' }}>View All</span> <ArrowRight size={13}/>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── PRICING ─────────────── */
const PLANS = [
  { name:'Starter', price:2, color:'#2563eb', border:'#bfdbfe', bg:'#eff6ff', badge:null, features:['Basic AI chat & help','Homework support','Study resources access','5 PDF analyses/month','10 downloads/month'] },
  { name:'Pro', price:5, color:C.purple, border:'#ddd6fe', bg:'#f5f3ff', badge:'Most Popular', features:['All Starter features','Advanced AI explanations','Full past paper library','Priority support','50 AI image credits'] },
  { name:'Premium', price:10, color:'#d97706', border:'#fde68a', bg:'#fffbeb', badge:'Best Value', features:['All Pro features','AI mock exams','Personalised study plan','24/7 priority support','Unlimited downloads'] },
];

function Pricing() {
  return (
    <section id="pricing" style={{ background:'#fff', padding:'100px clamp(16px,4vw,56px)', borderTop:`1px solid ${C.gray200}` }}>
      <div style={{ maxWidth:1000, margin:'0 auto' }}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5}}
          style={{ textAlign:'center', marginBottom:56 }}>
          <h2 style={{ fontSize:'clamp(1.9rem,4vw,2.8rem)', fontWeight:900, color:C.gray900, letterSpacing:'-.05em', lineHeight:1.15 }}>
            Simple, affordable pricing<br/>
            <span style={serif}>for every student</span>
          </h2>
          <p style={{ fontSize:15.5, color:C.gray500, lineHeight:1.7, maxWidth:440, margin:'16px auto 0' }}>
            All plans work directly on WhatsApp. No downloads, no logins — just open WhatsApp and start learning.
          </p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, alignItems:'start' }}>
          {PLANS.map((p, i) => {
            const isPro = p.name==='Pro';
            return (
              <motion.div key={p.name} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5,delay:i*.09}}>
                <div style={{ background:'#fff', border:`2px solid ${isPro?p.color:p.border}`, borderRadius:20, padding:isPro?'36px 28px':'28px', position:'relative', transform:isPro?'scale(1.04)':'none', boxShadow:isPro?`0 20px 56px rgba(124,58,237,.18)`:'0 2px 8px rgba(0,0,0,.04)', overflow:'hidden' }}>
                  {isPro && <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${p.color},#8b5cf6)` }}/>}
                  {p.badge && <div style={{ position:'absolute', top:isPro?20:14, right:16, background:p.color, color:'#fff', borderRadius:99, padding:'3px 12px', fontSize:11.5, fontWeight:800 }}>{p.badge}</div>}
                  <div style={{ fontSize:12.5, fontWeight:700, color:p.color, letterSpacing:'.5px', textTransform:'uppercase', marginBottom:10 }}>{p.name}</div>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:4, marginBottom:20 }}>
                    <span style={{ fontSize:'clamp(3rem,4vw,3.6rem)', fontWeight:900, letterSpacing:'-3px', color:C.gray900, lineHeight:1 }}>${p.price}</span>
                    <span style={{ fontSize:14, color:C.gray500, paddingBottom:8 }}>/month</span>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
                    {p.features.map(f=>(
                      <div key={f} style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:20, height:20, borderRadius:'50%', background:p.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <Check size={11} style={{ color:p.color }} strokeWidth={3}/>
                        </div>
                        <span style={{ fontSize:13.5, color:C.gray700 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:isPro?p.color:'transparent', color:isPro?'#fff':p.color, border:`2px solid ${p.color}`, textDecoration:'none', padding:'12px', borderRadius:10, fontSize:14.5, fontWeight:700, transition:'all .18s' }}
                    onMouseEnter={e=>{e.currentTarget.style.background=p.color;e.currentTarget.style.color='#fff';}}
                    onMouseLeave={e=>{e.currentTarget.style.background=isPro?p.color:'transparent';e.currentTarget.style.color=isPro?'#fff':p.color;}}>
                    Get {p.name} <ArrowRight size={14}/>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── DARK CTA ─────────────── */
function DarkCTA() {
  return (
    <section id="upload-cta" style={{ background:C.dark, padding:'96px clamp(16px,4vw,56px)', overflow:'hidden', position:'relative' }}>
      <div style={{ position:'absolute', top:-80, right:-80, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,.18) 0%,transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'center' }}>
        <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.55}}>
          <h2 style={{ fontSize:'clamp(1.9rem,4vw,3rem)', fontWeight:900, color:'#fff', lineHeight:1.15, letterSpacing:'-.04em', marginBottom:20 }}>
            Your next study session<br />can be smarter.
          </h2>
          <p style={{ fontSize:15.5, color:'rgba(255,255,255,.65)', lineHeight:1.75, marginBottom:32 }}>
            Turn lectures, readings, and past papers into a complete AI study system in minutes — right inside WhatsApp.
          </p>
          <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:9, background:C.purple, color:'#fff', textDecoration:'none', padding:'13px 28px', borderRadius:9, fontSize:15.5, fontWeight:700, boxShadow:'0 4px 24px rgba(124,58,237,.4)', transition:'all .18s' }}
            onMouseEnter={e=>{e.currentTarget.style.background=C.purpleDk;e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.purple;e.currentTarget.style.transform='none';}}>
            <MessageCircle size={17}/> Create Free Study Session <ArrowRight size={15}/>
          </a>
        </motion.div>

        {/* Mockup */}
        <motion.div initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.55,delay:.1}}>
          <div style={{ background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', borderRadius:20, padding:24, backdropFilter:'blur(10px)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#7c3aed,#8b5cf6)', overflow:'hidden' }}>
                  <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}} />
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,.9)' }}>fundoai</span>
              </div>
              <div style={{ background:C.purple, color:'#fff', borderRadius:8, padding:'5px 12px', fontSize:12, fontWeight:700 }}>New Session +</div>
            </div>
            <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
              {['Original Content','AI Notes','AI Summary','AI Quizzes','AI Tutor'].map((t,i)=>(
                <div key={t} style={{ padding:'5px 12px', borderRadius:99, background:i===0?C.purple:'rgba(255,255,255,.08)', border:`1px solid ${i===0?C.purple:'rgba(255,255,255,.12)'}`, color:i===0?'#fff':'rgba(255,255,255,.6)', fontSize:12, fontWeight:600 }}>{t}</div>
              ))}
            </div>
            {[85,60,75,45,90,55,70,40].map((w,i)=>(
              <div key={i} style={{ height:8, borderRadius:4, background:'rgba(255,255,255,.12)', marginBottom:8, width:`${w}%` }}/>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────── FOOTER ─────────────── */
function Footer() {
  const cols = [
    { title:'Useful Links', links:[['Contact Us','/contact'],['Privacy Policy','/privacy'],['Terms of Service','/terms'],['Help Centre','/help']] },
    { title:'Features', links:[['AI Past Papers','#features'],['AI Quiz Generator','#features'],['Voice Learning','#features'],['AI Tutor','#features'],['Image Solver','#features']] },
    { title:'Subjects', links:[['O-Level Maths','#features'],['A-Level Biology','#features'],['English Literature','#features'],['ZIMSEC Sciences','#features'],['Computer Science','#features']] },
    { title:'Support', links:[['Help Centre','/help'],['Contact Us','/contact'],['FAQs','/help'],['WhatsApp Us','https://wa.me/263719647303'],['Community','/upload']] },
    { title:'Company', links:[['About FundoAI','/contact'],['Upload Materials','/upload'],['Admin Portal','/admin'],['WhatsApp Channel','https://whatsapp.com/channel/0029VbCigmv96H4JhJDwsd0X'],['fundoai.gleeze.com','https://fundoai.gleeze.com']] },
  ];

  return (
    <footer style={{ background:'#fff', borderTop:`1px solid ${C.gray200}`, padding:'56px clamp(16px,4vw,56px) 32px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.8fr repeat(5,1fr)', gap:32, marginBottom:48 }}>
          {/* Brand col */}
          <div>
            <a href="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none', marginBottom:16 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#7c3aed,#8b5cf6)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}} />
              </div>
              <span style={{ fontSize:17, fontWeight:900, color:C.gray900 }}>fundo<span style={{ color:C.purple }}>ai</span></span>
            </a>
            <p style={{ fontSize:13.5, color:C.gray500, lineHeight:1.7, maxWidth:260, marginBottom:20 }}>
              The AI study tool for faster, more effective learning across Zimbabwe.
            </p>
            {/* Social icons */}
            <div style={{ display:'flex', gap:10 }}>
              {[
                { label:'WA', href:'https://wa.me/263719647303', bg:'#25D366' },
                { label:'CH', href:'https://whatsapp.com/channel/0029VbCigmv96H4JhJDwsd0X', bg:C.purple },
                { label:'EM', href:'mailto:support.fundo.ai@gmail.com', bg:'#ea4335' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ width:34, height:34, borderRadius:9, background:C.gray100, display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none', fontSize:11, fontWeight:800, color:C.gray600, transition:'all .15s' }}
                  onMouseEnter={e=>{e.currentTarget.style.background=s.bg;e.currentTarget.style.color='#fff';}}
                  onMouseLeave={e=>{e.currentTarget.style.background=C.gray100;e.currentTarget.style.color=C.gray600;}}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontSize:11.5, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:C.gray500, marginBottom:14 }}>{col.title}</div>
              {col.links.map(([label, href]) => (
                <div key={label} style={{ marginBottom:10 }}>
                  <a href={href} target={href.startsWith('http')?'_blank':undefined}
                    rel={href.startsWith('http')?'noopener noreferrer':undefined}
                    style={{ fontSize:13.5, color:C.gray700, textDecoration:'none', transition:'color .15s' }}
                    onMouseEnter={e=>e.target.style.color=C.purple} onMouseLeave={e=>e.target.style.color=C.gray700}>
                    {label}
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop:`1px solid ${C.gray200}`, paddingTop:24, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontSize:12.5, color:C.gray500 }}>© Copyright 2026 Fundo AI. All Rights Reserved. Created by Darrell Mucheri.</p>
          <div style={{ display:'flex', gap:16 }}>
            {[['Privacy Policy','/privacy'],['Terms','/terms'],['Contact','/contact']].map(([l,h])=>(
              <a key={l} href={h} style={{ fontSize:12.5, color:C.gray500, textDecoration:'none' }}
                onMouseEnter={e=>e.target.style.color=C.purple} onMouseLeave={e=>e.target.style.color=C.gray500}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────── PAGE ─────────────── */
export default function LandingPage() {
  return (
    <div style={{ minHeight:'100vh', fontFamily:"'Inter', system-ui, sans-serif" }}>
      <Navbar />
      <Hero />
      <TrustedBy />
      <PainSection />
      <FeaturesSection />
      <HowItWorks />
      <Comparison />
      <WhoSection />
      <ToolGrid />
      <Pricing />
      <DarkCTA />
      <Footer />
    </div>
  );
}
