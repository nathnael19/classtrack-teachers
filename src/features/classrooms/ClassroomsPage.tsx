import { 
  MapPin, 
  Plus, 
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
  Target
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

const classrooms = [
  { id: '1', name: 'Lecture Hall 1', building: 'Main Building', lat: '40.7128', lng: '-74.0060', radius: '50m', sessions: 12 },
  { id: '2', name: 'Lab 3', building: 'East Wing', lat: '40.7130', lng: '-74.0055', radius: '30m', sessions: 8 },
  { id: '3', name: 'Room 204', building: 'North Block', lat: '40.7125', lng: '-74.0070', radius: '25m', sessions: 15 },
  { id: '4', name: 'Auditorium A', building: 'Science Center', lat: '40.7135', lng: '-74.0040', radius: '75m', sessions: 5 },
];

const ClassroomsPage = () => {
  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 -left-20 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-20 -right-20 w-[25rem] h-[25rem] bg-emerald-500/5 rounded-full blur-[100px] -z-10" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-primary via-indigo-500 to-emerald-500 bg-clip-text text-transparent pb-1">Facility Matrix</h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium opacity-80">Geospatial management of academic environments and geofence protocols.</p>
        </div>
        <Button className="w-full md:w-auto gap-3 rounded-full px-8 h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 font-bold">
          <Plus className="w-5 h-5" />
          Add Facility
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-8">
          <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/5">
                  <TableRow className="hover:bg-transparent border-b border-border/20">
                    <TableHead className="px-8 py-6 font-black uppercase text-xs tracking-widest text-muted-foreground w-[220px]">Location Entity</TableHead>
                    <TableHead className="px-8 py-6 font-black uppercase text-xs tracking-widest text-muted-foreground">Geospatial Data</TableHead>
                    <TableHead className="px-8 py-6 font-black uppercase text-xs tracking-widest text-muted-foreground">Perimeter</TableHead>
                    <TableHead className="px-8 py-6 font-black uppercase text-xs tracking-widest text-muted-foreground hidden md:table-cell">Engagement</TableHead>
                    <TableHead className="px-8 py-6 font-black uppercase text-xs tracking-widest text-muted-foreground text-right">Settings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classrooms.map((room) => (
                    <tr key={room.id} className="group hover:bg-primary/[0.03] transition-all duration-300 border-b border-border/10">
                      <TableCell className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-base group-hover:text-primary transition-colors">{room.name}</span>
                          <span className="text-xs text-muted-foreground mt-0.5 font-medium opacity-60 uppercase tracking-wide">{room.building}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-6 font-mono text-xs text-muted-foreground font-bold">
                         <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-50 rounded-md text-indigo-500">
                               <MapPin className="w-3.5 h-3.5" />
                            </div>
                            <span className="opacity-70">{room.lat}, {room.lng}</span>
                         </div>
                      </TableCell>
                      <TableCell className="px-8 py-6">
                        <Badge variant="outline" className="gap-2 px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider border-primary/20 bg-primary/5 text-primary">
                          <Target className="w-3.5 h-3.5" />
                          {room.radius}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 py-6 hidden md:table-cell">
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-glow">{room.sessions}</span>
                           <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">Sessions</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-6 text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                                <MoreVertical className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52 rounded-2xl border-primary/10 backdrop-blur-xl bg-white/80 p-2 shadow-2xl">
                              <DropdownMenuLabel className="px-3 py-2 text-xs font-black uppercase text-muted-foreground tracking-widest">Facility Options</DropdownMenuLabel>
                              <DropdownMenuItem className="rounded-xl gap-3 py-3 cursor-pointer hover:bg-primary/5 focus:bg-primary/5 group">
                                <Edit2 className="w-4 h-4 text-muted-foreground group-hover:text-primary" /> 
                                <span className="font-bold">Modify Specs</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-xl gap-3 py-3 cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 group">
                                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-indigo-600" /> 
                                <span className="font-bold font-bold">Spatial View</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-xl gap-3 py-3 cursor-pointer text-destructive hover:bg-destructive/5 focus:bg-destructive/5 group">
                                <Trash2 className="w-4 h-4" /> 
                                <span className="font-bold">Decommission</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </TableCell>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card rounded-[2.5rem] border-primary/20 overflow-hidden shadow-2xl shadow-primary/5">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 aspect-square flex items-center justify-center relative group overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')] bg-cover opacity-20 scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale"></div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              
              <div className="z-10 bg-white/5 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 flex flex-col items-center gap-6 text-center max-w-[85%] shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                 <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/40 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <Target className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="font-black text-xl text-white tracking-tight">Spatial Intelligence</h3>
                    <p className="text-xs text-white/50 mt-2 font-medium leading-relaxed">Visualize geofence perimeters and satellite signal strength across campus sectors.</p>
                 </div>
                 <Button size="lg" className="w-full rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black shadow-lg shadow-white/10">Initialize Map Core</Button>
              </div>
            </div>
            <div className="p-8 bg-white/5 border-t border-white/5">
               <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest italic">Reference System</span>
                    <span className="font-mono text-sm font-black text-primary">WGS 84 / GEO-V1</span>
                  </div>
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomsPage;
