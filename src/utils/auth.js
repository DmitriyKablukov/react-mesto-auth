class Auth {
  constructor(baseUrl) {
    this._baseUrl = baseUrl;
  }

  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  registerUser(email, password) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then((res) => this._handleResponse(res));
  }

  authorizeUser(email, password) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => this._handleResponse(res))
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          return data;
        }
      });
  }

  checkToken(jwt) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => this._handleResponse(res))
      .then((data) => data);
  }
}
const auth = new Auth("https://auth.nomoreparties.co");
export default auth;
