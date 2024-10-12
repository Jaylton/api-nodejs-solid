import { Prisma, CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = [];

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            validated_at: data.validated_at ? new Date(data.validated_at) : null,
            created_at: new Date(),
        }

        this.items.push(checkIn);

        return checkIn;
    }

    async findManyByUserId(userId: string, page: number) {
        return this.items.filter(checkIn => checkIn.user_id === userId)
            .slice((page - 1) * 20, page * 20);
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf('date');
        const endOfTheDay = dayjs(date).endOf('date');

        const checkOnSameData = this.items.find(checkIn => {
            const createdAt = dayjs(checkIn.created_at);
            const isOnSameDate = createdAt.isAfter(startOfTheDay) && createdAt.isBefore(endOfTheDay);

            return checkIn.user_id === userId && isOnSameDate;
        }) || null;

        return checkOnSameData;
    }

    async countByUserId(userId: string) {
        return this.items.filter(checkIn => checkIn.user_id === userId).length;
    }

    async findById(checkInId: string) {
        const checkIn = this.items.find(item => item.id === checkInId);

        return checkIn || null;
    }

    async save(checkIn: CheckIn) {
        const index = this.items.findIndex(item => item.id === checkIn.id);

        this.items[index] = checkIn;

        return checkIn;
    }

}