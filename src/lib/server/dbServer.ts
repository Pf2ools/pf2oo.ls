import { createServer, createTriplitStorageProvider } from '@triplit/server';

export const startServer = await createServer({
  storage: await createTriplitStorageProvider('lmdb'),
  verboseLogs: true,
  jwtSecret: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ4LXRyaXBsaXQtdG9rZW4tdHlwZSI6InNlY3JldCIsIngtdHJpcGxpdC1wcm9qZWN0LWlkIjoibG9jYWwtcHJvamVjdC1pZCJ9.8Z76XXPc9esdlZb2b7NDC7IVajNXKc4eVcPsO7Ve0ug'
});
