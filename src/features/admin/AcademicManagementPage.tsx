import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus, BookOpen, Building2, MapPin, CalendarDays,
  Search, Layers, Globe, Clock,
  ChevronRight, Users, Settings2, Trash2, Pencil
} from "lucide-react";
import { cn } from "@/lib/utils";

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

const GlassCard = ({ children, className = "", noHover = false }: { children: React.ReactNode, className?: string, noHover?: boolean }) => (
  <Card className={cn(
    "relative overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md shadow-xl transition-all duration-500",
    !noHover && "hover:shadow-2xl hover:bg-white/50 dark:hover:bg-black/50 hover:border-white/40 dark:hover:border-white/20 hover:-translate-y-1",
    className
  )}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent pointer-events-none" />
    {children}
  </Card>
);

const AcademicManagementPage = () => {
  const [activeTab, setActiveTab] = useState("courses");

  return (
    <div className="relative space-y-8 font-sans p-2">
      {/* Background Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] -z-10 pointer-events-none animate-pulse" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Layers className="w-3 h-3 mr-1" /> Academic Core
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-amber-600 dark:from-white dark:via-slate-200 dark:to-amber-400">
            Academic Infrastructure
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-500/60" />
            Manage curriculum, departmental hierarchy, and campus spatial resources
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/20 dark:bg-black/20 p-1.5 rounded-2xl border border-white/20 backdrop-blur-md shadow-inner">
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
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === tab.id
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-black/40"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conditional Content based on activeTab */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "courses" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { code: "CS101", name: "Introduction to Computer Science", credits: 3, students: 120, status: "Active" },
              { code: "SWE204", name: "Software Architecture & Design", credits: 4, students: 85, status: "Active" },
              { code: "MAT301", name: "Discrete Mathematics II", credits: 3, students: 45, status: "Active" },
              { code: "PHY101", name: "Modern Physics for Engineers", credits: 4, students: 150, status: "Active" },
              { code: "HIS102", name: "World History: Middle Ages", credits: 3, students: 60, status: "Inactive" },
              { code: "ENG101", name: "Academic Writing & Research", credits: 2, students: 200, status: "Active" },
            ].map((course, idx) => (
              <GlassCard key={course.code} className="p-6 group flex flex-col justify-between min-h-[180px]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">{course.code}</span>
                    <h3 className="text-lg font-black tracking-tight leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{course.name}</h3>
                  </div>
                  <Badge variant="outline" className="border-white/20 bg-white/5 font-black uppercase tracking-[0.1em] text-[10px]">{course.credits} Cr</Badge>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-bold text-muted-foreground"><AnimatedNumber value={course.students} /> Enrolled</span>
                  </div>
                  <Badge className={cn(
                    "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter",
                    course.status === "Active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-500/10 text-slate-500"
                  )}>{course.status}</Badge>
                </div>
              </GlassCard>
            ))}
            <button className="border-2 border-dashed border-white/20 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:border-amber-500 hover:text-amber-600 hover:bg-amber-500/5 transition-all group">
              <div className="w-12 h-12 rounded-full bg-white/10 dark:bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest">Register Course</span>
            </button>
          </div>
        )}

        {activeTab === "departments" && (
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { name: "School of Computer Science", head: "Dr. Alice Morgan", staff: 42, color: "from-indigo-500 to-blue-600" },
              { name: "Faculty of Applied Mathematics", head: "Prof. Robert Chen", staff: 28, color: "from-rose-500 to-orange-600" },
              { name: "Institute of Natural Sciences", head: "Dr. Elena Volkov", staff: 56, color: "from-emerald-500 to-teal-600" },
              { name: "Department of Humanities", head: "Prof. James Wilson", staff: 19, color: "from-amber-500 to-yellow-600" },
            ].map((dept) => (
              <GlassCard key={dept.name} className="p-1 min-h-[200px] group overflow-hidden">
                <div className="h-full bg-white/5 dark:bg-black/20 p-6 rounded-[inherit] flex flex-col gap-6 relative">
                  <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-br blur-3xl -z-10 opacity-20 group-hover:opacity-40 transition-opacity", dept.color)} />
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-sm text-amber-600 dark:text-amber-400">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/40"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-rose-500/20 text-rose-500"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-black tracking-tight">{dept.name}</h3>
                    <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                      <Plus className="w-3.5 h-3.5 text-amber-500 rotate-45" />
                      Head: {dept.head}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Staff Strength</span>
                    <Badge className="bg-white/20 dark:bg-black/40 text-foreground border-white/10 px-4 py-1.5 rounded-xl font-black">{dept.staff} Members</Badge>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {activeTab === "rooms" && (
          <GlassCard className="border-white/10" noHover>
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/10 dark:bg-black/10">
              <div className="flex flex-col gap-1">
                <h3 className="font-black text-xl tracking-tight">Facility Resource Registry</h3>
                <p className="text-xs font-bold text-muted-foreground">Monitoring physical capacity and occupancy</p>
              </div>
              <div className="relative w-full md:w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input className="w-full bg-white/20 dark:bg-black/20 border border-white/10 rounded-xl h-10 pl-10 text-sm focus:outline-none focus:border-amber-500/50 transition-all font-bold" placeholder="Search rooms..." />
              </div>
            </div>
            <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Block A - Hall 101", cap: 150, type: "Lecture Hall", status: "Available" },
                { name: "Block C - Lab 03", cap: 30, type: "Computer Lab", status: "In Use" },
                { name: "Block B - Room 204", cap: 45, type: "Smart Classroom", status: "Available" },
                { name: "Main Auditorium", cap: 500, type: "Assembly", status: "Maintenance" },
                { name: "Library Annex", cap: 80, type: "Study Hall", status: "Available" },
              ].map((room) => (
                <div key={room.name} className="p-4 bg-white/20 dark:bg-black/20 rounded-2xl border border-white/10 hover:bg-white/30 dark:hover:bg-black/30 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-amber-500 uppercase tracking-widest">{room.type}</span>
                      <h4 className="font-black tracking-tight">{room.name}</h4>
                    </div>
                    <Badge className={cn(
                      "text-[10px] font-black uppercase tracking-tighter",
                      room.status === "Available" ? "bg-emerald-500" :
                        room.status === "In Use" ? "bg-indigo-500" : "bg-rose-500"
                    )}>{room.status}</Badge>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>Capacity Load</span>
                      <span>{room.cap} Seats</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: room.status === "In Use" ? "85%" : "0%" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {activeTab === "terms" && (
          <div className="flex flex-col gap-6">
            {[
              { name: "Spring 2026", duration: "Jan 10 - May 24", status: "Current", active: true },
              { name: "Fall 2025", duration: "Sep 01 - Dec 15", status: "Completed", active: false },
              { name: "Summer 2025", duration: "Jun 10 - Aug 20", status: "Completed", active: false },
            ].map((term) => (
              <GlassCard key={term.name} className={cn(
                "p-8 group",
                term.active && "border-emerald-500/30 ring-1 ring-emerald-500/20"
              )}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-16 h-16 rounded-[2rem] flex items-center justify-center border-4 border-white/20 shadow-xl group-hover:scale-110 transition-all duration-500",
                      term.active ? "bg-emerald-500 text-white" : "bg-white/10 dark:bg-black/20 text-muted-foreground"
                    )}>
                      <CalendarDays className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black tracking-tighter italic">{term.name}</h3>
                        {term.active && <Badge className="bg-emerald-500 animate-pulse">Running Now</Badge>}
                      </div>
                      <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 opacity-40" />
                        Session Timeline: {term.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Registry Health</span>
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">100% Synced</span>
                    </div>
                    <ChevronRight className={cn(
                      "w-8 h-8 opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500 cursor-pointer",
                      term.active ? "text-emerald-500" : "text-muted-foreground"
                    )} />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicManagementPage;
