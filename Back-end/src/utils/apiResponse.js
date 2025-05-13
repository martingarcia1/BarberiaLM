/**
 * Clase para estandarizar las respuestas de la API
 */
class ApiResponse {
  /**
   * Respuesta exitosa
   * @param {Object} res - Objeto de respuesta de Express
   * @param {String} message - Mensaje de éxito
   * @param {*} data - Datos a enviar
   * @param {Number} statusCode - Código de estado HTTP (por defecto 200)
   */
  static success(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  /**
   * Respuesta de error
   * @param {Object} res - Objeto de respuesta de Express
   * @param {String} message - Mensaje de error
   * @param {*} error - Detalles del error
   * @param {Number} statusCode - Código de estado HTTP (por defecto 500)
   */
  static error(res, message, error = null, statusCode = 500) {
    const response = {
      success: false,
      message
    };

    if (error) {
      response.error = process.env.NODE_ENV === 'development' ? error : 'Ocurrió un error';
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Respuesta de error de validación
   * @param {Object} res - Objeto de respuesta de Express
   * @param {Array} errors - Array de errores de validación
   */
  static validationError(res, errors) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors
    });
  }

  /**
   * Respuesta de no autorizado
   * @param {Object} res - Objeto de respuesta de Express
   * @param {String} message - Mensaje de error (por defecto "No autorizado")
   */
  static unauthorized(res, message = 'No autorizado') {
    return res.status(401).json({
      success: false,
      message
    });
  }

  /**
   * Respuesta de recurso no encontrado
   * @param {Object} res - Objeto de respuesta de Express
   * @param {String} message - Mensaje de error (por defecto "Recurso no encontrado")
   */
  static notFound(res, message = 'Recurso no encontrado') {
    return res.status(404).json({
      success: false,
      message
    });
  }
}

module.exports = ApiResponse; 