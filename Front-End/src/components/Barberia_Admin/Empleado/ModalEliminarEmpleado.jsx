import PropTypes from 'prop-types';

const ModalEliminarEmpleado = ({ empleado, onClose, onConfirm }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">Eliminar Empleado</h3>
        <button onClick={onClose} className="text-2xl text-gray-400 hover:text-red-500">&times;</button>
      </div>
      <p className="text-gray-600 mb-6">
        ¿Estás seguro que deseas eliminar al empleado {empleado.nombre} {empleado.apellido}?
        Esta acción no se puede deshacer.
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

ModalEliminarEmpleado.propTypes = {
  empleado: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    apellido: PropTypes.string.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default ModalEliminarEmpleado;
