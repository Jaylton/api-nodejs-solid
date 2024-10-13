import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Create Check-In (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    })
    afterAll(async () => {
        await app.close();
    });

    it('should be able to make check-in', async () => {
        const { token } = await createAndAuthenticateUser(app);

        const gymResponse = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Gym Name",
                description: "Gym Address",
                phone: "123456789",
                latitude: -7.8279294,
                longitude: -39.0715685,
            });

        const response = await request(app.server)
            .post(`/gyms/${gymResponse.body.gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -7.8279294,
                longitude: -39.0715685,
            });

        expect(response.status).toEqual(201);
    });

    it('should not be able to make check-in on distance gym', async () => {
        const { token } = await createAndAuthenticateUser(app);

        const gymResponse = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Gym Name",
                description: "Gym Address",
                phone: "123456789",
                latitude: -7.0279294,
                longitude: -39.0715685,
            });

        const response = await request(app.server)
            .post(`/gyms/${gymResponse.body.gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -7.8279294,
                longitude: -39.0715685,
            });

        expect(response.status).toEqual(400);
    });
});