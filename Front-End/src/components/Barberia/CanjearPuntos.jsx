import { isTokenvalid } from '../../utils/isTokenValid';

const CanjearPuntos = () => {
  const token = localStorage.getItem('token');
  const isAuth = token && isTokenvalid(token);

  if (!isAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold text-[#224e1a] mb-4">Inicia sesión para poder ver las mejores promos y regalos</h2>
        <p className="text-gray-600">¡Accede a tu cuenta para descubrir todos los beneficios exclusivos!</p>
      </div>
    );
  }

  // Aquí va el contenido real de canje de puntos para usuarios autenticados
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#224e1a] mb-6">Canjea tus puntos por premios y promociones</h1>
      {/* Aquí puedes renderizar la lógica y UI real de canje de puntos */}
      <p className="text-gray-700">Aquí se mostrarán las promos y regalos disponibles para canjear con tus puntos.</p>
    </div>
  );
};

export default CanjearPuntos; 