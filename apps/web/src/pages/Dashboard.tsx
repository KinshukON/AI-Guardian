import React, { useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent, ScoreRing, SafetyBadge } from '@aiguardian/ui'
import { useAuth } from '../contexts/AuthContext'
import { 
  BarChart3, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Users, 
  BookOpen,
  Shield,
  MessageSquare,
  FileText,
  Settings,
  Play,
  Pause,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react'

interface DashboardData {
  todayStats: {
    contentAnalyzed: number
    safetyAlerts: number
    learningTime: number
    screenTime: number
  }
  recentAnalyses: Array<{
    id: string
    type: 'video' | 'text' | 'chat'
    title: string
    safetyScore: number
    qualityScore: number
    timestamp: string
  }>
  trends: {
    safetyTrend: 'improving' | 'stable' | 'declining'
    topConcerns: string[]
    positiveHighlights: string[]
  }
  quickActions: Array<{
    id: string
    title: string
    description: string
    action: string
    priority: 'high' | 'medium' | 'low'
  }>
}

export const Dashboard: React.FC = () => {
  const { selectedChild } = useAuth()
  const [showPrivacyMode, setShowPrivacyMode] = useState(false)

  // Mock dashboard data
  const dashboardData: DashboardData = {
    todayStats: {
      contentAnalyzed: 12,
      safetyAlerts: 2,
      learningTime: 45,
      screenTime: 180
    },
    recentAnalyses: [
      {
        id: '1',
        type: 'video',
        title: 'Science Experiment Tutorial',
        safetyScore: 92,
        qualityScore: 88,
        timestamp: '2 hours ago'
      },
      {
        id: '2',
        type: 'chat',
        title: 'Homework Help Chat',
        safetyScore: 95,
        qualityScore: 85,
        timestamp: '4 hours ago'
      },
      {
        id: '3',
        type: 'text',
        title: 'News Article Analysis',
        safetyScore: 78,
        qualityScore: 72,
        timestamp: '6 hours ago'
      }
    ],
    trends: {
      safetyTrend: 'improving',
      topConcerns: ['Screen time management', 'Content variety'],
      positiveHighlights: ['Increased educational content', 'Better safety scores']
    },
    quickActions: [
      {
        id: '1',
        title: 'Set Screen Time Limit',
        description: 'Emma has exceeded recommended screen time today',
        action: 'Set 2-hour limit',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Review Recent Content',
        description: '2 new content items need your attention',
        action: 'Review Now',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Update Values Profile',
        description: 'Liam\'s values profile hasn\'t been updated this month',
        action: 'Update Profile',
        priority: 'low'
      }
    ]
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-danger-600 bg-danger-50 border-danger-200'
      case 'medium': return 'text-warning-600 bg-warning-50 border-warning-200'
      case 'low': return 'text-primary-600 bg-primary-50 border-primary-200'
      default: return 'text-primary-600 bg-primary-50 border-primary-200'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-5 w-5 text-success-500" />
      case 'stable': return <BarChart3 className="h-5 w-5 text-primary-500" />
      case 'declining': return <TrendingUp className="h-5 w-5 text-danger-500 transform rotate-180" />
      default: return <BarChart3 className="h-5 w-5 text-primary-500" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-900 mb-2">Guardian Dashboard</h1>
            <p className="text-primary-600">
              Daily overview for {selectedChild?.displayName} • {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPrivacyMode(!showPrivacyMode)}
              leftIcon={showPrivacyMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            >
              {showPrivacyMode ? 'Hide Details' : 'Privacy Mode'}
            </Button>
            <Button variant="primary" size="sm">
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-accent-100 p-3 rounded-2xl inline-block mb-3">
                <Shield className="h-6 w-6 text-accent-600" />
              </div>
              <div className="text-2xl font-bold text-primary-900">{dashboardData.todayStats.contentAnalyzed}</div>
              <div className="text-sm text-primary-600">Content Analyzed</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-warning-100 p-3 rounded-2xl inline-block mb-3">
                <AlertTriangle className="h-6 w-6 text-warning-600" />
              </div>
              <div className="text-2xl font-bold text-primary-900">{dashboardData.todayStats.safetyAlerts}</div>
              <div className="text-sm text-primary-600">Safety Alerts</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-success-100 p-3 rounded-2xl inline-block mb-3">
                <BookOpen className="h-6 w-6 text-success-600" />
              </div>
              <div className="text-2xl font-bold text-primary-900">{dashboardData.todayStats.learningTime}m</div>
              <div className="text-sm text-primary-600">Learning Time</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-primary-100 p-3 rounded-2xl inline-block mb-3">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-primary-900">{Math.round(dashboardData.todayStats.screenTime / 60)}h</div>
              <div className="text-sm text-primary-600">Screen Time</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.quickActions.map((action) => (
                  <div key={action.id} className="p-4 border rounded-2xl">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-primary-900">{action.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(action.priority)}`}>
                        {action.priority}
                      </span>
                    </div>
                    <p className="text-sm text-primary-600 mb-3">{action.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      {action.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Trends */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Analyses */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Content Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between p-4 border border-primary-200 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary-100 p-2 rounded-xl">
                        {analysis.type === 'video' ? <Play className="h-4 w-4 text-primary-600" /> :
                         analysis.type === 'chat' ? <MessageSquare className="h-4 w-4 text-primary-600" /> :
                         <FileText className="h-4 w-4 text-primary-600" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-900">{analysis.title}</h4>
                        <p className="text-sm text-primary-600">{analysis.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm text-primary-600">Safety</div>
                        <SafetyBadge score={analysis.safetyScore} />
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-primary-600">Quality</div>
                        <div className="text-lg font-semibold text-primary-900">{analysis.qualityScore}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trends & Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
                Weekly Trends & Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Safety Trend */}
                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-2xl">
                  <div>
                    <h4 className="font-medium text-primary-900">Safety Trend</h4>
                    <p className="text-sm text-primary-600">Overall safety score this week</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(dashboardData.trends.safetyTrend)}
                    <span className="text-sm font-medium text-primary-900 capitalize">
                      {dashboardData.trends.safetyTrend}
                    </span>
                  </div>
                </div>

                {/* Top Concerns */}
                <div>
                  <h4 className="font-medium text-primary-900 mb-3">Top Concerns</h4>
                  <div className="space-y-2">
                    {dashboardData.trends.topConcerns.map((concern, index) => (
                      <div key={index} className="flex items-center text-sm text-primary-600">
                        <AlertTriangle className="h-4 w-4 text-warning-500 mr-2" />
                        {concern}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Positive Highlights */}
                <div>
                  <h4 className="font-medium text-primary-900 mb-3">Positive Highlights</h4>
                  <div className="space-y-2">
                    {dashboardData.trends.positiveHighlights.map((highlight, index) => (
                      <div key={index} className="flex items-center text-sm text-primary-600">
                        <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 