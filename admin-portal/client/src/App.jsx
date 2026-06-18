import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage  from './pages/LandingPage.jsx';
import UploadPage   from './pages/UploadPage.jsx';
import AdminPage    from './pages/AdminPage.jsx';
import ContactPage  from './pages/ContactPage.jsx';
import PrivacyPage  from './pages/PrivacyPage.jsx';
import TermsPage    from './pages/TermsPage.jsx';
import HelpPage     from './pages/HelpPage.jsx';
import { ToastProvider } from './hooks/useToast.jsx';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"        element={<LandingPage />} />
          <Route path="/upload"  element={<UploadPage />} />
          <Route path="/admin"   element={<AdminPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms"   element={<TermsPage />} />
          <Route path="/help"    element={<HelpPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
