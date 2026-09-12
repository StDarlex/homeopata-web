import React from "react";
import "./About.css";

const About = () => {
  return (
    <section className="about" id="about">
      <div className="about-container">

        <div className="about-top">
          <span className="about-label">SOBRE EL ESPECIALISTA</span>
        </div>

        <div className="about-content">

          <div className="about-message">
            <h2>
              Tu bienestar
              <br />
              merece ser <em>comprendido.</em>
            </h2>
          </div>

          <div className="about-description">
            <p>
              Un espacio de atención cercana y personalizada,
              donde escuchar, comprender y acompañar forman parte
              de cada encuentro.
            </p>

            <a href="contacto" className="about-link">
              <span>Conocer el enfoque</span>
              <span className="about-arrow">↗</span>
            </a>
          </div>

        </div>

        <div className="about-bottom">

          <div className="about-line"></div>

          <div className="about-signature">
            <span>Dr. Alejandro Adame Cafuentes</span>
            <small>Homeopatía</small>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
