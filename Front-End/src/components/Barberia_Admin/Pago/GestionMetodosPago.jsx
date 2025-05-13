import { useState, useEffect } from 'react';
import axios from 'axios';

const GestionMetodosPago = () => {
  const [metodosPago, setMetodosPago] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    estado: 'activo'
  });

  useEffect(() => {
    fetchMetodosPago();
  }, []);

  const fetchMetodosPago = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/metodos-pago');
      setMetodosPago(response.data);
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (metodoSeleccionado) {
        await axios.put(`http://localhost:3001/api/metodos-pago/${metodoSeleccionado.id}`, form);
      } else {
        await axios.post('http://localhost:3001/api/metodos-pago', form);
      }
      setShowModal(false);
      setMetodoSeleccionado(null);
      setForm({ nombre: '', descripcion: '', estado: 'activo' });
      fetchMetodosPago();
    } catch (error) {
      console.error('Error al guardar método de pago:', error);
    }
  };

  const handleEdit = (metodo) => {
    setMetodoSeleccionado(metodo);
    setForm({
      nombre: metodo.nombre,
      descripcion: metodo.descripcion,
      estado: metodo.estado
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este método de pago?')) {
      try {
        await axios.delete(`http://localhost:3001/api/metodos-pago/${id}`);
        fetchMetodosPago();
      } catch (error) {
        console.error('Error al eliminar método de pago:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#9BC885]">Gestión de Métodos de Pago</h1>
        <button
          onClick={() => {
            setMetodoSeleccionado(null);
            setForm({ nombre: '', descripcion: '', estado: 'activo' });
            setShowModal(true);
          }}
          className="bg-[#224e1a] text-white px-4 py-2 rounded hover:bg-[#0E3C09] transition"
        >
          Agregar Método de Pago
        </button>
      </div>

      {/* Tabla de Métodos de Pago */}
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
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {metodosPago.map((metodo) => (
              <tr key={metodo.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {metodo.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {metodo.descripcion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    metodo.estado === 'activo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {metodo.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(metodo)}
                    className="text-[#224e1a] hover:text-[#0E3C09] mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(metodo.id)}
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
                {metodoSeleccionado ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
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
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
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
                  {metodoSeleccionado ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionMetodosPago; 