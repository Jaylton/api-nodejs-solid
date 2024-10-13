import { Gym, Prisma } from "@prisma/client";
import { GymsRepository } from "../gyms-repository";
import { prisma } from "@/lib/prisma";

export class PrismaGymsRepository implements GymsRepository {
    async searchMany(query: string, page: number): Promise<Gym[]> {
        const gyms = await prisma.gym.findMany({
            where: {
                title: {
                    contains: query
                }
            },
            skip: (page - 1) * 20,
            take: 20
        });

        return gyms;
    }
    async findManyNearby(userLatitude: number, userLongitude: number): Promise<Gym[]> {
        const gyms = await prisma.$queryRaw<Gym[]>`
            SELECT * FROM gyms
            WHERE (
            6371 * ACOS(
                COS(RADIANS(${userLatitude})) * COS(RADIANS(latitude)) *
                COS(RADIANS(longitude) - RADIANS(${userLongitude})) +
                SIN(RADIANS(${userLatitude})) * SIN(RADIANS(latitude))
            )
        ) < 0.1;
        `

        return gyms;
    }
    async create(data: Prisma.GymCreateInput) {
        const gym = await prisma.gym.create({
            data
        });

        return gym;
    }
    async findById(gymId: string) {
        return await prisma.gym.findUnique({
            where: {
                id: gymId
            }
        });
    }
}