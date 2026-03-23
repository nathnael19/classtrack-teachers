import { Bell, Search, Menu, X, Sun, Moon, Loader2 } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const TopNav = () => {
  const { isMobileMenuOpen, toggleMobileMenu, theme, toggleTheme } = useUIStore();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get('/notifications/')).data,
  });

  const markReadMutation = useMutation({
    mutationFn: async (notifId: number) => {
      return (await api.patch(`/notifications/${notifId}/read`)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <header
      className="h-14 md:h-18 border-b bg-background/60 flex items-center px-4 md:px-8 justify-between sticky top-0 z-40 backdrop-blur-xl transition-all duration-300"
      role="banner"
    >
      <div className="flex items-center gap-3 md:gap-4">
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="md:hidden p-2.5 -ml-2 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer active:scale-90"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden /> : <Menu className="w-6 h-6" aria-hidden />}
        </button>
        <div className="md:hidden font-black flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-md" aria-hidden>C</div>
          <span className="tracking-tighter">ClassTrack</span>
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
          onClick={toggleTheme}
          className="p-2.5 text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-full hover:bg-muted cursor-pointer active:scale-95"
          aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400 animate-in zoom-in spin-in-90 duration-500" aria-hidden />
          ) : (
            <Moon className="w-5 h-5 text-indigo-400 animate-in zoom-in spin-in-90 duration-500" aria-hidden />
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative p-2.5 text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-full hover:bg-muted cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" aria-hidden />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground ring-2 ring-background">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-y-auto">
            <div className="px-3 py-2 border-b">
              <h3 className="font-semibold text-sm">Notifications</h3>
            </div>
            {isLoading ? (
              <div className="p-6 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No notifications yet.
              </div>
            ) : (
              <div className="py-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors ${!notif.is_read ? 'bg-primary/5' : ''}`}
                    onClick={() => !notif.is_read && markReadMutation.mutate(notif.id)}
                  >
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground/80 mt-1">
                      {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNav;
