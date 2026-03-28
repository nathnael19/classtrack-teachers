import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  noHover?: boolean
}

export function GlassCard({ children, className = "", noHover = false, style, ...props }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl transition-all duration-500 rounded-[2.5rem]",
        !noHover && "hover:shadow-primary/10 hover:border-white/40 dark:hover:border-white/20 hover:-translate-y-1.5 hover:scale-[1.01]",
        className
      )}
      style={style}
      {...props}
    >
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-black/20 pointer-events-none" />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}
