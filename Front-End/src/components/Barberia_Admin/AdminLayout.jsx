import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 