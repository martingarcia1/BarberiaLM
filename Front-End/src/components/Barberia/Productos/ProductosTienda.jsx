import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductoDetalleModal from "./ProductoDetalleModal";
import axios from "axios";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import url from "../../../utils/url";

export default function ProductosTienda() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroPrecio, setFiltroPrecio] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    const notyf = new Notyf({
      duration: 3000,
      position: { x: 'center', y: 'top' },
      types: [
        { type: 'success', background: "#28b463", className: "rounded-[10px] text-black text-[15px]" }
      ]
    });
    window.notyf = notyf;

    const cargarProductos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url.urlKey}/api/productos`);
        if (res.data && Array.isArray(res.data)) {
          setProductos(res.data.filter(p => p.estado === 'activo'));
          setError(null);
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('Error al cargar los productos. Por favor, intente más tarde.');
        window.notyf.error('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  const filtrarProductos = () => {
    let filtrados = [...productos];
    
    if (filtroPrecio) {
      const [min, max] = filtroPrecio.split('-').map(Number);
      filtrados = filtrados.filter(p => p.precio >= min && p.precio <= max);
    }

    return filtrados;
  };

  const agregarAlCarrito = (producto) => {
    // Obtener el carrito actual
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    // Buscar si el producto ya está en el carrito
    const index = carrito.findIndex(p => p.id === producto.id);
    if (index !== -1) {
      // Si ya existe, suma 1 a la cantidad (máximo 10)
      if (carrito[index].cantidad < 10) {
        carrito[index].cantidad += 1;
        window.notyf.success(`Agregaste otra unidad de ${producto.nombre_producto}`);
      } else {
        window.notyf.error("No puedes agregar más de 10 unidades");
        return false;
      }
    } else {
      // Si no existe, lo agrega con cantidad 1
      carrito.push({
        ...producto,
        cantidad: 1,
        name: producto.nombre_producto,
        price: producto.precio,
        tipo: 'producto', // Identificador para productos normales
        carrito: false,
        img: producto.imagen_url
      });
      window.notyf.success(`${producto.nombre_producto} agregado al carrito`);
    }
    // Guardar el carrito actualizado
    localStorage.setItem("carrito", JSON.stringify(carrito));
    // Lanzar evento para actualizar el contador del carrito
    window.dispatchEvent(new Event("updateCartCounter"));
    return true;
  };

  const abrirModalDetalle = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e5e39]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-[#1e5e39] text-white px-6 py-2 rounded hover:bg-[#347c52] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const productosFiltrados = filtrarProductos();

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#1e5e39] mb-4">Nuestros Productos</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <select 
            value={filtroPrecio}
            onChange={(e) => setFiltroPrecio(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e5e39]"
          >
            <option value="">Todos los precios</option>
            <option value="0-1000">Hasta $1,000</option>
            <option value="1000-2000">$1,000 - $2,000</option>
            <option value="2000-5000">$2,000 - $5,000</option>
            <option value="5000-10000">$5,000 - $10,000</option>
            <option value="10000-999999">Más de $10,000</option>
          </select>
        </div>
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No se encontraron productos con los filtros seleccionados
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosFiltrados.map(prod => (
            <ProductCard
              key={prod.id}
              product={{
                ...prod,
                img: prod.imagen_url,
                name: prod.nombre_producto,
                price: prod.precio
              }}
              agregarAlCarrito={() => agregarAlCarrito(prod)}
              openModal={() => abrirModalDetalle(prod)}
              modalAbierto={modalAbierto}
            />
          ))}
        </div>
      )}

      <ProductoDetalleModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        producto={productoSeleccionado}
      />
    </div>
  );
}