import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInService } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';

let sut: CheckInService;
let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;

describe('Check-in Service', async () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInService(checkInsRepository, gymsRepository);

        vi.useFakeTimers();

        await gymsRepository.create({
            id: 'gym-id',
            title: 'Gym Name',
            description: 'Gym Description',
            phone: 'Gym Phone',
            latitude: 0,
            longitude: 0,
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to check in', async () => {

        const { checkIn } = await sut.execute({
            userId: 'user-id',
            gymId: 'gym-id',
            userLatitude: 0,
            userLongitude: 0,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date('2021-01-01 10:00:00'));

        await sut.execute({
            userId: 'user-id',
            gymId: 'gym-id',
            userLatitude: 0,
            userLongitude: 0,
        });

        await expect(async () =>
            await sut.execute({
                userId: 'user-id',
                gymId: 'gym-id',
                userLatitude: 0,
                userLongitude: 0,
            })
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);

    });

    it('should be able to check in twice in different days', async () => {
        vi.setSystemTime(new Date('2021-01-01 10:00:00'));

        await sut.execute({
            userId: 'user-id',
            gymId: 'gym-id',
            userLatitude: 0,
            userLongitude: 0,
        });

        vi.setSystemTime(new Date('2021-01-02 10:00:00'));

        const { checkIn } = await sut.execute({
            userId: 'user-id',
            gymId: 'gym-id',
            userLatitude: 0,
            userLongitude: 0,
        });

        expect(checkIn.id).toEqual(expect.any(String));

    });

    it('should not be able to check in on distance gym', async () => {

        gymsRepository.items.push({
            id: 'gym-02',
            title: 'Gym Name',
            latitude: new Decimal(-7.8283293),
            longitude: new Decimal(-39.071593),
            description: 'Gym Description',
            phone: 'Gym Phone',
        });

        expect(async () => {
            return await sut.execute({
                userId: 'user-id',
                gymId: 'gym-id',
                userLatitude: -7.8217924,
                userLongitude: -39.0686429,
            });
        }).rejects.toBeInstanceOf(MaxDistanceError);

    });

    it('should be able to check in on close gym', async () => {

        const gym = await gymsRepository.create({
            title: 'Gym Name',
            description: 'Gym Description',
            phone: 'Gym Phone',
            latitude: -7.8279294,
            longitude: -39.0715685,
        });

        const { checkIn } = await sut.execute({
            userId: 'user-id',
            gymId: gym.id,
            userLatitude: -7.8278848,
            userLongitude: -39.0715624,
        });


        expect(checkIn.id).toEqual(expect.any(String));

    });
})