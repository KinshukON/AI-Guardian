import { FastifyInstance } from 'fastify'

export async function reportRoutes(fastify: FastifyInstance) {
  fastify.get('/reports', async (request, reply) => {
    return reply.send([])
  })
} 