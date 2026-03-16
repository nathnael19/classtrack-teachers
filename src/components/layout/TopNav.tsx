import { Bell, Search, Menu } from 'lucide-react';

const TopNav = () => {
  return (
    <header
      className="h-14 md:h-16 border-b bg-card/95 flex items-center px-4 md:px-6 justify-between sticky top-0 z-10 backdrop-blur-sm"
      role="banner"
    >
      <div className="flex items-center gap-3 md:gap-4">
        <button
          type="button"
          className="md:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" aria-hidden />
        </button>
        <div className="md:hidden font-bold flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold" aria-hidden>C</div>
          <span className="tracking-tight">ClassTrack</span>
        </div>

        <div className="hidden md:block relative">
          <label htmlFor="topnav-search" className="sr-only">Search courses and sessions</label>
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden />
          <input
            id="topnav-search"
            type="search"
            placeholder="Search courses, sessions..."
            autoComplete="off"
            className="w-56 lg:w-64 pl-9 pr-4 py-2 text-sm bg-muted/50 border border-transparent rounded-full focus:bg-background focus:border-primary/30 focus:ring-2 focus:ring-primary/20 transition-all font-sans"
            aria-label="Search courses and sessions"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          type="button"
          className="relative p-2.5 text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-full hover:bg-muted cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" aria-hidden />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive ring-2 ring-card" aria-hidden />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
