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
  UserPlus, ArrowLeft, Save, 
  User, Mail, Shield, Building2,
  CheckCircle2, Info, Fingerprint
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

interface Organization {
  id: number;
  name: string;
  domain: string;
}

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["student", "lecturer", "admin"]),
  student_id: z.string().optional(),
  department_id: z.string().optional(),
  organization_id: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

const GlassCard = ({ children, className = "", noHover = false }: { children: React.ReactNode, className?: string, noHover?: boolean }) => (
  <div className={cn(
    "relative overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/60 backdrop-blur-xl shadow-2xl transition-all duration-500 rounded-[2.5rem]",
    !noHover && "hover:shadow-purple-500/10 hover:border-white/40 dark:hover:border-white/20 hover:-translate-y-1",
    className
  )}>
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-black/20 pointer-events-none" />
    {children}
  </div>
);

const PreviewUserCard = ({ data }: { data: Partial<UserFormValues> }) => (
  <GlassCard className="p-8 w-full max-w-sm sticky top-8 border-purple-500/30 ring-1 ring-purple-500/20 group">
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/20 group-hover:rotate-6 transition-transform duration-500">
          <User className="w-7 h-7" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
            Live Preview
          </Badge>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">New Identity</span>
        </div>
      </div>

      <div className="space-y-2 min-h-[80px]">
        <h3 className="text-2xl font-black tracking-tighter leading-none line-clamp-2 uppercase">
          {data.name || "Unknown Identity"}
        </h3>
        <p className="font-mono text-[10px] font-black uppercase tracking-widest text-purple-600 truncate">
          {data.email || "EMAIL@EXAMPLE.COM"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/10 flex flex-col gap-1 text-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Governance</span>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-none rounded-lg font-black text-[9px] px-2 self-center">
            {(data.role || "pending").toUpperCase()}
          </Badge>
        </div>
        <div className="p-3 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/10 flex flex-col gap-1 text-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">ID Vector</span>
          <span className="text-sm font-black italic">{data.student_id || "N/A"}</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-indigo-600/5 dark:bg-indigo-400/5 border border-indigo-500/10 flex items-center gap-3">
         <Shield className="w-4 h-4 text-indigo-500 opacity-50" />
         <p className="text-[10px] font-bold text-muted-foreground/80 leading-tight italic">
            A setup email will be dispatched to this node upon commitment.
         </p>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <div className="w-full h-1 bg-white/10 dark:bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-1/3 animate-pulse" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Synching...</span>
      </div>
    </div>
  </GlassCard>
);

const AddUserPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "student",
      name: "",
      email: "",
      student_id: "",
      department_id: "",
      organization_id: "",
    }
  });

  const formData = useWatch({ control });
  const { data: organizations = [] } = useQuery<Organization[]>({
    queryKey: ["organizations"],
    queryFn: async () => (await api.get("/organizations/")).data,
  });

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        department_id: data.department_id ? parseInt(data.department_id) : null,
        organization_id: data.organization_id ? parseInt(data.organization_id) : null,
      };
      
      await api.post("/users/admin/create-user", payload);
      
      toast.success("User Created!", {
        description: `${data.name} has been added to the system. Setup email sent!`,
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      });
      navigate("/admin/users");
    } catch (error: any) {
      toast.error("Failed to Create User", {
        description: error.response?.data?.detail || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] p-4 md:p-8 overflow-hidden font-sans">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] -z-10 animate-pulse transition-all duration-1000" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 animate-pulse delay-700 transition-all duration-1000" />
      
      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/users")}
          className="mb-8 text-muted-foreground hover:text-foreground group rounded-xl px-4 py-2 hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Users</span>
        </Button>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Main Form Section */}
          <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-600 dark:text-purple-400 backdrop-blur-md">
                    <UserPlus className="w-5 h-5" />
                 </div>
                 <Badge variant="outline" className="border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/5 px-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">New User</Badge>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-600 dark:from-white dark:via-purple-300 dark:to-indigo-400">
                Create New User
              </h1>
              <p className="text-lg font-medium text-muted-foreground/80 max-w-xl leading-relaxed">
                Add a new student, lecturer, or admin to the system. Password setup is automated via email.
              </p>
            </div>

            <GlassCard className="p-1" noHover>
              <div className="bg-white/5 dark:bg-black/20 p-8 md:p-12 h-full rounded-[inherit]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                  <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
                    {/* Full Name */}
                    <div className="space-y-3 col-span-2 group">
                      <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 group-focus-within:opacity-100 transition-opacity">Full Name</Label>
                      <div className="relative">
                        <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 group-focus-within:text-purple-500 transition-colors" />
                        <Input 
                          id="name"
                          placeholder="e.g. ALEX RIVERA" 
                          className={cn(
                            "pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 rounded-2xl transition-all duration-300 text-lg font-bold placeholder:text-muted-foreground/30 uppercase",
                            errors.name && "border-rose-500/50 focus:ring-rose-500/5"
                          )}
                          {...register("name")}
                        />
                      </div>
                      {errors.name && <p className="text-[11px] font-bold text-rose-500 tracking-tight flex items-center gap-1"><Info className="w-3 h-3" /> {errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-3 col-span-2 group">
                      <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 group-focus-within:text-purple-500 transition-colors" />
                        <Input 
                          id="email"
                          placeholder="node@example.com" 
                          className={cn(
                            "pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 rounded-2xl transition-all duration-300 text-lg font-bold placeholder:text-muted-foreground/30",
                            errors.email && "border-rose-500/50 focus:ring-rose-500/5"
                          )}
                          {...register("email")}
                        />
                      </div>
                      {errors.email && <p className="text-[11px] font-bold text-rose-500 tracking-tight flex items-center gap-1"><Info className="w-3 h-3" /> {errors.email.message}</p>}
                    </div>

                    {/* Role */}
                    <div className="space-y-3">
                      <Label htmlFor="role" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">User Role</Label>
                      <div className="relative">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 z-10" />
                        <Select onValueChange={(val: any) => setValue("role", val)} defaultValue="student">
                          <SelectTrigger className="pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 hover:border-white/20 focus:border-purple-500/50 rounded-2xl transition-all font-black text-lg shadow-sm">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-white/10 rounded-2xl shadow-2xl p-1">
                            {["student", "lecturer", "admin"].map(role => (
                              <SelectItem key={role} value={role} className="h-12 rounded-xl focus:bg-purple-500/10 font-bold transition-colors uppercase text-[10px] tracking-widest">
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Organization */}
                    {organizations.length > 0 && (
                      <div className="space-y-3 col-span-2">
                        <Label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Organization (Optional)</Label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 z-10" />
                          <Select onValueChange={(val: string) => setValue("organization_id", val)}>
                            <SelectTrigger className="pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 hover:border-white/20 focus:border-purple-500/50 rounded-2xl transition-all font-bold text-lg shadow-sm">
                              <SelectValue placeholder="Select organization" />
                            </SelectTrigger>
                            <SelectContent>
                              {organizations.map((org) => (
                                <SelectItem key={org.id} value={String(org.id)}>
                                  {org.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Student ID (conditional) */}
                    <div className="space-y-3 group">
                      <Label htmlFor="student_id" className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Student/Staff ID</Label>
                      <div className="relative">
                        <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors" />
                        <Input 
                          id="student_id"
                          placeholder="CT-2024-XXXX" 
                          className="pl-12 h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 rounded-2xl transition-all font-mono font-black text-lg"
                          {...register("student_id")}
                        />
                      </div>
                    </div>

                    {/* Department ID */}
                    <div className="space-y-3 col-span-2 group">
                      <Label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Department (Optional)</Label>
                       <Input 
                          id="department_id"
                          placeholder="Department ID (Numeric)" 
                          className="h-14 bg-white/10 dark:bg-black/40 border-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 rounded-2xl transition-all font-bold text-lg"
                          {...register("department_id")}
                        />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 flex flex-col md:flex-row gap-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 h-16 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white rounded-[1.25rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-purple-600/20 active:scale-95 transition-all overflow-hidden relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving User...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3 uppercase">
                          <Save className="w-5 h-5" />
                          Create User
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </GlassCard>
          </div>

          {/* Right Preview Section */}
          <div className="hidden xl:flex xl:col-span-4 flex-col gap-8 justify-center min-h-[600px] animate-in slide-in-from-right-12 duration-1000">
             <div className="space-y-2 text-right">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">Live Intelligence</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Preview user profile</p>
             </div>
             
             <div className="relative">
                <PreviewUserCard data={formData} />
                
                <div className="mt-8 flex flex-col gap-4 max-w-sm">
                   <div className="flex items-center gap-3 p-4 bg-white/5 dark:bg-black/40 border border-white/10 rounded-2xl backdrop-blur-sm">
                      <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                         <Shield className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground leading-tight italic">
                         Note: Entities added via this portal are initialized in an "Inactive" state until password synthesis is completed by the target node.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-20 py-10 border-t border-white/5 flex items-center justify-center">
         <div className="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">ClassTrack Identity Vector</span>
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Auth Core v1.0</span>
         </div>
      </footer>
    </div>
  );
};

export default AddUserPage;
