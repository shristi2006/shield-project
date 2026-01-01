import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AnalystDashboard from './pages/analyst/AnalystDashboard';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/analyst/dashboard" element={<AnalystDashboard />} />

        {/* dashboards come later */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
