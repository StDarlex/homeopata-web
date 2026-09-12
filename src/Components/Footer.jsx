import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../assets/logo.jpg";

function Footer() {
  return (
    <footer className="footer" id="contacto">

      <div className="footer-main">

        <div className="footer-brand">
          <div className="footer-mark">
            <img
              src={logo}
              alt="Dr. Alejandro Adame Cafuentes"
            />
          </div>

          <div>
            <h2>Dr. Alejandro Adame Cafuentes</h2>
            <p>Homeopatía · Atención personalizada</p>
          </div>

          <p className="footer-description">
            Un espacio creado para escuchar, comprender y acompañar
            cada proceso de manera individual.
          </p>
        </div>

        <div className="footer-column">
          <h3>Navegación</h3>
          <Link to="/">Inicio</Link>
          <Link to="/sobre-mi">Sobre mí</Link>
          <Link to="/#enfoque">Mi enfoque</Link>
          <Link to="/#servicios">Servicios</Link>
          <Link to="/agendar">Agendar cita</Link>
        </div>

        <div className="footer-column">
          <h3>Contacto</h3>
          <a href="tel:+523221427102">+52 322 142 7102</a>
          <a href="mailto:homeopatia.cafuentes@gmail.com">
            homeopatia.cafuentes@gmail.com
          </a>
          <p>
            Puerto Vallarta, Jalisco
            <br />
            México
          </p>
        </div>

        <div className="footer-column">
          <h3>Atención</h3>
          <p>Lunes — Viernes</p>
          <p>09:00 — 18:00</p>

          <Link to="/agendar" className="footer-appointment">
            Agendar consulta
            <span>↗</span>
          </Link>
        </div>

      </div>

      <div className="footer-founder">
        <span></span>

        <p>
          Fundador de <strong>St. Darlex</strong>
        </p>

        <span></span>
      </div>

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Dr. Alejandro Adame Cafuentes.
          Todos los derechos reservados.
        </p>

        <p className="footer-creator">
          by <strong>Ares Intelligence Corporation</strong>
        </p>

        <div className="footer-legal">
          <Link to="/privacidad">Privacidad</Link>
          <Link to="/aviso-legal">Aviso legal</Link>
        </div>

      </div>

    </footer>
  );
}

export default Footer;
