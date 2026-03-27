import { useState, useCallback } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  Users,
  Loader2,
  X,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import api from '@/services/api';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentRow {
  name: string;
  student_id: string;
  section?: string;
  department_id?: number;
  enrollment_year?: number;
}

interface EnrollStudentsModalProps {
  courseId: number;
  courseName: string;
}

export const EnrollStudentsModal = ({ courseId, courseName }: EnrollStudentsModalProps) => {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<StudentRow[]>([{ name: '', student_id: '', section: '' }]);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (studentList: StudentRow[]) => {
      const validStudents = studentList.filter(s => s.name.trim() && s.student_id.trim()).map(s => ({
        ...s,
        department_id: s.department_id || (selectedDept ? parseInt(selectedDept) : undefined),
        enrollment_year: s.enrollment_year || (selectedYear ? parseInt(selectedYear) : undefined)
      }));
      if (validStudents.length === 0) throw new Error("No valid student data to upload");

      return (await api.post(`/courses/${courseId}/enroll`, { students: validStudents })).data;
    },
    onSuccess: (data) => {
      toast.success('Enrollment Synchronized', {
        description: `Successfully deployed ${data.total_enrolled} identities to the module.`,
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setOpen(false);
      setStudents([{ name: '', student_id: '', section: '' }]);
    },
    onError: (error: any) => {
      toast.error('System Breach: Enrollment Failed', {
        description: error.response?.data?.detail || error.message || 'Identity synchronization failed.'
      });
    }
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => (await api.get('/departments/')).data
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsImporting(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedRows: StudentRow[] = results.data.map((row: any) => ({
          name: row.Name || row.name || row['Student Name'] || '',
          student_id: row['Student ID'] || row.student_id || row.id || row.ID || '',
          section: row.Section || row.section || ''
        })).filter(s => s.name || s.student_id);

        if (parsedRows.length > 0) {
          setStudents(prev => {
            const currentValid = prev.filter(s => s.name.trim() || s.student_id.trim());
            return [...currentValid, ...parsedRows];
          });
          toast.success('CSV Ingested', {
            description: `${parsedRows.length} identities extracted successfully.`
          });
        } else {
          toast.error('Data Mismatch', {
            description: 'Could not find required headers (Name, Student ID) in CSV.'
          });
        }
        setIsImporting(false);
      },
      error: () => {
        toast.error('Ingest Error', { description: 'Failed to process the requested CSV file.' });
        setIsImporting(false);
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false
  });

  const addRow = () => {
    setStudents([...students, { name: '', student_id: '', section: '' }]);
  };

  const removeRow = (index: number) => {
    if (students.length === 1) {
      setStudents([{ name: '', student_id: '', section: '' }]);
      return;
    }
    setStudents(students.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof StudentRow, value: string) => {
    const newStudents = [...students];
    (newStudents[index] as any)[field] = value;
    setStudents(newStudents);
  };

  const onSubmit = () => {
    mutation.mutate(students);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="rounded-xl gap-4 py-4 w-full justify-start cursor-pointer hover:bg-primary/5 focus:bg-primary/5 group/item group transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Users className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex flex-col items-start translate-x-0 group-hover:translate-x-1 transition-transform">
            <span className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary/70 transition-colors leading-none mb-1">Module Access</span>
            <span className="font-black text-sm uppercase tracking-wider text-slate-600 group-hover:text-slate-900 transition-colors">Enroll Students</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[900px] p-0 overflow-hidden rounded-[2rem] sm:rounded-[3rem] border-none shadow-2xl bg-white flex flex-col focus:outline-none focus:ring-0 max-h-[90vh] [&>button]:hidden">
        {/* Premium Header Section */}
        <div className="relative p-6 sm:p-12 pb-6 sm:pb-8 overflow-hidden bg-slate-50/30">
          <div className="absolute top-0 right-0 p-4 sm:p-8 z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="rounded-full h-10 w-10 sm:h-12 sm:w-12 hover:bg-black/5 text-slate-400 transition-all hover:rotate-90"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>

          <div className="absolute -top-20 -right-20 w-40 sm:w-80 h-40 sm:h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-32 sm:w-64 h-32 sm:h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-700" />

          <div className="relative space-y-4 sm:space-y-8">
            <div className="flex gap-4 sm:gap-6 items-center">
              <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-primary via-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-2xl shadow-primary/30 group">
                <Users className="w-6 h-6 sm:w-10 sm:h-10 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="h-8 sm:h-14 w-[1px] bg-slate-200" />
              <div className="flex flex-col min-w-0">
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-slate-400 mb-0.5 sm:mb-1">IDENTITY TARGET</span>
                <span className="text-sm sm:text-xl font-black text-slate-800 tracking-tight italic uppercase truncate">{courseName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Deployment Metadata */}
        <div className="px-6 sm:px-12 py-5 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row gap-4 sm:gap-8 items-center">
          <div className="flex-1 w-full space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Target Department</span>
              <div className="h-[1px] flex-1 bg-slate-200/50" />
            </div>
            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger className="h-11 rounded-xl bg-white border-slate-200 font-bold text-slate-700 shadow-sm transition-all focus:ring-primary/20 hover:border-primary/30">
                <SelectValue placeholder="Select Department (Optional)" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                {departments.map((dept: any) => (
                  <SelectItem key={dept.id} value={dept.id.toString()} className="font-bold py-3 uppercase text-[10px] tracking-widest cursor-pointer">
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-56 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Academic Year</span>
              <div className="h-[1px] flex-1 bg-slate-200/50" />
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-11 rounded-xl bg-white border-slate-200 font-bold text-slate-700 shadow-sm transition-all focus:ring-primary/20 hover:border-primary/30">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                {[1, 2, 3, 4, 5].map((year) => (
                  <SelectItem key={year} value={year.toString()} className="font-bold py-3 uppercase text-[10px] tracking-widest cursor-pointer">
                    {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dropzone Interface */}
        <div className="px-6 sm:px-12 py-3 bg-white border-b border-slate-100">
          <div
            {...getRootProps()}
            className={cn(
              "group relative border-2 border-dashed rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-5 transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-sm bg-slate-50/50",
              isDragActive ? "border-primary bg-primary/5 scale-[0.98]" : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
            )}
          >
            <input {...getInputProps()} />
            <div className="relative z-10 flex flex-col items-center justify-center gap-2 sm:gap-3 text-center">
              <div className={cn(
                "w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm",
                isDragActive ? "bg-primary text-white scale-110" : "bg-white text-slate-400 group-hover:text-primary group-hover:bg-primary/5"
              )}>
                {isImporting ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : <FileText className="w-5 h-5 sm:w-6 sm:h-6" />}
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-slate-800">
                  {isDragActive ? "Infiltrating Data..." : "Drop Roster CSV"}
                </p>
                <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Supported: .CSV (Name, ID, Section)
                </p>
              </div>
            </div>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
          </div>
        </div>

        {/* Action Controls */}
        <div className="px-6 sm:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Button
              onClick={addRow}
              className="h-9 sm:h-10 rounded-xl px-4 sm:px-6 bg-slate-900 text-white hover:bg-slate-800 font-black uppercase text-[8px] sm:text-[10px] tracking-widest gap-2 shadow-xl shadow-slate-200 transition-all active:scale-95 flex-1 sm:flex-none"
            >
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Add Identity
            </Button>
            <div className="h-6 w-[1px] bg-slate-100 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary" />
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-slate-400 italic whitespace-nowrap">{students.length} Nodes Ready</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-amber-50 rounded-xl sm:rounded-2xl border border-amber-100 w-full sm:w-auto">
            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
            <span className="text-[8px] sm:text-[10px] font-black text-amber-700 uppercase tracking-tighter">Verified identities only</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto px-6 sm:px-12 pb-6 sm:pb-8">
          <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-100/50 bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 backdrop-blur-sm">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="w-12 sm:w-16 py-4 sm:py-6 pl-4 sm:pl-8 font-black uppercase text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 text-center">#</TableHead>
                    <TableHead className="py-4 sm:py-6 font-black uppercase text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.3em] text-slate-400">Identity Name</TableHead>
                    <TableHead className="py-4 sm:py-6 font-black uppercase text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.3em] text-slate-400">ID</TableHead>
                    <TableHead className="py-4 sm:py-6 font-black uppercase text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.3em] text-slate-400">Sec</TableHead>
                    <TableHead className="w-12 sm:w-20 pr-4 sm:pr-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((row, index) => (
                    <TableRow key={index} className="group hover:bg-primary/[0.02] border-b border-slate-50/50 transition-all duration-300">
                      <TableCell className="text-center font-black text-slate-300 text-[8px] sm:text-[10px] pl-4 sm:pl-8 italic">{index + 1}</TableCell>
                      <TableCell className="py-2 sm:py-4">
                        <Input
                          value={row.name}
                          onChange={(e) => updateRow(index, 'name', e.target.value)}
                          placeholder="Full Name"
                          className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-none bg-transparent font-black focus-visible:ring-0 focus-visible:bg-white focus-visible:shadow-lg transition-all text-xs sm:text-sm px-2 sm:px-4 uppercase tracking-tight min-w-[120px]"
                        />
                      </TableCell>
                      <TableCell className="py-2 sm:py-4">
                        <Input
                          value={row.student_id}
                          onChange={(e) => updateRow(index, 'student_id', e.target.value)}
                          placeholder="ID"
                          className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-none bg-transparent font-mono font-black focus-visible:ring-0 focus-visible:bg-white focus-visible:shadow-lg transition-all text-xs sm:text-sm px-2 sm:px-4 uppercase tracking-widest text-primary/80 min-w-[100px]"
                        />
                      </TableCell>
                      <TableCell className="py-2 sm:py-4">
                        <Input
                          value={row.section || ''}
                          onChange={(e) => updateRow(index, 'section', e.target.value)}
                          placeholder="SEC"
                          className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-none bg-transparent font-black focus-visible:ring-0 focus-visible:bg-white focus-visible:shadow-lg transition-all text-xs sm:text-sm px-2 sm:px-4 uppercase text-center w-12 sm:w-20 mx-auto"
                        />
                      </TableCell>
                      <TableCell className="text-right py-2 sm:py-4 pr-4 sm:pr-8">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRow(index)}
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all sm:opacity-0 group-hover:opacity-100 hover:rotate-12"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Footer Dashboard */}
        <div className="p-6 sm:p-12 bg-slate-900 border-t border-white/5 relative overflow-hidden group mt-auto">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-10">
            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:border-primary/50 transition-colors shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-7 sm:h-7" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-0.5 sm:gap-1">
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-slate-500 leading-none">Authentication Guard</span>
                <p className="text-[9px] sm:text-[11px] font-bold text-slate-400 max-w-[280px] uppercase tracking-tighter leading-tight">
                  Authorized nodes will receive immediate synchronization.
                </p>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                className="flex-1 sm:px-10 h-12 sm:h-16 rounded-xl sm:rounded-2xl font-black uppercase text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              >
                Terminate
              </Button>
              <Button
                onClick={onSubmit}
                disabled={mutation.isPending || students.every(s => !s.name && !s.student_id)}
                className="flex-[2] sm:px-14 h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-primary hover:bg-indigo-500 text-white font-black uppercase text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] shadow-[0_10px_30px_rgba(99,102,241,0.3)] sm:shadow-[0_20px_40px_rgba(99,102,241,0.3)] gap-2 sm:gap-4 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale group/btn overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                {mutation.isPending ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <>
                    <span className="whitespace-nowrap">Deploy Identities</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </Dialog>
  );
};
