import { describe, it, expect, afterEach } from 'vitest';
import { makeTestApp } from './helpers.js';

describe('GET /ledger', () => {
  let cleanup: (() => Promise<void>) | null = null;
  afterEach(async () => { if (cleanup) await cleanup(); cleanup = null; });

  it('public, no auth, returns counters', async () => {
    const ctx = await makeTestApp(); cleanup = ctx.cleanup;
    const res = await ctx.app.inject({ method: 'GET', url: '/ledger' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toMatchObject({
      total_minted: 0, total_transferred: 0, circulating_supply: 0,
      current_difficulty_bits: 8, user_count: 0,
    });
  });
});
