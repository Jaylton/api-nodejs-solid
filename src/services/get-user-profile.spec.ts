import { expect, describe, it, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { GetUserProfileService } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-found';

let sut: GetUserProfileService;
let usersRepository: InMemoryUsersRepository;

describe('Get User Profile Service', async () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileService(usersRepository);
    });

    it('should be able to get user profile', async () => {

        const createdUser = await usersRepository.create({
            name: 'John Doe',
            email: 'john@mail.com',
            password_hash: await hash('123456', 6)
        });

        const { user } = await sut.execute({
            userId: createdUser.id
        });

        expect(user.id).toEqual(createdUser.id);
    });

    it('should not be able to get user profile with wrong id', async () => {
        await expect(async () => {
            await sut.execute({
                userId: 'wrong-id'
            });
        }).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
})