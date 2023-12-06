import { PrismaClient } from "@prisma/client";
import { add } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  // await prisma.user.deleteMany()
  // await prisma.userPreference.deleteMany()
  // // // await prisma.userPreference.deleteMany()
  // // const createdUser = await prisma.user.create({
  // //     data: {
  // //         name: "hazem",
  // //         email: "kyle@test.com",
  // //         age: 27,
  // //         userPreference: {
  // //             connect: {
  // //                 id: ""
  // //             }

  // //         },

  // //     },
  // // include: {
  // //     userPreference: true
  // // }
  // //     select: {
  // //         name: true
  // //     }

  // // })

  // // await prisma.user.deleteMany()
  // // // await prisma.userPreference.deleteMany()
  // // const user = await prisma.user.createMany({
  // //     data: [
  // //         { name: "hazem", email: "hazem@g.com", age: 30, },
  // //         { name: "ali", email: "ali@g.com", age: 30, },
  // //     ]
  // // })

  // // const user = await prisma.user.findUnique({
  // //     where: {
  // //         email: "ali@g.com"
  // //     },
  // // })

  // // const user = await prisma.user.findFirst({
  // //     where: {
  // //         name: "hazem"
  // //     },
  // // })
  // // console.log(user);

  // await prisma.testResult.deleteMany({})
  // await prisma.courseEnrollment.deleteMany({})
  // await prisma.test.deleteMany({})
  // await prisma.user.deleteMany({})
  // await prisma.course.deleteMany({})
  const grace = await prisma.user.create({
    data: {
      email: "hazem@g.com",
      firstName: "hazem",
      lastName: "smawy",
      social: {
        facebook: "gracebell",
        twitter: "therealgracebell",
      },
    },
  });

  const weekFromNow = add(new Date(), { days: 7 });
  const twoWeekFromNow = add(new Date(), { days: 14 });
  const monthFromNow = add(new Date(), { days: 28 });

  const course = await prisma.course.create({
    data: {
      name: "CRUD with Prisma",
      tests: {
        create: [
          {
            date: weekFromNow,
            name: "First test",
          },
          {
            date: twoWeekFromNow,
            name: "Second test",
          },
          {
            date: monthFromNow,
            name: "Final exam",
          },
        ],
      },
      members: {
        create: {
          role: "TEACHER",
          user: {
            connect: {
              email: grace.email,
            },
          },
        },
      },
    },
    include: {
      tests: true,
    },
  });

  const shakuntala = await prisma.user.create({
    data: {
      email: "devi@prisma.io",
      firstName: "Shakuntala",
      lastName: "Devi",
      courses: {
        create: {
          role: "STUDENT",
          course: {
            connect: { id: course.id },
          },
        },
      },
    },
  });

  const david = await prisma.user.create({
    data: {
      email: "david@prisma.io",
      firstName: "David",
      lastName: "Deutsch",
      courses: {
        create: {
          role: "STUDENT",
          course: {
            connect: { id: course.id },
          },
        },
      },
    },
  });

  const testResult = await prisma.testResult.create({
    data: {
      gradedBy: {
        connect: { email: grace.email },
      },
      student: {
        connect: { email: shakuntala.email },
      },
      test: {
        connect: { id: course.tests[0].id },
      },
      result: 950,
    },
    include: {
      student: true,
      test: true,
      gradedBy: true,
    },
  });

  const testResultsDavid = [650, 900, 950];
  const testResultsShakuntala = [800, 950, 910];

  let counter = 0;
  for (const test of course.tests) {
    await prisma.testResult.create({
      data: {
        gradedBy: {
          connect: { email: grace.email },
        },
        student: {
          connect: { email: shakuntala.email },
        },
        test: {
          connect: { id: test.id },
        },
        result: testResultsShakuntala[counter],
      },
    });

    await prisma.testResult.create({
      data: {
        gradedBy: {
          connect: { email: grace.email },
        },
        student: {
          connect: { email: david.email },
        },
        test: {
          connect: { id: test.id },
        },
        result: testResultsDavid[counter],
      },
    });

    counter++;
  }

  for (const test of course.tests) {
    const results = await prisma.testResult.aggregate({
      where: {
        testId: test.id,
      },
      _avg: { result: true },
      _max: { result: true },
      _min: { result: true },
      _count: true,
    });
    console.log(`test: ${test.name} (id: ${test.id})`, results);
  }

  // Get aggregates for David
  const davidAggregates = await prisma.testResult.aggregate({
    where: {
      student: { email: david.email },
    },
    _avg: { result: true },
    _max: { result: true },
    _min: { result: true },
    _count: true,
  });
  console.log(`David's results (email: ${david.email})`, davidAggregates);

  // Get aggregates for Shakuntala
  const shakuntalaAggregates = await prisma.testResult.aggregate({
    where: {
      student: { email: shakuntala.email },
    },
    _avg: { result: true },
    _max: { result: true },
    _min: { result: true },
    _count: true,
  });
  console.log(
    `Shakuntala's results (email: ${shakuntala.email})`,
    shakuntalaAggregates
  );
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const hello: string = "hello";
const hazem: string = "three four";
