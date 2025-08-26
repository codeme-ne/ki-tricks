import { Lightbulb } from 'lucide-react'

interface ExampleCardProps {
  example: string
}

export const ExampleCard = ({ example }: ExampleCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:transform hover:-translate-y-1">
      {/* Base Background for better visibility */}
  <div className="absolute inset-0 bg-foreground/5 backdrop-blur-sm" />
      
      {/* Glassmorphism Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-600/15 backdrop-blur-sm" />
      
      {/* Animated Border Gradient */}
      <div className="absolute inset-0 rounded-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 opacity-30 blur-sm" 
             style={{
               backgroundSize: '200% 100%',
               animation: 'shimmer-button 3s linear infinite',
             }} />
      </div>
      
      {/* Border */}
      <div className="absolute inset-0 rounded-xl border border-primary-500/30 group-hover:border-primary-500/50 transition-colors duration-300" />
      
      {/* Content */}
      <div className="relative z-10 p-5">
        <div className="flex gap-3">
          {/* Animated Icon with Glow */}
          <div className="relative flex-shrink-0 mt-0.5">
            {/* Pulsing Glow */}
            <div className="absolute inset-0 bg-primary-400/40 rounded-full blur-xl animate-pulse" />
            <Lightbulb className="relative h-6 w-6 text-primary-400 group-hover:text-primary-300 transition-colors duration-300" />
          </div>
          
          {/* Example Text */}
          <p className="text-neutral-100 leading-relaxed italic max-w-prose">{example}</p>
        </div>
      </div>
      
      {/* Subtle Shimmer Overlay on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
           style={{
             background: 'linear-gradient(105deg, transparent 40%, rgba(34, 153, 221, 0.1) 50%, transparent 60%)',
             animation: 'shimmer-button 2s',
           }} />
    </div>
  )
}