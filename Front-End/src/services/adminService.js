import axios from 'axios';

const API_URL = 'http://localhost:3001/api/admins';

export const loginAdmin = (email, contrasena) =>
  axios.post(`${API_URL}/login`, { email, contrasena });