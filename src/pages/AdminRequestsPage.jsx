import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminRequestsPage.css";

function AdminRequestsPage() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     CERRAR SESIÓN LOCAL
  ===================================================== */

  const clearAdminSession = () => {
    localStorage.removeItem("doctorAdmin");
    localStorage.removeItem("doctorAdminToken");

    /*
     * También eliminamos el nombre antiguo
     * por si quedó guardado de versiones anteriores.
     */
    localStorage.removeItem("adminToken");

    navigate("/admin", {
      replace: true,
    });
  };

  /* =====================================================
     CARGAR SOLICITUDES
  ===================================================== */

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("doctorAdminToken");

      /*
       * No existe token.
       */

      if (!token) {
        clearAdminSession();
        return;
      }

      const response = await fetch(
        "http://localhost:3000/api/admin/treatments",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      /* =================================================
         LEER RESPUESTA
      ================================================= */

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "El servidor devolvió una respuesta inválida."
        );
      }

      /* =================================================
         SESIÓN NO AUTORIZADA
      ================================================= */

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        clearAdminSession();
        return;
      }

      /* =================================================
         ERROR DEL SERVIDOR
      ================================================= */

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "No se pudieron cargar las solicitudes."
        );
      }

      /* =================================================
         GUARDAR SOLICITUDES
      ================================================= */

      setRequests(
        Array.isArray(data.treatments)
          ? data.treatments
          : []
      );

    } catch (err) {
      console.error(
        "❌ Error cargando solicitudes:",
        err
      );

      setError(
        err.message ||
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
    loadRequests();
  }, []);

  /* =====================================================
     ACTUALIZAR ESTADO
  ===================================================== */

  const updateStatus = async (id, status) => {
    try {
      setError("");

      const token =
        localStorage.getItem("doctorAdminToken");

      if (!token) {
        clearAdminSession();
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/admin/treatments/${id}/status`,
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
         ACTUALIZAR UI
      ================================================= */

      setRequests((previous) =>
        previous.map((request) =>
          request.id === id
            ? {
                ...request,
                status,
              }
            : request
        )
      );

    } catch (err) {
      console.error(
        "❌ Error actualizando solicitud:",
        err
      );

      setError(
        err.message ||
          "No se pudo actualizar la solicitud."
      );
    }
  };

  /* =====================================================
     ELIMINAR SOLICITUD
  ===================================================== */

  const deleteRequest = async (id) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar esta solicitud?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const token =
        localStorage.getItem("doctorAdminToken");

      if (!token) {
        clearAdminSession();
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/admin/treatments/${id}`,
        {
          method: "DELETE",

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
            "No se pudo eliminar la solicitud."
        );
      }

      /* =================================================
         ELIMINAR DE LA INTERFAZ
      ================================================= */

      setRequests((previous) =>
        previous.filter(
          (request) => request.id !== id
        )
      );

    } catch (err) {
      console.error(
        "❌ Error eliminando solicitud:",
        err
      );

      setError(
        err.message ||
          "No se pudo eliminar la solicitud."
      );
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="admin-requests-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="admin-page-header">

        <div>

          <span className="admin-page-eyebrow">
            ADMINISTRACIÓN · SOLICITUDES
          </span>

          <h1>
            Solicitudes de
            <br />
            <em>tratamiento.</em>
          </h1>

          <p>
            Revisa y administra las solicitudes
            recibidas desde el sitio web.
          </p>

        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={loadRequests}
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

      <section className="admin-requests-content">

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="admin-empty-state">

            <span>
              01
            </span>

            <h2>
              Cargando solicitudes...
            </h2>

            <p>
              Estamos consultando la información.
            </p>

          </div>
        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <div className="admin-error-state">

            <span>
              !
            </span>

            <h2>
              No pudimos cargar las solicitudes.
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={loadRequests}
            >
              Intentar nuevamente
            </button>

          </div>
        )}


        {/* =================================================
            SIN SOLICITUDES
        ================================================= */}

        {!loading &&
          !error &&
          requests.length === 0 && (

            <div className="admin-empty-state">

              <span>
                00
              </span>

              <h2>
                No hay solicitudes
                <br />
                <em>todavía.</em>
              </h2>

              <p>
                Cuando alguien envíe una solicitud
                de tratamiento aparecerá aquí.
              </p>

            </div>
          )}


        {/* =================================================
            LISTA DE SOLICITUDES
        ================================================= */}

        {!loading &&
          !error &&
          requests.length > 0 && (

            <div className="admin-requests-list">

              {requests.map((request) => (

                <article
                  className="admin-request-card"
                  key={request.id}
                >

                  {/* =================================================
                      TOP
                  ================================================= */}

                  <div className="admin-request-top">

                    <span>
                      #{request.id}
                    </span>

                    <select
                      value={
                        request.status ||
                        "Pendiente"
                      }
                      onChange={(event) =>
                        updateStatus(
                          request.id,
                          event.target.value
                        )
                      }
                      className="admin-request-status"
                    >

                      <option value="Pendiente">
                        Pendiente
                      </option>

                      <option value="En revisión">
                        En revisión
                      </option>

                      <option value="Confirmada">
                        Confirmada
                      </option>

                      <option value="Enviado">
                        Enviado
                      </option>

                      <option value="Completada">
                        Completada
                      </option>

                      <option value="Cancelada">
                        Cancelada
                      </option>

                    </select>

                  </div>


                  {/* =================================================
                      INFORMACIÓN
                  ================================================= */}

                  <div className="admin-request-main">

                    {/* SOLICITANTE */}

                    <div>

                      <span className="admin-request-label">
                        SOLICITANTE
                      </span>

                      <h2>
                        {request.name ||
                          "Sin nombre"}
                      </h2>

                      <p>
                        {request.email ||
                          "Sin correo"}
                      </p>

                      <p>
                        {request.phone ||
                          "Sin teléfono"}
                      </p>

                    </div>


                    {/* TRATAMIENTO */}

                    <div>

                      <span className="admin-request-label">
                        TRATAMIENTO
                      </span>

                      <h3>
                        {request.treatment ||
                          "Sin especificar"}
                      </h3>

                      <p>
                        {request.delivery ||
                          "Sin especificar"}
                      </p>

                    </div>


                    {/* DESTINO */}

                    <div>

                      <span className="admin-request-label">
                        DESTINO
                      </span>

                      <p>
                        {request.city || "—"}
                        {request.state
                          ? `, ${request.state}`
                          : ""}
                      </p>

                      <p>
                        {request.country || "—"}
                      </p>

                      <p>
                        C.P.{" "}
                        {request.postal_code ||
                          "—"}
                      </p>

                    </div>

                  </div>


                  {/* =================================================
                      MENSAJE
                  ================================================= */}

                  {request.message && (
                    <div className="admin-request-message">

                      <span>
                        INFORMACIÓN ADICIONAL
                      </span>

                      <p>
                        {request.message}
                      </p>

                    </div>
                  )}


                  {/* =================================================
                      FOOTER
                  ================================================= */}

                  <div className="admin-request-footer">

                    <span className="admin-request-date">

                      {request.created_at
                        ? new Date(
                            request.created_at
                          ).toLocaleString(
                            "es-MX"
                          )
                        : ""}

                    </span>

                    <button
                      type="button"
                      className="admin-request-delete"
                      onClick={() =>
                        deleteRequest(
                          request.id
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

export default AdminRequestsPage;