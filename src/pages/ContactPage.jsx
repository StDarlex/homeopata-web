import "./ContactPage.css";

function ContactPage() {
  return (
    <main className="contact-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="contact-hero">

        <div className="contact-hero-content">

          <span className="contact-eyebrow">
            CONTACTO
          </span>

          <h1>
            Hablemos con
            <br />
            <em>tranquilidad.</em>
          </h1>

          <p>
            Si tienes alguna pregunta antes de agendar,
            puedes ponerte en contacto. Será un gusto
            atenderte y orientarte.
          </p>

        </div>

      </section>


      {/* =========================
          CONTACT INFORMATION
      ========================= */}

      <section className="contact-information">

        <div className="contact-label">
          01 — INFORMACIÓN
        </div>

        <div className="contact-grid">

          {/* EMAIL */}

          <article className="contact-card">

            <span className="contact-card-number">
              01
            </span>

            <span className="contact-card-label">
              CORREO ELECTRÓNICO
            </span>

            <h2>
              Escríbeme
            </h2>

            <p>
              Para preguntas, información sobre consultas
              o cualquier asunto relacionado con tu cita.
            </p>

            <a href="homeopatia.cafuentes@gmail.com">
              homeopatia.cafuentes@gmail.com
              <span>↗</span>
            </a>

          </article>


          {/* WHATSAPP */}

          <article className="contact-card">

            <span className="contact-card-number">
              02
            </span>

            <span className="contact-card-label">
              WHATSAPP
            </span>

            <h2>
              Conversemos
            </h2>

            <p>
              Un medio directo para resolver dudas y recibir
              información antes de tu consulta.
            </p>

            <a
              href="https://wa.me/523221427102"
              target="_blank"
              rel="noreferrer"
            >
              Enviar mensaje
              <span>↗</span>
            </a>

          </article>


          {/* UBICACIÓN */}

          <article className="contact-card">

            <span className="contact-card-number">
              03
            </span>

            <span className="contact-card-label">
              CONSULTA PRESENCIAL
            </span>

            <h2>
              Ubicación
            </h2>

            <p>
              La dirección y los detalles de la consulta
              presencial se compartirán al confirmar tu cita.
            </p>

            <span className="contact-location">
              Próximamente
            </span>

          </article>

        </div>

      </section>


      {/* =========================
          FORM
      ========================= */}

      <section className="contact-form-section">

        <div className="contact-form-intro">

          <span>
            02 — MENSAJE
          </span>

          <h2>
            ¿Tienes alguna
            <br />
            <em>pregunta?</em>
          </h2>

          <p>
            Déjanos tus datos y tu mensaje. Próximamente
            este formulario estará conectado directamente
            con el correo del doctor.
          </p>

        </div>


        <form className="contact-form">

          <div className="contact-field">

            <label htmlFor="name">
              Nombre
            </label>

            <input
              id="name"
              type="text"
              placeholder="Tu nombre"
            />

          </div>


          <div className="contact-field">

            <label htmlFor="email">
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
            />

          </div>


          <div className="contact-field">

            <label htmlFor="message">
              Mensaje
            </label>

            <textarea
              id="message"
              rows="5"
              placeholder="¿En qué podemos ayudarte?"
            />

          </div>


          <button type="submit">
            Enviar mensaje
            <span>↗</span>
          </button>

        </form>

      </section>


      {/* =========================
          CTA
      ========================= */}

      <section className="contact-cta">

        <span>
          ¿YA ESTÁS LISTO?
        </span>

        <h2>
          Agenda tu consulta.
        </h2>

        <a href="/agendar">
          Agendar consulta
          <span>↗</span>
        </a>

      </section>

    </main>
  );
}

export default ContactPage;