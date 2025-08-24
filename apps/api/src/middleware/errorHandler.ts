import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export interface ApiError extends FastifyError {
  statusCode?: number
  code?: string
}

export const errorHandler = (
  error: ApiError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal Server Error'
  const code = error.code || 'INTERNAL_ERROR'

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', {
      statusCode,
      message,
      code,
      stack: error.stack,
      url: request.url,
      method: request.method
    })
  }

  // Don't expose internal errors to client
  const clientMessage = statusCode === 500 ? 'Internal Server Error' : message

  reply.status(statusCode).send({
    error: {
      code,
      message: clientMessage,
      statusCode
    }
  })
} 