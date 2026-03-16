import { useState } from 'react';
import {
  Settings2,
  Trash2,
  ExternalLink,
  Edit2,
  Globe,
  MoreVertical,
  Activity,
  MapPin,
  Target,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MapSelector from '@/components/MapSelector';

interface Room {
  id: number;
  name: string;
  building: string;
  latitude: number;
  longitude: number;
  geofence_radius: number;
  sessions_count?: number; // Optional metadata
}

const ClassroomsPage = () => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    building: '',
    latitude: 0,
    longitude: 0,
    geofence_radius: 50
  });

  const createRoomMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
          name: data.name,
          building: data.building,
          latitude: data.latitude,
          longitude: data.longitude,
          geofence_radius: data.geofence_radius,
          capacity: 50 // Default capacity
      };
      return await api.post('/rooms/', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setIsCreateModalOpen(false);
      setFormData({ name: '', building: '', latitude: 0, longitude: 0, geofence_radius: 50 });
      toast.success('Node provisioned successfully');
    },
    onError: (error: any) => {
      console.error("Creation error:", error);
      toast.error('Failed to provision node');
    }
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    createRoomMutation.mutate(formData);
  };

  // 1. Fetch live rooms
  const { data: rooms = [], isLoading, error } = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await api.get('/rooms/');
      return res.data;
    }
  });

  // 2. Mutation: Delete Room
  const deleteRoomMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/rooms/${id}`);
    },
    onSuccess: () => {
      toast.success('Facility decommissioned successfully');
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setIsDeleting(null);
    },
    onError: () => {
      toast.error('Failed to decommission facility');
      setIsDeleting(null);
    }
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6 animate-in fade-in duration-500">
        <div className="p-4 bg-red-50 rounded-3xl text-red-500">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-red-600/80">Sync Failure</p>
          <p className="text-slate-400 text-xs mt-1 font-bold">Registry bridge could not be established.</p>
        </div>
        <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['rooms'] })} className="rounded-2xl px-8 font-black uppercase tracking-widest text-[10px]">
          Re-initialize Registry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Syncing Facility Nodes...</p>
      </div>
    );
  }

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto px-4">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 -left-20 w-[40rem] h-[40rem] bg-indigo-500/5 rounded-full blur-[150px] -z-10 animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-[35rem] h-[35rem] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Globe className="w-5 h-5" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Registry v4.0</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent italic">Facility Matrix</h1>
          <p className="text-slate-500 text-lg font-semibold max-w-2xl leading-relaxed">Geospatial management of academic environments and secure geofence protocols.</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto gap-4 rounded-3xl px-10 h-16 bg-[#161B22] border border-white/5 hover:bg-[#21262D] hover:border-white/10 text-white shadow-2xl transition-all hover:scale-105 active:scale-95 font-bold uppercase tracking-[0.2em] text-sm">
              <span className="text-xl">+</span>
              PROVISION NODE
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-white/10 bg-[#0B0F19]/95 backdrop-blur-3xl text-slate-200">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-white flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                  <Target className="w-5 h-5" />
                </div>
                Provision Facility
              </DialogTitle>
              <DialogDescription className="text-slate-400 font-medium">
                Register a new geospatial node for attendance tracking.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRoom} className="space-y-6 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomName" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Designation</Label>
                  <Input 
                    id="roomName" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. EC-101" 
                    className="h-14 bg-black/20 border-white/5 focus-visible:ring-emerald-500/50 rounded-xl text-white font-mono"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="building" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sector / Building</Label>
                  <Input 
                    id="building" 
                    value={formData.building}
                    onChange={(e) => setFormData(prev => ({ ...prev, building: e.target.value }))}
                    placeholder="Engineering Block" 
                    className="h-14 bg-black/20 border-white/5 focus-visible:ring-emerald-500/50 rounded-xl text-white"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Satellite Location Selection</Label>
                  <MapSelector 
                    onLocationSelect={(lat, lng) => setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))}
                    initialLat={formData.latitude}
                    initialLng={formData.longitude}
                  />
                  <div className="flex justify-between px-2 text-[10px] font-mono text-indigo-400/60 font-black">
                    <span>LAT: {formData.latitude?.toFixed(6) ?? "0.000000"}</span>
                    <span>LNG: {formData.longitude?.toFixed(6) ?? "0.000000"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between items-center">
                    <Label htmlFor="radius" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Radius</Label>
                    <span className="text-[10px] font-black text-emerald-400">{formData.geofence_radius}m</span>
                   </div>
                   <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      step="5"
                      value={formData.geofence_radius}
                      onChange={(e) => setFormData(prev => ({ ...prev, geofence_radius: parseInt(e.target.value) }))}
                      className="w-full accent-emerald-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                   />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={createRoomMutation.isPending}
                className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                {createRoomMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initialize Sector"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        <div className="xl:col-span-3 space-y-10">
          <Card className="glass-card rounded-[3.5rem] overflow-hidden shadow-2xl shadow-indigo-500/5 border-indigo-50/50 bg-white/40 backdrop-blur-xl">
            <div className="overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-b border-indigo-50/30">
                    <TableHead className="px-12 py-8 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 w-[300px]">Node Identity</TableHead>
                    <TableHead className="px-10 py-8 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">Spatial Coordinates</TableHead>
                    <TableHead className="px-10 py-8 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">Secure Radius</TableHead>
                    <TableHead className="px-10 py-8 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 text-right">Operations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id} className="group hover:bg-primary/[0.02] transition-all duration-500 border-b border-indigo-50/20">
                      <TableCell className="px-12 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 group-hover:-rotate-3">
                             <Activity className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-lg text-slate-900 tracking-tight group-hover:text-primary transition-colors">{room.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60 italic">{room.building}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-10 py-8">
                         <div className="flex items-center gap-3 font-mono text-xs font-black text-slate-500 tracking-tighter">
                            <div className="p-2 bg-indigo-500/5 rounded-xl text-indigo-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                               <MapPin className="w-4 h-4" />
                            </div>
                            <span className="opacity-80">
                              {(room.latitude?.toFixed(4)) ?? "0.0000"}, {(room.longitude?.toFixed(4)) ?? "0.0000"}
                            </span>
                         </div>
                      </TableCell>
                      <TableCell className="px-10 py-8">
                        <Badge className="gap-2 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] border-indigo-500/20 bg-indigo-500/5 text-indigo-600 shadow-sm group-hover:scale-105 transition-transform">
                          <Target className="w-4 h-4" />
                          {room.geofence_radius}m Range
                        </Badge>
                      </TableCell>
                      <TableCell className="px-12 py-8 text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all shadow-sm">
                                <MoreVertical className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-60 rounded-[2rem] border-indigo-50/50 backdrop-blur-3xl bg-white/90 p-3 shadow-2xl ring-1 ring-black/5 mt-2">
                              <DropdownMenuLabel className="px-4 py-3 text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">Protocol Options</DropdownMenuLabel>
                              <DropdownMenuItem className="rounded-2xl gap-4 py-4 cursor-pointer hover:bg-primary/5 focus:bg-primary/5 group">
                                <Edit2 className="w-4 h-4 text-slate-400 group-hover:text-primary" /> 
                                <span className="font-black text-xs uppercase tracking-widest">Update Specs</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-2xl gap-4 py-4 cursor-pointer hover:bg-indigo-500/5 focus:bg-indigo-500/5 group">
                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" /> 
                                <span className="font-black text-xs uppercase tracking-widest">Satellite View</span>
                              </DropdownMenuItem>
                              <div className="h-px bg-indigo-50 my-2 mx-2" />
                              <DropdownMenuItem 
                                className="rounded-2xl gap-4 py-4 cursor-pointer text-red-500 hover:bg-red-50 focus:bg-red-50 group"
                                onClick={() => deleteRoomMutation.mutate(room.id)}
                              >
                                {deleteRoomMutation.isPending && isDeleting === room.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                                <span className="font-black text-xs uppercase tracking-widest">Decommission</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {rooms.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-slate-300 gap-6">
                   <AlertTriangle className="w-16 h-16 opacity-10" />
                   <p className="font-black uppercase tracking-[0.3em] text-[10px]">No Active Facility Found In Registry</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-12">
          <Card className="glass-card rounded-[3.5rem] border-primary/20 overflow-hidden shadow-2xl shadow-indigo-500/10 group">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 aspect-[4/5] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop')] bg-cover opacity-10 scale-125 group-hover:scale-110 transition-transform duration-2000 grayscale select-none pointer-events-none"></div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />
              
              <div className="z-10 bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 flex flex-col items-center gap-8 text-center max-w-[85%] shadow-2xl transition-all group-hover:translate-y-[-5px]">
                 <div className="w-20 h-20 rounded-[2rem] bg-indigo-500 flex items-center justify-center text-white shadow-[0_0_40px_rgba(99,102,241,0.4)] rotate-6 group-hover:rotate-0 transition-transform duration-700">
                    <Target className="w-10 h-10" />
                 </div>
                 <div className="space-y-3">
                    <h3 className="font-black text-2xl text-white tracking-tight uppercase italic">Spatial Core</h3>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] leading-relaxed">Cross-referencing geofence perimeters with live satellite telemetry.</p>
                 </div>
                 <Button className="w-full h-14 rounded-2xl bg-white text-slate-900 hover:bg-slate-50 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-white/5 transition-all active:scale-95">
                   Initialize Map
                 </Button>
              </div>
            </div>
            <div className="p-10 bg-white/5 border-t border-white/5 backdrop-blur-md">
               <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Reference Grid</span>
                    <span className="font-mono text-xs font-black text-indigo-400 tracking-widest">WGS 84 / GEO-V1</span>
                  </div>
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500 relative shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                  </div>
               </div>
            </div>
          </Card>

          <Card className="glass-card p-10 rounded-[3rem] border-indigo-50/50 bg-white/20 shadow-xl space-y-8">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 rounded-2xl text-white">
                   <Settings2 className="w-4 h-4" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-xs text-slate-500">Registry Stats</h4>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Nodes</p>
                   <p className="text-2xl font-black text-slate-900">{rooms.length}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Perim.</p>
                   <p className="text-2xl font-black text-slate-900">4 / 4</p>
                </div>
             </div>
             <div className="pt-4 border-t border-indigo-50/50">
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] italic">All sub-systems operational</p>
             </div>
          </Card>
        </div>
      </div>
    </div >
  );
};

export default ClassroomsPage;
