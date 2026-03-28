import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  File, 
  Plus,
  Loader2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

interface Material {
  id: number;
  title: string;
  description: string | null;
  folder_name: string | null;
  file_path: string;
  original_filename?: string;
  file_type: string;
  file_size: number;
  course_id: number;
  created_at: string;
}

interface CourseMaterialsProps {
  courseId: number;
  courseLecturerId: number;
  lecturers?: { id: number }[];
}

const CourseMaterials: React.FC<CourseMaterialsProps> = ({ courseId, courseLecturerId, lecturers = [] }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    folder_name: 'General',
    file: null as File | null,
  });

  const { data: materials, isLoading, error } = useQuery<Material[]>({
    queryKey: ['course-materials', courseId],
    queryFn: async () => {
      const { data } = await api.get(`/materials/course/${courseId}`);
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await api.post('/materials/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      toast.success('Material uploaded successfully');
      setIsUploadOpen(false);
      setUploadData({ title: '', description: '', folder_name: 'General', file: null });
      queryClient.invalidateQueries({ queryKey: ['course-materials', courseId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to upload material');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (materialId: number) => {
      return await api.delete(`/materials/${materialId}`);
    },
    onSuccess: () => {
      toast.success('Material deleted');
      queryClient.invalidateQueries({ queryKey: ['course-materials', courseId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to delete material');
    },
  });

  const isLecturer = user?.role === 'lecturer' && (
    Number(user.id) === courseLecturerId || 
    lecturers.some(l => Number(l.id) === Number(user.id))
  );

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.title) {
      toast.error('Title and file are required');
      return;
    }

    const formData = new FormData();
    formData.append('course_id', courseId.toString());
    formData.append('title', uploadData.title);
    if (uploadData.description) formData.append('description', uploadData.description);
    formData.append('folder_name', uploadData.folder_name || 'General');
    formData.append('file', uploadData.file);

    uploadMutation.mutate(formData);
  };

  const handleDownload = async (materialId: number, filename: string) => {
    try {
      const response = await api.get(`/materials/${materialId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download material');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <div className="p-3 bg-red-100 text-red-600 rounded-xl"><FileText className="w-6 h-6" /></div>;
    if (type.includes('image')) return <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><File className="w-6 h-6" /></div>;
    return <div className="p-3 bg-stone-100 text-stone-600 rounded-xl"><FileText className="w-6 h-6" /></div>;
  };

  const groupedMaterials = materials?.reduce((acc: Record<string, Material[]>, item) => {
    const folder = item.folder_name || 'General';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(item);
    return acc;
  }, {}) || {};
  
  const folders = Object.keys(groupedMaterials).sort(
    (a, b) => (a === 'General' ? -1 : b === 'General' ? 1 : a.localeCompare(b))
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-black uppercase tracking-widest text-stone-400">Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div>
          <h3 className="text-xl font-black text-stone-900">Access Denied</h3>
          <p className="text-stone-500 font-medium">You don't have permission to view materials for this course.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">Course Materials</h2>
          <p className="text-stone-500 font-medium">Reference documents and resources shared by your lecturer.</p>
        </div>
        
        {isLecturer && (
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 px-8 rounded-2xl bg-stone-900 text-white hover:bg-stone-800 font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-stone-900/10">
                <Plus className="w-4 h-4" />
                Upload Material
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
               <div className="p-8 bg-stone-900 text-white">
                  <DialogTitle className="text-2xl font-black tracking-tight">Upload Resource</DialogTitle>
                  <DialogDescription className="text-stone-400 font-medium mt-1">
                    Add a new file for your students to download.
                  </DialogDescription>
               </div>
               <form onSubmit={handleUpload} className="p-8 space-y-6 bg-white">
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Title</label>
                       <Input 
                         placeholder="e.g. Week 1 Lecture Slides" 
                         value={uploadData.title}
                         onChange={e => setUploadData({...uploadData, title: e.target.value})}
                         className="h-12 rounded-xl border-stone-100 bg-stone-50 focus:ring-stone-900/5 transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Description (Optional)</label>
                       <textarea 
                         placeholder="Provide context for this material..."
                         value={uploadData.description}
                         onChange={e => setUploadData({...uploadData, description: e.target.value})}
                         className="w-full min-h-[100px] p-4 rounded-xl border border-stone-100 bg-stone-50 focus:ring-4 focus:ring-stone-900/5 transition-all outline-none text-sm font-medium resize-none"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Folder Group</label>
                       <Input 
                         placeholder="e.g. Week 1, General, Assignments" 
                         value={uploadData.folder_name}
                         onChange={e => setUploadData({...uploadData, folder_name: e.target.value})}
                         className="h-12 rounded-xl border-stone-100 bg-stone-50 focus:ring-stone-900/5 transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">File</label>
                       <div className="relative group">
                          <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            onChange={e => setUploadData({...uploadData, file: e.target.files?.[0] || null})}
                          />
                          <div className={cn(
                            "h-24 rounded-2xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-2 group-hover:border-stone-900/20 group-hover:bg-stone-50 transition-all",
                            uploadData.file && "border-stone-900 bg-stone-50/50"
                          )}>
                             <Upload className={cn("w-6 h-6", uploadData.file ? "text-stone-900" : "text-stone-300")} />
                             <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                               {uploadData.file ? uploadData.file.name : 'Click or drag to upload'}
                             </span>
                          </div>
                       </div>
                    </div>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button 
                      type="submit" 
                      disabled={uploadMutation.isPending}
                      className="w-full h-14 rounded-2xl bg-stone-900 hover:bg-stone-800 font-black text-xs uppercase tracking-widest gap-2"
                    >
                      {uploadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      Start Upload
                    </Button>
                  </DialogFooter>
               </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-12">
        {materials && materials.length > 0 ? (
          folders.map((folder) => (
            <div key={folder} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-stone-100 rounded-xl shadow-inner border border-stone-200 text-stone-800 text-sm font-black uppercase tracking-widest">
                  {folder}
                </div>
                <div className="h-px bg-stone-200 flex-1 hidden md:block" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedMaterials[folder].map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative bg-white p-8 rounded-[32px] border border-stone-200/60 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-stone-50 rounded-full -mr-12 -mt-12 group-hover:bg-primary/5 transition-colors duration-500" />
                    
                    <div className="flex justify-between items-start mb-6 relative">
                       {getFileIcon(item.file_type)}
                       {isLecturer && (
                         <AlertDialog>
                           <AlertDialogTrigger asChild>
                             <Button 
                               variant="ghost" 
                               className="h-10 w-10 p-0 rounded-xl hover:bg-red-50 hover:text-red-500 text-stone-300 transition-all opacity-0 group-hover:opacity-100"
                             >
                               <Trash2 className="w-4 h-4" />
                             </Button>
                           </AlertDialogTrigger>
                           <AlertDialogContent className="rounded-[2rem] p-8 border-foreground/10 bg-background/80 backdrop-blur-3xl">
                             <AlertDialogHeader>
                               <AlertDialogTitle className="text-2xl font-black">Delete material?</AlertDialogTitle>
                               <AlertDialogDescription className="font-medium text-muted-foreground">
                                 This action cannot be undone. This material will be permanently removed.
                               </AlertDialogDescription>
                             </AlertDialogHeader>
                             <AlertDialogFooter className="mt-6">
                               <AlertDialogCancel className="rounded-2xl h-12 px-6 font-bold">Cancel</AlertDialogCancel>
                               <AlertDialogAction
                                 onClick={() => deleteMutation.mutate(item.id)}
                                 className="bg-red-500 text-white hover:bg-red-600 rounded-2xl h-12 px-6 font-bold"
                               >
                                 Delete
                               </AlertDialogAction>
                             </AlertDialogFooter>
                           </AlertDialogContent>
                         </AlertDialog>
                       )}
                    </div>

                    <div className="space-y-4 relative">
                      <div>
                        <h3 className="font-black text-lg text-stone-900 leading-tight group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-xs text-stone-500 font-medium mt-2 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-stone-400">
                          <div className="flex items-center gap-1.5 bg-stone-50 px-2 py-1 rounded-lg">
                             <Clock className="w-3 h-3" />
                             {format(new Date(item.created_at), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center gap-1.5 bg-stone-50 px-2 py-1 rounded-lg">
                             {formatFileSize(item.file_size)}
                          </div>
                        </div>

                        <button 
                          onClick={() => handleDownload(item.id, item.original_filename || item.title)}
                          className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-900 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all duration-300 no-underline"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download File
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-stone-50/50 rounded-[40px] border border-stone-200 border-dashed">
            <div className="w-20 h-20 rounded-[32px] bg-white shadow-xl flex items-center justify-center text-stone-200">
              <FileText className="w-8 h-8" />
            </div>
            <div className="max-w-xs mx-auto">
              <h3 className="text-xl font-black text-stone-900">No resources shared yet</h3>
              <p className="text-stone-500 font-medium mt-2">
                Materials shared by the lecturer will appear here for you to download.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseMaterials;
