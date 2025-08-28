import { PrismaClient } from "@prisma/client";
import { GROUP } from "../Mock/group.mock";

const prisma = new PrismaClient();

export default groupSeed = async () => {
    await prisma.group.deleteMany();
    await prisma.group.createMany({
        data: GROUP,
        skipduplicates:true
    })
}