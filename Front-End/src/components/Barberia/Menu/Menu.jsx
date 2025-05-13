import React, { useState } from 'react';
import MenuInfo from './MenuInfo';
import Modal from 'react-modal';
import ProductCard from '../Productos/ProductCard';
import Footer from '../Home/Footer';

Modal.setAppElement('#root');

const Menu = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [carritoProductos, setCarritoProductos] = useState(() => {
        const savedCart = localStorage.getItem("carrito");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const salads = [
        {
            id: 1,
            img: "/img/Cesar.webp",
            name: "César",
            price: 5500,
            ing: ["Mix de verdes", "Pollo", "Queso parmesano", "Croutones", "Mix de semillas"],
            ingId: [
                { id: 4 },
                { id: 26 },
                { id: 31 },
                { id: 57 },
                { id: 38 }
            ],
            carrito: false,
            cantidad: 1
        },
        {
            id: 2,
            img: "/img/Agridulce.webp",
            name: "Agridulce",
            price: 5500,
            ing: ["Arroz integral", "Cebolla Caramelizada", "Pasas de uvas", "Zanahoria", "Jamon cocido", "Roquefort"],
            ingId: [
                { id: 8 },
                { id: 10 },
                { id: 17 },
                { id: 25 },
                { id: 29 },
                { id: 32 }
            ],
            carrito: false,
            cantidad: 1
        },
        {
            id: 3,
            img: "/img/Waldorf.jpg",
            name: "Waldorf",
            price: 5500,
            ing: ["Mix de verdes", "Apio", "Manzana", "Pollo Salteado", "Roquefort", "Frutos Secos"],
            ingId: [
                { id: 4 },
                { id: 58 },
                { id: 59 },
                { id: 60 },
                { id: 32 },
                { id: 37 }
            ],
            carrito: false,
            cantidad: 1
        },
        {
            id: 4,
            img: "/img/Vegetariana.webp",
            name: "Vegetariana",
            price: 5500,
            ing: ["Lechuga", "Huevo", "Palta", "Lentejas", "Remolacha", "Queso tybo", "Frutos secos"],
            ingId: [
                { id: 1 },
                { id: 14 },
                { id: 39 },
                { id: 18 },
                { id: 19 },
                { id: 33 },
                { id: 37 }
            ],
            carrito: false,
            cantidad: 1
        },
        {
            id: 5,
            img: "/img/filipa2.webp",
            name: "Filipa",
            price: 5500,
            ing: ["Tirabuzon", "Tomate", "Chaucha", "Zanahoria", "Pollo al curry", "Queso tybo"],
            ingId: [
                { id: 6 },
                { id: 24 },
                { id: 12 },
                { id: 25 },
                { id: 27 },
                { id: 33 }
            ],
            carrito: false,
            cantidad: 1
        }
    ];

    const openModal = (product) => {
        setSelectedProduct(product);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const agregarAlCarrito = (producto) => {
        
        let bandera = true;

        const productosEnCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

        const existeEnCarrito = productosEnCarrito.find(item => item.name === producto.name);

        if (!existeEnCarrito) {
            const actualizado = { ...producto, carrito: true };
            const nuevosProductos = [...productosEnCarrito, actualizado];

            setCarritoProductos(nuevosProductos);
            localStorage.setItem("carrito", JSON.stringify(nuevosProductos));
            
        } else {
            // Si el producto ya existe, verificamos que la cantidad no supere 10
            const nuevosProductos = productosEnCarrito.map(item => {
                if (item.name === producto.name) {
                    // Si la cantidad es menor a 10, incrementamos
                    if (item.cantidad < 10) {

                        return { ...item, cantidad: item.cantidad + 1 }; 

                    } else {
                        bandera = false
                    }
                }
                return item; // Retornamos el producto sin cambios si no es el que buscamos
            });
    
            // Actualizamos el estado y el localStorage
            setCarritoProductos(nuevosProductos);
            localStorage.setItem("carrito", JSON.stringify(nuevosProductos));
        }

        // Emitimos el evento para actualizar el contador del carrito
        const event = new CustomEvent('updateCartCounter');
        window.dispatchEvent(event);
        return bandera
    };




    return (
        <div>
            <div className="flex justify-center mt-[100px]">
                <h2 className='font-julius text-6xl movil-s:text-4xl  movil-sm:text-3xl font-extrabold text-[#e0e0e0]'>
                    ENSALADAS DEL DIA
                </h2>
            </div>

            <div id='Menu' className=" movil-s:flex movil-sm:flex movil-s:justify-center movil-sm:justify-center">
                <div
                    id='Primera_fila'
                    className='gap-8 flex flex-wrap justify-center mr-[300px] ml-[300px] mt-[100px] movil-s:w-[200px] movil-sm:w-[100px]'
                >
                    {salads.map((salad, index) => (
                        <ProductCard
                            key={index}
                            product={salad}
                            agregarAlCarrito={agregarAlCarrito} // Pasamos la función
                            openModal={openModal}
                        />
                    ))}
                </div>

                <MenuInfo
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    producto={selectedProduct}
                />
            </div>

            <Footer></Footer>
        </div>
    );
}

export default Menu;