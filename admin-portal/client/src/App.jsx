import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import { ToastProvider } from './hooks/useToast.jsx';

function AuroraBackground() {
  return (
    <>
      <div className="bg-mesh" />
      <div className="bg-grid" />
      <div className="noise" />
      <div className="aurora" aria-hidden="true">
        <div className="orb3" />
        <div className="orb4" />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuroraBackground />
      <BrowserRouter>
        <Routes>
          <Route path="/"      element={<UploadPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
