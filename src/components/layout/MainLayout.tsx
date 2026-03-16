import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const MainLayout = () => {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground transition-all duration-500">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Sidebar />
      <div 
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out",
          sidebarCollapsed ? "md:ml-0" : "md:ml-0" 
        )} 
        role="document"
      >
        <TopNav />
        <main
          id="main-content"
          className="flex-1 overflow-auto p-4 md:p-8 focus:outline-none"
          tabIndex={-1}
          role="main"
          aria-label="Main content"
        >
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
