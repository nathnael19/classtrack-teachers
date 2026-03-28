import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Sparkles, CheckCircle2, Loader2, EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/services/api';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-black text-foreground">Invalid Reset Link</h2>
          <p className="text-muted-foreground font-medium">This link is missing a reset token. Please request a new one.</p>
          <Button onClick={() => navigate('/forgot-password')} className="mt-4 rounded-2xl font-black uppercase tracking-widest">
            Request New Link
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, new_password: newPassword });
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to reset password. The link may have expired.');
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
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Password Reset</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground mb-3">
            Set New <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500 italic">Password</span>
          </h1>
          <p className="text-muted-foreground font-medium">Choose a strong password for your account.</p>
        </div>

        <div className="bg-card/40 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-2xl border border-foreground/10 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <div className="p-10 sm:p-12">
            {done ? (
              <div className="flex flex-col items-center text-center gap-6 py-6 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black tracking-tight">Password Updated!</h2>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    Your password has been changed. Redirecting you to login...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="new-pass" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    New Password
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input
                      id="new-pass"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      className="h-16 pl-14 pr-14 bg-foreground/5 border-foreground/10 rounded-2xl shadow-inner text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-indigo-500/50 transition-all text-lg font-bold"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-pass" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Confirm Password
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input
                      id="confirm-pass"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      className="h-16 pl-14 bg-foreground/5 border-foreground/10 rounded-2xl shadow-inner text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-indigo-500/50 transition-all text-lg font-bold"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                    />
                  </div>
                  {confirm && newPassword !== confirm && (
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">Passwords do not match</p>
                  )}
                </div>

                <div className="p-4 bg-foreground/5 rounded-2xl text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Use at least 8 characters with a mix of letters and numbers.
                </div>

                <Button
                  type="submit"
                  disabled={loading || (!!confirm && newPassword !== confirm)}
                  className="w-full h-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black text-lg shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Update Password</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
