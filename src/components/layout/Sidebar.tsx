import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Camera, 
  Radio, 
  BarChart3, 
  FileText, 
  MapPin, 
  Settings 
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
      className="w-full md:w-64 border-r bg-card hidden md:flex flex-col h-screen sticky top-0 shrink-0"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="p-6 border-b flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm" aria-hidden>
          G
        </div>
        <h2 className="text-xl font-bold tracking-tight">GeoAttend</h2>
      </div>
      <nav className="p-4 space-y-0.5 flex-1 overflow-y-auto" aria-label="Primary">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">Navigation</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium border-l-2 border-transparent ${
                isActive
                  ? 'bg-primary/10 text-primary border-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground border-transparent'
              }`
            }
            aria-current={undefined}
          >
            <item.icon className="w-4 h-4 shrink-0" aria-hidden />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t mt-auto bg-muted/30">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg" role="complementary" aria-label="Current user">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0" aria-hidden>
            JD
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">John Doe</span>
            <span className="text-xs text-muted-foreground">Lecturer</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
