import { Link } from "react-router-dom";
import "./ApproachPage.css";

function ApproachPage() {
  return (
    <main className="approach-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="approach-hero">

        <div className="approach-hero-content">

          <span className="approach-eyebrow">
            MI ENFOQUE
          </span>

          <h1>
            Antes de tratar,
            <br />
            hay que <em>escuchar.</em>
          </h1>

          <p>
            Mi forma de trabajar parte de una atención cercana,
            respetuosa y personalizada. Cada persona tiene una
            historia diferente y merece ser escuchada como tal.
          </p>

        </div>

      </section>


      {/* =========================
          PHILOSOPHY
      ========================= */}

      <section className="approach-philosophy">

        <div className="approach-section-label">
          <span>01</span>
          <p>LA CONSULTA</p>
        </div>

        <div className="approach-philosophy-content">

          <h2>
            Una consulta no comienza
            <br />
            con una respuesta.
          </h2>

          <div className="approach-philosophy-text">

            <p>
              Comienza con una conversación. Conocer lo que estás
              viviendo, tus antecedentes y aquello que consideras
              importante permite construir un espacio de atención
              verdaderamente personalizado.
            </p>

            <p>
              Por eso cada consulta requiere tiempo, atención y
              disposición para comprender a la persona que tengo
              frente a mí.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          PRINCIPLES
      ========================= */}

      <section className="approach-principles">

        <div className="approach-section-heading">

          <span className="approach-eyebrow">
            PRINCIPIOS
          </span>

          <h2>
            Una atención basada
            <br />
            en <em>personas.</em>
          </h2>

        </div>


        <div className="approach-principles-grid">

          <article className="approach-principle">

            <span>01</span>

            <h3>Escuchar</h3>

            <p>
              Dar espacio para conocer tu historia, tus inquietudes
              y aquello que te lleva a buscar atención.
            </p>

          </article>


          <article className="approach-principle">

            <span>02</span>

            <h3>Comprender</h3>

            <p>
              Observar cada caso de manera individual, sin reducir
              a una persona únicamente a sus síntomas.
            </p>

          </article>


          <article className="approach-principle">

            <span>03</span>

            <h3>Acompañar</h3>

            <p>
              Mantener una atención cercana durante el proceso,
              dando seguimiento y espacio para resolver dudas.
            </p>

          </article>

        </div>

      </section>


      {/* =========================
          CLOSING
      ========================= */}

      <section className="approach-closing">

        <div>

          <span className="approach-eyebrow">
            UN ESPACIO PARA TI
          </span>

          <h2>
            Tu historia también
            <br />
            forma parte de la <em>consulta.</em>
          </h2>

          <Link
            to="/agendar"
            className="approach-button"
          >
            Agendar consulta
            <span>↗</span>
          </Link>

        </div>

      </section>

    </main>
  );
}

export default ApproachPage;