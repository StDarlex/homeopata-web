import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminSolicitudesPage.css";

function AdminSolicitudesPage() {
  const navigate = useNavigate();

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolicitud, setSelectedSolicitud] =
    useState(null);
  const [error, setError] = useState("");

  /* =====================================================
     SESIÓN
  ===================================================== */

  const getToken = () => {
    return localStorage.getItem("doctorAdminToken");
  };

  const clearAdminSession = () => {
    localStorage.removeItem("doctorAdmin");
    localStorage.removeItem("doctorAdminToken");

    // Eliminar token antiguo por seguridad
    localStorage.removeItem("adminToken");

    navigate("/admin", {
      replace: true,
    });
  };

  /* =====================================================
     CARGAR SOLICITUDES
  ===================================================== */

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        clearAdminSession();
        return;
      }

      const response = await fetch(
        "https://homeopata-web-backend.onrender.com/api/admin/solicitudes",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "El servidor devolvió una respuesta inválida."
        );
      }

      /* =================================================
         SESIÓN EXPIRADA / TOKEN INVÁLIDO
      ================================================= */

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        clearAdminSession();
        return;
      }

      /* =================================================
         ERROR
      ================================================= */

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "No se pudieron cargar las solicitudes."
        );
      }

      /* =================================================
         GUARDAR DATOS
      ================================================= */

      setSolicitudes(
        Array.isArray(data.solicitudes)
          ? data.solicitudes
          : []
      );
    } catch (error) {
      console.error(
        "❌ Error cargando solicitudes:",
        error
      );

      setError(
        error.message ||
          "No se pudieron cargar las solicitudes."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     CARGAR AL ENTRAR
  ===================================================== */

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  /* =====================================================
     CAMBIAR ESTADO
  ===================================================== */

  const cambiarEstado = async (id, estado) => {
    try {
      setError("");

      const token = getToken();

      if (!token) {
        clearAdminSession();
        return;
      }

      const response = await fetch(
        `https://homeopata-web-backend.onrender.com/api/admin/solicitudes/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: estado,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "El servidor devolvió una respuesta inválida."
        );
      }

      /* =================================================
         TOKEN INVÁLIDO
      ================================================= */

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        clearAdminSession();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "No se pudo actualizar el estado."
        );
      }

      /* =================================================
         ACTUALIZAR TABLA
      ================================================= */

      setSolicitudes((previous) =>
        previous.map((solicitud) =>
          solicitud.id === id
            ? {
                ...solicitud,
                status: estado,
              }
            : solicitud
        )
      );

      /* =================================================
         ACTUALIZAR MODAL
      ================================================= */

      setSelectedSolicitud((previous) =>
        previous && previous.id === id
          ? {
              ...previous,
              status: estado,
            }
          : previous
      );
    } catch (error) {
      console.error(
        "❌ Error actualizando solicitud:",
        error
      );

      setError(
        error.message ||
          "No se pudo actualizar la solicitud."
      );
    }
  };

  /* =====================================================
     CLASE DEL ESTADO
  ===================================================== */

  const obtenerClaseEstado = (status) => {
    switch (status) {
      case "Revisada":
        return "status-reviewed";

      case "Cancelada":
        return "status-cancelled";

      default:
        return "status-pending";
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="admin-solicitudes-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="admin-page-header">

        <div>

          <span className="admin-eyebrow">
            ADMINISTRACIÓN · SOLICITUDES
          </span>

          <h1>
            Solicitudes de
            <br />
            <em>tratamiento.</em>
          </h1>

          <p>
            Revisa y administra las solicitudes recibidas
            desde el sitio web.
          </p>

        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={cargarSolicitudes}
          disabled={loading}
        >
          {loading
            ? "Actualizando..."
            : "↻ Actualizar"}
        </button>

      </header>


      {/* =================================================
          ERROR GENERAL
      ================================================= */}

      {error && (
        <div className="admin-error-state">

          <span>!</span>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={cargarSolicitudes}
          >
            Intentar nuevamente
          </button>

        </div>
      )}


      {/* =================================================
          ESTADÍSTICAS
      ================================================= */}

      <section className="admin-stats">

        <article>
          <span>Total</span>

          <strong>
            {solicitudes.length}
          </strong>
        </article>


        <article>
          <span>Pendientes</span>

          <strong>
            {
              solicitudes.filter(
                (item) =>
                  !item.status ||
                  item.status === "Pendiente"
              ).length
            }
          </strong>
        </article>


        <article>
          <span>Revisadas</span>

          <strong>
            {
              solicitudes.filter(
                (item) =>
                  item.status === "Revisada"
              ).length
            }
          </strong>
        </article>


        <article>
          <span>Canceladas</span>

          <strong>
            {
              solicitudes.filter(
                (item) =>
                  item.status === "Cancelada"
              ).length
            }
          </strong>
        </article>

      </section>


      {/* =================================================
          TABLA
      ================================================= */}

      <section className="admin-table-section">

        <div className="admin-section-heading">

          <div>

            <span>
              SOLICITUDES RECIBIDAS
            </span>

            <h2>
              Tratamientos
            </h2>

          </div>

          <span className="admin-counter">
            {solicitudes.length} registros
          </span>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="admin-empty-state">

            <span className="admin-loading-icon">
              ◌
            </span>

            <h3>
              Cargando solicitudes...
            </h3>

            <p>
              Estamos consultando la información
              del servidor.
            </p>

          </div>

        ) : solicitudes.length === 0 ? (

          /* =================================================
             VACÍO
          ================================================= */

          <div className="admin-empty-state">

            <span>
              ○
            </span>

            <h3>
              No hay solicitudes
            </h3>

            <p>
              Cuando alguien solicite un tratamiento,
              aparecerá aquí.
            </p>

          </div>

        ) : (

          /* =================================================
             TABLA
          ================================================= */

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>
                  <th>Paciente</th>
                  <th>Tratamiento</th>
                  <th>Entrega</th>
                  <th>Ubicación</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>

              </thead>


              <tbody>

                {solicitudes.map((solicitud) => (

                  <tr key={solicitud.id}>

                    {/* PACIENTE */}

                    <td>

                      <div className="patient-cell">

                        <strong>
                          {solicitud.name ||
                            "Sin nombre"}
                        </strong>

                        <span>
                          {solicitud.email ||
                            "Sin correo"}
                        </span>

                      </div>

                    </td>


                    {/* TRATAMIENTO */}

                    <td>
                      {solicitud.treatment ||
                        "Sin especificar"}
                    </td>


                    {/* ENTREGA */}

                    <td>
                      {solicitud.delivery ||
                        "Sin especificar"}
                    </td>


                    {/* UBICACIÓN */}

                    <td>

                      <span className="location-cell">

                        {solicitud.city ||
                          "Sin ciudad"}

                        {solicitud.state
                          ? `, ${solicitud.state}`
                          : ""}

                      </span>

                    </td>


                    {/* ESTADO */}

                    <td>

                      <span
                        className={`admin-status ${obtenerClaseEstado(
                          solicitud.status
                        )}`}
                      >
                        {solicitud.status ||
                          "Pendiente"}
                      </span>

                    </td>


                    {/* ACCIÓN */}

                    <td>

                      <button
                        type="button"
                        className="view-button"
                        onClick={() =>
                          setSelectedSolicitud(
                            solicitud
                          )
                        }
                      >
                        Ver →
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* =================================================
          MODAL
      ================================================= */}

      {selectedSolicitud && (

        <div
          className="admin-modal-overlay"
          onClick={() =>
            setSelectedSolicitud(null)
          }
        >

          <div
            className="admin-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="admin-modal-close"
              onClick={() =>
                setSelectedSolicitud(null)
              }
            >
              ×
            </button>


            <span className="admin-eyebrow">
              SOLICITUD #{selectedSolicitud.id}
            </span>


            <h2>
              {selectedSolicitud.name ||
                "Sin nombre"}
            </h2>


            <div className="request-details">

              <div>
                <span>Correo</span>

                <strong>
                  {selectedSolicitud.email ||
                    "—"}
                </strong>
              </div>


              <div>
                <span>Teléfono</span>

                <strong>
                  {selectedSolicitud.phone ||
                    "—"}
                </strong>
              </div>


              <div>
                <span>Tratamiento</span>

                <strong>
                  {selectedSolicitud.treatment ||
                    "—"}
                </strong>
              </div>


              <div>
                <span>Entrega</span>

                <strong>
                  {selectedSolicitud.delivery ||
                    "—"}
                </strong>
              </div>


              <div>
                <span>Dirección</span>

                <strong>
                  {selectedSolicitud.address ||
                    "—"}
                </strong>
              </div>


              <div>
                <span>Ciudad</span>

                <strong>
                  {selectedSolicitud.city ||
                    "—"}
                </strong>
              </div>


              <div>
                <span>Estado / Provincia</span>

                <strong>
                  {selectedSolicitud.state ||
                    "—"}
                </strong>
              </div>


              <div>
                <span>País</span>

                <strong>
                  {selectedSolicitud.country ||
                    "—"}
                </strong>
              </div>


              <div>
                <span>Código postal</span>

                <strong>
                  {selectedSolicitud.postalCode ||
                    selectedSolicitud.postal_code ||
                    "—"}
                </strong>
              </div>

            </div>


            {/* =================================================
                MENSAJE
            ================================================= */}

            {selectedSolicitud.message && (

              <div className="request-message">

                <span>
                  Información adicional
                </span>

                <p>
                  {selectedSolicitud.message}
                </p>

              </div>

            )}


            {/* =================================================
                ACCIONES
            ================================================= */}

            <div className="request-actions">

              <span>
                Actualizar estado
              </span>

              <div>

                <button
                  type="button"
                  className="status-action pending"
                  onClick={() =>
                    cambiarEstado(
                      selectedSolicitud.id,
                      "Pendiente"
                    )
                  }
                >
                  Pendiente
                </button>


                <button
                  type="button"
                  className="status-action reviewed"
                  onClick={() =>
                    cambiarEstado(
                      selectedSolicitud.id,
                      "Revisada"
                    )
                  }
                >
                  Revisada
                </button>


                <button
                  type="button"
                  className="status-action cancelled"
                  onClick={() =>
                    cambiarEstado(
                      selectedSolicitud.id,
                      "Cancelada"
                    )
                  }
                >
                  Cancelada
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default AdminSolicitudesPage;