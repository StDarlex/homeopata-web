import { useState } from "react";
import { Link } from "react-router-dom";
import "./ServicesPage.css";

function ServicesPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    treatment: "",
    delivery: "Local",
    address: "",
    city: "",
    state: "",
    country: "México",
    postalCode: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (sending) return;

    setSending(true);

    try {
      const response = await fetch(
        "https://homeopata-web-backend.onrender.com/api/treatment-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "No se pudo enviar la solicitud."
        );
      }

      alert(
        "Solicitud enviada correctamente. Recibirás un correo de confirmación."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        treatment: "",
        delivery: "Local",
        address: "",
        city: "",
        state: "",
        country: "México",
        postalCode: "",
        message: "",
      });
    } catch (error) {
      console.error("Error enviando solicitud:", error);

      alert(
        "No pudimos enviar tu solicitud. Intenta nuevamente en unos momentos."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="services-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="services-hero">

        <div className="services-hero-content">

          <span className="services-eyebrow">
            SERVICIOS · ATENCIÓN PERSONALIZADA
          </span>

          <h1>
            Atención que
            <br />
            continúa <em>contigo.</em>
          </h1>

          <p>
            Además de la consulta, ponemos a tu disposición
            diferentes formas de continuar tu proceso y solicitar
            el tratamiento indicado para ti.
          </p>

        </div>

      </section>


      {/* =====================================================
          CONSULTA
      ===================================================== */}

      <section className="services-intro">

        <div className="services-intro-label">
          <span>01</span>

          <p>
            ATENCIÓN
          </p>
        </div>

        <div className="services-intro-content">

          <h2>
            Cada proceso
            <br />
            merece <em>continuidad.</em>
          </h2>

          <p>
            La atención puede continuar después de la consulta.
            Cuando sea necesario, podrás solicitar el tratamiento
            correspondiente y elegir la modalidad de entrega que
            mejor se adapte a tu ubicación.
          </p>

        </div>

      </section>


      {/* =====================================================
          FORMAS DE ATENCIÓN
      ===================================================== */}

      <section className="services-list">

        <div className="services-list-header">

          <span className="services-eyebrow">
            FORMAS DE ATENCIÓN
          </span>

          <h2>
            Elige cómo
            <br />
            <em>continuar.</em>
          </h2>

        </div>


        <div className="services-grid">

          <article className="service-card">

            <div className="service-card-top">
              <span className="service-number">
                01
              </span>

              <span className="service-arrow">
                ↗
              </span>
            </div>

            <div className="service-card-content">

              <h3>
                Consulta
              </h3>

              <p>
                Atención personalizada para conocer tu historia,
                escuchar tus necesidades y determinar el
                acompañamiento correspondiente.
              </p>

              <Link
                to="/agendar"
                className="service-link"
              >
                Agendar consulta
                <span>↗</span>
              </Link>

            </div>

          </article>


          <article className="service-card">

            <div className="service-card-top">
              <span className="service-number">
                02
              </span>

              <span className="service-arrow">
                ↗
              </span>
            </div>

            <div className="service-card-content">

              <h3>
                Solicitud de tratamiento
              </h3>

              <p>
                Si ya cuentas con indicaciones y necesitas
                solicitar tu tratamiento, puedes enviarnos
                tus datos para revisar y confirmar tu solicitud.
              </p>

              <Link
  to="/solicitar"
  className="service-link"
>
  Solicitar tratamiento
  <span>↗</span>
</Link>

            </div>

          </article>


          <article className="service-card">

            <div className="service-card-top">
              <span className="service-number">
                03
              </span>

              <span className="service-arrow">
                ↗
              </span>
            </div>

            <div className="service-card-content">

              <h3>
                Atención local
              </h3>

              <p>
                Para Puerto Vallarta y zonas cercanas podemos
                coordinar la entrega de tu tratamiento mediante
                nuestro servicio de reparto local.
              </p>

              <span className="service-note">
                Entrega local · Rolling Reparto
              </span>

            </div>

          </article>


          <article className="service-card">

            <div className="service-card-top">
              <span className="service-number">
                04
              </span>

              <span className="service-arrow">
                ↗
              </span>
            </div>

            <div className="service-card-content">

              <h3>
                Envíos nacionales
              </h3>

              <p>
                También puedes solicitar el envío de tu
                tratamiento a otras ciudades dentro de México.
                Los detalles se confirman antes de realizar
                el envío.
              </p>

              <span className="service-note">
                República Mexicana
              </span>

            </div>

          </article>


          <article className="service-card">

            <div className="service-card-top">
              <span className="service-number">
                05
              </span>

              <span className="service-arrow">
                ↗
              </span>
            </div>

            <div className="service-card-content">

              <h3>
                Envíos internacionales
              </h3>

              <p>
                Si te encuentras fuera de México, puedes
                realizar una solicitud para revisar la
                posibilidad de envío a tu país.
              </p>

              <span className="service-note">
                Sujeto a disponibilidad
              </span>

            </div>

          </article>


          <article className="service-card service-card-highlight">

            <div className="service-card-top">
              <span className="service-number">
                06
              </span>

              <span className="service-arrow">
                ↗
              </span>
            </div>

            <div className="service-card-content">

              <h3>
                Seguimiento
              </h3>

              <p>
                Una vez confirmada tu solicitud podrás recibir
                información relacionada con el proceso y los
                detalles de tu entrega.
              </p>

              <Link
  to="/solicitar"
  className="service-link"
>
  Realizar solicitud
  <span>↗</span>
</Link>

            </div>

          </article>

        </div>

      </section>


      {/* =====================================================
          DELIVERY
      ===================================================== */}

      <section className="delivery-section">

        <div className="delivery-inner">

          <div className="delivery-heading">

            <span className="services-eyebrow">
              FORMAS DE ENTREGA
            </span>

            <h2>
              Tú indicas
              <br />
              <em>dónde.</em>
            </h2>

          </div>


          <div className="delivery-options">

            <div className="delivery-option">

              <span>01</span>

              <div>
                <h3>Local</h3>

                <p>
                  Puerto Vallarta y zonas cercanas.
                  Coordinamos la entrega mediante
                  nuestro servicio de reparto local.
                </p>
              </div>

            </div>


            <div className="delivery-option">

              <span>02</span>

              <div>
                <h3>Nacional</h3>

                <p>
                  Envíos dentro de México. La dirección
                  y los detalles de entrega se revisan
                  antes de confirmar la solicitud.
                </p>
              </div>

            </div>


            <div className="delivery-option">

              <span>03</span>

              <div>
                <h3>Internacional</h3>

                <p>
                  Solicitudes desde otros países sujetas
                  a disponibilidad y condiciones de envío.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FORM
      ===================================================== */}

      <section
        className="request-section"
        id="solicitar"
      >

        <div className="request-heading">

          <span className="services-eyebrow">
            SOLICITUD DE TRATAMIENTO
          </span>

          <h2>
            Cuéntanos dónde
            <br />
            <em>enviarlo.</em>
          </h2>

          <p>
            Completa tus datos y envía tu solicitud.
            Antes de confirmar cualquier envío nos pondremos
            en contacto contigo para revisar los detalles.
          </p>

        </div>


        <div className="request-form-wrapper">

          <form
            className="request-form"
            onSubmit={handleSubmit}
          >

            <div className="form-section-title">
              <span>01</span>
              <h3>Tus datos</h3>
            </div>


            <div className="request-form-row">

              <div className="request-field">

                <label htmlFor="name">
                  Nombre completo
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                />

              </div>


              <div className="request-field">

                <label htmlFor="phone">
                  Teléfono / WhatsApp
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Tu número"
                  required
                />

              </div>

            </div>


            <div className="request-form-row">

              <div className="request-field">

                <label htmlFor="email">
                  Correo electrónico
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                />

              </div>


              <div className="request-field">

                <label htmlFor="treatment">
                  Tratamiento
                </label>

                <input
                  id="treatment"
                  name="treatment"
                  type="text"
                  value={formData.treatment}
                  onChange={handleChange}
                  placeholder="Indica el tratamiento"
                  required
                />

              </div>

            </div>


            <div className="form-section-title form-section-space">

              <span>02</span>

              <h3>Entrega</h3>

            </div>


            <div className="request-field">

              <label>
                Modalidad de entrega
              </label>

              <div className="delivery-selector">

                <label>

                  <input
                    type="radio"
                    name="delivery"
                    value="Local"
                    checked={formData.delivery === "Local"}
                    onChange={handleChange}
                  />

                  <span>Local</span>

                </label>


                <label>

                  <input
                    type="radio"
                    name="delivery"
                    value="Nacional"
                    checked={formData.delivery === "Nacional"}
                    onChange={handleChange}
                  />

                  <span>Nacional</span>

                </label>


                <label>

                  <input
                    type="radio"
                    name="delivery"
                    value="Internacional"
                    checked={formData.delivery === "Internacional"}
                    onChange={handleChange}
                  />

                  <span>Internacional</span>

                </label>

              </div>

            </div>


            <div className="request-form-row">

              <div className="request-field">

                <label htmlFor="address">
                  Dirección
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Calle y número"
                  required
                />

              </div>


              <div className="request-field">

                <label htmlFor="postalCode">
                  Código postal
                </label>

                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Código postal"
                  required
                />

              </div>

            </div>


            <div className="request-form-row">

              <div className="request-field">

                <label htmlFor="city">
                  Ciudad
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ciudad"
                  required
                />

              </div>


              <div className="request-field">

                <label htmlFor="state">
                  Estado / Provincia
                </label>

                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Estado o provincia"
                  required
                />

              </div>

            </div>


            <div className="request-field">

              <label htmlFor="country">
                País
              </label>

              <input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                placeholder="País"
                required
              />

            </div>


            <div className="request-field">

              <label htmlFor="message">
                Información adicional
              </label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="¿Hay algo que debamos saber sobre tu solicitud?"
                rows="5"
              />

            </div>


            <button
              type="submit"
              className="request-submit"
              disabled={sending}
            >
              {sending
                ? "Enviando solicitud..."
                : "Enviar solicitud"}

              <span>↗</span>
            </button>


            <p className="request-notice">
              Tu solicitud será revisada antes de confirmar
              cualquier tratamiento o envío.
            </p>

          </form>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="services-cta">

        <div>

          <span className="services-eyebrow">
            ¿AÚN NO HAS TENIDO TU CONSULTA?
          </span>

          <h2>
            Comencemos por
            <br />
            <em>escucharte.</em>
          </h2>

          <Link
            to="/agendar"
            className="services-button"
          >
            Agendar consulta
            <span>↗</span>
          </Link>

        </div>

      </section>

    </main>
  );
}

export default ServicesPage;