import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { ContentAnalyzer } from './pages/ContentAnalyzer'
import { KidGPT } from './pages/KidGPT'
import { Reports } from './pages/Reports'
import { Settings } from './pages/Settings'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  )
}

export default App 