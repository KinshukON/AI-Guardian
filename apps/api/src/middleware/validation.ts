import { FastifyRequest, FastifyReply } from 'fastify'
import { ZodSchema } from 'zod'

export const validateRequest = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validated = await schema.parseAsync({
        body: request.body,
        query: request.query,
        params: request.params
      })

      // Replace request data with validated data
      request.body = validated.body
      request.query = validated.query
      request.params = validated.params

      return
    } catch (error: any) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: error.errors,
          statusCode: 400
        }
      })
    }
  }
}

export const validateBody = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validated = await schema.parseAsync(request.body)
      request.body = validated
      return
    } catch (error: any) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request body validation failed',
          details: error.errors,
          statusCode: 400
        }
      })
    }
  }
}

export const validateQuery = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validated = await schema.parseAsync(request.query)
      request.query = validated
      return
    } catch (error: any) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Query parameters validation failed',
          details: error.errors,
          statusCode: 400
        }
      })
    }
  }
}

export const validateParams = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validated = await schema.parseAsync(request.params)
      request.params = validated
      return
    } catch (error: any) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'URL parameters validation failed',
          details: error.errors,
          statusCode: 400
        }
      })
    }
  }
} 