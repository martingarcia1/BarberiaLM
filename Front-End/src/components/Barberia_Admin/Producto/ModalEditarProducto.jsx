import Modal from 'react-modal';
import { useState} from 'react';
import axios from 'axios';
import url from "../../../utils/url"

const ModalEditarProd = ({ IsOpen, onRequestClose, prod,traerProducto }) => {


    const [nombre, setNombre] = useState("")
    const [tipoProducto, setTipoProducto] = useState(prod.tipoProducto)
    const [calorias, setCalorias] = useState("")
    const token = localStorage.getItem("token")
    const placeholderCal = prod.calorias
    const placeholderNom = prod.nombre


    const handlerClickGuardar = () => {

        const respuesta = async () => {
            try {
                const guardar = await axios.put(
                    `${url.urlKey}/api/producto/update/${prod.id}`,
                    {
                        nombre: nombre?nombre:prod.nombre,
                        calorias: calorias?calorias:prod.calorias,
                        tipoProducto: tipoProducto?tipoProducto:prod.tipoProducto,
                        precio: prod.precio,
                        cantidad: prod.cantidad,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                if (guardar.status == 200) {
                    window.notyf.success(`Producto "${nombre}" Editado correctamente`);
                    traerProducto()
                    onRequestClose()
                    setCalorias("")
                    setNombre("")
                    setTipoProducto("")

                }
            } catch (error) {
                window.notyf.error("Error al editar Producto");
            }
        }
        respuesta();
    }
    return (
        <Modal
            isOpen={IsOpen}
            onRequestClose={onRequestClose}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                content: {
                    background: "#f3f4f6",
                    borderRadius: '20px',
                    width: '540px',
                    height: '540px',
                    margin: 'auto',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: 'none',
                    position: 'relative',
                    top: "150px",
                    left: "-4px"
                },
            }}>

            <div className=" flex justify-center items-center bg-gray-100 h-[500px] w-[500px]  rounded-[30px]">
                <div className="flex flex-col justify-center items-center">
                    <h3 className="font-julius text-[30px] ">Editar Producto</h3>
                    <div className="mt-8">
                        <p className="font-julius">Nombre</p>
                        <input onChange={(e) => setNombre(e.target.value)} className="border rounded-md  h-10 w-[450px] p-2" type="text" required placeholder={placeholderNom} value={nombre} />
                    </div>
                    <div className="mt-8">
                        <p className="font-julius">Calorias c / 100gr</p>
                        <input onChange={(e) => { setCalorias(e.target.value) }} className="border rounded-md  h-10 w-[450px] p-2" type="number" required placeholder={placeholderCal} value={calorias} />
                    </div>
                    <div className="my-8">
                        <p className="font-julius">Tipo de Producto</p>
                        <select value={tipoProducto} onChange={(e) => { setTipoProducto(e.target.value) }}
                            className="border font-julius rounded-md  h-10 w-[450px] p-2" name="" id="">
                            <option value="Base">Base</option>
                            <option value="Ingrediente">Ingrediente</option>
                            <option value="Proteina">Proteina</option>
                            <option value="Aderezo">Aderezo</option>
                            <option value="Premium">Premium</option>
                            <option value="Queso">Queso</option>
                        </select>
                    </div>
                    <div>
                        <button
                            onClick={handlerClickGuardar}
                            className="bg-[#9BC885] font-julius font-bold text-white text-[18px] h-11 w-32 rounded hover:bg-[#8AB775] transition-colors">
                            Guardar
                        </button>
                    </div>


                </div>
            </div>

        </Modal>
    )
}

export default ModalEditarProd;