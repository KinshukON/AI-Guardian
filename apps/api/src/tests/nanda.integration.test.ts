/**
 * Project NANDA Integration Tests
 * Safe, additive tests that don't modify existing test functionality
 */

import { FastifyInstance } from 'fastify';
import { NANDAService } from '../services/nanda.service';
import { defaultNANDAConfig } from '../config/nanda';

// Mock Fastify instance for testing
const createMockFastify = (): FastifyInstance => {
  return {
    log: {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    }
  } as any;
};

describe('NANDA Service Integration', () => {
  let nandaService: NANDAService;
  let mockFastify: FastifyInstance;

  beforeEach(() => {
    mockFastify = createMockFastify();
    nandaService = new NANDAService(mockFastify, defaultNANDAConfig);
  });

  afterEach(async () => {
    await nandaService.cleanup();
  });

  describe('Service Initialization', () => {
    it('should initialize without errors when NANDA is disabled', async () => {
      const disabledConfig = { ...defaultNANDAConfig, enabled: false };
      const service = new NANDAService(mockFastify, disabledConfig);
      
      await expect(service.initialize()).resolves.not.toThrow();
      
      const status = service.getStatus();
      expect(status.enabled).toBe(false);
    });

    it('should initialize successfully with valid configuration', async () => {
      const validConfig = { ...defaultNANDAConfig, enabled: true };
      const service = new NANDAService(mockFastify, validConfig);
      
      await expect(service.initialize()).resolves.not.toThrow();
      
      const status = service.getStatus();
      expect(status.enabled).toBe(true);
    });

    it('should handle initialization errors gracefully', async () => {
      const invalidConfig = { ...defaultNANDAConfig, enabled: true, registryUrl: '' };
      const service = new NANDAService(mockFastify, invalidConfig);
      
      // Should not throw, just log warnings
      await expect(service.initialize()).resolves.not.toThrow();
      
      const status = service.getStatus();
      expect(status.enabled).toBe(true);
    });
  });

  describe('Agent Registration', () => {
    it('should attempt agent registration when enabled', async () => {
      const validConfig = { ...defaultNANDAConfig, enabled: true };
      const service = new NANDAService(mockFastify, validConfig);
      
      await service.initialize();
      
      const status = service.getStatus();
      expect(status.registered).toBe(true);
    });

    it('should not register when disabled', async () => {
      const disabledConfig = { ...defaultNANDAConfig, enabled: false };
      const service = new NANDAService(mockFastify, disabledConfig);
      
      await service.initialize();
      
      const status = service.getStatus();
      expect(status.registered).toBe(false);
    });
  });

  describe('Agent Discovery', () => {
    it('should return empty array when discovery is disabled', async () => {
      const disabledConfig = { 
        ...defaultNANDAConfig, 
        enabled: true, 
        discovery: { ...defaultNANDAConfig.discovery, enabled: false }
      };
      const service = new NANDAService(mockFastify, disabledConfig);
      
      await service.initialize();
      
      const agents = await service.discoverAgents();
      expect(agents).toEqual([]);
    });

    it('should return empty array in Phase 1 (mock mode)', async () => {
      const validConfig = { ...defaultNANDAConfig, enabled: true };
      const service = new NANDAService(mockFastify, validConfig);
      
      await service.initialize();
      
      const agents = await service.discoverAgents();
      expect(agents).toEqual([]);
    });

    it('should handle discovery errors gracefully', async () => {
      const validConfig = { ...defaultNANDAConfig, enabled: true };
      const service = new NANDAService(mockFastify, validConfig);
      
      await service.initialize();
      
      // Mock an error scenario
      jest.spyOn(service as any, 'discoverAgents').mockRejectedValueOnce(new Error('Discovery failed'));
      
      const agents = await service.discoverAgents();
      expect(agents).toEqual([]);
    });
  });

  describe('Safety Analysis', () => {
    it('should handle safety analysis requests successfully', async () => {
      const validConfig = { ...defaultNANDAConfig, enabled: true };
      const service = new NANDAService(mockFastify, validConfig);
      
      await service.initialize();
      
      const request = {
        contentId: 'test-content-123',
        contentType: 'video' as const,
        contentHash: 'abc123hash',
        userId: 'user-456',
        ageGroup: '11-13',
        priority: 'medium' as const,
        timestamp: new Date().toISOString()
      };
      
      const response = await service.handleSafetyAnalysis(request);
      
      expect(response).toBeDefined();
      expect(response.contentId).toBe(request.contentId);
      expect(response.agentId).toBe(validConfig.agentId);
      expect(response.metadata.phase).toBe('phase1');
    });

    it('should return safe fallback on errors', async () => {
      const validConfig = { ...defaultNANDAConfig, enabled: true };
      const service = new NANDAService(mockFastify, validConfig);
      
      await service.initialize();
      
      const request = {
        contentId: 'test-content-123',
        contentType: 'text' as const,
        contentHash: 'abc123hash',
        userId: 'user-456',
        ageGroup: '8-10',
        priority: 'high' as const,
        timestamp: new Date().toISOString()
      };
      
      // Mock an error scenario
      jest.spyOn(service as any, 'handleSafetyAnalysis').mockRejectedValueOnce(new Error('Analysis failed'));
      
      const response = await service.handleSafetyAnalysis(request);
      
      expect(response).toBeDefined();
      expect(response.metadata.error).toBe(true);
      expect(response.confidence).toBe(0.0);
    });
  });

  describe('Service Status', () => {
    it('should return correct status information', async () => {
      const validConfig = { ...defaultNANDAConfig, enabled: true };
      const service = new NANDAService(mockFastify, validConfig);
      
      await service.initialize();
      
      const status = service.getStatus();
      
      expect(status.enabled).toBe(true);
      expect(status.agentId).toBe(validConfig.agentId);
      expect(status.capabilities).toEqual(validConfig.capabilities);
      expect(status.discoveredAgents).toBe(0); // Phase 1 starts with 0
    });

    it('should reflect disabled state correctly', () => {
      const disabledConfig = { ...defaultNANDAConfig, enabled: false };
      const service = new NANDAService(mockFastify, disabledConfig);
      
      const status = service.getStatus();
      
      expect(status.enabled).toBe(false);
      expect(status.registered).toBe(false);
    });
  });

  describe('Service Cleanup', () => {
    it('should cleanup resources without errors', async () => {
      const validConfig = { ...defaultNANDAConfig, enabled: true };
      const service = new NANDAService(mockFastify, validConfig);
      
      await service.initialize();
      
      // Should not throw
      await expect(service.cleanup()).resolves.not.toThrow();
    });

    it('should handle cleanup when no resources exist', async () => {
      const disabledConfig = { ...defaultNANDAConfig, enabled: false };
      const service = new NANDAService(mockFastify, disabledConfig);
      
      // Should not throw
      await expect(service.cleanup()).resolves.not.toThrow();
    });
  });

  describe('Configuration Validation', () => {
    it('should validate required fields correctly', () => {
      const { validateNANDAConfig } = require('../config/nanda');
      
      const validConfig = { ...defaultNANDAConfig, enabled: true };
      const errors = validateNANDAConfig(validConfig);
      expect(errors).toHaveLength(0);
      
      const invalidConfig = { ...defaultNANDAConfig, enabled: true, registryUrl: '' };
      const invalidErrors = validateNANDAConfig(invalidConfig);
      expect(invalidErrors).toContain('NANDA_REGISTRY_URL is required when NANDA is enabled');
    });

    it('should validate capabilities when enabled', () => {
      const { validateNANDAConfig } = require('../config/nanda');
      
      const invalidConfig = { ...defaultNANDAConfig, enabled: true, capabilities: [] };
      const errors = validateNANDAConfig(invalidConfig);
      expect(errors).toContain('At least one capability must be defined when NANDA is enabled');
    });
  });
});
