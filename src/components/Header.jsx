import "../index.css";
import logo from "../images/logo.svg";

function Header() {
  return (
    <div>
      <header className="header">
        <img className="header__logo" src={logo} alt="Логотип Место" />
      </header>
    </div>
  );
}

export default Header;
