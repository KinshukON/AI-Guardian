import { FastifyInstance } from 'fastify'

export async function policyRoutes(fastify: FastifyInstance) {
  fastify.get('/policies', async (request, reply) => {
    return reply.send([])
  })
} 