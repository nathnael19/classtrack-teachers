import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Search, Plus, MoreHorizontal, Pencil, 
  Users, Shield,
  Download, Mail, Calendar, 
  ShieldAlert, Lock as LockIcon, Zap, BarChart3, Fingerprint,
  TrendingUp, ArrowUpRight
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



const AnimatedNumber = ({ value }: { value: number | string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
  
  useEffect(() => {
    let start = 0;
    const end = numericValue;
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
  }, [numericValue]);
  
  return <span>{typeof value === 'string' ? value.replace(/[0-9.]+/, displayValue.toLocaleString()) : displayValue.toLocaleString()}</span>;
};

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  noHover?: boolean;
  style?: React.CSSProperties;
}

const GlassCard = ({ children, className = "", noHover = false, style = {} }: GlassCardProps) => (
  <div 
    className={cn(
      "relative overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl transition-all duration-500 rounded-[2.5rem]",
      !noHover && "hover:shadow-primary/10 hover:border-white/40 dark:hover:border-white/20 hover:-translate-y-1.5 hover:scale-[1.01]",
      className
    )}
    style={style}
  >
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-black/20 pointer-events-none" />
    <div className="relative z-10 h-full">
      {children}
    </div>
  </div>
);

import api from "@/services/api";

const UsersManagementPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params: any = {
          skip: 0,
          limit: 100,
        };
        if (activeTab !== "all") {
          params.role = activeTab;
        }
        if (searchTerm) {
          params.q = searchTerm;
        }
        
        const response = await api.get("/users/", { params });
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch identities:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [activeTab, searchTerm]);

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you absolutely sure you want to purge the identity of ${userName}? This action is irreversible in the current temporal drift.`)) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      toast.success(`${userName} has been purged from the identity cluster.`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error: any) {
      console.error("Failed to purge identity:", error);
      toast.error(error.response?.data?.detail || "Purge failed. Shielding active.");
    }
  };

  const handleEditUser = (userId: string) => {
    toast.info("Neural link established. Redirecting to edit portal...");
    navigate(`/admin/users/edit/${userId}`); 
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  return (
    <div className="relative space-y-10 font-sans p-4 mb-20">
      {/* Immersive Background */}
      <div className="fixed inset-0 overflow-hidden -z-20 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[5%] right-[5%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px] animate-pulse transition-all duration-[4000ms]" />
      </div>

      {/* Header / Command Center */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4 border-b border-white/10">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Fingerprint className="w-5 h-5 text-purple-500" />
             </div>
             <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase opacity-60">
                IDENTITY://GOVERNANCE_HUB
             </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-600 dark:from-white dark:via-purple-300 dark:to-indigo-400 leading-none">
            Identity Nucleus
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-xl">
            Managing <span className="text-foreground font-black italic">Population Vector</span> and autonomous lifecycle governance for ClassTrack entities.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl h-12 border-white/20 backdrop-blur-xl bg-white/5 hover:bg-white/10 font-black uppercase tracking-widest text-[10px] px-6">
            <Download className="w-4 h-4 mr-2 opacity-60" /> Export Array
          </Button>
          <Button 
            onClick={() => navigate("/admin/users/new")}
            className="rounded-2xl h-12 bg-purple-600 hover:bg-purple-700 text-white shadow-2xl shadow-purple-500/20 font-black uppercase tracking-widest text-[10px] px-8"
          >
            <Plus className="w-4 h-4 mr-2" /> Initialize Identity
          </Button>
        </div>
      </div>

      {/* Bento Stats Matrix */}
      <div className="grid grid-cols-12 gap-6">
        <GlassCard className="col-span-12 md:col-span-6 lg:col-span-3 p-8 flex flex-col justify-between" noHover>
           <div className="flex justify-between items-start">
              <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-inner">
                 <Users className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-500">
                 <TrendingUp className="w-3 h-3" /> +14.2%
              </div>
           </div>
           <div className="mt-6 space-y-1">
              <p className="text-4xl font-black tracking-tighter italic"><AnimatedNumber value={users.length} /></p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Live Population Index</p>
           </div>
        </GlassCard>

        <GlassCard className="col-span-12 md:col-span-6 lg:col-span-3 p-8 flex flex-col justify-between" noHover>
           <div className="flex justify-between items-start">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-inner">
                 <BarChart3 className="w-6 h-6 text-emerald-500" />
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-none rounded-lg font-black text-[9px] px-2">99.8% UPTIME</Badge>
           </div>
           <div className="mt-6 space-y-1">
              <p className="text-4xl font-black tracking-tighter italic"><AnimatedNumber value={842} /></p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Active Session Threads</p>
           </div>
        </GlassCard>

        <GlassCard className="col-span-12 lg:col-span-6 p-8 relative overflow-hidden group" noHover>
           <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2" />
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                       <ShieldAlert className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                       <h3 className="text-lg font-black tracking-tight leading-none">Security Vector</h3>
                       <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest opacity-60">Threat Mitigation Overlay</p>
                    </div>
                 </div>
                 <Badge variant="outline" className="border-rose-500/20 bg-rose-500/5 text-rose-500 font-mono text-[9px] px-2 py-1">SYS://ALERTS_CLEAN</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mt-6 pt-6 border-t border-white/10">
                 <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">MFA Adoption</span>
                    <p className="text-2xl font-black tracking-tighter italic">92.4%</p>
                    <div className="h-1 w-full bg-white/10 rounded-full mt-2">
                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92.4%' }} />
                    </div>
                 </div>
                 <div className="space-y-1 text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Auth Failures</span>
                    <p className="text-2xl font-black tracking-tighter italic font-mono">0.02%</p>
                    <div className="h-1 w-full bg-white/10 rounded-full mt-2">
                       <div className="h-full bg-rose-500 rounded-full ml-auto" style={{ width: '5%' }} />
                    </div>
                 </div>
              </div>
           </div>
        </GlassCard>
      </div>

      {/* Table Interface Container */}
      <GlassCard className="border-white/10" noHover>
        <div className="p-8 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white/5 dark:bg-black/20">
          <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 p-1 rounded-2xl border border-white/10 shadow-inner">
            {["all", "student", "lecturer", "admin"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  activeTab === tab 
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
            <input 
              placeholder="Search identity cluster..." 
              className="w-full pl-12 h-12 bg-white/10 dark:bg-black/30 border border-white/10 focus:border-purple-500/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/5 transition-all font-bold placeholder:opacity-30 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="font-black text-[9px] uppercase tracking-[0.3em] text-muted-foreground py-6 pl-10">Identity Metadata</TableHead>
                <TableHead className="font-black text-[9px] uppercase tracking-[0.3em] text-muted-foreground py-6">Governance Role</TableHead>
                <TableHead className="font-black text-[9px] uppercase tracking-[0.3em] text-muted-foreground py-6">Live Status</TableHead>
                <TableHead className="font-black text-[9px] uppercase tracking-[0.3em] text-muted-foreground py-6">Temporal Node</TableHead>
                <TableHead className="font-black text-[9px] uppercase tracking-[0.3em] text-muted-foreground py-6 pr-10 text-right">Matrix Ops</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-64 border-none">
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-4">
                       <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                       <span className="text-lg font-black tracking-tighter italic opacity-40">Synchronizing Identity Cluster...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-64 border-none">
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-4">
                       <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 animate-pulse">
                          <Zap className="w-8 h-8 opacity-20" />
                       </div>
                       <span className="text-lg font-black tracking-tighter italic opacity-40">Null Results in Search Space</span>
                       <Button variant="link" onClick={() => {setSearchTerm(""); setActiveTab("all");}} className="text-purple-500 font-bold uppercase tracking-widest text-[10px]">Refresh Local Cluster</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: any, idx: number) => (
                  <TableRow 
                    key={user.id} 
                    className="group border-white/5 hover:bg-white/[0.05] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'both' }}
                  >
                    <TableCell className="py-6 pl-10">
                       <div className="flex items-center gap-5">
                          <div className="relative">
                             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-[1px] shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                                <div className="w-full h-full rounded-[15px] bg-white dark:bg-slate-900 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs font-black uppercase">
                                  {getInitials(user.name)}
                                </div>
                             </div>
                             <div className={cn(
                               "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-black shadow-lg shadow-emerald-500/20 transition-all duration-700",
                               user.status === 'Active' ? 'bg-emerald-500 scale-100 opacity-100' : 'scale-0 opacity-0'
                             )} />
                          </div>
                          <div className="flex flex-col gap-0.5">
                             <div className="flex items-center gap-2">
                                <span className="text-base font-black tracking-tighter text-foreground group-hover:text-purple-500 transition-colors uppercase">{user.name}</span>
                                {user.role === 'admin' && <Shield className="w-3 h-3 text-amber-500" />}
                             </div>
                             <div className="flex items-center gap-2 text-muted-foreground font-mono text-[10px] opacity-40">
                                <Mail className="w-3 h-3" />
                                <span>{user.email.toUpperCase()}</span>
                             </div>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none transition-all duration-500 group-hover:shadow-lg",
                        user.role === 'admin' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-amber-500/20' :
                        user.role === 'lecturer' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-purple-500/20' :
                        'bg-slate-500/10 text-slate-500 group-hover:bg-slate-500/20 shadow-slate-500/10'
                      )}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                             <span className={cn(
                               "w-1.5 h-1.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]",
                               user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                             )} />
                             <span className={cn(
                               "text-[10px] font-black uppercase tracking-widest",
                               user.status === 'Active' ? 'text-emerald-500' : 'text-slate-500'
                             )}>{user.status}</span>
                          </div>
                          <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 opacity-20" style={{ width: user.status === 'Active' ? '100%' : '0%' }} />
                          </div>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="space-y-1">
                          <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-60">
                             <Calendar className="w-3.5 h-3.5 opacity-40" />
                             <span>{user.joined}</span>
                          </div>
                          <p className="text-[9px] font-mono text-purple-500/60 font-black italic">Ref: NODE_{user.id}x92</p>
                       </div>
                    </TableCell>
                    <TableCell className="text-right pr-10">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditUser(user.id)}
                            className="h-10 w-10 rounded-2xl hover:bg-white/10 hover:text-purple-500 transition-all shadow-inner border border-transparent hover:border-white/10"
                          >
                             <Pencil className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-10 w-10 p-0 rounded-2xl hover:bg-white/10 transition-all shadow-inner border border-transparent hover:border-white/10">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px] bg-white/40 dark:bg-black/80 backdrop-blur-2xl border-white/10 rounded-[2rem] p-3 shadow-2xl animate-in zoom-in-95 duration-300">
                              <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-[0.3em] px-3 opacity-30 pb-3">Identity Vector Ops</DropdownMenuLabel>
                              <DropdownMenuItem className="rounded-[1.25rem] h-11 gap-3 cursor-pointer focus:bg-purple-500/10 focus:text-purple-500 transition-all mb-1 px-4">
                                <LockIcon className="w-4 h-4 text-amber-500" />
                                <span className="font-black text-[10px] uppercase tracking-widest">Rotate Keys</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-[1.25rem] h-11 gap-3 cursor-pointer focus:bg-purple-500/10 focus:text-purple-500 transition-all mb-1 px-4">
                                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                <span className="font-black text-[10px] uppercase tracking-widest">Elevate Perms</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10 my-2" />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                className="rounded-[1.25rem] h-11 gap-3 cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-600 transition-all px-4"
                              >
                                <ShieldAlert className="w-4 h-4" />
                                <span className="font-black text-[10px] uppercase tracking-widest italic">Purge Identity</span>
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
