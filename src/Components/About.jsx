import "./About.css";

function About() {
  return (
    <section id="sobre-mi" className="about">
      <div className="about-image">
        <div className="about-photo">
          <span>Fotografía del consultorio</span>
        </div>
      </div>

      <div className="about-content">
        <p className="about-eyebrow">
          SOBRE MÍ
        </p>

        <h2>
          Una trayectoria
          <br />
          construida alrededor
          <br />
          de las <em>personas.</em>
        </h2>

        <p className="about-intro">
          Mi práctica nace de una convicción sencilla: cada persona
          merece ser escuchada, comprendida y acompañada de manera
          individual.
        </p>

        <p className="about-text">
          A lo largo de mi trayectoria he tenido la oportunidad de
          acompañar a muchas personas y familias, aprendiendo que
          detrás de cada consulta existe una historia diferente.
        </p>

        <div className="about-founder">
          <span className="about-line"></span>

          <div>
            <strong>Fundador de St. Darlex</strong>

            <p>
              Una visión que comenzó con el deseo de acercar la
              homeopatía a más personas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;