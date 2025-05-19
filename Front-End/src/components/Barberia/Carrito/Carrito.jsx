import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from 'prop-types';
import url from "../../../utils/url.js"

const Carrito = ({ cartOpen, setCartOpen, setContadorProd }) => {
    const [productos, setProductos] = useState([]);
    const [currentStep, setCurrentStep] = useState(1); // 1: Productos, 2: Registro, 3: MercadoPago
    const [nombre, setNombre] = useState("")
    const [celular, setCelular] = useState("")
    const [metodoPago, setMetodoPago] = useState("efectivo"); // Nuevo estado para método de pago
    const [errorTel, setErrorTel] = useState(false)
    const [botonMercadoPago, setBotonMercadoPago] = useState("https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=")


    const manejarClick = () => {
        const eventoPersonalizado = new CustomEvent('cambiarEstado', {
            detail: { nuevoEstado: true },
        });
        window.dispatchEvent(eventoPersonalizado);
    };

    useEffect(() => {
        if (cartOpen) {
            const savedCart = localStorage.getItem("carrito");
            if (savedCart) {
                setProductos(JSON.parse(savedCart));
            }
        }
    }, [cartOpen]);

    const handleClickRestar = (producto) => {
        if (producto.cantidad > 1) {
            const ProductosActualizados = productos.map((prod) =>
                prod.name === producto.name ? { ...prod, cantidad: prod.cantidad - 1 } : prod
            );
            setProductos(ProductosActualizados);
            localStorage.setItem("carrito", JSON.stringify(ProductosActualizados));
            manejarClick();
        }
    };

    const handleClickSumar = (producto) => {
        if (producto.cantidad < 10) {
            const ProductosActualizados = productos.map((prod) =>
                prod.name === producto.name ? { ...prod, cantidad: prod.cantidad + 1 } : prod
            );
            setProductos(ProductosActualizados);
            localStorage.setItem("carrito", JSON.stringify(ProductosActualizados));
        }
    };

    const handlerClickDelete = (producto) => {
        let actualizarProductos = productos.filter(p => producto.id !== p.id); // Filtrar usando el ID único
        setProductos(actualizarProductos);
        localStorage.setItem("carrito", JSON.stringify(actualizarProductos));
        manejarClick();
    };

    const procesarPagoMercadoPago = async () => {
        try {
            const response = await axios.post(`${url.urlKey}/api/pagos/crear-pago`, {
                items: productos.map(prod => ({
                    id: prod.id,
                    name: prod.name,
                    descripcion: prod.descripcion,
                    img: prod.img,
                    price: prod.price,
                    cantidad: prod.cantidad,
                    tipo: prod.tipo || 'producto'
                })),
                cliente: {
                    nombre,
                    celular,
                    email: 'cliente@example.com' // Idealmente deberías pedir el email al cliente
                }
            });

            if (response.data.success) {
                // Limpiar carrito y actualizar estado
                localStorage.removeItem("carrito");
                setProductos([]);
                setContadorProd(0);
                setCurrentStep(1);
                setCartOpen(false);

                // Redirigir a Mercado Pago
                window.location.href = response.data.data.init_point;
            }
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            window.notyf.error('Error al procesar el pago. Por favor, intente nuevamente.');
        }
    };

    const guardarPedido = async () => {
        try {
            if (metodoPago === 'mercadopago') {
                await procesarPagoMercadoPago();
                return;
            }

            // Resto del código existente para otros métodos de pago
            const servicios = productos.filter(p => p.tipo === 'servicio');
            const productos_normales = productos.filter(p => p.tipo !== 'servicio');

            // Solo procesar pedido si hay productos normales
            if (productos_normales.length > 0) {
                try {
                    await axios.post(
                        `${url.urlKey}/api/pedido/save`,
                        {
                            nombreCliente: nombre,
                            celularCliente: celular,
                            metodoPago: metodoPago,
                            productosList: productos_normales.flatMap(prod => Array(prod.cantidad).fill(prod.ingId).flat()),
                            fecha: new Intl.DateTimeFormat('fr-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date()),
                            listaEnsaladas: productos_normales.map(prod => prod.name)
                        }
                    );
                    window.notyf.success('Pedido guardado correctamente');
                } catch (error) {
                    window.notyf.error('Error al guardar el pedido');
                    throw error;
                }
            }

            // Mantener solo servicios en el carrito
            const productosRestantes = servicios;
            localStorage.setItem("carrito", JSON.stringify(productosRestantes));
            
            // Limpiar formulario
            setNombre("");
            setCelular("");
            setMetodoPago("efectivo");
            
            // Redirigir a turnos si solo quedan servicios
            if (productos_normales.length === 0 && servicios.length > 0) {
                window.location.href = '/turnos';
            } else {
                setCurrentStep(1);
                setContadorProd(0);
                setCartOpen(false);
            }
        } catch (error) {
            console.error('Error al procesar el pedido:', error);
            window.notyf.error('Error al procesar el pedido. Por favor, intente nuevamente.');
        }
    }

    const handleNext = (tipoPaso) => {
        if (tipoPaso === "primer Siguiente") {
            setCurrentStep(currentStep + 1);
        } else if (tipoPaso === "Finalizar Pedido") {
            if (nombre !== "" && celular !== "") {
                if (!isNaN(celular)) {
                    setCurrentStep(currentStep + 1);
                    guardarPedido()
                }
            }
        }
    };


    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const validarCelular = (e) => {
        const valor = e.target.value;
        const soloDigitos = valor.replace(/\D/g, '');

        if (soloDigitos.length <= 10) {           
            setCelular(soloDigitos);
            setErrorTel(false)
        }

    };


    return (
        <div
            className={`fixed top-0 right-0 w-[450px] movil-smm:w-[350px] h-full bg-[#2b1c16] shadow-lg transform ${cartOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 ease-in-out z-20 bg-opacity-95`}
            style={{
                backgroundImage: `url('/img/background.jpeg')`,
                backgroundSize: '200px',
                backgroundRepeat: 'repeat',
                backdropFilter: 'blur(5px)'
            }}
        >
            <div className="p-4 font-julius">
                <button
                    className="text-[#f0d3a7] float-right w-7 h-7 text-[15px] font-bold rounded-md shadow-md bg-[#3c2920] hover:bg-[#4e352a] hover:scale-105 transition-all duration-300"
                    onClick={() => setCartOpen(false)}
                >
                    ✕
                </button>
                <h2 className="text-2xl font-julius mb-4 text-center text-[#f0d3a7]">
                    {currentStep === 1 ? "Carrito" : currentStep === 2 ? "Registro" : "Pago"}
                </h2>

                {/* Paso 1: Lista de Productos */}
                {currentStep === 1 && productos && productos.length > 0 ? (
                    <div>
                        {productos.map((producto, index) => (
                            <div id="Estructuracarta" key={index} className="flex -ml-[5px] mb-2 rounded-lg shadow justify-between items-center h-[120px] border border-[#0A4B2E] w-[430px] text-[#e0e0e0]">
                                <div className="ml-1">
                                    <img className="rounded-md " src={producto.img} alt="e" width="80px" />
                                </div>

                                <div id="PPPPP" className="">
                                    <div className="acomodadordecantidadtrashmasymenos flex-col mb-1">
                                        <h3 className="mb-2 text-center text-lg">Cantidad</h3>
                                        <div className="flex justify-center">
                                            <button onClick={() => handleClickRestar(producto)} className="text-[#e0e0e0] text-opacity-70 float-right w-7 rounded-md shadow mr-1">-</button>
                                            <p>{producto.cantidad}</p>
                                            <button onClick={() => handleClickSumar(producto)} className="text-[#e0e0e0] text-opacity-70 float-right w-7 text-center rounded-md shadow ml-1">+</button>
                                        </div>
                                        <div className="text-center mt-2">
                                            <button className=" shadow w-[60px] rounded-xl text-[12px] " onClick={() => handlerClickDelete(producto)}>Eliminar</button>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-base mb-2 w-[115px]">{producto.name}</p>

                                <div className="acomodadordeprecionombreprecio mr-3 mb-3">
                                    <h3 className="mb-1 text-center text-lg">Precio</h3>
                                    <p className="">${(parseFloat(producto.price) * parseFloat(producto.cantidad))}</p>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => handleNext("primer Siguiente")}
                                className=" relative w-56 h-12 border text-[#e0e0e0] border-[#e0e0e0] rounded-lg hover:scale-105 transition-transform duration-300 focus:outline-none"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                ) : currentStep === 1 ? (
                    <p className='font-julius text-[#f0d3a7] text-center text-lg'>No hay productos en el carrito.</p>
                ) : null}

                {/* Paso 2: Registro */}
                {currentStep === 2 && (
                    <div className="bg-[#2b1c16] rounded-lg p-6 shadow-lg">
                        <div id="Registro" className="inputs space-y-6 font-julius">
                            <h3 className="text-2xl text-[#f0d3a7] font-bold text-center mb-8">Datos del Cliente</h3>

                            <div className="relative">
                                <label className="text-lg text-[#f0d3a7] mb-2 block">Nombre</label>
                                <input 
                                    onChange={(e) => setNombre(e.target.value)} 
                                    className="w-full px-4 py-2 rounded-lg outline-none bg-[#3c2920] shadow-lg text-[#f0d3a7] border border-[#66463a] focus:border-[#8b5b4c] transition-colors duration-300" 
                                    type="text" 
                                    value={nombre}
                                    placeholder="Ingrese su nombre"
                                />
                            </div>

                            <div className="relative">
                                <label className="text-lg text-[#f0d3a7] mb-2 block">Número de celular</label>
                                <input 
                                    onChange={(e) => validarCelular(e)} 
                                    className={`w-full px-4 py-2 rounded-lg outline-none bg-[#3c2920] shadow-lg text-[#f0d3a7] border ${errorTel ? 'border-red-500' : 'border-[#66463a]'} focus:border-[#8b5b4c] transition-colors duration-300`}
                                    type="text" 
                                    value={celular}
                                    placeholder="Ingrese su número de celular" 
                                />
                                {errorTel && (
                                    <span className="text-red-400 text-sm mt-1 block">
                                        El número debe tener 10 dígitos
                                    </span>
                                )}
                            </div>

                            <div className="relative">
                                <label className="text-lg text-[#f0d3a7] mb-2 block">Método de pago</label>
                                <select
                                    value={metodoPago}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg outline-none bg-[#3c2920] shadow-lg text-[#f0d3a7] border border-[#66463a] focus:border-[#8b5b4c] transition-colors duration-300 appearance-none cursor-pointer"
                                >
                                    <option value="efectivo">Efectivo</option>
                                    <option value="mercadopago">MercadoPago</option>
                                    <option value="tarjeta">Tarjeta en local</option>
                                    <option value="puntos">Canjear con puntos</option>
                                </select>
                            </div>

                            <div className="flex justify-between mt-8 gap-4">
                                <button
                                    onClick={handleBack}
                                    className="flex-1 py-3 px-6 text-[#f0d3a7] border border-[#66463a] rounded-lg hover:bg-[#3c2920] transition-colors duration-300 focus:outline-none"
                                >
                                    Volver
                                </button>
                                <button
                                    onClick={() => {if(celular.length==10){handleNext("Finalizar Pedido")}else{setErrorTel(true)}}}
                                    className="flex-1 py-3 px-6 text-[#f0d3a7] bg-[#3c2920] border border-[#66463a] rounded-lg hover:bg-[#2b1c16] transition-colors duration-300 focus:outline-none"
                                >
                                    Finalizar Pedido
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Paso 3: MercadoPago */}
                {currentStep === 3 && (
                    <div>
                        <div id="MercadoPago" className="flex flex-col items-center mt-10">
                            <span className="text-[12px] mb-1 text-[#f0d3a7]">De click para ir a Mercado Pago</span>
                            {botonMercadoPago == "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=" ? <p className="font-bold text-[#f0d3a7]">Cargando...</p>
                                : <>
                                    <button
                                        onClick={() => {

                                            localStorage.removeItem("carrito");
                                            setProductos([]);
                                            setBotonMercadoPago("https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=");
                                            setCartOpen(false)
                                            window.open(botonMercadoPago, '_blank');
                                            setCurrentStep(1)
                                            setContadorProd(0)
                                        }}
                                        className="bg-[#009EE3] text-white font-bold  relative w-56 h-12 hover:bg-[#007bbd] rounded-lg transition-colors duration-300 focus:outline-none"
                                    >
                                        Mercado Pago
                                    </button>
                                </>
                            }


                        </div>

                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleBack}
                                className="text-[#e0e0e0] relative w-56 h-12 border border-[#e0e0e0] hover:scale-105  transition-transform   rounded-lg duration-300 focus:outline-none"
                            >
                                Volver
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

Carrito.propTypes = {
    cartOpen: PropTypes.bool.isRequired,
    setCartOpen: PropTypes.func.isRequired,
    setContadorProd: PropTypes.func.isRequired
};

export default Carrito;