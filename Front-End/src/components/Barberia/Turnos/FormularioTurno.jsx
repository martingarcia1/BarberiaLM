import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import url from '../../../utils/url.js';

const FormularioTurno = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [servicios, setServicios] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [formData, setFormData] = useState({
        cliente_id: localStorage.getItem('cliente_id') || '',
        empleado_id: '',
        servicio_id: '',
        fecha: '',
        hora: '',
        fecha_hora: '',
        observaciones: '',
        pagado_con_puntos: false,
        estado: 'Pendiente'
    });
    const [servicioNombre, setServicioNombre] = useState('');
    const diasSemana = [
        { nombre: 'Lunes', valor: 1 },
        { nombre: 'Martes', valor: 2 },
        { nombre: 'Miércoles', valor: 3 },
        { nombre: 'Jueves', valor: 4 },
        { nombre: 'Viernes', valor: 5 },
        { nombre: 'Sábado', valor: 6 },
    ];
    const [diaSeleccionado, setDiaSeleccionado] = useState('');
    const [fechasDisponibles, setFechasDisponibles] = useState([]);

    useEffect(() => {
        // Verificar si el servicio está en el carrito
        const params = new URLSearchParams(location.search);
        const servicioParam = params.get('servicio');
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const servicioEnCarrito = carrito.find(item => 
            item.name.toLowerCase() === servicioParam?.toLowerCase()
        );

        if (!servicioParam || !servicioEnCarrito) {
            toast.error('Por favor, selecciona y agrega un servicio al carrito primero');
            navigate('/servicios');
            return;
        }

        setServicioNombre(servicioParam);

        // Cargar servicios
        const cargarServicios = async () => {
            try {
                const response = await axios.get(`${url.urlKey}/api/servicios`);
                setServicios(response.data);
                const servicioEncontrado = response.data.find(s => 
                    s.nombre_servicio.toLowerCase() === servicioParam.toLowerCase()
                );
                if (servicioEncontrado) {
                    setFormData(prev => ({ ...prev, servicio_id: servicioEncontrado.id }));
                }
            } catch (error) {
                toast.error('Error al cargar los servicios');
            }
        };
        cargarServicios();
    }, [location.search, navigate]);

    useEffect(() => {
        // Cargar empleados
        const cargarEmpleados = async () => {
            try {
                const response = await axios.get(`${url.urlKey}/api/empleados`);
                setEmpleados(response.data);
            } catch {
                toast.error('Error al cargar los barberos disponibles');
            }
        };
        cargarEmpleados();
    }, []);

    const generarHorarios = () => {
        const horariosDisponibles = [];
        const horaInicio = 10; // 10 AM
        const horaFin = 22; // 10 PM
        for (let hora = horaInicio; hora < horaFin; hora++) {
            for (let minuto = 0; minuto < 60; minuto += 30) {
                const horaFormateada = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
                horariosDisponibles.push(horaFormateada);
            }
        }
        return horariosDisponibles;
    };

    useEffect(() => {
        setHorarios(generarHorarios());
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    useEffect(() => {
        // Actualizar fecha_hora cuando cambian fecha u hora
        if (formData.fecha && formData.hora) {
            setFormData(prev => ({
                ...prev,
                fecha_hora: `${prev.fecha}T${prev.hora}`
            }));
        }
    }, [formData.fecha, formData.hora]);

    // Calcular próximas 5 fechas del día seleccionado
    useEffect(() => {
        if (!diaSeleccionado) {
            setFechasDisponibles([]);
            return;
        }
        const hoy = new Date();
        let fecha = new Date(hoy);
        const diaSemanaSeleccionado = diasSemana.find(d => d.nombre === diaSeleccionado)?.valor;
        // Buscar el próximo día de la semana correspondiente
        while (fecha.getDay() !== diaSemanaSeleccionado) {
            fecha.setDate(fecha.getDate() + 1);
        }
        const fechas = [];
        for (let i = 0; i < 5; i++) {
            fechas.push(new Date(fecha));
            fecha = new Date(fecha);
            fecha.setDate(fecha.getDate() + 7);
        }
        setFechasDisponibles(fechas);
    }, [diaSeleccionado]);

    // Cuando el usuario selecciona una tarjeta de fecha
    const handleFechaCardClick = (fecha) => {
        const yyyy = fecha.getFullYear();
        const mm = String(fecha.getMonth() + 1).padStart(2, '0');
        const dd = String(fecha.getDate()).padStart(2, '0');
        setFormData(prev => ({ ...prev, fecha: `${yyyy}-${mm}-${dd}` }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.cliente_id || !formData.empleado_id || !formData.servicio_id || !formData.fecha_hora) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }

        try {
            const response = await axios.post(`${url.urlKey}/api/citas`, formData);
            
            // Actualizar el carrito removiendo el servicio reservado
            const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            const nuevoCarrito = carrito.filter(item => 
                item.name.toLowerCase() !== servicioNombre.toLowerCase()
            );
            localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));

            // Disparar evento para actualizar contador del carrito
            const event = new CustomEvent('updateCartCounter');
            window.dispatchEvent(event);

            toast.success('Turno reservado con éxito');
            navigate('/turnos');
        } catch (error) {
            console.error('Error al reservar turno:', error);
            toast.error(error.response?.data?.message || 'Error al reservar el turno');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-[#AFB3B7] rounded-lg shadow-lg">
            <h2 className="text-2xl font-julius text-[#0E3C09] mb-6">Reservar Turno</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-[#0E3C09] font-julius mb-2">Servicio</label>
                    <select
                        name="servicio_id"
                        value={formData.servicio_id}
                        disabled
                        className="w-full p-2 border rounded bg-gray-200 text-[#0E3C09] cursor-not-allowed"
                        required
                    >
                        <option value="">Selecciona un servicio</option>
                        {servicios.map(servicio => (
                            <option key={servicio.id} value={servicio.id}>
                                {servicio.nombre_servicio}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-[#0E3C09] font-julius mb-2">Barbero</label>
                    <select
                        name="empleado_id"
                        value={formData.empleado_id}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-white text-[#0E3C09]"
                        required
                    >
                        <option value="">Selecciona un barbero</option>
                        {empleados.map(empleado => (
                            <option key={empleado.id} value={empleado.id}>
                                {empleado.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-[#0E3C09] font-julius mb-2">Día de la semana</label>
                    <select
                        value={diaSeleccionado}
                        onChange={e => setDiaSeleccionado(e.target.value)}
                        className="w-full p-2 border rounded bg-white text-[#0E3C09]"
                    >
                        <option value="">Selecciona un día</option>
                        {diasSemana.map(dia => (
                            <option key={dia.valor} value={dia.nombre}>{dia.nombre}</option>
                        ))}
                    </select>
                </div>
                {fechasDisponibles.length > 0 && (
                    <div className="flex flex-wrap gap-4 my-4">
                        {fechasDisponibles.map((fecha, idx) => {
                            const fechaStr = fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                            const fechaISO = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
                            return (
                                <button
                                    type="button"
                                    key={idx}
                                    onClick={() => handleFechaCardClick(fecha)}
                                    className={`rounded-xl shadow-lg px-6 py-4 font-julius text-lg border-2 transition-all duration-200 ${formData.fecha === fechaISO ? 'bg-[#1e5e39] text-white border-[#1e5e39]' : 'bg-white text-[#0E3C09] border-[#AFB3B7] hover:bg-[#AFB3B7]'}`}
                                >
                                    {fechaStr.charAt(0).toUpperCase() + fechaStr.slice(1)}
                                </button>
                            );
                        })}
                    </div>
                )}
                <div>
                    <label className="block text-[#0E3C09] font-julius mb-2">Hora</label>
                    <select
                        name="hora"
                        value={formData.hora}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-white text-[#0E3C09]"
                        required
                    >
                        <option value="">Selecciona una hora</option>
                        {horarios.map(horario => (
                            <option key={horario} value={horario}>
                                {horario}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-[#0E3C09] font-julius mb-2">Observaciones</label>
                    <textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-white text-[#0E3C09]"
                        rows="3"
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
                    <label className="text-[#0E3C09] font-julius">Pagar con puntos</label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#0E3C09] text-[#e0e0e0] py-2 px-4 rounded hover:bg-[#1e5e39] transition-colors font-julius"
                >
                    Reservar Turno
                </button>
            </form>
        </div>
    );
};

export default FormularioTurno;
