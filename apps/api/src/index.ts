import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'

import { config } from './config'
import { errorHandler } from './middleware/errorHandler'
import { authMiddleware } from './middleware/auth'
import { validateRequest } from './middleware/validation'

// Import routes
import { authRoutes } from './routes/auth'
import { userRoutes } from './routes/users'
import { childRoutes } from './routes/children'
import { eventRoutes } from './routes/events'
import { analysisRoutes } from './routes/analyses'
import { reportRoutes } from './routes/reports'
import { policyRoutes } from './routes/policies'
import { digestRoutes } from './routes/digest'
import { kidgptRoutes } from './routes/kidgpt'

// Import services
import { MLService } from './services/ml'
import { ReportService } from './services/reports'
import { DatabaseService } from './services/database'

export async function createServer() {
  const fastify = Fastify({
    logger: {
      level: config.env === 'development' ? 'info' : 'warn'
    }
  })

  // Register plugins
  await fastify.register(cors, {
    origin: config.corsOrigins,
    credentials: true
  })

  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.openai.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    }
  })

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  })

  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'AI Guardian API',
        description: 'Digital Mentor & Watchdog for Kids API',
        version: '1.0.0'
      },
      host: config.host + ':' + config.port,
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      }
    }
  })

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    }
  })

  await fastify.register(jwt, {
    secret: config.jwtSecret
  })

  await fastify.register(multipart)

  // Register middleware
  fastify.setErrorHandler(errorHandler)
  fastify.addHook('preHandler', validateRequest)

  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  // API routes
  await fastify.register(authRoutes, { prefix: '/api/auth' })
  await fastify.register(userRoutes, { prefix: '/api/users' })
  await fastify.register(childRoutes, { prefix: '/api/children' })
  await fastify.register(eventRoutes, { prefix: '/api/events' })
  await fastify.register(analysisRoutes, { prefix: '/api/analyses' })
  await fastify.register(reportRoutes, { prefix: '/api/reports' })
  await fastify.register(policyRoutes, { prefix: '/api/policies' })
  await fastify.register(digestRoutes, { prefix: '/api/digest' })
  await fastify.register(kidgptRoutes, { prefix: '/api/kidgpt' })

  // Initialize services (mock implementations for demo)
  const dbService = new DatabaseService()
  const mlService = new MLService()
  const reportService = new ReportService()
  
  await dbService.connect()
  
  // Make services available to routes
  fastify.decorate('dbService', dbService)
  fastify.decorate('mlService', mlService)
  fastify.decorate('reportService', reportService)

  return fastify
}

async function start() {
  try {
    const server = await createServer()
    
    await server.listen({
      port: config.port,
      host: config.host
    })

    console.log(`🚀 AI Guardian API server running on http://${config.host}:${config.port}`)
    console.log(`📚 API documentation available at http://${config.host}:${config.port}/docs`)
    
  } catch (err) {
    console.error('Error starting server:', err)
    process.exit(1)
  }
}

// Start server if this file is run directly
if (require.main === module) {
  start()
} 