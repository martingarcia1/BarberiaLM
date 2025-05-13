import React, { useEffect, useState } from 'react';
import { serviceService } from '../services/serviceService';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceService.getAllServices();
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los servicios');
        setLoading(false);
        console.error('Error:', err);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div>Cargando servicios...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Servicios Disponibles</h2>
      <div className="services-grid">
        {services.map((service) => (
          <div key={service._id} className="service-card">
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <p>Precio: ${service.price}</p>
            <p>Duración: {service.duration} minutos</p>
            <p>Categoría: {service.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList; 