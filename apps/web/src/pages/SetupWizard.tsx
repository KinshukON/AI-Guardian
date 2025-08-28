import React, { useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@aiguardian/ui'
import { useAuth } from '../contexts/AuthContext'
import { 
  Shield, 
  Wifi, 
  Smartphone, 
  Monitor, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Download,
  QrCode,
  Router,
  Settings,
  Home,
  Globe,
  Lock,
  Trash2,
  Play,
  Copy,
  Check
} from 'lucide-react'

export default function SetupWizard() {
  const { completeSetup } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [deploymentMethod, setDeploymentMethod] = useState<'network' | 'devices' | 'hybrid' | null>(null)
  const [children, setChildren] = useState<Array<{name: string, age: string}>>([])
  const [networkSetup, setNetworkSetup] = useState({
    routerModel: '',
    networkName: '',
    adminAccess: false
  })

  const totalSteps = 6

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete setup and go to dashboard
      completeSetup()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addChild = () => {
    setChildren([...children, { name: '', age: '8-10' }])
  }

  const updateChild = (index: number, field: string, value: string) => {
    const updated = [...children]
    updated[index] = { ...updated[index], [field]: value }
    setChildren(updated)
  }

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Setup AI Guardian</h1>
            <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="min-h-[500px]">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="p-8 text-center">
              <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to AI Guardian
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Let's set up your family's AI-powered digital protection in just a few minutes. 
                We'll guide you through choosing the best protection method and configuring everything for your needs.
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <Wifi className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Network Protection</h3>
                  <p className="text-sm text-gray-600">Router-level monitoring for all devices</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <Smartphone className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Device Apps</h3>
                  <p className="text-sm text-gray-600">Individual app monitoring</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <Monitor className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Complete Coverage</h3>
                  <p className="text-sm text-gray-600">Network + device protection</p>
                </div>
              </div>
              <Button onClick={nextStep} size="lg" className="px-8">
                Let's Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Step 2: Choose Deployment Method */}
          {currentStep === 2 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Choose Your Protection Method
              </h2>
              <p className="text-gray-600 mb-8 text-center">
                Select the approach that best fits your family's needs and technical comfort level.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <Card 
                  className={`cursor-pointer transition-all ${
                    deploymentMethod === 'network' 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setDeploymentMethod('network')}
                >
                  <CardHeader className="text-center">
                    <Wifi className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                    <CardTitle>Network Protection</CardTitle>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        DNS-level filtering & AI content analysis
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Router firmware integration
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Real-time traffic monitoring
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Works with all connected devices
                      </li>
                    </ul>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <strong>Supported:</strong> Netgear, ASUS, TP-Link, Linksys routers with OpenWrt support
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${
                    deploymentMethod === 'devices' 
                      ? 'ring-2 ring-purple-500 bg-purple-50' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setDeploymentMethod('devices')}
                >
                  <CardHeader className="text-center">
                    <Smartphone className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                    <CardTitle>Device Apps</CardTitle>
                    <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      Mobile Focus
                    </span>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        App-level behavioral analysis
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Screen time & usage patterns
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Location-based policies
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Works offline & on mobile data
                      </li>
                    </ul>
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-purple-700">
                        <strong>Platforms:</strong> iOS (via MDM), Android (Device Admin/Work Profile), Windows (via Group Policy)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${
                    deploymentMethod === 'hybrid' 
                      ? 'ring-2 ring-green-500 bg-green-50' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setDeploymentMethod('hybrid')}
                >
                  <CardHeader className="text-center">
                    <Monitor className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <CardTitle>Hybrid Solution</CardTitle>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Maximum Protection
                    </span>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Network + device dual monitoring
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        ML-powered threat correlation
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Cross-platform behavioral insights
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Zero-trust security model
                      </li>
                    </ul>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-700">
                        <strong>Best for:</strong> Families with high-risk profiles, teens, or complex network setups
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 3: Add Children */}
          {currentStep === 3 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Add Your Children
              </h2>
              <p className="text-gray-600 mb-8 text-center">
                Tell us about your children so we can provide personalized, age-appropriate protection and AI-powered insights.
              </p>

              <div className="max-w-4xl mx-auto">
                {children.map((child, index) => (
                  <Card key={index} className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Child Profile #{index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900">Basic Information</h4>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Child's Name
                            </label>
                            <input
                              type="text"
                              value={child.name}
                              onChange={(e) => updateChild(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Age Group
                            </label>
                            <select
                              value={child.age}
                              onChange={(e) => updateChild(index, 'age', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="5-7">5-7 years (Early Elementary)</option>
                              <option value="8-10">8-10 years (Elementary)</option>
                              <option value="11-13">11-13 years (Middle School)</option>
                              <option value="14-16">14-16 years (High School)</option>
                              <option value="17-18">17-18 years (Senior/College)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Learning Style
                            </label>
                            <select
                              value={child.learningStyle || 'balanced'}
                              onChange={(e) => updateChild(index, 'learningStyle', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="visual">Visual Learner</option>
                              <option value="auditory">Auditory Learner</option>
                              <option value="kinesthetic">Hands-on Learner</option>
                              <option value="balanced">Balanced Approach</option>
                            </select>
                          </div>
                        </div>

                        {/* AI Personality & Risk Assessment */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900">AI Personalization</h4>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Personality Traits
                            </label>
                            <select
                              value={child.personality || 'curious'}
                              onChange={(e) => updateChild(index, 'personality', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="curious">Curious & Exploratory</option>
                              <option value="cautious">Cautious & Rule-following</option>
                              <option value="social">Social & Outgoing</option>
                              <option value="independent">Independent & Tech-savvy</option>
                              <option value="creative">Creative & Artistic</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Risk Level
                            </label>
                            <select
                              value={child.riskLevel || 'medium'}
                              onChange={(e) => updateChild(index, 'riskLevel', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="low">Low Risk (Supervised usage)</option>
                              <option value="medium">Medium Risk (Typical independence)</option>
                              <option value="high">High Risk (Previous incidents/concerns)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Special Considerations
                            </label>
                            <textarea
                              value={child.specialNeeds || ''}
                              onChange={(e) => updateChild(index, 'specialNeeds', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Learning differences, anxiety, ADHD, etc."
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                        <Button 
                          variant="outline" 
                          onClick={() => removeChild(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button 
                  variant="outline" 
                  onClick={addChild}
                  className="w-full mb-6"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Add Another Child
                </Button>

                {children.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No children added yet</p>
                    <Button onClick={addChild}>
                      Add Your First Child
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Network Setup (if network method chosen) */}
          {currentStep === 4 && deploymentMethod === 'network' && (
            <NetworkSetupStep 
              networkSetup={networkSetup} 
              setNetworkSetup={setNetworkSetup}
            />
          )}

          {/* Step 4: Device Setup (if devices method chosen) */}
          {currentStep === 4 && deploymentMethod === 'devices' && (
            <DeviceSetupStep />
          )}

          {/* Step 4: Hybrid Setup (if hybrid method chosen) */}
          {currentStep === 4 && deploymentMethod === 'hybrid' && (
            <HybridSetupStep />
          )}

          {/* Step 5: Configure Policies */}
          {currentStep === 5 && (
            <PolicySetupStep />
          )}

          {/* Step 6: Complete Setup */}
          {currentStep === 6 && (
            <CompletionStep deploymentMethod={deploymentMethod} completeSetup={completeSetup} />
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center p-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
            
            <Button 
              onClick={nextStep}
              disabled={
                (currentStep === 2 && !deploymentMethod) ||
                (currentStep === 3 && children.length === 0)
              }
            >
              {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
              {currentStep !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Network Setup Component
function NetworkSetupStep({ networkSetup, setNetworkSetup }: any) {
  const [copied, setCopied] = useState(false)
  const [setupMethod, setSetupMethod] = useState('auto')
  const [currentStep, setCurrentStep] = useState(1)
  
  const setupCode = "curl -s https://setup.aiguardian.com/install | sudo bash"

  const copySetupCode = () => {
    navigator.clipboard.writeText(setupCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyDNSServers = () => {
    navigator.clipboard.writeText("Primary: 1.1.1.2, Secondary: 1.0.0.2")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const routerGuides = {
    netgear: {
      name: "Netgear",
      adminUrl: "http://192.168.1.1",
      steps: [
        "Connect to router admin panel at 192.168.1.1",
        "Login with admin credentials (usually admin/password)",
        "Navigate to Dynamic DNS → Advanced → DNS Settings",
        "Set Primary DNS: 1.1.1.2 and Secondary DNS: 1.0.0.2",
        "Enable 'DNS over HTTPS' if available",
        "Click Apply/Save Settings",
        "Reboot router to apply changes"
      ]
    },
    asus: {
      name: "ASUS",
      adminUrl: "http://192.168.1.1", 
      steps: [
        "Access ASUS router interface at 192.168.1.1",
        "Login with router credentials",
        "Go to WAN → Internet Connection → DNS Server",
        "Set 'Connect to DNS Server automatically' to No",
        "Enter DNS Server 1: 1.1.1.2, DNS Server 2: 1.0.0.2",
        "Navigate to Adaptive QoS → Traditional QoS",
        "Enable AI Guardian traffic analysis integration",
        "Apply settings and restart router"
      ]
    },
    tplink: {
      name: "TP-Link",
      adminUrl: "http://192.168.0.1",
      steps: [
        "Open TP-Link web interface at 192.168.0.1",
        "Login with admin account",
        "Go to Advanced → Network → Internet",
        "Change DNS Settings to 'Use the following DNS servers'",
        "Primary DNS: 1.1.1.2, Secondary DNS: 1.0.0.2",
        "Save and reboot router",
        "Enable OpenWrt support if available for advanced filtering"
      ]
    },
    linksys: {
      name: "Linksys", 
      adminUrl: "http://192.168.1.1",
      steps: [
        "Access Linksys Smart Wi-Fi interface",
        "Navigate to Smart Wi-Fi Tools → Priority",
        "Click on 'Media Prioritization' tab",
        "Set up AI Guardian traffic rules",
        "Go to Router Settings → Connectivity",
        "Set DNS servers to 1.1.1.2 and 1.0.0.2",
        "Apply changes and test connectivity"
      ]
    }
  }

  if (setupMethod === 'manual' && networkSetup.routerModel && routerGuides[networkSetup.routerModel]) {
    const guide = routerGuides[networkSetup.routerModel]
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => setSetupMethod('auto')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Setup Options
          </Button>
          
          <div className="text-center mb-8">
            <Router className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{guide.name} Router Configuration</h2>
            <p className="text-gray-600">
              Follow these steps to configure your {guide.name} router for AI Guardian protection
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Configuration Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {guide.steps.map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5 ${
                          index < currentStep ? 'bg-green-500 text-white' : 
                          index === currentStep ? 'bg-blue-500 text-white' : 
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className={`${index === currentStep ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                            {step}
                          </p>
                          {index === currentStep && (
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={() => setCurrentStep(Math.min(guide.steps.length, currentStep + 1))}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                        {index < currentStep && (
                          <CheckCircle className="w-5 h-5 text-green-500 ml-2 mt-0.5" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open(guide.adminUrl, '_blank')}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Open Router Admin
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={copyDNSServers}
                  >
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    Copy DNS Servers
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Guardian DNS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="bg-blue-50 p-3 rounded font-mono">
                      <div>Primary: 1.1.1.2</div>
                      <div>Secondary: 1.0.0.2</div>
                    </div>
                    <p className="text-gray-600 text-xs">
                      These DNS servers provide content filtering and threat protection
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      Video Guide
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Get Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <Router className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Network Setup</h2>
          <p className="text-gray-600 text-lg">
            Configure AI Guardian to protect all devices on your home network
          </p>
        </div>

        {/* Router Detection & Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Router className="mr-2 h-5 w-5" />
              Router Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Router Brand/Model
                </label>
                <select
                  value={networkSetup.routerModel || ''}
                  onChange={(e) => setNetworkSetup({...networkSetup, routerModel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select your router brand</option>
                  <option value="netgear">Netgear (Nighthawk, Orbi, etc.)</option>
                  <option value="asus">ASUS (RT-Series, ROG, Mesh)</option>
                  <option value="tplink">TP-Link (Archer, Deco, etc.)</option>
                  <option value="linksys">Linksys (Velop, Max-Stream)</option>
                  <option value="eero">Eero Mesh</option>
                  <option value="ubiquiti">Ubiquiti (UniFi, Dream Machine)</option>
                  <option value="other">Other/Unsure</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network Name (SSID)
                </label>
                <input
                  type="text"
                  value={networkSetup.networkName || ''}
                  onChange={(e) => setNetworkSetup({...networkSetup, networkName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., MyHomeWiFi"
                />
              </div>
            </div>
            
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="adminAccess"
                  checked={networkSetup.adminAccess || false}
                  onChange={(e) => setNetworkSetup({...networkSetup, adminAccess: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="adminAccess" className="ml-2 text-sm text-gray-700">
                  I have admin access to my router
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="meshNetwork"
                  checked={networkSetup.meshNetwork || false}
                  onChange={(e) => setNetworkSetup({...networkSetup, meshNetwork: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="meshNetwork" className="ml-2 text-sm text-gray-700">
                  This is a mesh network system
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Method Selection */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card 
            className={`cursor-pointer transition-all ${setupMethod === 'auto' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'}`}
            onClick={() => setSetupMethod('auto')}
          >
            <CardHeader>
              <Settings className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Automatic Setup</CardTitle>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Recommended
              </span>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Automated router discovery and configuration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  DNS and firewall rules setup
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Real-time traffic monitoring integration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Works with most modern routers
                </li>
              </ul>
              
              {setupMethod === 'auto' && (
                <div className="mt-6 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Setup Command</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Run this on a computer connected to your network:
                    </p>
                    <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm relative">
                      {setupCode}
                      <button
                        onClick={copySetupCode}
                        className="absolute top-2 right-2 text-white hover:text-gray-300"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">What this does:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Detects your router model and firmware</li>
                      <li>• Configures DNS filtering with AI Guardian servers</li>
                      <li>• Sets up traffic analysis and monitoring</li>
                      <li>• Installs OpenWrt package if supported</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${setupMethod === 'manual' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-lg'}`}
            onClick={() => setSetupMethod('manual')}
          >
            <CardHeader>
              <Globe className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Manual Configuration</CardTitle>
              <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                Advanced
              </span>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Step-by-step router configuration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Brand-specific instructions
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Full control over settings
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Works with older router models
                </li>
              </ul>
              
              {setupMethod === 'manual' && (
                <div className="mt-6">
                  {networkSetup.routerModel ? (
                    <Button 
                      className="w-full"
                      onClick={() => setSetupMethod('manual')}
                    >
                      Configure {routerGuides[networkSetup.routerModel]?.name || 'Router'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <p className="text-sm text-amber-800">
                        Please select your router brand above to see specific instructions
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Device Setup Component
function DeviceSetupStep() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [enrollmentStep, setEnrollmentStep] = useState(1)

  const platforms = {
    ios: {
      name: 'iOS (iPhone/iPad)',
      icon: '📱',
      color: 'blue',
      steps: [
        'Download AI Guardian from App Store',
        'Allow notifications and permissions',
        'Sign in with your AI Guardian family account', 
        'Configure Screen Time integration (iOS 12+)',
        'Enable Family Sharing if needed',
        'Test protection with sample content'
      ],
      notes: 'Requires iOS 13.0+ and Family Sharing setup for full functionality',
      links: { appStore: 'https://apps.apple.com/aiguardian', guide: '/setup/ios' }
    },
    android: {
      name: 'Android',
      icon: '🤖',
      color: 'green', 
      steps: [
        'Download AI Guardian from Google Play',
        'Grant Device Administrator permissions',
        'Enable Accessibility Services for content monitoring',
        'Configure Work Profile (Android Enterprise)',
        'Set up usage access permissions',
        'Test app blocking and content filtering'
      ],
      notes: 'Requires Android 8.0+ and may need Enterprise enrollment for advanced features',
      links: { playStore: 'https://play.google.com/store/apps/aiguardian', guide: '/setup/android' }
    },
    windows: {
      name: 'Windows PC',
      icon: '💻',
      color: 'blue',
      steps: [
        'Download AI Guardian installer',
        'Run installer as Administrator',
        'Configure Group Policy settings',
        'Install browser extensions (Chrome, Edge, Firefox)',
        'Set up parental controls integration',
        'Enable Windows Defender SmartScreen integration'
      ],
      notes: 'Requires Windows 10/11. Domain-joined computers need GPO deployment',
      links: { download: 'https://download.aiguardian.com/windows', guide: '/setup/windows' }
    },
    macos: {
      name: 'macOS',
      icon: '🖥️',
      color: 'gray',
      steps: [
        'Download AI Guardian .dmg file',
        'Install application and grant permissions',
        'Enable System Extension in Security & Privacy',
        'Configure Screen Time API integration',
        'Install Safari/Chrome extensions',
        'Set up parental controls profile'
      ],
      notes: 'Requires macOS 11.0+. May need MDM enrollment for enterprise features',
      links: { download: 'https://download.aiguardian.com/macos', guide: '/setup/macos' }
    }
  }

  if (selectedPlatform && platforms[selectedPlatform]) {
    const platform = platforms[selectedPlatform]
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => setSelectedPlatform(null)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Platform Selection
          </Button>
          
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">{platform.icon}</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{platform.name} Setup</h2>
            <p className="text-gray-600">
              Follow these steps to install and configure AI Guardian protection
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Installation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platform.steps.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`w-8 h-8 bg-${platform.color}-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{step}</p>
                    </div>
                    {index === enrollmentStep - 1 && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                Requirements & Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{platform.notes}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Button className="w-full" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Download & Install
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <Globe className="mr-2 h-5 w-5" />
              View Setup Guide
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Need Help?</h4>
                <p className="text-sm text-blue-800">Access our step-by-step video guides and troubleshooting</p>
              </div>
              <Button variant="outline" size="sm">
                <Play className="mr-2 h-4 w-4" />
                Watch Tutorial
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <Smartphone className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Device Enrollment</h2>
          <p className="text-gray-600 text-lg">
            Choose your child's device platform for customized installation instructions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(platforms).map(([key, platform]) => (
            <Card 
              key={key}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => setSelectedPlatform(key)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">{platform.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{platform.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {platform.steps.length} setup steps
                </p>
                <Button size="sm" className="w-full">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <QrCode className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="font-semibold text-blue-900 mb-2">QR Code Setup</h4>
            <p className="text-sm text-blue-800">
              Scan with any device for instant download and configuration
            </p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h4 className="font-semibold text-green-900 mb-2">Bulk Deployment</h4>
            <p className="text-sm text-green-800">
              MDM/EMM solutions for schools and organizations
            </p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h4 className="font-semibold text-purple-900 mb-2">Browser Extensions</h4>
            <p className="text-sm text-purple-800">
              Chrome, Firefox, Safari, and Edge protection
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hybrid Setup Component
function HybridSetupStep() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
        Hybrid Setup
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Configure both network-level and device-level protection for maximum coverage.
      </p>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <Home className="h-8 w-8 text-blue-600 mb-2" />
            <CardTitle>1. Home Network Protection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              First, we'll set up network-level monitoring to protect all devices at home.
            </p>
            <Button>Configure Router</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Globe className="h-8 w-8 text-purple-600 mb-2" />
            <CardTitle>2. Mobile Device Protection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Then, install apps on mobile devices for protection outside the home network.
            </p>
            <Button>Install Mobile Apps</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Monitor className="h-8 w-8 text-green-600 mb-2" />
            <CardTitle>3. Browser Extensions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Finally, add browser extensions for detailed web content analysis.
            </p>
            <Button>Install Extensions</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Policy Setup Component
function PolicySetupStep() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
        Configure Protection Policies
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Set up safety levels and preferences for your family.
      </p>

      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Lock className="h-8 w-8 text-blue-600 mb-2" />
            <CardTitle>Safety Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="radio" name="safety" value="strict" className="mr-2" />
                <span>Strict - Maximum protection</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="safety" value="moderate" className="mr-2" defaultChecked />
                <span>Moderate - Balanced approach</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="safety" value="relaxed" className="mr-2" />
                <span>Relaxed - Minimal restrictions</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-green-600 mb-2" />
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Bias detection & balanced perspectives</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Predictive risk assessment</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Emotion-aware AI mentoring</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Crisis detection alerts</span>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Completion Component
function CompletionStep({ deploymentMethod, completeSetup }: { deploymentMethod: string | null; completeSetup: () => void }) {
  return (
    <div className="p-8 text-center">
      <div className="max-w-2xl mx-auto">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Setup Complete!
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          AI Guardian is now protecting your family with {deploymentMethod} deployment. 
          Your children can start using their devices safely while you monitor their digital wellbeing.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 p-4 rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">Protection Active</h3>
            <p className="text-sm text-gray-600">AI monitoring enabled</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">Policies Configured</h3>
            <p className="text-sm text-gray-600">Safety rules in place</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">Children Added</h3>
            <p className="text-sm text-gray-600">Profiles created</p>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            size="lg" 
            className="w-full"
            onClick={completeSetup}
          >
            <Play className="mr-2 h-5 w-5" />
            Go to Dashboard
          </Button>
          <Button variant="outline" className="w-full">
            View Setup Guide
          </Button>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <AlertCircle className="h-5 w-5 text-yellow-600 inline mr-2" />
          <span className="text-sm text-yellow-800">
            It may take a few minutes for all protection features to become fully active.
          </span>
        </div>
      </div>
    </div>
  )
}
