import { useEffect, useState, useRef } from 'react';
import { LuScissors, LuGift } from "react-icons/lu";
import { IoCartOutline } from "react-icons/io5";
import { BsInfoCircle } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import Carrito from '../Carrito/Carrito.jsx';

const Navbar = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [Contadorprod, setContadorProd] = useState(null);
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("token"));
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const actualizarContadorCarrito = () => {
    const savedCart = localStorage.getItem("carrito");
    if (savedCart) {
      const prod=JSON.parse(savedCart)
      const cantidadProd = prod.map(p=>p.cantidad);
     setContadorProd(cantidadProd.reduce((acumulador, valorActual) => acumulador + valorActual, 0))
    }
  };

  useEffect(() => {
    actualizarContadorCarrito();
    window.addEventListener('updateCartCounter', actualizarContadorCarrito);
    return () => {
      window.removeEventListener('updateCartCounter', actualizarContadorCarrito);
    };
  }, [cartOpen]);

  useEffect(() => {
    setIsLogged(!!localStorage.getItem("token"));
    const onStorage = () => setIsLogged(!!localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav id='pppp' className="z-10  bg-[#cacfca] pb-2 fixed w-full top-0 left-0 flex items-center justify-between p-2 text-[#0A4B2E]">
        <Link to="/" >
          <div className="bg-[#cacfca] border bg-opacity-60 ml-4 movil-sm:ml-1 w-[90px] h-[90px] movil-s:w-[70px] movil-s:h-[70px] movil-sm:w-[60px] movil-sm:h-[60px] cursor-pointer rounded-full border-b-[#0E3C09] border-t-[#0E3C09] border-y-2 border-opacity-55 border-r-[#0E3C09] border-l-[#0E3C09] hover:scale-110 hover:border-opacity-50 transition-transform duration-300 group flex items-center justify-center">
            <img 
              src="/img/labarberia.jpg" 
              alt="Logo La Barbería LM" 
              className="w-[70px] h-[70px] movil-s:w-[50px] movil-s:h-[50px] movil-sm:w-[40px] movil-sm:h-[40px] rounded-full object-cover border-2  shadow-md" 
            />
          </div>
        </Link>

        <ul className="flex space-x-8 mr-8 movil-s:ml-3 movil-sm:space-x-4 movil-sm:ml-2 items-center ">
          <li className='focus:outline-none'>
            <Link to="/servicios" className="flex items-center space-x-1  opacity-100 hover:scale-110 transition-transform duration-300 font-julius hover:text-[#0a4b2e]">
              <LuScissors className="text-2xl movil-sm:text-lg movil-smm:text-[13px]" />
              <h4 className=" focus:outline-none text-lg movil-sm:text-base movil-smm:text-[13px] ">Servicios</h4>
            </Link>
          </li>

          <li className='focus:outline-none'>
            <Link to="/productos" className="flex items-center space-x-1  opacity-100 hover:scale-110 transition-transform duration-300 font-julius hover:text-[#0a4b2e]">
              <MdShoppingBag className="text-2xl movil-sm:text-lg movil-smm:text-[13px]" />
              <h4 className=" focus:outline-none text-lg movil-sm:text-base movil-smm:text-[13px] ">Tienda</h4>
            </Link>
          </li>

          <li className='focus:outline-none'>
            <Link to="/canjear-puntos" className="flex items-center space-x-1  opacity-100 hover:scale-110 transition-transform duration-300 font-julius hover:text-[#0a4b2e]">
              <LuGift className="text-2xl movil-sm:text-lg movil-smm:text-[13px]" />
              <h4 className=" focus:outline-none text-lg movil-sm:text-base movil-smm:text-[13px] ">Canjear Puntos</h4>
            </Link>
          </li>

          <li className='focus:outline-none'>
            <Link to="/turnos" className="flex items-center space-x-1  opacity-100 hover:scale-110 transition-transform duration-300 font-julius hover:text-[#0A4B2E]">
              <BsInfoCircle className="text-2xl movil-sm:text-lg movil-smm:text-[13px] " />
              <h4 className=" focus:outline-none text-lg movil-sm:text-base movil-smm:text-[13px]">Reservar Turno</h4>
            </Link>
          </li>

          {/* Menú de usuario */}
          <li className="relative focus:outline-none">
            <button
              onClick={() => setUserMenuOpen((open) => !open)}
              className="flex items-center space-x-1 focus:outline-none"
              aria-label="Menú de usuario"
            >
              <FaUserCircle className="text-3xl text-[#224e1a] hover:text-[#0E3C09] transition" />
            </button>
            {userMenuOpen && (
              <div ref={userMenuRef} className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200 animate-fade-in">
                {!isLogged && (
                  <>
                    <button
                      className="block w-full text-left px-4 py-2 text-[#224e1a] hover:bg-gray-100 font-julius"
                      onClick={() => { setUserMenuOpen(false); navigate("/login"); }}
                    >
                      Iniciar sesión
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-[#224e1a] hover:bg-gray-100 font-julius"
                      onClick={() => { setUserMenuOpen(false); navigate("/register"); }}
                    >
                      Registrarse
                    </button>
                  </>
                )}
                {isLogged && (
                  <>
                    <button
                      className="block w-full text-left px-4 py-2 text-[#224e1a] hover:bg-gray-100 font-julius"
                      onClick={() => { setUserMenuOpen(false); navigate("/perfil"); }}
                    >
                      Ver perfil
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-[#224e1a] hover:bg-gray-100 font-julius"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </>
                )}
              </div>
            )}
          </li>

          <li className='focus:outline-none hover:text-[#345e37]'>
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center space-x-1  opacity-100  transition-transform duration-300 font-julius"
            >
              <IoCartOutline className="text-2xl movil-sm:text-lg movil-smm:text-[13px] text-[#345e37]" />
              {Contadorprod > 0 && (
                <span className="border-[#345e37] absolute mb-8 border movil-smm:pb-[2px] pt-1 text-xs rounded-full h-[15px] w-[15px] movil-smm:h-[12px] movil-smm:w-[12px] flex items-center justify-center movil-smm:text-[9px] movil-smm:top-[22px] movil-smm:flex">
                  {Contadorprod}
                </span>
              )}
              <h4 className=" focus:outline-none text-lg movil-sm:text-base movil-smm:text-[13px]">Carrito</h4>
            </button>
          </li>
        </ul>
      </nav>

      <Carrito setCartOpen={setCartOpen} cartOpen={cartOpen} setContadorProd={setContadorProd} />
      {/* Fondo oscuro para cuando el carrito esté abierto */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setCartOpen(false)} // Cierra el carrito al hacer clic fuera de él
        ></div>
      )}
    </>
  );
};

export default Navbar;
