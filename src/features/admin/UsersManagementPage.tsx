import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Plus, MoreHorizontal, Pencil, Trash2, 
  Users, UserCheck, UserX, Shield, Filter, 
  Download, Mail, Calendar, CheckCircle2, Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const initialUsers = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "student", status: "Active", joined: "2024-01-15" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "lecturer", status: "Active", joined: "2024-02-10" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "student", status: "Inactive", joined: "2024-03-05" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", role: "admin", status: "Active", joined: "2023-12-20" },
  { id: "5", name: "Eve Davis", email: "eve@example.com", role: "lecturer", status: "Active", joined: "2024-01-22" },
];

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{displayValue.toLocaleString()}</span>;
};

const GlassCard = ({ children, className = "", noHover = false }: { children: React.ReactNode, className?: string, noHover?: boolean }) => (
  <Card className={cn(
    "relative overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md shadow-xl transition-all duration-500",
    !noHover && "hover:shadow-2xl hover:bg-white/50 dark:hover:bg-black/50 hover:border-white/40 dark:hover:border-white/20",
    className
  )}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent pointer-events-none" />
    {children}
  </Card>
);

const UsersManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [users] = useState(initialUsers);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || u.role === activeTab;
    return matchesSearch && matchesTab;
  });

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  return (
    <div className="relative space-y-8 font-sans p-2">
      {/* Background Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] -z-10 pointer-events-none animate-pulse" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-400">
            User Directory
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            Centralized identity management for the ClassTrack network
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-2xl h-11 border-white/20 hover:bg-white/40">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-11 px-6 shadow-lg shadow-indigo-500/30">
            <Plus className="w-4 h-4 mr-2" /> Add New User
          </Button>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid gap-6 md:grid-cols-4">
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-2xl">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter"><AnimatedNumber value={users.length} /></span>
            <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Total Population</span>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl">
            <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter"><AnimatedNumber value={4} /></span>
            <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Active nodes</span>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-2xl">
            <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter"><AnimatedNumber value={1} /></span>
            <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Admins</span>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4 border-rose-500/20">
          <div className="p-3 bg-rose-500/10 rounded-2xl">
            <UserX className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-rose-500 italic"><AnimatedNumber value={1} /></span>
            <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Inactive</span>
          </div>
        </GlassCard>
      </div>

      {/* Table Container */}
      <GlassCard className="border-white/10 overflow-visible" noHover>
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/10 dark:bg-black/10">
          <div className="flex items-center gap-2 bg-white/20 dark:bg-black/40 p-1 rounded-2xl border border-white/10 shadow-inner">
            {["all", "student", "lecturer", "admin"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === tab 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-10 h-11 bg-white/30 dark:bg-black/30 border-white/10 focus:border-indigo-500/50 rounded-2xl backdrop-blur-md transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-5 pl-8">Identity</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-5">Role</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-5">Status</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-5">Onboarded</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-5 pr-8 text-right">Operations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-48">
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-2 animate-in fade-in zoom-in duration-500">
                       <Search className="w-12 h-12 opacity-20 mb-2" />
                       <span className="text-sm font-bold tracking-tight">No results matched your search</span>
                       <Button variant="link" onClick={() => {setSearchTerm(""); setActiveTab("all");}} className="text-indigo-500">Reset Filters</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, idx) => (
                  <TableRow 
                    key={user.id} 
                    className="group border-white/5 hover:bg-indigo-500/[0.03] transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
                  >
                    <TableCell className="py-4 pl-8">
                       <div className="flex items-center gap-4">
                          <div className="relative group-hover:scale-110 transition-transform duration-500">
                             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[12px] font-black shadow-lg shadow-indigo-500/20 uppercase">
                               {getInitials(user.name)}
                             </div>
                             <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
                          </div>
                          <div className="flex flex-col min-w-0">
                             <span className="text-sm font-black tracking-tight text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{user.name}</span>
                             <div className="flex items-center gap-2 text-muted-foreground/60">
                                <Mail className="w-3 h-3" />
                                <span className="text-[11px] font-bold truncate">{user.email}</span>
                             </div>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest border-2",
                        user.role === 'admin' ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        user.role === 'lecturer' ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                        'border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400'
                      )}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            user.status === 'Active' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-400'
                          )} />
                          <span className={cn(
                            "text-xs font-black uppercase tracking-tighter",
                            user.status === 'Active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
                          )}>{user.status}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2 text-muted-foreground/60 text-xs font-bold">
                          <Calendar className="w-3.5 h-3.5 opacity-50" />
                          <span>{user.joined}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                       <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 hover:text-primary transition-all">
                             <Pencil className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-all">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px] bg-white/80 dark:bg-black/80 backdrop-blur-xl border-white/20 rounded-[1.25rem] p-2 shadow-2xl">
                              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] px-2 opacity-50 pb-2">Quick Commands</DropdownMenuLabel>
                              <DropdownMenuItem className="rounded-lg h-10 gap-3 cursor-pointer focus:bg-indigo-500/10">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="font-bold text-xs">Verify User</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg h-10 gap-3 cursor-pointer focus:bg-indigo-500/10">
                                <Clock className="w-4 h-4 text-blue-500" />
                                <span className="font-bold text-xs">View Logs</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10 my-1" />
                              <DropdownMenuItem className="rounded-lg h-10 gap-3 cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-600">
                                <Trash2 className="w-4 h-4" />
                                <span className="font-bold text-xs">Purge Profile</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </GlassCard>
    </div>
  );
};

export default UsersManagementPage;
