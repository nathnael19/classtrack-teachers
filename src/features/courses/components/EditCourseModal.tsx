import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Edit2, 
  Loader2, 
  BookOpen, 
  Fingerprint, 
  X,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { toast } from 'sonner';

const courseSchema = z.object({
  name: z.string().min(3, 'Course name must be at least 3 characters'),
  code: z.string().min(2, 'Course code must be at least 2 characters'),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface EditCourseModalProps {
  course: {
    id: number;
    name: string;
    code: string;
  };
}

export const EditCourseModal = ({ course }: EditCourseModalProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: course.name,
      code: course.code,
    },
  });

  // Reset form when course or open state changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: course.name,
        code: course.code,
      });
    }
  }, [course, open, form]);

  const mutation = useMutation({
    mutationFn: async (values: CourseFormValues) => {
      return (await api.put(`/courses/${course.id}`, values)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setOpen(false);
      toast.success('Module parameters recalibrated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Recalibration failure.');
    }
  });

  const onSubmit = (values: CourseFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex w-full items-center gap-4 py-4 px-4 rounded-xl cursor-pointer hover:bg-primary/5 transition-colors group/item">
          <Edit2 className="w-5 h-5 text-muted-foreground group-hover/item:text-primary transition-colors" /> 
          <span className="font-black text-sm uppercase tracking-wider">Modify Params</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white focus:outline-none focus:ring-0">
        {/* Premium Header Section */}
        <div className="relative p-10 pb-6 overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <Button 
               variant="ghost" 
               size="icon" 
               onClick={() => setOpen(false)}
               className="rounded-full h-10 w-10 hover:bg-black/5 text-slate-400"
             >
                <X className="w-5 h-5" />
             </Button>
          </div>

          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative space-y-6">
            <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <Zap className="w-8 h-8 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">Parameter Recalibration</Badge>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID-{course.id}</span>
              </div>
              <DialogTitle className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                Modify Params
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-semibold text-lg max-w-sm">
                Adjust the strategic operational limits for this academic module.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-10 pb-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="flex items-center justify-between ml-1">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Strategic Title</FormLabel>
                        <BookOpen className="w-3 h-3 text-primary/40" />
                      </div>
                      <FormControl>
                        <div className="relative group">
                          <Input 
                            placeholder="e.g. Quantum Computing & Ethics" 
                            className="h-16 rounded-2xl bg-slate-50 border-slate-100 px-6 shadow-inner focus-visible:ring-4 focus-visible:ring-primary/5 font-bold text-slate-900 transition-all group-hover:bg-white group-hover:border-primary/20 placeholder:text-slate-300"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-black tracking-widest text-destructive ml-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="flex items-center justify-between ml-1">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">System Identifier</FormLabel>
                        <Fingerprint className="w-3 h-3 text-primary/40" />
                      </div>
                      <FormControl>
                        <div className="relative group">
                          <Input 
                            placeholder="e.g. QC-702-X" 
                            className="h-16 rounded-2xl bg-slate-50 border-slate-100 px-6 shadow-inner focus-visible:ring-4 focus-visible:ring-primary/5 font-mono font-black text-slate-900 transition-all group-hover:bg-white group-hover:border-primary/20 placeholder:text-slate-300 uppercase"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-black tracking-widest text-destructive ml-1" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 flex flex-col gap-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 leading-tight">
                    Confirming these changes will immediately update all related system instances and database projections.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 text-slate-500"
                  >
                    Abort Phase
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={mutation.isPending}
                    className="flex-[2] h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-900/20 gap-3 border-b-4 border-slate-700 active:border-b-0 active:translate-y-1 transition-all text-white"
                  >
                    {mutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Commit Recalibration
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
