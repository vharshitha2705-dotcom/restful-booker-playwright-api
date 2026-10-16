class BookingApi {
  constructor(request) {
    this.request = request;
    this.createdIds = [];
  }

  async getBookingIds(filters = {}) {
    return this.request.get('/booking', { params: filters });
  }

  async getBooking(id) {
    return this.request.get(`/booking/${id}`);
  }

  async createBooking(payload) {
    const response = await this.request.post('/booking', { data: payload });
    if (response.ok()) {
      try {
        const body = await response.json();
        if (body.bookingid) this.createdIds.push(body.bookingid);
      } catch (e) {
        // response was not JSON, nothing to track
      }
    }
    return response;
  }

  async deleteBooking(id, token) {
    return this.request.delete(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
  }
}

module.exports = BookingApi;