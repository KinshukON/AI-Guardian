import { FastifyInstance } from 'fastify'

export async function digestRoutes(fastify: FastifyInstance) {
  fastify.get('/digest', async (request, reply) => {
    return reply.send([])
  })
} 