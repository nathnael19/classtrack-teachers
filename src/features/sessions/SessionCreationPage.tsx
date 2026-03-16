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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Generate QR Session</h1>
        <p className="text-muted-foreground mt-2">Configure and start a new real-time attendance session.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Session Details</CardTitle>
                  <CardDescription>Select the course and classroom for this session.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="courseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a course" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {courses.map((course) => (
                                <SelectItem key={course.id} value={course.id.toString()}>
                                  {course.name} ({course.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="room"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Classroom</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a classroom" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="LH1">Lecture Hall 1</SelectItem>
                              <SelectItem value="Lab3">Computer Lab 3</SelectItem>
                              <SelectItem value="R204">Room 204</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session Duration (minutes)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              <Input type="number" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="radius"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Geofence Radius (meters)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              <Input type="number" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>Max distance for student scanning.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/20 px-6 py-4 flex justify-between">
                  <Button type="button" variant="outline">Save as Draft</Button>
                  <Button type="submit" className="gap-2">
                    <Play className="w-4 h-4 fill-current" />
                    Start Session
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>

        <div className="space-y-6">
          <Card className="border shadow-sm bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3 text-muted-foreground">
              <p>• Ensure your GPS coordinates are accurate for the selected classroom.</p>
              <p>• We recommend a radius of at least 30m for indoor classrooms.</p>
              <p>• Students must have the mobile app installed and Location enabled.</p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Last Session Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Course</span>
                <span className="font-medium">CS101</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Attendance</span>
                <span className="font-medium text-green-600">94.2%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Scans</span>
                <span className="font-medium">113 / 120</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SessionCreationPage;
