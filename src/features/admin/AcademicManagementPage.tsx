import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, Building2, MapPin, CalendarDays } from "lucide-react";

const AcademicManagementPage = () => {
  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Fira Code, monospace' }}>Academic Management</h1>
          <p className="text-muted-foreground mt-1">Manage courses, departments, rooms, and academic terms.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Courses Section */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Courses
              </CardTitle>
              <CardDescription>Manage curriculum offerings.</CardDescription>
            </div>
            <Button size="sm" variant="outline" className="h-8 group">
              <Plus className="h-4 w-4 mr-1 group-hover:rotate-90 transition-transform" />
              Add
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm group-hover:text-primary transition-colors">Computer Science {100 * i}</span>
                    <span className="text-xs text-muted-foreground">CS{100 * i} • 3 Credits</span>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Active</Badge>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-sm mt-2 text-muted-foreground hover:text-primary">
                View all courses &rarr;
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Departments Section */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-rose-600" />
                Departments
              </CardTitle>
              <CardDescription>Manage academic departments.</CardDescription>
            </div>
            <Button size="sm" variant="outline" className="h-8 group">
              <Plus className="h-4 w-4 mr-1 group-hover:rotate-90 transition-transform" />
              Add
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {['Computer Science', 'Mathematics', 'Physics'].map((dept, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm group-hover:text-primary transition-colors">{dept}</span>
                    <span className="text-xs text-muted-foreground">Dr. Smith • {10 + i * 5} Staff</span>
                  </div>
                </div>
              ))}
               <Button variant="ghost" className="w-full text-sm mt-2 text-muted-foreground hover:text-primary">
                View all departments &rarr;
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rooms Section */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-amber-600" />
                Rooms
              </CardTitle>
              <CardDescription>Manage physical spaces and capacities.</CardDescription>
            </div>
            <Button size="sm" variant="outline" className="h-8 group">
              <Plus className="h-4 w-4 mr-1 group-hover:rotate-90 transition-transform" />
              Add
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {['Block A - 101', 'Block B - 204', 'Lab 3'].map((room, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer group">
                   <div className="flex flex-col">
                    <span className="font-semibold text-sm group-hover:text-amber-600 transition-colors">{room}</span>
                    <span className="text-xs text-muted-foreground">Capacity: {30 + i * 15}</span>
                  </div>
                  <Badge variant="outline">Available</Badge>
                </div>
              ))}
               <Button variant="ghost" className="w-full text-sm mt-2 text-muted-foreground hover:text-primary">
                View all rooms &rarr;
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Terms Section */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-emerald-600" />
                Academic Terms
              </CardTitle>
              <CardDescription>Manage semesters and dates.</CardDescription>
            </div>
            <Button size="sm" variant="outline" className="h-8 group">
              <Plus className="h-4 w-4 mr-1 group-hover:rotate-90 transition-transform" />
              Add
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
               <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors cursor-pointer group">
                   <div className="flex flex-col">
                    <span className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">Spring 2026</span>
                    <span className="text-xs text-muted-foreground">Jan 10 - May 24</span>
                  </div>
                  <Badge className="bg-emerald-500">Current</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer group">
                   <div className="flex flex-col">
                    <span className="font-semibold text-sm group-hover:text-primary transition-colors">Fall 2025</span>
                    <span className="text-xs text-muted-foreground">Sep 01 - Dec 15</span>
                  </div>
                  <Badge variant="outline" className="text-muted-foreground">Completed</Badge>
                </div>
                 <Button variant="ghost" className="w-full text-sm mt-2 text-muted-foreground hover:text-primary">
                View all terms &rarr;
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AcademicManagementPage;
