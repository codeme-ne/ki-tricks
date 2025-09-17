'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/atoms'
import { Home, LogOut, User as UserIcon, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface DashboardHeaderProps {
  user: User
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="bg-white border-b">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold text-blue-600">
              KI Tricks
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Home className="w-4 h-4" />
                <span>Startseite</span>
              </Link>
              <Link
                href="/tricks"
                className="text-gray-600 hover:text-gray-900"
              >
                Alle Tricks
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-900 font-medium"
              >
                Dashboard
              </Link>
            </nav>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <UserIcon className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard?tab=settings')}
              className="hidden sm:inline-flex"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="inline-flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Abmelden</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader