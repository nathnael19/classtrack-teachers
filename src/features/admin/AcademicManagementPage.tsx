import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, BookOpen, Building2, MapPin, CalendarDays, 
  Search, Layers, Globe, Clock,
  ChevronRight, Users, Trash2, Pencil,
  TrendingUp, Activity, BarChart3, GraduationCap,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/services/api";
import { toast } from "sonner";

interface Course {
  id: number;
  name: string;
  code: string;
  credit_hours: number;
  student_count: number;
  is_active: boolean;
  description?: string;
}

interface Department {
  id: number;
  name: string;
  user_count: number;
  course_count: number;
  organization_id?: number;
}

interface Room {
  id: number;
  name: string;
  building?: string;
  capacity?: number;
  type: string;
  status: string;
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{displayValue.toLocaleString()}</span>;
};

const GlassCard = ({ children, className = "", noHover = false, style = {} }: { children: React.ReactNode, className?: string, noHover?: boolean, style?: React.CSSProperties }) => (
  <div 
    className={cn(
      "relative overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl transition-all duration-500 rounded-[2.5rem]",
      !noHover && "hover:shadow-primary/10 hover:border-white/40 dark:hover:border-white/20 hover:-translate-y-1.5 hover:scale-[1.01]",
      className
    )}
    style={style}
  >
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-black/20 pointer-events-none" />
    <div className="relative z-10 h-full">
      {children}
    </div>
  </div>
);

const AcademicManagementPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);
  const [isDeptsLoading, setIsDeptsLoading] = useState(true);
  const [isRoomsLoading, setIsRoomsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, deptsRes, roomsRes] = await Promise.all([
          api.get("/courses/"),
          api.get("/departments/"),
          api.get("/rooms/")
        ]);
        setCourses(coursesRes.data);
        setDepartments(deptsRes.data);
        setRooms(roomsRes.data);
      } catch (error) {
        console.error("Failed to fetch academic vectors:", error);
        toast.error("Critical failure during academic vector synchronization");
      } finally {
        setIsCoursesLoading(false);
        setIsDeptsLoading(false);
        setIsRoomsLoading(false);
      }
    };

    fetchData();
  }, []);

  const featuredDept = departments[0];
  const otherDepts = departments.slice(1);

  return (
    <div className="relative space-y-10 font-sans p-4 mb-20">
      {/* Immersive Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-20 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[50%] bg-amber-500/5 rounded-full blur-[100px] animate-pulse transition-all duration-[3000ms]" />
        <div className="absolute -bottom-[10%] right-[10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Hero / Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4 border-b border-white/10">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <GraduationCap className="w-5 h-5 text-indigo-500" />
             </div>
             <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase opacity-60">
                CORE://ACADEMIC_INFRA
             </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-amber-600 dark:from-white dark:via-indigo-300 dark:to-amber-400 leading-none">
            Learning Vector
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-xl">
            Orchestrate the educational fabric—from curriculum geometry to departmental spatial resources and temporal cycles.
          </p>
        </div>
        
        <div className="flex bg-white/10 dark:bg-white/5 p-1 rounded-3xl border border-white/20 backdrop-blur-xl shadow-2xl">
          {[
            { id: "courses", label: "Courses", icon: BookOpen },
            { id: "departments", label: "Depts", icon: Building2 },
            { id: "rooms", label: "Rooms", icon: MapPin },
            { id: "terms", label: "Terms", icon: CalendarDays }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "group relative flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 overflow-hidden",
                activeTab === tab.id 
                  ? "text-white" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-amber-500 animate-in fade-in zoom-in-95 duration-300" />
              )}
              <tab.icon className={cn("w-4 h-4 relative z-10 transition-transform group-hover:scale-110", activeTab === tab.id && "animate-pulse")} />
              <span className="relative z-10 font-black uppercase tracking-widest text-[10px] sm:inline hidden">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Bento Content */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        {activeTab === "courses" && (
          <div className="grid grid-cols-12 gap-6">
            {/* Action Card */}
            <button 
              onClick={() => navigate("/admin/academic/courses/new")}
              className="col-span-12 md:col-span-4 lg:col-span-3 h-full min-h-[220px] rounded-[2.5rem] border-2 border-dashed border-white/20 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group relative overflow-hidden flex flex-col items-center justify-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-500 border border-white/10">
                <Plus className="w-8 h-8 text-amber-500" />
              </div>
              <span className="font-black uppercase tracking-widest text-xs opacity-60 group-hover:opacity-100 italic transition-opacity">Deploy New Course</span>
              <div className="absolute bottom-4 right-4 opacity-10">
                <BookOpen className="w-12 h-12" />
              </div>
            </button>

            {isCoursesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <GlassCard key={i} className="col-span-12 md:col-span-4 lg:col-span-3 p-8 group h-full animate-pulse">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-4 bg-white/10 rounded" />
                    <div className="w-8 h-3 bg-white/10 rounded" />
                  </div>
                  <div className="w-3/4 h-6 bg-white/10 rounded mb-4" />
                  <div className="mt-8 space-y-4">
                    <div className="h-1 w-full bg-white/10 rounded-full" />
                    <div className="flex items-center justify-between">
                      <div className="w-20 h-3 bg-white/10 rounded" />
                      <div className="w-12 h-4 bg-white/10 rounded" />
                    </div>
                  </div>
                </GlassCard>
              ))
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <GlassCard key={course.id} className="col-span-12 md:col-span-4 lg:col-span-3 p-8 flex flex-col justify-between group h-full">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <Badge variant="outline" className="font-mono text-[9px] border-amber-500/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-lg">{course.code}</Badge>
                      <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-emerald-500">
                        <TrendingUp className="w-3 h-3" /> {/* Fixed trend for now or add to API */} +5%
                      </div>
                    </div>
                    <h3 className="text-xl font-black tracking-tighter leading-none group-hover:text-amber-500 transition-colors uppercase italic">{course.name}</h3>
                    {course.description && (
                      <p className="text-[10px] text-muted-foreground mt-2 line-clamp-2 font-medium">{course.description}</p>
                    )}
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-amber-500" style={{ width: `${Math.min((course.student_count / 100) * 100, 100)}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 opacity-40" />
                          <span className="text-[10px] font-black uppercase tracking-widest"><AnimatedNumber value={course.student_count} /> Enrolled</span>
                       </div>
                       <Badge className={cn(
                         "rounded-lg px-2 py-0 text-[8px] font-black uppercase tracking-widest",
                         course.is_active ? "bg-emerald-500 text-white" : "bg-white/10 text-muted-foreground"
                       )}>{course.is_active ? "Active" : "Inactive"}</Badge>
                    </div>
                  </div>
                </GlassCard>
              ))
            ) : (
              <div className="col-span-12 py-20 text-center">
                <BookOpen className="w-12 h-12 mx-auto opacity-20 mb-4" />
                <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40 italic">No course vectors initialized in this quadrant.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "departments" && (
          <div className="grid grid-cols-12 gap-6">
            {isDeptsLoading ? (
              <div className="col-span-12 py-20 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto opacity-20 mb-4" />
                <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40 italic">Syncing Departmental Matrix...</p>
              </div>
            ) : departments.length > 0 ? (
              <>
                {/* Hero / Featured Dept */}
                <GlassCard className="col-span-12 lg:col-span-7 p-10 flex flex-col justify-between overflow-hidden relative group" noHover>
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40">
                           <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                           <h2 className="text-3xl font-black tracking-tighter leading-none">{featuredDept.name}</h2>
                           <p className="text-muted-foreground font-medium mt-1 uppercase tracking-widest text-[10px]">Academic Nucleus / ID: {featuredDept.id}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-8 pt-6 border-t border-white/10">
                        {[
                          { label: "Faculty", value: featuredDept.user_count, icon: Users },
                          { label: "Courses", value: featuredDept.course_count, icon: BookOpen },
                          { label: "Assets", value: 156, icon: Layers }, // Placeholder
                        ].map((stat) => (
                          <div key={stat.label} className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <stat.icon className="w-3 h-3" />
                              <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                            </div>
                            <p className="text-2xl font-black tracking-tighter italic">{stat.value}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="mt-10 flex gap-4">
                     <Button className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-8 font-black uppercase tracking-widest text-[10px]">Configure Pillar</Button>
                     <Button variant="outline" className="rounded-2xl border-white/20 px-8 font-black uppercase tracking-widest text-[10px] backdrop-blur-md">View Roster</Button>
                  </div>
                </GlassCard>

                {/* Other Depts Grid */}
                <div className="col-span-12 lg:col-span-5 grid grid-cols-1 gap-6">
                  {otherDepts.map((dept) => (
                    <GlassCard key={dept.id} className="p-6 flex items-center justify-between group">
                       <div className="flex items-center gap-6">
                          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner border border-white/10 bg-indigo-500/10")}>
                             <Activity className={cn("w-6 h-6 text-indigo-500")} />
                          </div>
                          <div>
                             <h3 className="text-lg font-black tracking-tight leading-tight group-hover:text-indigo-500 transition-colors uppercase italic">{dept.name}</h3>
                             <p className="text-xs font-bold text-muted-foreground mt-1 tracking-tight italic">Courses: {dept.course_count}</p>
                          </div>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Staff Vector</span>
                          <span className="text-xl font-black italic">{dept.user_count}</span>
                       </div>
                    </GlassCard>
                  ))}
                  <button 
                    onClick={() => navigate("/admin/academic/departments/new")}
                    className="rounded-3xl border-2 border-dashed border-white/20 p-6 flex items-center justify-center gap-4 text-muted-foreground hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-500/5 transition-all group"
                  >
                    <Plus className="w-5 h-5 group-hover:scale-125 transition-transform" />
                    <span className="font-black uppercase tracking-widest text-[10px]">Initialize New Dept Pillar</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="col-span-12 py-20 text-center">
                 <Building2 className="w-12 h-12 mx-auto opacity-20 mb-4" />
                 <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40 italic">Institution structure uninitialized.</p>
                 <Button onClick={() => navigate("/admin/academic/departments/new")} variant="outline" className="mt-6 rounded-2xl font-black uppercase tracking-widest text-[10px] px-8">Seed First Department</Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "rooms" && (
           <div className="grid grid-cols-12 gap-6">
              <GlassCard className="col-span-12 lg:col-span-4 p-8 flex flex-col justify-between" noHover>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black tracking-tighter">Facility Registry</h3>
                       <p className="text-muted-foreground text-sm font-medium">Monitoring <AnimatedNumber value={rooms.length} /> physical nodes across campus</p>
                    </div>
                    <div className="relative group">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-amber-500 transition-colors" />
                       <input className="w-full bg-white/10 border border-white/20 rounded-2xl h-12 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all font-bold placeholder:opacity-40" placeholder="Search facility index..." />
                    </div>
                    <div className="space-y-4 pt-4 border-t border-white/10">
                       {[
                         { label: "Peak Occupancy", value: "88%", color: "text-amber-500" },
                         { label: "Health / Safety", value: "Optimal", color: "text-emerald-500" },
                         { label: "Active Nodes", value: rooms.filter(r => r.status === "active").length.toString(), color: "text-indigo-500" },
                       ].map((stat) => (
                         <div key={stat.label} className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{stat.label}</span>
                            <span className={cn("text-sm font-black italic", stat.color)}>{stat.value}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 <Button onClick={() => navigate("/admin/academic/rooms/new")} className="w-full mt-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all font-black uppercase tracking-widest text-[10px] py-6">
                    Register Facility Node
                 </Button>
              </GlassCard>

              <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                 {isRoomsLoading ? (
                   Array.from({ length: 2 }).map((_, i) => (
                     <GlassCard key={i} className="p-8 h-48 animate-pulse">
                        <div className="flex justify-between items-start mb-6">
                           <div className="w-20 h-4 bg-white/10 rounded" />
                           <div className="w-12 h-6 bg-white/10 rounded-full" />
                        </div>
                        <div className="w-3/4 h-8 bg-white/10 rounded" />
                     </GlassCard>
                   ))
                 ) : rooms.length > 0 ? (
                   rooms.map((room) => (
                    <GlassCard key={room.id} className="p-8 group">
                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{room.type}</span>
                             <h4 className="text-xl font-black tracking-tight mt-1">{room.name}</h4>
                          </div>
                          <Badge className={cn(
                            "rounded-full px-4 text-[9px] font-black uppercase tracking-widest border-none shadow-lg",
                            room.status === "active" ? "bg-emerald-500 text-white" : 
                            room.status === "under_maintenance" ? "bg-amber-500 text-white" : "bg-rose-500 text-white"
                          )}>{room.status === "active" ? "SYNCED" : room.status === "under_maintenance" ? "DEBUGGING" : "OFFLINE"}</Badge>
                       </div>
                       
                       <div className="space-y-3">
                          <div className="flex justify-between items-end">
                             <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Spatial Capacity</span>
                                <p className="text-lg font-black tracking-tighter leading-none italic">{room.capacity || 0} <span className="text-xs uppercase opacity-40 not-italic ml-1">Nodes</span></p>
                             </div>
                             <div className="text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Building</span>
                                <p className="text-lg font-black tracking-tighter leading-none italic uppercase">{room.building || "N/A"}</p>
                             </div>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                             <div className={cn("h-full transition-all duration-1000 bg-indigo-500")} style={{ width: `${Math.min((room.capacity || 0) / 2, 100)}%` }} />
                          </div>
                       </div>

                       <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[9px] font-black text-muted-foreground italic uppercase tracking-widest">Facility Ref: CT-{Math.floor(room.id * 1000) + room.id}</span>
                          <div className="flex gap-2">
                             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/40"><Pencil className="w-3.5 h-3.5" /></Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-rose-500/20 text-rose-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                       </div>
                    </GlassCard>
                  ))
                 ) : (
                   <div className="col-span-full py-20 text-center">
                      <MapPin className="w-12 h-12 mx-auto opacity-20 mb-4" />
                      <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40 italic">No facility nodes registered.</p>
                   </div>
                 )}
              </div>
           </div>
        )}

        {activeTab === "terms" && (
           <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-4 h-full">
                 <button 
                  onClick={() => navigate("/admin/academic/terms/new")}
                  className="w-full h-full min-h-[300px] border-2 border-dashed border-white/20 rounded-[3rem] p-10 flex flex-col items-center justify-center gap-6 text-muted-foreground hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group overflow-hidden relative"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-20 h-20 rounded-[2.5rem] bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-500 border border-white/10 shadow-2xl">
                    <CalendarDays className="w-10 h-10 text-amber-500" />
                  </div>
                  <div className="text-center space-y-2 relative z-10">
                    <span className="text-sm font-black uppercase tracking-widest block italic">Genesis Process</span>
                    <span className="text-xs font-bold leading-relaxed block max-w-[200px] opacity-60 uppercase tracking-tighter">Initialize New Academic Cycle / Register Term Temporal Matrix</span>
                  </div>
                  <div className="mt-4 p-2 bg-amber-500/10 rounded-xl">
                     <Plus className="w-6 h-6 text-amber-600" />
                  </div>
                </button>
              </div>

              <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
              {[
                { name: "Spring 2026", duration: "Jan 10 - May 24", status: "Current", active: true, load: "100%" },
                { name: "Fall 2025", duration: "Sep 01 - Dec 15", status: "Completed", active: false, load: "Synced" },
                { name: "Summer 2025", duration: "Jun 10 - Aug 20", status: "Completed", active: false, load: "Archived" },
              ].map((term) => (
                <GlassCard key={term.name} className={cn(
                  "p-10 group",
                  term.active && "border-emerald-500/30 ring-4 ring-emerald-500/10 shadow-emerald-500/20"
                )}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                      <div className={cn(
                        "w-20 h-20 rounded-[2.5rem] flex items-center justify-center border border-white/20 shadow-2xl transition-all duration-700 group-hover:rotate-[360deg]",
                        term.active ? "bg-gradient-to-br from-emerald-400 to-teal-600 text-white" : "bg-white/10 text-muted-foreground"
                      )}>
                        <Activity className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                           <h3 className="text-3xl font-black tracking-tighter italic leading-none">{term.name}</h3>
                           {term.active && (
                             <Badge className="bg-emerald-500 animate-pulse rounded-lg font-black uppercase tracking-widest text-[8px] py-1 shadow-lg shadow-emerald-500/40">GENESIS://RUNNING</Badge>
                           )}
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                              <Clock className="w-3.5 h-3.5" />
                              Timeline: {term.duration}
                           </div>
                           <div className="w-1 h-1 rounded-full bg-white/20" />
                           <div className="flex items-center gap-2 text-xs font-black text-indigo-500 uppercase tracking-widest">
                              <BarChart3 className="w-3.5 h-3.5" />
                              Health: {term.load}
                           </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                       <div className="hidden lg:flex flex-col items-end">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Registry Status</span>
                          <span className={cn("text-lg font-black italic", term.active ? "text-emerald-500" : "text-muted-foreground")}>{term.status}</span>
                       </div>
                       <ChevronRight className={cn(
                         "w-12 h-12 opacity-20 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-700 cursor-pointer p-2 rounded-2xl hover:bg-white/10",
                         term.active ? "text-emerald-500" : "text-muted-foreground"
                       )} />
                    </div>
                  </div>
                </GlassCard>
              ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default AcademicManagementPage;

