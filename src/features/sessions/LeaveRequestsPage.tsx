import { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  MapPin,
  ExternalLink,
  ClipboardList,
  Filter,
  ArrowRight,
  Clock,
  Check,
  X,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';

interface LeaveRequest {
  id: number;
  session_id: number;
  student_id: number;
  student_name?: string;
  course_name?: string;
  session_start?: string;
  session_room?: string;
  reason: string;
  document_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: number;
}

const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) => (
  <GlassCard
    className="rounded-3xl p-6 flex items-center gap-5 group border-white/20"
  >
    <div className={cn("p-4 rounded-2xl bg-gradient-to-br transition-transform duration-500 group-hover:scale-110", color)}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-0.5">{label}</p>
      <p className="text-3xl font-black tracking-tighter text-foreground font-['Satoshi']">{value}</p>
    </div>
  </GlassCard>
);

const LeaveRequestsPage = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: requests = [], isLoading } = useQuery<LeaveRequest[]>({
    queryKey: ['leave-requests'],
    queryFn: async () => (await api.get('/leave_requests/')).data,
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'approved' | 'rejected' }) => {
      return (await api.patch(`/leave_requests/${id}`, { status })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast.success('Leave request updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update leave request');
    },
  });

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  if (isLoading && requests.length === 0) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center gap-8">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ClipboardList className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">
          Synchronizing Leave Data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between px-2">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="h-1 w-12 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Approvals Engine</span>
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground font-['Satoshi']">
            Leave Requests <span className="text-primary/20">.</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-lg font-medium max-w-xl leading-relaxed">
            Manage academic absence requests with high-fidelity review tools and real-time status tracking.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/40 dark:bg-black/20 p-2 rounded-2xl backdrop-blur-md border border-white/20">
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-xl h-10 w-10 transition-all", viewMode === 'grid' && "bg-white shadow-sm text-primary")}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-xl h-10 w-10 transition-all", viewMode === 'list' && "bg-white shadow-sm text-primary")}
            onClick={() => setViewMode('list')}
          >
            <List className="w-5 h-5" />
          </Button>
          <div className="w-px h-6 bg-border/40 mx-2" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-transparent border-none shadow-none focus:ring-0 text-sm font-bold uppercase tracking-wider">
              <Filter className="w-4 h-4 mr-2 opacity-50" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/20 backdrop-blur-xl">
              <SelectItem value="all">Global View</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-2">
        <StatCard label="Total Submissions" value={requests.length} icon={ClipboardList} color="bg-primary shadow-lg shadow-primary/20" />
        <StatCard label="Pending Approval" value={pendingCount} icon={Clock} color="bg-amber-500 shadow-lg shadow-amber-500/20" />
        <StatCard label="Approved" value={approvedCount} icon={Check} color="bg-emerald-500 shadow-lg shadow-emerald-500/20" />
        <StatCard label="Rejected" value={rejectedCount} icon={X} color="bg-rose-500 shadow-lg shadow-rose-500/20" />
      </div>

      {/* Content Section */}
      <div className="px-2">
        <AnimatePresence mode="wait">
          {filteredRequests.length === 0 ? (
            <GlassCard
              className="rounded-[3rem] p-24 text-center border-dashed border-2 border-white/40"
              noHover
            >
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                <FileText className="w-12 h-12 text-primary/20" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-foreground font-['Satoshi'] mb-2">No Records Found</h3>
              <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                {statusFilter !== 'all'
                  ? `There are currently no requests with "${statusFilter}" status.`
                  : 'Start by encouraging students to submit leave requests through the ClassTrack mobile app.'}
              </p>
            </GlassCard>
          ) : (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "gap-6",
                viewMode === 'grid' ? "grid grid-cols-1 lg:grid-cols-3" : "flex flex-col"
              )}
            >
              {filteredRequests.map((req) => (
                <GlassCard
                  className="rounded-[2.5rem] p-8 flex flex-col group hover:border-primary/20 transition-all duration-500"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black tracking-tight text-foreground font-['Satoshi'] underline decoration-primary/10 decoration-2 underline-offset-4">
                          {req.student_name || `Student #${req.student_id}`}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/30" />
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 leading-none">
                            {req.course_name || 'General Inquiry'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "rounded-full px-4 py-1 border-none font-black text-[10px] uppercase tracking-widest transition-all duration-500",
                        req.status === 'approved' && "bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white",
                        req.status === 'rejected' && "bg-rose-500/10 text-rose-600 group-hover:bg-rose-500 group-hover:text-white",
                        req.status === 'pending' && "bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white"
                      )}
                    >
                      {req.status}
                    </Badge>
                  </div>

                  <div className="space-y-4 mb-8 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted/50 mt-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Scheduled Period</p>
                        <p className="text-sm font-semibold text-foreground font-['Satoshi']">
                          {req.session_start ? format(new Date(req.session_start), 'MMMM d, yyyy • HH:mm') : 'Indefinite'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted/50 mt-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Location Context</p>
                        <p className="text-sm font-semibold text-foreground font-['Satoshi']">{req.session_room || 'Remote Session'}</p>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/40 mb-2 flex items-center gap-2">
                        <ArrowRight className="w-3 h-3 text-primary" /> Reason for Absence
                      </p>
                      <p className="text-sm font-medium leading-relaxed italic text-muted-foreground">
                        "{req.reason}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-border/40">
                    <div className="flex items-center gap-4">
                      {req.document_url ? (
                        <a
                          href={req.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 hover:bg-primary hover:text-white text-xs font-bold uppercase tracking-widest transition-all duration-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Doc
                        </a>
                      ) : (
                        <div className="px-4 py-2 rounded-xl bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 flex items-center gap-2">
                          <XCircle className="w-4 h-4 opacity-10" />
                          No Support
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {req.status === 'pending' ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-10 px-5 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all duration-300"
                            onClick={() => reviewMutation.mutate({ id: req.id, status: 'rejected' })}
                            disabled={reviewMutation.isPending}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="h-10 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all duration-300"
                            onClick={() => reviewMutation.mutate({ id: req.id, status: 'approved' })}
                            disabled={reviewMutation.isPending}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                          <Clock className="w-3 h-3 text-orange-500" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">Decision Finalized</span>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default LeaveRequestsPage;
