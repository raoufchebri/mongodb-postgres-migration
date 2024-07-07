import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './schema.ts',
  dialect: 'postgresql',
  out: './drizzle',
  dbCredentials: {
    url: process.env.POSTGRES_CONNECTION_URI as string,
  },
  verbose: true,
  strict: true,
});
