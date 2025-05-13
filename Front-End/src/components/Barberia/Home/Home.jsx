import React from "react";
import Footer from "./Footer";
import Map from './Map';
import { Link } from 'react-router-dom';
import { FaScissors, FaUserTie, FaCalendarCheck } from 'react-icons/fa6';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import Fotocarrusel from "./Fotocarrusel";
import Barberos from "./Barberos";

const Home = () => {
  return (
    <div className="bg-[#181818] min-h-screen w-full">
      {/* Sección de barberos */}
      <Barberos />
      {/* Franja animada con íconos y botón */}
      <div className="w-full flex flex-col items-center py-8 bg-gradient-to-r from-[#232323] via-[#AFB3B7] to-[#232323] animate-gradient-x">
        <div className="flex items-center gap-8 mb-4">
          <FaScissors className="text-4xl text-[#181818] animate-bounce" />
          <FaUserTie className="text-4xl text-[#181818] animate-bounce delay-200" />
          <FaCalendarCheck className="text-4xl text-[#181818] animate-bounce delay-400" />
        </div>
        <Link to="/turnos">
          <button className="bg-[#181818] text-[#AFB3B7] px-8 py-3 rounded-full font-bold text-xl shadow-lg hover:bg-[#AFB3B7] hover:text-[#181818] transition-all duration-300 border-2 border-[#AFB3B7] animate-pulse">
            Reservar Turno
          </button>
        </Link>
      </div>

      {/* Servicios destacados */}
      <div className="bg-[#232323] py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          <div className="flex flex-col items-center">
            <img src="/img/servicio-barba.jpg" alt="Barba" className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-[#AFB3B7]" />
            <h3 className="text-xl text-white font-bold mb-2">Afeitado de Barba</h3>
            <p className="text-[#bdbdbd] text-center">Disfruta de un afeitado clásico y relajante con toalla caliente y productos premium.</p>
          </div>
          <div className="flex flex-col items-center">
            <img src="/img/servicio-corte.jpg" alt="Corte" className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-[#AFB3B7]" />
            <h3 className="text-xl text-white font-bold mb-2">Corte de Cabello</h3>
            <p className="text-[#bdbdbd] text-center">Cortes modernos y tradicionales, personalizados para cada cliente por barberos expertos.</p>
          </div>
          <div className="flex flex-col items-center">
            <img src="/img/servicio-online.jpg" alt="Reserva Online" className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-[#AFB3B7]" />
            <h3 className="text-xl text-white font-bold mb-2">Reserva Online</h3>
            <p className="text-[#bdbdbd] text-center">Agenda tu turno fácilmente desde nuestra web y elige el horario que más te convenga.</p>
          </div>
        </div>
      </div>

      {/* Videos */}
      <div className="bg-[#232323] py-4">
        <div className="max-w-5xl mx-auto px-2">
          <h2 className="text-3xl text-white font-bold mb-2 text-center font-julius">Nuestros Trabajos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <video 
                className="w-full rounded-lg shadow-lg"
                controls
                poster="/img/video-thumbnail1.jpg"
                style={{ maxHeight: '350px', objectFit: 'cover' }}
              >
                <source src="/img/video2.mp4" type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-lg">
                {/* <h3 className="text-white font-bold">Corte Clásico</h3> */}
              </div>
            </div>
            <div className="relative">
              <video 
                className="w-full rounded-lg shadow-lg"
                controls
                poster="/img/video-thumbnail2.jpg"
                style={{ maxHeight: '350px', objectFit: 'cover' }}
              >
                <source src="/img/video3.mp4" type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-lg">
                {/* <h3 className="text-white font-bold">Afeitado Tradicional</h3> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="bg-[#181818] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl text-white font-bold mb-8 text-center font-julius">Síguenos en Redes Sociales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#232323] p-6 rounded-lg shadow-lg hover:transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center mb-4">
                <FaInstagram className="text-4xl text-[#E1306C] mr-4" />
                <h3 className="text-2xl text-white font-bold">Instagram</h3>
              </div>
              <p className="text-[#bdbdbd] mb-4">Sigue nuestro día a día y descubre los mejores looks y tendencias en barbería.</p>
              <a 
                href="https://www.instagram.com/labarberialm/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-[#E1306C] text-white px-6 py-2 rounded-full hover:bg-[#C13584] transition"
              >
                @LaBarberiaLM
              </a>
            </div>
            <div className="bg-[#232323] p-6 rounded-lg shadow-lg hover:transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center mb-4">
                <FaTiktok className="text-4xl text-[#69C9D0] mr-4" />
                <h3 className="text-2xl text-white font-bold">TikTok</h3>
              </div>
              <p className="text-[#bdbdbd] mb-4">Mira nuestros videos de transformaciones y consejos de estilo.</p>
              <a 
                href="https://www.tiktok.com/@la.barberia.lm5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-[#69C9D0] text-white px-6 py-2 rounded-full hover:bg-[#4F9EA5] transition"
              >
                @LaBarberiaLM
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ¿Qué nos destaca? */}
      <div className="bg-[#181818] py-16">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 px-6">
          <img src="/img/barberia-interior.jpg" alt="Interior Barbería" className="w-full md:w-1/2 rounded-lg shadow-lg mb-6 md:mb-0" />
          <div className="flex-1">
            <h2 className="text-3xl text-white font-bold mb-4 font-julius">¿Qué nos destaca?</h2>
            <p className="text-[#bdbdbd] mb-6">En La Barberia LM combinamos tradición y modernidad, ofreciendo un ambiente acogedor, atención personalizada y los mejores productos del mercado. Nuestro compromiso es que cada cliente viva una experiencia única y salga renovado.</p>
            <button className="bg-[#AFB3B7] text-[#181818] px-6 py-2 rounded font-bold hover:bg-[#e0e0e0] transition">Leer más</button>
          </div>
        </div>
      </div>

      {/* Mapa y contacto */}
      <div className="bg-[#232323] py-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 px-6">
          <div className="w-full md:w-1/2 h-[300px] rounded-lg overflow-hidden mb-6 md:mb-0">
            <Map />
          </div>
          <div className="flex-1 text-white">
            <h3 className="text-2xl font-bold mb-4 font-julius">Contacto</h3>
            <p className="mb-2">Teléfono: <span className="text-[#AFB3B7]">381 602-4467</span></p>
            <p className="mb-2">Email: <span className="text-[#AFB3B7]">Lmlabarberia@gmail.com</span></p>
            <p className="mb-2">Dirección: <span className="text-[#AFB3B7]">Av. Roca 2398, San Miguel de Tucumán</span></p>
            <p className="text-[#bdbdbd] mt-4">¡Te esperamos para que vivas la mejor experiencia en barbería!</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;