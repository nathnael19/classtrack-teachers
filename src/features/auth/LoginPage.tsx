import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  Github,
  Chrome,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email); // OAuth2 expects 'username'
      formData.append('password', password);

      const response = await api.post('/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token } = response.data;
      localStorage.setItem('geoattend_token', access_token);
      
      // Update global auth state with user data and token
      const responseMe = await api.get('/users/me');
      const user = responseMe.data;
      useAuthStore.getState().login(user, access_token);

      toast.success(`Access Granted. Welcome back, ${user.name}.`);
      
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Authentication failed. Check your coordinates.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden transition-colors duration-500">
      {/* Dynamic Background Elements - opacities adjusted via classes or theme */}
      <div className="absolute top-[-20%] left-[-10%] w-[70rem] h-[70rem] bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen dark:mix-blend-screen animate-pulse duration-10000" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60rem] h-[60rem] bg-emerald-600/10 dark:bg-emerald-600/20 rounded-full blur-[100px] mix-blend-screen dark:mix-blend-screen animate-pulse delay-700 duration-10000" />

      {/* Dark styling grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="w-full max-w-[480px] z-10 animate-in fade-in zoom-in duration-1000">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 backdrop-blur-xl border border-foreground/10 shadow-sm mb-6 animate-in slide-in-from-bottom-2">
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Secure Access Point</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-foreground mb-3">
            Class<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500 italic">Track</span>
          </h1>
          <p className="text-muted-foreground font-medium tracking-wide">Unified Administrative Intelligence Portal</p>
        </div>

        <div className="bg-card/40 dark:bg-white/5 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-2xl border border-foreground/10 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <div className="p-10 sm:p-12 space-y-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@classtrack.ai"
                      className="h-16 pl-14 bg-foreground/5 border-foreground/10 rounded-2xl shadow-inner text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 transition-all text-lg font-bold hover:bg-foreground/10 cursor-text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <Label htmlFor="pass" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</Label>
                    <button type="button" className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 transition-colors uppercase tracking-widest cursor-pointer">Reset</button>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input
                      id="pass"
                      type="password"
                      placeholder="••••••••••••"
                      className="h-16 pl-14 bg-foreground/5 border-foreground/10 rounded-2xl shadow-inner text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all text-lg font-bold hover:bg-foreground/10 cursor-text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 border border-indigo-400/20 text-white font-black text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="tracking-wide">Authorizing...</span>
                  </div>
                ) : (
                  <>
                    <span className="tracking-wide">Login</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-foreground/10" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                <span className="bg-background px-4 rounded-full border border-foreground/5 py-1">Satellite Gateway</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-14 bg-foreground/5 border-foreground/10 rounded-xl hover:bg-foreground/10 text-foreground font-bold gap-3 transition-colors cursor-pointer group">
                <Github className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" /> GitHub
              </Button>
              <Button variant="outline" className="h-14 bg-foreground/5 border-foreground/10 rounded-xl hover:bg-foreground/10 text-foreground font-bold gap-3 transition-colors cursor-pointer group">
                <Chrome className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" /> Google
              </Button>
            </div>
          </div>

          <div className="px-10 py-6 bg-foreground/5 border-t border-foreground/5 text-center transition-colors">
            <p className="text-sm border-transparent font-bold text-muted-foreground">
              New Commander? <Link to="/register" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-all cursor-pointer">Establish Liaison</Link>
            </p>
          </div>
        </div>

        <div className="mt-12 text-center text-muted-foreground">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80">
            &copy; 2026 CLASSTRACK &bull; DEEP INTELLIGENCE SYSTEMS
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
