import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from "../../../config/api";
import ServiciosInfo from './ServiciosInfo';
import Modal from 'react-modal';
import Footer from '../Home/Footer';

Modal.setAppElement('#root');

const Servicios = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [productosEnCarrito, setProductosEnCarrito] = useState([]);

    useEffect(() => {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        setProductosEnCarrito(carrito);
    }, []);

    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await axios.get(`${API_URL}/servicios`);
                // Mapear los datos de la DB al formato que espera el componente
                const serviciosMapeados = response.data.map(servicio => ({
                    id: servicio.id,
                    // Si no hay imagen en DB, usar una por defecto o mapear según nombre
                    img: servicio.imagen_url || "/img/labarberia.jpg",
                    name: servicio.nombre_servicio,
                    price: parseFloat(servicio.precio),
                    descripcion: servicio.descripcion,
                    duracion: `${servicio.duracion} min`,
                    carrito: false,
                    cantidad: 1
                }));
                setServicios(serviciosMapeados);
            } catch (error) {
                console.error("Error al cargar servicios:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServicios();

        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        setProductosEnCarrito(carrito);
    }, []);

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const agregarAlCarrito = (producto) => {
        const existeEnCarrito = productosEnCarrito.some(item => item.name === producto.name);

        if (!existeEnCarrito) {
            const servicioParaCarrito = {
                id: producto.id,
                name: producto.name,
                price: producto.price,
                duracion: producto.duracion,
                img: producto.img,
                tipo: 'servicio',
                carrito: true,
                cantidad: 1
            };
            const nuevosProductos = [...productosEnCarrito, servicioParaCarrito];
            setProductosEnCarrito(nuevosProductos);
            localStorage.setItem("carrito", JSON.stringify(nuevosProductos));
            window.location.href = `/turnos/lunes?servicio=${encodeURIComponent(servicioParaCarrito.name)}`;
        } else {
            window.location.href = `/turnos/lunes?servicio=${encodeURIComponent(producto.name)}`;
        }

        const event = new CustomEvent('updateCartCounter');
        window.dispatchEvent(event);
    };

    return (
        <div>
            <div className="flex justify-center mt-[100px]">
                <h2 className='font-julius text-6xl movil-s:text-4xl  movil-sm:text-3xl font-extrabold text-[#e0e0e0]'>
                    SERVICIOS DISPONIBLES
                </h2>
            </div>

            <div id='Servicios' className=" movil-s:flex movil-sm:flex movil-s:justify-center movil-sm:justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {servicios.map((servicio) => (
                        <div key={servicio.id} className="bg-[#AFB3B7] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                            <div className="relative">
                                <img src={servicio.img} alt={servicio.name} className="w-full h-48 object-cover" />
                                <div className="absolute top-0 right-0 m-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm movil-sm:hidden font-semibold">Nuevo</div>
                            </div>
                            <div className="p-6 space-y-4 movil-sm:space-y-4 font-julius text-[#0E3C09]">
                                <h2 className="text-2xl font-bold text-[#e0e0e0] hover:text-gray-600 transition-colors duration-300" tabIndex="0">{servicio.name}</h2>
                                <div className="flex items-center space-x-1" aria-label="5 out of 5 stars rating">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 bg-[#AFB3B7] transition-transform hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 bg-[#AFB3B7] transition-transform hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 bg-[#AFB3B7] transition-transform hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 bg-[#AFB3B7] transition-transform hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 bg-[#AFB3B7] transition-transform hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-[#070707]">Av. Roca 2398</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-[#070707]">Precio: <span className="rounded-lg px-[1px] py-1">${servicio.price}</span></p>
                                </div>
                                <button
                                    className="mt-2 w-full rounded-md text-[16px] p-2 font-julius border border-[#e0e0e0] hover:scale-105 transition-transform duration-300 mb-2 text-[#e0e0e0] bg-[#0E3C09]"
                                    onClick={() => agregarAlCarrito(servicio)}
                                >
                                    Comprar y Reservar Turno
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <ServiciosInfo
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    producto={null}
                    agregarAlCarrito={agregarAlCarrito}
                />
            </div>

            <Footer></Footer>
        </div>
    );
}

export default Servicios;