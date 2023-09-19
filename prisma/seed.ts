import { prisma } from "../src/server/db";
import { faker } from "@faker-js/faker";
import { type Prisma } from "@prisma/client";

function createRandomUser(): Prisma.UserCreateInput {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    image: faker.image.avatar(),
  };
}

// Create 10 users.
async function main() {
  const users = Array.from({ length: 10 }, createRandomUser);
  await prisma.user.createMany({
    data: users
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
