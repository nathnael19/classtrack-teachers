import { ShieldCheck, BarChart3, FileText, Clock, Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    title: 'Dynamic QR Codes',
    description: 'Codes refresh automatically every few seconds to prevent cheating and sharing.',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    title: 'Real-time Analytics',
    description: 'Track student attendance trends and identify at-risk individuals instantly.',
    icon: BarChart3,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    title: 'Secure Validation',
    description: 'Location-based tracking ensures students are actually in the classroom.',
    icon: ShieldCheck,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    title: 'Instant Reports',
    description: 'Export attendance records to PDF or CSV in a single click for administrators.',
    icon: FileText,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    title: 'Time Saving',
    description: 'Reclaim 10+ minutes per class previously spent calling out names.',
    icon: Clock,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    title: 'Student Portal',
    description: 'Empower students to track their own attendance and participation metrics.',
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
];

const FeatureSection = () => {
  return (
    <section id="features" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Everything you need for seamless class management
          </h2>
          <p className="text-xl text-muted-foreground">
            ClassTrack replaces outdated roll calls with a fast, modern system built for 21st-century educators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass-card p-8 rounded-3xl group cursor-pointer hover:border-primary/30"
            >
              <div 
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                  feature.bg,
                  feature.color
                )}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
