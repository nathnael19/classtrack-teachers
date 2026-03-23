import { useState } from 'react';
import {
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  MapPin,
  ExternalLink,
  ClipboardList,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

const LeaveRequestsPage = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: requests = [], isLoading } = useQuery<LeaveRequest[]>({
    queryKey: ['leave-requests'],
    queryFn: async () => (await api.get('/leave_requests')).data,
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'approved' | 'rejected' }) => {
      return (await api.patch(`/leave_requests/${id}`, { status })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast.success('Leave request updated');
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

  if (isLoading && requests.length === 0) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
          Loading Leave Requests...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-primary" />
            Leave Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and approve or reject student leave requests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <Badge variant="secondary" className="text-amber-600 bg-amber-500/10 border-amber-500/20">
              {pendingCount} pending
            </Badge>
          )}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="font-bold">No leave requests found</p>
            <p className="text-sm mt-1">
              {statusFilter !== 'all'
                ? `No ${statusFilter} requests. Try changing the filter.`
                : 'Students can submit leave requests from the mobile app.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course / Session</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{req.student_name || `#${req.student_id}`}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span className="font-medium">{req.course_name || '—'}</span>
                      {req.session_start && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(req.session_start), 'MMM d, yyyy HH:mm')}
                        </div>
                      )}
                      {req.session_room && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          {req.session_room}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-[200px] truncate" title={req.reason}>
                      {req.reason}
                    </p>
                  </TableCell>
                  <TableCell>
                    {req.document_url ? (
                      <a
                        href={req.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:underline text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        req.status === 'approved'
                          ? 'default'
                          : req.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className={cn(
                        req.status === 'pending' && 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                      )}
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                          onClick={() => reviewMutation.mutate({ id: req.id, status: 'approved' })}
                          disabled={reviewMutation.isPending}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
                          onClick={() => reviewMutation.mutate({ id: req.id, status: 'rejected' })}
                          disabled={reviewMutation.isPending}
                        >
                          <XCircle className="w-4 h-4 mr-1.5" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default LeaveRequestsPage;
