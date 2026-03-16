import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/services/api';

const courseSchema = z.object({
  name: z.string().min(3, 'Course name must be at least 3 characters'),
  code: z.string().min(2, 'Course code must be at least 2 characters'),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export const CreateCourseModal = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: '',
      code: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: CourseFormValues) => {
      return (await api.post('/courses/', values)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setOpen(false);
      form.reset();
    },
  });

  const onSubmit = (values: CourseFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto gap-4 rounded-2xl px-10 h-14 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 text-sm font-black uppercase tracking-widest border-b-4 border-indigo-700 active:border-b-0">
          <Plus className="w-5 h-5" strokeWidth={3} />
          Deploy Module
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-indigo-50/50 backdrop-blur-3xl bg-white/90 p-8 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-10 bg-primary rounded-full" />
            <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic">Deploy New Module</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground font-semibold">
            Provision a new academic module within the Classtrack ecosystem.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">Module Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Advanced Neural Architectures" 
                      className="h-14 rounded-2xl bg-white/60 border-indigo-50 shadow-inner focus-visible:ring-4 focus-visible:ring-primary/5 font-bold"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] uppercase font-black tracking-widest" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">Universal Identifier (Code)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. CS-402-AI" 
                      className="h-14 rounded-2xl bg-white/60 border-indigo-50 shadow-inner focus-visible:ring-4 focus-visible:ring-primary/5 font-mono font-black"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] uppercase font-black tracking-widest" />
                </FormItem>
              )}
            />
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="flex-1 h-14 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100"
              >
                Abort
              </Button>
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="flex-[2] h-14 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 gap-3"
              >
                {mutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Initialize Module
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
