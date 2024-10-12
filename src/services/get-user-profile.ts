import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found";

interface GetUserProfileRequest {
    userId: string;
}

interface GetUserProfileResponse {
    user: User;
}

export class GetUserProfileService {
    constructor(
        private readonly usersRepository: UsersRepository,
    ) { }

    async execute({ userId }: GetUserProfileRequest): Promise<GetUserProfileResponse> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError;
        }

        return {
            user,
        }
    }

}