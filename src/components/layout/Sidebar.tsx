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
  ChevronRight
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Courses', path: '/courses' },
  { icon: Camera, label: 'Sessions', path: '/sessions/new' },
  { icon: Radio, label: 'Live Session', path: '/sessions/live' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: MapPin, label: 'Classrooms', path: '/classrooms' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  return (
    <aside
      className="w-full md:w-72 bg-background hidden md:flex flex-col h-screen sticky top-0 shrink-0 p-4"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="bg-card rounded-3xl shadow-sm border border-border/50 flex flex-col h-full overflow-hidden relative">
        {/* Branding Section */}
        <div className="p-8 pb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95 duration-300" aria-hidden>
            C
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight text-foreground leading-none">ClassTrack</h2>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60 mt-1">Enterprise</span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="px-4 py-2 space-y-1 flex-1 overflow-y-auto custom-scrollbar" aria-label="Primary">
          <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-4 px-4">Navigation</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-semibold relative overflow-hidden ${
                  isActive
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-1'
                    : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                }`
              }
            >
              <div className="flex items-center gap-4 relative z-10">
                <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} aria-hidden />
                <span>{item.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 opacity-0 transition-all duration-300 group-hover:opacity-40 group-hover:translate-x-1`} />
              
              {/* Subtle Active Indicator Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 mt-auto">
          <div className="bg-muted/30 p-4 rounded-2xl border border-border/20 group cursor-pointer transition-all hover:bg-muted/50" role="complementary" aria-label="Current user">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 text-primary flex items-center justify-center text-lg font-bold shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform" aria-hidden>
                JD
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">John Doe</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Senior Lecturer</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border/20 flex items-center justify-between text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-1">
              <span>System v4.2</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                <div className="w-1 h-1 rounded-full bg-emerald-500 opacity-30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
