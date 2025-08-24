import { FastifyInstance } from 'fastify'

export async function childRoutes(fastify: FastifyInstance) {
  // Get children for current user
  fastify.get('/children', async (request, reply) => {
    return reply.send([
      {
        id: '1',
        displayName: 'Emma',
        ageBand: '8-10',
        values: {
          empathy: 85,
          curiosity: 90,
          balancedViews: 75,
          growthMindset: 80
        }
      },
      {
        id: '2',
        displayName: 'Liam',
        ageBand: '11-13',
        values: {
          empathy: 70,
          curiosity: 95,
          balancedViews: 60,
          growthMindset: 85
        }
      }
    ])
  })
} 