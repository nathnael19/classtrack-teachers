import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate auth lag
    setTimeout(() => {
      setLoading(false);
      toast.success('Access Granted. Welcome back, Admin.');
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
      <div className="absolute top-[20%] right-[10%] w-[20rem] h-[20rem] bg-indigo-400/5 rounded-full blur-[80px]" />

      <div className="w-full max-w-[480px] z-10 animate-in fade-in zoom-in duration-1000">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/50 shadow-sm mb-6 animate-bounce">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Secure Access Point</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-2">
            Class<span className="text-primary italic">Track</span>
          </h1>
          <p className="text-slate-500 font-medium opacity-70">Unified Administrative Intelligence Portal</p>
        </div>

        <div className="glass-card rounded-[3rem] overflow-hidden shadow-2xl border-white/40">
          <div className="p-10 sm:p-12 space-y-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Command Identity</Label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="admin@classtrack.ai" 
                      className="h-16 pl-14 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 text-lg font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <Label htmlFor="pass" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Cypher</Label>
                    <button type="button" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Reset</button>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input 
                      id="pass" 
                      type="password" 
                      placeholder="••••••••••••" 
                      className="h-16 pl-14 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 text-lg font-bold"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden group"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Authorizing...</span>
                  </div>
                ) : (
                  <>
                    <span>Initialize Session</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                <span className="bg-transparent px-4">Satellite Gateway</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="ghost" className="h-14 bg-white/40 rounded-2xl hover:bg-white/60 font-bold gap-3 border border-white">
                <Github className="w-5 h-5" /> Github
              </Button>
              <Button variant="ghost" className="h-14 bg-white/40 rounded-2xl hover:bg-white/60 font-bold gap-3 border border-white">
                <Chrome className="w-5 h-5" /> Google
              </Button>
            </div>
          </div>
          
          <div className="px-10 py-6 bg-slate-900/[0.02] border-t border-white/40 text-center">
            <p className="text-xs font-bold text-slate-400">
              New Commander? <button className="text-primary hover:underline">Establish Liaison</button>
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center text-slate-400">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50">
            &copy; 2026 CLASSTRACK &bull; DEEP INTELLIGENCE SYSTEMS
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
