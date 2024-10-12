import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { GetUserMetricsService } from './get-user-metrics';

let sut: GetUserMetricsService;
let checkInsRepository: InMemoryCheckInsRepository;

describe('Get User Metrics', async () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new GetUserMetricsService(checkInsRepository);
    });

    it('should be able to get check-ins count from metrics', async () => {

        await checkInsRepository.create({
            user_id: 'user-id',
            gym_id: 'gym-01'
        });

        await checkInsRepository.create({
            user_id: 'user-id',
            gym_id: 'gym-02'
        });

        const { checkInsCount } = await sut.execute({
            userId: 'user-id'
        });

        expect(checkInsCount).toEqual(2);
    });
})