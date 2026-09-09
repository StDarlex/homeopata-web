import { Link } from "react-router-dom";
import "./Navbar.css";

import logo from "../assets/logo.jpg";

function Navbar() {
  return (
    <header className="navbar">

      <Link to="/" className="navbar-brand">

        <img
          src={logo}
          alt="Dr. Alejandro Adame Cafuentes"
          className="brand-logo"
        />

        <span className="brand-name">
          <strong>Dr. Alejandro Adame Cafuentes</strong>
          <small>Homeopatía</small>
        </span>

      </Link>

      <nav className="navbar-links">

        <Link to="/">
          Inicio
        </Link>

        <Link to="/sobre-mi">
  Sobre mí
</Link>

        <Link to="/enfoque">
          Enfoque
        </Link>

        <Link to="/servicios">
          Servicios
        </Link>

        <Link to="/contacto">
          Contacto
        </Link>

      </nav>

      <Link
        to="/agendar"
        className="navbar-button"
      >
        Agendar consulta
      </Link>

    </header>
  );
}

export default Navbar;