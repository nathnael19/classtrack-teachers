import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
  Trash2,
  FileText
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
import { AddScheduleDialog } from './components/AddScheduleDialog';
import CourseMaterials from './components/CourseMaterials';

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
  lecturers: { id: number; name: string; email?: string }[];
}

const CourseDetailsPage = () => {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'students' | 'schedule' | 'materials'>('students');
  const { data: course, isLoading, refetch } = useQuery<CourseDetail>({
    queryKey: ['course', id],
    queryFn: async () => {
      const { data } = await api.get(`/courses/${id}`);
      return data;
    },
  });

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
            {activeTab === 'schedule' && (
              <AddScheduleDialog courseId={id!} onSuccess={() => refetch()} />
            )}
          </div>
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
        <button 
          onClick={() => setActiveTab('materials')}
          className={cn(
            "px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2",
            activeTab === 'materials' ? "bg-white text-primary border border-primary/20 shadow-sm" : "text-muted-foreground hover:bg-white/50"
          )}
        >
          <FileText className="w-3 h-3" />
          Materials
        </button>
      </div>

      {/* KPI Section */}
      {activeTab === 'students' && (
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
      )}

      {activeTab === 'students' ? (
        <div className="bg-white rounded-[40px] border border-stone-200/60 shadow-sm overflow-hidden flex flex-col">
          {/* Table Header Controls */}
          <div className="p-8 border-b border-stone-100 flex items-center justify-between gap-6 bg-stone-50/30">
            <div className="flex items-center gap-6 flex-1 max-w-2xl">
              <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-stone-900 transition-colors" />
                <Input 
                  placeholder="Search students by name or ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-14 pr-10 rounded-2xl border-stone-200 bg-white focus:ring-4 focus:ring-stone-900/5 transition-all font-medium"
                />
              </div>
              <Button variant="outline" className="rounded-2xl h-14 px-8 border-stone-200 hover:bg-stone-50 gap-3 font-black text-xs uppercase tracking-widest transition-all">
                <Filter className="w-4 h-4 text-stone-500" />
                Filter
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400">
              <Clock className="w-3 h-3" />
              Last Sync: {format(new Date(), 'HH:mm')}
            </div>
          </div>

          {/* The Grid */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-stone-50/50 border-b border-stone-100">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="px-6 py-6 font-black uppercase text-[10px] tracking-[0.3em] text-stone-400 w-[300px]">Student</TableHead>
                  <TableHead className="px-6 py-6 font-black uppercase text-[10px] tracking-[0.3em] text-stone-400">Sec</TableHead>
                  <TableHead className="px-6 py-6 font-black uppercase text-[10px] tracking-[0.3em] text-stone-400">University ID</TableHead>
                  <TableHead className="px-6 py-6 font-black uppercase text-[10px] tracking-[0.3em] text-stone-400">Attendance</TableHead>
                  <TableHead className="px-6 py-6 font-black uppercase text-[10px] tracking-[0.3em] text-stone-400">Last Seen</TableHead>
                  <TableHead className="px-6 py-6 font-black uppercase text-[10px] tracking-[0.3em] text-stone-400">Status</TableHead>
                  <TableHead className="px-6 py-6 font-black uppercase text-[10px] tracking-[0.3em] text-stone-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="group hover:bg-stone-50/50 transition-all duration-300 border-stone-50">
                    <TableCell className="px-6 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-900 shadow-sm group-hover:scale-105 transition-transform duration-500">
                          <span className="font-black text-sm">{student.name.charAt(0)}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-lg text-stone-900 leading-none">
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
                      <div className="inline-flex px-3 py-1 bg-stone-100 text-stone-900 border border-stone-200 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {student.section || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-6">
                      <div className="inline-flex px-4 py-2 bg-stone-100 rounded-xl font-mono text-xs font-black text-stone-600 border border-stone-200 group-hover:bg-stone-900 group-hover:text-white transition-all">
                        {student.student_id}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1.5 w-full max-w-[120px]">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-500">
                            <span>Attendance</span>
                            <span>{Math.round(student.attendance_rate)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full transition-all duration-1000",
                                student.attendance_rate >= 80 ? "bg-stone-900" :
                                student.attendance_rate >= 50 ? "bg-stone-600" : "bg-stone-400"
                              )}
                              style={{ width: `${student.attendance_rate}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-sm text-stone-900">
                            {student.last_seen ? format(new Date(student.last_seen), 'MMM dd, HH:mm') : 'Never'}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">Last Seen</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-6">
                      <Badge className={cn(
                        "rounded-full px-5 py-2 font-black text-[9px] uppercase tracking-[0.2em] border-none shadow-sm",
                        student.status === 'Consistent' ? "bg-stone-900 text-stone-50" :
                        student.status === 'Moderate' ? "bg-stone-200 text-stone-700" :
                        student.status === 'At Risk' ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-50 text-red-600"
                      )}>
                        {student.status === 'Consistent' && <ShieldCheck className="w-3 h-3 mr-2 inline" />}
                        {student.status === 'At Risk' && <AlertCircle className="w-3 h-3 mr-2 inline" />}
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-stone-100">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-stone-200 shadow-xl">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-2 py-2">Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="rounded-xl p-3 gap-3 font-bold text-sm cursor-pointer hover:bg-stone-50">
                            <Mail className="w-4 h-4" />
                            Send Notification
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl p-3 gap-3 font-bold text-sm cursor-pointer hover:bg-stone-50">
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
                <div className="w-20 h-20 rounded-[32px] bg-stone-50 flex items-center justify-center text-stone-200">
                  <Search className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900">No students found</h3>
                  <p className="text-stone-500 font-medium">Try adjusting your search parameters.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'schedule' ? (
        <div className="space-y-12">
          {(course?.schedules || []).length === 0 ? (
            <div className="relative overflow-hidden bg-white rounded-[40px] border border-stone-200 shadow-sm p-12 flex flex-col items-center justify-center text-center py-32 bg-gradient-to-b from-white to-stone-50/50">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1C1917 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className="w-24 h-24 rounded-[36px] bg-stone-900 flex items-center justify-center text-yellow-500 mb-8 shadow-2xl shadow-stone-900/20">
                <Calendar className="w-10 h-10" />
              </div>
              <div className="max-w-md mx-auto space-y-4 relative">
                <h2 className="text-4xl font-black text-stone-900 leading-tight tracking-tight">Elegance in Scheduling</h2>
                <p className="text-stone-500 font-medium leading-relaxed text-lg">
                  No recurring teaching slots have been defined yet. Define your schedule to track attendance with precision.
                </p>
                <div className="pt-4 flex justify-center">
                   <AddScheduleDialog courseId={id!} onSuccess={() => refetch()} />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                const daySchedules = course.schedules.filter(s => s.day_of_week === dayIndex);
                if (daySchedules.length === 0) return null;
                
                const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayIndex];
                
                return (
                  <div key={dayIndex} className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                    <div className="flex items-center gap-6">
                      <div className="h-px flex-1 bg-stone-200" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 bg-stone-50 px-6 py-2 rounded-full border border-stone-200 shadow-sm">
                        {dayName}
                      </h3>
                      <div className="h-px flex-1 bg-stone-200" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {daySchedules.sort((a, b) => a.start_time.localeCompare(b.start_time)).map((slot) => (
                        <div 
                          key={slot.id} 
                          className="group relative bg-white p-10 rounded-[40px] border border-stone-200/60 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-stone-900/5 rounded-full -mr-16 -mt-16 group-hover:bg-yellow-500/10 transition-colors duration-500" />
                          
                          <div className="flex justify-between items-start mb-8 relative">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Section</span>
                              <div className="px-4 py-1.5 bg-stone-900 text-stone-50 rounded-xl text-xs font-black shadow-lg shadow-stone-900/20 group-hover:bg-yellow-600 transition-colors">
                                {slot.section}
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              onClick={() => handleDeleteSchedule(slot.id)}
                              className="h-10 w-10 p-0 rounded-2xl hover:bg-red-50 hover:text-red-500 text-stone-300 transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>

                          <div className="space-y-8 relative">
                            <div className="flex items-start gap-5">
                              <div className="w-14 h-14 rounded-[20px] bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-900 group-hover:shadow-lg transition-all">
                                <Clock className="w-6 h-6" />
                              </div>
                              <div className="space-y-2">
                                <div className="flex flex-col">
                                  <span className="text-2xl font-black text-stone-900 tracking-tight font-['FiraCode']">
                                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                  </span>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Standard Time</span>
                                </div>
                                <div className="flex flex-col gap-1 px-4 py-2 bg-yellow-50 rounded-2xl border border-yellow-100/50">
                                  <span className="text-sm font-black text-yellow-700 font-['FiraCode']">
                                    {formatEthiopianTime(slot.start_time)} - {formatEthiopianTime(slot.end_time)}
                                  </span>
                                  <span className="text-[8px] font-black uppercase tracking-[0.1em] text-yellow-600/60">Ethiopian Time</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-[20px] bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-900 group-hover:shadow-lg transition-all">
                                <ShieldCheck className="w-6 h-6" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xl font-bold text-stone-800 tracking-tight">{slot.room}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Location</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-8 pt-8 border-t border-stone-100 flex items-center justify-between">
                            <div className="flex -space-x-2">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-stone-200" />
                              ))}
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-stone-900 flex items-center justify-center text-[10px] text-white font-bold">+12</div>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Class In Session</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <CourseMaterials 
          courseId={Number(id)} 
          courseLecturerId={course.lecturer_id} 
          lecturers={course.lecturers}
        />
      )}
    </div>
  );
};

export default CourseDetailsPage;
