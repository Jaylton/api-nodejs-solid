import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

interface ValidateCheckInRequest {
    checkInId: string;
}

interface ValidateCheckInResponse {
    checkIn: CheckIn;
}

export class ValidateCheckInService {
    constructor(
        private readonly checkInsRepository: CheckInsRepository
    ) { }

    async execute({ checkInId }: ValidateCheckInRequest): Promise<ValidateCheckInResponse> {

        const checkIn = await this.checkInsRepository.findById(checkInId);

        if (!checkIn) {
            throw new ResourceNotFoundError;
        }

        checkIn.validated_at = new Date();

        await this.checkInsRepository.save(checkIn);

        return {
            checkIn,
        }
    }

}