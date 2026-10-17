const { test, expect } = require('../fixtures/apiFixtures');
const { buildBooking } = require('../utils/bookingData');

test.describe('Delete booking API', () => {

    test('TC_BOOKING_DELETE_001 - Verify a booking can be deleted with a valid token', async ({ bookingApi, authToken }) => {
        const { bookingid } = await (await bookingApi.createBooking(buildBooking())).json();

        const response = await bookingApi.deleteBooking(bookingid, authToken);

        expect(response.status()).toBe(201);
        const getResponse = await bookingApi.getBooking(bookingid);
        expect(getResponse.status()).toBe(404);
    });

    test('TC_BOOKING_DELETE_002 - Verify delete is rejected without a token', async ({ bookingApi }) => {
        const { bookingid } = await (await bookingApi.createBooking(buildBooking())).json();

        const response = await bookingApi.deleteBooking(bookingid, null);

        expect(response.status()).toBe(403);
        const getResponse = await bookingApi.getBooking(bookingid);
        expect(getResponse.status()).toBe(200);
    });

    test('TC_BOOKING_DELETE_003 - Verify delete is rejected with an invalid token', async ({ bookingApi }) => {
        const { bookingid } = await (await bookingApi.createBooking(buildBooking())).json();

        const response = await bookingApi.deleteBooking(bookingid, 'invalid-token-123');

        expect(response.status()).toBe(403);
        const getResponse = await bookingApi.getBooking(bookingid);
        expect(getResponse.status()).toBe(200);
    });

    test('TC_BOOKING_DELETE_004 - Verify deleting a booking that does not exist returns 404', async ({ bookingApi, authToken }) => {
        test.fail(true, 'Known defect: API returns 405 Method Not Allowed instead of 404 for a missing booking');

        const response = await bookingApi.deleteBooking(99999999, authToken);

        expect(response.status()).toBe(404);
    });
});