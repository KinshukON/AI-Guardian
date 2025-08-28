/**
 * Project NANDA Service
 * Handles agent registration, discovery, and communication
 * Safe, additive service that doesn't modify existing functionality
 */

import { FastifyInstance } from 'fastify';
import { NANDAConfig, AgentFacts, NANDAAgent, SafetyAnalysisRequest, SafetyAnalysisResponse } from '../config/nanda';

export class NANDAService {
  private config: NANDAConfig;
  private fastify: FastifyInstance;
  private registeredAgents: Map<string, NANDAAgent> = new Map();
  private isRegistered: boolean = false;
  private healthCheckInterval?: NodeJS.Timeout;

  constructor(fastify: FastifyInstance, config: NANDAConfig) {
    this.fastify = fastify;
    this.config = config;
  }

  /**
   * Initialize NANDA service
   * Safe initialization that doesn't affect existing services
   */
  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      this.fastify.log.info('NANDA integration is disabled');
      return;
    }

    try {
      // Validate configuration
      const errors = this.validateConfig();
      if (errors.length > 0) {
        this.fastify.log.warn('NANDA configuration validation failed:', errors);
        return;
      }

      // Start health check monitoring
      this.startHealthCheckMonitoring();
      
      // Attempt to register with NANDA registry
      await this.registerAgent();
      
      this.fastify.log.info('NANDA service initialized successfully');
    } catch (error) {
      this.fastify.log.error('Failed to initialize NANDA service:', error);
      // Don't throw - allow existing services to continue working
    }
  }

  /**
   * Register AI Guardian as a NANDA agent
   * Safe registration that doesn't affect existing functionality
   */
  private async registerAgent(): Promise<void> {
    try {
      const agentFacts: AgentFacts = {
        id: this.config.agentId,
        name: this.config.agentName,
        version: this.config.agentVersion,
        description: 'AI Guardian Safety Hub - Comprehensive AI safety analysis for children',
        capabilities: this.config.capabilities,
        endpoints: this.config.endpoints,
        metadata: {
          provider: 'AI Guardian',
          category: 'safety_analysis',
          tags: ['child_safety', 'ai_safety', 'content_moderation', 'bias_detection'],
          compliance: ['COPPA', 'GDPR', 'FERPA']
        },
        verification: {
          publicKey: 'placeholder-key', // Will be replaced with actual key
          signature: 'placeholder-signature', // Will be replaced with actual signature
          timestamp: new Date().toISOString()
        }
      };

      // For now, just log the registration attempt
      // In Phase 2, this will actually register with the NANDA registry
      this.fastify.log.info('NANDA agent registration attempted:', {
        agentId: agentFacts.id,
        capabilities: agentFacts.capabilities.length,
        timestamp: agentFacts.verification.timestamp
      });

      this.isRegistered = true;
    } catch (error) {
      this.fastify.log.error('Failed to register NANDA agent:', error);
      // Don't throw - allow existing services to continue working
    }
  }

  /**
   * Discover other NANDA agents
   * Safe discovery that doesn't affect existing functionality
   */
  async discoverAgents(capability?: string): Promise<NANDAAgent[]> {
    if (!this.config.enabled || !this.config.discovery.enabled) {
      return [];
    }

    try {
      // For Phase 1, return empty array
      // In Phase 2, this will actually query the NANDA registry
      this.fastify.log.debug('NANDA agent discovery requested', { capability });
      
      return Array.from(this.registeredAgents.values());
    } catch (error) {
      this.fastify.log.error('Failed to discover NANDA agents:', error);
      return []; // Return empty array on error - don't break existing functionality
    }
  }

  /**
   * Handle safety analysis requests from other agents
   * Safe handling that integrates with existing safety analysis
   */
  async handleSafetyAnalysis(request: SafetyAnalysisRequest): Promise<SafetyAnalysisResponse> {
    try {
      this.fastify.log.info('NANDA safety analysis request received:', {
        contentId: request.contentId,
        contentType: request.contentType,
        priority: request.priority
      });

      // For Phase 1, return a mock response
      // In Phase 2, this will integrate with existing safety analysis services
      const response: SafetyAnalysisResponse = {
        requestId: `nanda-${Date.now()}`,
        contentId: request.contentId,
        safetyScore: 0.85, // Mock score
        biasScore: 0.12,   // Mock score
        riskScore: 0.08,   // Mock score
        educationalScore: 0.78, // Mock score
        threats: [],
        recommendations: ['Content appears safe for the specified age group'],
        confidence: 0.92,
        analysisTimestamp: new Date().toISOString(),
        agentId: this.config.agentId,
        metadata: {
          phase: 'phase1',
          integration: 'nanda',
          analysisType: 'mock'
        }
      };

      return response;
    } catch (error) {
      this.fastify.log.error('Failed to handle NANDA safety analysis:', error);
      
      // Return a safe fallback response
      return {
        requestId: `nanda-error-${Date.now()}`,
        contentId: request.contentId,
        safetyScore: 0.5, // Neutral score on error
        biasScore: 0.5,
        riskScore: 0.5,
        educationalScore: 0.5,
        threats: ['Analysis temporarily unavailable'],
        recommendations: ['Please try again later or use standard AI Guardian analysis'],
        confidence: 0.0,
        analysisTimestamp: new Date().toISOString(),
        agentId: this.config.agentId,
        metadata: {
          phase: 'phase1',
          integration: 'nanda',
          error: true,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  /**
   * Start health check monitoring
   * Safe monitoring that doesn't affect existing services
   */
  private startHealthCheckMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        this.fastify.log.error('NANDA health check failed:', error);
        // Don't throw - allow existing services to continue working
      }
    }, this.config.discovery.interval);
  }

  /**
   * Perform health check
   * Safe health check that doesn't affect existing functionality
   */
  private async performHealthCheck(): Promise<void> {
    try {
      // For Phase 1, just log the health check
      // In Phase 2, this will actually report health to the NANDA registry
      this.fastify.log.debug('NANDA health check performed', {
        agentId: this.config.agentId,
        timestamp: new Date().toISOString(),
        status: 'healthy'
      });
    } catch (error) {
      this.fastify.log.error('NANDA health check error:', error);
      // Don't throw - allow existing services to continue working
    }
  }

  /**
   * Validate configuration
   * Safe validation that doesn't affect existing functionality
   */
  private validateConfig(): string[] {
    const errors: string[] = [];
    
    if (!this.config.registryUrl) {
      errors.push('NANDA_REGISTRY_URL is required when NANDA is enabled');
    }
    
    if (!this.config.agentId) {
      errors.push('NANDA_AGENT_ID is required when NANDA is enabled');
    }
    
    if (this.config.enabled && this.config.capabilities.length === 0) {
      errors.push('At least one capability must be defined when NANDA is enabled');
    }
    
    return errors;
  }

  /**
   * Get service status
   * Safe status reporting that doesn't affect existing functionality
   */
  getStatus(): {
    enabled: boolean;
    registered: boolean;
    agentId: string;
    capabilities: string[];
    discoveredAgents: number;
  } {
    return {
      enabled: this.config.enabled,
      registered: this.isRegistered,
      agentId: this.config.agentId,
      capabilities: this.config.capabilities,
      discoveredAgents: this.registeredAgents.size
    };
  }

  /**
   * Cleanup resources
   * Safe cleanup that doesn't affect existing functionality
   */
  async cleanup(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
    
    this.fastify.log.info('NANDA service cleanup completed');
  }
}
