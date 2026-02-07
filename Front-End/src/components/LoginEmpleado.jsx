import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { API_URL } from "../config/api";

export default function LoginEmpleado() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();
  const notyf = new Notyf();

  const handlerLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/empleados/login`, {
        email,
        contrasena
      });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('tipoUsuario', 'empleado');
        notyf.success("¡Bienvenido!");
        navigate('/empleado/dashboard');
      }
    } catch {
      notyf.error("Email o Contraseña incorrectos");
    }
  };

  return (
    <form onSubmit={handlerLogin} className="flex flex-col items-center mt-32">
      <h2 className="text-2xl mb-8">Login Empleado</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="mb-4" />
      <input type="password" value={contrasena} onChange={e => setContrasena(e.target.value)} placeholder="Contraseña" required className="mb-4" />
      <button type="submit" className="btn">Ingresar</button>
    </form>
  );
} 