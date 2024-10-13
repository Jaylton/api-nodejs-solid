import { randomUUID } from "node:crypto";
import { Environment } from "vitest/environments";
import 'dotenv/config';
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

function generateDatabaseUrl(schema: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined');
    }

    const url = new URL(process.env.DATABASE_URL);

    url.searchParams.set('schema', schema);

    return url.toString();
}

const prisma = new PrismaClient();

export default <Environment>{
    name: "prisma",
    transformMode: 'ssr',
    async setup() {
        // This is the setup function that will be executed before the tests
        const schema = randomUUID();

        const databaseURL = generateDatabaseUrl(schema);

        process.env.DATABASE_URL = databaseURL;

        execSync('npx prisma migrate deploy')

        return {
            async teardown() {
                await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
                await prisma.$disconnect();
            }
        };
    }
}