const { test, expect } = require('../fixtures/apiFixtures');
const { buildBooking } = require('../utils/bookingData');

test('TC_E2E_001 - Verify the full booking lifecycle: create, read, update, patch, delete', async ({ bookingApi, authToken }) => {
  const original = buildBooking();
  let bookingid;

  await test.step('Create a booking', async () => {
    const response = await bookingApi.createBooking(original);
    expect(response.status()).toBe(200);
    bookingid = (await response.json()).bookingid;
  });

  await test.step('Read the booking', async () => {
    const response = await bookingApi.getBooking(bookingid);
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(original);
  });

  const updated = buildBooking({ totalprice: 500 });

  await test.step('Update the booking (PUT)', async () => {
    const response = await bookingApi.updateBooking(bookingid, updated, authToken);
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(updated);
  });

  await test.step('Patch the booking (PATCH)', async () => {
    const response = await bookingApi.partialUpdateBooking(bookingid, { lastname: 'Final' }, authToken);
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ...updated, lastname: 'Final' });
  });

  await test.step('Delete the booking', async () => {
    const response = await bookingApi.deleteBooking(bookingid, authToken);
    expect(response.status()).toBe(201);
  });

  await test.step('Verify the booking no longer exists', async () => {
    const response = await bookingApi.getBooking(bookingid);
    expect(response.status()).toBe(404);
  });
});