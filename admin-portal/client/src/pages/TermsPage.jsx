import SimplePage from '../components/SimplePage.jsx';

const sections = [
  { title:'Acceptance of Terms', body:'By accessing or using Fundo AI via WhatsApp, you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of the service.' },
  { title:'Description of Service', body:'Fundo AI is an AI-powered academic assistance platform delivered via WhatsApp. We provide study help, past paper access, voice learning, quiz preparation, project guidance, and more for students at all academic levels.' },
  { title:'User Accounts', body:'Your WhatsApp number serves as your account identifier. You are responsible for all activity associated with your number. Do not share your account credentials.' },
  { title:'Acceptable Use', body:'You agree not to use Fundo AI to engage in academic fraud, submit copyrighted materials without permission, harass other users, attempt to reverse-engineer the service, or use the service for any illegal purpose.' },
  { title:'Subscription Plans', body:'Fundo AI offers Free, Starter ($2/mo), Pro ($5/mo), and Premium ($10/mo) plans. Plans are billed monthly. You may upgrade or downgrade at any time. Refunds are not provided for partial billing periods.' },
  { title:'Uploaded Content', body:'You retain ownership of content you upload. By uploading materials, you grant Fundo AI a non-exclusive licence to display and distribute that content to other students on the platform. Uploading copyrighted materials without permission is strictly prohibited.' },
  { title:'Limitation of Liability', body:'Fundo AI is an educational aid and should not replace formal education. We are not liable for academic outcomes, exam results, or decisions made based on AI-generated content. Always verify important information with qualified educators.' },
  { title:'Termination', body:'We reserve the right to suspend or terminate accounts that violate these terms. You may terminate your account at any time by contacting support.' },
  { title:'Changes to Terms', body:'We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms. We will notify users of material changes through our WhatsApp channel.' },
  { title:'Contact', body:'For questions about these terms, contact us at support.fundo.ai@gmail.com or via WhatsApp at wa.me/263719647303.' },
];

export default function TermsPage() {
  return (
    <SimplePage title="Terms of Service" subtitle="Last updated: June 2026">
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
