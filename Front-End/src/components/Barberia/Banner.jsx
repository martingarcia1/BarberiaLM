import React from 'react';

const Banner = () => (
  <div className="w-full flex justify-center mt-[100px] relative">
    <div className="relative w-full max-w-5xl">
      <img
        src="/img/banner1.jpeg"
        alt="Banner La Barbería"
        className="w-full rounded-xl shadow-lg object-cover"
        style={{ maxHeight: '400px', objectFit: 'cover' }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-center justify-center">
        <div className="text-center text-white">
          {/* <h1 className="text-4xl md:text-5xl font-julius mb-4">La Barbería LM</h1> */}
          {/* <p className="text-xl md:text-2xl">Estilo y Tradición en cada corte</p> */}
        </div>
      </div>
    </div>
  </div>
);

export default Banner; 