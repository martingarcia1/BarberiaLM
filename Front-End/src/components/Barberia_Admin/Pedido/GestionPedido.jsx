import { useEffect, useState } from "react";
import axios from "axios";
import url from "../../../utils/url.js"
import ProductosPedidoModal from "./ProductosPedidoModal.jsx";
import { TbRefresh } from "react-icons/tb";
import { FaEye, FaCheckCircle, FaWhatsapp } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from 'react-toastify';


const GestionCitas = () => {
    const [citas, setCitas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtros, setFiltros] = useState({ cliente: "", barbero: "", servicio: "", estado: "", fecha: "" });
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const token = localStorage.getItem("token");

    const traerCitas = async () => {
        try {
            const resp = await axios.get(`${url.urlKey}/api/citas`);
            setCitas(resp.data);
        } catch (error) {
            console.error("Error al traer citas:", error);
        }
    };
    const traerClientes = async () => {
        try {
            const resp = await axios.get(`${url.urlKey}/api/clientes`);
            setClientes(resp.data);
        } catch (error) {}
    };
    const traerEmpleados = async () => {
        try {
            const resp = await axios.get(`${url.urlKey}/api/empleados`);
            setEmpleados(resp.data);
        } catch (error) {}
    };
    const traerServicios = async () => {
        try {
            const resp = await axios.get(`${url.urlKey}/api/servicios`);
            setServicios(resp.data);
        } catch (error) {}
    };

    useEffect(() => {
        traerCitas();
        traerClientes();
        traerEmpleados();
        traerServicios();
    }, []);

    const handleFiltro = (e) => {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    };

    const filtrarCitas = () => {
        let filtradas = [...citas];
        if (filtros.cliente) filtradas = filtradas.filter(c => c.cliente_nombre.toLowerCase().includes(filtros.cliente.toLowerCase()));
        if (filtros.barbero) filtradas = filtradas.filter(c => c.barbero_nombre.toLowerCase().includes(filtros.barbero.toLowerCase()));
        if (filtros.servicio) filtradas = filtradas.filter(c => c.servicio_nombre.toLowerCase().includes(filtros.servicio.toLowerCase()));
        if (filtros.estado) filtradas = filtradas.filter(c => c.estado === filtros.estado);
        if (filtros.fecha) filtradas = filtradas.filter(c => c.fecha_hora.startsWith(filtros.fecha));
        return filtradas;
    };

    const actualizarEstadoCita = async (id, nuevoEstado) => {
        try {
            await axios.put(`${url.urlKey}/api/citas/${id}`, { estado: nuevoEstado });
            toast.success(`Cita ${nuevoEstado.toLowerCase()} con éxito`);
            traerCitas();
            } catch (error) {
            toast.error("Error al actualizar el estado de la cita");
        }
    };

    const enviarWhatsApp = (telefono, mensaje) => {
        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    };

    const getColorEstado = (estado) => {
        switch (estado) {
            case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
            case 'Confirmada': return 'bg-blue-100 text-blue-800';
            case 'Cancelada': return 'bg-red-100 text-red-800';
            case 'Completada': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
        };

        return (
        <div className="container mx-auto py-8">
            <h2 className="text-2xl font-semibold mb-4 font-julius">Gestión de Turnos / Citas</h2>
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <input
                    name="cliente"
                    value={filtros.cliente}
                    onChange={handleFiltro}
                    type="text"
                    placeholder="Buscar por cliente..."
                    className="border rounded px-2 py-1"
                />
                    <input
                    name="barbero"
                    value={filtros.barbero}
                    onChange={handleFiltro}
                    type="text"
                    placeholder="Buscar por barbero..."
                    className="border rounded px-2 py-1"
                    />
                <select 
                    name="servicio" 
                    value={filtros.servicio} 
                    onChange={handleFiltro} 
                    className="border rounded px-2 py-1"
                >
                    <option value="">Todos los servicios</option>
                    {servicios.map((servicio) => (
                        <option key={servicio.id} value={servicio.nombre}>
                            {servicio.nombre}
                        </option>
                    ))}
                </select>
                <select name="estado" value={filtros.estado} onChange={handleFiltro} className="border rounded px-2 py-1">
                    <option value="">Todos los estados</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Cancelada">Cancelada</option>
                    <option value="Completada">Completada</option>
                </select>
                <input
                    name="fecha"
                    value={filtros.fecha}
                    onChange={handleFiltro}
                        type="date"
                    className="border rounded px-2 py-1"
                />
                <button onClick={traerCitas} className="ml-2 bg-[#1e5e39] text-[#e0e0e0] px-5 py-[5px] rounded hover:bg-[#32754f] transition-colors">
                    <TbRefresh className="text-[30px] cursor-pointer" />
                </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                        <tr className="bg-gray-200 text-center">
                            <th className="px-4 py-2">Cliente</th>
                            <th className="px-4 py-2">Barbero</th>
                            <th className="px-4 py-2">Servicio</th>
                            <th className="px-4 py-2">Fecha/Hora</th>
                                <th className="px-4 py-2">Estado</th>
                            <th className="px-4 py-2">Pagado con puntos</th>
                            <th className="px-4 py-2">Observaciones</th>
                            <th className="px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filtrarCitas().map((cita) => (
                            <tr key={cita.id} className="border-b text-center hover:bg-gray-100">
                                <td className="px-4 py-2">{cita.cliente_nombre}</td>
                                <td className="px-4 py-2">{cita.barbero_nombre}</td>
                                <td className="px-4 py-2">{cita.servicio_nombre}</td>
                                <td className="px-4 py-2">{new Date(cita.fecha_hora).toLocaleString()}</td>
                                <td className="px-4 py-2">
                                    <span className={`px-2 py-1 rounded-full ${getColorEstado(cita.estado)}`}>
                                        {cita.estado}
                                    </span>
                                        </td>
                                <td className="px-4 py-2">{cita.pagado_con_puntos ? "Sí" : "No"}</td>
                                <td className="px-4 py-2">{cita.observaciones || "-"}</td>
                                <td className="px-4 py-2">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => {
                                                setCitaSeleccionada(cita);
                                                setMostrarModal(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <FaEye />
                                        </button>
                                        {cita.estado === 'Pendiente' && (
                                            <>
                                                <button
                                                    onClick={() => actualizarEstadoCita(cita.id, 'Confirmada')}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    <FaCheckCircle />
                                                </button>
                                                <button
                                                    onClick={() => actualizarEstadoCita(cita.id, 'Cancelada')}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <IoCloseCircle />
                                                </button>
                                            </>
                                        )}
                                        {cita.estado === 'Confirmada' && (
                                            <button
                                                onClick={() => actualizarEstadoCita(cita.id, 'Completada')}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                <FaCheckCircle />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => enviarWhatsApp(
                                                cita.cliente_telefono,
                                                `Hola ${cita.cliente_nombre}, te recordamos tu cita para el ${new Date(cita.fecha_hora).toLocaleString()} con ${cita.barbero_nombre}`
                                            )}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            <FaWhatsapp />
                                        </button>
                                    </div>
                                        </td>
                                    </tr>
                        ))}
                        </tbody>
                    </table>
            </div>

            {mostrarModal && citaSeleccionada && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
                        <h3 className="text-xl font-bold mb-4">Detalles de la Cita</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p><strong>Cliente:</strong> {citaSeleccionada.cliente_nombre}</p>
                                <p><strong>Barbero:</strong> {citaSeleccionada.barbero_nombre}</p>
                                <p><strong>Servicio:</strong> {citaSeleccionada.servicio_nombre}</p>
                            </div>
        <div>
                                <p><strong>Fecha/Hora:</strong> {new Date(citaSeleccionada.fecha_hora).toLocaleString()}</p>
                                <p><strong>Estado:</strong> {citaSeleccionada.estado}</p>
                                <p><strong>Pagado con puntos:</strong> {citaSeleccionada.pagado_con_puntos ? "Sí" : "No"}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p><strong>Observaciones:</strong></p>
                            <p className="mt-2">{citaSeleccionada.observaciones || "Sin observaciones"}</p>
                        </div>
                            <button
                            onClick={() => setMostrarModal(false)}
                            className="mt-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cerrar
                            </button>
            </div>
            </div>
            )}
        </div>
    );
};

export default GestionCitas;
