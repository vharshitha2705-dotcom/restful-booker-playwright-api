const { test, expect } = require('../fixtures/apiFixtures');
const { buildBooking } = require('../utils/bookingData');

test.describe('Booking list API', () => {

  test('TC_BOOKING_LIST_001 - Verify all booking IDs are returned', async ({ bookingApi }) => {
    const response = await bookingApi.getBookingIds();
    expect(response.status()).toBe(200);

    const bookings = await response.json();
    expect(Array.isArray(bookings)).toBeTruthy();
    expect(bookings.length).toBeGreaterThan(0);
    for (const booking of bookings.slice(0, 10)) {
      expect(typeof booking.bookingid).toBe('number');
    }
  });

  test('TC_BOOKING_LIST_002 - Verify bookings can be filtered by first name', async ({ bookingApi }) => {
    const payload = buildBooking();
    const created = await (await bookingApi.createBooking(payload)).json();

    const response = await bookingApi.getBookingIds({ firstname: payload.firstname });
    expect(response.status()).toBe(200);

    const ids = (await response.json()).map(b => b.bookingid);
    expect(ids).toContain(created.bookingid);
  });

  test('TC_BOOKING_LIST_003 - Verify bookings can be filtered by last name', async ({ bookingApi }) => {
    const payload = buildBooking();
    const created = await (await bookingApi.createBooking(payload)).json();

    const response = await bookingApi.getBookingIds({ lastname: payload.lastname });
    expect(response.status()).toBe(200);

    const ids = (await response.json()).map(b => b.bookingid);
    expect(ids).toContain(created.bookingid);
  });

  test('TC_BOOKING_LIST_004 - Verify filtering with no match returns an empty list', async ({ bookingApi }) => {
    const response = await bookingApi.getBookingIds({ firstname: `NoSuchPerson${Date.now()}` });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual([]);
  });
});