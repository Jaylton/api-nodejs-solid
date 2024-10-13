
import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { createController } from './create';
import { validateController } from './validate';
import { historyController } from './history';
import { metricsController } from './metrics';

export async function checkInsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJwt);

    app.get('/gyms/history', historyController)
    app.get('/gyms/metrics', metricsController)

    app.post('/gyms/:gymId/check-ins', createController)
    app.patch('/check-ins/:checkInId/validate', validateController)
}