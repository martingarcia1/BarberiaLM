// Listado y acciones principales de los empleados

import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const NuevoEmpleado = ({ onClose }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    especialidad: '',
    salario: '',
    contraseña: '',
    estado: 'activo'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/empleados', form);
      onClose();
    } catch (error) {
      console.error('Error al crear empleado:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">Nuevo Empleado</h3>
        <button 
          onClick={onClose} 
          className="text-2xl text-gray-400 hover:text-red-500 transition-colors"
          type="button"
        >
          &times;
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Nombre</label>
            <input 
              name="nombre" 
              className="w-full border rounded px-3 py-2" 
              value={form.nombre} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Apellido</label>
            <input 
              name="apellido" 
              className="w-full border rounded px-3 py-2" 
              value={form.apellido} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Teléfono</label>
            <input 
              name="telefono" 
              className="w-full border rounded px-3 py-2" 
              value={form.telefono} 
              onChange={handleChange} 
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Correo</label>
            <input 
              name="email" 
              type="email"
              className="w-full border rounded px-3 py-2" 
              value={form.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Especialidad</label>
            <input 
              name="especialidad" 
              className="w-full border rounded px-3 py-2" 
              value={form.especialidad} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Salario</label>
            <input 
              name="salario" 
              type="number"
              step="0.01"
              className="w-full border rounded px-3 py-2" 
              value={form.salario} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>
        <div className="space-y-4 col-span-1 md:col-span-2">
          <div>
            <label className="block text-gray-600 mb-1">Contraseña</label>
            <input 
              name="contraseña" 
              type="password" 
              className="w-full border rounded px-3 py-2" 
              value={form.contraseña} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Estado</label>
            <select 
              name="estado" 
              className="w-full border rounded px-3 py-2" 
              value={form.estado} 
              onChange={handleChange}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
        <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
          <button 
            type="submit" 
            className="bg-[#224e1a] text-white px-6 py-2 rounded hover:bg-[#0E3C09] transition-colors"
          >
            Crear
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

NuevoEmpleado.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default NuevoEmpleado;
