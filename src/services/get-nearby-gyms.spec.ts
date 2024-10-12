import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { GetNearbyGymsService } from './get-nearby-gyms';

let sut: GetNearbyGymsService;
let gymsRepository: InMemoryGymsRepository;

describe('Get Nearby Gyms', async () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new GetNearbyGymsService(gymsRepository);
    });

    it('should be able to fetch nearby gyms', async () => {

        await gymsRepository.create({
            title: 'Gym Name',
            description: 'Gym Description',
            phone: 'Gym Phone',
            latitude: -7.8279294,
            longitude: -39.0715685,
        });

        await gymsRepository.create({
            title: 'Gym example 2',
            description: 'Gym Description 2',
            phone: 'Gym Phone',
            latitude: -7.8290943,
            longitude: -39.0737588,
        });

        await gymsRepository.create({ // more than 10km away
            title: 'Gym example 3',
            description: 'Gym Description 3',
            phone: 'Gym Phone',
            latitude: -7.6001141,
            longitude: -38.9753588,
        });

        const { gyms } = await sut.execute({ userLatitude: -7.8278848, userLongitude: -39.0715624 });

        expect(gyms).toHaveLength(2);
    });
})