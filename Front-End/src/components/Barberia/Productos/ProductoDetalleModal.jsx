import Modal from 'react-modal';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const ProductoDetalleModal = ({ isOpen, onClose, producto }) => {
    if (!producto) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                },
                content: {
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '20px',
                    width: '80%',
                    maxWidth: '800px',
                    height: 'auto',
                    maxHeight: '90vh',
                    margin: 'auto',
                    padding: '20px',
                    backgroundColor: "#fff",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: 'none',
                    position: 'relative',
                    top: "50%",
                    transform: "translateY(-50%)"
                },
            }}
        >
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
            >
                ✕
            </button>

            <div className="w-full flex flex-col md:flex-row gap-8 p-4">
                <div className="w-full md:w-1/2">
                    {producto.imagen_url ? (
                        <img 
                            src={producto.imagen_url} 
                            alt={producto.nombre_producto}
                            className="w-full h-64 object-cover rounded-lg shadow-lg"
                        />
                    ) : (
                        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">Sin imagen</span>
                        </div>
                    )}
                </div>

                <div className="w-full md:w-1/2 flex flex-col gap-4">
                    <h2 className="text-3xl font-bold text-[#1e5e39]">{producto.nombre_producto}</h2>
                    <p className="text-2xl font-semibold text-[#1e5e39]">${producto.precio}</p>
                    <p className="text-gray-600">{producto.descripcion || 'Sin descripción disponible'}</p>
                    <div className="mt-4">
                        <p className="text-sm text-gray-500">
                            Stock disponible: {producto.stock} unidades
                        </p>
                    </div>
                    <button 
                        onClick={() => {
                            window.notyf.success(`Producto ${producto.nombre_producto} agregado al carrito`);
                            onClose();
                        }}
                        className="mt-4 bg-[#1e5e39] text-white px-6 py-3 rounded-lg hover:bg-[#347c52] transition-colors"
                    >
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ProductoDetalleModal; 