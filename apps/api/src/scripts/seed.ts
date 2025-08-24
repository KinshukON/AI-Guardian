import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.auditLog.deleteMany()
  await prisma.consent.deleteMany()
  await prisma.analysis.deleteMany()
  await prisma.event.deleteMany()
  await prisma.summary.deleteMany()
  await prisma.policy.deleteMany()
  await prisma.child.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleaned existing data')

  // Create users
  const parentUser = await prisma.user.create({
    data: {
      email: 'parent@example.com',
      passwordHash: await bcrypt.hash('demo123', 12),
      role: 'PARENT',
      displayName: 'Sarah Johnson',
      mfaEnabled: true,
    },
  })

  const educatorUser = await prisma.user.create({
    data: {
      email: 'teacher@school.edu',
      passwordHash: await bcrypt.hash('demo123', 12),
      role: 'EDUCATOR',
      displayName: 'Ms. Rodriguez',
      mfaEnabled: false,
    },
  })

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@aiguardian.com',
      passwordHash: await bcrypt.hash('admin123', 12),
      role: 'ADMIN',
      displayName: 'System Administrator',
      mfaEnabled: true,
    },
  })

  console.log('👥 Created users')

  // Create children
  const emma = await prisma.child.create({
    data: {
      userId: parentUser.id,
      displayName: 'Emma',
      ageBand: 'AGE_8_10',
      values: {
        empathy: 85,
        curiosity: 90,
        balancedViews: 75,
        growthMindset: 80,
      },
    },
  })

  const liam = await prisma.child.create({
    data: {
      userId: parentUser.id,
      displayName: 'Liam',
      ageBand: 'AGE_11_13',
      values: {
        empathy: 70,
        curiosity: 95,
        balancedViews: 60,
        growthMindset: 85,
      },
    },
  })

  console.log('👶 Created children')

  // Create policies
  await prisma.policy.create({
    data: {
      userId: parentUser.id,
      profile: {
        safetyLevel: 'moderate',
        contentTypes: ['educational', 'entertainment'],
        screenTimeLimits: {
          weekday: 120, // 2 hours
          weekend: 240, // 4 hours
        },
      },
      retentionDays: 30,
      whitelist: ['khanacademy.org', 'nationalgeographic.com'],
      graylist: ['socialmedia.com'],
    },
  })

  console.log('📋 Created policies')

  // Create consents
  await prisma.consent.create({
    data: {
      userId: parentUser.id,
      childId: emma.id,
      scope: 'content_analysis',
    },
  })

  await prisma.consent.create({
    data: {
      userId: parentUser.id,
      childId: liam.id,
      scope: 'content_analysis',
    },
  })

  await prisma.consent.create({
    data: {
      userId: parentUser.id,
      scope: 'data_processing',
    },
  })

  console.log('✅ Created consents')

  // Create sample events
  const events = [
    {
      childId: emma.id,
      userId: parentUser.id,
      type: 'VIDEO',
      source: 'YouTube',
      uri: 'https://youtube.com/watch?v=science_experiment',
      startedAt: new Date('2024-01-15T10:00:00Z'),
      endedAt: new Date('2024-01-15T10:15:00Z'),
      meta: {
        title: 'Science Experiment Tutorial',
        channel: 'Kids Science Lab',
        duration: 900,
      },
    },
    {
      childId: emma.id,
      userId: parentUser.id,
      type: 'CHAT',
      source: 'Homework Helper',
      startedAt: new Date('2024-01-15T14:00:00Z'),
      endedAt: new Date('2024-01-15T14:30:00Z'),
      meta: {
        topic: 'Math homework',
        questions: 5,
        responses: 5,
      },
    },
    {
      childId: liam.id,
      userId: parentUser.id,
      type: 'TEXT',
      source: 'News Article',
      uri: 'https://kidsnews.com/article/space-exploration',
      startedAt: new Date('2024-01-15T16:00:00Z'),
      endedAt: new Date('2024-01-15T16:10:00Z'),
      meta: {
        title: 'Space Exploration for Kids',
        source: 'Kids News',
        readingTime: 600,
      },
    },
    {
      childId: liam.id,
      userId: parentUser.id,
      type: 'VIDEO',
      source: 'TikTok',
      uri: 'https://tiktok.com/@educational_content',
      startedAt: new Date('2024-01-15T18:00:00Z'),
      endedAt: new Date('2024-01-15T18:05:00Z'),
      meta: {
        title: 'Quick Math Tip',
        creator: 'MathTeacher',
        duration: 300,
      },
    },
  ]

  for (const eventData of events) {
    await prisma.event.create({ data: eventData })
  }

  console.log('📱 Created sample events')

  // Create sample analyses
  const analyses = [
    {
      eventId: (await prisma.event.findFirst({ where: { source: 'YouTube' } }))!.id,
      safetyScore: 92,
      qualityScore: 88,
      biasScore: 85,
      bias: {
        stereotypes: [],
        framing: 'Educational and engaging',
        missingPerspectives: ['Could include more diverse scientists'],
        overallScore: 85,
      },
      evidence: {
        snippets: [
          'Content promotes scientific curiosity',
          'Age-appropriate language and concepts',
          'Positive role modeling',
        ],
        sources: ['YouTube', 'Content analysis'],
        confidence: 0.92,
      },
      confidence: 0.88,
    },
    {
      eventId: (await prisma.event.findFirst({ where: { source: 'Homework Helper' } }))!.id,
      safetyScore: 95,
      qualityScore: 85,
      biasScore: 90,
      bias: {
        stereotypes: [],
        framing: 'Supportive and encouraging',
        missingPerspectives: [],
        overallScore: 90,
      },
      evidence: {
        snippets: [
          'Safe homework assistance',
          'Encourages problem-solving',
          'No inappropriate content',
        ],
        sources: ['Chat analysis', 'Safety filters'],
        confidence: 0.95,
      },
      confidence: 0.85,
    },
    {
      eventId: (await prisma.event.findFirst({ where: { source: 'News Article' } }))!.id,
      safetyScore: 78,
      qualityScore: 72,
      biasScore: 82,
      bias: {
        stereotypes: ['Limited gender representation in STEM'],
        framing: 'Generally balanced but could be more inclusive',
        missingPerspectives: ['Diverse cultural perspectives'],
        overallScore: 82,
      },
      evidence: {
        snippets: [
          'Factual information about space',
          'Some complex concepts for age group',
          'Limited representation diversity',
        ],
        sources: ['Content analysis', 'Bias detection'],
        confidence: 0.78,
      },
      confidence: 0.72,
    },
  ]

  for (const analysisData of analyses) {
    await prisma.analysis.create({ data: analysisData })
  }

  console.log('🔍 Created sample analyses')

  // Create sample summaries
  await prisma.summary.create({
    data: {
      childId: emma.id,
      periodStart: new Date('2024-01-08T00:00:00Z'),
      periodEnd: new Date('2024-01-15T23:59:59Z'),
      digest: {
        contentAnalyzed: 45,
        safetyScore: 87,
        qualityScore: 82,
        biasScore: 85,
        learningTime: 320,
        screenTime: 1260,
        highlights: [
          'Increased engagement with educational content',
          'Better safety scores compared to last week',
          'More diverse content consumption',
        ],
        concerns: [
          'Screen time exceeded recommendations on weekends',
          'Some content may be too complex for age group',
        ],
        recommendations: [
          'Set weekend screen time limits',
          'Encourage more offline activities',
          'Monitor content complexity levels',
        ],
      },
      pdfPath: '/reports/emma-weekly-2024-01-15.pdf',
    },
  })

  await prisma.summary.create({
    data: {
      childId: liam.id,
      periodStart: new Date('2024-01-08T00:00:00Z'),
      periodEnd: new Date('2024-01-15T23:59:59Z'),
      digest: {
        contentAnalyzed: 38,
        safetyScore: 91,
        qualityScore: 88,
        biasScore: 79,
        learningTime: 280,
        screenTime: 1080,
        highlights: [
          'Excellent safety scores maintained',
          'Strong learning quality indicators',
          'Good balance of content types',
        ],
        concerns: [
          'Bias detection scores could improve',
          'Limited exposure to diverse perspectives',
        ],
        recommendations: [
          'Introduce more diverse content sources',
          'Discuss media bias and representation',
          'Continue monitoring safety patterns',
        ],
      },
      pdfPath: '/reports/liam-weekly-2024-01-15.pdf',
    },
  })

  console.log('📊 Created sample summaries')

  // Create audit logs
  const auditLogs = [
    {
      actorId: parentUser.id,
      action: 'VIEW_DASHBOARD',
      target: `child:${emma.id}`,
      meta: { timestamp: new Date(), ip: '192.168.1.100' },
    },
    {
      actorId: parentUser.id,
      action: 'GENERATE_REPORT',
      target: `child:${emma.id}`,
      meta: { reportType: 'weekly', timestamp: new Date() },
    },
    {
      actorId: educatorUser.id,
      action: 'VIEW_ANONYMOUS_INSIGHTS',
      target: 'class:grade5',
      meta: { timestamp: new Date(), insights: 'safety_trends' },
    },
  ]

  for (const logData of auditLogs) {
    await prisma.auditLog.create({ data: logData })
  }

  console.log('📝 Created audit logs')

  console.log('✅ Database seeding completed!')
  console.log('\n📋 Sample Data Summary:')
  console.log(`- Users: ${await prisma.user.count()}`)
  console.log(`- Children: ${await prisma.child.count()}`)
  console.log(`- Events: ${await prisma.event.count()}`)
  console.log(`- Analyses: ${await prisma.analysis.count()}`)
  console.log(`- Summaries: ${await prisma.summary.count()}`)
  console.log(`- Policies: ${await prisma.policy.count()}`)
  console.log(`- Consents: ${await prisma.consent.count()}`)
  console.log(`- Audit Logs: ${await prisma.auditLog.count()}`)
  
  console.log('\n🔑 Demo Credentials:')
  console.log('Parent: parent@example.com / demo123')
  console.log('Educator: teacher@school.edu / demo123')
  console.log('Admin: admin@aiguardian.com / admin123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 