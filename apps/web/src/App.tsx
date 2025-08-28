import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import Landing from './pages/Landing'
import SetupWizard from './pages/SetupWizard'
import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { ContentAnalyzer } from './pages/ContentAnalyzer'
import { KidGPT } from './pages/KidGPT'
import { Reports } from './pages/Reports'
import { Settings } from './pages/Settings'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { isAuthenticated, setupCompleted } = useAuth()

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Landing />} />
      </Routes>
    )
  }

  // Show setup wizard if authenticated but setup not completed
  if (!setupCompleted) {
    return (
      <Routes>
        <Route path="*" element={<SetupWizard />} />
      </Routes>
    )
  }

  // Show main app if authenticated and setup completed
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analyze" element={<ContentAnalyzer />} />
        <Route path="/kidgpt" element={<KidGPT />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App 