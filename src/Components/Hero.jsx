import { Link } from "react-router-dom";
import "./Hero.css";
import fotoHomeopata2 from "../assets/foto homeopata 2.jpg";

function Hero() {
  return (
    <section className="hero" id="inicio">

      <div className="hero-content">

        <span className="hero-eyebrow">
          HOMEOPATÍA · CONSULTA PERSONALIZADA
        </span>

        <h1>
          Escuchar también
          <br />
          <em>es parte de sanar.</em>
        </h1>

        <p className="hero-description">
          Un acompañamiento cercano, humano y respetuoso,
          pensado para comprender tu historia y atender
          tus necesidades de manera individual.
        </p>

        <div className="hero-actions">

          <Link
            to="/agendar"
            className="hero-primary-button"
          >
            Agendar consulta
            <span>↗</span>
          </Link>

          <Link
            to="/sobre-mi"
            className="hero-secondary-link"
          >
            Conocer al doctor
          </Link>

        </div>

      </div>


      <div className="hero-visual">

        <div className="hero-photo">

          <img
            src={fotoHomeopata2}
            alt="Dr. Alejandro Adame Cafuentes durante una consulta de homeopatía"
          />

        </div>


        <div className="hero-quote">

          <span>UNA CONSULTA</span>

          <p>
            Comienza por escuchar.
          </p>

        </div>

      </div>

    </section>
  );
}

export default Hero;