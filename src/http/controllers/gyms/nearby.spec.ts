import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Nearby Gyms (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    })
    afterAll(async () => {
        await app.close();
    });

    it('should be able to list nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app);

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Gym Name',
                description: 'Gym Description',
                phone: 'Gym Phone',
                latitude: -7.8279294,
                longitude: -39.0715685,
            });

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({ // more than 10km away
                title: 'Gym example 3',
                description: 'Gym Description 3',
                phone: 'Gym Phone',
                latitude: -7.6001141,
                longitude: -38.9753588,
            });

        const response = await request(app.server)
            .get('/gyms/nearby')
            .set('Authorization', `Bearer ${token}`)
            .query({
                latitude: -7.8278848,
                longitude: -39.0715624
            });

        expect(response.status).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
    });
});