interface StepCardProps {
  step: string
  number: number
}

export const StepCard = ({ step, number }: StepCardProps) => {
  return (
    <div className="group relative flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl transition-all duration-300 hover:transform hover:-translate-y-1 overflow-hidden">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 group-hover:border-primary-500/30 transition-all duration-300" />
      
      {/* Subtle Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{
             background: 'radial-gradient(circle at center, rgba(34, 153, 221, 0.1) 0%, transparent 70%)',
             filter: 'blur(20px)',
           }} />
      
      {/* Content */}
      <div className="relative z-10 flex gap-3 sm:gap-4 w-full items-start">
        {/* Step Number with Glow - Mobile optimized */}
        <div className="flex-shrink-0 mt-0.5">
          <div className="relative">
            {/* Glow behind number */}
            <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-md group-hover:bg-primary-500/30 transition-colors duration-300" />
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-400 to-primary-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg">
              {number}
            </div>
          </div>
        </div>
        
        {/* Step Text - Mobile optimized */}
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-neutral-100 leading-relaxed text-sm sm:text-base hyphens-auto" lang="de">
            {step}
          </p>
        </div>
      </div>
    </div>
  )
}