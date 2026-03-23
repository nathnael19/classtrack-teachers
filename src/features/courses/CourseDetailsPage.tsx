import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ChevronLeft, 
  Users, 
  Calendar, 
  TrendingUp, 
  Search, 
  Filter, 
  Download,
  MoreHorizontal,
  Mail,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';

import api from '@/services/api';
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
import { Badge } from '@/components/ui/badge';
import { cn, formatEthiopianTime } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddScheduleDialog } from './components/AddScheduleDialog';

interface StudentActivity {
  id: number;
  name: string;
  student_id: string;
  attendance_count: number;
  total_sessions: number;
  attendance_rate: number;
  last_seen: string | null;
  status: 'Consistent' | 'Moderate' | 'At Risk' | 'Inactive';
  section: string | null;
}

interface CourseSchedule {
  id: number;
  section: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string;
}

interface LecturerBrief {
  id: number;
  name: string;
  email?: string;
}

interface CourseDetail {
  id: number;
  name: string;
  code: string;
  lecturer_id: number;
  student_count: number;
  total_sessions: number;
  average_attendance: number;
  students: StudentActivity[];
  schedules: CourseSchedule[];
  lecturers?: LecturerBrief[];
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const CourseDetailsPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'students' | 'schedule'>('students');
  const [addingLecturerId, setAddingLecturerId] = useState<string>('');

  const { data: course, isLoading, refetch } = useQuery<CourseDetail>({
    queryKey: ['course', id],
    queryFn: async () => {
      const { data } = await api.get(`/courses/${id}`);
      return data;
    },
  });

  const { data: lecturers = [] } = useQuery<User[]>({
    queryKey: ['users-lecturers'],
    queryFn: async () => (await api.get('/users/lecturers')).data,
  });

