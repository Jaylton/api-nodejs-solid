import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { GetUserCheckInsHistoryService } from './get-user-check-ins-history';

let sut: GetUserCheckInsHistoryService;
let checkInsRepository: InMemoryCheckInsRepository;

describe('Get User Check-ins History', async () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new GetUserCheckInsHistoryService(checkInsRepository);
    });

    it('should be able to fetch check-in history', async () => {

        await checkInsRepository.create({
            user_id: 'user-id',
            gym_id: 'gym-01'
        });

        await checkInsRepository.create({
            user_id: 'user-id',
            gym_id: 'gym-02'
        });

        const { checkIns } = await sut.execute({
            userId: 'user-id'
        });

        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-01' }),
            expect.objectContaining({ gym_id: 'gym-02' }),
        ]);
    });

    it('should be able to fetch paginated check-in history', async () => {

        for (let i = 0; i < 22; i++) {
            await checkInsRepository.create({
                user_id: 'user-id',
                gym_id: `gym-${i}`
            });
        }

        const { checkIns } = await sut.execute({
            userId: 'user-id',
            page: 2
        });

        expect(checkIns).toHaveLength(2);
    });
})