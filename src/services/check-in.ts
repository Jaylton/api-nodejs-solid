import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

interface CheckInRequest {
    userId: string;
    gymId: string;
    userLatitude: number;
    userLongitude: number;
}

interface CheckInResponse {
    checkIn: CheckIn;
}

export class CheckInService {
    constructor(
        private readonly checkInsRepository: CheckInsRepository,
        private readonly gymsRepository: GymsRepository
    ) { }

    async execute({ userId, gymId, userLatitude, userLongitude }: CheckInRequest): Promise<CheckInResponse> {

        const gym = await this.gymsRepository.findById(gymId);

        if (!gym) {
            throw new ResourceNotFoundError;
        }

        //calculate distance between user and gym
        const distance = getDistanceBetweenCoordinates(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
        )

        const MAX_DISTANCE = 0.1; // 100 meters

        if (distance > MAX_DISTANCE) {
            throw new MaxDistanceError();
        }

        const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

        if (checkInOnSameDate) {
            throw new MaxNumberOfCheckInsError();
        }

        const checkIn = await this.checkInsRepository.create({
            user_id: userId,
            gym_id: gymId,
        });

        return {
            checkIn,
        }
    }

}