import React, { useState, useMemo } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import credenciales from '../../../utils/credenciales';

const libraries = ["places"];

const MapContainer = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: credenciales.mapKey,
    libraries: libraries,
  });

  const [mapCenter, setMapCenter] = useState({ 
    lat: -26.837347522712616, 
    lng: -65.23760063499219 
  });
  const [zoom, setZoom] = useState(15);
  const mapContainerStyle = { width: "100%", height: "400px" };
  
  // Icono como URL string en lugar de JSX
  const iconURL = "/img/OIP.png";

  const posiciones = [
    { 
      id: 1, 
      posicion: { lat: -26.837347522712616, lng: -65.23760063499219 }, 
      icon: iconURL, 
      name: " Av. Roca 2398"
    },  
  ];

  const cambiarPosicion = (e) => {
    const posicion = posiciones.find(p => p.name === e.target.value);
    if (posicion) {
      setMapCenter(posicion.posicion);
      setZoom(17);
    }
  };

  // Opciones del mapa
  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    clickableIcons: true,
  }), []);

  if (!isLoaded) {
    return <div className="font-julius flex items-center justify-center h-full">Cargando...</div>;
  }

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
        options={mapOptions}
      >
        {posiciones.map(p => (
          <MarkerF
            key={p.id}
            position={p.posicion}
            icon={p.icon}
          />
        ))}
      </GoogleMap>

      <div className="h-[46px] flex justify-end ">
        <select 
          className="bg-[#1e5e39] h-8 rounded-md text-[18px] mt-2 focus:outline-none shadow font-julius" 
          name="sucursales" 
          onChange={cambiarPosicion}
        >
          {posiciones.map(p => (
            <option className="appearance-none" key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default MapContainer;