import { expect, describe, it, beforeEach } from 'vitest';
import { CreateGymService } from './create-gym';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let sut: CreateGymService;
let gymsRepository: InMemoryGymsRepository;

describe('CreateGym Service', async () => {
    beforeEach(() => {
        const gymsRepository = new InMemoryGymsRepository();
        sut = new CreateGymService(gymsRepository);
    });

    it('should be able to register', async () => {

        const { gym } = await sut.execute({
            title: 'Gym Name',
            description: 'Gym Description',
            phone: 'Gym Phone',
            latitude: -7.8279294,
            longitude: -39.0715685,
        });

        expect(gym.id).toEqual(expect.any(String));
    });
})