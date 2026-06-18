import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import SimplePage from '../components/SimplePage.jsx';

const FAQS = [
  { q:'How do I get started with Fundo AI?', a:'Simply open WhatsApp and send a message to wa.me/263719647303. The bot will guide you through a quick setup (name, school, level) and then you\'re ready to start studying!' },
  { q:'What subjects does Fundo AI cover?', a:'Fundo AI covers all ZIMSEC and Cambridge subjects across Primary, O-Level, and A-Level — including Mathematics, English, Sciences, Humanities, Business subjects, and more.' },
  { q:'How do I upgrade my plan?', a:'Send a message to our WhatsApp number and type "upgrade" or "plans" to see available options. Our team will assist you with the upgrade process.' },
  { q:'How do I earn rewards from uploading?', a:'Every 3 approved uploads earns you: 1 bonus PDF project, 10 bonus AI chats, and 2 bonus image credits. Simply include your WhatsApp number when uploading at fundoai.gleeze.com/upload.' },
  { q:'Can Fundo AI do my homework for me?', a:'Fundo AI is designed to help you understand concepts and guide your learning — not to replace your own effort. It explains solutions step-by-step so you learn and grow as a student.' },
  { q:'How does voice note learning work?', a:'Send a voice note to the bot describing your question or topic. Fundo AI will transcribe it, understand your query, and reply with an AI-powered explanation. You can also receive voice note replies.' },
  { q:'What file types can I upload for analysis?', a:'You can upload PDF files, images (photos of textbook pages, exam questions, diagrams), and documents for AI analysis and summarization.' },
  { q:'How do I fetch YouTube videos?', a:'Simply send the command /youtube followed by your topic. For example: /youtube introduction to algebra. The bot will find relevant educational content.' },
  { q:'How do I generate images?', a:'Send /image followed by your description. For example: /image diagram of the water cycle. The bot will generate or find the image for you.' },
  { q:'What is the Flash Quiz System?', a:'The Flash Quiz system lets you practice with multiple-choice questions (MCQs) organised by subject and level. It tracks your answers and helps you identify weak areas.' },
  { q:'I\'m getting an error — what should I do?', a:'Try sending "restart" or "menu" to reset your session. If the issue persists, contact us at support.fundo.ai@gmail.com or reply to this FAQ with details.' },
  { q:'Is my data safe?', a:'Yes. All data is encrypted in transit and at rest using MongoDB Atlas with enterprise security. We never sell your personal data. Read our Privacy Policy for full details.' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:'1px solid #e5e7eb', paddingBottom:open?0:0 }}>
      <button onClick={()=>setOpen(p=>!p)}
        style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 0', background:'none', border:'none', cursor:'pointer', textAlign:'left', gap:16 }}>
        <span style={{ fontSize:16, fontWeight:700, color:'#111827', lineHeight:1.4 }}>{q}</span>
        <motion.div animate={{ rotate:open?180:0 }} transition={{ duration:.2 }} style={{ flexShrink:0 }}>
          <ChevronDown size={18} style={{ color:'#7c3aed' }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:.2 }} style={{ overflow:'hidden' }}>
            <p style={{ fontSize:15, color:'#4b5563', lineHeight:1.75, paddingBottom:20, paddingRight:32 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HelpPage() {
  return (
    <SimplePage title="Help Centre" subtitle="Everything you need to know about Fundo AI.">
      <div style={{ maxWidth:740, margin:'0 auto' }}>
        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:20, padding:'8px 32px', boxShadow:'0 4px 16px rgba(0,0,0,.04)', marginBottom:48 }}>
          {FAQS.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
        </div>
        <div style={{ background:'linear-gradient(135deg,#f5f3ff,#eff6ff)', border:'1.5px solid #ddd6fe', borderRadius:20, padding:'32px 40px', textAlign:'center' }}>
          <div style={{ fontSize:20, fontWeight:800, color:'#111827', marginBottom:8 }}>Still have questions?</div>
          <p style={{ fontSize:14.5, color:'#6b7280', marginBottom:20 }}>Our team is available on WhatsApp to help you right away.</p>
          <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#7c3aed', color:'#fff', textDecoration:'none', padding:'12px 28px', borderRadius:10, fontSize:14.5, fontWeight:700, boxShadow:'0 4px 16px rgba(124,58,237,.28)' }}>
            <MessageCircle size={16}/> Chat on WhatsApp
          </a>
        </div>
      </div>
    </SimplePage>
  );
}
