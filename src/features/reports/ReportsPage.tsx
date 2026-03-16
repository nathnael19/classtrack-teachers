import { useState } from 'react';
import { 
  Search, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileJson,
  Calendar,
  ChevronDown,
  Loader2,
  Clock,
  Filter,
  Zap,
  ArrowUpRight,
  Database
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

// --- Types ---
interface ReportSession {
  id: number;
  course: string;
  date: string;
  classroom?: string;
  present: number;
  total: number;
  rate: string;
}

interface Course {
  id: number;
  name: string;
  code: string;
}

const ReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  // --- Queries ---
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['courses-list'],
    queryFn: async () => (await api.get('/courses')).data,
  });

  const { data: reports = [], isLoading } = useQuery<ReportSession[]>({
    queryKey: ['reports-list', searchTerm, selectedCourse],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (selectedCourse !== 'all') params.append('course_id', selectedCourse);
      
      return (await api.get(`/analytics/sessions-report?${params.toString()}`)).data;
    },
  });

  const handleExport = async (type: string) => {
    if (type !== 'CSV') {
      toast.error(`${type} export not yet implemented. Use CSV.`);
      return;
    }

    setIsExporting(true);
    try {
      const response = await api.get('/analytics/reports/export/csv', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Report exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export report.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading && reports.length === 0) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-primary opacity-20" />
          <Database className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Synchronizing Records Hub...</p>
      </div>
    );
  }

  return (
    <div className="relative animate-in fade-in duration-700 max-w-7xl mx-auto px-4 pb-20">
      {/* Structural Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 pt-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <Zap className="w-3 h-3 fill-current" />
            Live Historical Stream
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-tight">
            Reports <span className="italic text-primary">Hub</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium max-w-xl">
            Multi-dimensional lookup and forensic analysis of institutional attendance parameters.
          </p>
        </div>

        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={isExporting} className="rounded-3xl h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white transition-all gap-4 shadow-2xl shadow-slate-900/20 border-none group">
                <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                <span className="font-black uppercase tracking-widest text-xs">Export Intelligence</span>
                <ChevronDown className="w-4 h-4 opacity-40" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-[2rem] border-primary/10 backdrop-blur-2xl bg-white/90 p-3 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)]">
              <DropdownMenuLabel className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Format Architecture</DropdownMenuLabel>
              {[
                { label: 'Spreadsheet (CSV)', type: 'CSV', icon: FileSpreadsheet, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: 'Excel (XLSX)', type: 'XLSX', icon: FileSpreadsheet, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: 'Document (PDF)', type: 'PDF', icon: FileText, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                { label: 'Data Object (JSON)', type: 'JSON', icon: FileJson, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              ].map((opt) => (
                <DropdownMenuItem key={opt.type} className="rounded-2xl gap-4 py-4 cursor-pointer focus:bg-slate-100 group transition-all" onClick={() => handleExport(opt.type)}>
                  <div className={`p-2.5 ${opt.bg} ${opt.color} rounded-xl group-hover:scale-110 transition-transform`}>
                    <opt.icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900 tracking-tight">{opt.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="glass-card rounded-[3.5rem] overflow-hidden border-none bg-white/40 shadow-2xl shadow-indigo-500/5">
        <div className="p-10 border-b border-slate-100 bg-white/20 backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-6">
            <div className="relative flex-1 max-w-md group">
              <Search className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search module code, name, or room..." 
                className="pl-14 h-16 bg-white border-none rounded-3xl shadow-xl shadow-slate-200/50 focus-visible:ring-2 focus-visible:ring-primary/20 placeholder:text-slate-300 font-bold text-slate-900 tracking-tight" 
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white rounded-2xl shadow-lg shadow-slate-200/50">
                <Filter className="w-5 h-5 text-slate-400" />
              </div>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-[240px] h-16 border-none bg-white rounded-3xl shadow-xl shadow-slate-200/50 focus:ring-2 focus:ring-primary/20 font-black uppercase text-[10px] tracking-widest text-slate-600 px-6">
                  <SelectValue placeholder="All Operations" />
                </SelectTrigger>
                <SelectContent className="rounded-3xl border-primary/10 backdrop-blur-2xl bg-white/90 p-2">
                  <SelectItem value="all" className="rounded-2xl font-black uppercase text-[10px] tracking-widest py-3 cursor-pointer">All Operations</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={String(course.id)} className="rounded-2xl font-black uppercase text-[10px] tracking-widest py-3 cursor-pointer">
                      {course.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center gap-4 px-8 py-4 bg-emerald-500/10 rounded-3xl text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] border border-emerald-500/20">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             Live Indexing Active
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-10 py-8 font-black uppercase text-[9px] tracking-[0.3em] text-slate-400">Tactical Module</TableHead>
                <TableHead className="px-10 py-8 font-black uppercase text-[9px] tracking-[0.3em] text-slate-400">Temporal Stamp</TableHead>
                <TableHead className="px-10 py-8 font-black uppercase text-[9px] tracking-[0.3em] text-slate-400 hidden md:table-cell">Coordinate Hub</TableHead>
                <TableHead className="px-10 py-8 font-black uppercase text-[9px] tracking-[0.3em] text-slate-400">Integrity Vector</TableHead>
                <TableHead className="px-10 py-8 font-black uppercase text-[9px] tracking-[0.3em] text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="group hover:bg-white/60 transition-all duration-500 border-b border-slate-50">
                  <TableCell className="px-10 py-8">
                    <div className="font-black text-lg group-hover:text-primary transition-colors tracking-tighter text-slate-900">{report.course}</div>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[9px] font-black px-2 py-0.5 bg-slate-100 rounded text-slate-400 uppercase tracking-widest leading-none">V-0{report.id}</span>
                       <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Verified Protocol</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-8 text-slate-500 font-bold whitespace-nowrap">
                    <div className="flex flex-col">
                       <div className="flex items-center gap-2 text-slate-900">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="tracking-tight">{new Date(report.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                       </div>
                       <span className="text-[10px] text-slate-400 mt-1 pl-6">TIMESTAMP: {new Date(report.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-8 hidden md:table-cell">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-slate-400" />
                       </div>
                       <span className="font-black text-[11px] text-slate-500 uppercase tracking-widest">{report.classroom ?? 'Remote Data Link'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-8">
                    <div className="flex items-center gap-8">
                      <div className="flex flex-col">
                         <span className="font-black text-2xl text-slate-900 tracking-tighter leading-none">{report.rate}</span>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 italic shadow-primary">{report.present} / {report.total} UNITS</span>
                      </div>
                      <div className="w-32 h-3 bg-slate-100 rounded-full overflow-hidden hidden sm:block shadow-inner p-0.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out bg-primary group-hover:shadow-[0_0_15px_rgba(var(--primary),0.5)]`} 
                          style={{width: report.rate}}
                        >
                          <div className="w-full h-full bg-white/20 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-8 text-right whitespace-nowrap">
                    <Button variant="ghost" className="rounded-2xl h-12 w-12 p-0 hover:bg-primary hover:text-white hover:rotate-12 transition-all shadow-sm">
                      <ArrowUpRight className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-96 text-center border-none hover:bg-transparent">
                    <div className="flex flex-col items-center justify-center gap-6 opacity-20 group">
                       <div className="p-8 rounded-[3rem] bg-slate-100 group-hover:scale-110 transition-transform duration-700">
                          <Database className="w-20 h-20 text-slate-400" />
                       </div>
                       <div className="space-y-2">
                          <span className="font-black text-2xl uppercase tracking-tighter text-slate-900">Zero Data Sequences</span>
                          <p className="font-bold text-xs uppercase tracking-[0.3em] text-slate-400">No matching telemetry found in active indexed registers</p>
                       </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-10 border-t border-slate-100 bg-slate-50/50 backdrop-blur-md flex items-center gap-4">
          <div className="px-6 py-3 bg-white rounded-2xl shadow-lg shadow-slate-200/50 flex items-center gap-4 border border-white">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Active Records</span>
            <span className="text-xl font-black text-primary leading-none tabular-nums">{reports.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
