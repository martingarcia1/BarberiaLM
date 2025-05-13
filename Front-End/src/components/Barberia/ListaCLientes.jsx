import React, { useEffect, useState } from 'react';
import { getClientes } from '../services/clienteService';

function ListaClientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    getClientes()
      .then(res => setClientes(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Clientes</h2>
      <ul>
        {clientes.map(cliente => (
          <li key={cliente.id_cliente}>
            {cliente.nombre} {cliente.apellido} - {cliente.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaClientes;