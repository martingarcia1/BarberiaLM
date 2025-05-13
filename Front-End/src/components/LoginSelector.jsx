import { Link } from "react-router-dom";

export default function LoginSelector() {
  return (
    <div className="flex flex-col items-center mt-32">
      <h2 className="text-2xl mb-8">¿Cómo deseas ingresar?</h2>
      <Link to="/login/admin" className="btn mb-4">Administrador</Link>
      <Link to="/login/empleado" className="btn mb-4">Empleado</Link>
      <Link to="/login/cliente" className="btn">Cliente</Link>
    </div>
  );
} 