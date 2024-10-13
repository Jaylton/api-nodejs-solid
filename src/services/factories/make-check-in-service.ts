import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { CheckInService } from "../check-in";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeCheckInService() {

    const checkInsRepositoryRepository = new PrismaCheckInsRepository();
    const gymRepository = new PrismaGymsRepository();
    const getUserService = new CheckInService(checkInsRepositoryRepository, gymRepository);

    return getUserService;
}