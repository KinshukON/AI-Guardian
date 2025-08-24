import { FastifyInstance } from 'fastify'

export async function userRoutes(fastify: FastifyInstance) {
  // Get current user profile
  fastify.get('/users/me', async (request, reply) => {
    return reply.send({
      id: '1',
      email: 'parent@example.com',
      role: 'parent',
      displayName: 'Sarah Johnson'
    })
  })
} 