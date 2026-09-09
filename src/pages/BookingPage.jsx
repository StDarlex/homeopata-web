import { useState } from "react";
import "./BookingPage.css";

function BookingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    date: "",
    time: "",
    modality: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/booking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "No se pudo enviar la solicitud."
        );
      }

      setSuccessMessage(
        "Tu solicitud ha sido enviada correctamente. Nos pondremos en contacto contigo para confirmar los detalles."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        type: "",
        date: "",
        time: "",
        modality: "",
        message: "",
      });
    } catch (error) {
      console.error("Error enviando solicitud:", error);

      setErrorMessage(
        error.message ||
          "No pudimos enviar tu solicitud. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="booking-page">
      <section className="booking-section">

        <div className="booking-intro">
          <span>01 — SOLICITUD DE CONSULTA</span>

          <p>
            Completa los siguientes datos para solicitar
            una consulta. La información será utilizada
            únicamente para atender tu solicitud.
          </p>
        </div>

        <form
          className="booking-form"
          onSubmit={handleSubmit}
        >

          {/* DATOS PERSONALES */}
          <div className="booking-form-section">

            <span className="booking-form-number">
              01
            </span>

            <div className="booking-form-fields">

              <div className="booking-field">
                <label htmlFor="name">
                  Nombre completo
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="booking-field">
                <label htmlFor="email">
                  Correo electrónico
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="booking-field">
                <label htmlFor="phone">
                  Teléfono / WhatsApp
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Tu número"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>
          </div>


          {/* DATOS DE LA CONSULTA */}
          <div className="booking-form-section">

            <span className="booking-form-number">
              02
            </span>

            <div className="booking-form-fields">

              <div className="booking-field">
                <label htmlFor="type">
                  Tipo de consulta
                </label>

                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Selecciona una opción
                  </option>

                  <option value="Primera consulta">
                    Primera consulta
                  </option>

                  <option value="Consulta de seguimiento">
                    Consulta de seguimiento
                  </option>

                  <option value="Orientación">
                    Orientación
                  </option>
                </select>
              </div>


              <div className="booking-field">
                <label htmlFor="date">
                  Fecha preferida
                </label>

                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="booking-field">
                <label htmlFor="time">
                  Horario preferido
                </label>

                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Selecciona un horario
                  </option>

                  <option value="Mañana">
                    Mañana
                  </option>

                  <option value="Mediodía">
                    Mediodía
                  </option>

                  <option value="Tarde">
                    Tarde
                  </option>
                </select>
              </div>


              <div className="booking-field">
                <label htmlFor="modality">
                  Modalidad
                </label>

                <select
                  id="modality"
                  name="modality"
                  value={formData.modality}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Selecciona una modalidad
                  </option>

                  <option value="En línea">
                    Consulta en línea
                  </option>

                  <option value="Presencial">
                    Consulta presencial
                  </option>
                </select>
              </div>

            </div>
          </div>


          {/* INFORMACIÓN ADICIONAL */}
          <div className="booking-form-section">

            <span className="booking-form-number">
              03
            </span>

            <div className="booking-form-fields">

              <div className="booking-field booking-field-full">

                <label htmlFor="message">
                  Información adicional
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Si deseas, puedes compartir alguna información adicional..."
                  value={formData.message}
                  onChange={handleChange}
                />

              </div>

            </div>
          </div>


          {/* MENSAJE DE ÉXITO */}
          {successMessage && (
            <div className="booking-message booking-success">
              {successMessage}
            </div>
          )}


          {/* MENSAJE DE ERROR */}
          {errorMessage && (
            <div className="booking-message booking-error">
              {errorMessage}
            </div>
          )}


          {/* BOTÓN */}
          <button
            type="submit"
            className="booking-submit"
            disabled={loading}
          >
            {loading
              ? "Enviando solicitud..."
              : "Enviar solicitud"}

            {!loading && (
              <span>↗</span>
            )}
          </button>


          <p className="booking-disclaimer">
            El envío de esta solicitud no representa una
            cita confirmada. Nos pondremos en contacto
            contigo para confirmar disponibilidad y detalles.
          </p>

        </form>
      </section>
    </main>
  );
}

export default BookingPage;