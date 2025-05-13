import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import ArmarBowlCard from '../ArmarBowl/ArmarBowlCard.jsx';
import ArmarBowlInfo from '../ArmarBowl/ArmarBowlInfo.jsx';
import axios from 'axios';
import Footer from '../Home/Footer.jsx';
import url from "../../../utils/url.js";

Modal.setAppElement('#root');

const ArmarBowl = () => {
    const [productos, setProductos] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [mostrarIcon, setMostrarIcon] = useState([]);
    const [VerBotonPresionado, SetVerBotonPresionado] = useState();
    const [selectedTipoProduct, setSelectedTipoProduct] = useState(null);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [cantidadElegir, setCantidadElegir] = useState(null);
    const [selectedItems, setSelectedItems] = useState({});
    const [notificacion, setNotificacion] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Verificar si los datos ya están en localStorage
                const cachedData = localStorage.getItem('productosArmarBowl');
                if (cachedData) {
                    setProductos(JSON.parse(cachedData));
                } else {
                    // Si no están en localStorage, llamar a la API
                    const respuesta = await axios.get(`${url.urlKey}/api/producto/findAll`);
                    localStorage.setItem('productosArmarBowl', JSON.stringify(respuesta.data));
                    setProductos(respuesta.data);
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchData();

        // Limpiar localStorage al salir de la página
        const handleBeforeUnload = () => {
            localStorage.removeItem('productosArmarBowl');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (productos && selectedTipoProduct) {
            const filtrados = productos.filter(prod => prod.tipoProducto === selectedTipoProduct);
            setProductosFiltrados(filtrados);
        }
    }, [selectedTipoProduct, productos]);

    const salads = [
        { id: 1, img: "/img/Bases.jfif", name: "Base", cantidad: 1, MostrarIcon: mostrarIcon.includes(1) ? true : false },
        { id: 2, img: "/img/Ingredientes.jpg", name: "Ingrediente", cantidad: 4, MostrarIcon: mostrarIcon.includes(2) ? true : false },
        { id: 3, img: "/img/proteinas.jpg", name: "Proteina", cantidad: 1, MostrarIcon: mostrarIcon.includes(3) ? true : false },
        { id: 4, img: "/img/Quesos.jpg", name: "Queso", cantidad: 1, MostrarIcon: mostrarIcon.includes(4) ? true : false },
        { id: 5, img: "/img/Premium.jpg", name: "Premium", cantidad: 1, MostrarIcon: mostrarIcon.includes(5) ? true : false },
        { id: 6, img: "/img/Aderezo.webp", name: "Aderezo", cantidad: 2, MostrarIcon: mostrarIcon.includes(6) ? true : false },
    ];

    const openModal = (product) => {
        setSelectedTipoProduct(product.name);
        setCantidadElegir(product.cantidad);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedTipoProduct(null);
    };

    const agregarAlCarrito = () => {
        const todosSeleccionados = salads.every(item => mostrarIcon.includes(item.id));
        if (!todosSeleccionados) {
            window.notyf.error("Debes completar todos los pasos antes de agregar al carrito");
            return;
        }

        const ingredientesFinal = Object.values(selectedItems).flat().map(item => ({ id: item.id }));

        const bowlPersonalizado = {
            id: `bowl_${Date.now()}`,
            name: "Bowl Personalizado",
            img: "/img/EnsaladaArmarBowl.webp",
            price: 6500,
            cantidad: 1,
            ingId: ingredientesFinal,
            carrito: false,
        };

        const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
        const nuevoCarrito = [...carritoActual, bowlPersonalizado];
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));

        window.notyf.success("Bowl agregado al carrito correctamente");

        const event = new CustomEvent('updateCartCounter');
        window.dispatchEvent(event);

        setMostrarIcon([]);
        setSelectedItems({});
    };

    const updateSelectedItems = (tipo, items) => {
        setSelectedItems(prev => ({
            ...prev,
            [tipo]: items.map(item => ({ id: item.id, name: item.name }))
        }));
    };

    return (
        <div>
            <div className="flex justify-center mt-[100px]">
                <h2 className='font-julius text-[#e0e0e0] text-6xl movil-sm:text-4xl movil-s:text-5xl movil-m:text-5xl font-extrabold'>
                    ARMA TU BOWL
                </h2>
            </div>

            <div className="flex justify-center mt-[60px]">
                <h3 className='font-julius text-[#e0e0e0] text-5xl movil-m:text-3xl  movil-s:text-3xl movil-sm:text-2xl font-extrabold text-center'>
                    COMO MAS TE GUSTE <br /> EN 6 PASOS
                </h3>
            </div>

            <div id='ArmarBolw' className="mb-2 max-e:flex max-e:justify-center movil-m:flex movil-s:flex movil-sm:flex justify-center">
                <div
                    id='Primera_fila'
                    className='gap-8 flex flex-wrap max-e:justify-center max-pe:justify-center max-pe:ml-[400px] max-pe:mr-[400px] movil-s:flex movil-sm:justify-center  mt-[50px]'
                >
                    {salads.map((salad) => (
                        <ArmarBowlCard
                            key={salad.id}
                            product={salad}
                            openModal={openModal}
                            setSetVerBotonPresionado={SetVerBotonPresionado}
                            mostrarIcon={mostrarIcon}
                        />
                    ))}
                </div>
                <ArmarBowlInfo
                    isOpen={modalIsOpen}
                    setIsOpen={setModalIsOpen}
                    onRequestClose={closeModal}
                    productos={productosFiltrados}
                    tipoProducto={selectedTipoProduct}
                    cantidadElegir={cantidadElegir}
                    setMostrarIcon={setMostrarIcon}
                    VerBotonPresionado={VerBotonPresionado}
                    updateSelectedItems={updateSelectedItems}
                />
            </div>

            <div className="flex mt-[30px] justify-center text-[#e0e0e0]">
                <button
                    onClick={agregarAlCarrito}
                    className=' relative w-56 h-12 movil-s:w-[200px] border-[2px] border-[#1e5e39] hover:scale-105 hover:border-[#e0e0e0] rounded-lg transition-transform duration-300 focus:outline-none font-julius'
                >
                    Agregar al carrito
                </button>
                <div className=' flex items-center justify-center relative w-56 h-12 movil-sm:w-[200px] border-[2px] border-[#1e5e39]  rounded-lg transition-colors duration-300 focus:outline-none ml-[20px] font-julius'>
                    Precio: $6500
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ArmarBowl;
