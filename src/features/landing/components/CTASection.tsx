import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-lg bg-primary/20 blur-[100px] rounded-full mix-blend-multiply" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="glass-card rounded-[2rem] p-12 text-center bg-gradient-to-br from-white/60 to-white/20 border border-white/50 shadow-2xl relative overflow-hidden group">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" />
          
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-6 text-glow" />
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Ready to reclaim your teaching time?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join hundreds of educators using ClassTrack to streamline attendance,
            engage students, and generate powerful insights instantly.
          </p>
          
          <div className="flex justify-center">
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all flex items-center space-x-2"
            >
              <span>Get started for free</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-foreground/50">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
