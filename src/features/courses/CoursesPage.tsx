import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  Users,
  Calendar
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import api from '@/services/api';

interface Course {
  id: number;
  name: string;
  code: string;
  lecturer_id: number;
  students?: number; // Optional for now
  sessions?: number; // Optional for now
  status?: string;   // Optional for now
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses/');
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading courses...</div>;
  }
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground mt-2">Manage your academic courses and student enrollment.</p>
        </div>
        <Button className="w-full md:w-auto gap-2">
          <Plus className="w-4 h-4" />
          Add Course
        </Button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search courses..."
              className="pl-9 bg-background"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex">Filter</Button>
            <Button variant="outline" size="sm" className="hidden md:flex">Export</Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">Course Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Sessions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id} className="group transition-colors">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{course.name}</span>
                    <span className="text-xs text-muted-foreground md:hidden">{course.code}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" className="font-mono">{course.code}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{course.students || 0}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{course.sessions || 0}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={(course.status || 'Active') === 'Active' ? 'default' : 'secondary'} className={(course.status || 'Active') === 'Active' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-transparent' : ''}>
                    {course.status || 'Active'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="gap-2 focus:bg-primary/5 focus:text-primary">
                        <Eye className="w-4 h-4" /> View Sessions
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Edit2 className="w-4 h-4" /> Edit Course
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <Trash2 className="w-4 h-4" /> Delete Course
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Showing 6 of 12 courses</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
