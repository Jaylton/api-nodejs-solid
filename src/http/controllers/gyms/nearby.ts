import { makeGetNearbyGymsService } from "@/services/factories/make-get-nearby-gyms-service";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function nearbyController(request: FastifyRequest, reply: FastifyReply) {
    const querySchema = z.object({
        latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
        longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
    });

    const { latitude, longitude } = querySchema.parse(request.query);

    const getNearbyGymsService = makeGetNearbyGymsService();

    const { gyms } = await getNearbyGymsService.execute({ userLatitude: latitude, userLongitude: longitude });

    return reply.status(200).send({
        gyms
    });
}