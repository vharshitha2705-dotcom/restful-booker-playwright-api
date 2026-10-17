const { test, expect } = require('../fixtures/apiFixtures');
const { buildBooking } = require('../utils/bookingData');

test.describe('Update booking API (PUT)', () => {

    test('TC_BOOKING_UPDATE_001 - Verify a booking can be fully updated with a valid token', async ({ bookingApi, authToken }) => {
        const { bookingid } = await (await bookingApi.createBooking(buildBooking())).json();
        const updated = buildBooking({ totalprice: 999, additionalneeds: 'Dinner' });

        const response = await bookingApi.updateBooking(bookingid, updated, authToken);

        expect(response.status()).toBe(200);
        expect(await response.json()).toEqual(updated);

        const fetched = await (await bookingApi.getBooking(bookingid)).json();
        expect(fetched).toEqual(updated);
    });

    test('TC_BOOKING_UPDATE_002 - Verify update is rejected without a token', async ({ bookingApi }) => {
        const original = buildBooking();
        const { bookingid } = await (await bookingApi.createBooking(original)).json();

        const response = await bookingApi.updateBooking(bookingid, buildBooking({ totalprice: 999 }), null);

        expect(response.status()).toBe(403);
        const fetched = await (await bookingApi.getBooking(bookingid)).json();
        expect(fetched).toEqual(original);
    });

    test('TC_BOOKING_UPDATE_003 - Verify update is rejected with an invalid token', async ({ bookingApi }) => {
        const { bookingid } = await (await bookingApi.createBooking(buildBooking())).json();

        const response = await bookingApi.updateBooking(bookingid, buildBooking(), 'invalid-token-123');

        expect(response.status()).toBe(403);
    });

    test('TC_BOOKING_UPDATE_004 - Verify updating a booking that does not exist returns 404', async ({ bookingApi, authToken }) => {
        test.fail(true, 'Known defect: API returns 405 Method Not Allowed instead of 404 for a missing booking');

        const response = await bookingApi.updateBooking(99999999, buildBooking(), authToken);

        expect(response.status()).toBe(404);
    });
});