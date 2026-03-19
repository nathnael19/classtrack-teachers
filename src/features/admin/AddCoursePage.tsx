import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Layers, GraduationCap, Clock, FileText
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

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={cn(
    "relative overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md shadow-2xl transition-all duration-500",
    className
  )}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent pointer-events-none" />
    {children}
  </Card>
);

const AddCoursePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      credits: "3",
    }
  });

  const onSubmit = async (data: CourseFormValues) => {
    setIsSubmitting(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Course data:", data);
    toast.success("Course registered successfully!", {
      description: `${data.code}: ${data.name} has been added to the curriculum.`,
    });
    setIsSubmitting(false);
    navigate("/admin/academic");
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-4">
      {/* Background Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] -z-10 pointer-events-none animate-pulse" />

      <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-500">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/academic")}
          className="mb-6 text-muted-foreground hover:text-foreground group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Academic Hub
        </Button>

        <GlassCard>
          <CardHeader className="space-y-1 pb-8 border-b border-white/10 bg-white/10 dark:bg-black/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-amber-500/30 text-amber-600">Curriculum Update</Badge>
            </div>
            <CardTitle className="text-3xl font-black tracking-tighter">Register New Course</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">Define a new academic offering for the student body.</CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Course Name */}
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest opacity-60">Course Full Title</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name"
                      placeholder="e.g. Advanced Quantum Computing" 
                      className={cn(
                        "pl-10 h-12 bg-white/20 dark:bg-black/30 border-white/10 focus:border-amber-500/50 rounded-xl transition-all",
                        errors.name && "border-rose-500/50"
                      )}
                      {...register("name")}
                    />
                  </div>
                  {errors.name && <p className="text-[10px] font-bold text-rose-500">{errors.name.message}</p>}
                </div>

                {/* Course Code */}
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-xs font-black uppercase tracking-widest opacity-60">System Code</Label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="code"
                      placeholder="e.g. QC401" 
                      className={cn(
                        "pl-10 h-12 bg-white/20 dark:bg-black/30 border-white/10 focus:border-amber-500/50 rounded-xl transition-all font-mono",
                        errors.code && "border-rose-500/50"
                      )}
                      {...register("code")}
                    />
                  </div>
                  {errors.code && <p className="text-[10px] font-bold text-rose-500">{errors.code.message}</p>}
                </div>

                {/* Credits */}
                <div className="space-y-2">
                  <Label htmlFor="credits" className="text-xs font-black uppercase tracking-widest opacity-60">Credit Load</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select onValueChange={(val) => setValue("credits", val)} defaultValue="3">
                      <SelectTrigger className="pl-10 h-12 bg-white/20 dark:bg-black/30 border-white/10 focus:border-amber-500/50 rounded-xl transition-all">
                        <SelectValue placeholder="Select credits" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/90 dark:bg-black/90 backdrop-blur-xl border-white/20 rounded-xl">
                        <SelectItem value="1">1 Credit</SelectItem>
                        <SelectItem value="2">2 Credits</SelectItem>
                        <SelectItem value="3">3 Credits</SelectItem>
                        <SelectItem value="4">4 Credits</SelectItem>
                        <SelectItem value="6">6 Credits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-2 col-span-2">
                  <Label className="text-xs font-black uppercase tracking-widest opacity-60">Assigned Department</Label>
                  <Select onValueChange={(val) => setValue("department", val)}>
                    <SelectTrigger className="h-12 bg-white/20 dark:bg-black/30 border-white/10 focus:border-amber-500/50 rounded-xl transition-all font-bold">
                      <SelectValue placeholder="Choose target department" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 dark:bg-black/90 backdrop-blur-xl border-white/20 rounded-xl">
                      <SelectItem value="cs">School of Computer Science</SelectItem>
                      <SelectItem value="math">Faculty of Mathematics</SelectItem>
                      <SelectItem value="physics">Institute of Physics</SelectItem>
                      <SelectItem value="arts">Department of Arts & Humanities</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-[10px] font-bold text-rose-500">{errors.department.message}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest opacity-60">Syllabus Overview</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <textarea 
                      id="description"
                      rows={4}
                      placeholder="Briefly describe the course objectives and learning outcomes..."
                      className="w-full pl-10 pt-2.5 bg-white/20 dark:bg-black/30 border-white/10 focus:border-amber-500/50 rounded-xl transition-all resize-none text-sm"
                      {...register("description")}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Syncing...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Commit Course
                    </>
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  className="px-6 h-12 bg-white/10 dark:bg-black/10 border-white/10 rounded-xl font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                >
                   <Sparkles className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </GlassCard>

        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">
           Enterprise Grade • ClassTrack v2.1 Sync
        </p>
      </div>
    </div>
  );
};

export default AddCoursePage;
