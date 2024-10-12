export class ResourceNotFoundError extends Error {
    constructor() {
        super('Not found');
        this.name = 'ResourceNotFoundError';
    }
}