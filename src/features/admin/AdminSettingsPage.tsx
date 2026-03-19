import { useState } from "react";
import { 
  Settings, Shield, Globe, 
  Fingerprint, Terminal,
  CheckCircle2, AlertTriangle, RefreshCw,
  Cpu, Activity, 
  Database as DbIcon, Box, GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const GlassCard = ({ children, className = "", noHover = false }: { children: React.ReactNode, className?: string, noHover?: boolean }) => (
  <div className={cn(
    "relative overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/60 backdrop-blur-xl shadow-2xl transition-all duration-500 rounded-[2.5rem]",
    !noHover && "hover:shadow-primary/10 hover:border-white/40 dark:hover:border-white/20 hover:-translate-y-1",
    className
  )}>
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-black/20 pointer-events-none" />
    {children}
  </div>
);

const SettingSection = ({ title, description, icon: Icon, children }: { title: string, description: string, icon: any, children: React.ReactNode }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-xl font-black tracking-tight">{title}</h3>
        <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed">{description}</p>
      </div>
    </div>
    <div className="grid gap-6">
      {children}
    </div>
  </div>
);

const HealthIndicator = ({ label, status, detail }: { label: string, status: 'online' | 'warning' | 'error', detail: string }) => (
  <div className="p-4 rounded-3xl bg-white/5 dark:bg-black/20 border border-white/10 flex flex-col gap-2">
    <div className="flex items-center justify-between">
       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</span>
       <div className={cn(
         "w-2 h-2 rounded-full animate-pulse",
         status === 'online' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : 
         status === 'warning' ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
       )} />
    </div>
    <span className="text-xs font-black uppercase tracking-tighter">{detail}</span>
  </div>
);

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSyncing, setIsSyncing] = useState(false);

  const categories = [
    { id: "general", label: "Nucleus", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "academic", label: "Academic", icon: GraduationCap },
    { id: "network", label: "Network", icon: Globe },
    { id: "health", label: "Health", icon: Activity },
  ];

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success("Global configurations synchronized!", {
      description: "ClassTrack core has parity with all distributed nodes.",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    });
    setIsSyncing(false);
  };

  return (
    <div className="relative min-h-[90vh] p-4 md:p-8 overflow-hidden font-sans">
      {/* Background Decorative Mesh */}
      <div className="absolute top-[10%] right-[15%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] -z-10 animate-pulse transition-all duration-1000" />
      <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700 transition-all duration-1000" />
      
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20 text-primary backdrop-blur-md">
                   <Settings className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">Administrative Nucleus</Badge>
             </div>
             <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-primary dark:from-white dark:via-slate-200 dark:to-primary">
                System <span className="italic">Orchestration</span>
             </h1>
             <p className="text-xl font-medium text-muted-foreground/80 max-w-2xl leading-relaxed">
                Configure global protocols, infrastructure parity, and system branding for the ClassTrack enterprise ecosystem.
             </p>
          </div>
          <Button 
            onClick={handleSync}
            disabled={isSyncing}
            className="h-16 px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all group overflow-hidden relative"
          >
            <RefreshCw className={cn("w-5 h-5", isSyncing && "animate-spin")} />
            <span>{isSyncing ? "Syncing core..." : "Sync Global State"}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Internal Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-6">
             <GlassCard className="p-2" noHover>
                <div className="flex flex-col gap-1 rounded-[2rem] overflow-hidden">
                   {categories.map((cat) => (
                     <button
                       key={cat.id}
                       onClick={() => setActiveTab(cat.id)}
                       className={cn(
                         "flex items-center gap-4 px-6 py-5 text-sm font-black uppercase tracking-widest transition-all relative group",
                         activeTab === cat.id 
                           ? "bg-primary text-white shadow-xl shadow-primary/20 z-10 rounded-[1.5rem]" 
                           : "text-muted-foreground/60 hover:text-foreground hover:bg-white/10"
                       )}
                     >
                        <cat.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", activeTab === cat.id && "rotate-6")} />
                        {cat.label}
                        {activeTab === cat.id && (
                          <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        )}
                     </button>
                   ))}
                </div>
             </GlassCard>
             
             {/* System Health Quick View */}
             <div className="grid gap-4 px-2">
                <HealthIndicator label="Database Cluster" status="online" detail="Latency: 4ms" />
                <HealthIndicator label="API Microservice" status="online" detail="99.9% Uptime" />
                <HealthIndicator label="Cloud Sync" status="warning" detail="Last sync 4h ago" />
             </div>
          </div>

          {/* Main Setting Area */}
          <div className="lg:col-span-9">
             <GlassCard className="p-1" noHover>
                <div className="bg-white/5 dark:bg-black/20 p-8 md:p-12 h-full rounded-[inherit] min-h-[600px]">
                   {activeTab === "general" && (
                     <SettingSection 
                       title="System Nucleus" 
                       description="Global branding and enterprise deployment parameters."
                       icon={Terminal}
                     >
                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <Label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">Institution Identity</Label>
                             <Input 
                               defaultValue="ClassTrack University of Excellence" 
                               className="h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-primary/50 rounded-2xl transition-all font-black text-lg px-6"
                             />
                          </div>
                          <div className="space-y-4">
                             <Label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">Enterprise Domain</Label>
                             <Input 
                               defaultValue="enterprise.classtrack.edu" 
                               className="h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-primary/50 rounded-2xl transition-all font-bold px-6"
                             />
                          </div>
                          <div className="p-6 rounded-3xl bg-white/5 dark:bg-black/40 border border-white/10 col-span-2 flex items-center justify-between group">
                             <div className="space-y-1">
                                <h4 className="font-bold">Maintenance Core Protocol</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Restrict write access for cluster upgrades</p>
                             </div>
                             <Switch className="data-[state=checked]:bg-rose-500" />
                          </div>
                       </div>
                     </SettingSection>
                   )}

                   {activeTab === "security" && (
                     <SettingSection 
                       title="Security Protocols" 
                       description="Manage authentication vectors and data protection clusters."
                       icon={Shield}
                     >
                       <div className="space-y-8">
                          <div className="grid gap-6">
                             {[
                               { title: "Multi-Factor Authentication", desc: "Require dual-layer validation for all administrative staff", icon: Fingerprint, defaultOn: true },
                               { title: "Session Persistence Tuning", desc: "Auto-decommission inactive session tokens after 30 mins", icon: RefreshCw, defaultOn: true },
                               { title: "Audit Log Streaming", desc: "Stream interaction metadata to external security clusters", icon: Activity, defaultOn: false },
                               { title: "IP Whitelisting", desc: "Enforce network boundary for super-admin access", icon: Globe, defaultOn: false },
                             ].map((item, i) => (
                               <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 dark:bg-black/40 border border-white/10 hover:border-primary/20 transition-all group">
                                  <div className="flex gap-4">
                                     <div className="p-3 bg-white/5 rounded-2xl text-muted-foreground group-hover:text-primary transition-colors">
                                        <item.icon className="w-5 h-5" />
                                     </div>
                                     <div className="space-y-1">
                                        <h4 className="font-black tracking-tight">{item.title}</h4>
                                        <p className="text-[10px] font-bold text-muted-foreground leading-tight">{item.desc}</p>
                                     </div>
                                  </div>
                                  <Switch defaultChecked={item.defaultOn} />
                               </div>
                             ))}
                          </div>
                          <div className="p-8 rounded-3xl bg-rose-500/5 border border-rose-500/20 flex flex-col md:flex-row items-center gap-6 justify-between">
                             <div className="flex gap-4 items-center">
                                <AlertTriangle className="w-8 h-8 text-rose-500 animate-pulse" />
                                <div className="space-y-1 text-center md:text-left">
                                   <h4 className="font-black text-rose-500 uppercase tracking-tighter">Emergency Purge Mode</h4>
                                   <p className="text-[10px] font-bold opacity-60">Revoke all active tokens and lock down system core immediately.</p>
                                </div>
                             </div>
                             <Button variant="destructive" className="rounded-2xl px-8 h-12 font-black uppercase text-[10px] tracking-widest bg-rose-500 hover:bg-rose-600">Execute Purge</Button>
                          </div>
                       </div>
                     </SettingSection>
                   )}

                   {activeTab === "academic" && (
                     <SettingSection 
                       title="Academic Orbs" 
                       description="Configure underlying educational logic and scheduling loops."
                       icon={GraduationCap}
                     >
                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                             <Label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Default Session Window</Label>
                             <div className="flex items-center justify-between">
                                <span className="text-4xl font-black">60m</span>
                                <div className="flex gap-2">
                                   <Button variant="ghost" className="w-10 h-10 rounded-xl bg-white/5"> - </Button>
                                   <Button variant="ghost" className="w-10 h-10 rounded-xl bg-white/5"> + </Button>
                                </div>
                             </div>
                             <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">System-wide default for new lecture sessions.</p>
                          </div>
                          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                             <Label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Geospatial Radius</Label>
                             <div className="flex items-center justify-between">
                                <span className="text-4xl font-black">50m</span>
                                <div className="flex gap-2">
                                   <Button variant="ghost" className="w-10 h-10 rounded-xl bg-white/5"> - </Button>
                                   <Button variant="ghost" className="w-10 h-10 rounded-xl bg-white/5"> + </Button>
                                </div>
                             </div>
                             <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">Enforced geofence boundary for student scanning.</p>
                          </div>
                       </div>
                     </SettingSection>
                   )}

                   {activeTab === "health" && (
                     <SettingSection 
                       title="Infrastructure Parity" 
                       description="Detailed telemetry from the distributed enterprise clusters."
                       icon={Cpu}
                     >
                        <div className="space-y-8">
                           <div className="grid md:grid-cols-3 gap-6">
                              {[
                                { label: "CPU Load", value: "14%", icon: Cpu, color: "text-emerald-500" },
                                { label: "RAM Usage", value: "2.4 GB", icon: Box, color: "text-amber-500" },
                                { label: "Disk Health", value: "92%", icon: DbIcon, color: "text-indigo-500" },
                              ].map((stat, i) => (
                                <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center gap-3">
                                   <stat.icon className={cn("w-8 h-8 opacity-40", stat.color)} />
                                   <span className="text-3xl font-black">{stat.value}</span>
                                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</span>
                                </div>
                              ))}
                           </div>
                           
                           <div className="p-8 rounded-[2rem] bg-slate-900 border border-white/10 overflow-hidden relative font-mono text-xs text-emerald-400 group">
                              <div className="absolute top-4 left-4 p-2 bg-white/5 rounded-lg text-white/20 uppercase tracking-widest text-[9px] font-black">Live Console</div>
                              <div className="pt-8 space-y-2 opacity-80">
                                 <p className="flex items-center gap-2 animate-in slide-in-from-left duration-300"><span className="text-primary">&gt;</span> Checking academic parity...</p>
                                 <p className="flex items-center gap-2 animate-in slide-in-from-left duration-500 delay-100"><span className="text-primary">&gt;</span> Term nodes synchronized (v21.4)</p>
                                 <p className="flex items-center gap-2 animate-in slide-in-from-left duration-700 delay-200"><span className="text-primary">&gt;</span> Cluster B reporting optimized latency</p>
                                 <p className="flex items-center gap-2 animate-in slide-in-from-left duration-1000 delay-300"><span className="text-yellow-500">!</span> Cloud sync latency detected at node-west-2</p>
                                 <p className="flex items-center gap-2 animate-in slide-in-from-left duration-1000 delay-500"><span className="text-primary">&gt;</span> System operating at optimal delta.</p>
                              </div>
                              <div className="mt-8 flex justify-end">
                                 <div className="px-3 py-1 bg-emerald-500/10 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    REAL-TIME TELEMETRY
                                 </div>
                              </div>
                           </div>
                        </div>
                     </SettingSection>
                   )}
                </div>
             </GlassCard>
          </div>
        </div>
      </div>

      <footer className="mt-20 py-10 border-t border-white/5 flex items-center justify-center">
         <div className="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">ClassTrack Nucleus Hub</span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Infrastructure Core v4.0.2</span>
         </div>
      </footer>
    </div>
  );
};

export default AdminSettingsPage;
