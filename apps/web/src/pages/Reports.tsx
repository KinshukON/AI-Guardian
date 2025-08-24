import React, { useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@aiguardian/ui'
import { useAuth } from '../contexts/AuthContext'
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BookOpen,
  Shield,
  Eye
} from 'lucide-react'

interface ReportData {
  id: string
  period: string
  childName: string
  ageBand: string
  summary: {
    contentAnalyzed: number
    safetyScore: number
    qualityScore: number
    biasScore: number
    learningTime: number
    screenTime: number
  }
  highlights: string[]
  concerns: string[]
  recommendations: string[]
  generatedAt: string
  status: 'generated' | 'generating' | 'failed'
}

export const Reports: React.FC = () => {
  const { selectedChild } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('weekly')
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock report data
  const reports: ReportData[] = [
    {
      id: '1',
      period: 'Weekly',
      childName: 'Emma',
      ageBand: '8-10',
      summary: {
        contentAnalyzed: 45,
        safetyScore: 87,
        qualityScore: 82,
        biasScore: 85,
        learningTime: 320,
        screenTime: 1260
      },
      highlights: [
        'Increased engagement with educational content',
        'Better safety scores compared to last week',
        'More diverse content consumption'
      ],
      concerns: [
        'Screen time exceeded recommendations on weekends',
        'Some content may be too complex for age group'
      ],
      recommendations: [
        'Set weekend screen time limits',
        'Encourage more offline activities',
        'Monitor content complexity levels'
      ],
      generatedAt: '2024-01-15',
      status: 'generated'
    },
    {
      id: '2',
      period: 'Weekly',
      childName: 'Liam',
      ageBand: '11-13',
      summary: {
        contentAnalyzed: 38,
        safetyScore: 91,
        qualityScore: 88,
        biasScore: 79,
        learningTime: 280,
        screenTime: 1080
      },
      highlights: [
        'Excellent safety scores maintained',
        'Strong learning quality indicators',
        'Good balance of content types'
      ],
      concerns: [
        'Bias detection scores could improve',
        'Limited exposure to diverse perspectives'
      ],
      recommendations: [
        'Introduce more diverse content sources',
        'Discuss media bias and representation',
        'Continue monitoring safety patterns'
      ],
      generatedAt: '2024-01-08',
      status: 'generated'
    }
  ]

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    
    // Mock report generation
    setTimeout(() => {
      setIsGenerating(false)
      // In real app, this would trigger report generation and download
    }, 3000)
  }

  const handleDownloadReport = (reportId: string) => {
    // Mock download - in real app, this would download the PDF
    console.log(`Downloading report ${reportId}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'generated':
        return <Badge variant="success">Ready</Badge>
      case 'generating':
        return <Badge variant="warning">Generating...</Badge>
      case 'failed':
        return <Badge variant="danger">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600'
    if (score >= 60) return 'text-warning-600'
    return 'text-danger-600'
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-900 mb-2">Reports & Insights</h1>
            <p className="text-primary-600">
              Generate and view detailed reports about {selectedChild?.displayName}'s digital activity and learning progress.
            </p>
          </div>
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            loading={isGenerating}
            leftIcon={<FileText className="h-4 w-4" />}
          >
            {isGenerating ? 'Generating...' : 'Generate New Report'}
          </Button>
        </div>
      </div>

      {/* Report Generation Options */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">Report Type</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-3 border border-primary-300 rounded-2xl focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              >
                <option value="weekly">Weekly Summary</option>
                <option value="monthly">Monthly Summary</option>
                <option value="quarterly">Quarterly Summary</option>
                <option value="custom">Custom Period</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">Child</label>
              <div className="px-4 py-3 border border-primary-300 rounded-2xl bg-primary-50">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary-600" />
                  <span className="text-primary-900">{selectedChild?.displayName}</span>
                  <Badge variant="outline">{selectedChild?.ageBand}</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">Include</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-primary-700">Safety Analysis</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-primary-700">Learning Quality</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-primary-700">Bias Detection</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-primary-700">Screen Time</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Reports */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary-900">Recent Reports</h2>
        
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-accent-500" />
                    <span>{report.period} Report - {report.childName}</span>
                    <Badge variant="outline">{report.ageBand}</Badge>
                  </CardTitle>
                  <p className="text-sm text-primary-600 mt-1">
                    Generated on {new Date(report.generatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(report.status)}
                  {report.status === 'generated' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReport(report.id)}
                      leftIcon={<Download className="h-4 w-4" />}
                    >
                      Download PDF
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Summary Stats */}
              <div className="grid md:grid-cols-6 gap-4 mb-6">
                <div className="text-center p-4 bg-primary-50 rounded-2xl">
                  <div className="text-2xl font-bold text-primary-900">{report.summary.contentAnalyzed}</div>
                  <div className="text-sm text-primary-600">Content Items</div>
                </div>
                <div className="text-center p-4 bg-success-50 rounded-2xl">
                  <div className={`text-2xl font-bold ${getScoreColor(report.summary.safetyScore)}`}>
                    {report.summary.safetyScore}
                  </div>
                  <div className="text-sm text-primary-600">Safety Score</div>
                </div>
                <div className="text-center p-4 bg-accent-50 rounded-2xl">
                  <div className={`text-2xl font-bold ${getScoreColor(report.summary.qualityScore)}`}>
                    {report.summary.qualityScore}
                  </div>
                  <div className="text-sm text-primary-600">Quality Score</div>
                </div>
                <div className="text-center p-4 bg-warning-50 rounded-2xl">
                  <div className={`text-2xl font-bold ${getScoreColor(report.summary.biasScore)}`}>
                    {report.summary.biasScore}
                  </div>
                  <div className="text-sm text-primary-600">Bias Score</div>
                </div>
                <div className="text-center p-4 bg-primary-50 rounded-2xl">
                  <div className="text-2xl font-bold text-primary-900">{Math.round(report.summary.learningTime / 60)}h</div>
                  <div className="text-sm text-primary-600">Learning Time</div>
                </div>
                <div className="text-center p-4 bg-primary-50 rounded-2xl">
                  <div className="text-2xl font-bold text-primary-900">{Math.round(report.summary.screenTime / 60)}h</div>
                  <div className="text-sm text-primary-600">Screen Time</div>
                </div>
              </div>

              {/* Detailed Insights */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Highlights */}
                <div>
                  <h4 className="font-semibold text-primary-900 mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                    Positive Highlights
                  </h4>
                  <div className="space-y-2">
                    {report.highlights.map((highlight, index) => (
                      <div key={index} className="text-sm text-primary-700 bg-success-50 p-3 rounded-xl">
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Concerns */}
                <div>
                  <h4 className="font-semibold text-primary-900 mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 text-warning-500 mr-2" />
                    Areas of Concern
                  </h4>
                  <div className="space-y-2">
                    {report.concerns.map((concern, index) => (
                      <div key={index} className="text-sm text-primary-700 bg-warning-50 p-3 rounded-xl">
                        {concern}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold text-primary-900 mb-3 flex items-center">
                    <BarChart3 className="h-4 w-4 text-accent-500 mr-2" />
                    Recommendations
                  </h4>
                  <div className="space-y-2">
                    {report.recommendations.map((rec, index) => (
                      <div key={index} className="text-sm text-primary-700 bg-accent-50 p-3 rounded-xl">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-primary-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Share with Educator
                  </Button>
                </div>
                <Button variant="primary" size="sm">
                  Generate Follow-up
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 