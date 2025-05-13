const nodemailer = require('nodemailer');

// Configuración del transporter de email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Función para enviar email de confirmación
const enviarEmailConfirmacion = async (cliente, cita) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: cliente.email,
        subject: 'Confirmación de Turno - La Barbería LM',
        html: `
            <h2>¡Hola ${cliente.nombre}!</h2>
            <p>Tu turno ha sido confirmado:</p>
            <ul>
                <li><strong>Fecha y Hora:</strong> ${new Date(cita.fecha_hora).toLocaleString()}</li>
                <li><strong>Servicio:</strong> ${cita.servicio_nombre}</li>
                <li><strong>Barbero:</strong> ${cita.barbero_nombre}</li>
                ${cita.pagado_con_puntos ? 
                    `<li><strong>Método de pago:</strong> Puntos de fidelidad</li>` : 
                    ''
                }
            </ul>
            ${cita.pagado_con_puntos ? 
                `<p>Has utilizado tus puntos de fidelidad para este servicio. ¡Gracias por tu preferencia!</p>` : 
                `<p>Recuerda que acumularás puntos por este servicio que podrás canjear en futuras visitas.</p>`
            }
            <p>Si necesitas modificar o cancelar tu turno, por favor contáctanos.</p>
            <p>¡Gracias por elegir La Barbería LM!</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error al enviar email:', error);
        return false;
    }
};

// Función para generar mensaje de WhatsApp
const generarMensajeWhatsApp = (cliente, cita) => {
    let mensaje = `¡Hola ${cliente.nombre}! Tu turno ha sido confirmado para el ${new Date(cita.fecha_hora).toLocaleString()} con ${cita.barbero_nombre} para el servicio de ${cita.servicio_nombre}.`;
    
    if (cita.pagado_con_puntos) {
        mensaje += ' Has utilizado tus puntos de fidelidad para este servicio. ';
    }
    
    mensaje += '¡Gracias por elegir La Barbería LM!';
    return mensaje;
};

module.exports = {
    enviarEmailConfirmacion,
    generarMensajeWhatsApp
};