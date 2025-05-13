const { Pago } = require('../models');
const { MercadoPagoConfig, Payment, Preference } = require('mercadopago');
require('dotenv').config();

// Configurar MercadoPago
const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

// Logs para depuración
console.log('Token de Mercado Pago:', process.env.MERCADO_PAGO_ACCESS_TOKEN);

exports.getAllPagos = async (req, res) => {
  try {
    const pagos = await Pago.findAll();
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pagos', error });
  }
};

exports.getPagoById = async (req, res) => {
  try {
    const pago = await Pago.findByPk(req.params.id);
    if (!pago) return res.status(404).json({ message: 'Pago no encontrado' });
    res.json(pago);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el pago', error });
  }
};

exports.createPago = async (req, res) => {
  try {
    const nuevoPago = await Pago.create(req.body);
    res.status(201).json(nuevoPago);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el pago', error });
  }
};

exports.updatePago = async (req, res) => {
  try {
    const pago = await Pago.findByPk(req.params.id);
    if (!pago) return res.status(404).json({ message: 'Pago no encontrado' });
    await pago.update(req.body);
    res.json(pago);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el pago', error });
  }
};

exports.deletePago = async (req, res) => {
  try {
    const pago = await Pago.findByPk(req.params.id);
    if (!pago) return res.status(404).json({ message: 'Pago no encontrado' });
    await pago.destroy();
    res.json({ message: 'Pago eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el pago', error });
  }
};

exports.crearPreferencia = async (req, res) => {
  try {
    const { items, cliente } = req.body;

    let preference = {
      items: items.map(item => ({
        title: item.name,
        unit_price: Number(item.price),
        quantity: item.cantidad,
        currency_id: "ARS"
      })),
      payer: {
        name: cliente.nombre,
        phone: {
          number: cliente.celular
        }
      },
      back_urls: {
        success: "http://localhost:5173/success",
        failure: "http://localhost:5173/failure",
        pending: "http://localhost:5173/pending"
      },
      auto_return: "approved",
      notification_url: "https://tu-dominio.com/webhook" // Reemplaza con tu URL de notificaciones
    };

    const response = await client.preference.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: 'Error al crear preferencia de pago' });
  }
};

exports.crearPago = async (req, res) => {
    try {
        console.log('Iniciando creación de pago...');
        const { items, cliente } = req.body;
        
        console.log('Datos recibidos:', { items, cliente });

        // Crear preferencia de pago
        const preference = new Preference(mercadopago);
        const preferenceData = {
            items: items.map(item => ({
                id: item.id.toString(),
                title: item.name,
                currency_id: 'ARS',
                description: item.descripcion || "Servicio de barbería",
                picture_url: item.img || "",
                category_id: "services",
                quantity: item.cantidad,
                unit_price: parseFloat(item.price)
            })),
            payer: {
                name: cliente.nombre,
                phone: {
                    area_code: "549",
                    number: cliente.celular
                }
            },
            back_urls: {
                success: `${process.env.APP_URL}/success`,
                failure: `${process.env.APP_URL}/failure`,
                pending: `${process.env.APP_URL}/pending`
            },
            auto_return: "approved",
            external_reference: `BARBERIA-${Date.now()}`,
            notification_url: `${process.env.APP_URL}/api/pagos/webhook`
        };

        console.log('Creando preferencia con datos:', preferenceData);

        try {
            const response = await preference.create({ body: preferenceData });
            console.log('Respuesta de Mercado Pago:', response);

            // Guardar el pago en nuestra base de datos
            const nuevoPago = await Pago.create({
                monto: items.reduce((total, item) => total + (parseFloat(item.price) * item.cantidad), 0),
                estado: 'Pendiente',
                tipo_pago: 'mercadopago',
                referencia_externa: preferenceData.external_reference,
                cliente_id: cliente.id || 1
            });

            console.log('Pago guardado en base de datos:', nuevoPago);

            res.status(201).json({
                success: true,
                data: {
                    id: response.id,
                    init_point: response.init_point,
                    payment_id: nuevoPago.id,
                    external_reference: preferenceData.external_reference
                }
            });
        } catch (mpError) {
            console.error('Error específico de Mercado Pago:', mpError);
            throw mpError;
        }

    } catch (error) {
        console.error('Error detallado al crear el pago:', error);
        res.status(500).json({
            success: false,
            error: 'Error al procesar el pago',
            details: error.response?.data || error.message,
            stack: error.stack
        });
    }
};

exports.webhookMP = async (req, res) => {
    try {
        console.log('Webhook recibido:', req.body);
        const { type, data } = req.body;

        if (type === 'payment') {
            const paymentId = data.id;
            console.log('ID de pago recibido:', paymentId);
            
            const payment = new Payment(mercadopago);
            
            try {
                const paymentInfo = await payment.get({ id: paymentId });
                console.log('Información del pago:', paymentInfo);
                
                const pago = await Pago.findOne({
                    where: { referencia_externa: paymentInfo.external_reference }
                });

                if (pago) {
                    await pago.update({
                        estado: paymentInfo.status === 'approved' ? 'Completado' : 'Pendiente',
                        id_transaccion_mp: paymentId
                    });
                    console.log('Pago actualizado:', pago);
                } else {
                    console.log('No se encontró el pago con referencia:', paymentInfo.external_reference);
                }
            } catch (mpError) {
                console.error('Error al obtener información del pago de MP:', mpError);
                throw mpError;
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Error en webhook:', error);
        res.sendStatus(500);
    }
};