import { useNavigate } from 'react-router-dom';
import Footer from '../Home/Footer';
import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaClock, FaCalendarAlt, FaStar } from 'react-icons/fa';

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
                            <img className='w-full ' src="/img/barberia-reserva.jpg" alt="Barbería reserva"/>
                        </div>
                        <div className="p-6 space-y-4 movil-sm:space-y-4 font-julius text-[#0E3C09]">
                            <h2 className="text-2xl font-bold text-[#e0e0e0] hover:text-gray-600 transition-colors duration-300" tabIndex="0">
                                Reservá tu turno para tu servicio
                            </h2>
                            <div className="flex items-center space-x-1 text-yellow-500" aria-label="5 out of 5 stars rating">
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                            </div>
                            <div className="flex items-center space-x-2 text-[#e0e0e0]">
                                <FaMapMarkerAlt className="h-6 w-6" />
                                <p>Av. Roca 2398</p>
                            </div>
                            <div className="flex items-center space-x-2 text-[#e0e0e0]">
                                <FaClock className="h-5 w-5" />
                                <p>Lunes a Sábado</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mb-[50px]">
                <h2 className="font-julius text-[#e0e0e0] text-4xl font-extrabold border-b-2 border-b-[#AFB3B7]">
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
                                            className="mt-2 rounded-md text-[16px] p-2 font-julius border border-[#e0e0e0] hover:scale-105 transition-transform duration-300 mb-2 text-[#e0e0e0] bg-[#0E3C09] w-full flex items-center justify-center gap-2"
                                            onClick={() => handleTurnosClick(servicio, dia)}
                                        >
                                            <FaCalendarAlt />
                                            <span>Reservar Turno ({dia})</span>
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </>
    );
};

export default ReservasTurnos;