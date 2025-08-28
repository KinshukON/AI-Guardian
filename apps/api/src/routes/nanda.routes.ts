/**
 * Project NANDA API Routes
 * Safe, additive routes that don't modify existing functionality
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { NANDAService } from '../services/nanda.service';
import { SafetyAnalysisRequest } from '../config/nanda';

// Request/Response schemas for validation
const SafetyAnalysisRequestSchema = {
  type: 'object',
  properties: {
    contentId: { type: 'string' },
    contentType: { type: 'string', enum: ['video', 'text', 'image', 'audio', 'interactive'] },
    contentUrl: { type: 'string' },
    contentHash: { type: 'string' },
    userId: { type: 'string' },
    ageGroup: { type: 'string' },
    priority: { type: 'string', enum: ['low', 'medium', 'high'] },
    timestamp: { type: 'string' }
  },
  required: ['contentId', 'contentType', 'contentHash', 'userId', 'ageGroup', 'priority', 'timestamp']
};

const SafetyAnalysisResponseSchema = {
  type: 'object',
  properties: {
    requestId: { type: 'string' },
    contentId: { type: 'string' },
    safetyScore: { type: 'number' },
    biasScore: { type: 'number' },
    riskScore: { type: 'number' },
    educationalScore: { type: 'number' },
    threats: { type: 'array', items: { type: 'string' } },
    recommendations: { type: 'array', items: { type: 'string' } },
    confidence: { type: 'number' },
    analysisTimestamp: { type: 'string' },
    agentId: { type: 'string' },
    metadata: { type: 'object' }
  }
};

export async function nandaRoutes(fastify: FastifyInstance, nandaService: NANDAService) {
  // Health check endpoint
  fastify.get('/health', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            agentId: { type: 'string' },
            version: { type: 'string' },
            capabilities: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const status = nandaService.getStatus();
      
      return reply.send({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        agentId: status.agentId,
        version: '0.1.0',
        capabilities: status.capabilities
      });
    } catch (error) {
      fastify.log.error('NANDA health check error:', error);
      return reply.status(500).send({
        status: 'error',
        message: 'Health check failed',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Agent discovery endpoint
  fastify.get('/discover', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          capability: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            agents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  capabilities: { type: 'array', items: { type: 'string' } },
                  health: { type: 'string' },
                  lastSeen: { type: 'string' }
                }
              }
            },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest<{ Querystring: { capability?: string } }>, reply: FastifyReply) => {
    try {
      const { capability } = request.query;
      const agents = await nandaService.discoverAgents(capability);
      
      return reply.send({
        agents: agents.map(agent => ({
          id: agent.id,
          name: agent.name,
          capabilities: agent.capabilities,
          health: agent.health,
          lastSeen: agent.lastSeen
        })),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      fastify.log.error('NANDA agent discovery error:', error);
      return reply.status(500).send({
        error: 'Agent discovery failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Safety analysis endpoint
  fastify.post('/safety', {
    schema: {
      body: SafetyAnalysisRequestSchema,
      response: {
        200: SafetyAnalysisResponseSchema
      }
    }
  }, async (request: FastifyRequest<{ Body: SafetyAnalysisRequest }>, reply: FastifyReply) => {
    try {
      const analysisRequest = request.body;
      
      // Log the request for debugging
      fastify.log.info('NANDA safety analysis request received:', {
        contentId: analysisRequest.contentId,
        contentType: analysisRequest.contentType,
        priority: analysisRequest.priority
      });

      // Process the safety analysis request
      const response = await nandaService.handleSafetyAnalysis(analysisRequest);
      
      return reply.send(response);
    } catch (error) {
      fastify.log.error('NANDA safety analysis error:', error);
      return reply.status(500).send({
        error: 'Safety analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Agent status endpoint
  fastify.get('/status', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean' },
            registered: { type: 'boolean' },
            agentId: { type: 'string' },
            capabilities: { type: 'array', items: { type: 'string' } },
            discoveredAgents: { type: 'number' },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const status = nandaService.getStatus();
      
      return reply.send({
        ...status,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      fastify.log.error('NANDA status error:', error);
      return reply.status(500).send({
        error: 'Status retrieval failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Agent capabilities endpoint
  fastify.get('/capabilities', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            capabilities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  version: { type: 'string' },
                  endpoints: { type: 'object' }
                }
              }
            },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const status = nandaService.getStatus();
      
      const capabilities = status.capabilities.map(capability => ({
        name: capability,
        description: getCapabilityDescription(capability),
        version: '0.1.0',
        endpoints: getCapabilityEndpoints(capability)
      }));
      
      return reply.send({
        capabilities,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      fastify.log.error('NANDA capabilities error:', error);
      return reply.status(500).send({
        error: 'Capabilities retrieval failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });
}

// Helper function to get capability descriptions
function getCapabilityDescription(capability: string): string {
  const descriptions: Record<string, string> = {
    'content_safety_analysis': 'Analyze content for safety threats, violence, and inappropriate material',
    'bias_detection': 'Detect bias, stereotypes, and framing in content',
    'risk_assessment': 'Assess risk levels and provide intervention recommendations',
    'educational_validation': 'Validate educational content quality and curriculum alignment',
    'emotional_monitoring': 'Monitor emotional indicators and provide support',
    'crisis_detection': 'Detect crisis situations and provide immediate intervention'
  };
  
  return descriptions[capability] || 'AI Guardian safety capability';
}

// Helper function to get capability endpoints
function getCapabilityEndpoints(capability: string): Record<string, string> {
  const endpoints: Record<string, Record<string, string>> = {
    'content_safety_analysis': {
      'analyze': '/api/nanda/safety',
      'health': '/api/nanda/health'
    },
    'bias_detection': {
      'detect': '/api/nanda/bias',
      'health': '/api/nanda/health'
    },
    'risk_assessment': {
      'assess': '/api/nanda/risk',
      'health': '/api/nanda/health'
    },
    'educational_validation': {
      'validate': '/api/nanda/educational',
      'health': '/api/nanda/health'
    },
    'emotional_monitoring': {
      'monitor': '/api/nanda/emotional',
      'health': '/api/nanda/health'
    },
    'crisis_detection': {
      'detect': '/api/nanda/crisis',
      'health': '/api/nanda/health'
    }
  };
  
  return endpoints[capability] || { 'health': '/api/nanda/health' };
}
