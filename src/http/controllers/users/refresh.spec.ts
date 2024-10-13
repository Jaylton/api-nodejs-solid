import { app } from "@/app";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Refresh token (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    })
    afterAll(async () => {
        await app.close();
    });

    it('should be able to refresh a token', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: "John Doe",
                email: "johndoe@example.com",
                password: "password"
            });

        const authResponse = await request(app.server)
            .post('/sessions')
            .send({
                email: "johndoe@example.com",
                password: "password"
            });

        const cookies = authResponse.get('set-cookie') || '';

        const response = await request(app.server)
            .patch('/token/refresh')
            .set('Cookie', cookies)
            .send();

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
            token: expect.any(String)
        })
        expect(response.get('set-cookie')).toEqual([
            expect.stringContaining('refreshToken=')
        ])
    });
});