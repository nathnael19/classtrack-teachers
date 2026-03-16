import {
  MoreHorizontal,
  Eye,
  Trash2,
  Users,
  Calendar,
  Loader2,
  BookOpen,
  Search,
  Filter,
  Download,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { cn } from '@/lib/utils';
import { CreateCourseModal } from './components/CreateCourseModal';
import { EditCourseModal } from './components/EditCourseModal';
import { EnrollStudentsModal } from './components/EnrollStudentsModal';
import { toast } from 'sonner';

interface Course {
  id: number;
  name: string;
  code: string;
  lecturer_id: number;
  student_count?: number;
  sessions?: number;
  status?: 'Active' | 'Archived';
}

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- Queries ---
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => (await api.get('/courses/')).data,
  });

  // --- Mutations ---
  const decommissionModule = useMutation({
    mutationFn: async (id: number) => {
      return (await api.delete(`/courses/${id}`)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Module decommissioned from active service.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Decommissioning protocol failed.');
    }
  });

  const handleOpenInNewTab = (courseId: number) => {
    window.open(`/analytics?course_id=${courseId}`, '_blank');
  };

  const handleViewAnalytics = (courseId: number) => {
    navigate(`/analytics?course_id=${courseId}`);
  };

  // --- Filtered Data ---
  const filteredCourses = useMemo(() => {
    return courses.filter((course: Course) => 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-primary" />
          <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-muted-foreground font-black tracking-[0.3em] uppercase text-[10px]">Curriculum Pipeline</p>
          <span className="text-sm font-bold opacity-40">Syncing database records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-6 duration-1000 space-y-10">
      {/* Dynamic Background Elements */}
      <div className="absolute -top-40 -left-40 w-[35rem] h-[35rem] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-40 -right-40 w-[30rem] h-[30rem] bg-emerald-500/5 rounded-full blur-[100px] -z-10" />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-10 bg-gradient-to-b from-primary to-indigo-600 rounded-full" />
             <h1 className="text-5xl font-black tracking-tighter text-foreground leading-none">Modules<span className="text-primary/40 text-3xl ml-2 font-black italic">PRO</span></h1>
          </div>
          <p className="text-muted-foreground font-semibold text-lg max-w-xl">
            Surgical control over your academic curriculum and student engagement vectors.
          </p>
        </div>
        <CreateCourseModal />
      </header>

      <div className="glass-card rounded-[3rem] overflow-hidden border-indigo-50/30 shadow-2xl shadow-indigo-500/5">
        <div className="p-10 border-b border-indigo-50/50 bg-white/40 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="relative w-full md:w-[28rem] group">
            <Search className="w-5 h-5 text-muted-foreground/40 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-all duration-300" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query by title or module code..."
              className="pl-14 h-14 bg-white/60 border-indigo-50 rounded-2xl shadow-inner focus-visible:ring-4 focus-visible:ring-primary/5 placeholder:text-muted-foreground/40 text-sm font-black"
            />
            {searchQuery && (
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary/40 uppercase tracking-widest">
                Searching...
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-2xl h-14 px-8 border-indigo-100 hover:bg-primary/5 gap-3 font-black text-xs uppercase tracking-widest group transition-all">
              <Filter className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              Intelligence
            </Button>
            <Button variant="outline" className="rounded-2xl h-14 px-8 border-indigo-100 hover:bg-primary/5 gap-3 font-black text-xs uppercase tracking-widest group transition-all">
              <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              Export Data
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <Table>
            <TableHeader className="bg-slate-50/50 border-b border-indigo-50/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-10 py-8 font-black uppercase text-[10px] tracking-[0.3em] text-muted-foreground/40 w-[400px]">Strategic Module</TableHead>
                <TableHead className="px-10 py-8 font-black uppercase text-[10px] tracking-[0.3em] text-muted-foreground/40">Identifier</TableHead>
                <TableHead className="px-10 py-8 font-black uppercase text-[10px] tracking-[0.3em] text-muted-foreground/40">Unit Core</TableHead>
                <TableHead className="px-10 py-8 font-black uppercase text-[10px] tracking-[0.3em] text-muted-foreground/40">Temporal</TableHead>
                <TableHead className="px-10 py-8 font-black uppercase text-[10px] tracking-[0.3em] text-muted-foreground/40">Status</TableHead>
                <TableHead className="px-10 py-8 font-black uppercase text-[10px] tracking-[0.3em] text-muted-foreground/40 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-50">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="group hover:bg-indigo-50/30 transition-all duration-500 cursor-pointer">
                  <TableCell className="px-10 py-10">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100/50 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform duration-500">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <Link 
                          to={`/courses/${course.id}`}
                          className="font-black text-xl text-foreground leading-none hover:text-primary transition-colors truncate"
                        >
                          {course.name}
                        </Link>
                        <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-all">
                           <span className="text-[10px] font-black uppercase tracking-widest bg-muted px-2 py-0.5 rounded-md">ID-{course.id}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-300" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Academic Term 2024</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-10">
                    <div className="inline-flex px-4 py-1.5 bg-slate-100/50 rounded-xl font-mono text-xs font-black text-foreground border border-slate-200/50 group-hover:bg-primary group-hover:text-white transition-all">
                      {course.code}
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50/50 flex items-center justify-center text-primary">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-lg">{course.student_count || 0}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Active Students</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50/50 flex items-center justify-center text-emerald-500">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-lg">{course.sessions || 0}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Total Sessions</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-10">
                    <Badge className={cn(
                      "rounded-full px-5 py-2 font-black text-[9px] uppercase tracking-[0.2em] border-none shadow-sm",
                      (course.status || 'Active') === 'Active' 
                        ? "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white"
                        : "bg-slate-100 text-slate-400"
                    )}>
                      {course.status || 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-10 py-10 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm group-hover:shadow-primary/20">
                          <MoreHorizontal className="w-6 h-6" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64 rounded-[1.5rem] border-indigo-50/50 backdrop-blur-2xl bg-white/90 p-3 shadow-2xl animate-in zoom-in-95 duration-200">
                        <DropdownMenuLabel className="px-4 py-3 text-[10px] font-black uppercase text-muted-foreground/40 tracking-[0.3em]">Operational Menu</DropdownMenuLabel>
                        
                        <DropdownMenuItem 
                          onClick={() => handleViewAnalytics(course.id)}
                          className="rounded-xl gap-4 py-4 cursor-pointer hover:bg-primary/5 focus:bg-primary/5 group/item"
                        >
                          <Eye className="w-5 h-5 text-muted-foreground group-hover/item:text-primary transition-colors" /> 
                          <span className="font-black text-sm uppercase tracking-wider">Analytics View</span>
                        </DropdownMenuItem>

                        <EditCourseModal course={course} />

                        <EnrollStudentsModal courseId={course.id} courseName={course.name} />

                        <DropdownMenuItem 
                          onClick={() => handleOpenInNewTab(course.id)}
                          className="rounded-xl gap-4 py-4 cursor-pointer hover:bg-primary/5 focus:bg-primary/5 group/item"
                        >
                          <ExternalLink className="w-5 h-5 text-muted-foreground group-hover/item:text-primary transition-colors" /> 
                          <span className="font-black text-sm uppercase tracking-wider">Open in New Tab</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-3 bg-indigo-50/50" />
                        
                        <DropdownMenuItem 
                          onClick={() => decommissionModule.mutate(course.id)}
                          disabled={decommissionModule.isPending}
                          className="rounded-xl gap-4 py-4 cursor-pointer text-destructive hover:bg-destructive/5 focus:bg-destructive/5"
                        >
                          {decommissionModule.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                          <span className="font-black text-sm uppercase tracking-wider">Decommission Module</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </tr>
              ))}
              {filteredCourses.length === 0 && searchQuery && (
                <tr>
                  <TableCell colSpan={6} className="h-96 text-center">
                    <div className="flex flex-col items-center justify-center gap-6 opacity-30 group animate-in fade-in zoom-in duration-500">
                       <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                         <Search className="w-10 h-10" />
                       </div>
                       <div className="flex flex-col gap-2">
                         <span className="font-black text-2xl uppercase tracking-widest text-foreground">Zero Vectors Found</span>
                         <p className="text-sm font-bold">Your search query returned no active modules.</p>
                       </div>
                       <Button variant="outline" onClick={() => setSearchQuery('')} className="rounded-xl px-10 border-indigo-100 font-black uppercase text-[10px] tracking-widest">Reset Discovery</Button>
                    </div>
                  </TableCell>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-10 border-t border-indigo-50/50 bg-slate-50/30 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 leading-none mb-2">Total Capacity</span>
              <p className="text-sm font-bold text-muted-foreground flex items-center gap-3">
                Monitoring <span className="text-primary font-black px-4 py-1.5 bg-primary/10 rounded-xl text-lg shadow-sm">{filteredCourses.length}</span> live modules
              </p>
            </div>
            <div className="w-[1px] h-12 bg-indigo-50" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 leading-none mb-2">System Status</span>
              <p className="text-xs font-black text-emerald-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                Operational
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="lg" disabled className="rounded-2xl h-14 px-10 border-indigo-100 font-black uppercase text-[10px] tracking-widest opacity-50 shadow-sm">Previous</Button>
            <Button variant="outline" size="lg" className="rounded-2xl h-14 px-10 border-indigo-100 hover:border-primary/30 hover:bg-primary/5 font-black uppercase text-[10px] tracking-widest transition-all shadow-sm active:translate-y-1">Next Phase</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
