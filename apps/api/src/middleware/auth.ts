import { FastifyRequest, FastifyReply } from 'fastify'
import { config } from '../config'

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string
    email: string
    role: string
  }
}

export const authMiddleware = async (
  request: AuthenticatedRequest,
  reply: FastifyReply
) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return reply.status(401).send({
        error: {
          code: 'UNAUTHORIZED',
          message: 'No token provided',
          statusCode: 401
        }
      })
    }

    // Verify JWT token
    const decoded = await request.jwtVerify(token)
    request.user = decoded as any

    return
  } catch (error) {
    return reply.status(401).send({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
        statusCode: 401
      }
    })
  }
}

export const requireRole = (allowedRoles: string[]) => {
  return async (request: AuthenticatedRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
          statusCode: 401
        }
      })
    }

    if (!allowedRoles.includes(request.user.role)) {
      return reply.status(403).send({
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
          statusCode: 403
        }
      })
    }

    return
  }
} 