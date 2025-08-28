import { PrismaClient } from "@prisma/client"
import { USER } from "../Mock/user.mock"
const prisma = new PrismaClient()

export default userSeed= async () => {
    await prisma.patient.createMany({
        data: USER,
        skipduplicates: true
    })
}