  const addLecturerMutation = useMutation({
    mutationFn: async (lecturerId: number) => {
      await api.post(`/courses/${id}/lecturers`, { lecturer_id: lecturerId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      setAddingLecturerId('');
    },
  });

  const removeLecturerMutation = useMutation({
    mutationFn: async (lecturerId: number) => {
      await api.delete(`/courses/${id}/lecturers/${lecturerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    },
  });

  const coLecturers = course?.lecturers ?? [];
  const availableLecturers = lecturers.filter(
    (u) => u.id !== course?.lecturer_id && !coLecturers.some((c) => c.id === u.id)
  );

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (!window.confirm("Are you sure you want to delete this schedule slot?")) return;
    try {
      await api.delete(`/courses/schedules/${scheduleId}`);
      refetch();
    } catch (error) {
      console.error('Failed to delete schedule:', error);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!course?.students) return [];
    return course.students.filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [course?.students, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Back Button */}
      <div className="flex flex-col gap-6">
        <Link 
          to="/courses" 
          className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <div className="p-1.5 rounded-lg group-hover:bg-primary/10 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Back to Courses</span>
        </Link>
        
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="rounded-md border-primary/20 text-primary font-mono text-[10px] uppercase tracking-widest px-3 py-1 bg-primary/5">
              Code: {course.code}
            </Badge>
            <h1 className="text-5xl font-black tracking-tight text-foreground">
              {course.name}
            </h1>
            <p className="text-muted-foreground font-semibold">
              Track attendance and student performance in real-time.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <Button variant="outline" className="rounded-2xl h-14 px-8 border-border hover:bg-primary/5 font-black text-xs uppercase tracking-widest gap-2">
               <Download className="w-4 h-4" />
               Export Report
             </Button>
            <Button 
              onClick={() => setActiveTab('schedule')}
              className={cn(
                "rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest gap-2 transition-all",
                activeTab === 'schedule' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-muted-foreground border border-indigo-50 hover:bg-slate-50"
              )}
            >
              <Calendar className="w-4 h-4" />
              Manage Schedule
            </Button>
            {activeTab === 'schedule' && (
              <AddScheduleDialog courseId={id!} onSuccess={() => refetch()} />
            )}
          </div>
        </div>
      </div>

      {/* Co-lecturers Section */}
      <div className="bg-white rounded-[32px] border border-indigo-50 shadow-sm p-8">
        <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Co-Lecturers
        </h3>
        <div className="flex flex-wrap gap-4 items-center">
          {coLecturers.map((lec) => (
            <div
              key={lec.id}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10"
            >
              <span className="font-bold">{lec.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:bg-red-50"
                onClick={() => removeLecturerMutation.mutate(lec.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {availableLecturers.length > 0 && (
            <Select
              value={addingLecturerId}
              onValueChange={(val) => {
                if (val) {
                  addLecturerMutation.mutate(parseInt(val));
                }
              }}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Add co-lecturer" />
              </SelectTrigger>
              <SelectContent>
                {availableLecturers.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('students')}
          className={cn(
            "px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all",
            activeTab === 'students' ? "bg-white text-primary border border-primary/20 shadow-sm" : "text-muted-foreground hover:bg-white/50"
          )}
        >
          Students
        </button>
        <button 
          onClick={() => setActiveTab('schedule')}
          className={cn(
            "px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all",
            activeTab === 'schedule' ? "bg-white text-primary border border-primary/20 shadow-sm" : "text-muted-foreground hover:bg-white/50"
          )}
        >
          Schedule
        </button>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: "Students", 
            value: course.student_count, 
            sub: "Total Students", 
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50"
          },
          { 
            label: "Sessions", 
            value: course.total_sessions, 
            sub: "Total Sessions", 
            icon: Calendar,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
          },
          { 
            label: "Attendance Rate", 
            value: `${Math.round(course.average_attendance)}%`, 
            sub: "Avg. Attendance", 
            icon: TrendingUp,
            color: "text-amber-600",
            bg: "bg-amber-50"
          }
        ].map((kpi, i) => (
          <div key={i} className="relative overflow-hidden group p-8 rounded-[32px] bg-white border border-indigo-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-10 rounded-full", kpi.bg)} />
            <div className="flex justify-between items-start mb-6">
              <div className={cn("p-4 rounded-2xl flex items-center justify-center", kpi.bg, kpi.color)}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3" />
                Live
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-foreground font-['FiraCode']">{kpi.value}</h3>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/60">{kpi.label}</span>
                <span className="text-xs font-semibold text-muted-foreground font-['FiraSans']">{kpi.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeTab === 'students' ? (
        <div className="bg-white rounded-[40px] border border-indigo-50 shadow-sm overflow-hidden flex flex-col">
          {/* Table Header Controls */}
          <div className="p-8 border-b border-indigo-50 flex items-center justify-between gap-6 bg-slate-50/30">
            <div className="flex items-center gap-6 flex-1 max-w-2xl">
              <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Search students by name or ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-14 pr-10 rounded-2xl border-indigo-100/50 bg-white focus:ring-4 focus:ring-primary/5 transition-all font-medium font-['FiraSans']"
                />
              </div>
              <Button variant="outline" className="rounded-2xl h-14 px-8 border-indigo-100 hover:bg-primary/5 gap-3 font-black text-xs uppercase tracking-widest transition-all">
                <Filter className="w-4 h-4 text-muted-foreground" />
                Filter
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
              <Clock className="w-3 h-3" />
              Last Sync: {format(new Date(), 'HH:mm')}
            </div>
          </div>

          {/* The Grid */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 border-b border-indigo-50/50">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="px-6 py-6 font-black uppercase text-[10px] tracking-[0.3em] text-muted-foreground/40 w-[300px]">Student</TableHead>
                  <TableHead className="px-6 py-6 font-black uppercase text-[10px] tracking-[0.3em] text-muted-foreground/40">Sec</TableHead>
                  <TableHead className="px-6 py-6 font-black uppercase text-[10px] tracking-[0.3em] text-muted-foreground/40">University ID</TableHead>
                  <TableHead className="px-6 py-6 font-black uppercase text-[10px] tracking-[0.3em] text-muted-foreground/40">Attendance</TableHead>
                  <TableHead className="px-6 py-6 font-black uppercase text-[10px] tracking-[0.3em] text-muted-foreground/40">Last Seen</TableHead>
                  <TableHead className="px-6 py-6 font-black uppercase text-[10px] tracking-[0.3em] text-muted-foreground/40">Status</TableHead>
                  <TableHead className="px-6 py-6 font-black uppercase text-[10px] tracking-[0.3em] text-muted-foreground/40 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-50">
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                    <TableCell className="px-6 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform duration-500">
                          <span className="font-black text-sm">{student.name.charAt(0)}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-lg text-[#1E3A8A] font-['FiraCode'] leading-none">
                            {student.name}
                          </span>
                          <div className="flex items-center gap-2 opacity-50">
                             <Mail className="w-3 h-3" />
                             <span className="text-[10px] font-black uppercase tracking-widest">ID: {student.id}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-6">
                      <div className="inline-flex px-3 py-1 bg-primary/5 text-primary border border-primary/10 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {student.section || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-6">
                      <div className="inline-flex px-4 py-2 bg-slate-100 rounded-xl font-mono text-xs font-black text-foreground border border-slate-200/50 group-hover:bg-[#1E40AF] group-hover:text-white transition-all">
                        {student.student_id}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1.5 w-full max-w-[120px]">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#1E3A8A]">
                            <span>Attendance</span>
                            <span>{Math.round(student.attendance_rate)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full transition-all duration-1000",
                                student.attendance_rate >= 80 ? "bg-emerald-500" :
                                student.attendance_rate >= 50 ? "bg-amber-500" : "bg-red-500"
                              )}
                              style={{ width: `${student.attendance_rate}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-muted-foreground/60">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-sm text-foreground">
                            {student.last_seen ? format(new Date(student.last_seen), 'MMM dd, HH:mm') : 'Never'}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Last Seen</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-6">
                      <Badge className={cn(
                        "rounded-full px-5 py-2 font-black text-[9px] uppercase tracking-[0.2em] border-none shadow-sm",
                        student.status === 'Consistent' ? "bg-emerald-100 text-emerald-600" :
                        student.status === 'Moderate' ? "bg-blue-100 text-blue-600" :
                        student.status === 'At Risk' ? "bg-amber-100 text-amber-600" :
                        "bg-red-100 text-red-600"
                      )}>
                        {student.status === 'Consistent' && <ShieldCheck className="w-3 h-3 mr-2 inline" />}
                        {student.status === 'At Risk' && <AlertCircle className="w-3 h-3 mr-2 inline" />}
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-indigo-50 shadow-xl">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 py-2">Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="rounded-xl p-3 gap-3 font-bold text-sm cursor-pointer">
                            <Mail className="w-4 h-4" />
                            Send Notification
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl p-3 gap-3 font-bold text-sm cursor-pointer">
                            <TrendingUp className="w-4 h-4" />
                            View Full History
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredStudents.length === 0 && (
              <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-200">
                  <Search className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground">No students found</h3>
                  <p className="text-muted-foreground font-medium">Try adjusting your search parameters.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {(course?.schedules || []).length === 0 ? (
            <div className="bg-white rounded-[40px] border border-indigo-50 shadow-sm p-8 flex flex-col items-center justify-center text-center py-20 bg-gradient-to-b from-white to-slate-50/50">
              <div className="w-24 h-24 rounded-[36px] bg-primary/5 flex items-center justify-center text-primary mb-8">
                <Calendar className="w-10 h-10" />
              </div>
              <div className="max-w-md mx-auto space-y-4">
                <h2 className="text-3xl font-black text-slate-900 leading-tight">No Schedule Set</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Start by adding recurring teaching slots. Students will see these in their local Ethiopian time.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.schedules.map((slot) => (
                <div key={slot.id} className="bg-white p-8 rounded-[32px] border border-indigo-50 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="px-4 py-2 bg-primary/5 text-primary rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                      Section {slot.section}
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleDeleteSchedule(slot.id)}
                      className="h-10 w-10 p-0 rounded-xl hover:bg-red-50 hover:text-red-500 text-slate-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#1E3A8A]">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-[#1E3A8A]">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][slot.day_of_week]}
                        </h4>
                        <div className="flex flex-col">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)} (Standard)
                          </p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                            {formatEthiopianTime(slot.start_time)} - {formatEthiopianTime(slot.end_time)} (Ethiopian)
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-700">{slot.room}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;
