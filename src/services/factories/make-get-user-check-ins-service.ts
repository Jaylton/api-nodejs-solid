import { GetUserCheckInsHistoryService } from "../get-user-check-ins-history";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeGetUserCheckInsHistoryService() {

    const checkInsRepositoryRepository = new PrismaCheckInsRepository();
    const getUserService = new GetUserCheckInsHistoryService(checkInsRepositoryRepository);

    return getUserService;
}