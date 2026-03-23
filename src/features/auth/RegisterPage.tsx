import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/services/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'lecturer' // Hardcoded for teacher registration
      });
      
      toast.success('Registration successful! Welcome to ClassTrack.');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Registration failed. Check your data.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden transition-colors duration-500">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[70rem] h-[70rem] bg-emerald-600/10 dark:bg-emerald-600/20 rounded-full blur-[120px] mix-blend-screen dark:mix-blend-screen animate-pulse duration-10000" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60rem] h-[60rem] bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[100px] mix-blend-screen dark:mix-blend-screen animate-pulse delay-700 duration-10000" />

      {/* Styling grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="w-full max-w-[540px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="mb-8 text-center sm:text-left">
           <Link to="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-emerald-500 transition-colors mb-6 group cursor-pointer justify-center sm:justify-start w-full sm:w-auto">
             <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             <span className="text-[10px] font-black uppercase tracking-widest">Back to Login</span>
           </Link>
          <div className="flex items-center justify-center sm:justify-start gap-4 mb-3">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-foreground">Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 italic">Account</span></h1>
          </div>
          <p className="text-muted-foreground font-medium tracking-wide">Register as a lecturer to manage your courses and students.</p>
        </div>

        <div className="bg-card/40 dark:bg-white/5 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-2xl border border-foreground/10 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <div className="p-10 sm:p-12 space-y-8">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-300">
                      <User className="w-5 h-5" />
                    </div>
                    <Input 
                      id="name" 
                      placeholder="Dr. Emmett Brown" 
                      className="h-14 pl-14 bg-foreground/5 border-foreground/10 rounded-2xl shadow-inner text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 transition-all text-lg font-bold hover:bg-foreground/10 cursor-text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="ebrown@university.edu" 
                      className="h-14 pl-14 bg-foreground/5 border-foreground/10 rounded-2xl shadow-inner text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all text-lg font-bold hover:bg-foreground/10 cursor-text"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-300">
                        <Lock className="w-5 h-5" />
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="h-14 pl-14 bg-foreground/5 border-foreground/10 rounded-2xl shadow-inner text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 transition-all text-lg font-bold hover:bg-foreground/10 cursor-text"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm Password</Label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-300">
                        <Lock className="w-5 h-5" />
                      </div>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        placeholder="••••••••" 
                        className="h-14 pl-14 bg-foreground/5 border-foreground/10 rounded-2xl shadow-inner text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 transition-all text-lg font-bold hover:bg-foreground/10 cursor-text"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 border border-emerald-400/20 text-white font-black text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                      <span className="tracking-wide">Creating Account...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 animate-pulse" />
                      <span className="tracking-wide">Sign Up</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="px-10 py-6 bg-foreground/5 border-t border-foreground/5 text-center transition-colors">
            <p className="text-sm border-transparent font-bold text-muted-foreground">
              Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-all cursor-pointer">Log in</Link>
            </p>
          </div>
        </div>

        <div className="mt-12 text-center text-muted-foreground">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80">
            &copy; 2026 CLASSTRACK &bull; FACULTY PORTAL
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
