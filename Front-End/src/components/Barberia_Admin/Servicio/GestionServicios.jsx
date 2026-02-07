import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from "../../config/api";

const GestionServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [form, setForm] = useState({
    nombre_servicio: '',
    descripcion: '',
    precio: '',
    duracion: '',
    puntos_requeridos: '',
    estado: 'activo'
  });

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const response = await axios.get(`${API_URL}/servicios`);
      setServicios(response.data);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const servicioData = {
        ...form,
        precio: parseFloat(form.precio),
        duracion: parseInt(form.duracion),
        puntos_requeridos: parseInt(form.puntos_requeridos)
      };

      if (servicioSeleccionado) {
        await axios.put(`${API_URL}/servicios/${servicioSeleccionado.id}`, servicioData);
      } else {
        await axios.post(`${API_URL}/servicios`, servicioData);
      }
      setShowModal(false);
      setServicioSeleccionado(null);
      setForm({
        nombre_servicio: '',
        descripcion: '',
        precio: '',
        duracion: '',
        puntos_requeridos: '',
        estado: 'activo'
      });
      fetchServicios();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
    }
  };

  const handleEdit = (servicio) => {
    setServicioSeleccionado(servicio);
    setForm({
      nombre_servicio: servicio.nombre_servicio,
      descripcion: servicio.descripcion,
      precio: servicio.precio.toString(),
      duracion: servicio.duracion.toString(),
      puntos_requeridos: servicio.puntos_requeridos.toString(),
      estado: servicio.estado
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este servicio?')) {
      try {
        await axios.delete(`${API_URL}/servicios/${id}`);
        fetchServicios();
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#9BC885]">Gestión de Servicios</h1>
        <button
          onClick={() => {
            setServicioSeleccionado(null);
            setForm({
              nombre_servicio: '',
              descripcion: '',
              precio: '',
              duracion: '',
              puntos_requeridos: '',
              estado: 'activo'
            });
            setShowModal(true);
          }}
          className="bg-[#224e1a] text-white px-4 py-2 rounded hover:bg-[#0E3C09] transition"
        >
          Agregar Servicio
        </button>
      </div>

      {/* Tabla de Servicios */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duración
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puntos Requeridos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {servicios.map((servicio) => (
              <tr key={servicio.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {servicio.nombre_servicio}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {servicio.descripcion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${servicio.precio}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {servicio.duracion} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {servicio.puntos_requeridos}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${servicio.estado === 'activo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {servicio.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(servicio)}
                    className="text-[#224e1a] hover:text-[#0E3C09] mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(servicio.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Agregar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">
                {servicioSeleccionado ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl text-gray-400 hover:text-red-500 transition-colors"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">Nombre</label>
                <input
                  type="text"
                  value={form.nombre_servicio}
                  onChange={(e) => setForm({ ...form, nombre_servicio: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Duración (minutos)</label>
                <input
                  type="number"
                  value={form.duracion}
                  onChange={(e) => setForm({ ...form, duracion: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Puntos Requeridos</label>
                <input
                  type="number"
                  value={form.puntos_requeridos}
                  onChange={(e) => setForm({ ...form, puntos_requeridos: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Estado</label>
                <select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#224e1a] text-white px-4 py-2 rounded hover:bg-[#0E3C09] transition"
                >
                  {servicioSeleccionado ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionServicios;