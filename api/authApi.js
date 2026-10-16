class AuthApi {
  constructor(request) {
    this.request = request;
  }

  async createToken(credentials) {
    return this.request.post('/auth', { data: credentials });
  }

  async getToken(credentials) {
    const response = await this.createToken(credentials);
    const body = await response.json();
    return body.token;
  }
}

module.exports = AuthApi;