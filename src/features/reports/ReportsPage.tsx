import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileJson,
  Calendar,
  ChevronDown,
  Loader2,
  Clock
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
  lecturer?: string;
}

const ReportsPage = () => {
  const [reports, setReports] = useState<ReportSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/analytics/sessions-report');
        setReports(res.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast.error('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExport = (type: string) => {
    setIsExporting(true);
    const promise = new Promise(resolve => setTimeout(resolve, 1500));
    toast.promise(promise, {
      loading: `Preparing ${type} file...`,
      success: `Report exported as ${type}!`,
      error: 'Failed to export report.',
    });
    promise.finally(() => setIsExporting(false));
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-40 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">Attendance Reports</h1>
          <p className="text-muted-foreground mt-2 text-lg">In-depth insights and historical data exports.</p>
        </div>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={isExporting} variant="outline" className="rounded-full px-6 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all gap-3 shadow-sm">
                <Download className="w-5 h-5" />
                <span className="font-bold">Export Data</span>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl border-primary/10 backdrop-blur-xl bg-white/80 p-2 shadow-2xl">
              <DropdownMenuLabel className="px-3 py-2 text-xs font-black uppercase text-muted-foreground tracking-widest">Format Options</DropdownMenuLabel>
              <DropdownMenuItem className="rounded-xl gap-3 py-3 cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50 group" onClick={() => handleExport('CSV')}>
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <span className="font-bold">Spreadsheet (CSV)</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl gap-3 py-3 cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 group" onClick={() => handleExport('Excel')}>
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <span className="font-bold">Excel (XLSX)</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl gap-3 py-3 cursor-pointer hover:bg-rose-50 focus:bg-rose-50 group" onClick={() => handleExport('PDF')}>
                <div className="p-2 bg-rose-100 rounded-lg text-rose-600 group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="font-bold">Document (PDF)</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl gap-3 py-3 cursor-pointer hover:bg-blue-50 focus:bg-blue-50 group" onClick={() => handleExport('JSON')}>
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                  <FileJson className="w-4 h-4" />
                </div>
                <span className="font-bold">Data Object (JSON)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/20 bg-white/10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex flex-1 items-center gap-6">
            <div className="relative flex-1 max-w-sm group">
              <Search className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search courses, dates..." 
                className="pl-12 h-12 bg-white/40 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 font-medium" 
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[200px] h-12 border-none bg-white/40 rounded-2xl shadow-inner focus:ring-2 focus:ring-primary/20 font-bold">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-primary/10 backdrop-blur-xl bg-white/80">
                <SelectItem value="all" className="rounded-xl font-bold">All Courses</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-2xl text-xs font-black text-primary uppercase tracking-widest shadow-sm">
              <Calendar className="w-4 h-4" />
              Full History
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/5">
              <TableRow className="hover:bg-transparent border-b border-border/20">
                <TableHead className="px-8 py-6 font-black uppercase text-xs tracking-widest text-muted-foreground">Course Module</TableHead>
                <TableHead className="px-8 py-6 font-black uppercase text-xs tracking-widest text-muted-foreground">Session Timestamp</TableHead>
                <TableHead className="px-8 py-6 font-black uppercase text-xs tracking-widest text-muted-foreground hidden md:table-cell">Facility</TableHead>
                <TableHead className="px-8 py-6 font-black uppercase text-xs tracking-widest text-muted-foreground">Performance</TableHead>
                <TableHead className="px-8 py-6 font-black uppercase text-xs tracking-widest text-muted-foreground text-right">Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <tr key={report.id} className="group hover:bg-primary/[0.03] transition-all duration-300 border-b border-border/10">
                  <TableCell className="px-8 py-6">
                    <div className="font-black text-base group-hover:text-primary transition-colors">{report.course}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-medium opacity-60">ID: CT-{report.id}</div>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-muted-foreground font-bold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4 opacity-30" />
                       {new Date(report.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 hidden md:table-cell font-black text-xs text-muted-foreground/60 uppercase tracking-wide">
                    {report.classroom ?? 'Remote / N/A'}
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col gap-1">
                         <span className="font-black text-lg text-glow leading-none">{report.rate}</span>
                         <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">{report.present} / {report.total}</span>
                      </div>
                      <div className="w-24 h-2.5 bg-muted/40 rounded-full overflow-hidden hidden sm:block shadow-inner ring-1 ring-black/5">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-primary to-emerald-400`} 
                          style={{width: report.rate}}
                        >
                          <div className="w-full h-full bg-white/20 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right whitespace-nowrap">
                    <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 hover:bg-primary hover:text-white transition-all shadow-sm">
                      <FileText className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </tr>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 opacity-30">
                       <FileText className="w-12 h-12" />
                       <span className="font-bold text-lg">No sequence of data found</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-8 border-t border-white/20 bg-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-sm font-bold text-muted-foreground">
            Analyzing <span className="text-primary font-black px-2 py-1 bg-primary/10 rounded-md">{reports.length}</span> historical sessions
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${i === 1 ? 'bg-primary text-white shadow-lg' : 'hover:bg-primary/5 text-muted-foreground hover:text-primary'}`}>
                {i}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
