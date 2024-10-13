import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Search Gyms (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    })
    afterAll(async () => {
        await app.close();
    });

    it('should be able to search gyms', async () => {
        const { token } = await createAndAuthenticateUser(app);

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Gym Name",
                description: "Gym Address",
                phone: "123456789",
                latitude: -7.8279294,
                longitude: -39.0715685,
            });

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Gym Name 2",
                description: "Gym Address",
                phone: "123456789",
                latitude: -7.8279294,
                longitude: -39.0715685,
            });

        const response = await request(app.server)
            .get('/gyms/search')
            .set('Authorization', `Bearer ${token}`)
            .query({
                q: 'Name 2'
            });


        expect(response.status).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
    });
});