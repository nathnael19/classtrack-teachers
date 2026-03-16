import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Camera,
  Radio,
  BarChart3,
  FileText,
  MapPin,
  Settings,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Courses', path: '/courses' },
  { icon: Camera, label: 'Sessions', path: '/sessions/new' },
  { icon: Radio, label: 'Live Session', path: '/sessions/live' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: MapPin, label: 'Classrooms', path: '/classrooms' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar, isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { user, logout } = useAuthStore();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 md:sticky md:z-auto transition-all duration-500 ease-in-out p-4 flex flex-col h-screen shrink-0 overflow-hidden bg-background",
          sidebarCollapsed ? "w-28" : "w-72",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="bg-card rounded-[2.5rem] shadow-xl border border-border/40 flex flex-col h-full overflow-hidden relative">
          {/* Branding Section */}
          <div className={cn(
            "p-8 pb-6 flex items-center transition-all duration-500",
            sidebarCollapsed ? "justify-center" : "gap-4"
          )}>
            <div className="relative group/logo">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-indigo-500/10 border border-white/20 backdrop-blur-md flex items-center justify-center p-2 shadow-inner group-hover/logo:scale-110 group-hover/logo:rotate-3 active:scale-95 transition-all duration-300 shadow-lg shadow-primary/10" aria-hidden>
                <img src="/logo_mark.png" alt="Class Track Logo" className="w-full h-full object-contain filter drop-shadow-sm" />
              </div>
              <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>

            {!sidebarCollapsed && (
              <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-500">
                <h2 className="text-2xl font-bold tracking-tight text-foreground leading-none">ClassTrack</h2>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 mt-1.5">Enterprise</span>
              </div>
            )}
          </div>

          {/* Navigation Section */}
          <nav className="px-4 py-2 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar" aria-label="Primary">
            <div className={cn(
              "text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] mb-6 px-4 transition-all duration-500",
              sidebarCollapsed && "opacity-0"
            )}>
              Menu
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 text-sm font-bold relative overflow-hidden",
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/30 translate-x-1"
                      : "text-muted-foreground/80 hover:bg-primary/5 hover:text-primary"
                  )
                }
              >
                <div className={cn(
                  "flex items-center gap-4 relative z-10 transition-all duration-500",
                  sidebarCollapsed && "justify-center w-full"
                )}>
                  <item.icon className={cn(
                    "w-5 h-5 transition-all duration-300",
                    "group-hover:scale-110 group-hover:rotate-6"
                  )} aria-hidden />
                  {!sidebarCollapsed && (
                    <span className="animate-in fade-in slide-in-from-left-2 duration-500">{item.label}</span>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-40 group-hover:translate-x-0" />
                )}

                {/* Active Reflection Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </NavLink>
            ))}
          </nav>

          {/* Bottom Actions & User Profile */}
          <div className="p-4 mt-auto space-y-3">
            {/* Collapse Toggle (Desktop only) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:flex w-full h-12 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-all border border-transparent hover:border-border/30 group"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-muted-foreground group-hover:scale-110 transition-transform" />
              ) : (
                <div className="flex items-center gap-3 w-full px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <PanelLeftClose className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="animate-in fade-in duration-500">Collapse</span>
                </div>
              )}
            </Button>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="flex w-full h-12 rounded-2xl bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive transition-all border border-transparent group"
            >
              {sidebarCollapsed ? (
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              ) : (
                <div className="flex items-center gap-3 w-full px-4 text-xs font-bold uppercase tracking-widest">
                  <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="animate-in fade-in duration-500">Log out</span>
                </div>
              )}
            </Button>

            {/* Profile Section */}
            <div className={cn(
              "bg-muted/30 p-4 rounded-[2rem] border border-border/20 group cursor-pointer transition-all hover:bg-muted/50 hover:shadow-lg hover:shadow-indigo-500/5",
              sidebarCollapsed ? "items-center" : "flex-col"
            )} role="complementary" aria-label="Current user">
              <div className={cn(
                "flex items-center gap-4 transition-all duration-500",
                sidebarCollapsed && "justify-center"
              )}>
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 text-primary flex items-center justify-center text-lg font-black shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform" aria-hidden>
                    {user ? getInitials(user.name) : '??'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                </div>

                {!sidebarCollapsed && (
                  <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-500">
                    <span className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">
                      {user?.name || 'Guest User'}
                    </span>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider opacity-60">
                      {user?.role || 'Guest'}
                    </span>
                  </div>
                )}
              </div>


            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
