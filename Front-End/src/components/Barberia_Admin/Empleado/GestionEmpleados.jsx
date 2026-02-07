import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NuevoEmpleado from './NuevoEmpleado';
import EditarEmpleado from './EditarEmpleado';
import ModalEliminarEmpleado from './ModalEliminarEmpleado';
import { FaUserEdit, FaTrashAlt, FaUserPlus } from 'react-icons/fa';
import { API_URL } from "../../../config/api";

const GestionEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const fetchEmpleados = async () => {
    try {
      const response = await axios.get(`${API_URL}/empleados`);
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleEdit = (empleado) => {
    setSelectedEmpleado(empleado);
    setShowEditModal(true);
  };

  const handleDelete = (empleado) => {
    setSelectedEmpleado(empleado);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/empleados/${selectedEmpleado.id}`);
      setShowDeleteModal(false);
      setSelectedEmpleado(null);
      fetchEmpleados();
      setMensaje('Empleado eliminado exitosamente.');
      setTimeout(() => setMensaje(''), 2500);
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setShowNewModal(false);
    setShowDeleteModal(false);
    setSelectedEmpleado(null);
  };

  return (
    <div className="bg-[#222] p-6 rounded-xl shadow-lg relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#9BC885]">Gestión de Empleados</h2>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 bg-[#9BC885] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#7ba96a] transition"
        >
          <FaUserPlus /> Registrar Nuevo Empleado
        </button>
      </div>
      {mensaje && <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded shadow-lg animate-fade-in">{mensaje}</div>}
      {error && <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded shadow-lg animate-fade-in">{error}</div>}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Apellido
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Especialidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salario
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
            {empleados.map((empleado) => (
              <tr key={empleado.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {empleado.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {empleado.apellido}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {empleado.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {empleado.telefono}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {empleado.especialidad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${empleado.salario}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${empleado.estado === 'activo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {empleado.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(empleado)}
                    className="text-[#224e1a] hover:text-[#0E3C09] mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(empleado)}
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

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <EditarEmpleado
              empleado={selectedEmpleado}
              onClose={() => {
                handleCloseModal();
                fetchEmpleados();
                setMensaje('Empleado editado exitosamente.');
                setTimeout(() => setMensaje(''), 2500);
              }}
            />
          </div>
        </div>
      )}

      {showNewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <NuevoEmpleado
              onClose={() => {
                handleCloseModal();
                fetchEmpleados();
                setMensaje('Empleado registrado exitosamente.');
                setTimeout(() => setMensaje(''), 2500);
              }}
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <ModalEliminarEmpleado
              empleado={selectedEmpleado}
              onClose={handleCloseModal}
              onConfirm={handleDeleteConfirm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionEmpleados;
