import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import ProtectedRoute from "./ProtectedRoute";
import auth from "../utils/auth";
import Register from "./Register";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import error from "../images/error.svg";
import success from "../images/success.svg";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({
    name: "",
    about: "",
    avatar: "",
  });
  const [cards, setCards] = useState([]);
  const [isTooltipErrorPopup, setIsTooltipErrorPopup] = useState(false);
  const [isTooltipSuccessPopup, setIsTooltipSuccessPopup] = useState(false);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

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

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    handleTokenCheck(jwt);
  });

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(`Ошибка лайка карточки. ${err}`));
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
    setIsTooltipErrorPopup(false);
    setIsTooltipSuccessPopup(false);
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

  function handleRegistration(data) {
    auth
      .registerUser(data.email, data.password)
      .then((res) => {
        setIsTooltipSuccessPopup(true);
        navigate("/sign-in", { replace: true });
      })
      .catch((err) => {
        console.log(`Ошибка регистрации пользователя. ${err}`);
        setIsTooltipErrorPopup(true);
      });
  }

  function handleAuthorization(data) {
    auth
      .authorizeUser(data.email, data.password)
      .then((data) => {
        if (data.jwt) {
          localStorage.setItem("jwt", data.jwt);
          setLoggedIn(true);
        }
        navigate("/", { replace: true });
        setEmail(data.data.email);
      })
      .catch((err) => {
        console.log(`Ошибка авторизации пользователя. ${err}`);
      });
  }

  function handleExitProfile() {
    localStorage.removeItem("jwt");
    navigate("/sign-in", { replace: true });
  }

  function handleTokenCheck(jwt) {
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((data) => {
          navigate("/", { replace: true });
          setLoggedIn(true);
          setEmail(data.data.email);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header
                  email={email}
                  onExitProfile={"Выйти"}
                  onClick={handleExitProfile}
                  path={"/sign-in"}
                />
                <ProtectedRoute
                  onEditProfile={onEditProfile}
                  onAddPlace={onAddPlace}
                  onEditAvatar={onEditAvatar}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  cards={cards}
                  element={Main}
                  loggedIn={loggedIn}
                />
              </>
            }
          />
          <Route
            path="/sign-up"
            element={
              <>
                <Header headerLink={"Вход"} path="/sign-in" />
                <Register
                  onSignSubmit={handleRegistration}
                  loggedIn={loggedIn}
                />
              </>
            }
          />
          <Route
            path="/sign-in"
            element={
              <>
                <Header headerLink={"Регистрация"} path="/sign-up" />
                <Login onSignSubmit={handleAuthorization} loggedIn={loggedIn} />
              </>
            }
          />
        </Routes>
        <Footer />
        <InfoTooltip
          isOpen={isTooltipSuccessPopup}
          onClose={closeAllPopups}
          title={"Вы успешно зарегистрировались!"}
          image={success}
        />

        <InfoTooltip
          isOpen={isTooltipErrorPopup}
          onClose={closeAllPopups}
          title={"Что-то пошло не так! Попробуйте ещё раз."}
          image={error}
        />

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
    </CurrentUserContext.Provider>
  );
}

export default App;
