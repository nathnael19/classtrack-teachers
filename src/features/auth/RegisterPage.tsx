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
      
      toast.success('Registration successful! Welcome to the mission.');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Registration failed. Check your data.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse delay-700" />

      <div className="w-full max-w-[540px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="mb-8">
           <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-6 group">
             <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             <span className="text-[10px] font-black uppercase tracking-widest">Back to Hangar</span>
           </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">Establish Authority</h1>
          </div>
          <p className="text-slate-500 font-medium opacity-70">Register as a certified Lecturer to manage academic operations.</p>
        </div>

        <div className="glass-card rounded-[3rem] overflow-hidden shadow-2xl border-white/40">
          <div className="p-10 sm:p-12 space-y-8">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Legal Name</Label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <Input 
                      id="name" 
                      placeholder="Dr. Emmett Brown" 
                      className="h-14 pl-14 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-emerald-500/20 text-lg font-bold"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Vector (Email)</Label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="ebrown@university.edu" 
                      className="h-14 pl-14 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-emerald-500/20 text-lg font-bold"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Cypher</Label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="h-14 pl-14 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-emerald-500/20 text-lg font-bold"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Validate Cypher</Label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        placeholder="••••••••" 
                        className="h-14 pl-14 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-emerald-500/20 text-lg font-bold"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden group"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Synchronizing DNA...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 animate-pulse" />
                      <span>Request Authorization</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="px-10 py-6 bg-emerald-900/[0.02] border-t border-white/40 text-center">
            <p className="text-xs font-bold text-slate-400">
              Already have clearance? <Link to="/login" className="text-emerald-600 hover:underline">Return to Portal</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center text-slate-400">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
            &copy; 2026 CLASSTRACK &bull; FACULTY AUTHENTICATION PROTOCOL
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
