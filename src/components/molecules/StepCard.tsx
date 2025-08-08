import { CheckCircle2 } from 'lucide-react'

interface StepCardProps {
  step: string
  number: number
}

export const StepCard = ({ step, number }: StepCardProps) => {
  return (
    <div className="group relative flex gap-4 p-5 rounded-xl transition-all duration-300 hover:transform hover:-translate-y-1 overflow-hidden">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 group-hover:border-primary-500/30 transition-all duration-300" />
      
      {/* Subtle Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{
             background: 'radial-gradient(circle at center, rgba(34, 153, 221, 0.1) 0%, transparent 70%)',
             filter: 'blur(20px)',
           }} />
      
      {/* Content */}
      <div className="relative z-10 flex gap-4 w-full items-start">
        {/* Step Number with Glow */}
        <div className="flex-shrink-0">
          <div className="relative">
            {/* Glow behind number */}
            <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg group-hover:bg-primary-500/30 transition-colors duration-300" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
              {number}
            </div>
          </div>
        </div>
        
        {/* Step Text */}
        <div className="flex-1 min-w-0">
          <p className="text-neutral-100 leading-relaxed break-words max-w-prose">{step}</p>
        </div>
        
        {/* Check Icon */}
        <div className="flex-shrink-0 ml-2">
          <CheckCircle2 className="h-5 w-5 text-neutral-500 group-hover:text-primary-400 transition-colors duration-300" />
        </div>
      </div>
    </div>
  )
}