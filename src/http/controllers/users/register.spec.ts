import { app } from "@/app";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Register (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    })
    afterAll(async () => {
        await app.close();
    });

    it('should register a new user', async () => {
        const response = await request(app.server)
            .post('/users')
            .send({
                name: "John Doe",
                email: "johndoe@example.com",
                password: "password"
            });

        expect(response.status).toBe(201);
    });
});