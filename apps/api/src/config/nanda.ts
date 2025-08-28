/**
 * Project NANDA Integration Configuration
 * Safe, additive configuration for AI Guardian NANDA agent capabilities
 */

export interface NANDAConfig {
  enabled: boolean;
  registryUrl: string;
  agentId: string;
  agentName: string;
  agentVersion: string;
  capabilities: string[];
  endpoints: {
    health: string;
    safety: string;
    bias: string;
    risk: string;
    educational: string;
  };
  discovery: {
    enabled: boolean;
    interval: number; // milliseconds
    timeout: number; // milliseconds
  };
  privacy: {
    dataSharing: boolean;
    consentRequired: boolean;
    anonymization: boolean;
  };
}

export interface AgentFacts {
  id: string;
  name: string;
  version: string;
  description: string;
  capabilities: string[];
  endpoints: Record<string, string>;
  metadata: {
    provider: string;
    category: string;
    tags: string[];
    compliance: string[];
  };
  verification: {
    publicKey: string;
    signature: string;
    timestamp: string;
  };
}

export interface NANDAAgent {
  id: string;
  name: string;
  capabilities: string[];
  endpoints: Record<string, string>;
  health: 'healthy' | 'degraded' | 'unhealthy';
  lastSeen: string;
  metadata: Record<string, any>;
}

export interface SafetyAnalysisRequest {
  contentId: string;
  contentType: 'video' | 'text' | 'image' | 'audio' | 'interactive';
  contentUrl?: string;
  contentHash: string;
  userId: string;
  ageGroup: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
}

export interface SafetyAnalysisResponse {
  requestId: string;
  contentId: string;
  safetyScore: number;
  biasScore: number;
  riskScore: number;
  educationalScore: number;
  threats: string[];
  recommendations: string[];
  confidence: number;
  analysisTimestamp: string;
  agentId: string;
  metadata: Record<string, any>;
}

// Default configuration - can be overridden via environment variables
export const defaultNANDAConfig: NANDAConfig = {
  enabled: process.env.NANDA_ENABLED === 'true',
  registryUrl: process.env.NANDA_REGISTRY_URL || 'https://registry.projectnanda.org',
  agentId: process.env.NANDA_AGENT_ID || 'aiguardian-safety-hub',
  agentName: 'AI Guardian Safety Hub',
  agentVersion: '0.1.0',
  capabilities: [
    'content_safety_analysis',
    'bias_detection',
    'risk_assessment',
    'educational_validation',
    'emotional_monitoring',
    'crisis_detection'
  ],
  endpoints: {
    health: '/api/nanda/health',
    safety: '/api/nanda/safety',
    bias: '/api/nanda/bias',
    risk: '/api/nanda/risk',
    educational: '/api/nanda/educational'
  },
  discovery: {
    enabled: true,
    interval: 30000, // 30 seconds
    timeout: 5000    // 5 seconds
  },
  privacy: {
    dataSharing: false, // Start with data sharing disabled for safety
    consentRequired: true,
    anonymization: true
  }
};

// Environment variable validation
export function validateNANDAConfig(config: NANDAConfig): string[] {
  const errors: string[] = [];
  
  if (!config.registryUrl) {
    errors.push('NANDA_REGISTRY_URL is required when NANDA is enabled');
  }
  
  if (!config.agentId) {
    errors.push('NANDA_AGENT_ID is required when NANDA is enabled');
  }
  
  if (config.enabled && config.capabilities.length === 0) {
    errors.push('At least one capability must be defined when NANDA is enabled');
  }
  
  return errors;
}
