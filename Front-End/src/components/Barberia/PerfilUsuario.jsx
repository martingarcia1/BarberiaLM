import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { isTokenvalid } from "../../utils/isTokenValid";
import { API_URL } from "../config/api";

const PerfilUsuario = () => {
  const [datos, setDatos] = useState({});
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState({});
  const [historial, setHistorial] = useState([]);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const clienteId = localStorage.getItem('cliente_id');
    const tipoUsuario = localStorage.getItem('tipoUsuario');

    if (!token || !clienteId || !isTokenvalid(token) || tipoUsuario !== 'cliente') {
      localStorage.clear();
      navigate('/login/cliente');
      return;
    }

    const cargarDatosUsuario = async () => {
      try {
        const response = await axios.get(`${API_URL}/clientes/${clienteId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data) {
          setDatos(response.data);
          setForm(response.data);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate('/login/cliente');
        }
      }
    };

    cargarDatosUsuario();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const abrirModal = () => {
    setForm(datos);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const clienteId = localStorage.getItem('cliente_id');

      const response = await axios.put(
        `${API_URL}/clientes/${clienteId}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data) {
        setDatos(response.data);
        setModalAbierto(false);
        setFeedback('¡Perfil actualizado exitosamente!');
        setTimeout(() => setFeedback(''), 2500);
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      setFeedback('Error al actualizar el perfil. Por favor, intenta nuevamente.');
      setTimeout(() => setFeedback(''), 2500);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <nav className="mb-8 flex gap-4">
        <Link to="/cliente/dashboard" className="btn">Perfil</Link>
        <Link to="/cliente/canjear" className="btn">Canjear Puntos</Link>
        {/* <Link to="/cliente/historial" className="btn">Historial</Link> */}
        <button onClick={handleLogout} className="btn bg-red-500 text-white">Cerrar sesión</button>
      </nav>
      <h1 className="text-4xl font-bold mb-2">Perfil</h1>
      <p className="mb-8 text-[#444]">Acá podrás editar tu datos dentro de la plataforma</p>
      {feedback && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 font-semibold text-center shadow transition-all duration-300">
          {feedback}
        </div>
      )}
      <div className="flex items-center mb-6 gap-4">
        <div className="w-14 h-14 rounded-full bg-[#f3f3f3] flex items-center justify-center text-2xl font-bold text-[#444]">
          {datos.nombre && datos.nombre[0]}{datos.apellido && datos.apellido[0]}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{datos.nombre} {datos.apellido}</span>
            <span className="flex items-center gap-1 bg-[#f7f7f7] px-3 py-1 rounded-full text-sm font-semibold border border-[#e0e0e0]">
              <span role="img" aria-label="medalla">🥇</span> {datos.nivel}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="mb-4">
            <span className="font-bold">Nombre completo</span>
            <div>{datos.nombre + ' ' + datos.apellido}</div>
          </div>
          <div className="mb-4">
            <span className="font-bold">Teléfono</span>
            <div>{datos.telefono}</div>
          </div>
          <div className="mb-4">
            <span className="font-bold">DNI</span>
            <div>{datos.dni}</div>
          </div>
          <div className="mb-4">
            <span className="font-bold">Contraseña</span>
            <div>********</div>
          </div>
        </div>
        <div>
          <div className="mb-4">
            <span className="font-bold">Correo electrónico</span>
            <div>{datos.email}</div>
          </div>
          <div className="mb-4">
            <span className="font-bold">Género</span>
            <div>{datos.genero}</div>
          </div>
          <div className="mb-4">
            <span className="font-bold">Fecha de nacimiento</span>
            <div>{new Date(datos.fechaNacimiento).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      <div className="mb-8 flex gap-4">
        <button onClick={abrirModal} className="bg-[#AFB3B7] text-[#181818] px-6 py-2 rounded hover:bg-[#e0e0e0] transition">Editar perfil</button>
      </div>
      {/* Modal de edición */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button onClick={cerrarModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4">Editar perfil</h2>
            <form onSubmit={handleGuardar} className="space-y-4">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block mb-1">Nombre</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div className="w-1/2">
                  <label className="block mb-1">Apellido</label>
                  <input name="apellido" value={form.apellido} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block mb-1">Teléfono</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div className="w-1/2">
                  <label className="block mb-1">DNI</label>
                  <input name="dni" value={form.dni} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block mb-1">Correo electrónico</label>
                  <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div className="w-1/2">
                  <label className="block mb-1">Género</label>
                  <input name="genero" value={form.genero} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block mb-1">Fecha de nacimiento</label>
                  <input name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div className="w-1/2">
                  <label className="block mb-1">Contraseña</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={cerrarModal} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-[#224e1a] text-white px-6 py-2 rounded hover:bg-[#0E3C09] transition">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Puntos acumulados</h2>
        <div className="text-3xl font-bold text-[#224e1a]">{datos.puntos} pts</div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Historial de compras</h2>
        <table className="w-full bg-white rounded shadow overflow-hidden">
          <thead className="bg-[#AFB3B7] text-[#181818]">
            <tr>
              <th className="py-2 px-4">Fecha</th>
              <th className="py-2 px-4">Servicio</th>
              <th className="py-2 px-4">Puntos</th>
              <th className="py-2 px-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((item) => (
              <tr key={item.id} className="text-center border-b">
                <td className="py-2 px-4">{item.fecha}</td>
                <td className="py-2 px-4">{item.servicio}</td>
                <td className="py-2 px-4">{item.puntos}</td>
                <td className="py-2 px-4">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerfilUsuario;