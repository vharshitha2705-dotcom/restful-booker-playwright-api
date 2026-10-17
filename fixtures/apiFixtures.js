const base = require('@playwright/test');
const AuthApi = require('../api/authApi');
const BookingApi = require('../api/bookingApi');
const { validUser } = require('../test-data/credentials');

const test = base.test.extend({
  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },

  authToken: async ({ authApi }, use) => {
    await use(await authApi.getToken(validUser));
  },

  bookingApi: async ({ request, authApi }, use) => {
    const bookingApi = new BookingApi(request);

    await use(bookingApi);

    // Cleanup: deleting every booking this test created and has not already deleted
    const remaining = [...bookingApi.createdIds];
    if (remaining.length > 0) {
      const token = await authApi.getToken(validUser);
      if (!token) {
        throw new Error('Cleanup failed: could not get an auth token');
      }
      for (const id of remaining) {
        await bookingApi.deleteBooking(id, token);
      }
    }
  },
});

module.exports = { test, expect: base.expect };