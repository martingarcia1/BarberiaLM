import PropTypes from 'prop-types';

const ProductCard = ({ product, agregarAlCarrito, openModal, modalAbierto }) => {
  return (
    <div
      className="relative group rounded-2xl overflow-hidden shadow-xl bg-[#181818] flex flex-col justify-end h-[420px] w-full max-w-[340px] mx-auto transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-[#232323]"
    >
      {/* Imagen con overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 group-hover:bg-opacity-40 transition duration-300" />
      </div>

      {/* Badge de precio */}
      { !modalAbierto && (
        <div className="absolute top-4 right-4 z-10 bg-[#1e5e39] text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
          ${product.price}
        </div>
      )}

      {/* Contenido */}
      <div className="relative z-10 p-6 flex flex-col gap-2">
        { !modalAbierto && (
          <h3 className="text-2xl font-extrabold font-julius text-white drop-shadow mb-1 uppercase tracking-wide">
            {product.name}
          </h3>
        )}
        {product.descripcion && (
          <p className="text-gray-200 text-sm font-light line-clamp-2 mb-2">
            {product.descripcion}
          </p>
        )}
        {/* Stock */}
        {product.stock === 0 ? (
          <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold mb-2">Agotado</span>
        ) : (
          <span className="inline-block bg-green-700 text-white text-xs px-2 py-1 rounded-full font-bold mb-2">En stock</span>
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => agregarAlCarrito(product)}
            disabled={product.stock === 0}
            className={`flex-1 bg-white bg-opacity-90 text-[#1e5e39] font-julius font-bold py-2 rounded-lg shadow hover:bg-[#1e5e39] hover:text-white transition-colors duration-200 uppercase tracking-wider text-sm ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            Comprar
          </button>
          <button
            onClick={() => openModal(product)}
            className="flex-1 border border-white text-white font-julius py-2 rounded-lg hover:bg-white hover:text-[#1e5e39] transition-colors duration-200 text-sm"
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    img: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    descripcion: PropTypes.string,
    stock: PropTypes.number,
  }).isRequired,
  agregarAlCarrito: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  modalAbierto: PropTypes.bool,
};

export default ProductCard;