import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { validateBody } from '../middleware/validation'

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
})

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    displayName: z.string().min(1),
    role: z.enum(['parent', 'educator', 'teen', 'admin'])
  })
})

export async function authRoutes(fastify: FastifyInstance) {
  // Login endpoint
  fastify.post('/auth/login', {
    preHandler: validateBody(loginSchema),
    handler: async (request, reply) => {
      const { email, password } = request.body as any
      
      // Mock authentication for demo
      if (email === 'parent@example.com' && password === 'demo123') {
        const token = fastify.jwt.sign({
          id: '1',
          email: 'parent@example.com',
          role: 'parent'
        })
        
        return reply.send({
          token,
          user: {
            id: '1',
            email: 'parent@example.com',
            role: 'parent',
            displayName: 'Sarah Johnson'
          }
        })
      }
      
      return reply.status(401).send({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
          statusCode: 401
        }
      })
    }
  })

  // Register endpoint
  fastify.post('/auth/register', {
    preHandler: validateBody(registerSchema),
    handler: async (request, reply) => {
      const { email, password, displayName, role } = request.body as any
      
      // Mock registration for demo
      const token = fastify.jwt.sign({
        id: '2',
        email,
        role
      })
      
      return reply.status(201).send({
        token,
        user: {
          id: '2',
          email,
          role,
          displayName
        }
      })
    }
  })

  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    return reply.send({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'AI Guardian API'
    })
  })
} 