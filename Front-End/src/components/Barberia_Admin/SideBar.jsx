import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaShoppingCart, FaClipboardList, FaHistory, FaCreditCard, FaCut, FaSignOutAlt } from "react-icons/fa";

const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        { path: '/admin/dashboard', icon: <FaHome />, text: 'Dashboard' },
        { path: '/admin/empleados', icon: <FaUsers />, text: 'Empleados' },
        { path: '/admin/productos', icon: <FaShoppingCart />, text: 'Productos' },
        { path: '/admin/pedidos', icon: <FaClipboardList />, text: 'Pedidos' },
        { path: '/admin/servicios', icon: <FaCut />, text: 'Servicios' },
        { path: '/admin/historial', icon: <FaHistory />, text: 'Historial' },
        { path: '/admin/metodos-pago', icon: <FaCreditCard />, text: 'Métodos de Pago' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className={`bg-[#224e1a] text-white h-screen flex flex-col justify-between ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 fixed left-0 top-0`}>
            <div>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className={`font-bold text-xl ${!isOpen && 'hidden'}`}>La Barbería LM</h1>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg hover:bg-[#0E3C09] transition-colors"
                        >
                            {isOpen ? '←' : '→'}
                        </button>
                    </div>
                    <nav>
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center p-3 rounded-lg transition-colors ${
                                            location.pathname === item.path
                                                ? 'bg-[#0E3C09] text-white'
                                                : 'hover:bg-[#0E3C09] text-gray-300 hover:text-white'
                                        }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        {isOpen && <span className="ml-3">{item.text}</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
            <div className="p-4 mb-2">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full gap-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white justify-center"
                >
                    <FaSignOutAlt className="text-xl" />
                    {isOpen && <span>Cerrar sesión</span>}
                </button>
            </div>
        </div>
    );
};

export default SideBar;
