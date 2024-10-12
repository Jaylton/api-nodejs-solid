import { Gym, Prisma } from "@prisma/client";
import { GymsRepository } from "../gyms-repository";
import { randomUUID } from "node:crypto";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymsRepository implements GymsRepository {
    public items: Gym[] = [];

    async findById(gymId: string) {
        const gym = this.items.find(gym => gym.id === gymId);

        return gym || null;
    }

    async create(data: Prisma.GymCreateInput) {
        const gym = {
            id: data.id ?? randomUUID(),
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            latitude: new Prisma.Decimal(data.latitude.toString()),
            longitude: new Prisma.Decimal(data.longitude.toString()),
            created_at: new Date(),
        }

        this.items.push(gym);

        return gym;
    }

    async searchMany(query: string, page: number) {
        return this.items.filter(gym => gym.title.includes(query)).slice((page - 1) * 20, page * 20);
    }

    async findManyNearby(userLatitude: number, userLongitude: number) {
        return this.items.filter(gym => {
            const distance = getDistanceBetweenCoordinates({
                latitude: gym.latitude.toNumber(),
                longitude: gym.longitude.toNumber()
            }, {
                latitude: userLatitude,
                longitude: userLongitude
            });

            return distance < 10;
        });
    }
}