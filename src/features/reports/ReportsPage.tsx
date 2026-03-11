import { useState } from 'react';
import { 
  Search, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileJson,
  Calendar,
  ChevronDown
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
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const reports = [
  { id: '1', course: 'Computer Science 101', date: '2023-11-15', classroom: 'L-Hall 1', students: 114, total: 120, rate: '95%', lecturer: 'John Doe' },
  { id: '2', course: 'Machine Learning', date: '2023-11-14', classroom: 'Lab 3', students: 48, total: 50, rate: '96%', lecturer: 'John Doe' },
  { id: '3', course: 'Computer Science 101', date: '2023-11-13', classroom: 'L-Hall 1', students: 108, total: 120, rate: '90%', lecturer: 'John Doe' },
  { id: '4', course: 'Data Structures', date: '2023-11-12', classroom: 'Room 204', students: 102, total: 110, rate: '92%', lecturer: 'John Doe' },
  { id: '5', course: 'Database Management', date: '2023-11-10', classroom: 'Lab 2', students: 78, total: 85, rate: '91%', lecturer: 'John Doe' },
  { id: '6', course: 'Computer Science 101', date: '2023-11-08', classroom: 'L-Hall 1', students: 112, total: 120, rate: '93%', lecturer: 'John Doe' },
];

const ReportsPage = () => {
  const [isExporting, setIsExporting] = useState(false);

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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Reports</h1>
          <p className="text-muted-foreground mt-2">Export and analyze historical attendance data.</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={isExporting} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuItem className="gap-2" onClick={() => handleExport('CSV')}>
                <FileSpreadsheet className="w-4 h-4 text-green-600" /> Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={() => handleExport('Excel')}>
                <FileSpreadsheet className="w-4 h-4 text-green-700" /> Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={() => handleExport('PDF')}>
                <FileText className="w-4 h-4 text-red-600" /> Export to PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={() => handleExport('JSON')}>
                <FileJson className="w-4 h-4 text-blue-600" /> Export to JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="border shadow-none bg-background">
        <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input placeholder="Search reports..." className="pl-9 bg-muted/20 border-none shadow-none focus-visible:ring-1" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] border-none bg-muted/20 shadow-none focus:ring-1">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="cs101">CS 101</SelectItem>
                <SelectItem value="ml402">Machine Learning</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-md text-xs font-medium text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              Last 30 Days
            </div>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-muted/10">
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="hidden md:table-cell">Classroom</TableHead>
              <TableHead className="hidden md:table-cell">Lecturer</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id} className="hover:bg-muted/5 transition-colors">
                <TableCell className="font-medium">{report.course}</TableCell>
                <TableCell className="text-muted-foreground whitespace-nowrap">{report.date}</TableCell>
                <TableCell className="hidden md:table-cell">{report.classroom}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{report.lecturer}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{report.rate}</span>
                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full bg-primary" style={{width: report.rate}}></div>
                    </div>
                    <span className="text-xs text-muted-foreground hidden lg:block">{report.students}/{report.total}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button variant="ghost" size="sm" className="h-8 gap-2">
                    <FileText className="w-4 h-4" />
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-6 border-t flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">1-6</span> of <span className="font-medium text-foreground">54</span> entries
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" size="sm" disabled>Previous</Button>
             <div className="flex gap-1">
                {[1, 2, 3, '...', 9].map((p, i) => (
                  <Button key={i} variant={p === 1 ? 'default' : 'outline'} size="sm" className="w-8 h-8 p-0">
                    {p}
                  </Button>
                ))}
             </div>
             <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
