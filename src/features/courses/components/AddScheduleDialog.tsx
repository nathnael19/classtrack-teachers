import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/services/api';

const formSchema = z.object({
  section: z.string().min(1, "Section is required"),
  day_of_week: z.string().min(1, "Day is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  room: z.string().min(1, "Room is required"),
});

interface Room {
  id: number;
  name: string;
  building?: string;
}

interface AddScheduleDialogProps {
  courseId: string | number;
  onSuccess: () => void;
}

export const AddScheduleDialog = ({ courseId, onSuccess }: AddScheduleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const { data } = await api.get('/rooms/');
        setRooms(data);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      }
    }
    if (open) {
      fetchRooms();
    }
  }, [open]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      section: '',
      day_of_week: '0',
      start_time: '09:00',
      end_time: '10:30',
      room: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await api.post(`/courses/${courseId}/schedules`, {
        ...values,
        day_of_week: parseInt(values.day_of_week),
        // Ensure times are in HH:mm:ss format for backend if it expects time object
        start_time: values.start_time,
        end_time: values.end_time,
      });
      setOpen(false);
      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Failed to add schedule:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="mt-8 rounded-2xl h-14 px-10 shadow-lg shadow-primary/20 font-black text-xs uppercase tracking-widest gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Add recurring slot
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[32px] p-8 border-indigo-50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-[#1E3A8A] font-['FiraCode']">New Tactical Slot</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Target Section</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. CS-1A" {...field} className="h-12 rounded-xl border-indigo-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="day_of_week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Deployment Day</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border-indigo-100">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-indigo-50">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                          <SelectItem key={i} value={i.toString()}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} className="h-12 rounded-xl border-indigo-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} className="h-12 rounded-xl border-indigo-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Operational Room</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl border-indigo-100">
                        <SelectValue placeholder="Select facility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-indigo-50">
                      {rooms.length === 0 ? (
                        <SelectItem disabled value="no-rooms">No facilities available</SelectItem>
                      ) : (
                        rooms.map((room) => (
                          <SelectItem key={room.id} value={room.name}>{room.building ? `${room.building} - ${room.name}` : room.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-8">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest bg-primary shadow-lg shadow-primary/20"
              >
                {isSubmitting ? 'Syncing...' : 'Deploy Tactical Slot'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
