
import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { nearbyController } from './nearby';
import { searchController } from './search';
import { createController } from './create';

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJwt);

    app.get('/gyms/nearby', nearbyController);
    app.get('/gyms/search', searchController);

    app.post('/gyms', createController);

}