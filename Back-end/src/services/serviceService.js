import api from './api';

export const serviceService = {
  // Obtener todos los servicios
  getAllServices: async () => {
    const response = await api.get('/services');
    return response.data;
  },

  // Obtener servicios por categoría
  getServicesByCategory: async (category) => {
    const response = await api.get(`/services/category/${category}`);
    return response.data;
  },

  // Obtener un servicio por ID
  getServiceById: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Crear un nuevo servicio (solo admin)
  createService: async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  // Actualizar un servicio (solo admin)
  updateService: async (id, serviceData) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },

  // Eliminar un servicio (solo admin)
  deleteService: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  }
};