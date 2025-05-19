import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const TurnosInfo = ({ isOpen, onRequestClose, selectedDate, onConfirm }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: '',
    genero: '',
    fecha_nacimiento: '',
    contrasena: ''
  });

  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: '',
    genero: '',
    fecha_nacimiento: '',
    contrasena: ''
  });

  const notyf = new Notyf({
    duration: 3000,
    position: {
      x: 'center',
      y: 'top',
    },
    types: [
      {
        type: 'success',
        background: "#28b463",
        className: "rounded-[10px] text-black font-julius text-[15px]"
      }
    ]
  });
  window.notyf = notyf;

  const [isValid, setIsValid] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Validaciones específicas para cada campo
    switch (name) {
      case 'nombre':
      case 'apellido':
        // Solo permitir letras, espacios y caracteres acentuados
        newValue = value.replace(/[^A-Za-zÁáÉéÍíÓóÚúÑñ\s]/g, '');
        break;

      case 'dni':
        // Solo permitir números y máximo 8 dígitos
        newValue = value.replace(/\D/g, '').slice(0, 8);
        break;

      case 'telefono':
        // Solo permitir números y máximo 10 dígitos
        newValue = value.replace(/\D/g, '').slice(0, 10);
        break;

      case 'email':
        // No necesita transformación especial
        break;

      case 'fecha_nacimiento':
        // Asegurarse de que sea una fecha válida
        break;

      default:
        break;
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: newValue
    }));

    validateField(name, newValue);
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'nombre':
      case 'apellido':
        if (!value.trim()) {
          error = `El ${name} es requerido`;
        } else if (value.length < 2) {
          error = `El ${name} debe tener al menos 2 caracteres`;
        }
        break;

      case 'dni':
        if (!value) {
          error = 'El DNI es requerido';
        } else if (value.length !== 8) {
          error = 'El DNI debe tener 8 dígitos';
        }
        break;

      case 'telefono':
        if (!value) {
          error = 'El teléfono es requerido';
        } else if (value.length !== 10) {
          error = 'El teléfono debe tener 10 dígitos';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          error = 'El email es requerido';
        } else if (!emailRegex.test(value)) {
          error = 'Ingrese un email válido';
        }
        break;

      case 'fecha_nacimiento':
        if (!value) {
          error = 'La fecha de nacimiento es requerida';
        } else {
          const date = new Date(value);
          const today = new Date();
          if (date > today) {
            error = 'La fecha no puede ser futura';
          } else {
            const age = today.getFullYear() - date.getFullYear();
            if (age < 16) {
              error = 'Debe ser mayor de 16 años';
            }
          }
        }
        break;

      default:
        break;
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };

  useEffect(() => {
    const formIsValid =
      formData.nombre.trim() !== '' &&
      formData.apellido.trim() !== '' &&
      formData.dni.length === 8 &&
      formData.telefono.length === 10 &&
      formData.email &&
      formData.fecha_nacimiento &&
      !Object.values(errors).some(error => error !== '');

    setIsValid(formIsValid);
  }, [formData, errors]);

  const handleSubmit = () => {
    if (isValid) {
      // Formatear los datos según el modelo
      const clienteData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        dni: formData.dni,
        telefono: formData.telefono,
        email: formData.email.toLowerCase(),
        fecha_nacimiento: new Date(formData.fecha_nacimiento).toISOString(),
        genero: formData.genero || 'No especificado'
      };

      onConfirm(clienteData);
      onRequestClose();
      window.notyf.success("¡Turno agendado!");
      setFormData({
        nombre: '',
        apellido: '',
        dni: '',
        telefono: '',
        email: '',
        genero: '',
        fecha_nacimiento: ''
      });
    }
  };

  const inputStyle = "w-full p-2 rounded-lg outline-none bg-[#267447] shadow-inner text-center font-julius";

  return (
    <Modal
      className={`w-full ${window.innerWidth <= 561 ? 'max-w-[90%]' : 'max-w-[600px]'} h-auto min-h-[500px] movil-sm:h-[450px]`}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Detalles del Turno"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          borderRadius: '20px',
          backgroundColor: "#1e5e39",
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: 'none',
        },
      }}
    >
      <button
        className="absolute top-4 right-4 text-[#e0e0e0] text-opacity-70 w-7 h-7 text-[13px] rounded-md shadow flex justify-center items-center hover:text-opacity-100"
        onClick={onRequestClose}
      >
        ✕
      </button>

      <h2 className="font-julius text-3xl mb-2 text-center text-[#e0e0e0]">
        DATOS PERSONALES
      </h2>

      <div className="w-full space-y-4 text-[#e0e0e0]">
        <div className="flex justify-around gap-4">
          <div className="flex flex-col w-1/2">
            <label className="font-julius mb-1">NOMBRE</label>
            <input
              className={inputStyle}
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder=""
            />
            {errors.nombre && <span className="text-xs mt-1 text-red-300">{errors.nombre}</span>}
          </div>
          <div className="flex flex-col w-1/2">
            <label className="font-julius mb-1">APELLIDO</label>
            <input
              className={inputStyle}
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              placeholder=""
            />
            {errors.apellido && <span className="text-xs mt-1 text-red-300">{errors.apellido}</span>}
          </div>
        </div>

        <div className="flex justify-around gap-4">
          <div className="flex flex-col w-1/2">
            <label className="font-julius mb-1">DNI</label>
            <input
              className={inputStyle}
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              placeholder=""
            />
            {errors.dni && <span className="text-xs mt-1 text-red-300">{errors.dni}</span>}
          </div>
          <div className="flex flex-col w-1/2">
            <label className="font-julius mb-1">TELÉFONO</label>
            <input
              className={inputStyle}
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder=""
            />
            {errors.telefono && <span className="text-xs mt-1 text-red-300">{errors.telefono}</span>}
          </div>
        </div>

        <div className="flex justify-around gap-4">
          <div className="flex flex-col w-1/2">
            <label className="font-julius mb-1">EMAIL</label>
            <input
              className={inputStyle}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder=""
            />
            {errors.email && <span className="text-xs mt-1 text-red-300">{errors.email}</span>}
          </div>
          <div className="flex flex-col w-1/2">
            <label className="font-julius mb-1">FECHA DE NACIMIENTO</label>
            <input
              className={inputStyle}
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleInputChange}
              placeholder=""
            />
            {errors.fecha_nacimiento && <span className="text-xs mt-1 text-red-300">{errors.fecha_nacimiento}</span>}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-julius mb-1">GÉNERO</label>
          <select
            className={inputStyle}
            name="genero"
            value={formData.genero}
            onChange={handleInputChange}
          >
            <option value="">Seleccione un género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <p className="font-julius text-sm text-center">
          TURNO PARA EL DÍA {selectedDate}
        </p>

        <p className="font-julius text-xs text-center">
          ANTE CUALQUIER CAMBIO DE HORARIO O CANCELACIÓN DE TURNO AVISAR MÍNIMO CON UN DÍA DE ANTICIPACIÓN
        </p>

        <div className="flex justify-center">
          <button
            className={`font-julius rounded-md shadow w-[150px] border border-[#e0e0e0] hover:scale-105 transition-transform duration-300 text-[#e0e0e0] p-2 ${
              isValid ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
            }`}
            onClick={handleSubmit}
            disabled={!isValid}
          >
            ACEPTAR
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TurnosInfo;