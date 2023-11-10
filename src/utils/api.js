import { optionsApi } from "./utils.js";

class Api {
  constructor({ url, headers }) {
    this._url = url;
    this._headers = headers;
  }
  //Обработка данных ответа
  _handleData(url, options) {
    return fetch(url, options).then((res) => {
      return res.ok ? res.json() : Promise.reject(`Ошибка ${res.status}`);
    });
  }
  //Загрузка карточек
  getInitialCards() {
    return this._handleData(`${this._url}/cards`, {
      method: "GET",
      headers: this._headers,
    });
  }
  //Загрузка данных пользователя
  getUserData() {
    return this._handleData(`${this._url}/users/me`, {
      method: "GET",
      headers: this._headers,
    });
  }
  //Редактирование профиля
  patchUserData(data) {
    return this._handleData(`${this._url}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.description,
      }),
    });
  }
  //Добавление новой карточки
  postCard(cardData) {
    return this._handleData(`${this._url}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(cardData),
    });
  }
  //Удаление карточки
  deleteCard(id) {
    return this._handleData(`${this._url}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    });
  }
  //Обновление аватара пользователя
  patchAvatar(avatar) {
    return this._handleData(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: avatar,
      }),
    });
  }
  //Постановка лайка
  putLike(id) {
    return this._handleData(`${this._url}/cards/${id}/likes`, {
      method: "PUT",
      headers: this._headers,
    });
  }
  //Снятие лайка
  deleteLike(id) {
    return this._handleData(`${this._url}/cards/${id}/likes`, {
      method: "DELETE",
      headers: this._headers,
    });
  }
  changeLikeCardStatus(cardId, isLiked) {
    return !isLiked ? this.deleteLike(cardId) : this.putLike(cardId);
  }
}

const api = new Api(optionsApi);

export default api;
