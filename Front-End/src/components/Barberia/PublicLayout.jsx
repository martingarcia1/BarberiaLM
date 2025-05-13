import Navbar from '../Barberia/NavBar/NavBar';
import Banner from '../Barberia/Banner';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => (
  <>
    <Navbar />
    <Banner />
    <Outlet />
  </>
);

export default PublicLayout; 