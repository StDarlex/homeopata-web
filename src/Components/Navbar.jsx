import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

import logo from "../assets/logo.jpg";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`navbar ${menuOpen ? "menu-open" : ""}`}>

      <Link
        to="/"
        className="navbar-brand"
        onClick={closeMenu}
      >

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

        <Link to="/" onClick={closeMenu}>
          Inicio
        </Link>

        <Link to="/sobre-mi" onClick={closeMenu}>
          Sobre mí
        </Link>

        <Link to="/enfoque" onClick={closeMenu}>
          Enfoque
        </Link>

        <Link to="/servicios" onClick={closeMenu}>
          Servicios
        </Link>

        <Link to="/contacto" onClick={closeMenu}>
          Contacto
        </Link>

      </nav>


      <Link
        to="/agendar"
        className="navbar-button"
        onClick={closeMenu}
      >
        Agendar consulta
      </Link>


      {/* BOTÓN MENÚ MÓVIL */}

      <button
        className="navbar-menu-button"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>


      {/* MENÚ DESPLEGABLE MÓVIL */}

      <div className="mobile-menu">

        <div className="mobile-menu-header">
          <span>NAVEGACIÓN</span>
          <span>MENÚ</span>
        </div>

        <nav className="mobile-menu-links">

          <Link to="/" onClick={closeMenu}>
            <span>01</span>
            Inicio
            <strong>↗</strong>
          </Link>

          <Link to="/sobre-mi" onClick={closeMenu}>
            <span>02</span>
            Sobre mí
            <strong>↗</strong>
          </Link>

          <Link to="/enfoque" onClick={closeMenu}>
            <span>03</span>
            Enfoque
            <strong>↗</strong>
          </Link>

          <Link to="/servicios" onClick={closeMenu}>
            <span>04</span>
            Servicios
            <strong>↗</strong>
          </Link>

          <Link to="/contacto" onClick={closeMenu}>
            <span>05</span>
            Contacto
            <strong>↗</strong>
          </Link>

        </nav>


        <Link
          to="/agendar"
          className="mobile-menu-appointment"
          onClick={closeMenu}
        >
          <span>Agendar consulta</span>
          <strong>↗</strong>
        </Link>

      </div>

    </header>
  );
}

export default Navbar;
