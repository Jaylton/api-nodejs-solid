import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { SearchGymsService } from "../search-gyms";

export function makeSearchGymsService() {

    const gymRepository = new PrismaGymsRepository();
    const getUserService = new SearchGymsService(gymRepository);

    return getUserService;
}