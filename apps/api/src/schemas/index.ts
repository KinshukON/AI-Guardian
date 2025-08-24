import { z } from 'zod'

// Base schemas
export const UserRoleSchema = z.enum(['PARENT', 'EDUCATOR', 'TEEN', 'ADMIN'])
export const AgeBandSchema = z.enum(['AGE_8_10', 'AGE_11_13', 'AGE_14_16', 'AGE_17_PLUS'])
export const EventTypeSchema = z.enum(['VIDEO', 'TEXT', 'CHAT', 'APP', 'WEBSITE'])

// User schemas
export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: UserRoleSchema,
  displayName: z.string().min(1),
  mfaEnabled: z.boolean().optional()
})

export const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export const UpdateUserSchema = z.object({
  displayName: z.string().min(1).optional(),
  mfaEnabled: z.boolean().optional()
})

// Child schemas
export const ValuesProfileSchema = z.object({
  empathy: z.number().min(0).max(100),
  curiosity: z.number().min(0).max(100),
  balancedViews: z.number().min(0).max(100),
  growthMindset: z.number().min(0).max(100)
})

export const CreateChildSchema = z.object({
  displayName: z.string().min(1),
  ageBand: AgeBandSchema,
  values: ValuesProfileSchema
})

export const UpdateChildSchema = z.object({
  displayName: z.string().min(1).optional(),
  ageBand: AgeBandSchema.optional(),
  values: ValuesProfileSchema.optional()
})

// Event schemas
export const CreateEventSchema = z.object({
  childId: z.string().cuid(),
  type: EventTypeSchema,
  source: z.string(),
  uri: z.string().url().optional(),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
  meta: z.record(z.any()).optional()
})

// Analysis schemas
export const BiasAnalysisSchema = z.object({
  stereotypes: z.array(z.string()).optional(),
  framing: z.string().optional(),
  missingPerspectives: z.array(z.string()).optional(),
  overallScore: z.number().min(0).max(100)
})

export const EvidenceSchema = z.object({
  snippets: z.array(z.string()),
  sources: z.array(z.string()).optional(),
  confidence: z.number().min(0).max(1)
})

export const CreateAnalysisSchema = z.object({
  eventId: z.string().cuid(),
  safetyScore: z.number().min(0).max(100),
  qualityScore: z.number().min(0).max(100),
  biasScore: z.number().min(0).max(100),
  bias: BiasAnalysisSchema.optional(),
  evidence: EvidenceSchema.optional(),
  confidence: z.number().min(0).max(1)
})

// Content analysis request schemas
export const ContentAnalysisRequestSchema = z.object({
  content: z.string().min(1),
  type: EventTypeSchema,
  childId: z.string().cuid(),
  source: z.string().optional(),
  uri: z.string().url().optional()
})

export const ContentAnalysisResponseSchema = z.object({
  id: z.string(),
  safety: z.object({
    score: z.number().min(0).max(100),
    confidence: z.number().min(0).max(1),
    flags: z.array(z.string()),
    evidence: z.array(z.string())
  }),
  quality: z.object({
    score: z.number().min(0).max(100),
    confidence: z.number().min(0).max(1),
    factuality: z.number().min(0).max(100),
    depth: z.number().min(0).max(100),
    clarity: z.number().min(0).max(100)
  }),
  bias: z.object({
    score: z.number().min(0).max(100),
    confidence: z.number().min(0).max(1),
    stereotypes: z.array(z.string()),
    framing: z.string(),
    missingPerspectives: z.array(z.string())
  }),
  ageFit: z.string(),
  recommendations: z.array(z.string())
})

// KidGPT schemas
export const KidGPTRequestSchema = z.object({
  message: z.string().min(1),
  mode: z.enum(['homework', 'curiosity', 'resilience', 'digital']),
  childId: z.string().cuid(),
  explainLike12: z.boolean().optional()
})

export const KidGPTResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
  citations: z.array(z.object({
    source: z.string(),
    url: z.string().url(),
    excerpt: z.string()
  })).optional(),
  safetyFlags: z.array(z.string()).optional(),
  mode: z.enum(['regular', 'simple'])
})

