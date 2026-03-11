import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Users, 
  MapPin, 
  Clock, 
  AlertCircle,
  Square,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const LiveSessionPage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [students, setStudents] = useState([
    { id: '1', name: 'Alice Johnson', studentId: 'S10023', time: '10:05 AM', status: 'Present' },
    { id: '2', name: 'Bob Smith', studentId: 'S10045', time: '10:07 AM', status: 'Present' },
    { id: '3', name: 'Charlie Davis', studentId: 'S10089', time: '10:08 AM', status: 'Present' },
    { id: '4', name: 'Diana Prince', studentId: 'S10112', time: '10:12 AM', status: 'Present' },
    { id: '5', name: 'Ethan Hunt', studentId: 'S10234', time: '10:15 AM', status: 'Present' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopSession = () => {
    toast.info('Attendance session ended.');
    navigate('/reports');
  };

  // Mock "live" update
  useEffect(() => {
    const interval = setInterval(() => {
      if (students.length < 15) {
        const names = ['Franklin Roosevelt', 'Grace Hopper', 'Harry Potter', 'Iris West', 'Jack Sparrow'];
        const newStudent = {
          id: Math.random().toString(),
          name: names[Math.floor(Math.random() * names.length)],
          studentId: `S${Math.floor(Math.random() * 90000) + 10000}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Present'
        };
        setStudents(prev => [newStudent, ...prev]);
        toast.success(`${newStudent.name} scanned successfully`, { duration: 2000 });
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [students]);

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: QR and Info */}
        <div className="lg:w-1/2 space-y-6">
          <Card className="border-2 border-primary/20 shadow-xl bg-card overflow-hidden">
            <CardHeader className="bg-primary/5 border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Active Scanning</CardTitle>
                  <CardDescription>CS101 - Computer Science 101</CardDescription>
                </div>
                <Badge variant="outline" className="animate-pulse bg-green-500/10 text-green-600 border-green-200">
                  LIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-10">
              <div className="p-4 bg-white rounded-2xl shadow-inner border-8 border-gray-50 mb-6">
                <QRCodeSVG 
                  value="https://geoattend.app/scan/session-12345" 
                  size={280}
                  level="H"
                  includeMargin={true}
                />
              </div>
              
              <div className="text-center space-y-2 mb-8">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Session Token</h3>
                <div className="text-4xl font-black tracking-[0.5em] text-primary">8 X 4 Z</div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col items-center p-4 rounded-xl bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1 uppercase">Time Remaining</div>
                  <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-foreground font-mono'}`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1 uppercase">Students Scanned</div>
                  <div className="text-2xl font-bold">{students.length} / 120</div>
                </div>
              </div>
            </CardContent>
            <div className="p-6 border-t flex flex-col gap-3">
              <Button variant="destructive" className="w-full gap-2 py-6 text-lg font-semibold shadow-lg shadow-red-500/10" onClick={handleStopSession}>
                <Square className="w-5 h-5 fill-current" />
                Stop Attendance Session
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Ending this session will generate the final report immediately.
              </p>
            </div>
          </Card>

          <Card className="border bg-muted/5">
            <CardHeader className="p-4 pb-0">
              <CardDescription className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Session Environmental Monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-4 flex flex-col gap-3">
               <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-muted-foreground">Classroom GPS Lock</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-transparent">ACTIVE</Badge>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="text-muted-foreground">Network Integrity</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-transparent">STABLE</Badge>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live List */}
        <div className="lg:w-1/2">
          <Card className="border shadow-sm h-full flex flex-col overflow-hidden">
            <CardHeader className="border-b bg-muted/10 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Live Attendance List
                </CardTitle>
                <div className="flex gap-2">
                   <Button variant="outline" size="sm" className="h-8">Export CSV</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              <Table>
                <TableHeader className="bg-muted/30 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-[200px]">Student</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Recorded</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} className="animate-in slide-in-from-right-4 duration-300">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {student.name.charAt(0)}
                          </div>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{student.studentId}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        <div className="flex items-center gap-1.5 font-mono">
                          <Clock className="w-3 h-3" />
                          {student.time}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-transparent">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {student.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {students.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground space-y-2">
                  <Users className="w-12 h-12 opacity-20" />
                  <p>Waiting for first scan...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionPage;
