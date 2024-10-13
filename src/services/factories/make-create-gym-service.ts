import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CreateGymService } from "../create-gym";

export function makeCreateGymService() {

    const gymRepository = new PrismaGymsRepository();
    const getUserService = new CreateGymService(gymRepository);

    return getUserService;
}