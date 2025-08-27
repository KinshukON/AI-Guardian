import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@aiguardian/ui'
import { Eye, Users, Globe, TrendingUp, BookOpen, Shield, AlertTriangle, CheckCircle } from 'lucide-react'

interface EnhancedAnalysisResultsProps {
  result: any
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const EnhancedAnalysisResults: React.FC<EnhancedAnalysisResultsProps> = ({
  result,
  activeTab,
  setActiveTab
}) => {
  const getRiskLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'text-success-600 bg-success-100'
      case 'medium': return 'text-warning-600 bg-warning-100'
      case 'high': return 'text-danger-600 bg-danger-100'
      case 'critical': return 'text-danger-700 bg-danger-200'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatScore = (score: number) => Math.round(score * 100)

  return (
    <div className="space-y-6">
      {/* Enhanced Analysis Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: Eye },
          { id: 'perspectives', label: 'Balanced Perspectives', icon: Users },
          { id: 'cultural', label: 'Cultural Analysis', icon: Globe },
          { id: 'risk', label: 'Risk Assessment', icon: Shield }
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeTab === id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(id)}
            className="flex items-center space-x-2"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'perspectives' && result.enhanced_bias_analysis?.balanced_perspectives && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary-600" />
              <span>Balanced Perspectives Analysis</span>
              <Badge variant="secondary">Patent-Worthy Innovation</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Perspective */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-lg mb-2">Current Perspective</h4>
              <p className="text-gray-700 mb-3">
                {result.enhanced_bias_analysis.balanced_perspectives.primary_perspective.summary}
              </p>
              <div className="space-y-1">
                <h5 className="font-medium text-sm text-gray-600">Supporting Evidence:</h5>
                {result.enhanced_bias_analysis.balanced_perspectives.primary_perspective.evidence.map((evidence: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{evidence}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alternative Perspective */}
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-lg mb-2">Alternative Perspective</h4>
              <p className="text-gray-700 mb-3">
                {result.enhanced_bias_analysis.balanced_perspectives.alternative_perspective.summary}
              </p>
              <div className="space-y-1">
                <h5 className="font-medium text-sm text-gray-600">Alternative Evidence:</h5>
                {result.enhanced_bias_analysis.balanced_perspectives.alternative_perspective.evidence.map((evidence: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{evidence}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <h5 className="font-medium text-sm text-gray-600">Missing Voices:</h5>
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.enhanced_bias_analysis.balanced_perspectives.alternative_perspective.missing_voices.map((voice: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {voice}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Synthesis */}
            <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded-r-lg">
              <h4 className="font-semibold text-lg mb-2 flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <span>Balanced Synthesis</span>
              </h4>
              <p className="text-gray-700 mb-4">
                {result.enhanced_bias_analysis.balanced_perspectives.synthesis.balanced_summary}
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-sm text-gray-600 mb-2">Teaching Moments:</h5>
                  <ul className="space-y-1">
                    {result.enhanced_bias_analysis.balanced_perspectives.synthesis.teaching_moments.map((moment: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{moment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm text-gray-600 mb-2">Discussion Points:</h5>
                  <ul className="space-y-1">
                    {result.enhanced_bias_analysis.balanced_perspectives.synthesis.discussion_points.map((point: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'cultural' && result.enhanced_bias_analysis?.cultural_analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary-600" />
              <span>Cultural Bias Analysis</span>
              <Badge variant="secondary">Enhanced Detection</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Cultural Context: {result.enhanced_bias_analysis.cultural_analysis.cultural_context}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Representation Score</span>
                      <span className="text-sm font-bold">{formatScore(result.enhanced_bias_analysis.cultural_analysis.representation_score)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${formatScore(result.enhanced_bias_analysis.cultural_analysis.representation_score)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm text-gray-600 mb-2">Cultural Markers:</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.enhanced_bias_analysis.cultural_analysis.cultural_markers.map((marker: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {marker}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Missing Perspectives</h4>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-sm text-gray-600 mb-2">Cultural Perspectives:</h5>
                    <ul className="space-y-1">
                      {result.enhanced_bias_analysis.cultural_analysis.missing_perspectives.map((perspective: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>{perspective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm text-gray-600 mb-2">Underrepresented Groups:</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.enhanced_bias_analysis.cultural_analysis.underrepresented_groups.map((group: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs border-yellow-300 text-yellow-700">
                          {group}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'risk' && result.risk_assessment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary-600" />
              <span>Predictive Risk Assessment</span>
              <Badge variant="secondary">Real-time Analysis</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke={result.risk_assessment.risk_level === 'low' ? '#10b981' : 
                              result.risk_assessment.risk_level === 'medium' ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${result.risk_assessment.composite_risk_score * 251.2} 251.2`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">{formatScore(result.risk_assessment.composite_risk_score)}%</span>
                  </div>
                </div>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(result.risk_assessment.risk_level)}`}>
                  {result.risk_assessment.risk_level.toUpperCase()} RISK
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="font-semibold mb-3">Risk Factor Breakdown</h4>
                <div className="space-y-3">
                  {Object.entries(result.risk_assessment.risk_factors).map(([factor, score]: [string, any]) => (
                    <div key={factor}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium capitalize">{factor.replace('_', ' ')}</span>
                        <span className="text-sm font-bold">{formatScore(score)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            score < 0.3 ? 'bg-green-500' : 
                            score < 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${formatScore(score)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {result.risk_assessment.recommendations && result.risk_assessment.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Recommendations</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    {result.risk_assessment.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="text-sm text-blue-800 flex items-start space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}