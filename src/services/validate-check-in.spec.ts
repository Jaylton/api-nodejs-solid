import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckInService } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

let sut: ValidateCheckInService;
let checkInsRepository: InMemoryCheckInsRepository;

describe('Validate Check-in Service', async () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new ValidateCheckInService(checkInsRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

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

    it('should not be able to validate the check after 20 minutes', async () => {

        vi.setSystemTime(new Date('2022-01-01T12:00:00'));

        const createdCheckIn = await checkInsRepository.create({
            user_id: 'user-id',
            gym_id: 'gym-id',
            validated_at: null,
        });

        vi.advanceTimersByTime(21 * 60 * 1000); // 21 minutes

        expect(async () =>
            await sut.execute({
                checkInId: createdCheckIn.id,
            })
        ).rejects.toBeInstanceOf(LateCheckInValidationError);

    });
})