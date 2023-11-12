import "../index.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function AuthForm({ title, name, button, isRegistered, onSignSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  function handleSignSubmit(e) {
    e.preventDefault();
    onSignSubmit({
      email,
      password,
    });
  }

  return (
    <main className="auth">
      <div className="auth__container">
        <form
          className="popup__form-registration"
          method="post"
          name={name}
          onSubmit={handleSignSubmit}
        >
          <h2 className="auth__title">{title}</h2>
          <div className="auth__form-container">
            <input
              className="auth__input"
              id="email-input"
              name="email"
              type="email"
              required=""
              placeholder="Email"
              value={email}
              onChange={handleEmail}
            />
          </div>
          <div className="auth__form-container">
            <input
              className="auth__input"
              id="password"
              name="password"
              type="password"
              required=""
              placeholder="Пароль"
              value={password}
              onChange={handlePassword}
            />
          </div>
          <div className="auth__form-container">
            <button className="auth__submit-button" type="submit">
              {button}
            </button>
            <span className="auth__link">
              <Link to="/sign-in" className="auth__link">
                {isRegistered}
              </Link>
            </span>
          </div>
        </form>
      </div>
    </main>
  );
}

export default AuthForm;
