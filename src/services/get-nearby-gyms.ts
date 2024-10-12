import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface GetNearbyGymsRequest {
    userLatitude: number;
    userLongitude: number;
}

interface GetNearbyGymsResponse {
    gyms: Gym[];
}

export class GetNearbyGymsService {
    constructor(private gymsRepository: GymsRepository) { }

    async execute({ userLatitude, userLongitude }: GetNearbyGymsRequest): Promise<GetNearbyGymsResponse> {

        const gyms = await this.gymsRepository.findManyNearby(userLatitude, userLongitude)

        return { gyms };
    }
}