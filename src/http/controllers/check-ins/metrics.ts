import { makeGetUserMetricsService } from "@/services/factories/make-get-user-metrics-service";
import { FastifyReply, FastifyRequest } from "fastify";

export async function metricsController(request: FastifyRequest, reply: FastifyReply) {

    const getUserUserMetricsService = makeGetUserMetricsService();

    const { checkInsCount } = await getUserUserMetricsService.execute({ userId: request.user.sub });

    return reply.status(200).send({
        checkInsCount
    });
}