import { GetUserMetricsService } from "../get-user-metrics";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeGetUserMetricsService() {

    const checkInsRepositoryRepository = new PrismaCheckInsRepository();
    const getUserService = new GetUserMetricsService(checkInsRepositoryRepository);

    return getUserService;
}