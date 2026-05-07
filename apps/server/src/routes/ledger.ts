import type { FastifyInstance } from 'fastify';

export async function ledgerRoutes(app: FastifyInstance) {
  app.get('/ledger', async () => {
    const [{ rows: minted }, { rows: transferred }, { rows: circ }, { rows: users }] = await Promise.all([
      app.pool.query<{ n: number }>(`SELECT count(*)::int AS n FROM tokens WHERE parent_token_id IS NULL`),
      app.pool.query<{ n: number }>(`SELECT coalesce(sum(amount),0)::int AS n FROM transfers`),
      app.pool.query<{ n: number }>(`SELECT count(*)::int AS n FROM tokens WHERE state='VALID'`),
      app.pool.query<{ n: number }>(`SELECT count(*)::int AS n FROM users`),
    ]);
    return {
      total_minted: minted[0]!.n,
      total_transferred: transferred[0]!.n,
      circulating_supply: circ[0]!.n,
      current_difficulty_bits: Math.max(app.config.difficultyFloor, app.config.difficultyBits),
      user_count: users[0]!.n,
    };
  });
}
