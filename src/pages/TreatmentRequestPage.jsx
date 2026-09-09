import { useState } from "react";
import { Link } from "react-router-dom";
import "./TreatmentRequestPage.css";

function TreatmentRequestPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    shipping: "Local",
    address: "",
    city: "",
    state: "",
    country: "México",
    postalCode: "",
    treatment: "",
    quantity: "1",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/treatment-request",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),

            treatment: formData.treatment.trim(),

            delivery: formData.shipping,

            address: formData.address.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            country: formData.country.trim(),
            postalCode: formData.postalCode.trim(),

            quantity: formData.quantity,

            message: formData.message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "No se pudo enviar la solicitud."
        );
      }

      console.log(
        "✅ Solicitud de tratamiento enviada:",
        data
      );

      setSubmitted(true);

    } catch (error) {
      console.error(
        "❌ Error enviando solicitud:",
        error
      );

      setError(
        error.message ||
          "No pudimos enviar tu solicitud. Intenta nuevamente."
      );

    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="treatment-page">
        <section className="treatment-success">

          <span className="treatment-eyebrow">
            SOLICITUD RECIBIDA
          </span>

          <h1>
            Gracias por
            <br />
            <em>tu solicitud.</em>
          </h1>

          <p>
            Hemos recibido correctamente la información
            de tu solicitud. El consultorio revisará los
            datos y se pondrá en contacto contigo para
            confirmar disponibilidad, costo y detalles
            de entrega.
          </p>

          <div className="treatment-success-folio">
            <span>ESTADO</span>

            <strong>
              PENDIENTE DE REVISIÓN
            </strong>
          </div>

          <Link
            to="/"
            className="treatment-back"
          >
            ← Volver al inicio
          </Link>

        </section>
      </main>
    );
  }

  return (
    <main className="treatment-page">

      <section className="treatment">

        <div className="treatment-intro">

          <span className="treatment-eyebrow">
            SOLICITUD DE TRATAMIENTO
          </span>

          <h1>
            Recibe tu
            <br />
            tratamiento <em>donde estés.</em>
          </h1>

          <p>
            Completa los siguientes datos para solicitar
            tu tratamiento. Revisaremos tu solicitud y
            posteriormente nos pondremos en contacto
            contigo para confirmar disponibilidad y
            detalles de entrega.
          </p>

          <div className="treatment-info">
            <span>01</span>
            <p>
              Completa tus datos y la información de entrega.
            </p>
          </div>

          <div className="treatment-info">
            <span>02</span>
            <p>
              Revisaremos tu solicitud personalmente.
            </p>
          </div>

          <div className="treatment-info">
            <span>03</span>
            <p>
              Recibirás una confirmación por correo electrónico.
            </p>
          </div>

          <Link
            to="/servicios"
            className="treatment-back"
          >
            ← Volver a servicios
          </Link>

        </div>

        <div className="treatment-form-wrapper">

          <form
            className="treatment-form"
            onSubmit={handleSubmit}
          >

            <div className="form-section">

              <div className="form-section-heading">
                <span>01</span>

                <div>
                  <small>TUS DATOS</small>
                  <h2>Información personal</h2>
                </div>
              </div>

              <div className="form-group">

                <label htmlFor="name">
                  Nombre completo
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  disabled={loading}
                  required
                />

              </div>

              <div className="form-row">

                <div className="form-group">

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
                    autoComplete="email"
                    disabled={loading}
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="phone">
                    WhatsApp / teléfono
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Tu número"
                    autoComplete="tel"
                    disabled={loading}
                    required
                  />

                </div>

              </div>

            </div>

            <div className="form-section">

              <div className="form-section-heading">
                <span>02</span>

                <div>
                  <small>ENTREGA</small>
                  <h2>
                    ¿Dónde recibirás tu tratamiento?
                  </h2>
                </div>
              </div>

              <div className="form-group">

                <label htmlFor="shipping">
                  Tipo de envío
                </label>

                <select
                  id="shipping"
                  name="shipping"
                  value={formData.shipping}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="Local">
                    Envío local
                  </option>

                  <option value="Nacional">
                    Envío nacional
                  </option>

                  <option value="Internacional">
                    Envío internacional
                  </option>
                </select>

              </div>

              <div className="form-group">

                <label htmlFor="address">
                  Dirección
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Calle, número, colonia..."
                  disabled={loading}
                  required
                />

              </div>

              <div className="form-row">

                <div className="form-group">

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
                    disabled={loading}
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="state">
                    Estado / Provincia
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Estado"
                    disabled={loading}
                    required
                  />

                </div>

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="country">
                    País
                  </label>

                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />

                </div>

                <div className="form-group">

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
                    disabled={loading}
                    required
                  />

                </div>

              </div>

            </div>

            <div className="form-section">

              <div className="form-section-heading">
                <span>03</span>

                <div>
                  <small>TRATAMIENTO</small>
                  <h2>
                    Cuéntanos qué necesitas
                  </h2>
                </div>
              </div>

              <div className="form-group">

                <label htmlFor="treatment">
                  Tratamiento solicitado
                </label>

                <input
                  id="treatment"
                  name="treatment"
                  type="text"
                  value={formData.treatment}
                  onChange={handleChange}
                  placeholder="Nombre del tratamiento"
                  disabled={loading}
                  required
                />

              </div>

              <div className="form-group">

                <label htmlFor="quantity">
                  Cantidad
                </label>

                <select
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>

              </div>

              <div className="form-group">

                <label htmlFor="message">
                  Comentarios
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="¿Hay algo que quieras comentarnos?"
                  rows="5"
                  disabled={loading}
                />

              </div>

            </div>

            {error && (
              <div
                className="treatment-error"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="treatment-submit-area">

              <button
                type="submit"
                className="treatment-submit"
                disabled={loading}
              >
                {loading
                  ? "Enviando solicitud..."
                  : "Enviar solicitud"}

                {!loading && (
                  <span>↗</span>
                )}
              </button>

              <p>
                Tu información será utilizada únicamente
                para gestionar tu solicitud y coordinar
                la entrega.
              </p>

            </div>

          </form>

        </div>

      </section>

    </main>
  );
}

export default TreatmentRequestPage;