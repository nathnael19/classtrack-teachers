import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Play, 
  Clock, 
  MapPin, 
  Info
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
import { useEffect, useState } from 'react';
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

const SessionCreationPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: '',
      room: '',
      duration: '60',
      radius: '50',
    },
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses/');
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + parseInt(values.duration) * 60000);
      
      const payload = {
        course_id: parseInt(values.courseId),
        room: values.room,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        qr_code_content: `SESSION-${values.courseId}-${startTime.getTime()}`,
        latitude: 0, // In a real app, this would come from geolocation or classroom data
        longitude: 0,
        geofence_radius: parseFloat(values.radius),
      };

      await api.post('/sessions/', payload);
      toast.success('Attendance session started successfully!');
      navigate('/sessions/live');
    } catch (error) {
      console.error('Failed to create session:', error);
      toast.error('Failed to start session. Please try again.');
    }
  };

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto px-4">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 -left-20 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-20 -right-20 w-[25rem] h-[25rem] bg-emerald-500/5 rounded-full blur-[80px] -z-10" />

      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-primary via-indigo-500 to-emerald-500 bg-clip-text text-transparent pb-2">Initialize Session</h1>
        <p className="text-muted-foreground mt-3 text-lg font-medium opacity-80">Orchestrate a new real-time attendance sequence via digital QR identification.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
                <div className="px-10 py-8 border-b border-white/20 bg-white/5">
                  <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <div className="w-2 h-8 bg-primary rounded-full" />
                    Configuration Profile
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 font-medium italic">Define the spatial and temporal parameters for student verification.</p>
                </div>
                
                <CardContent className="p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="courseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Select Academic Module</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 bg-white/40 border-none rounded-2xl shadow-inner focus:ring-2 focus:ring-primary/20 transition-all font-bold text-base">
                                <SelectValue placeholder="Identify Course..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl border-primary/10 backdrop-blur-xl bg-white/80 p-2">
                              {courses.map((course) => (
                                <SelectItem key={course.id} value={course.id.toString()} className="rounded-xl py-3 font-bold group">
                                  <div className="flex flex-col">
                                    <span>{course.name}</span>
                                    <span className="text-[10px] uppercase opacity-40 font-black tracking-tighter">{course.code}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px] font-bold uppercase tracking-wide" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="room"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Designate Facility</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 bg-white/40 border-none rounded-2xl shadow-inner focus:ring-2 focus:ring-primary/20 transition-all font-bold text-base">
                                <SelectValue placeholder="Assign Classroom..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl border-primary/10 backdrop-blur-xl bg-white/80 p-2">
                              {['Lecture Hall 1', 'Computer Lab 3', 'Research Room 204', 'Main Auditorium'].map((val) => (
                                <SelectItem key={val} value={val} className="rounded-xl py-3 font-bold">
                                  {val}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px] font-bold uppercase tracking-wide" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Temporal Window (MINS)</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-indigo-50 rounded-lg text-indigo-500 group-focus-within:bg-indigo-500 group-focus-within:text-white transition-all">
                                <Clock className="w-4 h-4" />
                              </div>
                              <Input 
                                type="number" 
                                className="pl-16 h-14 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 font-black text-lg" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold uppercase tracking-wide" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="radius"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Geofence Perimeter (METERS)</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-emerald-50 rounded-lg text-emerald-500 group-focus-within:bg-emerald-500 group-focus-within:text-white transition-all">
                                <MapPin className="w-4 h-4" />
                              </div>
                              <Input 
                                type="number" 
                                className="pl-16 h-14 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 font-black text-lg" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter mt-2 ml-1">Maximum authorization distance via satellite.</FormDescription>
                          <FormMessage className="text-[10px] font-bold uppercase tracking-wide" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                
                <div className="px-10 py-8 border-t border-white/20 bg-muted/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <Button type="button" variant="ghost" className="font-bold text-muted-foreground hover:bg-black/5 rounded-xl px-6">
                    Cancel & Revert
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto gap-3 rounded-full px-10 h-14 bg-gradient-to-r from-primary to-indigo-600 hover:scale-105 active:scale-95 shadow-xl shadow-primary/30 transition-all font-black text-lg group">
                    <Play className="w-5 h-5 fill-current group-hover:animate-pulse" />
                    Initialize Sequence
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-8 rounded-[2rem] border-primary/20 bg-primary/[0.02]">
            <h3 className="text-lg font-black tracking-tight flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Info className="w-5 h-5" />
              </div>
              Strategic Insights
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-xs text-primary shrink-0">1</div>
                <p className="text-sm font-bold text-muted-foreground/80 leading-relaxed pt-1">Verify classroom GPS coordinates before starting to ensure geofence precision.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-xs text-primary shrink-0">2</div>
                <p className="text-sm font-bold text-muted-foreground/80 leading-relaxed pt-1">Indoor signals can fluctuate; a radius between 30m - 50m is optimal for consistency.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-xs text-primary shrink-0">3</div>
                <p className="text-sm font-bold text-muted-foreground/80 leading-relaxed pt-1">Instruct students to stabilize their connection before attempting the QR scan phase.</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem]">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 text-center">Historical Context</h3>
            <div className="space-y-5">
              <div className="flex justify-between items-end p-4 bg-muted/20 rounded-2xl border border-white/40">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-muted-foreground/50 uppercase italic mb-1">Last Module</span>
                  <span className="font-black text-lg">CS101</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-emerald-500 uppercase mb-1">Success Rate</span>
                  <span className="font-black text-lg text-emerald-600">94.2%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col items-center">
                    <span className="text-[10px] font-black text-primary/40 uppercase mb-1 text-center">Total Scans</span>
                    <span className="font-black text-xl">113</span>
                 </div>
                 <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col items-center">
                    <span className="text-[10px] font-black text-indigo-400 uppercase mb-1 text-center">Outliers</span>
                    <span className="font-black text-xl text-indigo-600">07</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCreationPage;
