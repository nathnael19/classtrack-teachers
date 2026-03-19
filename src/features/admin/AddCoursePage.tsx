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
  BookOpen, ArrowLeft, Save, Sparkles, 
  Layers, GraduationCap, Clock, FileText,
  CheckCircle2, Info, ChevronRight, Zap
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const courseSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters"),
  code: z.string().min(3, "Course code must be at least 3 characters").max(10),
  credits: z.string().min(1, "Credits are required"),
  department: z.string().min(1, "Department is required"),
  description: z.string().optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

const GlassCard = ({ children, className = "", noHover = false }: { children: React.ReactNode, className?: string, noHover?: boolean }) => (
  <div className={cn(
    "relative overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/60 backdrop-blur-xl shadow-2xl transition-all duration-500 rounded-[2.5rem]",
    !noHover && "hover:shadow-indigo-500/10 hover:border-white/40 dark:hover:border-white/20 hover:-translate-y-1",
    className
  )}>
    {/* Subtle Noise Texture */}
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-black/20 pointer-events-none" />
    {children}
  </div>
);

const PreviewCourseCard = ({ data }: { data: Partial<CourseFormValues> }) => (
  <GlassCard className="p-8 w-full max-w-sm sticky top-8 border-indigo-500/30 ring-1 ring-indigo-500/20 group">
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/20 group-hover:rotate-6 transition-transform duration-500">
          <BookOpen className="w-7 h-7" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
            Live Preview
          </Badge>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">Draft v1.0</span>
        </div>
      </div>

      <div className="space-y-2 min-h-[80px]">
        <h3 className="text-2xl font-black tracking-tighter leading-none line-clamp-2">
          {data.name || "Untitled Course"}
        </h3>
        <p className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-600">
          {data.code || "CODE-XXX"} • {data.department || "No Dept"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/10 flex flex-col gap-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Credits</span>
          <span className="text-lg font-black">{data.credits} CR</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/10 flex flex-col gap-1 text-right">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Status</span>
          <span className="text-lg font-black text-amber-500 italic">NEW</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-indigo-600/5 dark:bg-indigo-400/5 border border-indigo-500/10">
        <p className="text-[11px] font-bold text-muted-foreground/80 leading-relaxed line-clamp-3 italic">
          {data.description || "The core curriculum objectives will appear here as you craft the syllabus..."}
        </p>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <div className="w-full h-1 bg-white/10 dark:bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 w-1/3 animate-pulse" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Synching</span>
      </div>
    </div>
  </GlassCard>
);

const AddCoursePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      credits: "3",
      name: "",
      code: "",
      department: "",
      description: "",
    }
  });

  const formData = useWatch({ control });

  const onSubmit = async (data: CourseFormValues) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Ultra Premium Course Submit:", data);
    toast.success("Curriculum Node Integrated!", {
      description: `${data.code} is now part of the global academic registry.`,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    });
    setIsSubmitting(false);
    navigate("/admin/academic");
  };

  const departments = [
    { value: "cs", label: "School of Computer Science", icon: Layers },
    { value: "math", label: "Faculty of Mathematics", icon: GraduationCap },
    { value: "physics", label: "Institute of Physics", icon: Zap },
    { value: "arts", label: "Department of Arts & Humanities", icon: BookOpen },
  ];

  return (
    <div className="relative min-h-[90vh] p-4 md:p-8 overflow-hidden font-sans">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 animate-pulse transition-all duration-1000" />
      <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] -z-10 animate-pulse delay-700 transition-all duration-1000" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] -z-10 animate-pulse delay-300 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/academic")}
          className="mb-8 text-muted-foreground hover:text-foreground group rounded-xl px-4 py-2 hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Global Registry</span>
        </Button>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Main Form Section */}
          <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-600 dark:text-amber-400 backdrop-blur-md">
                    <Sparkles className="w-5 h-5" />
                 </div>
                 <Badge variant="outline" className="border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 px-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">Registry Portal</Badge>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-400">
                Course Synthesis
              </h1>
              <p className="text-lg font-medium text-muted-foreground/80 max-w-xl leading-relaxed">
                Initialize new academic structures with ClassTrack's ultra-premium administrative framework.
              </p>
            </div>

            <GlassCard className="p-1" noHover>
              <div className="bg-white/5 dark:bg-black/20 p-8 md:p-12 h-full rounded-[inherit]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                  <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
                    {/* Course Name */}
                    <div className="space-y-3 col-span-2 group">
                      <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 group-focus-within:opacity-100 transition-opacity">Academic Designation</Label>
                      <div className="relative">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 group-focus-within:text-amber-500 transition-colors" />
                        <Input 
                          id="name"
                          placeholder="e.g. Statistical Machine Learning" 
                          className={cn(
                            "pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 rounded-2xl transition-all duration-300 text-lg font-bold placeholder:text-muted-foreground/30",
                            errors.name && "border-rose-500/50 focus:ring-rose-500/5"
                          )}
                          {...register("name")}
                        />
                        {formData.name && (
                           <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500 animate-in fade-in zoom-in" />
                        )}
                      </div>
                      {errors.name && <p className="text-[11px] font-bold text-rose-500 tracking-tight flex items-center gap-1"><Info className="w-3 h-3" /> {errors.name.message}</p>}
                    </div>

                    {/* Course Code */}
                    <div className="space-y-3 group">
                      <Label htmlFor="code" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Identifier</Label>
                      <div className="relative">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors" />
                        <Input 
                          id="code"
                          placeholder="SML-401" 
                          className={cn(
                            "pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl transition-all font-mono font-black text-lg",
                            errors.code && "border-rose-500/50"
                          )}
                          {...register("code")}
                        />
                      </div>
                      {errors.code && <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1"><Info className="w-3 h-3" /> {errors.code.message}</p>}
                    </div>

                    {/* Credits */}
                    <div className="space-y-3">
                      <Label htmlFor="credits" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Academic Weight</Label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 z-10" />
                        <Select onValueChange={(val) => setValue("credits", val)} defaultValue="3">
                          <SelectTrigger className="pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 hover:border-white/20 focus:border-amber-500/50 rounded-2xl transition-all font-black text-lg shadow-sm">
                            <SelectValue placeholder="Select credits" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-white/10 rounded-2xl shadow-2xl p-1">
                            {[1, 2, 3, 4, 6].map(num => (
                              <SelectItem key={num} value={num.toString()} className="h-12 rounded-xl focus:bg-amber-500/10 font-bold transition-colors">
                                {num} Credit Units
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Department Select */}
                    <div className="space-y-3 col-span-2 group">
                      <Label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Core Faculty Assignment</Label>
                      <Select onValueChange={(val) => setValue("department", val)}>
                        <SelectTrigger className="h-14 bg-white/10 dark:bg-black/40 border-white/10 hover:border-white/20 focus:border-indigo-500/50 rounded-2xl transition-all font-black text-lg">
                          <SelectValue placeholder="Select faculty network..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-white/10 rounded-2xl shadow-2xl p-2 min-w-[300px]">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] p-2 opacity-40 border-b border-white/10 mb-2">Academic Domains</div>
                          {departments.map(dept => (
                            <SelectItem key={dept.value} value={dept.label} className="rounded-xl h-14 group transition-all focus:bg-indigo-500/10 focus:text-indigo-600">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/5 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                                  <dept.icon className="w-4 h-4" />
                                </div>
                                <span className="font-bold">{dept.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.department && <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1 mt-1"><Info className="w-3 h-3" /> {errors.department.message}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-3 col-span-2 group">
                      <Label htmlFor="description" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Curriculum Syllabus</Label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-4 h-5 w-5 text-muted-foreground/50 group-focus-within:text-indigo-500 transition-colors" />
                        <textarea 
                          id="description"
                          rows={4}
                          placeholder="Architect the learning flow and milestone definitions..."
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
                      className="flex-1 h-16 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-[1.25rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-amber-600/20 active:scale-95 transition-all overflow-hidden relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Indexing Node...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3 uppercase">
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
            
            <div className="flex items-center gap-6 justify-center md:justify-start px-2">
               <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black">
                       {String.fromCharCode(64+i)}
                    </div>
                  ))}
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  <span className="text-foreground">42 Admins</span> currently online
               </p>
            </div>
          </div>

          {/* Right Preview Section */}
          <div className="hidden xl:flex xl:col-span-4 flex-col gap-8 justify-center min-h-[600px] animate-in slide-in-from-right-12 duration-1000">
             <div className="space-y-2 text-right">
                <h2 className="text-2xl font-black italic tracking-tighter">Live Intelligence</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Visualizing structural nodes in real-time</p>
             </div>
             
             <div className="relative">
                {/* Decorative Elements around preview */}
                <div className="absolute -top-12 -right-12 w-32 h-32 border border-white/5 rounded-full pointer-events-none animate-pulse" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 border border-white/5 rounded-full pointer-events-none" />
                
                <PreviewCourseCard data={formData} />
                
                <div className="mt-8 flex flex-col gap-4 max-w-sm">
                   <div className="flex items-center gap-3 p-4 bg-white/5 dark:bg-black/40 border border-white/10 rounded-2xl backdrop-blur-sm">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                         <Info className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground leading-tight">
                         Course identifiers must be unique within the global ClassTrack ecosystem.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Absolute Bottom Branding */}
      <footer className="mt-20 py-10 border-t border-white/5 flex items-center justify-center">
         <div className="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">ClassTrack Enterprise</span>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">System Core v2.4</span>
         </div>
      </footer>
    </div>
  );
};

export default AddCoursePage;
