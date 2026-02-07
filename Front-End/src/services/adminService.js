import axios from 'axios';
import { API_URL } from '../config/api';

const ADMIN_URL = `${API_URL}/admins`;

export const loginAdmin = (email, contrasena) =>
  axios.post(`${ADMIN_URL}/login`, { email, contrasena });