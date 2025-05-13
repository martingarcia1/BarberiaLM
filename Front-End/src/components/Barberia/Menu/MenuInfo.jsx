import React from 'react';
import Modal from 'react-modal';

const MenuInfo = ({ isOpen, onRequestClose, producto }) => {
    if (!producto) {
        return null;
    }

    return (
        <Modal
            className="w-full max-w-[600px] mx-auto outline-none"
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Detalles del producto"
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
                    maxHeight: '80vh', // Altura máxima relativa a la ventana
                    margin: '20px auto',
                    padding: '20px',
                    backgroundColor: "#1e5e39",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: 'none',
                    position: 'relative',
                    overflow: 'auto', // Habilita el scroll
                    inset: 'auto', // Elimina el posicionamiento absoluto predeterminado
                }
            }}
        >
            <button 
                className='text-opacity-70 absolute top-3 right-3 w-7 h-7 text-[13px] rounded-md shadow shadow-gray-900 hover:scale-105 flex justify-center items-center  cursor-pointer'
                onClick={onRequestClose}
            >
                ✕
            </button>
            
            <h2 className='font-julius text-2xl mb-5 text-center mt-2 text-[#e0e0e0]'>
                {producto.name}
            </h2>
            
            <div className='flex flex-col font-julius bg-white rounded-2xl w-[90%] p-4 mb-5 shadow-md'>
                <div className="text-[#72bf78] text-6xl text-center">OLYS</div>
                <div className="text-[#6fbb76] text-center">Oliva limon & sal</div>
            </div>

            <h3 className='font-julius text-xl mb-4 text-shadow text-[#e0e0e0] '>
                INGREDIENTES
            </h3>

            <ul className='font-julius list-disc w-full pl-24 pr-8 mb-4 text-[#e0e0e0]'>
                {producto.ing && producto.ing.map((ingrediente, index) => (
                    <li key={index} className="mb-2 text-base text-shadow">
                        {ingrediente}
                    </li>
                ))}
            </ul>
        </Modal>
    );
};

export default MenuInfo;