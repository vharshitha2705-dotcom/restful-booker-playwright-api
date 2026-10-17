const { test, expect } = require('../fixtures/apiFixtures');
const { buildBooking } = require('../utils/bookingData');

test.describe('Partial update booking API (PATCH)', () => {

    test('TC_BOOKING_PATCH_001 - Verify a single field can be updated', async ({ bookingApi, authToken }) => {
        const { bookingid } = await (await bookingApi.createBooking(buildBooking())).json();

        const response = await bookingApi.partialUpdateBooking(bookingid, { firstname: 'Harshitha' }, authToken);

        expect(response.status()).toBe(200);
        expect((await response.json()).firstname).toBe('Harshitha');
    });

    test('TC_BOOKING_PATCH_002 - Verify other fields stay unchanged after a partial update', async ({ bookingApi, authToken }) => {
        const original = buildBooking();
        const { bookingid } = await (await bookingApi.createBooking(original)).json();

        await bookingApi.partialUpdateBooking(bookingid, { firstname: 'Harshitha' }, authToken);

        const fetched = await (await bookingApi.getBooking(bookingid)).json();
        expect(fetched).toEqual({ ...original, firstname: 'Harshitha' });
    });

    test('TC_BOOKING_PATCH_003 - Verify partial update is rejected without a token', async ({ bookingApi }) => {
        const { bookingid } = await (await bookingApi.createBooking(buildBooking())).json();

        const response = await bookingApi.partialUpdateBooking(bookingid, { firstname: 'Harshitha' }, null);

        expect(response.status()).toBe(403);
    });

    test('TC_BOOKING_PATCH_004 - Verify partial update is rejected with an invalid token', async ({ bookingApi }) => {
        const { bookingid } = await (await bookingApi.createBooking(buildBooking())).json();

        const response = await bookingApi.partialUpdateBooking(bookingid, { firstname: 'Harshitha' }, 'invalid-token-123');

        expect(response.status()).toBe(403);
    });


    test('TC_BOOKING_PATCH_005 - Verify patching a booking that does not exist returns 404', async ({ bookingApi, authToken }) => {
        test.fail(true, 'Known defect: API returns 405 Method Not Allowed instead of 404 for a missing booking');

        const response = await bookingApi.partialUpdateBooking(99999999, { firstname: 'Patched' }, authToken);

        expect(response.status()).toBe(404);
    });
});