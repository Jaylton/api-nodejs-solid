import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

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

        const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(dayjs(checkIn.created_at), 'minutes');

        if (distanceInMinutesFromCheckInCreation > 20) {
            throw new LateCheckInValidationError;
        }

        checkIn.validated_at = new Date();

        await this.checkInsRepository.save(checkIn);

        return {
            checkIn,
        }
    }

}