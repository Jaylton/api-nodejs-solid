
import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { nearbyController } from './nearby';
import { searchController } from './search';
import { createController } from './create';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJwt);

    app.get('/gyms/nearby', nearbyController);
    app.get('/gyms/search', searchController);

    app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, createController);

}