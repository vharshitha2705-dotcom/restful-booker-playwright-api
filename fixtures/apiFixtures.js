const base = require('@playwright/test');
const AuthApi = require('../api/authApi');
const BookingApi = require('../api/bookingApi');
const { validUser } = require('../test-data/credentials');

const test = base.test.extend({
  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },

  bookingApi: async ({ request, authApi }, use) => {
    const bookingApi = new BookingApi(request);

    await use(bookingApi);

    // Cleanup
    if (bookingApi.createdIds.length > 0) {
      const token = await authApi.getToken(validUser);
      for (const id of bookingApi.createdIds) {
        await bookingApi.deleteBooking(id, token);
      }
    }
  },
});

module.exports = { test, expect: base.expect };