import Modal from 'react-modal';
import "./GestionPedido.css"

const ProductModal = ({ products, onRequestClose, IsOpen }) => {
    if (!products) {
        return null
    }


    const contarIngredientes = (ingredientes) => {
        const contador = {};
        ingredientes.forEach((ing) => {
            contador[ing.nombre] = (contador[ing.nombre] || 0) + 1;
        });
        return contador;
    };

    const ingredientesUnicos = Array.isArray(products[1]) ? 
    Array.from(new Set(products[1].map(ing => ing.nombre))).map(nombre => ({
        nombre,
        cantidad: products[1].filter(ing => ing.nombre === nombre).length
    })) : [];


    return (
        <Modal 
            isOpen={IsOpen}
            onRequestClose={onRequestClose}
            style={{
                overlay: {
                    
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                },
                content: {
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '20px',
                    
                    width: '700px',
                    height: '760px',
                    margin: 'auto',
                    padding: '20px',
                    backgroundColor: "#72bf78",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: 'none',
                    position: 'relative',
                    top: "100px",
                    left: "-4px",
                    overflow: "auto"
                    
                },
            }}className="custom-modal-content focus:outline-none">
                
            
            <>
            <button 
                className="absolute top-4 right-4 text-opacity-70 w-7 h-7 text-[13px] rounded-md shadow flex justify-center items-center"
                onClick={onRequestClose}
            >
                ✕
            </button>

            <h2 className="font-julius text-3xl mb-3 text-center mt-2">
                Productos
            </h2>
            
            <div className='flex flex-col font-julius' style={{
                backgroundColor: '#ffffff ',
                borderRadius: '15px',
                width: '90%',
                height: '150px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
                <div style={{ color: '#72bf78', fontSize: '70px', fontFamily: "julios" }}>OLYS</div>
                <div className="text-[#6fbb76]">Oliva limon & sal</div>
            </div>

            <div className='flex gap-[100px] font-julius '>
                <div >
                    <p className='text-2xl mb-5 font-julius border-b-2 '> Ensaladas</p>
                    <ul>
                        {products && products[0].map((prod, index) =>
                            <li key={index}>
                                <p className='text-[18px]'>
                                    {prod}
                                </p>
                            </li>
                        )}
                    </ul>
                </div>
                <div className='font-julius'>
                    <p className='text-2xl mb-5 font-julius border-b-2 '>Ingredientes</p>
                    <ul>
                        {ingredientesUnicos.map((ing, index) => (
                            <li key={index}>
                                <p className='text-[18px]'>
                                    {ing.nombre} {ing.cantidad > 1 ? `x${ing.cantidad}` : ''}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            </>
        </Modal>
    );
};

export default ProductModal;