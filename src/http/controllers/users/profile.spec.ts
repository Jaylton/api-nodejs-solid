import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Profile (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    })
    afterAll(async () => {
        await app.close();
    });

    it('should be able to get user profile', async () => {
        const { token } = await createAndAuthenticateUser(app);

        const response = await request(app.server)
            .get('/me')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(200);
        expect(response.body.user).toEqual(
            expect.objectContaining({
                name: "John Doe",
                email: "johndoe@example.com",
            }));
    });
});