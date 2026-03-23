import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Key, Shield, AlertCircle, CheckCircle2, 
  Lock, ArrowRight, Zap, Fingerprint
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import api from "@/services/api";

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const SetupPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid Request", {
        description: "Missing setup token. Please check your email link.",
      });
      navigate("/login");
    }
  }, [token, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormValues) => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      await api.post("/auth/setup-password", {
        token,
        new_password: data.password,
      });
      
      toast.success("Identity Secured!", {
        description: "Your password has been set. You can now login.",
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      });
      navigate("/login");
    } catch (error: any) {
      toast.error("Setup Failed", {
        description: error.response?.data?.detail || "Invalid or expired token.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
      
      <div className="w-full max-w-md relative z-10 space-y-8">
        <div className="flex flex-col items-center text-center gap-4">
           <div className="p-4 bg-purple-600 rounded-[2rem] shadow-2xl shadow-purple-500/40 animate-bounce-slow">
              <Key className="w-8 h-8 text-white" />
           </div>
           <div className="space-y-2">
              <Badge variant="outline" className="border-purple-500/30 text-purple-600 bg-purple-500/5 px-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">Security Vector</Badge>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-purple-600 dark:from-white dark:to-purple-400">
                Setup Identity
              </h1>
              <p className="text-sm font-medium text-muted-foreground max-w-[280px]">
                Finalize your account synthesis by defining your unique access vector.
              </p>
           </div>
        </div>

        <div className="p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-3xl overflow-hidden">
           <div className="bg-white/40 dark:bg-black/40 p-8 md:p-10 rounded-[2.4rem]">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-2 group">
                       <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-1">New Password</Label>
                       <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-purple-500 transition-colors" />
                          <Input 
                            type="password"
                            placeholder="••••••••"
                            className={cn(
                              "pl-12 h-14 bg-white/40 dark:bg-black/40 border-white/20 rounded-2xl focus:ring-4 focus:ring-purple-500/5 transition-all text-lg font-bold",
                              errors.password && "border-rose-500/50"
                            )}
                            {...register("password")}
                          />
                       </div>
                       {errors.password && <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.password.message}</p>}
                    </div>

                    <div className="space-y-2 group">
                       <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-1">Confirm Identity</Label>
                       <div className="relative">
                          <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-purple-500 transition-colors" />
                          <Input 
                            type="password"
                            placeholder="••••••••"
                            className={cn(
                              "pl-12 h-14 bg-white/40 dark:bg-black/40 border-white/20 rounded-2xl focus:ring-4 focus:ring-purple-500/5 transition-all text-lg font-bold",
                              errors.confirmPassword && "border-rose-500/50"
                            )}
                            {...register("confirmPassword")}
                          />
                       </div>
                       {errors.confirmPassword && <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}</p>}
                    </div>
                 </div>

                 <Button 
                   type="submit" 
                   disabled={isSubmitting}
                   className="w-full h-16 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-purple-500/20 active:scale-95 transition-all"
                 >
                   {isSubmitting ? (
                     <Zap className="w-5 h-5 animate-spin" />
                   ) : (
                     <div className="flex items-center gap-2">
                        Commit Identity <ArrowRight className="w-4 h-4" />
                     </div>
                   )}
                 </Button>
              </form>
           </div>
        </div>

        <div className="flex items-center justify-center gap-4 opacity-30">
           <Shield className="w-4 h-4" />
           <span className="text-[9px] font-black uppercase tracking-[0.4em]">Encrypted Layer v2.4</span>
        </div>
      </div>
    </div>
  );
};

export default SetupPasswordPage;
