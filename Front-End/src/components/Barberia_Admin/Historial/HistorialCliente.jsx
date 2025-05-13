import { useState, useEffect } from 'react';
import axios from 'axios';

const HistorialCliente = () => {
  const [historial, setHistorial] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [tipoHistorial, setTipoHistorial] = useState('compras'); // 'compras' o 'canjes'

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error('Error al obtener clientes:', error);
      }
    };
    fetchClientes();
  }, []);

  useEffect(() => {
    if (clienteSeleccionado) {
      const fetchHistorial = async () => {
        try {
          const endpoint = tipoHistorial === 'compras' 
            ? `http://localhost:3001/api/clientes/${clienteSeleccionado}/compras`
            : `http://localhost:3001/api/clientes/${clienteSeleccionado}/canjes`;
          const response = await axios.get(endpoint);
          setHistorial(response.data);
        } catch (error) {
          console.error('Error al obtener historial:', error);
        }
      };
      fetchHistorial();
    }
  }, [clienteSeleccionado, tipoHistorial]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-[#9BC885]">Historial de Clientes</h1>
      
      {/* Selector de Cliente */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Seleccionar Cliente</label>
        <select
          className="w-full md:w-1/3 border rounded px-3 py-2"
          value={clienteSeleccionado || ''}
          onChange={(e) => setClienteSeleccionado(e.target.value)}
        >
          <option value="">Seleccione un cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre} {cliente.apellido}
            </option>
          ))}
        </select>
      </div>

      {/* Selector de Tipo de Historial */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Tipo de Historial</label>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded ${
              tipoHistorial === 'compras'
                ? 'bg-[#224e1a] text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setTipoHistorial('compras')}
          >
            Compras
          </button>
          <button
            className={`px-4 py-2 rounded ${
              tipoHistorial === 'canjes'
                ? 'bg-[#224e1a] text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setTipoHistorial('canjes')}
          >
            Canjes
          </button>
        </div>
      </div>

      {/* Tabla de Historial */}
      {clienteSeleccionado && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {tipoHistorial === 'compras' ? 'Producto' : 'Servicio'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {tipoHistorial === 'compras' ? 'Total' : 'Puntos Usados'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historial.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(item.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tipoHistorial === 'compras' ? item.producto_nombre : item.servicio_nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.cantidad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tipoHistorial === 'compras' ? `$${item.total}` : item.puntos_usados}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.estado === 'completado' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistorialCliente; 