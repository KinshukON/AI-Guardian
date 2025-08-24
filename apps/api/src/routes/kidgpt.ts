import { FastifyInstance } from 'fastify'

export async function kidgptRoutes(fastify: FastifyInstance) {
  fastify.get('/kidgpt', async (request, reply) => {
    return reply.send([])
  })
} 