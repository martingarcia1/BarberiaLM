import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Footer from '../Home/Footer';
import ReservaTurnoModal from './ReservaTurnoModal';

const TurnosPage = () => {
  const { dia } = useParams();
  const location = useLocation();
  const [servicio, setServicio] = useState("");
  const [diaFormateado, setDiaFormateado] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [horariosModal, setHorariosModal] = useState(false);
  const [horariosDisponibles, setHorariosDisponibles] = useState({});
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [reservaModalOpen, setReservaModalOpen] = useState(false);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('');
  const [diaSeleccionado, setDiaSeleccionado] = useState('');

  // Días de atención: lunes a sábado
  const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  useEffect(() => {
    // Leer el nombre del servicio del query string
    const params = new URLSearchParams(location.search);
    const servicioParam = params.get('servicio');
    setServicio(servicioParam);
  }, [location.search]);

  const formatearFecha = (fecha) => {
    const opciones = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  // Horarios de 10:00 a 22:00
  const generarHorarios = () => {
    const horarios = {};
    let hora = 10;
    let minutos = 0;
    while (hora < 22 || (hora === 22 && minutos === 0)) {
      const horaStr = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
      horarios[horaStr] = true;
      minutos += 30;
      if (minutos >= 60) {
        minutos = 0;
        hora += 1;
      }
    }
    return horarios;
  };

  // Mapear nombre de día a número (lunes=1, ..., sábado=6)
  const obtenerNumeroDia = (nombreDia) => {
    const dias = {
      'lunes': 1,
      'martes': 2,
      'miércoles': 3,
      'jueves': 4,
      'viernes': 5,
      'sábado': 6
    };
    return dias[nombreDia.toLowerCase()];
  };

  useEffect(() => {
    const inicializarTurnos = () => {
      const fechaInicial = new Date();
      const turnos = [];
      let fechaActual = new Date(fechaInicial);
      // Buscar el próximo día de la semana correspondiente (lunes a sábado)
      while (fechaActual.getDay() !== obtenerNumeroDia(dia)) {
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
      for (let i = 0; i < 5; i++) {
        turnos.push({
          fecha: new Date(fechaActual),
          disponible: true,
          id: `turno-${fechaActual.getTime()}`,
          horarios: generarHorarios()
        });
        fechaActual.setDate(fechaActual.getDate() + 7);
      }
    };
    if (dia && diasSemana.includes(dia.toLowerCase())) {
      inicializarTurnos();
    }
  }, [dia]);

  useEffect(() => {
    if (dia) {
      const formateado = dia.charAt(0).toUpperCase() + dia.slice(1).toLowerCase();
      setDiaFormateado(formateado);
    }
  }, [dia]);

  // NUEVO: Generar los próximos 5 días correctos del día seleccionado
  const generarProximosDias = () => {
    const dias = [];
    const hoy = new Date();
    let fecha = new Date(hoy);
    // Buscar el próximo día de la semana correspondiente
    const diaSemanaSeleccionado = obtenerNumeroDia(dia); // 1=lunes, ..., 6=sábado
    while (fecha.getDay() !== diaSemanaSeleccionado) {
      fecha.setDate(fecha.getDate() + 1);
    }
    for (let i = 0; i < 5; i++) {
      dias.push(new Date(fecha));
      fecha = new Date(fecha);
      fecha.setDate(fecha.getDate() + 7);
    }
    return dias;
  };

  // NUEVO: Renderizar las tarjetas de fechas
  const renderFechasDisponibles = () => {
    return generarProximosDias().map((fecha, idx) => {
      const nombreDia = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
      const fechaCompleta = fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
      return (
        <button
          key={idx}
          className="flex flex-col justify-center items-center h-[170px] w-[350px] movil-sm:w-[90vw] mt-8 bg-gradient-to-br from-[#AFB3B7] to-[#e0e0e0] hover:scale-105 transition-transform duration-300 rounded-2xl shadow-2xl border-4 border-[#246b42] hover:border-[#1e5e39]"
          onClick={() => handleDateClick({ fecha })}
        >
          <span className="font-julius text-[#246b42] text-2xl font-bold capitalize">{nombreDia}</span>
          <span className="font-julius text-[#0E3C09] text-xl mt-2">{fechaCompleta}</span>
        </button>
      );
    });
  };

  // MODIFICAR: handleDateClick para generar horarios para la fecha seleccionada
  const handleDateClick = ({ fecha }) => {
    setSelectedDate(formatearFecha(fecha));
    setSelectedTurno({ fecha });
    // Generar horarios para ese día
    setHorariosDisponibles(generarHorarios());
    setHorariosModal(true);
  };

  const handleTimeSelect = (hora) => {
    // Al seleccionar un horario, abrir el modal de reserva directamente
    setHorarioSeleccionado(hora);
    setDiaSeleccionado(selectedTurno.fecha.toISOString().split('T')[0]);
    setHorariosModal(false);
    setReservaModalOpen(true);
  };

  const closeHorariosModal = () => {
    setHorariosModal(false);
  };

  if (!servicio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="font-julius text-2xl text-red-500 mt-20">No se ha seleccionado ningún servicio para reservar.</h2>
        <p className="text-[#e0e0e0] mt-4">Por favor, vuelve a la página de reservas y selecciona un servicio.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center mt-[100px] ">
        <div className="text-center">
          <h1 className="font-julius text-[#e0e0e0]  text-4xl movil-sm:text-[25px] movil-smm:text-[18px] font-extrabold mb-2">
            Turnos Disponibles - {diaFormateado}
          </h1>
          <h2 className="font-julius text-[#AFB3B7] text-2xl font-bold mb-4">Servicio: {servicio}</h2>
        </div>
      </div>

      {/* NUEVO: Fechas disponibles como tarjetas visuales */}
      <div className="flex flex-wrap justify-center gap-8 mt-10 mb-10">
        {renderFechasDisponibles()}
      </div>

      {/* Horarios y resto del flujo igual */}
      <Modal
         className={`w-full ${window.innerWidth <= 561 ? 'max-w-[90%]' : 'max-w-[600px]'}`} 
        isOpen={horariosModal}
        onRequestClose={closeHorariosModal}
        contentLabel="Selección de Horario"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            top: "200px",
            borderRadius: '20px',
            width: '600px',
            height: "500px",
            margin: 'auto',
            padding: '20px',
            backgroundColor: "#1e5e39",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: 'none',
            position: 'relative',
          },
        }}
      >
        <button 
          className="absolute top-4 right-4 text-opacity-70 w-7 h-7 text-[13px] rounded-md shadow flex justify-center items-center"
          onClick={closeHorariosModal}
        >
          ✕
        </button>

        <h2 className="font-julius text-2xl mb-4 text-[#e0e0e0]">Seleccione un horario</h2>
        <p className="font-julius mb-2 text-[#e0e0e0]">{selectedDate}</p>
        <p className="font-julius mb-4 text-[#AFB3B7]">Servicio: {servicio}</p>
        {Object.keys(horariosDisponibles).length === 0 ? (
          <div className="text-[#e0e0e0] font-julius text-lg">No hay horarios disponibles para este día.</div>
        ) : (
          <div className="grid grid-cols-3 gap-4 w-full max-h-[300px] overflow-y-auto p-4 text-[#e0e0e0]">
            {Object.entries(horariosDisponibles).map(([hora, disponible]) => (
              <button
                key={hora}
                onClick={() => disponible && handleTimeSelect(hora)}
                disabled={!disponible}
                className={`
                  p-3 rounded-lg font-julius text-lg
                  border-2 border-[#AFB3B7]
                  ${disponible 
                    ? 'bg-[#508d55] hover:bg-[#386b3c]' 
                    : 'bg-[#2d4d30] cursor-not-allowed opacity-50'
                  }
                `}
              >
                {hora}
              </button>
            ))}
          </div>
        )}
      </Modal>

      {/* Modal de reserva de turno */}
      <ReservaTurnoModal
        isOpen={reservaModalOpen}
        onRequestClose={() => setReservaModalOpen(false)}
        servicio={servicio}
        horario={horarioSeleccionado}
        dia={diaSeleccionado}
        onReservaExitosa={() => {
          setReservaModalOpen(false);
          // Aquí podrías refrescar turnos o mostrar mensaje
        }}
      />

      <Footer />
    </>
  );
};

export default TurnosPage;
