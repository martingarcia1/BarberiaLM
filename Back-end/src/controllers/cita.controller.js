const { Cita, Cliente, Empleado, Servicio, PuntosCliente, HistorialPuntos } = require('../models');
const { enviarEmailConfirmacion, generarMensajeWhatsApp } = require('../services/notificationService');
const { sequelize } = require('../config/database');

exports.getAllCitas = async (req, res) => {
  try {
    const citas = await Cita.findAll({
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Empleado, as: 'empleado' },
        { model: Servicio, as: 'servicio' }
      ]
    });
    
    // Formatear la respuesta para incluir nombres
    const citasFormateadas = citas.map(cita => ({
      ...cita.toJSON(),
      cliente_nombre: cita.cliente.nombre,
      barbero_nombre: cita.empleado.nombre,
      servicio_nombre: cita.servicio.nombre,
      cliente_telefono: cita.cliente.telefono,
      cliente_email: cita.cliente.email
    }));
    
    res.json(citasFormateadas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las citas', error });
  }
};

exports.getCitaById = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Empleado, as: 'empleado' },
        { model: Servicio, as: 'servicio' }
      ]
    });
    if (!cita) return res.status(404).json({ message: 'Cita no encontrada' });
    res.json(cita);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la cita', error });
  }
};

exports.createCita = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { 
      pagado_con_puntos, 
      cliente_id, 
      servicio_id,
      empleado_id,
      fecha_hora,
      observaciones
    } = req.body;
    
    if (pagado_con_puntos) {
      // Verificar puntos disponibles
      const puntosCliente = await PuntosCliente.findOne({
        where: { cliente_id },
        transaction: t
      });
      
      const servicio = await Servicio.findByPk(servicio_id, { transaction: t });
      
      if (!puntosCliente || puntosCliente.puntos < servicio.puntos_requeridos) {
        await t.rollback();
        return res.status(400).json({ 
          message: 'Puntos insuficientes para realizar la reserva' 
        });
      }
      
      // Descontar puntos
      await puntosCliente.update({
        puntos: puntosCliente.puntos - servicio.puntos_requeridos
      }, { transaction: t });
      
      // Registrar en historial
      await HistorialPuntos.create({
        cliente_id,
        tipo: 'usado',
        puntos: servicio.puntos_requeridos,
        descripcion: `Canje de puntos por servicio: ${servicio.nombre}`
      }, { transaction: t });
    }

    // Crear la cita
    const nuevaCita = await Cita.create({
      cliente_id,
      empleado_id,
      servicio_id,
      fecha_hora,
      pagado_con_puntos,
      observaciones,
      estado: 'Pendiente'
    }, { transaction: t });

    // Obtener datos completos de la cita para las notificaciones
    const citaCompleta = await Cita.findByPk(nuevaCita.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Empleado, as: 'empleado' },
        { model: Servicio, as: 'servicio' }
      ],
      transaction: t
    });

    // Si no fue pagado con puntos, asignar puntos por la reserva
    if (!pagado_con_puntos) {
      const puntosGanados = citaCompleta.servicio.puntos_otorgados || 0;
      
      if (puntosGanados > 0) {
        await PuntosCliente.findOrCreate({
          where: { cliente_id },
          defaults: { puntos: 0 },
          transaction: t
        });

        await PuntosCliente.increment('puntos', {
          by: puntosGanados,
          where: { cliente_id },
          transaction: t
        });

        await HistorialPuntos.create({
          cliente_id,
          tipo: 'ganado',
          puntos: puntosGanados,
          descripcion: `Puntos ganados por servicio: ${citaCompleta.servicio.nombre}`
        }, { transaction: t });
      }
    }

    // Preparar datos para las notificaciones
    const cliente = citaCompleta.cliente;
    const citaFormateada = {
      ...citaCompleta.toJSON(),
      cliente_nombre: cliente.nombre,
      barbero_nombre: citaCompleta.empleado.nombre,
      servicio_nombre: citaCompleta.servicio.nombre
    };

    // Enviar notificaciones
    await enviarEmailConfirmacion(cliente, citaFormateada);
    const mensajeWhatsApp = generarMensajeWhatsApp(cliente, citaFormateada);
    
    await t.commit();
    
    res.status(201).json({
      cita: citaFormateada,
      mensajeWhatsApp
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al crear la cita:', error);
    res.status(400).json({ 
      message: 'Error al crear la cita', 
      error: error.message 
    });
  }
};

exports.updateCita = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Empleado, as: 'empleado' },
        { model: Servicio, as: 'servicio' }
      ]
    });
    
    if (!cita) return res.status(404).json({ message: 'Cita no encontrada' });
    
    await cita.update(req.body);
    
    // Si el estado cambió a Confirmada, enviar notificaciones
    if (req.body.estado === 'Confirmada') {
      const cliente = cita.cliente;
      const citaFormateada = {
        ...cita.toJSON(),
        cliente_nombre: cliente.nombre,
        barbero_nombre: cita.empleado.nombre,
        servicio_nombre: cita.servicio.nombre
      };

      // Enviar email
      await enviarEmailConfirmacion(cliente, citaFormateada);

      // Generar mensaje de WhatsApp
      const mensajeWhatsApp = generarMensajeWhatsApp(cliente, citaFormateada);
      
      res.json({
        cita: citaFormateada,
        mensajeWhatsApp
      });
    } else {
      res.json(cita);
    }
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la cita', error });
  }
};

exports.deleteCita = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) return res.status(404).json({ message: 'Cita no encontrada' });
    await cita.destroy();
    res.json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la cita', error });
  }
};