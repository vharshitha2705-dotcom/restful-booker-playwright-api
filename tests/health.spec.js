const { test, expect } = require('@playwright/test');

test('TC_HEALTH_001 - Verify health check endpoint reports the API is running', async ({ request }) => {
  const response = await request.get('/ping');

  expect(response.status()).toBe(201);
  expect(await response.text()).toBe('Created');
});