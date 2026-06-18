import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import UploadPage  from './pages/UploadPage.jsx';
import AdminPage   from './pages/AdminPage.jsx';
import { ToastProvider } from './hooks/useToast.jsx';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"       element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/admin"  element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
