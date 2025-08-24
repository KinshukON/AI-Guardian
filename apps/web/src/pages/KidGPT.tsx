import React, { useState, useRef, useEffect } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@aiguardian/ui'
import { useAuth } from '../contexts/AuthContext'
import { 
  MessageSquare, 
  Send, 
  BookOpen, 
  Lightbulb, 
  Heart, 
  Shield,
  Quote,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  citations?: Array<{
    source: string
    url: string
    excerpt: string
  }>
  safetyFlags?: string[]
  mode?: 'regular' | 'simple'
}

interface KidGPTMode {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
}

export const KidGPT: React.FC = () => {
  const { selectedChild } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMode, setSelectedMode] = useState('homework')
  const [explainLike12, setExplainLike12] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const modes: KidGPTMode[] = [
    {
      id: 'homework',
      name: 'Homework Tutor',
      description: 'Get help with school assignments and projects',
      icon: <BookOpen className="h-5 w-5" />,
      color: 'bg-accent-100 text-accent-600'
    },
    {
      id: 'curiosity',
      name: 'Curiosity',
      description: 'Explore interesting topics and ask questions',
      icon: <Lightbulb className="h-5 w-5" />,
      color: 'bg-success-100 text-success-600'
    },
    {
      id: 'resilience',
      name: 'Resilience & Mood',
      description: 'Get support for emotional challenges',
      icon: <Heart className="h-5 w-5" />,
      color: 'bg-warning-100 text-warning-600'
    },
    {
      id: 'digital',
      name: 'Digital Citizenship',
      description: 'Learn about online safety and responsibility',
      icon: <Shield className="h-5 w-5" />,
      color: 'bg-primary-100 text-primary-600'
    }
  ]

  // Mock welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${selectedChild?.displayName}! I'm your AI Guardian mentor. I'm here to help you learn, explore, and stay safe online. What would you like to know about today?`,
      timestamp: new Date(),
      mode: 'regular'
    }
    setMessages([welcomeMessage])
  }, [selectedChild])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Mock AI response - in real app, this would call the ML API
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(input, selectedMode, explainLike12),
        timestamp: new Date(),
        citations: generateMockCitations(),
        safetyFlags: [],
        mode: explainLike12 ? 'simple' : 'regular'
      }
      
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 2000)
  }

  const generateMockResponse = (question: string, mode: string, simple: boolean): string => {
    const responses = {
      homework: {
        regular: "Based on my analysis of your question about math, here's a comprehensive explanation that builds on fundamental concepts. The key is understanding the relationship between variables and how they interact in equations.",
        simple: "Think of math like building with blocks! You start with simple pieces and put them together to make something bigger. Let me show you step by step how to solve this problem."
      },
      curiosity: {
        regular: "That's a fascinating question! Let me break down the science behind this phenomenon and explain how it relates to our understanding of the natural world.",
        simple: "Great question! It's like asking why the sky is blue - there's a cool reason behind it. Let me explain it in a way that makes sense."
      },
      resilience: {
        regular: "It's completely normal to feel this way sometimes. Let me share some evidence-based strategies for managing difficult emotions and building resilience.",
        simple: "Everyone feels sad or frustrated sometimes - it's part of being human! Here are some simple things you can try to feel better."
      },
      digital: {
        regular: "Online safety is crucial in today's digital world. Let me explain the key principles and best practices for staying safe and responsible online.",
        simple: "The internet is like a big city - it's exciting but you need to know how to stay safe. Here are some simple rules to remember."
      }
    }

    return responses[mode as keyof typeof responses]?.[simple ? 'simple' : 'regular'] || 
           "I'd be happy to help you with that question! Let me provide a thoughtful and safe response."
  }

  const generateMockCitations = () => [
    {
      source: "Khan Academy - Mathematics",
      url: "https://www.khanacademy.org",
      excerpt: "Fundamental concepts in algebra and problem-solving strategies."
    },
    {
      source: "National Geographic Kids",
      url: "https://kids.nationalgeographic.com",
      excerpt: "Scientific explanations adapted for young learners."
    },
    {
      source: "Common Sense Media",
      url: "https://www.commonsensemedia.org",
      excerpt: "Digital citizenship and online safety guidelines for children."
    }
  ]

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">KidGPT - Your AI Mentor</h1>
        <p className="text-primary-600">
          Ask questions, get homework help, and explore topics safely with your AI Guardian.
        </p>
      </div>

      {/* Mode Selection */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setSelectedMode(mode.id)}
            className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
              selectedMode === mode.id
                ? 'border-accent-500 bg-accent-50'
                : 'border-primary-200 bg-white hover:border-primary-300'
            }`}
          >
            <div className={`p-2 rounded-xl inline-block mb-3 ${mode.color}`}>
              {mode.icon}
            </div>
            <h3 className="font-semibold text-primary-900 mb-1">{mode.name}</h3>
            <p className="text-sm text-primary-600">{mode.description}</p>
          </button>
        ))}
      </div>

      {/* Explain Like I'm 12 Toggle */}
      <div className="flex items-center justify-center mb-6">
        <div className="bg-white p-2 rounded-2xl border border-primary-200 shadow-soft">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-primary-700">Regular</span>
            <button
              onClick={() => setExplainLike12(!explainLike12)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                explainLike12 ? 'bg-accent-500' : 'bg-primary-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  explainLike12 ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm font-medium text-primary-700">Explain Like I'm 12</span>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-accent-500 text-white'
                        : 'bg-primary-100 text-primary-900'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === 'assistant' && (
                        <div className="bg-accent-500 p-1 rounded-full mt-1">
                          <Shield className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        
                        {/* Citations */}
                        {message.citations && message.citations.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-primary-200">
                            <div className="text-xs font-medium text-primary-700 mb-2">Sources:</div>
                            <div className="space-y-2">
                              {message.citations.map((citation, index) => (
                                <div key={index} className="text-xs">
                                  <div className="flex items-center space-x-2">
                                    <Quote className="h-3 w-3 text-primary-500" />
                                    <span className="font-medium">{citation.source}</span>
                                    <a
                                      href={citation.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-accent-600 hover:text-accent-700"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </div>
                                  <p className="text-primary-600 mt-1">{citation.excerpt}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Safety Flags */}
                        {message.safetyFlags && message.safetyFlags.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-warning-200">
                            <div className="flex items-center space-x-2 text-warning-700">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-xs font-medium">Safety Note</span>
                            </div>
                            <p className="text-xs text-warning-600 mt-1">
                              Remember to talk to a trusted adult if you have concerns.
                            </p>
                          </div>
                        )}

                        {/* Mode Indicator */}
                        {message.mode === 'simple' && (
                          <div className="mt-3 pt-3 border-t border-success-200">
                            <div className="flex items-center space-x-2 text-success-700">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-xs font-medium">Simplified Explanation</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-primary-100 p-4 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="bg-accent-500 p-1 rounded-full">
                        <Shield className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask me anything about ${modes.find(m => m.id === selectedMode)?.name.toLowerCase()}...`}
              className="flex-1 px-4 py-3 border border-primary-300 rounded-2xl focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none"
              rows={2}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="px-6"
              leftIcon={<Send className="h-4 w-4" />}
            >
              Send
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-primary-500 text-center">
            <Shield className="h-3 w-3 inline mr-1" />
            Your AI Guardian is designed to be safe, educational, and values-aligned
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 