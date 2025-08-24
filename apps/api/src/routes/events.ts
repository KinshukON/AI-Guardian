import { FastifyInstance } from 'fastify'

export async function eventRoutes(fastify: FastifyInstance) {
  fastify.get('/events', async (request, reply) => {
    return reply.send([])
  })
} 