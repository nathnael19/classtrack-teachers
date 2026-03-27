import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Mail, Send, Loader2, X, Bell } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/services/api';
import { Badge } from '@/components/ui/badge';

interface SendNotificationModalProps {
  studentId: number;
  studentName: string;
}

export const SendNotificationModal = ({ studentId, studentName }: SendNotificationModalProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const sendMutation = useMutation({
    mutationFn: async () => {
      return await api.post('/notifications/', {
        user_id: studentId,
        title,
        message
      });
    },
    onSuccess: () => {
      toast.success(`Notification sent to ${studentName}`);
      setOpen(false);
      setTitle('');
      setMessage('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to send notification');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error('Please fill in all fields');
      return;
    }
    sendMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all group text-left">
          <Mail className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
          Send Notification
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl bg-white [&>button]:hidden">
        <div className="relative p-8 overflow-hidden bg-slate-50/50">
           {/* Close Button */}
           <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 rounded-full hover:bg-black/5 text-slate-400 z-50"
            >
              <X className="w-5 h-5" />
            </Button>

          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Bell className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <Badge variant="outline" className="w-fit mb-1 border-primary/20 text-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Message Portal</Badge>
                <DialogTitle className="text-xl font-black text-slate-900 uppercase italic leading-none">Notify Student</DialogTitle>
              </div>
            </div>
            
            <DialogDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sending to: <span className="text-primary font-black">{studentName}</span>
            </DialogDescription>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div className="space-y-4">
            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Subject</label>
               <Input 
                 placeholder="e.g. Attendance Warning"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 className="rounded-xl border-slate-100 bg-slate-50/50 h-12 focus-visible:ring-primary/20 font-bold"
               />
            </div>
            
            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Message</label>
               <Textarea 
                 placeholder="Type your message here..."
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 className="rounded-xl border-slate-100 bg-slate-50/50 min-h-[120px] focus-visible:ring-primary/20 font-medium leading-relaxed"
               />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={sendMutation.isPending}
            className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-900/10 gap-2 active:scale-[0.98] transition-all"
          >
            {sendMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Transmit Notification
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
