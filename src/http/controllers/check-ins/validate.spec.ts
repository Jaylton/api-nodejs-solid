import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Validate Check-In (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    })
    afterAll(async () => {
        await app.close();
    });

    it('should be able to validate check-in', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        const user = await prisma.user.findFirstOrThrow();

        const gym = await prisma.gym.create({
            data: {
                title: "Gym Name",
                description: "Gym Address",
                phone: "123456789",
                latitude: -7.8279294,
                longitude: -39.0715685,
            }
        });

        let checkIn = await prisma.checkIn.create({
            data: {
                user_id: user.id,
                gym_id: gym.id
            }
        });

        const response = await request(app.server)
            .patch(`/check-ins/${checkIn.id}/validate`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -7.8279294,
                longitude: -39.0715685,
            });

        expect(response.status).toEqual(204);
    });
});