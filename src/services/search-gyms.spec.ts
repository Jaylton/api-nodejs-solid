import { expect, describe, it, beforeEach } from 'vitest';
import { SearchGymsService } from './search-gyms';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let sut: SearchGymsService;
let gymsRepository: InMemoryGymsRepository;

describe('Search Gyms', async () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymsService(gymsRepository);
    });

    it('should be able to fetch search for gyms', async () => {

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
            latitude: -7.8279294,
            longitude: -39.0715685,
        });

        const { gyms } = await sut.execute({ query: 'example', page: 1 });

        expect(gyms).toHaveLength(1);
    });

    it('should be able to fetch paginated gyms', async () => {

        for (let i = 0; i < 22; i++) {
            await gymsRepository.create({
                id: `gym-${i}`,
                title: `Gym example ${i}`,
                description: 'Gym Description 2',
                phone: 'Gym Phone',
                latitude: -7.8279294,
                longitude: -39.0715685,
            });
        }

        const { gyms } = await sut.execute({
            query: 'example',
            page: 2
        });

        expect(gyms).toHaveLength(2);
    });
})