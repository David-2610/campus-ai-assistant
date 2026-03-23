import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-brand-light flex flex-col md:flex-row font-sans">
      <Sidebar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
