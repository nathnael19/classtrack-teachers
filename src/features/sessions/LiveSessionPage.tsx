import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Users, 
  MapPin, 
  Clock, 
  AlertCircle,
  Square,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Signal,
  ArrowRightLeft,
  Activity,
  LogOut,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { cn } from '@/lib/utils';

interface AttendanceRecord {
  id: number;
  student_id: number;
  student_name: string;
  student_code: string;
  timestamp: string;
  status: string;
}

interface ActiveSession {
  id: number;
  course_id: number;
  room: string;
  start_time: string;
  end_time: string;
  qr_code_content: string;
  latitude: number;
  longitude: number;
  geofence_radius: number;
  course?: {
    name: string;
    code: string;
  };
}

const LiveSessionPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1. Fetch Active Session
  const { data: session, isLoading: isLoadingSession, error: sessionError } = useQuery<ActiveSession>({
    queryKey: ['active-session'],
    queryFn: async () => {
      // First get the session
      const res = await api.get('/sessions/active-lecturer');
      const sessionData = res.data;
      
      // Then get course details for it
      const courseRes = await api.get(`/courses/`);
      const course = courseRes.data.find((c: any) => c.id === sessionData.course_id);
      
      return { ...sessionData, course };
    },
    retry: 1,
  });

  // 2. Fetch Live Attendance (Poll every 5s)
  const { data: attendance = [], isLoading: isLoadingAttendance } = useQuery<AttendanceRecord[]>({
    queryKey: ['session-attendance', session?.id],
    queryFn: async () => {
      if (!session?.id) return [];
      const res = await api.get(`/attendance/session/${session.id}`);
      return res.data;
    },
    enabled: !!session?.id,
    refetchInterval: 5000,
  });

  // 3. Mutation: Stop Session
  const stopSessionMutation = useMutation({
    mutationFn: async () => {
      if (!session?.id) return;
      return await api.patch(`/sessions/${session.id}/stop`);
    },
    onSuccess: () => {
      toast.info('Attendance session terminated successfully.');
      queryClient.invalidateQueries({ queryKey: ['active-session'] });
      navigate('/reports');
    },
    onError: () => {
      toast.error('Failed to terminate session safely.');
    }
  });

  // Timer Hook
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeLeft = () => {
    if (!session?.end_time) return 0;
    const end = new Date(session.end_time).getTime();
    const now = currentTime.getTime();
    return Math.max(0, Math.floor((end - now) / 1000));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timeLeft = getTimeLeft();

  if (isLoadingSession) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Establishing Secure Stream...</p>
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto text-primary">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter uppercase italic">No Active Signal</h2>
        <p className="text-slate-500 font-semibold">There is no attendance session currently active in the secure zone.</p>
        <Button onClick={() => navigate('/sessions/new')} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest gap-3">
          <Activity className="w-5 h-5" />
          Initialize Protocol
        </Button>
      </div>
    );
  }

  return (
    <div className="relative animate-in fade-in duration-1000 max-w-7xl mx-auto px-4 pb-20">
       {/* Background Decorative Blobs */}
       <div className="absolute top-0 -left-20 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[150px] -z-10 animate-pulse" />
       <div className="absolute bottom-20 -right-20 w-[35rem] h-[35rem] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column: QR and Operational Control */}
        <div className="lg:w-[450px] space-y-8">
          <Card className="glass-card rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10 border-indigo-50/50">
            <CardHeader className="bg-white/40 backdrop-blur-md border-b border-indigo-50/50 p-8 pb-6">
              <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                   Live Feed
                 </div>
                 <Badge variant="outline" className="text-[9px] font-black tracking-widest uppercase border-primary/20 bg-primary/5 text-primary">
                   Secure Zone
                 </Badge>
              </div>
              <div>
                <CardTitle className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">
                  {session.course?.name || 'Academic Module'}
                </CardTitle>
                <CardDescription className="font-bold text-xs uppercase tracking-widest text-slate-400 mt-1">
                  {session.course?.code || 'CS-XXX'} • {session.room}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center p-10 bg-gradient-to-b from-white to-slate-50/50">
              <div className="relative group p-6 bg-white rounded-[2.5rem] shadow-2xl border border-indigo-50 transition-all hover:scale-105 duration-500">
                <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <QRCodeSVG 
                  value={session.qr_code_content} 
                  size={260}
                  level="H"
                  includeMargin={true}
                  className="relative z-10"
                />
              </div>
              
              <div className="text-center space-y-2 my-10 relative">
                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-3 ml-1">Session Key</h3>
                <div className="text-5xl font-black tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-indigo-800 tabular-nums">
                  {session.qr_code_content.split('-').pop()?.slice(-4).toUpperCase() || 'LOCK'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 w-full">
                <div className="flex flex-col items-center p-6 rounded-[2rem] bg-white border border-indigo-50 shadow-sm transition-all hover:shadow-md">
                  <div className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-widest">Timer Status</div>
                  <div className={cn(
                    "text-3xl font-black tabular-nums tracking-tight",
                    timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-900'
                  )}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
                <div className="flex flex-col items-center p-6 rounded-[2rem] bg-white border border-indigo-50 shadow-sm transition-all hover:shadow-md">
                  <div className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-widest">Active Scans</div>
                  <div className="text-3xl font-black text-slate-900 tabular-nums tracking-tight">
                    {attendance.length}
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="p-8 border-t border-indigo-50/50 bg-white/40 backdrop-blur-md flex flex-col gap-4">
              <Button 
                variant="destructive" 
                className="w-full gap-3 h-16 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-red-500/10 hover:scale-105 active:scale-95 transition-all" 
                onClick={() => stopSessionMutation.mutate()}
                disabled={stopSessionMutation.isPending}
              >
                {stopSessionMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Square className="w-5 h-5 fill-current" />
                )}
                Terminate Session
              </Button>
              <div className="flex items-center justify-center gap-2 opacity-40">
                 <ShieldCheck className="w-3 h-3 text-emerald-500" />
                 <p className="text-[9px] font-black uppercase tracking-tighter text-slate-600">
                   Biometric verification streams are active
                 </p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-10 rounded-[2.5rem] border-indigo-50/50 bg-white/40 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10" />
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-3">
              <Signal className="w-4 h-4 text-primary" />
              Telemetry Data
            </h3>
            <div className="space-y-6">
               <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Spatial Lock</span>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-600 border-none text-[9px] font-black">ENFORCED</Badge>
               </div>
               <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-xl text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Latency Flux</span>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[9px] font-black">12ms • STABLE</Badge>
               </div>
               <div className="flex justify-between items-center group pt-2 border-t border-indigo-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">QR Encryption</span>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black">AES-256V4</Badge>
               </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Live Stream List */}
        <div className="flex-1">
          <Card className="glass-card border-indigo-50/50 shadow-2xl h-full flex flex-col overflow-hidden rounded-[3rem] bg-white/40 backdrop-blur-md">
            <CardHeader className="p-10 border-b border-indigo-50/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic flex items-center gap-3">
                  <Users className="w-7 h-7 text-primary" />
                  Live Attendance Feed
                </CardTitle>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Real-time Biometric Ingest Stream</p>
              </div>
              <div className="flex gap-4">
                 <div className="hidden sm:flex flex-col items-end gap-1 px-6 py-3 bg-white/60 border border-indigo-50 rounded-2xl shadow-sm">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Population</span>
                    <span className="font-black text-xl text-primary">{attendance.length} Verified</span>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto max-h-[800px] custom-scrollbar">
              <Table>
                <TableHeader className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-md border-b">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Identity</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Credential ID</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time-Stamp</TableHead>
                    <TableHead className="text-right px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((student) => (
                    <TableRow key={student.id} className="group border-b border-indigo-50/30 transition-all hover:bg-primary/[0.02] animate-in slide-in-from-right-4 duration-500">
                      <TableCell className="py-6 px-10">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                              {student.student_name?.charAt(0) || 'U'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full group-hover:animate-ping" />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-black text-slate-900 group-hover:text-primary transition-colors">{student.student_name || 'Anonymous User'}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verified Student</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-[10px] font-black text-slate-400 tracking-tighter uppercase">
                        {student.student_code || 'S-UNKNOWN'}
                      </TableCell>
                      <TableCell className="text-slate-500 font-bold">
                        <div className="flex items-center gap-2 tabular-nums">
                          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                          {new Date(student.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black tracking-widest uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {student.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {attendance.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[500px] text-slate-300 space-y-6 animate-in fade-in zoom-in duration-1000">
                  <div className="relative pb-4">
                     <Users className="w-24 h-24 opacity-10 animate-pulse" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin opacity-40" />
                     </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Awaiting Signal Phase</p>
                    <p className="text-sm font-bold opacity-30 mt-2 italic">Scanning secure zones for student identifiers...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionPage;
