'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { HeaderProps } from '@/lib/types/types'

export function Header({ className = '' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className={`border-b border-border bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/75 sticky top-0 left-0 right-0 z-30 ${className}`}>
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
                href="/learn"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Guides
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
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              type="button"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - Outside header for proper positioning */}
      {isMobileMenuOpen && (
        <>
          {/* Full-screen overlay backdrop */}
          <button
            className="md:hidden fixed inset-0 bg-black/50 z-40 cursor-default"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu overlay"
          />

          {/* Mobile menu panel with slide animation */}
          <nav
            id="mobile-nav"
            className={`md:hidden fixed top-0 right-0 h-full w-72 bg-background border-l border-border z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Close button in menu */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            <div className="px-6 pb-6">
              <Link
                href="/tricks"
                className="block min-h-[48px] px-4 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Alle Tricks
              </Link>
              <Link
                href="/learn"
                className="block mt-2 min-h-[48px] px-4 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Guides
              </Link>
              <Link
                href="/tricks/einreichen"
                className="block mt-2 min-h-[48px] px-4 py-3 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trick einreichen
              </Link>
              <Link
                href="https://www.produktiv.me/kiz/"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 min-h-[48px] px-4 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                KI Kurs
              </Link>
            </div>
          </nav>
        </>
      )}
    </>
  )
}
