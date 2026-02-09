import { API_URL } from '../config/api';

// Si API_URL termina en /api, lo quitamos para evitar duplicados en componentes legacy que añaden /api manualmente
const baseUrl = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;

export default {
    urlKey: baseUrl
}