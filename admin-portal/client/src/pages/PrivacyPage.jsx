import SimplePage from '../components/SimplePage.jsx';

const sections = [
  { title:'Information We Collect', body:'We collect information you provide when using Fundo AI via WhatsApp, including your WhatsApp phone number, name, academic level, school name, and study materials you upload or share with us.' },
  { title:'How We Use Your Information', body:'We use your information to provide personalised AI-powered academic assistance, track your study progress, deliver study materials, and improve the quality of our services. We do not sell your personal data to third parties.' },
  { title:'Data Storage', body:'Your data is stored securely in MongoDB Atlas, a cloud database service with enterprise-grade encryption at rest and in transit. WhatsApp session data is stored locally and used only for message delivery.' },
  { title:'Study Materials', body:'Materials you upload (past papers, textbooks, syllabuses) are reviewed by our admin team. Approved materials are made available to the Fundo AI community. You retain copyright of materials you upload.' },
  { title:'Data Retention', body:'We retain your account data for as long as you use the service. You may request deletion of your data at any time by contacting support.fundo.ai@gmail.com.' },
  { title:'Third-Party Services', body:'Fundo AI uses WhatsApp (Meta) as the primary communication interface. Messages are subject to WhatsApp\'s Privacy Policy. We also use AI services to process your academic queries.' },
  { title:'Children\'s Privacy', body:'Fundo AI is designed for students of all ages with parental guidance for users under 13. We encourage parents to supervise academic AI tool usage.' },
  { title:'Changes to This Policy', body:'We may update this Privacy Policy from time to time. We will notify users of significant changes through our WhatsApp channel.' },
  { title:'Contact Us', body:'If you have questions about this Privacy Policy, contact us at support.fundo.ai@gmail.com or via WhatsApp at wa.me/263719647303.' },
];

export default function PrivacyPage() {
  return (
    <SimplePage title="Privacy Policy" subtitle="Last updated: June 2026">
      <div style={{ maxWidth:740, margin:'0 auto', display:'flex', flexDirection:'column', gap:32 }}>
        {sections.map(s => (
          <div key={s.title}>
            <h3 style={{ fontSize:18, fontWeight:800, color:'#111827', marginBottom:8 }}>{s.title}</h3>
            <p style={{ fontSize:15, color:'#4b5563', lineHeight:1.8 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </SimplePage>
  );
}
