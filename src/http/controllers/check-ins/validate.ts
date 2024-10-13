import { makeValidateCheckInService } from "@/services/factories/make-validate-check-in-service";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function validateController(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
        checkInId: z.string().uuid(),
    });

    const { checkInId } = paramsSchema.parse(request.params);

    const validateCheckInService = makeValidateCheckInService();

    await validateCheckInService.execute({ checkInId });

    return reply.status(204).send();
}