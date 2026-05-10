import { PrismaClient, Priority, TaskStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  const websiteProject = await prisma.project.create({
    data: {
      name: 'Website redesign',
      description: 'Refresh the marketing website and improve conversion.',
      tasks: {
        create: [
          {
            title: 'Create landing page wireframe',
            description:
              'Prepare the initial wireframe for the new landing page.',
            status: TaskStatus.TODO,
            priority: Priority.HIGH,
            dueDate: new Date('2026-05-20T10:00:00.000Z'),
          },
          {
            title: 'Implement hero section',
            description: 'Build responsive hero section with CTA buttons.',
            status: TaskStatus.IN_PROGRESS,
            priority: Priority.MEDIUM,
          },
          {
            title: 'Review SEO metadata',
            status: TaskStatus.DONE,
            priority: Priority.LOW,
          },
        ],
      },
    },
  });

  const appProject = await prisma.project.create({
    data: {
      name: 'Mobile app MVP',
      description: 'Prepare MVP features for the mobile app launch.',
      tasks: {
        create: [
          {
            title: 'Define onboarding flow',
            status: TaskStatus.TODO,
            priority: Priority.HIGH,
          },
          {
            title: 'Create API contract',
            status: TaskStatus.IN_PROGRESS,
            priority: Priority.HIGH,
          },
        ],
      },
    },
  });

  console.log({
    message: 'Database seeded successfully.',
    projects: [websiteProject.id, appProject.id],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
