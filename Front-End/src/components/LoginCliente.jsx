import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function LoginCliente() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();
  const notyf = new Notyf();

  const handlerLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/clientes/login', {
        email,
        contrasena
      });

      if (response.data.message === 'Login exitoso') {
        // Guardar token
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('tipoUsuario', 'cliente');
        localStorage.setItem('cliente_id', response.data.cliente.id);
        
        // Guardar datos del usuario
        const userData = {
          nombre: response.data.cliente.nombre,
          email: response.data.cliente.email,
          id: response.data.cliente.id
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        notyf.success("¡Bienvenido!");
        navigate('/cliente/dashboard');
      }
    } catch (error) {
      console.error('Error de login:', error);
      notyf.error(error.response?.data?.message || "Email o Contraseña incorrectos");
    }
  };

  return (
    <form onSubmit={handlerLogin} className="flex flex-col items-center mt-32">
      <h2 className="text-2xl mb-8">Login Cliente</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="mb-4" />
      <input type="password" value={contrasena} onChange={e => setContrasena(e.target.value)} placeholder="Contraseña" required className="mb-4" />
      <button type="submit" className="btn">Ingresar</button>
    </form>
  );
}