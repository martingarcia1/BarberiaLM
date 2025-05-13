import { useNavigate } from 'react-router-dom';
import Footer from '../Home/Footer';
import { useState, useEffect } from 'react';

const ReservasTurnos = () => {
    const navigate = useNavigate();
    const [serviciosComprados, setServiciosComprados] = useState([]);

    useEffect(() => {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        setServiciosComprados(carrito);
    }, []);

    const dias = [
        'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ];

    const handleTurnosClick = (servicio, dia) => {
        navigate(`/turnos/${dia.toLowerCase()}?servicio=${encodeURIComponent(servicio.name)}`);
    };

    return (
        <>
            <div className="flex justify-center mt-[100px]">
                <h2 className='font-julius text-[#e0e0e0] text-6xl movil-sm:text-5xl movil-s:text-5xl movil-m:text-6xl  font-extrabold'>
                    Reservas de Turnos
                </h2>
            </div>
            <div className="flex justify-center mt-[100px] mb-20">
                <div className="flex items-center w-[600px] movil-sm:w-[400px] movil-s:w-[400px] movil-m:w-[500px] justify-center p-4">
                    <div className="bg-[#AFB3B7] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                        <div className="flex justify-center">
                            <img className='w-full ' src="/img/barberia-reserva.jpg"/>
                        </div>
                        <div className="p-6 space-y-4 movil-sm:space-y-4 font-julius text-[#0E3C09]">
                            <h2 className="text-2xl font-bold text-[#e0e0e0] hover:text-gray-600 transition-colors duration-300" tabIndex="0">Reservá tu turno para tu servicio</h2>
                            <div className="flex items-center space-x-1" aria-label="5 out of 5 stars rating">
                                {/* Aquí podrías poner estrellas o info de la barbería */}
                            </div>
                            <div className="flex items-start space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-[#e0e0e0]">Av. Roca 2398</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mb-[50px] ">
                <h2 className="font-julius text-[#e0e0e0] text-4xl font-extrabold border-b-2 border-b-[#AFB3B7]" >
                    Reservar Turno
                </h2>
            </div>

            <div className="flex flex-col items-center gap-8 mb-10">
                {serviciosComprados.length === 0 ? (
                    <div className="text-[#e0e0e0] font-julius text-xl">No has comprado ningún servicio aún. Compra un servicio para poder reservar un turno.</div>
                ) : (
                    <>
                        <div className="text-[#e0e0e0] font-julius text-lg mb-4">Selecciona el servicio para el que deseas reservar turno:</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {serviciosComprados.map(servicio => (
                                <div key={servicio.id} className="bg-[#AFB3B7] rounded-lg shadow-lg p-6 flex flex-col items-center">
                                    <img src={servicio.img} alt={servicio.name} className="w-32 h-32 object-cover rounded-full mb-4" />
                                    <h3 className="font-julius text-2xl text-[#0E3C09] mb-2">{servicio.name}</h3>
                                    <p className="text-[#0E3C09] mb-2">${servicio.price}</p>
                                    {dias.map(dia => (
                                        <button
                                            key={dia}
                                            className="mt-2 rounded-md text-[16px] p-2 font-julius border border-[#e0e0e0] hover:scale-105 transition-transform duration-300 mb-2 text-[#e0e0e0] bg-[#0E3C09] w-full"
                                            onClick={() => handleTurnosClick(servicio, dia)}
                                        >
                                            Reservar Turno ({dia})
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <Footer></Footer>
        </>
    );
};

export default ReservasTurnos;