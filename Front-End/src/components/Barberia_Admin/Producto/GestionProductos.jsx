import axios from "axios";
import { useEffect, useState } from "react";
import { FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa6";
import { BsPencilSquare } from "react-icons/bs";
import { TbRefresh } from "react-icons/tb";
import url from "../../../utils/url";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({
    duration: 3000,
    position: { x: 'center', y: 'top' },
    types: [
        { type: 'success', background: "#28b463", className: "rounded-[10px] text-black text-[15px]" }
    ]
});

const PAGE_SIZE = 8;

const GestionProductos = () => {
    const [productos, setProductos] = useState([]);
    const [productosOriginales, setProductosOriginales] = useState([]);
    const [prodSeleccionado, setProdSeleccionado] = useState({});
    const [busqueda, setBusqueda] = useState("");
    const [form, setForm] = useState({
        nombre_producto: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagen_url: "",
        estado: "activo"
    });
    const [isOpenModalBorrar, setIsOpenModalBorrar] = useState(false);
    const [isOpenModalEditar, setIsOpenModalEditar] = useState(false);
    const [pagina, setPagina] = useState(1);

    const traerProductos = async () => {
        try {
            const respuesta = await axios.get(`${url.urlKey}/api/productos`);
        if (respuesta.status === 200) {
            setProductos(respuesta.data);
                setProductosOriginales(respuesta.data);
            }
        } catch (error) {
            notyf.error("Error al traer productos");
        }
    };

    useEffect(() => {
        traerProductos();
    }, []);

    const BuscarProductoPorNombre = (nombre) => {
        setBusqueda(nombre);
        setPagina(1);
        if (nombre.trim() === "") {
            setProductos(productosOriginales);
        } else {
            const nombreMin = nombre.toLowerCase();
            const filtrados = productosOriginales.filter(prod => prod.nombre_producto.toLowerCase().includes(nombreMin));
            setProductos(filtrados);
        }
    };

    const cambiarEstado = async (producto) => {
        try {
            const nuevoEstado = producto.estado === 'activo' ? 'inactivo' : 'activo';
            await axios.put(`${url.urlKey}/api/productos/${producto.id}`, { estado: nuevoEstado });
            notyf.success(`Producto ${producto.nombre_producto} ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'}`);
            traerProductos();
        } catch {
            notyf.error("Error al cambiar estado");
        }
    };

    const handlerClickBorrar = (producto) => {
        setProdSeleccionado(producto);
        setIsOpenModalBorrar(true);
    };

    const handlerClickEditar = (producto) => {
        setProdSeleccionado(producto);
        setForm({ ...producto });
        setIsOpenModalEditar(true);
    };

    const Borrar = async (producto) => {
        try {
            const respuesta = await axios.delete(`${url.urlKey}/api/productos/${producto.id}`);
            if (respuesta.status === 200) {
                notyf.success(`Producto ${producto.nombre_producto} borrado correctamente`);
                traerProductos();
                setIsOpenModalBorrar(false);
            }
        } catch {
            notyf.error("Error al borrar producto");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleGuardar = async () => {
        try {
            if (!form.nombre_producto || !form.precio || !form.stock) {
                notyf.error("Completa los campos obligatorios");
                return;
            }
            if (form.id) {
                await axios.put(`${url.urlKey}/api/productos/${form.id}`, form);
                notyf.success(`Producto "${form.nombre_producto}" editado correctamente`);
            } else {
                await axios.post(`${url.urlKey}/api/productos`, form);
                notyf.success(`Producto "${form.nombre_producto}" guardado correctamente`);
            }
            traerProductos();
            setIsOpenModalEditar(false);
            setForm({ nombre_producto: "", descripcion: "", precio: "", stock: "", imagen_url: "", estado: "activo" });
        } catch {
            notyf.error("Error al guardar producto");
        }
    };

    // Paginación
    const totalPaginas = Math.ceil(productos.length / PAGE_SIZE);
    const productosPagina = productos.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

    return (
            <div className="container mx-auto py-8">
            <div className="mb-6 flex flex-wrap items-center justify-between">
                            <input
                    value={busqueda}
                                onChange={(e) => BuscarProductoPorNombre(e.target.value)}
                                type="text"
                    placeholder="Buscar por nombre..."
                                className="border rounded px-2 py-1 mr-2 mb-2 sm:mb-0"
                    aria-label="Buscar productos"
                />
                            <button
                    onClick={() => setIsOpenModalEditar(true)}
                    className="bg-[#1e5e39] text-white px-4 py-2 rounded hover:bg-[#347c52] transition-colors">
                    + Agregar Producto
                            </button>
                <button
                    onClick={() => traerProductos()}
                    className="ml-2 bg-[#1e5e39] text-[#e0e0e0] px-5 py-[5px] rounded hover:bg-[#32754f] transition-colors">
                                <TbRefresh className="text-[30px] cursor-pointer" />
                </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-200 text-center">
                            <th className="px-4 py-2 text-[20px]">Imagen</th>
                                        <th className="px-4 py-2 text-[20px]">Nombre</th>
                            <th className="px-4 py-2 text-[20px]">Descripción</th>
                            <th className="px-4 py-2 text-[20px]">Precio</th>
                                        <th className="px-4 py-2 text-[20px]">Stock</th>
                            <th className="px-4 py-2 text-[20px]">Estado</th>
                                        <th className="px-4 py-2 text-[20px]">Eliminar</th>
                                        <th className="px-4 py-2 text-[20px]">Editar</th>
                                    </tr>
                                </thead>
                    <tbody>
                        {productosPagina.map((producto) => (
                            <tr key={producto.id} className="border-b font-bold font-sans text-center hover:bg-gray-200">
                                <td className="px-2 py-2">
                                    {producto.imagen_url ? (
                                        <img src={producto.imagen_url} alt={producto.nombre_producto} className="w-16 h-16 object-cover rounded" />
                                    ) : (
                                        <span className="text-gray-400">Sin imagen</span>
                                                )}
                                            </td>
                                <td className="px-4 py-2">{producto.nombre_producto}</td>
                                <td className="px-4 py-2">{producto.descripcion}</td>
                                <td className="px-4 py-2">${producto.precio}</td>
                                <td className="px-4 py-2">{producto.stock}</td>
                                <td className="px-4 py-2">
                                    <button onClick={() => cambiarEstado(producto)}>
                                        {producto.estado === 'activo' ? (
                                            <FaToggleOn className="text-green-500 text-2xl" />
                                        ) : (
                                            <FaToggleOff className="text-gray-500 text-2xl" />
                                        )}
                                    </button>
                                </td>
                                <td className="px-4 py-2">
                                    <FaTrash onClick={() => handlerClickBorrar(producto)} className="text-red-600 cursor-pointer mx-auto" />
                                </td>
                                <td className="px-4 py-2">
                                    <BsPencilSquare onClick={() => handlerClickEditar(producto)} className="text-yellow-400 cursor-pointer mx-auto" />
                                </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
            </div>
            {/* Paginación */}
            <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: totalPaginas }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setPagina(i + 1)}
                        className={`px-3 py-1 rounded ${pagina === i + 1 ? 'bg-[#1e5e39] text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            {/* Modal para agregar/editar producto */}
            {isOpenModalEditar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
                        <button onClick={() => setIsOpenModalEditar(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                        <h2 className="text-2xl font-bold mb-4">{form.id ? 'Editar' : 'Agregar'} Producto</h2>
                        <div className="space-y-4">
                            <input name="nombre_producto" value={form.nombre_producto} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="Nombre del producto" required />
                            <input name="descripcion" value={form.descripcion} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="Descripción" />
                            <input name="precio" type="number" value={form.precio} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="Precio" required />
                            <input name="stock" type="number" value={form.stock} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="Stock" required />
                            <input name="imagen_url" value={form.imagen_url} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="URL de la imagen" />
                            <select name="estado" value={form.estado} onChange={handleInputChange} className="w-full border rounded px-3 py-2">
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setIsOpenModalEditar(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Cancelar</button>
                            <button onClick={handleGuardar} className="bg-[#224e1a] text-white px-6 py-2 rounded hover:bg-[#0E3C09] transition">Guardar</button>
                        </div>
                        </div>
                    </div>
                )}
            {/* Modal para borrar producto */}
            {isOpenModalBorrar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                        <button onClick={() => setIsOpenModalBorrar(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                        <h2 className="text-2xl font-bold mb-4">Borrar Producto</h2>
                        <p>¿Está seguro que desea borrar el producto "{prodSeleccionado.nombre_producto}"?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setIsOpenModalBorrar(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Cancelar</button>
                            <button onClick={() => Borrar(prodSeleccionado)} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">Borrar</button>
                        </div>
                    </div>
            </div>
            )}
        </div>
    );
};

export default GestionProductos;
