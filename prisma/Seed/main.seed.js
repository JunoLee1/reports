import { PrismaClient } from "@prisma/client";
import {userSeed} from "./user.seed.js"
import{groupSeed} from"./group.seed.js"
import{recordSeed} from"./record.seed.js"
const prisma = new PrismaClient();

const main = async () => {
  await userSeed()
  await groupSeed()
  await recordSeed()
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }).finally(() => {
    prisma.$disconnect();
  });
