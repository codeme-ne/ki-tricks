'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { HeaderProps } from '@/lib/types/types'

export function Header({ className = '' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className={`border-b border-border bg-background sticky top-0 z-50 ${className}`}>
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-foreground text-background px-3 py-1.5 rounded-lg font-bold text-lg">
              KI
            </div>
            <span className="text-xl font-semibold text-foreground">
              Tricks
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/tricks" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Alle Tricks
            </Link>
            <Link 
              href="/tricks/einreichen" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Trick einreichen
            </Link>
            <Link 
              href="https://www.produktiv.me/kiz/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              KI Kurs
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <Link 
                href="/tricks" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Alle Tricks
              </Link>
              <Link 
                href="/tricks/einreichen" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trick einreichen
              </Link>
              <Link 
                href="https://www.produktiv.me/kiz/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                KI Kurs
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}