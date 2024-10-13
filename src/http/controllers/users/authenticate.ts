import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { makeAuthenticateService } from "@/services/factories/make-authenticate-service";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticateController(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        password: z.string(),
        email: z.string().email(),
    });

    const { email, password } = bodySchema.parse(request.body);

    try {
        const authenticateService = makeAuthenticateService();

        const { user } = await authenticateService.execute({ email, password });

        const token = await reply.jwtSign(
            {
                role: user.role,
            },
            {
                sign: {
                    sub: user.id
                }
            })

        const refreshToken = await reply.jwtSign(
            {
                role: user.role,
            },
            {
                sign: {
                    sub: user.id,
                    expiresIn: '7d'
                }
            })

        return reply
            .setCookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/',
                secure: true,
                sameSite: true,
            })
            .status(200)
            .send({ token });

    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return reply.status(400).send({
                message: err.message
            });
        }

        throw err;
    }

}