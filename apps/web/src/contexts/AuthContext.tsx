import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserRole = 'parent' | 'educator' | 'teen' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  displayName: string
  mfaEnabled: boolean
  createdAt: string
}

export interface Child {
  id: string
  displayName: string
  ageBand: '8-10' | '11-13' | '14-16'
  values: {
    empathy: number
    curiosity: number
    balancedViews: number
    growthMindset: number
  }
}

interface AuthContextType {
  user: User | null
  userChildren: Child[]
  selectedChild: Child | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  selectChild: (child: Child) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userChildren, setUserChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)

  // Mock data for demo
  useEffect(() => {
    const mockUser: User = {
      id: '1',
      email: 'parent@example.com',
      role: 'parent',
      displayName: 'Sarah Johnson',
      mfaEnabled: true,
      createdAt: '2024-01-01T00:00:00Z',
    }

    const mockChildren: Child[] = [
      {
        id: '1',
        displayName: 'Emma',
        ageBand: '8-10',
        values: {
          empathy: 85,
          curiosity: 90,
          balancedViews: 75,
          growthMindset: 80,
        },
      },
      {
        id: '2',
        displayName: 'Liam',
        ageBand: '11-13',
        values: {
          empathy: 70,
          curiosity: 95,
          balancedViews: 60,
          growthMindset: 85,
        },
      },
    ]

    setUser(mockUser)
    setUserChildren(mockChildren)
    setSelectedChild(mockChildren[0])
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call the API
    if (email === 'demo@aiguardian.com' && password === 'demo123') {
      // Login successful
    } else {
      throw new Error('Invalid credentials')
    }
  }

  const logout = () => {
    setUser(null)
    setUserChildren([])
    setSelectedChild(null)
  }

  const selectChild = (child: Child) => {
    setSelectedChild(child)
  }

  const value: AuthContextType = {
    user,
    userChildren,
    selectedChild,
    login,
    logout,
    selectChild,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 