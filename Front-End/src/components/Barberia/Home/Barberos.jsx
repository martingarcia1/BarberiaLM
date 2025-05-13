import React from "react";

const Barberos = () => {
  const barberos = [
    {
      nombre: "Lucas Godoy",
      descripcion: "Especialista en cortes modernos y clásicos. Más de 5 años de experiencia.",
      imagen: "/img/Lucas3.jpeg",
    },
    {
      nombre: "Daniel Reinoso",
      descripcion: "Experto en barbería tradicional y cuidado de la barba. Pasión por los detalles.",
      imagen: "/img/Daniel5.jpeg",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-[#1a1a1a] to-[#232323] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-white font-bold mb-4 font-julius">
            Expertos en Barbería
          </h2>
          <div className="w-24 h-1 bg-[#AFB3B7] mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {barberos.map((barbero, index) => (
            <div 
              key={index} 
              className="group relative bg-[#181818] rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="p-8 flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-48 h-48 rounded-full border-4 border-[#AFB3B7] overflow-hidden transform transition-all duration-300 group-hover:border-[#e0e0e0]">
                    <img
                      src={barbero.imagen}
                      alt={barbero.nombre}
                      className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-[#AFB3B7] group-hover:bg-[#e0e0e0] transition-all duration-300"></div>
                </div>
                
                <h3 className="text-2xl text-white font-bold mb-3 tracking-wide">{barbero.nombre}</h3>
                <p className="text-[#bdbdbd] text-center mb-6 leading-relaxed max-w-sm">{barbero.descripcion}</p>
                
                <button className="relative overflow-hidden bg-transparent border-2 border-[#AFB3B7] text-[#AFB3B7] px-8 py-3 rounded-lg font-bold transition-all duration-300 hover:text-[#181818] hover:border-[#e0e0e0] group">
                  <span className="relative z-10">Ver Perfil</span>
                  <div className="absolute inset-0 bg-[#AFB3B7] transform -translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Barberos;