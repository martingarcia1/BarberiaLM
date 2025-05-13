import Modal from 'react-modal';
import { PiWarningBold } from "react-icons/pi";

const ModalProducto = ({ IsOpen, onRequestClose,IsStock ,prod}) => {

    const handlerClick=()=>{
        IsStock(prod)
    }
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
                    width: '350px',
                    height: '200px',
                    margin: 'auto',
                    padding: '20px',
                    backgroundColor: "#fff",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: 'none',
                    position: 'relative',
                    top: "350px",
                    left: "-4px"
                },
            }}>
            <div className='text-center'>
                <div className='mb-5 font-julius'>
                    <div className="flex justify-center mb-4">
                        <PiWarningBold className='text-2xl mt-1 mr-1 text-yellow-400' />
                        <p className='text-2xl'>¡Advertencia!</p> <br />
                        <PiWarningBold className='text-2xl  mt-1 ml-1 text-yellow-400' />

                    </div>
                    <p>¿Esta seguro que desea desactivar este producto de stock?</p>
                </div>
                <div className="flex mt-2 ml-20 ">
                    <button onClick={handlerClick} className='bg-[#9BC885] text-white px-6 py-2 mr-4 rounded hover:bg-[#8AB775] transition-colors'>SI</button>
                    <button onClick={onRequestClose} className='bg-[#9BC885] text-white px-5 py-2 rounded hover:bg-[#8AB775] transition-colors'>NO</button>
                </div>
            </div>
        </Modal>
    )
}

export default ModalProducto;