// Report schemas
export const GenerateReportSchema = z.object({
  childId: z.string().cuid(),
  period: z.enum(['weekly', 'monthly', 'quarterly', 'custom']),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  includeSafety: z.boolean().default(true),
  includeQuality: z.boolean().default(true),
  includeBias: z.boolean().default(true),
  includeScreenTime: z.boolean().default(true)
})

export const ReportResponseSchema = z.object({
  id: z.string(),
  pdfUrl: z.string().url(),
  summary: z.object({
    contentAnalyzed: z.number(),
    safetyScore: z.number(),
    qualityScore: z.number(),
    biasScore: z.number(),
    learningTime: z.number(),
    screenTime: z.number()
  }),
  highlights: z.array(z.string()),
  concerns: z.array(z.string()),
  recommendations: z.array(z.string()),
  generatedAt: z.string().datetime()
})

// Policy schemas
export const PolicySchema = z.object({
  profile: z.record(z.any()),
  retentionDays: z.number().min(1).max(365),
  whitelist: z.array(z.string()),
  graylist: z.array(z.string())
})

export const UpdatePolicySchema = PolicySchema.partial()

// Consent schemas
export const ConsentSchema = z.object({
  scope: z.string(),
  childId: z.string().cuid().optional()
})

// Audit log schemas
export const AuditLogQuerySchema = z.object({
  actorId: z.string().cuid().optional(),
  childId: z.string().cuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  action: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0)
})

// Digest schemas
export const DigestQuerySchema = z.object({
  childId: z.string().cuid(),
  period: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  date: z.string().datetime().optional()
})

export const DigestResponseSchema = z.object({
  period: z.string(),
  childName: z.string(),
  summary: z.object({
    contentAnalyzed: z.number(),
    safetyAlerts: z.number(),
    learningTime: z.number(),
    screenTime: z.number()
  }),
  recentAnalyses: z.array(z.object({
    id: z.string(),
    type: EventTypeSchema,
    title: z.string(),
    safetyScore: z.number(),
    qualityScore: z.number(),
    timestamp: z.string()
  })),
  trends: z.object({
    safetyTrend: z.enum(['improving', 'stable', 'declining']),
    topConcerns: z.array(z.string()),
    positiveHighlights: z.array(z.string())
  }),
  quickActions: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    action: z.string(),
    priority: z.enum(['high', 'medium', 'low'])
  }))
})

// Error response schema
export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  code: z.string().optional(),
  details: z.any().optional()
})

// Success response schema
export const SuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional()
})

// Export types
export type CreateUser = z.infer<typeof CreateUserSchema>
export type LoginUser = z.infer<typeof LoginUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>
export type CreateChild = z.infer<typeof CreateChildSchema>
export type UpdateChild = z.infer<typeof UpdateChildSchema>
export type CreateEvent = z.infer<typeof CreateEventSchema>
export type CreateAnalysis = z.infer<typeof CreateAnalysisSchema>
export type ContentAnalysisRequest = z.infer<typeof ContentAnalysisRequestSchema>
export type ContentAnalysisResponse = z.infer<typeof ContentAnalysisResponseSchema>
export type KidGPTRequest = z.infer<typeof KidGPTRequestSchema>
export type KidGPTResponse = z.infer<typeof KidGPTResponseSchema>
export type GenerateReport = z.infer<typeof GenerateReportSchema>
export type ReportResponse = z.infer<typeof ReportResponseSchema>
export type Policy = z.infer<typeof PolicySchema>
export type UpdatePolicy = z.infer<typeof UpdatePolicySchema>
export type Consent = z.infer<typeof ConsentSchema>
export type AuditLogQuery = z.infer<typeof AuditLogQuerySchema>
export type DigestQuery = z.infer<typeof DigestQuerySchema>
export type DigestResponse = z.infer<typeof DigestResponseSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
export type SuccessResponse = z.infer<typeof SuccessResponseSchema> 