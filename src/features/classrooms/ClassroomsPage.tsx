import { 
  MapPin, 
  Plus, 
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
  Target
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const classrooms = [
  { id: '1', name: 'Lecture Hall 1', building: 'Main Building', lat: '40.7128', lng: '-74.0060', radius: '50m', sessions: 12 },
  { id: '2', name: 'Lab 3', building: 'East Wing', lat: '40.7130', lng: '-74.0055', radius: '30m', sessions: 8 },
  { id: '3', name: 'Room 204', building: 'North Block', lat: '40.7125', lng: '-74.0070', radius: '25m', sessions: 15 },
  { id: '4', name: 'Auditorium A', building: 'Science Center', lat: '40.7135', lng: '-74.0040', radius: '75m', sessions: 5 },
];

const ClassroomsPage = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classrooms</h1>
          <p className="text-muted-foreground mt-2">Manage physical locations and geofence parameters.</p>
        </div>
        <Button className="w-full md:w-auto gap-2">
          <Plus className="w-4 h-4" />
          Add Classroom
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-card border rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[200px]">Classroom Name</TableHead>
                  <TableHead>Coordinates (Lat, Lng)</TableHead>
                  <TableHead>Radius</TableHead>
                  <TableHead className="hidden md:table-cell">Sessions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classrooms.map((room) => (
                  <TableRow key={room.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">{room.name}</span>
                        <span className="text-xs text-muted-foreground">{room.building}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                       <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {room.lat}, {room.lng}
                       </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1.5 font-medium">
                        <Target className="w-3 h-3" />
                        {room.radius}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm font-medium">{room.sessions} tracked</span>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2"><Edit2 className="w-4 h-4" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2"><ExternalLink className="w-4 h-4" /> Open in Maps</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive focus:bg-destructive/10"><Trash2 className="w-4 h-4" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border shadow-none overflow-hidden">
            <div className="bg-muted aspect-square flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')] bg-cover opacity-60 grayscale filter"></div>
              <div className="z-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white flex flex-col items-center gap-4 text-center max-w-[80%]">
                 <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                    <MapPin className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-bold">Interactive Preview</h3>
                    <p className="text-xs text-muted-foreground mt-1">Select a classroom to visualize its geofence coverage on the campus map.</p>
                 </div>
                 <Button size="sm" variant="outline" className="w-full">Initialize Map Engine</Button>
              </div>
            </div>
            <CardContent className="p-4 bg-card border-t">
               <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Coordinates system:</span>
                  <span className="font-mono font-medium">WGS 84</span>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClassroomsPage;
