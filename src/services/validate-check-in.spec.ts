import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckInService } from './validate-check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';
import { ResourceNotFoundError } from './errors/resource-not-found';

let sut: ValidateCheckInService;
let checkInsRepository: InMemoryCheckInsRepository;

describe('Validate Check-in Service', async () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new ValidateCheckInService(checkInsRepository);

        // vi.useFakeTimers();
    });

    // afterEach(() => {
    //     vi.useRealTimers();
    // });

    it('should be able to validate the check-in', async () => {

        const createdCheckIn = await checkInsRepository.create({
            user_id: 'user-id',
            gym_id: 'gym-id',
            validated_at: null,
        });


        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id,
        });

        expect(checkIn.id).toEqual(createdCheckIn.id);
        expect(checkIn.validated_at).toEqual(expect.any(Date));
    });

    it('should not be able to validate an inexistent check-in', async () => {

        expect(async () =>
            await sut.execute({
                checkInId: 'invalid-check-in-id',
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
})