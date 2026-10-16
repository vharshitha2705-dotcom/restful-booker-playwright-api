const { test, expect } = require('../fixtures/apiFixtures');
const { buildBooking } = require('../utils/bookingData');

test.describe('Create booking API', () => {

    test('TC_BOOKING_CREATE_001 - Verify a booking is created with valid data', async ({ bookingApi }) => {
        const payload = buildBooking();

        const response = await bookingApi.createBooking(payload);

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(typeof body.bookingid).toBe('number');
        expect(body.booking).toEqual(payload);
    });

    test('TC_BOOKING_CREATE_002 - Verify each new booking gets a unique ID', async ({ bookingApi }) => {
        const first = await (await bookingApi.createBooking(buildBooking())).json();
        const second = await (await bookingApi.createBooking(buildBooking())).json();

        expect(first.bookingid).not.toBe(second.bookingid);
    });

    test('TC_BOOKING_CREATE_003 - Verify booking is rejected when a required field is missing', async ({ bookingApi }) => {
        test.fail(true, 'Known defect: API returns 500 Internal Server Error instead of 400 for a missing required field');

        const { firstname, ...incomplete } = buildBooking();

        const response = await bookingApi.createBooking(incomplete);

        expect(response.status()).toBe(400);
    });

    test('TC_BOOKING_CREATE_004 - Verify an invalid date format is rejected', async ({ bookingApi }) => {
        test.fail(true, 'Known defect: API accepts an invalid checkin date, returns 200 and stores "0NaN-aN-aN"');

        const payload = buildBooking({
            bookingdates: { checkin: 'Today', checkout: '2026-12-05' },
        });

        const response = await bookingApi.createBooking(payload);

        expect(response.status()).toBe(400);
    });

    test('TC_BOOKING_CREATE_005 - Verify an empty request body is rejected', async ({ bookingApi }) => {
        test.fail(true, 'Known defect: API returns 500 Internal Server Error instead of 400 for an empty body');

        const response = await bookingApi.createBooking({});

        expect(response.status()).toBe(400);
    });
});