const { test, expect } = require('../fixtures/apiFixtures');
const { buildBooking } = require('../utils/bookingData');

test.describe('API contract checks', () => {

  test('TC_CONTRACT_001 - Verify the booking response is returned as JSON', async ({ bookingApi }) => {
    const { bookingid } = await (await bookingApi.createBooking(buildBooking())).json();

    const response = await bookingApi.getBooking(bookingid);

    expect(response.headers()['content-type']).toContain('application/json');
  });

});