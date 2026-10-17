class BookingApi {
  constructor(request) {
    this.request = request;
    this.createdIds = [];
  }

  authHeaders(token) {
    return token ? { Cookie: `token=${token}` } : {};
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

  async updateBooking(id, payload, token) {
    return this.request.put(`/booking/${id}`, {
      data: payload,
      headers: this.authHeaders(token),
    });
  }

  async partialUpdateBooking(id, payload, token) {
    return this.request.patch(`/booking/${id}`, {
      data: payload,
      headers: this.authHeaders(token),
    });
  }

  async deleteBooking(id, token) {
    const response = await this.request.delete(`/booking/${id}`, {
      headers: this.authHeaders(token),
    });
    if (response.status() === 201) {
      this.createdIds = this.createdIds.filter(existing => existing !== id);
    }
    return response;
  }
}

module.exports = BookingApi;