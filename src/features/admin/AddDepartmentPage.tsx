import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, ArrowLeft, Save, 
  MapPin, User, CheckCircle2, Info, ChevronRight,
  TrendingUp, Globe, Shield, FileText
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import api from "@/services/api";

const deptSchema = z.object({
  name: z.string().min(3, "Department name must be at least 3 characters"),
  head: z.string().min(3, "Head of Department is required"),
  location: z.string().min(2, "Location is required"),
  description: z.string().optional(),
});

type DeptFormValues = z.infer<typeof deptSchema>;

const GlassCard = ({ children, className = "", noHover = false }: { children: React.ReactNode, className?: string, noHover?: boolean }) => (
  <div className={cn(
    "relative overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/60 backdrop-blur-xl shadow-2xl transition-all duration-500 rounded-[2.5rem]",
    !noHover && "hover:shadow-amber-500/10 hover:border-white/40 dark:hover:border-white/20 hover:-translate-y-1",
    className
  )}>
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-black/20 pointer-events-none" />
    {children}
  </div>
);

const PreviewDeptCard = ({ data }: { data: Partial<DeptFormValues> }) => (
  <GlassCard className="p-8 w-full max-w-sm sticky top-8 border-amber-500/30 ring-1 ring-amber-500/20 group">
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:rotate-6 transition-transform duration-500">
          <Building2 className="w-7 h-7" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
            Orbital Preview
          </Badge>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">Org Node v2.4</span>
        </div>
      </div>

      <div className="space-y-2 min-h-[80px]">
        <h3 className="text-2xl font-black tracking-tighter leading-none line-clamp-2">
          {data.name || "Unnamed Department"}
        </h3>
        <p className="font-mono text-[10px] font-black uppercase tracking-widest text-indigo-600">
          📍 {data.location || "Location Pending"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/10 flex flex-col gap-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">H.O.D</span>
          <span className="text-sm font-black truncate">{data.head || "TBD"}</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/10 flex flex-col gap-1 text-right">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Hierarchy</span>
          <span className="text-lg font-black text-indigo-500 italic">NEW</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-amber-600/5 dark:bg-amber-400/5 border border-amber-500/10">
        <p className="text-[11px] font-bold text-muted-foreground/80 leading-relaxed line-clamp-3 italic">
          {data.description || "The organizational vision and mission statement for this faculty node will manifest here..."}
        </p>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <div className="w-full h-1 bg-white/10 dark:bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 w-1/4 animate-pulse" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Indexing</span>
      </div>
    </div>
  </GlassCard>
);

const AddDepartmentPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DeptFormValues>({
    resolver: zodResolver(deptSchema),
    defaultValues: {
      name: "",
      head: "",
      location: "",
      description: "",
    }
  });

  const formData = useWatch({ control });

  const onSubmit = async (data: DeptFormValues) => {
    setIsSubmitting(true);
    try {
      await api.post('/departments/', { name: data.name });
      toast.success("Department Node Synthesized!", {
        description: `${data.name} is now registered in the academic infrastructure.`,
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      });
      navigate("/admin/academic");
    } catch (error: any) {
      toast.error("Synthesis Failed", { description: error?.response?.data?.detail || "Could not register department." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] p-4 md:p-8 overflow-hidden font-sans">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -z-10 animate-pulse transition-all duration-1000" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 animate-pulse delay-700 transition-all duration-1000" />
      <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] -z-10 animate-pulse delay-300 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/academic")}
          className="mb-8 text-muted-foreground hover:text-foreground group rounded-xl px-4 py-2 hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Academic Infrastructure</span>
        </Button>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Main Form Section */}
          <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 backdrop-blur-md">
                    <Building2 className="w-5 h-5" />
                 </div>
                 <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5 px-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">Administrative Node</Badge>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-amber-600 dark:from-white dark:via-slate-200 dark:to-amber-400">
                Department Synthesis
              </h1>
              <p className="text-lg font-medium text-muted-foreground/80 max-w-xl leading-relaxed">
                Configure organizational hierarchies and departmental infrastructure with ClassTrack's professional suite.
              </p>
            </div>

            <GlassCard className="p-1" noHover>
              <div className="bg-white/5 dark:bg-black/20 p-8 md:p-12 h-full rounded-[inherit]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                  <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
                    {/* Dept Name */}
                    <div className="space-y-3 col-span-2 group">
                      <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 group-focus-within:opacity-100 transition-opacity">Department Designation</Label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 group-focus-within:text-amber-500 transition-colors" />
                        <Input 
                          id="name"
                          placeholder="e.g. Faculty of Theoretical Physics" 
                          className={cn(
                            "pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 rounded-2xl transition-all duration-300 text-lg font-bold placeholder:text-muted-foreground/30",
                            errors.name && "border-rose-500/50"
                          )}
                          {...register("name")}
                        />
                      </div>
                      {errors.name && <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1"><Info className="w-3 h-3" /> {errors.name.message}</p>}
                    </div>

                    {/* HOD */}
                    <div className="space-y-3 group">
                      <Label htmlFor="head" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Directorship</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors" />
                        <Input 
                          id="head"
                          placeholder="Dr. Julian Casablancas" 
                          className={cn(
                            "pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl transition-all text-lg font-bold",
                            errors.head && "border-rose-500/50"
                          )}
                          {...register("head")}
                        />
                      </div>
                      {errors.head && <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1"><Info className="w-3 h-3" /> {errors.head.message}</p>}
                    </div>

                    {/* Location */}
                    <div className="space-y-3 group text-right md:text-left">
                      <Label htmlFor="location" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Spatial Coordinates</Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors" />
                        <Input 
                          id="location"
                          placeholder="e.g. Science Block, Level 4" 
                          className={cn(
                            "pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl transition-all text-lg font-bold",
                            errors.location && "border-rose-500/50"
                          )}
                          {...register("location")}
                        />
                      </div>
                      {errors.location && <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1"><Info className="w-3 h-3" /> {errors.location.message}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-3 col-span-2 group">
                      <Label htmlFor="description" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Mission Statement</Label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-4 h-5 w-5 text-muted-foreground/50 group-focus-within:text-indigo-500 transition-colors" />
                        <textarea 
                          id="description"
                          rows={4}
                          placeholder="Articulate the department's strategic vision and core objectives..."
                          className="w-full pl-12 pt-4 bg-white/10 dark:bg-black/40 border-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl transition-all resize-none text-base font-bold placeholder:text-muted-foreground/30"
                          {...register("description")}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 flex flex-col md:flex-row gap-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-[1.25rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all overflow-hidden relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Mapping Node...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3 uppercase">
                          <Save className="w-5 h-5" />
                          Commit To Infrastructure
                        </div>
                      )}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      className="px-8 h-16 bg-white/5 dark:bg-black/20 border-white/10 hover:border-white/20 rounded-[1.25rem] font-black uppercase tracking-[0.2em] transition-all group flex items-center gap-2"
                    >
                       <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </form>
              </div>
            </GlassCard>

            <div className="grid grid-cols-3 gap-6">
               {[
                 { label: "Stability", value: "99.9%", icon: Shield, color: "text-emerald-500" },
                 { label: "Global Presence", value: "Syncing", icon: Globe, color: "text-blue-500" },
                 { label: "KPI Projected", value: "+12.4%", icon: TrendingUp, color: "text-amber-500" }
               ].map((stat, i) => (
                 <div key={i} className="flex flex-col gap-1 px-2 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${Stat_Delay(i)}ms` }}>
                    <div className="flex items-center gap-2">
                       <stat.icon className={cn("w-3.5 h-3.5", stat.color)} />
                       <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</span>
                    </div>
                    <span className="text-sm font-black">{stat.value}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Right Preview Section */}
          <div className="hidden xl:flex xl:col-span-4 flex-col gap-8 justify-center min-h-[600px] animate-in slide-in-from-right-12 duration-1000">
             <div className="space-y-2 text-right">
                <h2 className="text-2xl font-black italic tracking-tighter">Node Intelligence</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Simulating organizational topology in real-time</p>
             </div>
             
             <div className="relative">
                <div className="absolute -top-12 -right-12 w-32 h-32 border border-white/5 rounded-full pointer-events-none animate-pulse" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 border border-white/5 rounded-full pointer-events-none" />
                
                <PreviewDeptCard data={formData} />
                
                <div className="mt-8 flex flex-col gap-4 max-w-sm">
                   <div className="flex items-center gap-3 p-4 bg-white/5 dark:bg-black/40 border border-white/10 rounded-2xl backdrop-blur-sm">
                      <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                         <Info className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground leading-tight">
                         Departmental hierarchies define user permissions and resource allocation globally.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-20 py-10 border-t border-white/5 flex items-center justify-center">
         <div className="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">ClassTrack Admin Hub</span>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Logic Layer v2.4</span>
         </div>
      </footer>
    </div>
  );
};

const Stat_Delay = (i: number) => 800 + (i * 150);

export default AddDepartmentPage;
