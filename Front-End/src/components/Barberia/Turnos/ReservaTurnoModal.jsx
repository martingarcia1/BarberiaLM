import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import url from '../../../utils/url.js';
import { FaWhatsapp, FaCheckCircle } from 'react-icons/fa';

const ReservaTurnoModal = ({
  isOpen,
  onRequestClose,
  servicio,
  horario,
  dia,
  onReservaExitosa
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    celular: '',
    email: '',
    empleado_id: '',
    servicio_id: '',
    observaciones: '',
    pagado_con_puntos: false
  });
  const [empleados, setEmpleados] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalExito, setModalExito] = useState(false);
  const [mensajeWhatsApp, setMensajeWhatsApp] = useState("");
  const [servicios, setServicios] = useState([]);

  // Cargar datos guardados
  useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem('datos_cliente'));
    if (datosGuardados) {
      setFormData(prev => ({ ...prev, ...datosGuardados }));
    }
  }, [isOpen]);

  // Cargar barberos
  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const response = await axios.get(`${url.urlKey}/api/empleados`);
        setEmpleados(response.data);
        console.log('Empleados cargados:', response.data);
      } catch {
        toast.error('Error al cargar los barberos disponibles');
      }
    };
    if (isOpen) cargarEmpleados();
  }, [isOpen]);

  // Efecto para cargar servicios y preseleccionar el servicio recibido
  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const response = await axios.get(`${url.urlKey}/api/servicios`);
        setServicios(response.data);
        // Buscar y preseleccionar el servicio que coincide con el prop
        const servicioEncontrado = response.data.find(s => 
          s.nombre_servicio === servicio ||
          s.nombre_servicio.toLowerCase() === servicio.toLowerCase()
        );
        if (servicioEncontrado) {
          setFormData(prev => ({
            ...prev,
            servicio_id: servicioEncontrado.id
          }));
        }
      } catch (error) {
        toast.error('Error al cargar los servicios disponibles');
      }
    };
    if (isOpen) cargarServicios();
  }, [isOpen, servicio]);

  // Validaciones
  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.dni.match(/^\d{8}$/)) newErrors.dni = 'DNI inválido';
    if (!formData.celular.match(/^\d{10}$/)) newErrors.celular = 'Celular inválido';
    if (!formData.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) newErrors.email = 'Email inválido';
    if (!formData.empleado_id) newErrors.empleado_id = 'Selecciona un barbero';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleServiceChange = (servicioId) => {
    const servicioSeleccionado = servicios.find(s => s.id === parseInt(servicioId));
    if (servicioSeleccionado) {
      setFormData(prev => ({
        ...prev,
        servicio_id: servicioSeleccionado.id,
        precio: servicioSeleccionado.precio
      }));
    }
  };

  // Formatear fecha y hora para mostrar al usuario
  const getFechaHoraLegible = () => {
    if (!dia || !horario) return '';
    const fecha = new Date(`${dia}T${horario}`);
    return fecha.toLocaleString('es-AR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // NUEVO: Filtrar barberos según disponibilidad y servicio
  const getBarberosDisponibles = () => {
    if (!dia || !horario) return [];
    
    // Obtener el servicio seleccionado
    const servicioSeleccionado = servicios.find(s => s.id === parseInt(formData.servicio_id));
    
    // Filtrar primero por horario
    const fecha = new Date(`${dia}T${horario}`);
    const diaSemana = fecha.getDay(); // 0=Dom, 1=Lun, ..., 6=Sab
    const hora = parseInt(horario.split(':')[0], 10);
    const minutos = parseInt(horario.split(':')[1], 10);
    const horaDecimal = hora + minutos / 60;
    
    // Filtrar empleados disponibles según horario y especialidad
    const disponibles = empleados.filter(empleado => {
      // Verificar si el empleado está activo
      if (empleado.estado !== 'activo') return false;
      
      // Verificar si el empleado tiene la especialidad necesaria
      if (servicioSeleccionado && empleado.especialidad) {
        const especialidadesEmpleado = empleado.especialidad.toLowerCase().split(',');
        const servicioNombre = servicioSeleccionado.nombre_servicio.toLowerCase();
        
        // Si el empleado tiene especialidades definidas, debe coincidir con el servicio
        if (!especialidadesEmpleado.some(esp => servicioNombre.includes(esp.trim()))) {
          return false;
        }
      }

      // Verificar disponibilidad por horario
      if (diaSemana >= 1 && diaSemana <= 4) {
        // Lunes a jueves: turno mañana (10-17) o tarde (17-22)
        return (horaDecimal >= 10 && horaDecimal < 17) || (horaDecimal >= 17 && horaDecimal < 22);
      } else if (diaSemana === 5 || diaSemana === 6) {
        // Viernes y sábados: horario corrido (10-22)
        return horaDecimal >= 10 && horaDecimal < 22;
      }
      return false;
    });

    return disponibles.map(empleado => ({
      nombre: `${empleado.nombre} ${empleado.apellido}`,
      id: empleado.id,
      horario: (diaSemana >= 1 && diaSemana <= 4) ?
        (horaDecimal < 17 ? '10:00-17:00' : '17:00-22:00') :
        '10:00-22:00'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setIsSubmitting(true);
    try {
      // Guardar datos cliente en localStorage
      const datosCliente = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        dni: formData.dni,
        celular: formData.celular,
        email: formData.email
      };
      localStorage.setItem('datos_cliente', JSON.stringify(datosCliente));

      // Armar objeto para backend
      const cita = {
        cliente_nombre: formData.nombre,
        cliente_apellido: formData.apellido,
        cliente_dni: formData.dni,
        cliente_celular: formData.celular,
        cliente_email: formData.email,
        empleado_id: formData.empleado_id,
        servicio_id: formData.servicio_id,
        fecha_hora: `${dia}T${horario}`,
        observaciones: formData.observaciones,
        pagado_con_puntos: formData.pagado_con_puntos,
        estado: 'Pendiente'
      };
      const resp = await axios.post(`${url.urlKey}/api/citas`, cita);
      setIsSubmitting(false);
      setMensajeWhatsApp(resp.data.mensajeWhatsApp || "");
      setModalExito(true);
      onReservaExitosa && onReservaExitosa();
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error.response?.data?.message || 'Error al reservar el turno');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Reservar Turno"
      className={`w-full ${window.innerWidth <= 561 ? 'max-w-[90%]' : 'max-w-[600px]'} h-[auto]`}
      style={{
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        content: {
          top: '200px',
          borderRadius: '20px',
          width: '600px',
          margin: 'auto',
          padding: '20px',
          backgroundColor: '#1e5e39',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: 'none',
          position: 'relative',
        },
      }}
    >
      <button
        className="absolute top-4 right-4 text-opacity-70 w-7 h-7 text-[13px] rounded-md shadow flex justify-center items-center"
        onClick={onRequestClose}
      >✕</button>

      {/* Modal de éxito */}
      {modalExito ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <FaCheckCircle className="text-green-400 text-5xl mb-4" />
          <h2 className="font-julius text-2xl text-center text-[#e0e0e0] mb-2">¡Turno reservado con éxito!</h2>
          <p className="text-[#e0e0e0] text-center mb-4">Te enviamos un email con los detalles de tu turno.</p>
          {mensajeWhatsApp && (
            <>
              <p className="text-[#e0e0e0] text-center mb-2">¿Quieres avisarte o guardar tu turno por WhatsApp?</p>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(mensajeWhatsApp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-lg mb-4 transition-colors"
              >
                <FaWhatsapp /> Enviar WhatsApp
              </a>
              <div className="bg-[#2d4d30] text-[#e0e0e0] rounded p-2 text-xs mb-4 max-w-[90%] overflow-x-auto">
                {mensajeWhatsApp}
              </div>
            </>
          )}
          <button
            onClick={() => { setModalExito(false); onRequestClose(); }}
            className="bg-[#1e5e39] text-white px-6 py-2 rounded hover:bg-[#347c52] transition-colors"
          >
            Cerrar
          </button>
        </div>
      ) : (
        <>
          <h2 className="font-julius text-3xl mb-2 text-center text-[#e0e0e0]">Datos para la reserva</h2>
          <div className="mb-4 text-center">
            <div className="font-julius text-[#AFB3B7] text-lg">{servicio}</div>
            <div className="font-julius text-[#0E3C09] text-xl font-bold">{getFechaHoraLegible()}</div>
          </div>
          <form onSubmit={handleSubmit} className="w-full space-y-3">
            {/* Selector de servicio */}
            <div>
              <label className="font-julius text-[#e0e0e0]">Servicio</label>
              <select
                name="servicio_id"
                value={formData.servicio_id}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full p-2 rounded-lg outline-none bg-[#267447] shadow-inner text-center font-julius"
                required
              >
                <option value="">Selecciona un servicio</option>
                {servicios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre_servicio} - ${s.precio}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="font-julius text-[#e0e0e0]">Nombre</label>
                <input
                  className="w-full p-2 rounded-lg outline-none bg-[#267447] shadow-inner text-center font-julius"
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {errors.nombre && <span className="text-xs text-red-300 block mt-1">{errors.nombre}</span>}
              </div>
              <div className="w-1/2">
                <label className="font-julius text-[#e0e0e0]">Apellido</label>
                <input
                  className="w-full p-2 rounded-lg outline-none bg-[#267447] shadow-inner text-center font-julius"
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {errors.apellido && <span className="text-xs text-red-300 block mt-1">{errors.apellido}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="font-julius text-[#e0e0e0]">DNI</label>
                <input
                  className="w-full p-2 rounded-lg outline-none bg-[#267447] shadow-inner text-center font-julius"
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  autoComplete="off"
                  maxLength={8}
                />
                {errors.dni && <span className="text-xs text-red-300 block mt-1">{errors.dni}</span>}
              </div>
              <div className="w-1/2">
                <label className="font-julius text-[#e0e0e0]">Celular</label>
                <input
                  className="w-full p-2 rounded-lg outline-none bg-[#267447] shadow-inner text-center font-julius"
                  type="text"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  autoComplete="off"
                  maxLength={10}
                />
                {errors.celular && <span className="text-xs text-red-300 block mt-1">{errors.celular}</span>}
              </div>
            </div>
            <div>
              <label className="font-julius text-[#e0e0e0]">Email</label>
              <input
                className="w-full p-2 rounded-lg outline-none bg-[#267447] shadow-inner text-center font-julius"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.email && <span className="text-xs text-red-300 block mt-1">{errors.email}</span>}
            </div>
            <div>
              <label className="font-julius text-[#e0e0e0]">Barbero</label>
              <select
                name="empleado_id"
                value={formData.empleado_id}
                onChange={handleChange}
                className="w-full p-2 rounded-lg outline-none bg-[#267447] shadow-inner text-center font-julius"
                required
              >
                <option value="">Selecciona un barbero</option>
                {getBarberosDisponibles().map(barbero => (
                  <option key={barbero.id} value={barbero.id}>
                    {barbero.nombre} ({barbero.horario})
                  </option>
                ))}
              </select>
              {errors.empleado_id && <span className="text-xs text-red-300 block mt-1">{errors.empleado_id}</span>}
            </div>
            <div>
              <label className="font-julius text-[#e0e0e0]">Observaciones</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                className="w-full p-2 rounded-lg outline-none bg-[#267447] shadow-inner text-center font-julius"
                rows="2"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="pagado_con_puntos"
                checked={formData.pagado_con_puntos}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-[#e0e0e0] font-julius">Pagar con puntos</label>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="font-julius rounded-md shadow w-[150px] border border-[#e0e0e0] hover:scale-105 transition-transform duration-300 text-[#e0e0e0] p-2 bg-[#0E3C09]"
              >
                {isSubmitting ? 'Reservando...' : 'Reservar Turno'}
              </button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
};

ReservaTurnoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  servicio: PropTypes.string.isRequired,
  horario: PropTypes.string.isRequired,
  dia: PropTypes.string.isRequired,
  onReservaExitosa: PropTypes.func
};

export default ReservaTurnoModal;