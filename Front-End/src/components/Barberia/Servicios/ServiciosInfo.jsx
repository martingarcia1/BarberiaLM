import React from 'react';
import Modal from 'react-modal';

const ServiciosInfo = ({ isOpen, onRequestClose, producto, agregarAlCarrito }) => {
    if (!producto) {
        return null;
    }

    return (
        <Modal
            className="w-full max-w-[600px] mx-auto outline-none"
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Detalles del servicio"
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
            <button 
                className='text-opacity-70 absolute top-3 right-3 w-7 h-7 text-[13px] rounded-md shadow shadow-gray-900 hover:scale-105 flex justify-center items-center cursor-pointer'
                onClick={onRequestClose}
            >
                ✕
            </button>
            
            <h2 className='font-julius text-2xl mb-5 text-center mt-2 text-[#e0e0e0]'>
                {producto.nombre_servicio}
            </h2>
            
            <div className='flex flex-col font-julius bg-white rounded-2xl w-[90%] p-4 mb-5 shadow-md'>
                <div className="text-[#72bf78] text-6xl text-center">LA BARBERÍA LM</div>
                <div className="text-[#6fbb76] text-center">Estilo y Tradición</div>
            </div>

            <div className='w-full px-4 mb-4 text-[#e0e0e0]'>
                <div className='flex flex-col gap-4 font-julius'>
                    <div className='flex flex-col'>
                        <p className='text-lg mb-2'><span className='font-bold'>Descripción:</span> {producto.descripcion}</p>
                        <p className='text-lg mb-2'><span className='font-bold'>Duración:</span> {producto.duracion} minutos</p>
                        <p className='text-lg mb-2'><span className='font-bold'>Precio:</span> ${producto.precio}</p>
                        {producto.puntos_requeridos > 0 && (
                            <p className='text-lg mb-2'><span className='font-bold'>Puntos necesarios:</span> {producto.puntos_requeridos}</p>
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={() => agregarAlCarrito(producto)}
                className='rounded-md text-[16px] p-2 font-julius border border-[#e0e0e0] hover:scale-105 transition-transform duration-300 mb-2 text-[#e0e0e0]'
            >
                Comprar y Reservar Turno
            </button>
        </Modal>
    );
};

export default ServiciosInfo;