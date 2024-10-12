import { expect, describe, it, beforeEach } from 'vitest';
import { RegisterService } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let sut: RegisterService;

describe('Register Service', async () => {
    beforeEach(() => {
        const usersRepository = new InMemoryUsersRepository();
        sut = new RegisterService(usersRepository);
    });

    it('should be able to register', async () => {

        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'john@mail.com',
            password: '123456'
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should hash user password', async () => {

        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'john@mail.com',
            password: '123456'
        });

        const isPasswordHashed = await compare('123456', user.password_hash || '');
        expect(isPasswordHashed).toBe(true);
    });


    it('should not be able to register with same email twice', async () => {

        const email = 'john@mail.com';

        await sut.execute({
            name: 'John Doe',
            email: email,
            password: '123456'
        });

        await expect(async () => {
            await sut.execute({
                name: 'John Doe',
                email: email,
                password: '123456'
            });
        }).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
})