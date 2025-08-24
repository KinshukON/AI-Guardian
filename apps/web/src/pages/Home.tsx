import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@aiguardian/ui'
import { 
  Shield, 
  Search, 
  MessageSquare, 
  BarChart3, 
  FileText,
  CheckCircle,
  Users,
  Lock
} from 'lucide-react'

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white p-4 rounded-3xl shadow-large">
                <Shield className="h-16 w-16 text-accent-500" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-primary-900 mb-6 text-balance">
              AI Guardian
            </h1>
            <p className="text-xl md:text-2xl text-primary-700 mb-8 max-w-3xl mx-auto text-balance">
              Your digital mentor and watchdog for kids. Keep them safe, curious, and thriving with AI—without surveillance and with full parental transparency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/analyze">
                <Button size="xl" className="text-lg px-8 py-4">
                  Start Analyzing Content
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="xl" className="text-lg px-8 py-4">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              How AI Guardian Protects Your Family
            </h2>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              Our comprehensive platform analyzes content safety, learning quality, and bias detection to ensure your kids have a positive digital experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-accent-100 p-4 rounded-2xl inline-block mb-4">
                <Search className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary-900 mb-2">Content Safety</h3>
              <p className="text-primary-600">Analyze videos, apps, and chatbots for age-appropriate content and safety concerns.</p>
            </div>

            <div className="text-center">
              <div className="bg-success-100 p-4 rounded-2xl inline-block mb-4">
                <BarChart3 className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary-900 mb-2">Learning Quality</h3>
              <p className="text-primary-600">Evaluate educational value, factuality, and cognitive depth of digital content.</p>
            </div>

            <div className="text-center">
              <div className="bg-warning-100 p-4 rounded-2xl inline-block mb-4">
                <MessageSquare className="h-8 w-8 text-warning-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary-900 mb-2">Bias Detection</h3>
              <p className="text-primary-600">Identify stereotypes, framing issues, and promote balanced perspectives.</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-2xl inline-block mb-4">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary-900 mb-2">Smart Reports</h3>
              <p className="text-primary-600">Weekly insights and actionable guidance for parents and educators.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              Every decision we make is guided by these fundamental principles.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-soft">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-success-500 mr-3" />
                <h3 className="text-xl font-semibold text-primary-900">Safety First</h3>
              </div>
              <p className="text-primary-600">We prioritize your child's safety and wellbeing above all else, using advanced AI to detect potential risks.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-soft">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-accent-500 mr-3" />
                <h3 className="text-xl font-semibold text-primary-900">Transparency</h3>
              </div>
              <p className="text-primary-600">No hidden monitoring. Parents have full visibility and control over what's being analyzed and why.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-soft">
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-primary-500 mr-3" />
                <h3 className="text-xl font-semibold text-primary-900">Privacy by Design</h3>
              </div>
              <p className="text-primary-600">Built with privacy-first principles, minimizing data collection and ensuring secure handling of sensitive information.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Protect Your Digital Family?
          </h2>
          <p className="text-xl text-accent-100 mb-8">
            Join thousands of parents and educators who trust AI Guardian to keep kids safe online.
          </p>
          <Link to="/analyze">
            <Button variant="secondary" size="xl" className="text-lg px-8 py-4">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
} 