import { useState, useEffect } from "react";
import "../index.css";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  useEffect(() => {
    api
      .getInitialCards()
      .then((cards) => setCards(cards))
      .catch((err) => console.log(`Ошибка добавления карточки. ${err}`));
  }, []);

  useEffect(() => {
    api
      .getUserData()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch((err) => console.log(`Ошибка получения данных. ${err}`));
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    });
  }

  function handleCardDelete(id) {
    api
      .deleteCard(id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== id));
      })
      .catch((err) => console.log(`Ошибка при удалении карточки. ${err}`));
  }

  function handleUpdateUser(user) {
    api
      .patchUserData(user)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка редактирования профиля. ${err}`);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .patchAvatar(avatar)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка редактирования аватара. ${err}`));
  }

  function handleAddPlaceSubmit(card) {
    api
      .postCard(card)
      .then((cardData) => {
        setCards([cardData, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка добавления карточки. ${err}`));
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({});
  }

  function handleCardClick(data) {
    setSelectedCard(data);
  }

  function onEditProfile() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function onAddPlace() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function onEditAvatar() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  return (
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Header />
          <Main
            onEditProfile={onEditProfile}
            onAddPlace={onAddPlace}
            onEditAvatar={onEditAvatar}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
          />
          <Footer />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <AddPlacePopup
            onClose={closeAllPopups}
            isOpen={isAddPlacePopupOpen}
            onUpdateCards={handleAddPlaceSubmit}
          />

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </div>
        <div>
          <div className="popup popup_delete">
            <div className="popup__container">
              <button
                className="popup__close-button popup__close-button_delete"
                type="button"
              />
              <h2 className="popup__title popup__delete-title">Вы уверены?</h2>
              <form
                name="delete"
                className="popup__form popup__form_delete"
                noValidate=""
              >
                <button
                  className="popup__button-delete popup__form-button-save"
                  type="submit"
                >
                  Да
                </button>
              </form>
            </div>
          </div>
        </div>
      </CurrentUserContext.Provider>
  );
}

export default App;
