'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  pulseSpeed: number
  hue: number
}

interface MousePosition {
  x: number
  y: number
}

interface InteractiveStarfieldProps {
  starCount?: number
  mouseRadius?: number
  clickBurstCount?: number
  baseSpeed?: number
  className?: string
}

export const InteractiveStarfield: React.FC<InteractiveStarfieldProps> = ({
  starCount = 150,
  mouseRadius = 100,
  clickBurstCount = 20,
  baseSpeed = 0.05,
  className = '',
}) => {
  // Mobile detection for performance optimization
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Reduce stars on mobile for better performance
  const effectiveStarCount = isMobile ? Math.min(50, starCount) : starCount
  const effectiveMouseRadius = isMobile ? 50 : mouseRadius
  const effectiveClickBurstCount = isMobile ? 10 : clickBurstCount
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>(0)
  const starsRef = useRef<Star[]>([])
  const mousePositionRef = useRef<MousePosition>({ x: -1000, y: -1000 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [clickBursts, setClickBursts] = useState<Array<{ x: number; y: number; id: number }>>([])

  // Initialize stars
  const initializeStars = useCallback(() => {
    const stars: Star[] = []
    for (let i = 0; i < effectiveStarCount; i++) {
      stars.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * baseSpeed + baseSpeed / 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        hue: Math.random() * 60 + 200, // Blue to cyan range
      })
    }
    starsRef.current = stars
  }, [effectiveStarCount, dimensions, baseSpeed])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Initialize stars when dimensions change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initializeStars()
    }
  }, [dimensions, initializeStars])

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Handle click bursts
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const burstId = Date.now()
      
      setClickBursts(prev => [...prev, { x, y, id: burstId }])
      
      // Remove burst after animation
      setTimeout(() => {
        setClickBursts(prev => prev.filter(burst => burst.id !== burstId))
      }, 1000)

      // Add temporary stars at click position
      const newStars: Star[] = []
      for (let i = 0; i < effectiveClickBurstCount; i++) {
        const angle = (Math.PI * 2 * i) / effectiveClickBurstCount
        const velocity = Math.random() * 3 + 2
        newStars.push({
          id: Date.now() + i,
          x: x,
          y: y,
          size: Math.random() * 3 + 1,
          opacity: 1,
          speed: velocity,
          pulseSpeed: 0.05,
          hue: Math.random() * 360,
        })
      }
      
      // Add burst stars temporarily
      starsRef.current = [...starsRef.current, ...newStars]
      
      // Remove burst stars after animation
      setTimeout(() => {
        starsRef.current = starsRef.current.slice(0, effectiveStarCount)
      }, 2000)
    }
  }, [effectiveStarCount, effectiveClickBurstCount])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    let time = 0
    let isRunning = true

    const animate = () => {
      if (!isRunning) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      starsRef.current.forEach((star, index) => {
        // Calculate distance from mouse
        const dx = star.x - mousePositionRef.current.x
        const dy = star.y - mousePositionRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Mouse repulsion effect (reduced on mobile)
        if (!isMobile && distance < effectiveMouseRadius) {
          const force = (1 - distance / effectiveMouseRadius) * 2
          star.x += (dx / distance) * force
          star.y += (dy / distance) * force
        }

        // Natural movement
        star.y -= star.speed
        star.x += Math.sin(time * star.pulseSpeed + index) * 0.5

        // Wrap around screen
        if (star.y < -10) {
          star.y = canvas.height + 10
          star.x = Math.random() * canvas.width
        }
        if (star.x < -10) star.x = canvas.width + 10
        if (star.x > canvas.width + 10) star.x = -10

        // Pulsing effect
        const pulse = Math.sin(time * star.pulseSpeed + index) * 0.2 + 0.8

        // Draw star with glow
        ctx.save()
        
        // Glow effect
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3)
        gradient.addColorStop(0, `hsla(${star.hue}, 70%, 70%, ${star.opacity * pulse})`)
        gradient.addColorStop(0.5, `hsla(${star.hue}, 70%, 50%, ${star.opacity * pulse * 0.5})`)
        gradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Star core
        ctx.fillStyle = `hsla(${star.hue}, 70%, 90%, ${star.opacity * pulse})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
      })

      // Draw connections between nearby stars (skip on mobile for performance)
      if (!isMobile) {
        ctx.strokeStyle = 'rgba(100, 180, 255, 0.1)'
        ctx.lineWidth = 1
        
        for (let i = 0; i < starsRef.current.length; i++) {
          for (let j = i + 1; j < starsRef.current.length; j++) {
            const star1 = starsRef.current[i]
            const star2 = starsRef.current[j]
            const dx = star1.x - star2.x
            const dy = star1.y - star2.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < 100) {
              ctx.beginPath()
              ctx.moveTo(star1.x, star1.y)
              ctx.lineTo(star2.x, star2.y)
              ctx.stroke()
            }
          }
        }
      }

      time += 0.01
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      isRunning = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = 0
      }
    }
  }, [dimensions, effectiveMouseRadius, isMobile])

  return (
    <>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className={`fixed inset-0 -z-10 cursor-crosshair ${className}`}
        style={{ 
          background: 'transparent',
          maxWidth: '100vw',
          maxHeight: '100vh'
        }}
      />
      
      {/* Click burst effects */}
      {clickBursts.map(burst => (
        <motion.div
          key={burst.id}
          className="fixed pointer-events-none"
          style={{ left: burst.x, top: burst.y }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="absolute -translate-x-1/2 -translate-y-1/2">
            <div className="w-20 h-20 rounded-full border-2 border-primary-400" />
          </div>
        </motion.div>
      ))}
    </>
  )
}

export default InteractiveStarfield