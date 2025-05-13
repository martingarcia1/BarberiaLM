import { Navigate } from "react-router-dom";
import { isTokenvalid } from "../../utils/isTokenValid";
import PropTypes from "prop-types";

const ProtectedRoute = ({ tipoUsuario, children }) => {
  const token = localStorage.getItem('token');
  const tipo = localStorage.getItem('tipoUsuario');

  if (!token || !isTokenvalid(token) || tipo !== tipoUsuario) {
    // Redirige al login correspondiente según el tipo de usuario
    if (tipoUsuario === "cliente") return <Navigate to="/login/cliente" />;
    if (tipoUsuario === "empleado") return <Navigate to="/login/empleado" />;
    return <Navigate to="/login/admin" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  tipoUsuario: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;