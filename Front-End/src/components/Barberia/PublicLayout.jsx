import { useState } from 'react';
import Navbar from '../Barberia/NavBar/NavBar';
import Banner from '../Barberia/Banner';
import { Outlet } from 'react-router-dom';
import Carrito from './Carrito/Carrito';

const PublicLayout = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Navbar setCartOpen={setCartOpen} />
      <Banner />
      {cartOpen && <Carrito cartOpen={cartOpen} setCartOpen={setCartOpen} />}
      <Outlet />
    </>
  );
};

export default PublicLayout;