import React, { useState } from 'react';
import Modal from 'react-modal';
import ProductCard from '../Productos/ProductCard';
import Footer from '../Home/Footer';

Modal.setAppElement('#root');

const CanjearPuntos = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [puntosUsuario, setPuntosUsuario] = useState(100); // Ejemplo de puntos iniciales

    const recompensas = [
        {
            id: 1,
            img: "/img/corte-gratis.jpg",
            name: "Corte Gratis",
            puntos: 50,
            descripcion: "Corte de cabello básico gratis",
            duracion: "30 min",
            cantidad: 1
        },
        {
            id: 2,
            img: "/img/tratamiento-gratis.jpg",
            name: "Tratamiento Gratis",
            puntos: 75,
            descripcion: "Tratamiento capilar premium gratis",
            duracion: "45 min",
            cantidad: 1
        },
        {
            id: 3,
            img: "/img/combo-gratis.jpg",
            name: "Combo Gratis",
            puntos: 100,
            descripcion: "Corte + afeitado + tratamiento gratis",
            duracion: "60 min",
            cantidad: 1
        },
        {
            id: 4,
            img: "/img/producto-gratis.jpg",
            name: "Producto Gratis",
            puntos: 30,
            descripcion: "Producto de cuidado capilar gratis",
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

    const canjearPuntos = (producto) => {
        if (puntosUsuario >= producto.puntos) {
            setPuntosUsuario(puntosUsuario - producto.puntos);
            window.notyf.success("¡Puntos canjeados exitosamente!");
        } else {
            window.notyf.error("No tienes suficientes puntos para canjear esta recompensa");
        }
    };

    return (
        <div>
            <div className="flex justify-center mt-[100px]">
                <h2 className='font-julius text-6xl movil-s:text-4xl  movil-sm:text-3xl font-extrabold text-[#e0e0e0]'>
                    CANJEA TUS PUNTOS
                </h2>
            </div>

            <div className="flex justify-center mt-4">
                <div className='font-julius text-2xl text-[#e0e0e0]'>
                    Puntos disponibles: {puntosUsuario}
                </div>
            </div>

            <div id='Recompensas' className="movil-s:flex movil-sm:flex movil-s:justify-center movil-sm:justify-center">
                <div
                    id='Primera_fila'
                    className='gap-8 flex flex-wrap justify-center mr-[300px] ml-[300px] mt-[50px] movil-s:w-[200px] movil-sm:w-[100px]'
                >
                    {recompensas.map((recompensa, index) => (
                        <ProductCard
                            key={index}
                            product={recompensa}
                            agregarAlCarrito={canjearPuntos}
                            openModal={openModal}
                        />
                    ))}
                </div>

                <Modal
                    className="w-full max-w-[600px] mx-auto outline-none"
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Detalles de la recompensa"
                    style={{
                        overlay: {
                            zIndex: "11",
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        content: {
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            borderRadius: '20px',
                            width: '90%',
                            maxWidth: '500px',
                            maxHeight: '80vh',
                            margin: '20px auto',
                            padding: '20px',
                            backgroundColor: "#AFB3B7",
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            border: 'none',
                            position: 'relative',
                            overflow: 'auto',
                            inset: 'auto',
                        }
                    }}
                >
                    {selectedProduct && (
                        <>
                            <button 
                                className='text-opacity-70 absolute top-3 right-3 w-7 h-7 text-[13px] rounded-md shadow shadow-gray-900 hover:scale-105 flex justify-center items-center cursor-pointer'
                                onClick={closeModal}
                            >
                                ✕
                            </button>
                            
                            <h2 className='font-julius text-2xl mb-5 text-center mt-2 text-[#e0e0e0]'>
                                {selectedProduct.name}
                            </h2>
                            
                            <div className='flex flex-col font-julius bg-white rounded-2xl w-[90%] p-4 mb-5 shadow-md'>
                                <div className="text-[#72bf78] text-6xl text-center">LA BARBERÍA LM</div>
                                <div className="text-[#6fbb76] text-center">Estilo y Tradición</div>
                            </div>

                            <div className='w-full px-4 mb-4 text-[#e0e0e0]'>
                                <div className='flex flex-col gap-4 font-julius'>
                                    <div className='flex flex-col'>
                                        <p className='text-lg mb-2'><span className='font-bold'>Descripción:</span> {selectedProduct.descripcion}</p>
                                        {selectedProduct.duracion && (
                                            <p className='text-lg mb-2'><span className='font-bold'>Duración:</span> {selectedProduct.duracion}</p>
                                        )}
                                        <p className='text-lg mb-2'><span className='font-bold'>Puntos necesarios:</span> {selectedProduct.puntos}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => canjearPuntos(selectedProduct)}
                                className='rounded-md text-[16px] p-2 font-julius border border-[#e0e0e0] hover:scale-105 transition-transform duration-300 mb-2 text-[#e0e0e0]'
                            >
                                Canjear Puntos
                            </button>
                        </>
                    )}
                </Modal>
            </div>

            <Footer></Footer>
        </div>
    );
}

export default CanjearPuntos; 