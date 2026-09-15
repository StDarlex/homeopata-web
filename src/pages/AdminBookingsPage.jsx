import { useEffect, useState } from "react";
import "./AdminBookingsPage.css";

function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     CARGAR CITAS
  ===================================================== */

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "No hay una sesión de administrador válida."
        );
      }

      const response = await fetch(
        "https://homeopata-web-backend.onrender.com/api/admin/bookings",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "No se pudieron cargar las citas."
        );
      }

      setBookings(data.bookings || []);

    } catch (err) {
      console.error(
        "❌ Error cargando citas:",
        err
      );

      setError(
        err.message ||
          "No se pudieron cargar las citas."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     CARGAR AL ENTRAR
  ===================================================== */

  useEffect(() => {
    loadBookings();
  }, []);

  /* =====================================================
     ACTUALIZAR ESTADO
  ===================================================== */

  const updateStatus = async (id, status) => {
    try {
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "La sesión de administrador no es válida."
        );
      }

      const response = await fetch(
        `https://homeopata-web-backend.onrender.com/api/admin/bookings/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "No se pudo actualizar el estado."
        );
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status,
              }
            : booking
        )
      );

    } catch (err) {
      console.error(
        "❌ Error actualizando cita:",
        err
      );

      setError(
        err.message ||
          "No se pudo actualizar la cita."
      );
    }
  };

  /* =====================================================
     ELIMINAR CITA
  ===================================================== */

  const deleteBooking = async (id) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar esta cita?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "La sesión de administrador no es válida."
        );
      }

      const response = await fetch(
        `https://homeopata-web-backend.onrender.com/api/admin/bookings/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "No se pudo eliminar la cita."
        );
      }

      setBookings((previous) =>
        previous.filter(
          (booking) => booking.id !== id
        )
      );

    } catch (err) {
      console.error(
        "❌ Error eliminando cita:",
        err
      );

      setError(
        err.message ||
          "No se pudo eliminar la cita."
      );
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="admin-bookings-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="admin-page-header">

        <div>

          <span className="admin-page-eyebrow">
            ADMINISTRACIÓN · CITAS
          </span>

          <h1>
            Consultas y
            <br />
            <em>citas.</em>
          </h1>

          <p>
            Revisa y administra las solicitudes
            de consulta recibidas desde el sitio web.
          </p>

        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={loadBookings}
          disabled={loading}
        >
          {loading
            ? "Actualizando..."
            : "Actualizar ↻"}
        </button>

      </header>


      {/* =================================================
          CONTENIDO
      ================================================= */}

      <section className="admin-bookings-content">

        {/* LOADING */}

        {loading && (
          <div className="admin-empty-state">

            <span>01</span>

            <h2>
              Cargando citas...
            </h2>

            <p>
              Estamos consultando la información.
            </p>

          </div>
        )}


        {/* ERROR */}

        {!loading && error && (
          <div className="admin-error-state">

            <span>!</span>

            <h2>
              No pudimos cargar las citas.
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={loadBookings}
            >
              Intentar nuevamente
            </button>

          </div>
        )}


        {/* SIN CITAS */}

        {!loading &&
          !error &&
          bookings.length === 0 && (

            <div className="admin-empty-state">

              <span>00</span>

              <h2>
                No hay citas
                <br />
                <em>todavía.</em>
              </h2>

              <p>
                Cuando alguien solicite una consulta
                aparecerá aquí.
              </p>

            </div>
          )}


        {/* CITAS */}

        {!loading &&
          !error &&
          bookings.length > 0 && (

            <div className="admin-bookings-list">

              {bookings.map((booking) => (

                <article
                  className="admin-booking-card"
                  key={booking.id}
                >

                  {/* TOP */}

                  <div className="admin-booking-top">

                    <span>
                      #{booking.id}
                    </span>

                    <select
                      value={
                        booking.status ||
                        "Pendiente"
                      }
                      onChange={(event) =>
                        updateStatus(
                          booking.id,
                          event.target.value
                        )
                      }
                      className="admin-booking-status"
                    >

                      <option value="Pendiente">
                        Pendiente
                      </option>

                      <option value="Confirmada">
                        Confirmada
                      </option>

                      <option value="Completada">
                        Completada
                      </option>

                      <option value="Cancelada">
                        Cancelada
                      </option>

                    </select>

                  </div>


                  {/* INFORMACIÓN */}

                  <div className="admin-booking-main">

                    {/* PACIENTE */}

                    <div>

                      <span className="admin-booking-label">
                        PACIENTE
                      </span>

                      <h2>
                        {booking.name}
                      </h2>

                      <p>
                        {booking.email}
                      </p>

                      <p>
                        {booking.phone}
                      </p>

                    </div>


                    {/* CONSULTA */}

                    <div>

                      <span className="admin-booking-label">
                        CONSULTA
                      </span>

                      <h3>
                        {booking.type}
                      </h3>

                      <p>
                        {booking.modality}
                      </p>

                    </div>


                    {/* FECHA */}

                    <div>

                      <span className="admin-booking-label">
                        FECHA Y HORARIO
                      </span>

                      <p>
                        {booking.date}
                      </p>

                      <p>
                        {booking.time}
                      </p>

                    </div>

                  </div>


                  {/* MENSAJE */}

                  {booking.message && (
                    <div className="admin-booking-message">

                      <span>
                        INFORMACIÓN ADICIONAL
                      </span>

                      <p>
                        {booking.message}
                      </p>

                    </div>
                  )}


                  {/* FOOTER */}

                  <div className="admin-booking-footer">

                    <span className="admin-booking-date">

                      {booking.created_at
                        ? new Date(
                            booking.created_at
                          ).toLocaleString(
                            "es-MX"
                          )
                        : ""}

                    </span>

                    <button
                      type="button"
                      className="admin-booking-delete"
                      onClick={() =>
                        deleteBooking(
                          booking.id
                        )
                      }
                    >
                      Eliminar
                    </button>

                  </div>

                </article>

              ))}

            </div>
          )}

      </section>

    </main>
  );
}

export default AdminBookingsPage;