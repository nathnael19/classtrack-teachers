import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "ClassTrack has fundamentally shifted how we monitor student engagement. The real-time attendance tracking is leagues ahead of traditional systems.",
    author: "Dr. Elena Vance",
    role: "Dean of Computer Science",
    institution: "St. Jude's University",
    image: "/api/placeholder/64/64"
  },
  {
    quote: "The administrative overhead we saved in the first term alone paid for the entire integration. It's an indispensable tool for modern registrars.",
    author: "Marcus Thorne",
    role: "University Registrar",
    institution: "Nexus Institute",
    image: "/api/placeholder/64/64"
  },
  {
    quote: "Student accountability has surged by 22% since deploying the Secure Radius protocol. The results are scientifically undeniable.",
    author: "Prof. Sarah Jenkins",
    role: "Head of Academic Research",
    institution: "Global Polytech",
    image: "/api/placeholder/64/64"
  },
  {
    quote: "Elegant, robust, and highly secure. Finally, an attendance system that respects the technical requirements of a top-tier laboratory.",
    author: "Julian Reed",
    role: "Senior Lab Coordinator",
    institution: "Bio-Gen Heights",
    image: "/api/placeholder/64/64"
  }
];

const TestimonialSection = () => {
  return (
    <section id="testimonials" className="py-24 relative z-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center space-x-1 text-[#F97316]">
             {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
          </div>
          <h2 className="text-4xl md:text-6xl font-black font-['Crimson_Pro'] text-[#0C4A6E] dark:text-white tracking-tighter leading-none">
            Validated by <br />
            <span className="italic text-primary">Academic Leaders.</span>
          </h2>
          <p className="text-lg text-[#0C4A6E]/60 dark:text-white/50 font-['Atkinson_Hyperlegible'] font-bold uppercase tracking-widest text-xs pt-4">
             Trusted by over 450+ Institutions Worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="glass-bento p-10 flex flex-col justify-between group cursor-default hover:bg-white/60 transition-all duration-700 hover:-translate-y-2"
            >
              <div className="relative mb-8">
                <Quote className="w-12 h-12 text-primary/10 absolute -top-4 -left-4 group-hover:text-primary/20 transition-colors" />
                <p className="text-xl md:text-2xl font-black font-['Crimson_Pro'] text-[#0C4A6E] dark:text-white leading-relaxed italic relative z-10">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center space-x-4 pt-6 border-t border-white/10">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-white/40 shadow-xl overflow-hidden">
                   <img src={t.image} alt={t.author} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="font-['Atkinson_Hyperlegible']">
                   <h4 className="text-sm font-black text-[#0C4A6E] dark:text-white tracking-tight">{t.author}</h4>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t.role} // {t.institution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logo cloud - simplified for aesthetic */}
        <div className="mt-24 pt-12 border-t border-white/10 flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
           {['St. Jude\'s', 'Nexus', 'Polytech', 'Bio-Gen', 'Summit'].map(l => (
             <span key={l} className="text-xl font-black font-['Crimson_Pro'] text-[#0C4A6E] dark:text-white">{l}</span>
           ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
