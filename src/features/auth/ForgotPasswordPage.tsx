import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/auth/forgot-password?email=${encodeURIComponent(email)}`);
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[70rem] h-[70rem] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60rem] h-[60rem] bg-emerald-600/10 rounded-full blur-[100px] animate-pulse delay-700" />

      <div className="w-full max-w-[480px] z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 backdrop-blur-xl border border-foreground/10 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Account Recovery</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground mb-3">
            Forgot <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500 italic">Password?</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <div className="bg-card/40 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-2xl border border-foreground/10 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <div className="p-10 sm:p-12">
            {sent ? (
              <div className="flex flex-col items-center text-center gap-6 py-6 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black tracking-tight">Check Your Inbox</h2>
                  <p className="text-muted-foreground font-medium leading-relaxed max-w-sm">
                    If an account exists for <strong className="text-foreground">{email}</strong>, you'll receive a link to reset your password within a few minutes.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-widest pt-2">
                  The link expires in 1 hour.
                </p>
                <Link
                  to="/login"
                  className="text-indigo-500 hover:text-indigo-400 font-black text-sm uppercase tracking-widest transition-colors"
                >
                  ← Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@university.edu"
                      className="h-16 pl-14 bg-foreground/5 border-foreground/10 rounded-2xl shadow-inner text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-indigo-500/50 transition-all text-lg font-bold"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black text-lg shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <div className="text-center pt-2">
                  <Link
                    to="/login"
                    className="text-[10px] font-black text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors"
                  >
                    ← Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
