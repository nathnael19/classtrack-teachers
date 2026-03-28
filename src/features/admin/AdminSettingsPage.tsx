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
import { GlassCard } from "@/components/ui/glass-card";

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
    { id: "general", label: "General", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "academic", label: "Academic", icon: GraduationCap },
    { id: "network", label: "Network", icon: Globe },
    { id: "health", label: "Health", icon: Activity },
  ];

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success("Settings updated successfully!", {
      description: "Your changes have been applied across the system.",
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
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">Admin Settings</Badge>
             </div>
             <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-primary dark:from-white dark:via-slate-200 dark:to-primary">
                System <span className="italic">Settings</span>
             </h1>
             <p className="text-xl font-medium text-muted-foreground/80 max-w-2xl leading-relaxed">
                Manage system branding, security protocols, and academic configurations.
             </p>
          </div>
          <Button 
            onClick={handleSync}
            disabled={isSyncing}
            className="h-16 px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all group overflow-hidden relative"
          >
            <RefreshCw className={cn("w-5 h-5", isSyncing && "animate-spin")} />
            <span>{isSyncing ? "Updating..." : "Sync Settings"}</span>
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
                       title="General Settings" 
                       description="Manage your institution's name and domain settings."
                       icon={Terminal}
                     >
                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <Label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">Institution Name</Label>
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
                                <h4 className="font-bold">Maintenance Mode</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Temporary disable updates during maintenance</p>
                             </div>
                             <Switch className="data-[state=checked]:bg-rose-500" />
                          </div>
                       </div>
                     </SettingSection>
                   )}

                   {activeTab === "security" && (
                     <SettingSection 
                       title="Security Settings" 
                       description="Manage authentication and data protection."
                       icon={Shield}
                     >
                       <div className="space-y-8">
                          <div className="grid gap-6">
                             {[
                               { title: "Two-Factor Authentication (2FA)", desc: "Require two-step verification for all administrative staff", icon: Fingerprint, defaultOn: true },
                               { title: "Session Timeout", desc: "Automatically log out inactive users after 30 minutes", icon: RefreshCw, defaultOn: true },
                               { title: "Live Audit Logs", desc: "Send system logs to external monitoring services", icon: Activity, defaultOn: false },
                               { title: "IP Restrictions", desc: "Restrict admin access to specific IP addresses", icon: Globe, defaultOn: false },
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
                                   <h4 className="font-black text-rose-500 uppercase tracking-tighter">Emergency Lockdown</h4>
                                   <p className="text-[10px] font-bold opacity-60">Instantly log out all users and disable system access.</p>
                                </div>
                             </div>
                             <Button variant="destructive" className="rounded-2xl px-8 h-12 font-black uppercase text-[10px] tracking-widest bg-rose-500 hover:bg-rose-600">Lockdown System</Button>
                          </div>
                       </div>
                     </SettingSection>
                   )}

                   {activeTab === "academic" && (
                     <SettingSection 
                       title="Academic Settings" 
                       description="Manage lecture durations and attendance scanning rules."
                       icon={GraduationCap}
                     >
                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                             <Label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Default Session Duration</Label>
                             <div className="flex items-center justify-between">
                                <span className="text-4xl font-black">60m</span>
                                <div className="flex gap-2">
                                   <Button variant="ghost" className="w-10 h-10 rounded-xl bg-white/5"> - </Button>
                                   <Button variant="ghost" className="w-10 h-10 rounded-xl bg-white/5"> + </Button>
                                </div>
                             </div>
                             <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">Set the standard duration for new classes.</p>
                          </div>
                          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                             <Label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Attendance Radius</Label>
                             <div className="flex items-center justify-between">
                                <span className="text-4xl font-black">50m</span>
                                <div className="flex gap-2">
                                   <Button variant="ghost" className="w-10 h-10 rounded-xl bg-white/5"> - </Button>
                                   <Button variant="ghost" className="w-10 h-10 rounded-xl bg-white/5"> + </Button>
                                </div>
                             </div>
                             <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">Set the maximum distance for valid attendance check-ins.</p>
                          </div>
                       </div>
                     </SettingSection>
                   )}

                   {activeTab === "health" && (
                     <SettingSection 
                       title="System Health" 
                       description="Detailed telemetry from the system performance."
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
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">ClassTrack Admin</span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">System Version 4.0.2</span>
         </div>
      </footer>
    </div>
  );
};

export default AdminSettingsPage;
