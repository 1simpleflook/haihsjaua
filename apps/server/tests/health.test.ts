import { describe, it, expect } from 'vitest';
import { buildApp } from '../src/buildApp.js';

describe('GET /health', () => {
  it('returns ok', async () => {
    const app = await buildApp({ test: true });
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
    await app.close();
  });
});
