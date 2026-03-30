import { useState, useEffect, useRef, useMemo } from 'react';
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
  Sparkles,
  Search,
  Plus,
  UserCheck
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { cn } from '@/lib/utils';
interface SessionStudent {
  id: number;
  name: string;
  student_id: string; // Student code
  status: string | null;
  timestamp: string | null;
  section?: string;
}

interface AttendanceRecord {
  id: number;
  student_id: number;
  student_name: string;
  student_code: string;
  timestamp: string;
  status: string;
  section?: string;
}

interface ActiveSession {
  id: number;
  course_id: number;
  room: string;
  start_time: string;
  end_time: string;
  latitude: number;
  longitude: number;
  geofence_radius: number;
  topic?: string;
  notes?: string;
  course?: {
    name: string;
    code: string;
  };
  active_qr_token?: string;
  active_qr_token_expires_in_seconds?: number;
}

const LiveSessionPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [rotationProgress, setRotationProgress] = useState(0);
  const [activeToken, setActiveToken] = useState("");
  const [qrTimeLeft, setQrTimeLeft] = useState(120);
  const [tokenExpiresAtMs, setTokenExpiresAtMs] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageOpen, setIsManageOpen] = useState(false);


  const ROTATION_INTERVAL = 120; // seconds — 2 minutes

  // 1. Fetch Active Session
  const { data: session, isLoading: isLoadingSession, isFetching: isFetchingSession, error: sessionError, refetch } = useQuery<ActiveSession>({
    queryKey: ['active-session'],
    queryFn: async () => {
      const res = await api.get('/sessions/active-lecturer');
      const sessionData = res.data;
      if (sessionData?.course_id) {
        const courseRes = await api.get(`/courses/${sessionData.course_id}`);
        return { ...sessionData, course: courseRes.data };
      }
      return sessionData;
    },
    retry: 1,
  });

  // 2. Fetch Live Attendance — initially loads, then updated via WebSocket
  const { data: attendance = [] } = useQuery<AttendanceRecord[]>({
    queryKey: ['session-attendance', session?.id],
    queryFn: async () => {
      if (!session?.id) return [];
      const res = await api.get(`/attendance/session/${session.id}`);
      return res.data;
    },
    enabled: !!session?.id,
    // refetchInterval removed in favor of WebSockets
  });

  // WebSocket for Real-time Updates
  useEffect(() => {
    if (!session?.id) return;

    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;
    let isComponentMounted = true;
    let reconnectAttempts = 0;

    const connectToWebSocket = () => {
      if (!isComponentMounted) return;
      
      const authToken = localStorage.getItem('geoattend_token');
      if (!authToken) {
        toast.error("Not authenticated for live feed.");
        return;
      }

      // Derive WS URL from API URL
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      const wsUrl = apiUrl.replace(/^http/, 'ws') + `/sessions/${session.id}/ws?token=${encodeURIComponent(authToken)}`;
      
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        reconnectAttempts = 0; // Reset on success
        console.log("📡 WebSocket connected to:", wsUrl);
        toast.info("Attendance feed connected.", {
          icon: <Signal className="w-4 h-4 text-emerald-500" />,
          id: 'ws-connection'
        });
      };

      ws.onmessage = (event) => {
        console.log("📥 WS Message received:", event.data);
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'attendance_recorded') {
            const newRecord: AttendanceRecord = {
              id: Date.now(),
              student_id: message.student.id,
              student_name: message.student.name,
              student_code: message.student.student_id,
              timestamp: message.student.timestamp,
              status: message.student.status,
              section: message.student.section,
            };

            // Optimistically update the query cache
            queryClient.setQueryData(['session-attendance', session.id], (old: AttendanceRecord[] | undefined) => {
              const list = old || [];
              if (list.some(r => r.student_id === newRecord.student_id)) return list;
              return [...list, newRecord];
            });

            toast.success(`📡 ${newRecord.student_name} just checked in!`, {
              description: `ID: ${newRecord.student_code}`,
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            });
          }
        } catch (err) {
          console.error("WebSocket message error:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
        if (reconnectAttempts === 0) {
          toast.error("Feed connection lost. Reconnecting...", { id: 'ws-connection' });
        }
      };

      ws.onclose = (event) => {
        console.log(`🔌 WebSocket disconnected (code: ${event.code}). Retrying...`);
        if (isComponentMounted) {
          reconnectAttempts++;
          // Exponential backoff up to 10 seconds
          const delay = Math.min(1000 * Math.pow(1.5, reconnectAttempts), 10000);
          reconnectTimer = setTimeout(connectToWebSocket, delay);
        }
      };
    };

    connectToWebSocket();

    return () => {
      isComponentMounted = false;
      clearTimeout(reconnectTimer);
      if (ws) {
        ws.close();
      }
    };
  }, [session?.id, queryClient]);

  // 3. Fetch All Enrolled Students (for manual marking)
  const { data: enrolledStudents = [], isLoading: isLoadingEnrolled } = useQuery<SessionStudent[]>({
    queryKey: ['session-students', session?.id],
    queryFn: async () => {
      if (!session?.id) return [];
      const res = await api.get(`/sessions/${session.id}/students`);
      return res.data;
    },
    enabled: !!session?.id && isManageOpen,
  });

  // 4. Mutation: Manual Mark
  const manualMarkMutation = useMutation({
    mutationFn: async ({ studentId, status }: { studentId: number, status: string }) => {
      if (!session?.id) return;
      return await api.post('/attendance/manual', {
        session_id: session.id,
        student_id: studentId,
        status: status,
      });
    },
    onSuccess: () => {
      toast.success('Attendance recorded manually.');
      queryClient.invalidateQueries({ queryKey: ['session-attendance', session?.id] });
      queryClient.invalidateQueries({ queryKey: ['session-students', session?.id] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to record attendance.');
    }
  });

  // Filtered enrolled students for search
  const filteredStudents = useMemo(() => {
    return enrolledStudents.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.student_id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [enrolledStudents, searchQuery]);

  // 5. Mutation: Stop Session
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

  // Keep current time updated for session expiry logic and token countdown.
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 500);
    return () => clearInterval(interval);
  }, [session?.id]);

  // Initialize token + expiry whenever the server rotates it.
  useEffect(() => {
    const token = session?.active_qr_token;
    const expiresIn = session?.active_qr_token_expires_in_seconds;
    if (!token || typeof expiresIn !== "number") return;

    setActiveToken(token);
    setTokenExpiresAtMs(Date.now() + expiresIn * 1000);
  }, [session?.active_qr_token, session?.active_qr_token_expires_in_seconds]);

  // Drive token countdown/progress based on the server-provided expiry.
  useEffect(() => {
    if (!tokenExpiresAtMs) return;
    const secondsLeft = Math.max(0, Math.ceil((tokenExpiresAtMs - currentTime.getTime()) / 1000));
    setQrTimeLeft(secondsLeft);

    const elapsedInWindow = ROTATION_INTERVAL - secondsLeft;
    const progress = (elapsedInWindow / ROTATION_INTERVAL) * 100;
    setRotationProgress(Math.max(0, Math.min(100, progress)));
  }, [currentTime, tokenExpiresAtMs]);

  // Refresh token when it expires (prevents drift without re-deriving from the secret seed).
  const tokenRefreshInFlight = useRef(false);
  useEffect(() => {
    if (!tokenExpiresAtMs || !session?.id) return;
    if (qrTimeLeft > 0) return;
    if (isFetchingSession || tokenRefreshInFlight.current) return;

    tokenRefreshInFlight.current = true;
    refetch()
      .catch(() => {
        // keep existing token state until the next successful refresh
      })
      .finally(() => {
        tokenRefreshInFlight.current = false;
      });
  }, [qrTimeLeft, tokenExpiresAtMs, isFetchingSession, session?.id, refetch]);

  // Handle Automatic Session Termination
  const hasAutoTerminated = useRef(false);
  const timeLeft = (() => {
    if (!session?.end_time) return null;
    try {
      // Force UTC parsing by appending 'Z' if missing
      const endStr = session.end_time.endsWith('Z') ? session.end_time : `${session.end_time}Z`;
      const end = new Date(endStr).getTime();
      if (isNaN(end)) return null;
      const now = currentTime.getTime();
      return Math.max(0, Math.floor((end - now) / 1000));
    } catch (e) {
      console.error("Error calculating timeLeft:", e);
      return null;
    }
  })();

  useEffect(() => {
    // Only terminate if we have a valid timeLeft of 0, AND we are NOT currently fetching/loading data
    // This prevents stale cache from accidentally triggering termination for an old session
    if (
      timeLeft === 0 && 
      session?.id && 
      !isLoadingSession && 
      !isFetchingSession &&
      !hasAutoTerminated.current && 
      !stopSessionMutation.isPending
    ) {
      hasAutoTerminated.current = true;
      toast.info("Session time expired. Closing session...");
      stopSessionMutation.mutate();
    }
  }, [timeLeft, session?.id, isLoadingSession, isFetchingSession, stopSessionMutation]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoadingSession) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Loading Session...</p>
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto text-primary">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter uppercase italic">No Active Session</h2>
        <p className="text-slate-500 font-semibold">There is no attendance session currently active in the secure zone.</p>
        <Button onClick={() => navigate('/sessions/new')} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest gap-3">
          <Activity className="w-5 h-5" />
          Start Session
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
                  {session.topic || session.course?.name || 'Course Session'}
                </CardTitle>
                <CardDescription className="font-bold text-xs uppercase tracking-widest text-slate-400 mt-1">
                  {session.course?.code || 'CS-XXX'} • {session.room}
                </CardDescription>
                {session.notes && (
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                    <p className="text-[10px] items-center gap-2 flex font-black text-slate-400 uppercase tracking-widest mb-1">
                      <Signal className="w-3 h-3 text-primary" /> Session Instructions
                    </p>
                    <p className="text-sm font-semibold text-slate-700 italic">"{session.notes}"</p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center p-10 bg-gradient-to-b from-white to-slate-50/50">
              <div className="relative group p-6 bg-white rounded-[2.5rem] shadow-2xl border border-indigo-50 transition-all hover:scale-105 duration-500">
                <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <QRCodeSVG 
                  value={JSON.stringify({
                    s: session.id,
                    t: activeToken,
                    ts: Math.floor(currentTime.getTime() / 1000)
                  })} 
                  size={260}
                  level="H"
                  includeMargin={true}
                  className="relative z-10"
                />
                {/* Rotation Progress Bar */}
                <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] overflow-hidden">
                   <div 
                     className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-primary to-indigo-400 transition-all duration-500 ease-linear rounded-full"
                     style={{ width: `${rotationProgress}%` }}
                   />
                </div>
              </div>
              
              <div className="text-center space-y-2 my-10 relative">
                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-3 ml-1">Attendance Code</h3>
                <div className="text-5xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-indigo-800 tabular-nums font-mono">
                  {activeToken || 'CODE'}
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest tabular-nums">
                    Refresh in {Math.floor(qrTimeLeft / 60)}:{String(qrTimeLeft % 60).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 w-full">
                <div className="flex flex-col items-center p-6 rounded-[2rem] bg-white border border-indigo-50 shadow-sm transition-all hover:shadow-md">
                  <div className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-widest">Time Remaining</div>
                  <div className={cn(
                    "text-3xl font-black tabular-nums tracking-tight",
                    timeLeft !== null && timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-900'
                  )}>
                    {formatTime(timeLeft ?? 0)}
                  </div>
                </div>
                <div className="flex flex-col items-center p-6 rounded-[2rem] bg-white border border-indigo-50 shadow-sm transition-all hover:shadow-md">
                  <div className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-widest">Students Present</div>
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
                End Session
              </Button>
              <div className="flex items-center justify-center gap-2 opacity-40">
                 <ShieldCheck className="w-3 h-3 text-emerald-500" />
                 <p className="text-[9px] font-black uppercase tracking-tighter text-slate-600">
                   Attendance verification is active
                 </p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-10 rounded-[2.5rem] border-indigo-50/50 bg-white/40 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10" />
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-3">
              <Signal className="w-4 h-4 text-primary" />
              Session Security
            </h3>
            <div className="space-y-6">
               <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Location Check</span>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-600 border-none text-[9px] font-black">ENFORCED</Badge>
               </div>
               <div className="flex justify-between items-center group">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-purple-500/10 rounded-xl text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                       <ArrowRightLeft className="w-4 h-4" />
                     </div>
                     <span className="text-xs font-black uppercase tracking-widest text-slate-500">Security Protocol</span>
                   </div>
                   <Badge className="bg-purple-500/10 text-purple-600 border-none text-[9px] font-black">HMAC-SHA256</Badge>
                </div>
                <div className="flex justify-between items-center group pt-2 border-t border-indigo-50/50">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                       <Sparkles className="w-4 h-4" />
                     </div>
                     <span className="text-xs font-black uppercase tracking-widest text-slate-500">Token Rotation</span>
                   </div>
                   <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black">2-MIN WINDOW</Badge>
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
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Real-time Attendance Feed</p>
              </div>
              <div className="flex gap-4">
                 <div className="hidden sm:flex flex-col items-end gap-1 px-6 py-3 bg-white/60 border border-indigo-50 rounded-2xl shadow-sm">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Present</span>
                    <span className="font-black text-xl text-primary">{attendance.length} Verified</span>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto max-h-[800px] custom-scrollbar">
              <Table>
                <TableHeader className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-md border-b">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="py-6 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Student</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sec</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Student ID</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time</TableHead>
                    <TableHead className="text-right px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <div className="flex items-center justify-end gap-4">
                        Status
                        <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 rounded-lg border-primary/20 bg-primary/5 text-primary text-[9px] font-black uppercase transition-all hover:bg-primary hover:text-white">
                              <Plus className="w-3 h-3 mr-1" /> Manage
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                            <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                                  <UserCheck className="w-8 h-8 text-primary" />
                                  Manual Attendance
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
                                  Manually mark attendance for students.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-8 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input 
                                  placeholder="Search by name or ID..." 
                                  className="bg-white/10 border-white/10 h-14 pl-12 rounded-2xl font-black text-xs uppercase tracking-[0.2em] placeholder:text-slate-600 focus-visible:ring-primary/50"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                />
                             </div>
                          </div>
                          <div className="bg-white p-4 max-h-[500px] overflow-auto custom-scrollbar">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-none hover:bg-transparent bg-slate-50/50">
                                  <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400 py-4">Student</TableHead>
                                  <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Sec</TableHead>
                                  <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">ID</TableHead>
                                  <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {isLoadingEnrolled ? (
                                  <TableRow>
                                    <TableCell colSpan={3} className="text-center py-20">
                                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary opacity-20" />
                                    </TableCell>
                                  </TableRow>
                                ) : filteredStudents.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={3} className="text-center py-20 text-slate-400 font-bold italic text-sm">
                                      No students found.
                                    </TableCell>
                                  </TableRow>
                                  ) : filteredStudents.map((s) => (
                                    <TableRow key={s.id} className="group border-b border-slate-50">
                                      <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-xs shadow-sm">
                                            {s.name.charAt(0)}
                                          </div>
                                          <span className="font-black text-slate-800 text-sm">{s.name}</span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="py-4">
                                        <Badge variant="outline" className="text-[9px] font-black border-slate-200">
                                          {s.section || '-'}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="font-mono text-[10px] font-black text-slate-400">
                                        {s.student_id || 'N/A'}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {s.status === 'present' ? (
                                          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-none px-4 py-2 rounded-xl font-black tracking-widest text-[9px] uppercase">
                                            VERIFIED
                                          </Badge>
                                        ) : (
                                          <Button 
                                            size="sm" 
                                            className="rounded-xl h-10 px-4 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20"
                                            onClick={() => manualMarkMutation.mutate({ studentId: s.id, status: 'present' })}
                                            disabled={manualMarkMutation.isPending}
                                          >
                                            {manualMarkMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Mark Present"}
                                          </Button>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((student) => (
                    <TableRow key={student.id} className="group border-b border-indigo-50/30 transition-all hover:bg-primary/[0.02] animate-in slide-in-from-right-4 duration-500">
                      <TableCell className="py-6 px-6">
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
                      <TableCell className="py-6 px-6">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-[9px] font-black">
                          {student.section || 'ALL'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-[10px] font-black text-slate-400 tracking-tighter uppercase">
                        {student.student_code || 'ID-UNKNOWN'}
                      </TableCell>
                      <TableCell className="text-slate-500 font-bold">
                        <div className="flex items-center gap-2 tabular-nums">
                          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                          {new Date(student.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-6">
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
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Waiting for Students</p>
                    <p className="text-sm font-bold opacity-30 mt-2 italic">Waiting for students to check in...</p>
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
