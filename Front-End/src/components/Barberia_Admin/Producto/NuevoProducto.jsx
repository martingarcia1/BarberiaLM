import axios from "axios";
import { useState,useEffect } from "react";
import url from "../../../utils/url"

const NuevoProducto = ({traerProducto}) => {
    const [nombre, setNombre] = useState("")
    const [tipoProducto, setTipoProducto] = useState("Base")
    const [calorias, setCalorias] = useState("")
    const token = localStorage.getItem("token")

    useEffect(() => {
        const notyf = new Notyf({
            duration: 3000,
            position: {
                x: 'center',
                y: 'top',
            },
            types: [
                {
                    type: 'success',
                    background: "#28b463     ",
                    className: "rounded-[10px] text-black text-[15px]"
                }
            ]

        });
        window.notyf = notyf;
    }, []);

    const handlerClickGuardar = () => {

        if (nombre == "" || isNaN(calorias) || tipoProducto == "" || calorias == "") {
            return null;
        }
        const respuesta = async () => {
            try {
                const guardar = await axios.post(
                    `${url.urlKey}/api/producto/save`,
                    {
                        nombre: nombre,
                        calorias: calorias,
                        tipoProducto: tipoProducto,
                        precio: 0,
                        cantidad: 1,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                if (guardar.status == 200) {
                    window.notyf.success(`Producto "${nombre}" guardado correctamente`);
                    traerProducto()
                    setCalorias("")
                    setNombre("")
                    setTipoProducto("")
                    
                }
            } catch (error) {
                window.notyf.error("Producto Existente");
            }
        };
        respuesta();
    }


    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 font-julius">Productos</h2>
            <div className=" flex justify-center items-center bg-gray-100 h-[550px] w-[700px] ml-[370px] rounded-[30px]">
                <div className="flex flex-col justify-center items-center">
                    <h3 className="font-julius text-[30px] ">Agregar Producto</h3>
                    <div className="mt-8">
                        <p className="font-julius">Nombre</p>
                        <input onChange={(e) => setNombre(e.target.value)} className="border rounded-md  h-10 w-[450px] p-2" type="text" required placeholder="Producto" value={nombre} />
                    </div>
                    <div className="mt-8">
                        <p className="font-julius">Calorias c / 100gr</p>
                        <input onChange={(e) => { setCalorias(e.target.value)}} className="border rounded-md  h-10 w-[450px] p-2" type="number" required placeholder="Calorias" value={calorias} />
                    </div>
                    <div className="my-8">
                        <p className="font-julius">Tipo de Producto</p>
                        <select  onChange={(e) => { setTipoProducto(e.target.value) }}
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
                            className="bg-[#1e5e39] font-julius font-bold text-white text-[18px] h-11 w-32 rounded hover:bg-[#347c52] transition-colors">
                            Guardar
                        </button>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default NuevoProducto;