const { test, expect } = require('../fixtures/apiFixtures');
const { buildBooking } = require('../utils/bookingData');

test.describe('Get booking API', () => {

  test('TC_BOOKING_GET_001 - Verify booking details match the created booking', async ({ bookingApi }) => {
    const payload = buildBooking();
    const { bookingid } = await (await bookingApi.createBooking(payload)).json();

    const response = await bookingApi.getBooking(bookingid);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(payload);
  });

  test('TC_BOOKING_GET_002 - Verify 404 is returned for a booking that does not exist', async ({ bookingApi }) => {
    const response = await bookingApi.getBooking(99999999);

    expect(response.status()).toBe(404);
  });

  test('TC_BOOKING_GET_003 - Verify booking response has the expected fields and data types', async ({ bookingApi }) => {
    const { bookingid } = await (await bookingApi.createBooking(buildBooking())).json();

    const body = await (await bookingApi.getBooking(bookingid)).json();

    expect(typeof body.firstname).toBe('string');
    expect(typeof body.lastname).toBe('string');
    expect(typeof body.totalprice).toBe('number');
    expect(typeof body.depositpaid).toBe('boolean');
    expect(body.bookingdates.checkin).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(body.bookingdates.checkout).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});