import { makeCreateGymService } from "@/services/factories/make-create-gym-service";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createController(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine((value) => Math.abs(value) <= 90),
        longitude: z.number().refine((value) => Math.abs(value) <= 180),
    });

    const { title, description, phone, latitude, longitude } = bodySchema.parse(request.body);

    const createGymService = makeCreateGymService();

    const { gym } = await createGymService.execute({ title, description, phone, latitude, longitude });

    return reply.status(201).send({
        gym
    });
}