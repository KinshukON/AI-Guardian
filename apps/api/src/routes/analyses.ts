import { FastifyInstance } from 'fastify'

export async function analysisRoutes(fastify: FastifyInstance) {
  fastify.get('/analyses', async (request, reply) => {
    return reply.send([])
  })
} 