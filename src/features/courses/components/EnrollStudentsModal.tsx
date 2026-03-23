import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  Loader2, 
  X,
  Plus,
  Trash2,
  Table as TableIcon,
  Upload,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
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

interface StudentRow {
  name: string;
  student_id: string;
  section?: string;
}

interface EnrollStudentsModalProps {
  courseId: number;
  courseName: string;
}

export const EnrollStudentsModal = ({ courseId, courseName }: EnrollStudentsModalProps) => {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<StudentRow[]>([{ name: '', student_id: '', section: '' }]);
  const [ingestMode, setIngestMode] = useState(false);
  const [rawText, setRawText] = useState('');
  
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (studentList: StudentRow[]) => {
      // Filter out empty rows
      const validStudents = studentList.filter(s => s.name.trim() && s.student_id.trim());
      if (validStudents.length === 0) throw new Error("No data to upload");
      
      return (await api.post(`/courses/${courseId}/enroll`, { students: validStudents })).data;
    },
    onSuccess: (data) => {
      toast.success('Students Enrolled', {
        description: `Successfully enrolled ${data.total_enrolled} students into the course.`,
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setOpen(false);
      setStudents([{ name: '', student_id: '', section: '' }]);
    },
    onError: (error: any) => {
      toast.error('Enrollment Failed', {
        description: error.response?.data?.detail || error.message || 'Failed to enroll students.'
      });
    }
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
    newStudents[index][field] = value;
    setStudents(newStudents);
  };

  const handleIngest = () => {
    // Basic CSV/TSV ingest logic
    const lines = rawText.split('\n').filter(line => line.trim());
    const parsedRows: StudentRow[] = lines.map(line => {
      // Try tab first, then comma
      const parts = line.includes('\t') ? line.split('\t') : line.split(/[,;]/);
      return {
        name: parts[0]?.trim() || '',
        student_id: parts[1]?.trim() || '',
        section: parts[2]?.trim() || ''
      };
    });

    if (parsedRows.length > 0) {
      setStudents(parsedRows);
      setIngestMode(false);
      setRawText('');
      toast.info('Import Complete', {
        description: `${parsedRows.length} students added to the list.`
      });
    }
  };

  const onSubmit = () => {
    mutation.mutate(students);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="rounded-xl gap-4 py-4 w-full justify-start cursor-pointer hover:bg-primary/5 focus:bg-primary/5 group/item">
          <Users className="w-5 h-5 text-muted-foreground group-hover/item:text-primary transition-colors" /> 
          <span className="font-black text-sm uppercase tracking-wider">Enroll Students</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-[3rem] border-none shadow-2xl bg-white flex flex-col focus:outline-none focus:ring-0">
        {/* Premium Header Section */}
        <div className="relative p-10 pb-6 overflow-hidden">
          <div className="absolute top-0 right-0 p-6">
             <Button 
               variant="ghost" 
               size="icon" 
               onClick={() => setOpen(false)}
               className="rounded-full h-12 w-12 hover:bg-black/5 text-slate-400"
             >
                <X className="w-6 h-6" />
             </Button>
          </div>

          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

          <div className="relative space-y-6">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-primary/30">
                <Users className="w-8 h-8" />
              </div>
              <div className="h-10 w-[2px] bg-slate-100 hidden sm:block" />
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Target Module</span>
                <span className="text-sm font-black text-primary truncate max-w-[200px]">{courseName}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-3 py-1 italic">Batch Enrollment</Badge>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Biometric Database Ready</span>
                </div>
              </div>
              <DialogTitle className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                Enroll Students
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-semibold text-lg max-w-lg">
                Enroll multiple students at once into this course.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-10 py-4 bg-slate-50/50 border-y border-slate-100 flex items-center justify-between">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => setIngestMode(!ingestMode)}
              className={cn(
                "rounded-xl h-10 px-6 font-black uppercase text-[10px] tracking-widest gap-2 transition-all shadow-sm",
                ingestMode ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              )}
            >
              <Upload className="w-3.5 h-3.5" />
              Batch Import
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={addRow}
              className="rounded-xl h-10 px-6 bg-white border-slate-200 font-black uppercase text-[10px] tracking-widest gap-2 shadow-sm hover:bg-slate-50"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Row
            </Button>
          </div>
          <div className="flex items-center gap-2 opacity-50">
             <TableIcon className="w-4 h-4 text-slate-400" />
             <span className="text-[10px] font-black uppercase tracking-widest">{students.length} Entries</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto max-h-[450px] p-10 pt-6">
          {ingestMode ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
               <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                 <Info className="w-4 h-4 text-indigo-500" />
                 <p className="text-[10px] font-bold text-indigo-600 leading-tight uppercase tracking-wider">
                   Strategy: Paste student data from Excel or CSV. Format: [Name][Tab/Comma][ID]
                 </p>
               </div>
               <textarea
                 value={rawText}
                 onChange={(e) => setRawText(e.target.value)}
                 placeholder="Example:
// Format: Name, ID, Section
John Doe,S2024001,A
Jane Smith,S2024002,B"
                 className="w-full h-80 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 p-8 font-mono text-sm focus:outline-none focus:border-primary/50 transition-all shadow-inner"
               />
               <div className="flex gap-4">
                  <Button onClick={() => setIngestMode(false)} variant="ghost" className="flex-1 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest">Cancel</Button>
                  <Button onClick={handleIngest} className="flex-[2] h-12 rounded-xl bg-primary hover:bg-primary/90 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/10">Import Students</Button>
               </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="py-5 font-black uppercase text-[9px] tracking-[0.3em] text-slate-400">Student Name</TableHead>
                    <TableHead className="py-5 font-black uppercase text-[9px] tracking-[0.3em] text-slate-400">Student ID</TableHead>
                    <TableHead className="py-5 font-black uppercase text-[9px] tracking-[0.3em] text-slate-400">Section</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((row, index) => (
                    <TableRow key={index} className="group hover:bg-indigo-50/20 border-b border-slate-50 transition-colors duration-300">
                      <TableCell className="text-center font-black text-slate-200 text-[10px]">{index + 1}</TableCell>
                      <TableCell className="py-4">
                        <Input
                          value={row.name}
                          onChange={(e) => updateRow(index, 'name', e.target.value)}
                          placeholder="e.g. Alex Johnson"
                          className="h-12 rounded-xl border-none bg-transparent font-bold focus-visible:ring-0 focus-visible:bg-white focus-visible:shadow-sm transition-all text-sm px-4"
                        />
                      </TableCell>
                      <TableCell className="py-4">
                        <Input
                          value={row.student_id}
                          onChange={(e) => updateRow(index, 'student_id', e.target.value)}
                          placeholder="e.g. STU-992-K"
                          className="h-12 rounded-xl border-none bg-transparent font-mono font-black focus-visible:ring-0 focus-visible:bg-white focus-visible:shadow-sm transition-all text-sm px-4 uppercase"
                        />
                      </TableCell>
                      <TableCell className="py-4">
                        <Input
                          value={row.section || ''}
                          onChange={(e) => updateRow(index, 'section', e.target.value)}
                          placeholder="e.g. A"
                          className="h-12 rounded-xl border-none bg-transparent font-bold focus-visible:ring-0 focus-visible:bg-white focus-visible:shadow-sm transition-all text-sm px-4"
                        />
                      </TableCell>
                      <TableCell className="text-right py-4 pr-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRow(index)}
                          className="h-10 w-10 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div className="p-10 bg-slate-50/80 backdrop-blur-md border-t border-slate-100 mt-auto">
           <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                   <ShieldCheck className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Data Security</span>
                  <p className="text-[10px] font-bold text-slate-500 max-w-[240px]">
                    Enrolled students will be able to mark attendance for this course.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  onClick={() => setOpen(false)}
                  className="flex-1 sm:px-8 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-600 transition-all"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={onSubmit}
                  disabled={mutation.isPending || students.every(s => !s.name && !s.student_id)}
                  className="flex-[2] sm:px-12 h-14 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/20 gap-3 border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 transition-all"
                >
                  {mutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Enroll Students
                </Button>
              </div>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
