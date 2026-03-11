import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Award,
  ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// --- Dummy Data ---
const coursePerformanceData = [
  { name: 'CS101', rate: 94 },
  { name: 'CS202', rate: 82 },
  { name: 'MATH101', rate: 88 },
  { name: 'PHY201', rate: 76 },
  { name: 'ENG101', rate: 91 },
  { name: 'ART101', rate: 95 },
];

const weeklyTrendData = [
  { week: 'W1', present: 850, absent: 150 },
  { week: 'W2', present: 880, absent: 120 },
  { week: 'W3', present: 820, absent: 180 },
  { week: 'W4', present: 900, absent: 100 },
  { week: 'W5', present: 930, absent: 70 },
  { week: 'W6', present: 890, absent: 110 },
];

const participationData = [
  { name: 'Early Bird', value: 45, color: '#10b981' },
  { name: 'On Time', value: 40, color: '#3b82f6' },
  { name: 'Late', value: 10, color: '#f59e0b' },
  { name: 'Absent', value: 5, color: '#ef4444' },
];

const metrics = [
  { title: 'Avg. Attendance Rate', value: '89.2%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  { title: 'Total Sessions', value: '1,248', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'Best Course', value: 'ART101', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
  { title: 'Lowest Course', value: 'PHY201', icon: ArrowDown, color: 'text-red-600', bg: 'bg-red-50' },
];
// ------------------

const AnalyticsPage = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">In-depth insights into attendance patterns and student participation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, i) => (
          <Card key={i} className="overflow-hidden border-none shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${metric.bg} ${metric.color}`}>
                  <metric.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Metrics</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
              <div className="text-2xl font-bold mt-1 tracking-tight">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Attendance Rate by Course</CardTitle>
            <CardDescription>Comparison of attendance percentages across all active courses.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={coursePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} domain={[0, 100]} />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="rate" fill="#171717" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Weekly Attendance Volume</CardTitle>
            <CardDescription>Number of present vs absent student records per week.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend iconType="circle" />
                  <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle>Participation Quality</CardTitle>
            <CardDescription>Breakdown of student arrival status.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={participationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {participationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              {participationData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                  <span className="text-xs font-medium">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Peak Attendance Times</CardTitle>
            <CardDescription>Heatmap of session participation by hour of day.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '08:00 AM', volume: 95 },
                { time: '10:00 AM', volume: 88 },
                { time: '12:00 PM', volume: 65 },
                { time: '02:00 PM', volume: 72 },
                { time: '04:00 PM', volume: 45 },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{item.time}</span>
                    <span>{item.volume}% average</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{width: `${item.volume}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
