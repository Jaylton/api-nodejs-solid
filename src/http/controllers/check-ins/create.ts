import { MaxDistanceError } from "@/services/errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "@/services/errors/max-number-of-check-ins-error";
import { makeCheckInService } from "@/services/factories/make-check-in-service";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createController(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
        gymId: z.string().uuid(),
    });

    const bodySchema = z.object({
        latitude: z.number().refine((value) => Math.abs(value) <= 90),
        longitude: z.number().refine((value) => Math.abs(value) <= 180),
    });

    const { gymId } = paramsSchema.parse(request.params);
    const { latitude, longitude } = bodySchema.parse(request.body);

    try {
        const createCheckInService = makeCheckInService();

        await createCheckInService.execute({ gymId, userId: request.user.sub, userLatitude: latitude, userLongitude: longitude });

        return reply.status(201).send();

    } catch (err) {
        if (err instanceof MaxDistanceError || err instanceof MaxNumberOfCheckInsError) {
            return reply.status(400).send({
                message: err.message
            });
        }

        throw err;
    }
}