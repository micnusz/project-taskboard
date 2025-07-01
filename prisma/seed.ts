import { Prisma, PrismaClient } from "./prisma";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@prisma.io",
    role: "MANAGER",
    tasks: {
      create: [
        {
          title: "Task001",
          slug: "task001",
          description: "Added new sidebar UI",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          type: "ENHANCEMENT",
        },
        {
          title: "Task002",
          slug: "task002",
          description: "Fix login flow bug",
          status: "TODO",
          priority: "HIGH",
          type: "BUG",
        },
        {
          title: "Task003",
          slug: "task003",
          description: "Prepare marketing campaign",
          status: "DONE",
          priority: "LOW",
          type: "OTHER",
        },
        {
          title: "Task004",
          slug: "task004",
          description: "Refactor payment module",
          status: "IN_PROGRESS",
          priority: "HIGH",
          type: "ENHANCEMENT",
        },
        {
          title: "Task005",
          slug: "task005",
          description: "Write unit tests for API",
          status: "CANCELED",
          priority: "MEDIUM",
          type: "DOCUMENTATION",
        },
        {
          title: "Task006",
          slug: "task006",
          description: "Update documentation",
          status: "TODO",
          priority: "LOW",
          type: "DOCUMENTATION",
        },
      ],
    },
  },
  {
    name: "Bob",
    email: "bob@prisma.io",
    role: "ADMIN",
    tasks: {
      create: [
        {
          title: "Task007",
          slug: "task101",
          description: "Design new landing page",
          status: "TODO",
          priority: "HIGH",
          type: "ENHANCEMENT",
        },
        {
          title: "Task008",
          slug: "task102",
          description: "Fix navbar responsiveness",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          type: "BUG",
        },
        {
          title: "Task009",
          slug: "task103",
          description: "Optimize database queries",
          status: "DONE",
          priority: "HIGH",
          type: "ENHANCEMENT",
        },
      ],
    },
  },
  {
    name: "Michal",
    email: "michal@prisma.io",
    role: "USER",
    tasks: {
      create: [
        {
          title: "Task010",
          slug: "task201",
          description: "Setup CI/CD pipeline",
          status: "TODO",
          priority: "HIGH",
          type: "FEATURE",
        },
        {
          title: "Task011",
          slug: "task202",
          description: "Improve logging system",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          type: "ENHANCEMENT",
        },
        {
          title: "Task012",
          slug: "task203",
          description: "Fix bug in notification module",
          status: "TODO",
          priority: "HIGH",
          type: "BUG",
        },
      ],
    },
  },
  {
    name: "Patric",
    email: "patric@prisma.io",
    role: "USER",
    tasks: {
      create: [
        {
          title: "Task013",
          slug: "task301",
          description: "Draft API documentation",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          type: "DOCUMENTATION",
        },
        {
          title: "Task014",
          slug: "task302",
          description: "Refactor auth logic",
          status: "DONE",
          priority: "HIGH",
          type: "ENHANCEMENT",
        },
        {
          title: "Task015",
          slug: "task303",
          description: "Test new payment gateway",
          status: "TODO",
          priority: "LOW",
          type: "FEATURE",
        },
      ],
    },
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
