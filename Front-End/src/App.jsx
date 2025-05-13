import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Barberia/Home/Home';
// import Tienda from './components/Barberia/Tienda/Tienda';
import Servicios from './components/Barberia/Servicios/Servicios';
import Turnos from './components/Barberia/Turnos/Turnos';
import FormularioTurno from './components/Barberia/Turnos/FormularioTurno';
import CanjearPuntos from './components/Barberia/CanjearPuntos';
import PublicLayout from './components/Barberia/PublicLayout';
import LoginSelector from "./components/LoginSelector";
import LoginAdmin from "./components/Barberia_Admin/Login";
import LoginEmpleado from "./components/LoginEmpleado";
import LoginCliente from "./components/LoginCliente";
import Register from './components/Barberia_Admin/Register';
import AdminLayout from './components/Barberia_Admin/AdminLayout';
import Dashboard from './components/Barberia_Admin/DashBoard';
import GestionEmpleados from './components/Barberia_Admin/Empleado/GestionEmpleados';
import GestionProductos from './components/Barberia_Admin/Producto/GestionProductos';
import GestionPedido from './components/Barberia_Admin/Pedido/GestionPedido';
import GestionServicios from './components/Barberia_Admin/Servicio/GestionServicios';
import HistorialCliente from './components/Barberia_Admin/Historial/HistorialCliente';
import GestionMetodosPago from './components/Barberia_Admin/Pago/GestionMetodosPago';
import ProtectedRoute from './components/Barberia_Admin/ProtectedRoute';
import PerfilUsuario from "./components/Barberia/PerfilUsuario";
import EmpleadoDashboard from "./components/Empleado/Dashboard";
import PerfilEmpleado from "./components/Empleado/PerfilEmpleado";
import ProductosTienda from "./components/Barberia/Productos/ProductosTienda";

const App = () => {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Rutas públicas con layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<ProductosTienda />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/turnos" element={<Turnos />} />
          <Route path="/turnos/:dia" element={<FormularioTurno />} />
          <Route path="/canjear-puntos" element={<CanjearPuntos />} />
          <Route path="/login" element={<LoginSelector />} />
          <Route path="/login/admin" element={<LoginAdmin />} />
          <Route path="/login/empleado" element={<LoginEmpleado />} />
          <Route path="/login/cliente" element={<LoginCliente />} />
          <Route path="/register" element={<Register />} />
          <Route path="/productos" element={<ProductosTienda />} />
          
          {/* Rutas protegidas para clientes */}
          <Route path="/cliente/dashboard" element={
            <ProtectedRoute tipoUsuario="cliente">
              <PerfilUsuario />
            </ProtectedRoute>
          } />
          <Route path="/cliente/canjear" element={
            <ProtectedRoute tipoUsuario="cliente">
              <CanjearPuntos />
            </ProtectedRoute>
          } />
          <Route path="/cliente/perfil" element={
            <ProtectedRoute tipoUsuario="cliente">
              <PerfilUsuario />
            </ProtectedRoute>
          } />

          
          {/* Rutas protegidas para empleados */}
          <Route path="/empleado/dashboard" element={
            <ProtectedRoute tipoUsuario="empleado">
              <EmpleadoDashboard />
            </ProtectedRoute>
          } />
          <Route path="/empleado/perfil" element={
            <ProtectedRoute tipoUsuario="empleado">
              <PerfilEmpleado />
            </ProtectedRoute>
          } />
          {/* ...agrega aquí más rutas públicas según tu app */}
        </Route>

        {/* Rutas protegidas admin con layout exclusivo */}
        <Route path="/admin" element={
          <ProtectedRoute tipoUsuario="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="empleados" element={<GestionEmpleados />} />
          <Route path="productos" element={<GestionProductos />} />
          <Route path="pedidos" element={<GestionPedido />} />
          <Route path="servicios" element={<GestionServicios />} />
          <Route path="historial" element={<HistorialCliente />} />
          <Route path="metodos-pago" element={<GestionMetodosPago />} />
          {/* ...otras rutas admin... */}
        </Route>

        {/* Fallback: si no existe la ruta, redirige al Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
