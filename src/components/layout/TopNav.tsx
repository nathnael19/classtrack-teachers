import { Bell, Search, Menu } from 'lucide-react';

const TopNav = () => {
  return (
    <header className="h-16 border-b bg-card flex items-center px-4 md:px-6 justify-between sticky top-0 z-10 transition-all backdrop-blur-md bg-opacity-80">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground">
          <Menu className="w-5 h-5" />
        </button>
        <div className="md:hidden font-bold flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">G</div>
          GeoAttend
        </div>
        
        <div className="hidden md:flex items-center gap-2 relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3" />
          <input 
            type="text" 
            placeholder="Search courses, sessions..." 
            className="w-64 pl-9 pr-4 py-2 text-sm bg-muted/50 border-transparent rounded-full focus:bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive"></span>
        </button>
      </div>
    </header>
  );
};

export default TopNav;
