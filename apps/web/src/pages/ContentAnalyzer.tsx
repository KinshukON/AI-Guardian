import React, { useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent, ScoreRing, SafetyBadge, ConfidenceBadge } from '@aiguardian/ui'
import { useAuth } from '../contexts/AuthContext'
import { Search, Link as LinkIcon, FileText, MessageSquare, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface AnalysisResult {
  safety: {
    score: number
    confidence: number
    flags: string[]
    evidence: string[]
  }
  quality: {
    score: number
    confidence: number
    factuality: number
    depth: number
    clarity: number
  }
  bias: {
    score: number
    confidence: number
    stereotypes: string[]
    framing: string
    missingPerspectives: string[]
  }
  ageFit: string
  recommendations: string[]
}

export const ContentAnalyzer: React.FC = () => {
  const { selectedChild } = useAuth()
  const [inputType, setInputType] = useState<'url' | 'text' | 'chat'>('url')
  const [input, setInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [showExplainLike12, setShowExplainLike12] = useState(false)

  const handleAnalyze = async () => {
    if (!input.trim()) return
    
    setIsAnalyzing(true)
    
    // Mock analysis - in real app, this would call the ML API
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        safety: {
          score: 85,
          confidence: 0.92,
          flags: ['mild violence', 'some complex themes'],
          evidence: ['Contains action sequences that may be intense for younger viewers', 'Themes of friendship and teamwork are positive']
        },
        quality: {
          score: 78,
          confidence: 0.88,
          factuality: 85,
          depth: 72,
          clarity: 80
        },
        bias: {
          score: 82,
          confidence: 0.85,
          stereotypes: ['Limited gender representation in leadership roles'],
          framing: 'Generally balanced, but could benefit from more diverse perspectives',
          missingPerspectives: ['Cultural diversity', 'Different socioeconomic backgrounds']
        },
        ageFit: '11-13',
        recommendations: [
          'Consider watching together to discuss themes',
          'Good opportunity to talk about representation in media',
          'Content is age-appropriate with parental guidance'
        ]
      }
      
      setResult(mockResult)
      setIsAnalyzing(false)
    }, 3000)
  }

  const getInputIcon = () => {
    switch (inputType) {
      case 'url': return <LinkIcon className="h-5 w-5" />
      case 'text': return <FileText className="h-5 w-5" />
      case 'chat': return <MessageSquare className="h-5 w-5" />
    }
  }

  const getInputPlaceholder = () => {
    switch (inputType) {
      case 'url': return 'Paste a YouTube, TikTok, or website URL...'
      case 'text': return 'Paste or type content to analyze...'
      case 'chat': return 'Paste a chatbot conversation or text exchange...'
    }
  }

  const getSafetyColor = (score: number) => {
    if (score >= 80) return 'text-success-600'
    if (score >= 60) return 'text-warning-600'
    return 'text-danger-600'
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Content Safety Analyzer</h1>
        <p className="text-primary-600">
          Analyze videos, text, and chatbot content for safety, learning quality, and bias detection.
        </p>
      </div>

      {/* Input Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>What would you like to analyze?</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Input Type Selector */}
          <div className="flex space-x-2 mb-6">
            {(['url', 'text', 'chat'] as const).map((type) => (
              <Button
                key={type}
                variant={inputType === type ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setInputType(type)}
                leftIcon={type === 'url' ? <LinkIcon className="h-4 w-4" /> : 
                         type === 'text' ? <FileText className="h-4 w-4" /> : 
                         <MessageSquare className="h-4 w-4" />}
              >
                {type === 'url' ? 'URL' : type === 'text' ? 'Text' : 'Chat'}
              </Button>
            ))}
          </div>

          {/* Input Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {getInputIcon()}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={getInputPlaceholder()}
              className="w-full pl-10 pr-4 py-4 border border-primary-300 rounded-2xl focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none"
              rows={inputType === 'url' ? 2 : 6}
            />
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-primary-600">
              Analyzing content for: <span className="font-medium">{selectedChild?.displayName}</span> (Age {selectedChild?.ageBand})
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={!input.trim() || isAnalyzing}
              loading={isAnalyzing}
              leftIcon={<Search className="h-4 w-4" />}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Score Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <ScoreRing
                    score={result.safety.score}
                    confidence={result.safety.confidence}
                    label="Safety Score"
                    size="lg"
                  />
                  <div className="mt-4">
                    <SafetyBadge score={result.safety.score} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <ScoreRing
                    score={result.quality.score}
                    confidence={result.quality.confidence}
                    label="Learning Quality"
                    size="lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <ScoreRing
                    score={result.bias.score}
                    confidence={result.bias.confidence}
                    label="Bias Detection"
                    size="lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Safety Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-warning-500 mr-2" />
                  Safety Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary-700">Age Appropriateness</span>
                      <span className="text-sm text-primary-600">{result.ageFit}</span>
                    </div>
                    <div className="w-full bg-primary-200 rounded-full h-2">
                      <div className="bg-success-500 h-2 rounded-full" style={{ width: `${result.safety.score}%` }}></div>
                    </div>
                  </div>
                  
                  {result.safety.flags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-primary-700 mb-2">Flags Detected:</h4>
                      <div className="space-y-1">
                        {result.safety.flags.map((flag, index) => (
                          <div key={index} className="flex items-center text-sm text-primary-600">
                            <XCircle className="h-4 w-4 text-warning-500 mr-2" />
                            {flag}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quality Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-2" />
                  Learning Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-primary-700">Factuality</span>
                    <div className="w-full bg-primary-200 rounded-full h-2 mt-1">
                      <div className="bg-success-500 h-2 rounded-full" style={{ width: `${result.quality.factuality}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-primary-700">Cognitive Depth</span>
                    <div className="w-full bg-primary-200 rounded-full h-2 mt-1">
                      <div className="bg-accent-500 h-2 rounded-full" style={{ width: `${result.quality.depth}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-primary-700">Clarity</span>
                    <div className="w-full bg-primary-200 rounded-full h-2 mt-1">
                      <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${result.quality.clarity}%` }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bias Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Bias & Framing Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-primary-700 mb-2">Framing Assessment:</h4>
                  <p className="text-primary-600">{result.bias.framing}</p>
                </div>
                
                {result.bias.stereotypes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-primary-700 mb-2">Stereotypes Detected:</h4>
                    <div className="space-y-1">
                      {result.bias.stereotypes.map((stereotype, index) => (
                        <div key={index} className="flex items-center text-sm text-primary-600">
                          <AlertTriangle className="h-4 w-4 text-warning-500 mr-2" />
                          {stereotype}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.bias.missingPerspectives.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-primary-700 mb-2">Missing Perspectives:</h4>
                    <div className="space-y-1">
                      {result.bias.missingPerspectives.map((perspective, index) => (
                        <div key={index} className="flex items-center text-sm text-primary-600">
                          <MessageSquare className="h-4 w-4 text-primary-500 mr-2" />
                          {perspective}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations & Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-primary-700">{rec}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-primary-200">
                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => setShowExplainLike12(!showExplainLike12)}>
                    {showExplainLike12 ? 'Show Regular Explanation' : 'Explain Like I\'m 12'}
                  </Button>
                  <Button variant="primary">
                    Generate Weekly Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 