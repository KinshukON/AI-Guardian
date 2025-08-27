import React, { useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@aiguardian/ui'
import { useAuth } from '../contexts/AuthContext'
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Lock, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  Save,
  Edit,
  Plus,
  Minus,
  Clock,
  Database,
  Key,
  AlertTriangle
} from 'lucide-react'

interface ValuesProfile {
  empathy: number
  curiosity: number
  balancedViews: number
  growthMindset: number
}

interface PrivacySettings {
  dataRetention: '7' | '30' | '90' | '365'
  localOnlyMode: boolean
  shareWithEducators: boolean
  shareWithResearchers: boolean
  auditLogging: boolean
}

export const Settings: React.FC = () => {
  const { selectedChild, userChildren, selectChild } = useAuth()
  const [activeTab, setActiveTab] = useState('profiles')
  const [editingProfile, setEditingProfile] = useState<string | null>(null)
  const [showAdvancedPrivacy, setShowAdvancedPrivacy] = useState(false)

  // Mock settings data
  const [valuesProfiles, setValuesProfiles] = useState<Record<string, ValuesProfile>>({
    '1': { empathy: 85, curiosity: 90, balancedViews: 75, growthMindset: 80 },
    '2': { empathy: 70, curiosity: 95, balancedViews: 60, growthMindset: 85 }
  })

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataRetention: '30',
    localOnlyMode: false,
    shareWithEducators: true,
    shareWithResearchers: false,
    auditLogging: true
  })

  const tabs = [
    { id: 'profiles', name: 'Profiles & Values', icon: User },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'data', name: 'Data Management', icon: Database },
    { id: 'integrations', name: 'Integrations', icon: Key }
  ]

  const handleValueChange = (childId: string, value: keyof ValuesProfile, newValue: number) => {
    setValuesProfiles(prev => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        [value]: Math.max(0, Math.min(100, newValue))
      }
    }))
  }

  const handleSaveProfile = (childId: string) => {
    setEditingProfile(null)
    // In real app, this would save to the API
  }

  const handlePrivacyChange = (setting: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const handleExportData = () => {
    // Mock export - in real app, this would generate and download data
    console.log('Exporting data...')
  }

  const handleDeleteData = () => {
    if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      // Mock deletion - in real app, this would delete data
      console.log('Deleting data...')
    }
  }

  const getValueColor = (value: number) => {
    if (value >= 80) return 'text-success-600'
    if (value >= 60) return 'text-warning-600'
    return 'text-danger-600'
  }

  const getValueLabel = (value: number) => {
    if (value >= 80) return 'High'
    if (value >= 60) return 'Medium'
    return 'Low'
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Settings & Preferences</h1>
        <p className="text-primary-600">
          Manage your family's profiles, values, privacy settings, and data preferences.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-primary-100 p-1 rounded-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-primary-900 shadow-soft'
                  : 'text-primary-600 hover:text-primary-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'profiles' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Child Profiles & Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {userChildren.map((child) => (
                  <div key={child.id} className="border border-primary-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-primary-900">{child.displayName}</h3>
                        <p className="text-primary-600">Age Band: {child.ageBand}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{child.ageBand}</Badge>
                        {editingProfile === child.id ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSaveProfile(child.id)}
                            leftIcon={<Save className="h-4 w-4" />}
                          >
                            Save
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProfile(child.id)}
                            leftIcon={<Edit className="h-4 w-4" />}
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Values Sliders */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-primary-900">Values Profile</h4>
                        {(['empathy', 'curiosity', 'balancedViews', 'growthMindset'] as const).map((value) => (
                          <div key={value} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-primary-700 capitalize">
                                {value.replace(/([A-Z])/g, ' $1').trim()}
                              </label>
                              <span className={`text-sm font-medium ${getValueColor(valuesProfiles[child.id][value])}`}>
                                {valuesProfiles[child.id][value]} ({getValueLabel(valuesProfiles[child.id][value])})
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={valuesProfiles[child.id][value]}
                              onChange={(e) => handleValueChange(child.id, value, parseInt(e.target.value))}
                              disabled={editingProfile !== child.id}
                              className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Values Summary */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-primary-900">Values Summary</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {(['empathy', 'curiosity', 'balancedViews', 'growthMindset'] as const).map((value) => (
                            <div key={value} className="text-center p-3 bg-primary-50 rounded-xl">
                              <div className={`text-lg font-bold ${getValueColor(valuesProfiles[child.id][value])}`}>
                                {valuesProfiles[child.id][value]}
                              </div>
                              <div className="text-xs text-primary-600 capitalize">
                                {value.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="space-y-6">
          {/* Basic Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-primary-900 mb-4">Data Retention</h4>
                  <div className="grid md:grid-cols-4 gap-3">
                    {(['7', '30', '90', '365'] as const).map((days) => (
                      <label key={days} className="flex items-center p-3 border border-primary-200 rounded-xl cursor-pointer hover:bg-primary-50">
                        <input
                          type="radio"
                          name="retention"
                          value={days}
                          checked={privacySettings.dataRetention === days}
                          onChange={(e) => handlePrivacyChange('dataRetention', e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium text-primary-900">{days} days</div>
                          <div className="text-sm text-primary-600">
                            {days === '7' ? '1 week' : days === '30' ? '1 month' : days === '90' ? '3 months' : '1 year'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-primary-900 mb-4">Privacy Controls</h4>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border border-primary-200 rounded-xl">
                      <div>
                        <div className="font-medium text-primary-900">Local-Only Mode</div>
                        <div className="text-sm text-primary-600">Keep all data on your device only</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.localOnlyMode}
                        onChange={(e) => handlePrivacyChange('localOnlyMode', e.target.checked)}
                        className="rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-primary-200 rounded-xl">
                      <div>
                        <div className="font-medium text-primary-900">Share with Educators</div>
                        <div className="text-sm text-primary-600">Allow teachers to see anonymous insights</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.shareWithEducators}
                        onChange={(e) => handlePrivacyChange('shareWithEducators', e.target.checked)}
                        className="rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-primary-200 rounded-xl">
                      <div>
                        <div className="font-medium text-primary-900">Audit Logging</div>
                        <div className="text-sm text-primary-600">Track who accesses your data and when</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.auditLogging}
                        onChange={(e) => handlePrivacyChange('auditLogging', e.target.checked)}
                        className="rounded"
                      />
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => setShowAdvancedPrivacy(!showAdvancedPrivacy)}
                  className="text-accent-600 hover:text-accent-700 text-sm font-medium"
                >
                  {showAdvancedPrivacy ? 'Hide' : 'Show'} Advanced Privacy Settings
                </button>

                {showAdvancedPrivacy && (
                  <div className="p-4 bg-primary-50 rounded-xl space-y-4">
                    <h5 className="font-medium text-primary-900">Advanced Settings</h5>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-primary-700">Share with Researchers</span>
                        <input
                          type="checkbox"
                          checked={privacySettings.shareWithResearchers}
                          onChange={(e) => handlePrivacyChange('shareWithResearchers', e.target.checked)}
                          className="rounded"
                        />
                      </label>
                      <p className="text-xs text-primary-600">
                        Help improve AI safety by sharing anonymous, aggregated data with research institutions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border border-primary-200 rounded-2xl">
                    <Download className="h-8 w-8 text-accent-500 mx-auto mb-3" />
                    <h4 className="font-medium text-primary-900 mb-2">Export Data</h4>
                    <p className="text-sm text-primary-600 mb-4">Download all your data in a portable format</p>
                    <Button onClick={handleExportData} variant="outline" className="w-full">
                      Export All Data
                    </Button>
                  </div>

                  <div className="text-center p-6 border border-primary-200 rounded-2xl">
                    <Clock className="h-8 w-8 text-warning-500 mx-auto mb-3" />
                    <h4 className="font-medium text-primary-900 mb-2">Data Retention</h4>
                    <p className="text-sm text-primary-600 mb-4">Currently keeping data for {privacySettings.dataRetention} days</p>
                    <Button variant="outline" className="w-full">
                      Change Retention
                    </Button>
                  </div>

                  <div className="text-center p-6 border border-primary-200 rounded-2xl">
                    <Trash2 className="h-8 w-8 text-danger-500 mx-auto mb-3" />
                    <h4 className="font-medium text-primary-900 mb-2">Delete Data</h4>
                    <p className="text-sm text-primary-600 mb-4">Permanently remove all your data</p>
                    <Button onClick={handleDeleteData} variant="danger" className="w-full">
                      Delete All Data
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-warning-50 border border-warning-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-warning-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-warning-900">Data Deletion Warning</h5>
                      <p className="text-sm text-warning-700 mt-1">
                        Deleting your data is permanent and cannot be undone. This will remove all content analysis, 
                        reports, and settings. Consider exporting your data first.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations & Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center py-12 text-primary-500">
                  <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h4 className="text-lg font-medium text-primary-700 mb-2">No Integrations Yet</h4>
                  <p className="text-primary-600">
                    Connect with other services and platforms to enhance your AI Guardian experience.
                  </p>
                  <Button variant="outline" className="mt-4">
                    Browse Integrations
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