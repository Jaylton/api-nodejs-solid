import { expect, describe, it, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateService } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let authenticateService: AuthenticateService;
let usersRepository: InMemoryUsersRepository;

describe('Authenticate Service', async () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        authenticateService = new AuthenticateService(usersRepository);
    });

    it('should be able to authenticate', async () => {

        await usersRepository.create({
            name: 'John Doe',
            email: 'john@mail.com',
            password_hash: await hash('123456', 6)
        });

        const { user } = await authenticateService.execute({
            email: 'john@mail.com',
            password: '123456'
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should not be able to authenticate with wrong email', async () => {

        await expect(async () => {
            await authenticateService.execute({
                email: 'john@mail.com',
                password: '123456'
            });
        }).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('should not be able to authenticate with wrong password', async () => {

        await usersRepository.create({
            name: 'John Doe',
            email: 'john@mail.com',
            password_hash: await hash('123456', 6)
        });

        await expect(async () => {
            await authenticateService.execute({
                email: 'john@mail.com',
                password: '1234567'
            });
        }).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
})