import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Plus,
  Loader2,
  BookOpen,
  Fingerprint,
  Sparkles,
  X,
  ShieldCheck,
  Zap
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

const courseSchema = z.object({
  name: z.string().min(3, 'Course name must be at least 3 characters'),
  code: z.string().min(2, 'Course code must be at least 2 characters'),
  description: z.string().optional(),
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
      description: '',
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
        <Button className="w-full md:w-auto gap-4 rounded-2xl px-10 h-14 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 text-sm font-black uppercase tracking-widest border-b-4 border-indigo-700 active:border-b-0 group">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
          Deploy Module
        </Button>
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
            <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">Course Setup</Badge>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">v1.2.0</span>
              </div>
              <DialogTitle className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                Create Course
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-semibold text-lg max-w-sm">
                Create a new course to manage attendance and student engagement.
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
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Course Name</FormLabel>
                        <BookOpen className="w-3 h-3 text-primary/40" />
                      </div>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            placeholder="e.g. Quantum Computing & Ethics"
                            className="h-16 rounded-2xl bg-slate-50 border-slate-100 px-6 shadow-inner focus-visible:ring-4 focus-visible:ring-primary/5 font-bold text-slate-900 transition-all group-hover:bg-white group-hover:border-primary/20 placeholder:text-slate-300"
                            {...field}
                          />
                          <div className="absolute inset-y-0 right-6 flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-focus-within:bg-primary transition-colors" />
                          </div>
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
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Course Code</FormLabel>
                        <Fingerprint className="w-3 h-3 text-primary/40" />
                      </div>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            placeholder="e.g. QC-702-X"
                            className="h-16 rounded-2xl bg-slate-50 border-slate-100 px-6 shadow-inner focus-visible:ring-4 focus-visible:ring-primary/5 font-mono font-black text-slate-900 transition-all group-hover:bg-white group-hover:border-primary/20 placeholder:text-slate-300 uppercase"
                            {...field}
                          />
                          <div className="absolute inset-y-0 right-6 flex items-center">
                            <Zap className="w-4 h-4 text-slate-200 group-focus-within:text-emerald-500 transition-colors" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-black tracking-widest text-destructive ml-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="flex items-center justify-between ml-1">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Description</FormLabel>
                      </div>
                      <FormControl>
                        <div className="relative group">
                          <textarea
                            placeholder="Optional context or syllabus summary..."
                            className="w-full min-h-[100px] rounded-2xl bg-slate-50 border-slate-100 p-6 shadow-inner focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/5 font-bold text-slate-900 transition-all group-hover:bg-white group-hover:border-primary/20 placeholder:text-slate-300 resize-none"
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
                    By initializing this module, you confirm strict adherence to the academic protocol and resource allocation guidelines.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 text-slate-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex-[2] h-14 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 gap-3 border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 transition-all"
                  >
                    {mutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Create Course
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
