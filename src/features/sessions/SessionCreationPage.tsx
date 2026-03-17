import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Play, 
  Clock, 
  MapPin, 
  Loader2,
  Sparkles,
  History,
  Target,
  FlaskConical,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

const formSchema = z.object({
  courseId: z.string().min(1, 'Please select a course'),
  room: z.string().min(1, 'Please select a classroom'),
  duration: z.string().min(1, 'Duration is required'),
  radius: z.string().min(1, 'Geofence radius is required'),
});

interface Course {
  id: number;
  name: string;
  code: string;
}

interface Room {
  id: number;
  name: string;
  building: string;
  latitude: number;
  longitude: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  default_session_duration: number;
  default_session_radius: number;
}

interface SessionContext {
  last_course: string;
  success_rate: string;
  total_scans: number;
  outliers: number;
}

const SessionCreationPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // --- Queries ---
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => (await api.get('/courses/')).data,
  });

  const { data: rooms = [], isLoading: isLoadingRooms } = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: async () => (await api.get('/rooms/')).data,
  });

  const { data: context } = useQuery<SessionContext>({
    queryKey: ['session-context'],
    queryFn: async () => (await api.get('/analytics/session-context')).data,
  });

  // --- Mutation ---
  const createSessionMutation = useMutation({
    mutationFn: async (payload: any) => {
      return (await api.post('/sessions/', payload)).data;
    },
    onSuccess: () => {
      toast.success('Attendance session started successfully!');
      queryClient.invalidateQueries({ queryKey: ['active-session'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      navigate('/sessions/live');
    },
    onError: () => {
      toast.error('Failed to start session. Please verify parameters.');
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: '',
      room: '',
      duration: '60',
      radius: '50',
    },
  });

  const { data: user } = useQuery<User>({
    queryKey: ['user-me'],
    queryFn: async () => (await api.get('/users/me')).data,
  });

  useEffect(() => {
    if (user) {
      form.reset({
        ...form.getValues(),
        duration: user.default_session_duration.toString(),
        radius: user.default_session_radius.toString(),
      });
    }
  }, [user, form.reset]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + parseInt(values.duration) * 60000);
    
    // Find the selected room to get its telemetry
    const selectedRoom = rooms.find(r => r.name === values.room);
    
    const payload = {
      course_id: parseInt(values.courseId),
      room: values.room,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      qr_code_content: `SECURE-SESSION-${values.courseId}-${startTime.getTime()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
      latitude: selectedRoom?.latitude || 0,
      longitude: selectedRoom?.longitude || 0,
      geofence_radius: parseFloat(values.radius),
    };

    createSessionMutation.mutate(payload);
  };

  if (isLoadingCourses || isLoadingRooms) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Synchronizing Session Parameters...</p>
      </div>
    );
  }

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto px-4 pb-20">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 -left-20 w-[35rem] h-[35rem] bg-indigo-500/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-[30rem] h-[30rem] bg-emerald-500/5 rounded-full blur-[100px] -z-10" />

      <div className="mb-16 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Sparkles className="w-3 h-3" />
          Protocol Initializer
        </div>
        <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-none">
          Initialize <span className="italic text-primary">Session</span>
        </h1>
        <p className="text-slate-500 mt-4 text-xl font-semibold max-w-2xl mx-auto">
          Orchestrate real-time attendance vectors through multi-channel biometric identification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <div className="glass-card rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-500/5 border-indigo-50/50">
                <div className="px-12 py-10 border-b border-indigo-50/50 bg-white/40 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">
                        Session Profile
                      </h2>
                      <p className="text-sm text-slate-400 mt-2 font-bold uppercase tracking-widest">Temporal & Spatial Calibration</p>
                    </div>
                    <div className="w-16 h-1 bg-gradient-to-r from-primary to-transparent rounded-full" />
                  </div>
                </div>
                
                <CardContent className="p-12 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <FormField
                      control={form.control}
                      name="courseId"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Academic Module</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-16 bg-slate-50 border-none rounded-[1.25rem] px-6 shadow-inner focus:ring-4 focus:ring-primary/5 transition-all font-black text-slate-900 group">
                                <SelectValue placeholder="Identify Module..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-[1.5rem] border-indigo-50/50 backdrop-blur-2xl bg-white/95 p-3 shadow-2xl animate-in zoom-in-95 duration-200">
                              {courses.map((course) => (
                                <SelectItem key={course.id} value={course.id.toString()} className="rounded-xl py-4 font-black text-sm uppercase tracking-wide group focus:bg-primary focus:text-white mb-1">
                                  <div className="flex flex-col">
                                    <span>{course.name}</span>
                                    <span className="text-[9px] opacity-40 group-focus:opacity-100 font-mono tracking-tighter mt-1">{course.code}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[9px] font-black uppercase tracking-widest text-destructive" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="room"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Facility Designation</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-16 bg-slate-50 border-none rounded-[1.25rem] px-6 shadow-inner focus:ring-4 focus:ring-primary/5 transition-all font-black text-slate-900">
                                <SelectValue placeholder="Assign Infrastructure..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-[1.5rem] border-indigo-50/50 backdrop-blur-2xl bg-white/95 p-3 shadow-2xl animate-in zoom-in-95 duration-200">
                              {rooms.map((room) => (
                                <SelectItem key={room.id} value={room.name} className="rounded-xl py-4 font-black text-sm uppercase tracking-wide focus:bg-primary focus:text-white mb-1">
                                  <div className="flex items-center gap-3">
                                     <Building className="w-4 h-4 opacity-40" />
                                     <div className="flex flex-col">
                                        <span>{room.name}</span>
                                        <span className="text-[9px] opacity-40 tracking-tighter">{room.building}</span>
                                     </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[9px] font-black uppercase tracking-widest text-destructive" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Temporal Window (MINS)</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute left-5 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-50 rounded-xl text-indigo-500 group-focus-within:bg-primary group-focus-within:text-white transition-all shadow-sm">
                                <Clock className="w-4 h-4" />
                              </div>
                              <Input 
                                type="number" 
                                className="pl-20 h-16 bg-slate-50 border-none rounded-[1.25rem] shadow-inner focus-visible:ring-4 focus-visible:ring-primary/5 font-black text-xl text-slate-900" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[9px] font-black uppercase tracking-widest text-destructive" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="radius"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Geofence Perimeter (METERS)</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute left-5 top-1/2 -translate-y-1/2 p-2.5 bg-emerald-50 rounded-xl text-emerald-500 group-focus-within:bg-emerald-500 group-focus-within:text-white transition-all shadow-sm">
                                <MapPin className="w-4 h-4" />
                              </div>
                              <Input 
                                type="number" 
                                className="pl-20 h-16 bg-slate-50 border-none rounded-[1.25rem] shadow-inner focus-visible:ring-4 focus-visible:ring-primary/5 font-black text-xl text-slate-900" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-3 ml-2">Satellite authorization threshold.</FormDescription>
                          <FormMessage className="text-[9px] font-black uppercase tracking-widest text-destructive" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                
                <div className="px-12 py-10 border-t border-indigo-50/30 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-8">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => navigate(-1)}
                    className="font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-200/50 h-14 px-8 rounded-2xl"
                  >
                    Abort Sequence
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createSessionMutation.isPending}
                    className="w-full sm:w-auto gap-4 rounded-full px-12 h-16 bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 transition-all font-black text-lg uppercase tracking-wider group border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1"
                  >
                    {createSessionMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Play className="w-5 h-5 fill-current group-hover:scale-125 transition-transform" />
                    )}
                    Deploy Protocol
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="glass-card p-10 rounded-[2.5rem] border-primary/20 bg-primary/[0.03] space-y-8">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-4 text-slate-900 uppercase">
              <div className="p-2.5 bg-primary/10 rounded-2xl text-primary shadow-sm">
                <Target className="w-6 h-6" />
              </div>
              Strategic Intel
            </h3>
            <div className="space-y-8">
              {[
                { id: "01", text: "Ensure high-precision GPS signal synchronization before QR generation phases." },
                { id: "02", text: "Optimal geofence vectors are established between 40-60 meters for interior zones." },
                { id: "03", text: "Continuous biometric monitoring is recommended for high-capacity lecture sessions." }
              ].map((item) => (
                <div key={item.id} className="flex gap-5 group">
                  <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-xs text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {item.id}
                  </div>
                  <p className="text-sm font-bold text-slate-500 leading-relaxed pt-1.5">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-10 rounded-[2.5rem] bg-indigo-900 text-white space-y-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/20 rounded-full blur-xl -ml-10 -mb-10" />
            
            <div className="relative flex flex-col items-center gap-4 border-b border-white/10 pb-8">
               <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                 <History className="w-6 h-6 text-primary" />
               </div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Historical Performance</h3>
            </div>
            
            <div className="relative space-y-8">
              <div className="flex justify-between items-center bg-white/5 p-6 rounded-[1.5rem] border border-white/10 group hover:bg-white/10 transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest">Last Vector</span>
                  <span className="font-black text-2xl tracking-tighter">{context?.last_course || '...'}</span>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                   <FlaskConical className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                 <div className="p-6 bg-white/5 rounded-[1.5rem] border border-white/10 flex flex-col items-center gap-1 group hover:bg-white/10 transition-colors">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Success</span>
                    <span className="font-black text-2xl text-emerald-400">{context?.success_rate || '0%'}</span>
                 </div>
                 <div className="p-6 bg-white/5 rounded-[1.5rem] border border-white/10 flex flex-col items-center gap-1 group hover:bg-white/10 transition-colors">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Scans</span>
                    <span className="font-black text-2xl text-white">{context?.total_scans || 0}</span>
                 </div>
              </div>

               <div className="p-6 bg-primary/10 rounded-[1.5rem] border border-primary/20 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                     <span className="text-[9px] font-black text-primary uppercase tracking-widest">Anomalies Detected</span>
                     <span className="font-black text-xl text-white">{context?.outliers || 0} Outliers</span>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCreationPage;
