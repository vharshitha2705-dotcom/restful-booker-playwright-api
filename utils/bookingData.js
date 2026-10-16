function buildBooking(overrides = {}) {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

  return {
    firstname: `Harshi${suffix}`,
    lastname: `Tester${suffix}`,
    totalprice: 250,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

module.exports = { buildBooking };