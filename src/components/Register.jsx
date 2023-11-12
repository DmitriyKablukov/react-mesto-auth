import "../index.css";
import AuthForm from "./AuthForm";

function Register({ onSignSubmit }) {
  return (
    <AuthForm
      title="Регистрация"
      name="register"
      button="Зарегистрироваться"
      isRegistered="Уже зарегистрированы? Войти"
      onSignSubmit={onSignSubmit}
    />
  );
}

export default Register;
