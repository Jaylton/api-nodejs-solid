import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { GetNearbyGymsService } from "../get-nearby-gyms";

export function makeGetNearbyGymsService() {

    const gymRepository = new PrismaGymsRepository();
    const getUserService = new GetNearbyGymsService(gymRepository);

    return getUserService;
}