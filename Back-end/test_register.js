const axios = require('axios');

const registerUser = async () => {
    try {
        const url = 'https://barberia-lm.vercel.app/api/clientes/register';
        const data = {
            nombre: "Test",
            apellido: "User",
            email: `testuser_${Date.now()}@example.com`,
            dni: `${Date.now().toString().slice(-8)}`,
            telefono: "1234567890",
            fecha_nacimiento: "2000-01-01",
            genero: "Otro",
            contrasena: "password123"
        };

        console.log(`Sending POST to ${url} with data:`, data);

        const response = await axios.post(url, data);
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);

    } catch (error) {
        if (error.response) {
            console.log('Error Response Status:', error.response.status);
            console.log('Error Response Data:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
};

registerUser();
