import axios from 'axios';
import { API_URL } from '../config/api';

const CLIENTES_URL = `${API_URL}/clientes`;

export const getClientes = () => axios.get(CLIENTES_URL);
export const getClienteById = (id) => axios.get(`${CLIENTES_URL}/${id}`);
export const createCliente = (data) => axios.post(CLIENTES_URL, data);
export const updateCliente = (id, data) => axios.put(`${CLIENTES_URL}/${id}`, data);
export const deleteCliente = (id) => axios.delete(`${CLIENTES_URL}/${id}`);