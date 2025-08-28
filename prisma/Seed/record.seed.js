import { PrismaClient } from "@prisma/client";
import { RECORD } from "../Mock/record.mock.js"

const prisma = new PrismaClient();

export default recordSeed =  async () => {
    const createdGroup = await prisma.group.createMany({})// create a number of record.

    // iterate records , 
    const record = RECORD.map((rec) => {
        const group = createdGroup.find((g) => {rec.groupName === g.name})
        if (!group) throw  new Error(`Group not found for record: ${rec.groupName}`);
        return {
           ...rec,
           groupId: group.id
        }
    })
}