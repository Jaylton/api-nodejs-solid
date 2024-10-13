import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { ValidateCheckInService } from "../validate-check-in";

export function makeValidateCheckInService() {

    const checkInsRepositoryRepository = new PrismaCheckInsRepository();
    const getUserService = new ValidateCheckInService(checkInsRepositoryRepository);

    return getUserService;
}