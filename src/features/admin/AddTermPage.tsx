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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Calendar, ArrowLeft, Save, 
  Clock, CalendarDays, CheckCircle2, Info, ChevronRight,
  History, PlaneTakeoff, GraduationCap, Flag
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const termSchema = z.object({
  name: z.string().min(3, "Semester designation is required"),
  year: z.string().min(4, "Academic year is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.enum(["Upcoming", "Active", "Completed"]),
});

type TermFormValues = z.infer<typeof termSchema>;

const GlassCard = ({ children, className = "", noHover = false }: { children: React.ReactNode, className?: string, noHover?: boolean }) => (
  <div className={cn(
    "relative overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/60 backdrop-blur-xl shadow-2xl transition-all duration-500 rounded-[2.5rem]",
    !noHover && "hover:shadow-indigo-500/10 hover:border-white/40 dark:hover:border-white/20 hover:-translate-y-1",
    className
  )}>
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-black/20 pointer-events-none" />
    {children}
  </div>
);

const PreviewTermCard = ({ data }: { data: Partial<TermFormValues> }) => (
  <GlassCard className="p-8 w-full max-w-sm sticky top-8 border-indigo-500/30 ring-1 ring-indigo-500/20 group">
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:rotate-6 transition-transform duration-500">
          <Calendar className="w-7 h-7" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className={cn(
            "border px-3 py-1 text-[10px] font-black uppercase tracking-widest whitespace-nowrap",
            data.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : 
            data.status === "Upcoming" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
            "bg-slate-500/10 text-slate-500 border-slate-500/20"
          )}>
            {data.status || "DRAFT"}
          </Badge>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">Timeline v4.0</span>
        </div>
      </div>

      <div className="space-y-2 min-h-[80px]">
        <h3 className="text-2xl font-black tracking-tighter leading-none line-clamp-2">
          {data.name || "Unnamed Term"}
        </h3>
        <p className="font-mono text-[10px] font-black uppercase tracking-widest text-indigo-600">
          🗓️ {data.year || "YEAR-XXXX"} Academic Cycle
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/10 flex flex-col gap-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Launch</span>
          <span className="text-sm font-black truncate">{data.startDate || "TBD"}</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/10 flex flex-col gap-1 text-right">
           <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Conclusion</span>
           <span className="text-sm font-black truncate">{data.endDate || "TBD"}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <div className="w-full h-1 bg-white/10 dark:bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 w-1/2 animate-pulse" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Phased</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
         {[Clock, PlaneTakeoff, GraduationCap].map((Icon, i) => (
           <div key={i} className="aspect-square rounded-xl bg-white/5 dark:bg-black/40 border border-white/5 flex items-center justify-center text-muted-foreground/30">
              <Icon className="w-4 h-4" />
           </div>
         ))}
      </div>
    </div>
  </GlassCard>
);

const AddTermPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<TermFormValues>({
    resolver: zodResolver(termSchema),
    defaultValues: {
      name: "",
      year: "2025/2026",
      startDate: "",
      endDate: "",
      status: "Upcoming",
    }
  });

  const formData = useWatch({ control });

  const onSubmit = async (data: TermFormValues) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Ultra Premium Term Submit:", data);
    toast.success("Timeline Node Integrated!", {
      description: `${data.name} is now part of the master academic calendar.`,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    });
    setIsSubmitting(false);
    navigate("/admin/academic");
  };

  return (
    <div className="relative min-h-[90vh] p-4 md:p-8 overflow-hidden font-sans">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse transition-all duration-1000" />
      <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] -z-10 animate-pulse delay-700 transition-all duration-1000" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-slate-500/5 rounded-full blur-[80px] -z-10 animate-pulse delay-300 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/academic")}
          className="mb-8 text-muted-foreground hover:text-foreground group rounded-xl px-4 py-2 hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Temporal Registry</span>
        </Button>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Main Form Section */}
          <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 backdrop-blur-md">
                    <CalendarDays className="w-5 h-5" />
                 </div>
                 <Badge variant="outline" className="border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 px-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">Academic Timeline</Badge>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-400">
                Timeline Synthesis
              </h1>
              <p className="text-lg font-medium text-muted-foreground/80 max-w-xl leading-relaxed">
                Architect the temporal framework for academic progression within the ClassTrack global registry.
              </p>
            </div>

            <GlassCard className="p-1" noHover>
              <div className="bg-white/5 dark:bg-black/20 p-8 md:p-12 h-full rounded-[inherit]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                  <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
                    {/* Semester Name */}
                    <div className="space-y-3 col-span-2 group">
                      <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 group-focus-within:opacity-100 transition-opacity">Temporal Designation</Label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 group-focus-within:text-indigo-500 transition-colors" />
                        <Input 
                          id="name"
                          placeholder="e.g. Spring Semester 2026" 
                          className={cn(
                            "pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl transition-all duration-300 text-lg font-bold placeholder:text-muted-foreground/30",
                            errors.name && "border-rose-500/50"
                          )}
                          {...register("name")}
                        />
                      </div>
                      {errors.name && <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1"><Info className="w-3 h-3" /> {errors.name.message}</p>}
                    </div>

                    {/* Academic Year */}
                    <div className="space-y-3 group">
                      <Label htmlFor="year" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Cyclical Period</Label>
                      <div className="relative">
                        <History className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors" />
                        <Input 
                          id="year"
                          placeholder="2025/2026" 
                          className={cn(
                            "pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 rounded-2xl transition-all text-lg font-bold",
                            errors.year && "border-rose-500/50"
                          )}
                          {...register("year")}
                        />
                      </div>
                    </div>

                    {/* Operational Status */}
                    <div className="space-y-3">
                      <Label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Lifecycle State</Label>
                      <Select onValueChange={(val: any) => setValue("status", val)} defaultValue="Upcoming">
                        <SelectTrigger className="h-14 bg-white/10 dark:bg-black/40 border-white/10 hover:border-white/20 focus:border-indigo-500/50 rounded-2xl transition-all font-black text-lg">
                          <SelectValue placeholder="Select status..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-white/10 rounded-2xl shadow-2xl p-1">
                          {["Upcoming", "Active", "Completed"].map(s => (
                            <SelectItem key={s} value={s} className="h-12 rounded-xl focus:bg-indigo-500/10 font-bold">
                              {s} Node
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Start Date */}
                    <div className="space-y-3 group">
                       <Label htmlFor="startDate" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Commencement</Label>
                       <div className="relative">
                          <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors z-10" />
                          <Input 
                            type="date"
                            id="startDate"
                            className="pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl transition-all font-bold"
                            {...register("startDate")}
                          />
                       </div>
                    </div>

                    {/* End Date */}
                    <div className="space-y-3 group">
                       <Label htmlFor="endDate" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Conclusion</Label>
                       <div className="relative">
                          <Flag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors z-10" />
                          <Input 
                            type="date"
                            id="endDate"
                            className="pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/5 rounded-2xl transition-all font-bold"
                            {...register("endDate")}
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
                          Indexing Timeline...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <Save className="w-5 h-5" />
                          Commit to Registry
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
          </div>

          {/* Right Preview Section */}
          <div className="hidden xl:flex xl:col-span-4 flex-col gap-8 justify-center min-h-[600px] animate-in slide-in-from-right-12 duration-1000">
             <div className="space-y-2 text-right">
                <h2 className="text-2xl font-black italic tracking-tighter">Temporal Intelligence</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Simulating academic progression in real-time</p>
             </div>
             
             <div className="relative">
                <div className="absolute -top-12 -right-12 w-32 h-32 border border-white/5 rounded-full pointer-events-none animate-pulse" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 border border-white/5 rounded-full pointer-events-none" />
                
                <PreviewTermCard data={formData} />
                
                <div className="mt-8 flex flex-col gap-4 max-w-sm">
                   <div className="flex items-center gap-3 p-4 bg-white/5 dark:bg-black/40 border border-white/10 rounded-2xl backdrop-blur-sm">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                         <Info className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground leading-tight">
                         Term definitions automatically sync with grading periods and attendance tracking loops.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-20 py-10 border-t border-white/5 flex items-center justify-center">
         <div className="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">ClassTrack Registry Core</span>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Temporal Layer v2.0</span>
         </div>
      </footer>
    </div>
  );
};

export default AddTermPage;
