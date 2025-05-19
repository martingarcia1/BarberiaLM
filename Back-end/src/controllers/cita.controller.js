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
      cliente_id, 
      empleado_id,
      servicio_id,
      fecha_hora,
      pagado_con_puntos,
      observaciones
    } = req.body;

    // Validar que se proporcionen todos los campos requeridos
    if (!cliente_id || !empleado_id || !servicio_id || !fecha_hora) {
      await t.rollback();
      return res.status(400).json({ 
        message: 'Faltan campos requeridos',
        required: ['cliente_id', 'empleado_id', 'servicio_id', 'fecha_hora']
      });
    }

    // Verificar que el cliente exista
    const clienteExistente = await Cliente.findByPk(cliente_id, { transaction: t });
    if (!clienteExistente) {
      await t.rollback();
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Verificar que el empleado exista
    const empleado = await Empleado.findByPk(empleado_id, { transaction: t });
    if (!empleado) {
      await t.rollback();
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    // Verificar que el servicio exista
    const servicio = await Servicio.findByPk(servicio_id, { transaction: t });
    if (!servicio) {
      await t.rollback();
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    if (pagado_con_puntos) {
      // Verificar puntos disponibles
      const puntosCliente = await PuntosCliente.findOne({
        where: { cliente_id },
        transaction: t
      });
      
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
    const citaFormateada = {
      ...citaCompleta.toJSON(),
      cliente_nombre: citaCompleta.cliente.nombre,
      barbero_nombre: citaCompleta.empleado.nombre,
      servicio_nombre: citaCompleta.servicio.nombre
    };

    // Enviar notificaciones
    await enviarEmailConfirmacion(citaCompleta.cliente, citaFormateada);
    
    // Generar mensaje de WhatsApp
    const mensajeWhatsApp = generarMensajeWhatsApp(citaCompleta.cliente, citaFormateada);
    
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
  const t = await sequelize.transaction();
  
  try {
    const { 
      cliente_id, 
      empleado_id,
      servicio_id,
      fecha_hora,
      pagado_con_puntos,
      observaciones
    } = req.body;

    const cita = await Cita.findByPk(req.params.id, { transaction: t });
    
    if (!cita) {
      await t.rollback();
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Verificar existencia de cliente, empleado y servicio si se proporcionan
    if (cliente_id) {
      const clienteExistente = await Cliente.findByPk(cliente_id, { transaction: t });
      if (!clienteExistente) {
        await t.rollback();
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
    }

    if (empleado_id) {
      const empleado = await Empleado.findByPk(empleado_id, { transaction: t });
      if (!empleado) {
        await t.rollback();
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
    }

    if (servicio_id) {
      const servicio = await Servicio.findByPk(servicio_id, { transaction: t });
      if (!servicio) {
        await t.rollback();
        return res.status(404).json({ message: 'Servicio no encontrado' });
      }
    }

    // Actualizar la cita
    await cita.update({
      cliente_id: cliente_id || cita.cliente_id,
      empleado_id: empleado_id || cita.empleado_id,
      servicio_id: servicio_id || cita.servicio_id,
      fecha_hora: fecha_hora || cita.fecha_hora,
      pagado_con_puntos: pagado_con_puntos !== undefined ? pagado_con_puntos : cita.pagado_con_puntos,
      observaciones: observaciones || cita.observaciones
    }, { transaction: t });

    // Obtener la cita actualizada con todos sus datos relacionados
    const citaActualizada = await Cita.findByPk(req.params.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Empleado, as: 'empleado' },
        { model: Servicio, as: 'servicio' }
      ],
      transaction: t
    });

    await t.commit();
    res.json(citaActualizada);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ 
      message: 'Error al actualizar la cita', 
      error: error.message 
    });
  }
};

exports.updateEstadoCita = async (req, res) => {
  try {
    const { estado } = req.body;
    
    if (!estado) {
      return res.status(400).json({ 
        message: 'El estado es requerido'
      });
    }

    // Verificar que el estado sea válido
    const estadosValidos = ['Pendiente', 'Confirmada', 'En Proceso', 'Completada', 'Cancelada'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        message: 'Estado no válido',
        estadosValidos
      });
    }

    const cita = await Cita.findByPk(req.params.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Empleado, as: 'empleado' },
        { model: Servicio, as: 'servicio' }
      ]
    });

    if (!cita) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Actualizar el estado
    await cita.update({ estado });

    // Si la cita se marca como completada y no fue pagada con puntos,
    // podríamos enviar una notificación o realizar otras acciones necesarias
    if (estado === 'Completada' && !cita.pagado_con_puntos) {
      // Aquí podrías agregar lógica adicional, como enviar confirmación
      await enviarEmailConfirmacion(cita.cliente, {
        ...cita.toJSON(),
        cliente_nombre: cita.cliente.nombre,
        barbero_nombre: cita.empleado.nombre,
        servicio_nombre: cita.servicio.nombre
      });
    }

    res.json(cita);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al actualizar el estado de la cita', 
      error: error.message 
    });
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

exports.getDisponibilidad = async (req, res) => {
  try {
    const { fecha } = req.query;

    if (!fecha) {
      return res.status(400).json({
        message: 'La fecha es requerida'
      });
    }

    // Obtener las citas existentes para esa fecha
    const citasExistentes = await Cita.findAll({
      where: {
        fecha_hora: {
          [sequelize.Op.like]: `${fecha}%`
        }
      },
      include: [
        { model: Empleado, as: 'empleado' }
      ]
    });

    // Obtener todos los empleados activos
    const empleados = await Empleado.findAll({
      where: {
        estado: 'activo'
      }
    });

    // Crear array de horarios disponibles (de 10:00 a 22:00, intervalos de 30 min)
    const horarios = [];
    for (let hora = 10; hora < 22; hora++) {
      for (let minuto of [0, 30]) {
        const horaFormateada = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        horarios.push(horaFormateada);
      }
    }

    // Verificar disponibilidad para cada horario
    const disponibilidad = {};
    horarios.forEach(horario => {
      const [hora] = horario.split(':');
      disponibilidad[horario] = empleados.some(empleado => {
        // Verificar si el empleado ya tiene una cita en este horario
        return !citasExistentes.some(cita => {
          const citaHora = new Date(cita.fecha_hora).getHours();
          return cita.empleado_id === empleado.id && citaHora === parseInt(hora);
        });
      });
    });

    res.json({
      fecha,
      horarios: disponibilidad
    });
  } catch (error) {
    console.error('Error al obtener disponibilidad:', error);
    res.status(500).json({
      message: 'Error al obtener la disponibilidad',
      error: error.message
    });
  }
};