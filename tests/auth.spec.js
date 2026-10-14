const { test, expect } = require('@playwright/test');
const { validUser } = require('../test-data/credentials');

test.describe('Auth API', () => {

  test('TC_AUTH_001 - Verify valid credentials return an access token', async ({ request }) => {
    const response = await request.post('/auth', { data: validUser });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  const negativeCases = [
    { id: 'TC_AUTH_002', title: 'wrong password', data: { username: 'admin', password: 'wrongpass' } },
    { id: 'TC_AUTH_003', title: 'wrong username', data: { username: 'wronguser', password: 'password123' } },
    { id: 'TC_AUTH_004', title: 'missing password', data: { username: 'admin' } },
  ];

  for (const c of negativeCases) {
    test(`${c.id} - Verify no token is returned for ${c.title}`, async ({ request }) => {
      const response = await request.post('/auth', { data: c.data });

      expect(response.status()).toBe(200);
      const body = await response.json();

      expect(body.token).toBeUndefined();
      expect(body.reason).toBe('Bad credentials');
    });
  }
});