import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Barberia_Admin/Login';
import SideBar from './components/Barberia_Admin/SideBar';
import ProtectedRoute from './components/Barberia_Admin/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <SideBar />
          </ProtectedRoute>
        } />
        {/* Redirigir cualquier otra ruta a /admin/login */}
        <Route path="*" element={<Navigate to="/admin/login" />} />
      </Routes>
    </Router>
  );
}

export default App; 