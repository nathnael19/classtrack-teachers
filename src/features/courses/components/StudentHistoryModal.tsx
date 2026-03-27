import { useQuery } from '@tanstack/react-query';
import { 
  History, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MinusCircle,
  Calendar,
  MapPin,
  Smartphone
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger,
  DialogClose 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import api from '@/services/api';
import { cn } from '@/lib/utils';

interface AttendanceRecord {
  id: number;
  timestamp: string;
  status: 'present' | 'late' | 'absent';
  verification_method: string;
  session_topic?: string;
}

interface StudentHistoryModalProps {
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
}

export const StudentHistoryModal = ({ studentId, studentName, courseId, courseName }: StudentHistoryModalProps) => {
  const { data: history = [], isLoading } = useQuery<AttendanceRecord[]>({
    queryKey: ['student-history', studentId, courseId],
    queryFn: async () => {
      const { data } = await api.get(`/attendance/history/student/${studentId}/course/${courseId}`);
      return data;
    },
    enabled: !!studentId && !!courseId
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'late': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'absent': return <MinusCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all group text-left">
          <History className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
          View Full History
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white flex flex-col max-h-[85vh] [&>button]:hidden">
        <div className="relative p-8 sm:p-10 overflow-hidden bg-slate-50/50 flex-shrink-0">
           <DialogClose asChild>
             <Button
                variant="ghost"
                size="icon"
                className="absolute top-6 right-6 rounded-full hover:bg-black/5 text-slate-400 z-50 transition-transform active:scale-95"
              >
                <X className="w-5 h-5" />
              </Button>
           </DialogClose>

          <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative space-y-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
                <History className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <Badge variant="outline" className="w-fit mb-1 border-slate-200 text-slate-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Attendance Logs</Badge>
                <DialogTitle className="text-2xl font-black text-slate-900 uppercase italic leading-none">{studentName}</DialogTitle>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{courseName}</span>
              </div>
            </div>
            
            <DialogDescription className="sr-only">
              Full attendance history and chronological logs for the selected student.
            </DialogDescription>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-10 pt-0">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-300">
               <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-primary animate-spin" />
               <span className="text-[10px] font-black uppercase tracking-widest">Compiling Logs...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-6 opacity-20">
               <div className="w-20 h-20 rounded-[2.5rem] bg-slate-100 flex items-center justify-center">
                 <Calendar className="w-10 h-10" />
               </div>
               <span className="font-black text-xl tracking-tight uppercase">No records found</span>
            </div>
          ) : (
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-[1px] before:bg-slate-100 before:z-0">
              {history.map((record) => (
                <div key={record.id} className="relative flex gap-6 items-start group">
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center z-10 transition-all group-hover:scale-110 shadow-sm",
                    record.status === 'present' ? "bg-emerald-50 text-emerald-500 border border-emerald-100" :
                    record.status === 'late' ? "bg-amber-50 text-amber-500 border border-amber-100" :
                    "bg-red-50 text-red-500 border border-red-100"
                  )}>
                    {getStatusIcon(record.status)}
                  </div>
                  
                  <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-0.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                       <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                            {format(new Date(record.timestamp), 'EEEE, MMM dd')}
                          </span>
                          <span className="text-lg font-black text-slate-900 tracking-tight leading-none group-hover:text-primary transition-colors">
                            {format(new Date(record.timestamp), 'HH:mm')}
                          </span>
                       </div>
                       <Badge className={cn(
                          "rounded-full px-4 py-1.5 font-black text-[9px] uppercase tracking-[0.2em] border-none shadow-sm w-fit",
                          record.status === 'present' ? "bg-emerald-500 text-white" :
                          record.status === 'late' ? "bg-amber-500 text-white" :
                          "bg-red-500 text-white"
                       )}>
                         {record.status}
                       </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                       <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Campus</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Smartphone className="w-3 h-3 text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">
                            {record.verification_method.replace('_', ' ')}
                          </span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-8 sm:p-10 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
           <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none mb-1">Total Records</span>
              <span className="text-lg font-black text-slate-900">{history.length} Session Logs</span>
           </div>
           <DialogClose asChild>
             <Button variant="outline" className="rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest px-6 transition-all active:scale-95">
               Dismiss View
             </Button>
           </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
