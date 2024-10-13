import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";
import { makeRegisterService } from "@/services/factories/make-register-service";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        name: z.string(),
        password: z.string(),
        email: z.string().email(),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    try {
        const registerService = makeRegisterService();

        await registerService.execute({ name, email, password });
    } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
            return reply.status(409).send({
                message: err.message
            });
        }

        throw err;
    }

    return reply.status(201).send();
}