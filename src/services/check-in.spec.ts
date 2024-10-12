import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInService } from './check-in';

let sut: CheckInService;

describe('Register Service', async () => {
    beforeEach(() => {
        const checkInsRepository = new InMemoryCheckInsRepository();
        sut = new CheckInService(checkInsRepository);
    });

    it('should be able to check in', async () => {

        const { checkIn } = await sut.execute({
            userId: 'user-id',
            gymId: 'gym-id',
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });
})