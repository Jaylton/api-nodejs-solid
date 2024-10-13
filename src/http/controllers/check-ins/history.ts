import { makeGetUserCheckInsHistoryService } from "@/services/factories/make-get-user-check-ins-service";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function historyController(request: FastifyRequest, reply: FastifyReply) {
    const querySchema = z.object({
        page: z.coerce.number().min(1).default(1),
    });

    const { page } = querySchema.parse(request.query);

    const getUserCheckInsHistoryService = makeGetUserCheckInsHistoryService();

    const { checkIns } = await getUserCheckInsHistoryService.execute({ userId: request.user.sub, page });

    return reply.status(200).send({
        checkIns
    });
}