import { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Smartphone,
  Check,
  Loader2,
  Zap,
  Lock,
  Sparkles,
  RefreshCw,
  Camera,
  Mail,
  Fingerprint
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  default_session_duration: number;
  default_session_radius: number;
}

const SettingsPage = () => {
  const queryClient = useQueryClient();
  const [isRotating, setIsRotating] = useState(false);

  // --- Queries ---
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['user-profile'],
    queryFn: async () => (await api.get('/users/me')).data,
  });

  // --- Mutations ---
  const updateProfile = useMutation({
    mutationFn: async (vars: Partial<UserProfile> & { password?: string }) => {
      return (await api.put('/users/me', vars)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Neural configurations synchronized!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Protocol synchronization failure.');
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    default_session_duration: 60,
    default_session_radius: 50,
  });

  const [passwords, setPasswords] = useState({
    new: '',
    confirm: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        default_session_duration: profile.default_session_duration,
        default_session_radius: profile.default_session_radius,
      });
    }
  }, [profile]);

  const handleSaveProfile = () => {
    updateProfile.mutate({
      name: formData.name,
      email: formData.email
    });
  };

  const handleSaveOrchestration = () => {
    updateProfile.mutate({
      default_session_duration: formData.default_session_duration,
      default_session_radius: formData.default_session_radius
    });
  };

  const handleResetPassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('Cypher sequence mismatch.');
      return;
    }
    if (!passwords.new) {
      toast.error('Empty cypher sequence rejected.');
      return;
    }
    updateProfile.mutate({ password: passwords.new });
    setPasswords({ new: '', confirm: '' });
  };

  const rotateAvatar = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 2000);
    toast.info('Re-rendering identity visualizer...');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-primary opacity-20" />
          <Fingerprint className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Scanning Bio-Digital Credentials...</p>
      </div>
    );
  }

  return (
    <div className="relative animate-in fade-in duration-1000 max-w-5xl mx-auto px-4 pb-20">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 -left-20 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-[25rem] h-[25rem] bg-emerald-500/10 rounded-full blur-[100px] -z-10" />

      <div className="mb-16 pt-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
          <Sparkles className="w-3 h-3 fill-current" />
          System Core Configuration
        </div>
        <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-tight">
          System <span className="italic text-primary">Preferences</span>
        </h1>
        <p className="text-slate-500 text-xl font-medium max-w-xl">
          Orchestrate your workspace environment and secure multi-factor authentication protocols.
        </p>
      </div>

      <div className="space-y-12">
        {/* Identity Profile */}
        <div className="glass-card rounded-[3.5rem] overflow-hidden border-none bg-white/40 shadow-2xl shadow-indigo-500/5 group">
          <div className="px-12 py-10 border-b border-slate-100 bg-white/20 backdrop-blur-md flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-6">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:rotate-12 transition-transform duration-500">
                <User className="w-8 h-8" />
              </div>
              Identity Profile
            </h2>
            <div className="flex items-center gap-3 px-6 py-2 bg-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              <RefreshCw className={`w-3 h-3 ${updateProfile.isPending ? 'animate-spin text-primary' : ''}`} />
              {updateProfile.isPending ? 'Syncing' : 'Persistent'}
            </div>
          </div>
          
          <CardContent className="p-12 space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative group/avatar">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-indigo-500/20 blur-2xl rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-700" />
                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary via-indigo-600 to-indigo-800 flex items-center justify-center text-4xl font-black text-white shadow-2xl relative z-10 overflow-hidden group-hover/avatar:scale-105 transition-transform duration-700">
                  <div className="absolute inset-0 bg-white/10 animate-pulse" />
                  {formData.name.split(' ').map(n => n[0]).join('') || 'ID'}
                  {isRotating && <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in"><Loader2 className="w-10 h-10 animate-spin" /></div>}
                </div>
                <Button 
                  onClick={rotateAvatar}
                  size="icon" 
                  className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-900 shadow-xl hover:bg-primary hover:text-white hover:rotate-90 transition-all duration-500 z-20"
                >
                  <Camera className="w-5 h-5" />
                </Button>
              </div>
              <div className="text-center md:text-left space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{profile?.role.toUpperCase()} ENTITY</h3>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] leading-relaxed">
                  Format: Multi-Vector Bio-Link <br/> Threshold: 1.0MB Quantum Static
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Legal Designation</Label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full designation"
                    className="h-16 pl-16 bg-white/60 border-none rounded-3xl shadow-xl shadow-slate-200/50 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold text-lg text-slate-900 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Network Identifier (EMail)</Label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@domain.edu"
                    className="h-16 pl-16 bg-white/60 border-none rounded-3xl shadow-xl shadow-slate-200/50 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold text-lg text-slate-900 transition-all" 
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <div className="px-12 py-10 border-t border-slate-100 bg-slate-50/50 backdrop-blur-md flex justify-end items-center gap-6">
            {updateProfile.isPending && <span className="text-[10px] font-black text-primary animate-pulse tracking-widest uppercase">Transmitting...</span>}
            <Button 
              onClick={handleSaveProfile} 
              disabled={updateProfile.isPending} 
              className="gap-4 rounded-3xl px-12 h-16 bg-slate-900 hover:bg-slate-800 text-white shadow-2xl shadow-slate-900/20 active:scale-95 transition-all font-black text-xs uppercase tracking-widest group"
            >
              <Check className="w-5 h-5 group-hover:scale-125 transition-transform" /> 
              Persist Identity
            </Button>
          </div>
        </div>

        {/* Vault Access */}
        <div className="glass-card rounded-[3.5rem] overflow-hidden border-none bg-white/40 shadow-2xl shadow-slate-900/5 group">
          <div className="px-12 py-10 border-b border-slate-100 bg-white/20 backdrop-blur-md">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-6">
              <div className="p-4 bg-slate-900/10 rounded-2xl text-slate-900 group-hover:scale-110 transition-transform duration-500">
                <Lock className="w-8 h-8" />
              </div>
              Vault Access Cyphers
            </h2>
          </div>
          
          <CardContent className="p-12 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <Label htmlFor="new-pass" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">New Sequence</Label>
                <div className="relative group">
                  <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                  <Input 
                    id="new-pass" 
                    type="password" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    placeholder="••••••••••••"
                    className="h-16 pl-16 bg-white/60 border-none rounded-3xl shadow-xl shadow-slate-200/50 focus-visible:ring-2 focus-visible:ring-slate-900/20 font-bold text-lg" 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label htmlFor="confirm-pass" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Confirm Sequence</Label>
                <div className="relative group">
                  <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                  <Input 
                    id="confirm-pass" 
                    type="password" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    placeholder="••••••••••••"
                    className="h-16 pl-16 bg-white/60 border-none rounded-3xl shadow-xl shadow-slate-200/50 focus-visible:ring-2 focus-visible:ring-slate-900/20 font-bold text-lg" 
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl flex items-center gap-4 border border-slate-100">
                <div className="w-3 h-3 rounded-full bg-slate-400 opacity-20" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Vault protocols require 12+ characters with high entropy markers for tactical parity.</p>
            </div>
          </CardContent>
          <div className="px-12 py-10 border-t border-slate-100 bg-slate-50/50 backdrop-blur-md flex justify-end">
             <Button onClick={handleResetPassword} disabled={updateProfile.isPending} variant="ghost" className="font-black text-slate-600 hover:bg-slate-100 rounded-2xl px-10 h-14 uppercase text-[10px] tracking-widest gap-3">
               <Zap className="w-4 h-4" /> Recalibrate Access
             </Button>
          </div>
        </div>

        {/* Orchestration Defaults */}
        <div className="glass-card rounded-[3.5rem] overflow-hidden border-none bg-white/40 shadow-2xl shadow-emerald-500/5 group">
          <div className="px-12 py-10 border-b border-slate-100 bg-white/20 backdrop-blur-md">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-6">
              <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-600 group-hover:rotate-6 transition-transform">
                <Smartphone className="w-8 h-8" />
              </div>
              Orchestration Defaults
            </h2>
          </div>
          
          <CardContent className="p-12 space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label htmlFor="def-duration" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Temporal Window (MINS)</Label>
                  <Input 
                    id="def-duration" 
                    type="number" 
                    value={formData.default_session_duration}
                    onChange={(e) => setFormData({...formData, default_session_duration: parseInt(e.target.value)})}
                    className="h-16 bg-white/60 border-none rounded-3xl shadow-xl shadow-slate-200/50 focus-visible:ring-2 focus-visible:ring-emerald-500/20 font-black text-xl px-8 text-emerald-600" 
                  />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="def-radius" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Geospatial Radius (METERS)</Label>
                  <Input 
                    id="def-radius" 
                    type="number" 
                    value={formData.default_session_radius}
                    onChange={(e) => setFormData({...formData, default_session_radius: parseInt(e.target.value)})}
                    className="h-16 bg-white/60 border-none rounded-3xl shadow-xl shadow-slate-200/50 focus-visible:ring-2 focus-visible:ring-emerald-500/20 font-black text-xl px-8 text-emerald-600" 
                  />
                </div>
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/10">Default parameters for new class sessions. Dynamically inherited during initialization.</p>
          </CardContent>
          <div className="px-12 py-10 border-t border-slate-100 bg-emerald-500/5 backdrop-blur-md flex justify-end">
             <Button onClick={handleSaveOrchestration} disabled={updateProfile.isPending} className="gap-4 rounded-3xl px-12 h-16 bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all font-black text-xs uppercase tracking-widest">
               Update Orchestration Core
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
