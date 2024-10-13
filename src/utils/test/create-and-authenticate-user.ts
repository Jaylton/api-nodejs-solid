import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance, isAdmin: boolean = false) {
    const email = `johndoe@${randomBytes(4).toString('hex')}.com`

    await prisma.user.create({
        data: {
            name: "John Doe",
            email: email,
            password_hash: await hash("password", 6),
            role: isAdmin ? "ADMIN" : "MEMBER"
        }
    });

    const authResponse = await request(app.server)
        .post('/sessions')
        .send({
            email: email,
            password: "password"
        });

    const { token } = authResponse.body;

    return {
        token
    }
}