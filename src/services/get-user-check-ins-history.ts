import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface GetUserCheckInsHistoryRequest {
    userId: string;
    page?: number;
}

interface GetUserCheckInsHistoryResponse {
    checkIns: CheckIn[];
}

export class GetUserCheckInsHistoryService {
    constructor(
        private readonly checkInsRepository: CheckInsRepository,
    ) { }

    async execute({ userId, page }: GetUserCheckInsHistoryRequest): Promise<GetUserCheckInsHistoryResponse> {

        const checkIns = await this.checkInsRepository.findManyByUserId(userId, page || 1);

        return {
            checkIns,
        }
    }

}