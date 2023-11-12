import "../index.css";
import AuthForm from "./AuthForm";

function Login({ onSignSubmit }) {
  return (
    <AuthForm
      title="Вход"
      name="login"
      button="Войти"
      onSignSubmit={onSignSubmit}
    />
  );
}

export default Login;
