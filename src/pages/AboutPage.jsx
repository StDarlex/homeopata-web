import "./AboutPage.css";
import fotoHomeopata1 from "../assets/foto homeopata 1.jpg";

function AboutPage() {
  return (
    <main className="about-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="about-hero">

        <div className="about-hero-content">

          <span className="about-eyebrow">
            EL DOCTOR
          </span>

          <h1>
            Conocer a la persona
            <br />
            <em>detrás de la consulta.</em>
          </h1>

          <p>
            Una práctica construida desde la escucha,
            la cercanía y el respeto por la historia
            de cada persona.
          </p>

        </div>


        <div className="about-hero-image">

          <img
            src={fotoHomeopata1}
            alt="Dr. Alejandro Adame Cafuentes"
          />

        </div>

      </section>


      {/* =========================
          INTRO
      ========================= */}

      <section className="about-introduction">

        <div className="about-label">
          01 — TRAYECTORIA
        </div>

        <div className="about-text">

          <h2>
            Una consulta comienza
            <br />
            <em>mucho antes de una respuesta.</em>
          </h2>

          <p>
            La práctica del Dr. Alejandro Adame Cafuentes
            parte de una idea sencilla: escuchar primero.
            Comprender la historia, las necesidades y el
            contexto de cada persona permite construir
            un acompañamiento verdaderamente individual.
          </p>

          <p>
            Su manera de ejercer la homeopatía busca mantener
            un espacio profesional, humano y respetuoso,
            donde cada consulta tenga el tiempo necesario
            para ser escuchada.
          </p>

        </div>

      </section>


      {/* =========================
          PHILOSOPHY
      ========================= */}

      <section className="about-philosophy">

        <div className="about-philosophy-content">

          <span>
            FILOSOFÍA
          </span>

          <blockquote>
            “Cada persona tiene una historia
            que merece ser escuchada.”
          </blockquote>

          <p>
            — Dr. Alejandro Adame Cafuentes
          </p>

        </div>

      </section>


      {/* =========================
          ST. DARLEX
      ========================= */}

      <section className="about-st-darlex">

        <div className="about-st-label">
          02 — PROYECTOS
        </div>

        <div className="about-st-content">

          <h2>
            Fundador de
            <br />
            <em>St. Darlex.</em>
          </h2>

          <p>
            Además de su práctica profesional, el Dr.
            Alejandro Adame Cafuentes es fundador de
            St. Darlex, un proyecto dedicado a acercar
            la homeopatía a más personas.
          </p>

          <a
  href="https://stdarlex.com"
  className="about-st-link"
  target="_blank"
  rel="noopener noreferrer"
>
  Conocer St. Darlex
  <span>↗</span>
</a>

        </div>

      </section>


    </main>
  );
}

export default AboutPage;