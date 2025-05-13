import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ tipoUsuario, children }) {
  const token = localStorage.getItem('token');
  const tipo = localStorage.getItem('tipoUsuario');

  if (!token || tipo !== tipoUsuario) {
    // Si no está logueado o el tipo no coincide, redirige al home
    return <Navigate to="/" replace />;
  }
  return children;
} 