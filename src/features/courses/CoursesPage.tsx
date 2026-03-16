import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  Users,
  Calendar
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
import { useEffect, useState } from 'react';
import api from '@/services/api';

interface Course {
  id: number;
  name: string;
  code: string;
  lecturer_id: number;
  students?: number; // Optional for now
  sessions?: number; // Optional for now
  status?: string;   // Optional for now
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-primary/10 rounded-full animate-pulse" />
          </div>
        </div>
        <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs">Syncing Academia...</p>
      </div>
    );
  }

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">Academic Modules</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your course catalog and student engagement.</p>
        </div>
        <Button className="w-full md:w-auto gap-3 rounded-full px-8 h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 font-bold">
          <Plus className="w-5 h-5" />
          Add New Course
        </Button>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/20 bg-white/10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="relative w-full md:w-96 group">
            <Search className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Filter by course title or code..."
              className="pl-12 h-12 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 font-medium"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden md:flex rounded-xl h-10 px-6 border-primary/10 hover:bg-primary/5 font-bold">Filter</Button>
            <Button variant="outline" size="sm" className="hidden md:flex rounded-xl h-10 px-6 border-primary/10 hover:bg-primary/5 font-bold">Export</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/5">
              <TableRow className="hover:bg-transparent border-b border-border/20">
                <TableHead className="px-8 py-6 font-black uppercase text-xs tracking-widest text-muted-foreground w-[350px]">Course Module</TableHead>
                <TableHead className="px-8 py-6 font-black uppercase text-xs tracking-widest text-muted-foreground">Internal Code</TableHead>
                <TableHead className="px-8 py-6 font-black uppercase text-xs tracking-widest text-muted-foreground">Enrollment</TableHead>
                <TableHead className="px-8 py-6 font-black uppercase text-xs tracking-widest text-muted-foreground">Sessions</TableHead>
                <TableHead className="px-8 py-6 font-black uppercase text-xs tracking-widest text-muted-foreground">Lifecycle</TableHead>
                <TableHead className="px-8 py-6 font-black uppercase text-xs tracking-widest text-muted-foreground text-right">Settings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <tr key={course.id} className="group hover:bg-primary/[0.03] transition-all duration-300 border-b border-border/10">
                  <TableCell className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-base group-hover:text-primary transition-colors">{course.name}</span>
                      <span className="text-xs text-muted-foreground mt-0.5 font-medium opacity-60 md:hidden">{course.code}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 hidden md:table-cell">
                    <div className="inline-flex px-3 py-1 bg-muted/30 rounded-lg font-mono text-xs font-bold text-muted-foreground border border-border/20">
                      {course.code}
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="font-bold">{course.students || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="font-bold">{course.sessions || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <Badge variant={(course.status || 'Active') === 'Active' ? 'default' : 'secondary'} className={`rounded-full px-4 py-1 font-bold text-[10px] uppercase tracking-wider ${(course.status || 'Active') === 'Active' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20' : 'bg-muted text-muted-foreground border-transparent'}`}>
                      {course.status || 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-2xl border-primary/10 backdrop-blur-xl bg-white/80 p-2 shadow-2xl">
                        <DropdownMenuLabel className="px-3 py-2 text-xs font-black uppercase text-muted-foreground tracking-widest">Course Menu</DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-xl gap-3 py-3 cursor-pointer hover:bg-primary/5 focus:bg-primary/5 group">
                          <Eye className="w-4 h-4 text-muted-foreground group-hover:text-primary" /> 
                          <span className="font-bold">View History</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl gap-3 py-3 cursor-pointer hover:bg-primary/5 focus:bg-primary/5 group">
                          <Edit2 className="w-4 h-4 text-muted-foreground group-hover:text-primary" /> 
                          <span className="font-bold">Modify Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2 bg-primary/5" />
                        <DropdownMenuItem className="rounded-xl gap-3 py-3 cursor-pointer text-destructive hover:bg-destructive/5 focus:bg-destructive/5 group">
                          <Trash2 className="w-4 h-4" /> 
                          <span className="font-bold">Remove Course</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 opacity-30">
                       <Plus className="w-12 h-12" />
                       <span className="font-bold text-lg">No curriculum items found</span>
                    </div>
                  </TableCell>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-8 border-t border-white/20 bg-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="text-sm font-bold text-muted-foreground">
            Displaying <span className="text-primary font-black px-2 py-1 bg-primary/10 rounded-md">{courses.length}</span> active modules
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" disabled className="rounded-xl h-10 px-6 border-primary/10 font-bold opacity-50">Previous</Button>
            <Button variant="outline" size="sm" className="rounded-xl h-10 px-6 border-primary/10 hover:border-primary/30 hover:bg-primary/5 font-bold transition-all">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
