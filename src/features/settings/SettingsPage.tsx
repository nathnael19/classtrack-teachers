import { useState } from 'react';
import { 
  User, 
  Shield, 
  Smartphone,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const SettingsPage = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings updated successfully');
    }, 1000);
  };

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto px-4">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 -left-20 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-20 -right-20 w-[25rem] h-[25rem] bg-emerald-500/5 rounded-full blur-[100px] -z-10" />

      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-primary via-indigo-500 to-emerald-500 bg-clip-text text-transparent pb-1">System Preferences</h1>
        <p className="text-muted-foreground mt-2 text-lg font-medium opacity-80">Orchestrate your workspace environment and security protocols.</p>
      </div>

      <div className="space-y-10">
        <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
          <div className="px-10 py-8 border-b border-white/20 bg-white/5">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <User className="w-6 h-6" />
              </div>
              Identity Profile
            </h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium italic">Configure your digital persona and contact vectors.</p>
          </div>
          
          <CardContent className="p-10 space-y-10">
            <div className="flex flex-col sm:flex-row items-center gap-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-4xl font-black text-white border-8 border-white shadow-2xl relative z-10 transition-transform group-hover:scale-105">
                  JD
                </div>
              </div>
              <div className="text-center sm:text-left">
                <Button variant="ghost" className="font-black text-primary hover:bg-primary/10 rounded-xl px-6 h-12">
                  Rotate Avatar
                </Button>
                <p className="text-xs font-bold text-muted-foreground/40 mt-3 uppercase tracking-widest leading-relaxed">Format: JPEG / PNG <br/> Volume: 1.0MB Threshold</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Legal Designation</Label>
                <Input id="name" defaultValue="John Doe" className="h-14 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 font-bold text-lg px-6" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Academic Identifier</Label>
                <Input id="email" type="email" defaultValue="john.doe@university.edu" className="h-14 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 font-bold text-lg px-6" />
              </div>
            </div>
          </CardContent>
          <div className="px-10 py-8 border-t border-white/20 bg-muted/5 flex justify-end">
            <Button onClick={handleSave} disabled={isSaving} className="gap-3 rounded-full px-10 h-14 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 font-black text-lg">
              {isSaving ? 'Synchronizing...' : <><Check className="w-5 h-5" /> Persist Changes</>}
            </Button>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
          <div className="px-10 py-8 border-b border-white/20 bg-white/5">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-4">
              <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
                <Shield className="w-6 h-6" />
              </div>
              Vault Access
            </h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium italic">Encrypt and shield your administrative credentials.</p>
          </div>
          
          <CardContent className="p-10 space-y-8">
            <div className="space-y-3">
              <Label htmlFor="current-pass" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Active Cypher</Label>
              <Input id="current-pass" type="password" placeholder="••••••••" className="h-14 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 font-bold text-lg px-6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="new-pass" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">New Sequence</Label>
                <Input id="new-pass" type="password" className="h-14 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 font-bold text-lg px-6" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="confirm-pass" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Validate Sequence</Label>
                <Input id="confirm-pass" type="password" className="h-14 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 font-bold text-lg px-6" />
              </div>
            </div>
          </CardContent>
          <div className="px-10 py-8 border-t border-white/20 bg-muted/5 flex justify-end">
             <Button variant="ghost" className="font-black text-indigo-600 hover:bg-indigo-50 rounded-xl px-8 h-12">Recalibrate Access</Button>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
          <div className="px-10 py-8 border-b border-white/20 bg-white/5">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-4">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                <Smartphone className="w-6 h-6" />
              </div>
              Orchestration Defaults
            </h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium italic">Preset temporal and spatial limits for new operations.</p>
          </div>
          
          <CardContent className="p-10 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="def-duration" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Sequence Window (MINS)</Label>
                  <Input id="def-duration" type="number" defaultValue="60" className="h-14 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 font-black text-lg px-6" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="def-radius" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Search Perimeter (METERS)</Label>
                  <Input id="def-radius" type="number" defaultValue="50" className="h-14 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 font-black text-lg px-6" />
                </div>
             </div>
          </CardContent>
          <div className="px-10 py-8 border-t border-white/20 bg-muted/5 flex justify-end">
             <Button onClick={handleSave} disabled={isSaving} variant="ghost" className="font-black text-emerald-600 hover:bg-emerald-50 rounded-xl px-8 h-12">Universal Reset</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
