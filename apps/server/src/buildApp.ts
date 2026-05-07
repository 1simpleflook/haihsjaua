import Fastify, { type FastifyInstance } from 'fastify';

export interface BuildAppOptions { test?: boolean }

export async function buildApp(opts: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({
    logger: opts.test ? false : { level: 'info' },
    disableRequestLogging: !!opts.test,
  });

  app.get('/health', async () => ({ ok: true }));

  return app;
}
