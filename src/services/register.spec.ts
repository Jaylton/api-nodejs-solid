import { expect, describe, it } from 'vitest';
import { RegisterService } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('Register Service', async () => {
    it('should be able to register', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const registerService = new RegisterService(usersRepository);

        const { user } = await registerService.execute({
            name: 'John Doe',
            email: 'john@mail.com',
            password: '123456'
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should hash user password', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const registerService = new RegisterService(usersRepository);

        const { user } = await registerService.execute({
            name: 'John Doe',
            email: 'john@mail.com',
            password: '123456'
        });

        const isPasswordHashed = await compare('123456', user.password_hash || '');
        expect(isPasswordHashed).toBe(true);
    });


    it('should not be able to register with same email twice', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const registerService = new RegisterService(usersRepository);

        const email = 'john@mail.com';

        await registerService.execute({
            name: 'John Doe',
            email: email,
            password: '123456'
        });

        await expect(async () => {
            await registerService.execute({
                name: 'John Doe',
                email: email,
                password: '123456'
            });
        }).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
})