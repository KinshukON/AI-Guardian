import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@aiguardian/ui'
import { 
  Shield, 
  Home, 
  BarChart3, 
  Search, 
  MessageSquare, 
  FileText, 
  Settings,
  User,
  LogOut
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Analyze', href: '/analyze', icon: Search },
  { name: 'KidGPT', href: '/kidgpt', icon: MessageSquare },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, selectedChild, userChildren, selectChild, logout } = useAuth()
  const location = useLocation()

  if (!user) {
    return <div>{children}</div>
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-primary-200 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-accent-500" />
              <span className="text-xl font-bold text-primary-900">AI Guardian</span>
            </div>

            {/* Child Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-primary-600">Active Child:</span>
                <select
                  value={selectedChild?.id || ''}
                  onChange={(e) => {
                    const child = userChildren.find(c => c.id === e.target.value)
                    if (child) selectChild(child)
                  }}
                  className="px-3 py-1 border border-primary-300 rounded-lg text-sm focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  {userChildren.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.displayName} ({child.ageBand})
                    </option>
                  ))}
                </select>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary-600" />
                  <span className="text-sm font-medium text-primary-900">{user.displayName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  leftIcon={<LogOut className="h-4 w-4" />}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-primary-200 min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-accent-50 text-accent-700 border border-accent-200'
                        : 'text-primary-600 hover:bg-primary-50 hover:text-primary-900'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 