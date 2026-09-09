import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminDashboardPage.css";

const API_URL = "http://localhost:3000";

const EMPTY_STATISTICS = {
  bookings: 0,
  treatments: 0,
  bookingsPending: 0,
  treatmentsPending: 0,
  totalRequests: 0,
  totalPending: 0,
};

function AdminDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [admin, setAdmin] = useState(null);

  const [statistics, setStatistics] = useState(
    EMPTY_STATISTICS
  );

  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  /* =====================================================
     OBTENER SESIÓN
  ===================================================== */

  const getSession = () => {
    const token = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("doctorAdmin");

    if (!token || !storedAdmin) {
      return null;
    }

    try {
      const parsedAdmin = JSON.parse(storedAdmin);

      if (!parsedAdmin || !parsedAdmin.email) {
        return null;
      }

      return {
        token,
        admin: parsedAdmin,
      };
    } catch (error) {
      console.error(
        "❌ Error leyendo sesión:",
        error
      );

      return null;
    }
  };

  /* =====================================================
     CERRAR SESIÓN LOCAL
  ===================================================== */

  const clearSession = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("doctorAdmin");

    setAdmin(null);

    navigate("/admin", {
      replace: true,
    });
  };

  /* =====================================================
     VERIFICAR SESIÓN AL ENTRAR
  ===================================================== */

  useEffect(() => {
    const session = getSession();

    if (!session) {
      clearSession();
      return;
    }

    setAdmin(session.admin);
  }, []);

  /* =====================================================
     CARGAR DASHBOARD
  ===================================================== */

  useEffect(() => {
    if (!admin) return;

    let cancelled = false;

    const loadDashboard = async () => {
      setLoadingStats(true);
      setStatsError("");

      const session = getSession();

      if (!session) {
        clearSession();
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/admin/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.token}`,
              Accept: "application/json",
            },
          }
        );

        let data = null;

        try {
          data = await response.json();
        } catch {
          throw new Error(
            "El servidor devolvió una respuesta inválida."
          );
        }

        /*
         * SESIÓN EXPIRADA O TOKEN INVÁLIDO
         */

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          clearSession();
          return;
        }

        /*
         * ERROR DEL BACKEND
         */

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message ||
              "No se pudieron cargar las estadísticas."
          );
        }

        if (cancelled) return;

        setStatistics({
          ...EMPTY_STATISTICS,
          ...(data.statistics || {}),
        });

      } catch (error) {
        if (cancelled) return;

        console.error(
          "❌ Error cargando dashboard:",
          error
        );

        setStatsError(
          error.message ||
            "No se pudieron cargar las estadísticas."
        );
      } finally {
        if (!cancelled) {
          setLoadingStats(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [admin]);

  /* =====================================================
     ACTUALIZAR MANUALMENTE
  ===================================================== */

  const handleRefresh = () => {
    if (!admin) return;

    const event = new Event("admin-dashboard-refresh");

    window.dispatchEvent(event);
  };

  /* =====================================================
     CERRAR SESIÓN
  ===================================================== */

  const handleLogout = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      if (token) {
        await fetch(
          `${API_URL}/api/admin/logout`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error(
        "❌ Error cerrando sesión:",
        error
      );
    } finally {
      clearSession();
    }
  };

  /* =====================================================
     RUTA ACTIVA
  ===================================================== */

  const isActive = (path) => {
    return location.pathname === path;
  };

  /* =====================================================
     LOADING DE SESIÓN
  ===================================================== */

  if (!admin) {
    return (
      <main className="admin-dashboard-loading">
        <div className="admin-loader">
          <span></span>
        </div>

        <p>
          Verificando sesión...
        </p>
      </main>
    );
  }

  /* =====================================================
     DASHBOARD
  ===================================================== */

  return (
    <main className="admin-dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="admin-sidebar">

        <div className="admin-sidebar-brand">

          <div className="admin-sidebar-mark">
            AA
          </div>

          <div>
            <strong>
              Dr. Alejandro
            </strong>

            <span>
              Administración
            </span>
          </div>

        </div>


        <nav className="admin-navigation">

          <span className="admin-navigation-title">
            PANEL
          </span>


          <Link
            to="/admin/dashboard"
            className={`admin-nav-link ${
              isActive("/admin/dashboard")
                ? "active"
                : ""
            }`}
          >
            <span className="admin-nav-icon">
              ⌂
            </span>

            Dashboard
          </Link>


          <Link
            to="/admin/solicitudes"
            className={`admin-nav-link ${
              isActive("/admin/solicitudes")
                ? "active"
                : ""
            }`}
          >
            <span className="admin-nav-icon">
              □
            </span>

            Solicitudes
          </Link>


          <Link
            to="/admin/citas"
            className={`admin-nav-link ${
              isActive("/admin/citas")
                ? "active"
                : ""
            }`}
          >
            <span className="admin-nav-icon">
              ◷
            </span>

            Citas
          </Link>


          <Link
            to="/admin/mensajes"
            className={`admin-nav-link ${
              isActive("/admin/mensajes")
                ? "active"
                : ""
            }`}
          >
            <span className="admin-nav-icon">
              ○
            </span>

            Mensajes
          </Link>


          <span className="admin-navigation-title admin-navigation-settings">
            SISTEMA
          </span>


          <Link
            to="/admin/configuracion"
            className={`admin-nav-link ${
              isActive("/admin/configuracion")
                ? "active"
                : ""
            }`}
          >
            <span className="admin-nav-icon">
              ⚙
            </span>

            Configuración
          </Link>

        </nav>


        {/* =================================================
            USUARIO
        ================================================= */}

        <div className="admin-sidebar-bottom">

          <div className="admin-user">

            <div className="admin-user-avatar">

              {admin.name
                ? admin.name
                    .charAt(0)
                    .toUpperCase()
                : admin.email
                    ?.charAt(0)
                    .toUpperCase() || "A"}

            </div>


            <div className="admin-user-info">

              <strong>
                {admin.name ||
                  "Administrador"}
              </strong>

              <span>
                Administrador
              </span>

            </div>

          </div>


          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >

            <span>
              ↪
            </span>

            Cerrar sesión

          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN
      ================================================= */}

      <section className="admin-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="admin-topbar">

          <div>

            <span className="admin-topbar-eyebrow">
              PANEL DE CONTROL
            </span>

            <h1>
              Buenos días,{" "}

              <em>
                {admin.name ||
                  "Doctor"}.
              </em>
            </h1>

          </div>


          <div className="admin-topbar-right">

            <span className="admin-status">

              <i></i>

              Sistema activo

            </span>


            <div className="admin-topbar-date">

              {new Intl.DateTimeFormat(
                "es-MX",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              ).format(new Date())}

            </div>

          </div>

        </header>


        {/* =================================================
            ERROR
        ================================================= */}

        {statsError && (

          <div className="admin-dashboard-error">

            <span>
              ⚠
            </span>

            <p>
              {statsError}
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.reload();
              }}
            >
              Reintentar
            </button>

          </div>

        )}


        {/* =================================================
            ESTADÍSTICAS
        ================================================= */}

        <section className="admin-stats">

          {/* SOLICITUDES */}

          <article className="admin-stat-card">

            <div className="admin-stat-top">

              <span>
                SOLICITUDES
              </span>

              <span className="admin-stat-number">

                {loadingStats
                  ? "—"
                  : String(
                      statistics.treatmentsPending
                    ).padStart(2, "0")}

              </span>

            </div>


            <h2>
              Solicitudes nuevas
            </h2>

            <p>
              Pendientes de revisión
            </p>


            <Link to="/admin/solicitudes">

              Ver solicitudes

              <span>
                ↗
              </span>

            </Link>

          </article>


          {/* CITAS */}

          <article className="admin-stat-card">

            <div className="admin-stat-top">

              <span>
                CITAS
              </span>

              <span className="admin-stat-number">

                {loadingStats
                  ? "—"
                  : String(
                      statistics.bookingsPending
                    ).padStart(2, "0")}

              </span>

            </div>


            <h2>
              Citas pendientes
            </h2>

            <p>
              Requieren atención
            </p>


            <Link to="/admin/citas">

              Ver citas

              <span>
                ↗
              </span>

            </Link>

          </article>


          {/* TOTAL */}

          <article className="admin-stat-card">

            <div className="admin-stat-top">

              <span>
                SOLICITUDES
              </span>

              <span className="admin-stat-number">

                {loadingStats
                  ? "—"
                  : String(
                      statistics.totalRequests
                    ).padStart(2, "0")}

              </span>

            </div>


            <h2>
              Solicitudes recibidas
            </h2>

            <p>
              Consultas y tratamientos
            </p>


            <Link to="/admin/solicitudes">

              Ver solicitudes

              <span>
                ↗
              </span>

            </Link>

          </article>


          {/* ACTIVIDAD */}

          <article className="admin-stat-card admin-stat-highlight">

            <div className="admin-stat-top">

              <span>
                ACTIVIDAD
              </span>

              <span className="admin-stat-symbol">
                ●
              </span>

            </div>


            <h2>

              {loadingStats
                ? "Cargando..."
                : statistics.totalPending > 0
                ? "Requiere atención"
                : "Todo en orden"}

            </h2>


            <p>

              {loadingStats
                ? "Consultando actividad."
                : statistics.totalPending > 0
                ? `${statistics.totalPending} solicitud${
                    statistics.totalPending === 1
                      ? ""
                      : "es"
                  } pendiente${
                    statistics.totalPending === 1
                      ? ""
                      : "s"
                  }.`
                : "No hay solicitudes pendientes."}

            </p>


            <span className="admin-stat-note">

              {loadingStats
                ? "Consultando sistema"
                : "Sistema operativo"}

            </span>

          </article>

        </section>


        {/* =================================================
            CONTENT GRID
        ================================================= */}

        <section className="admin-content-grid">

          {/* RESUMEN */}

          <article className="admin-panel admin-activity-panel">

            <div className="admin-panel-header">

              <div>

                <span>
                  RESUMEN
                </span>

                <h2>
                  Estado actual
                </h2>

              </div>


              <span className="admin-panel-count">

                {loadingStats
                  ? "—"
                  : statistics.totalRequests}

              </span>

            </div>


            <div className="admin-summary-content">

              <div className="admin-summary-row">

                <span>
                  Solicitudes de tratamiento
                </span>

                <strong>
                  {loadingStats
                    ? "—"
                    : statistics.treatments}
                </strong>

              </div>


              <div className="admin-summary-row">

                <span>
                  Consultas recibidas
                </span>

                <strong>
                  {loadingStats
                    ? "—"
                    : statistics.bookings}
                </strong>

              </div>


              <div className="admin-summary-row">

                <span>
                  Solicitudes pendientes
                </span>

                <strong>
                  {loadingStats
                    ? "—"
                    : statistics.totalPending}
                </strong>

              </div>

            </div>

          </article>


          {/* ACCIONES */}

          <article className="admin-panel admin-actions-panel">

            <div className="admin-panel-header">

              <div>

                <span>
                  ACCIONES
                </span>

                <h2>
                  Accesos rápidos
                </h2>

              </div>

            </div>


            <div className="admin-actions">

              <Link
                to="/admin/solicitudes"
                className="admin-action"
              >

                <span className="admin-action-number">
                  01
                </span>

                <div>

                  <strong>
                    Solicitudes
                  </strong>

                  <small>
                    Revisar tratamientos
                  </small>

                </div>

                <span>
                  ↗
                </span>

              </Link>


              <Link
                to="/admin/citas"
                className="admin-action"
              >

                <span className="admin-action-number">
                  02
                </span>

                <div>

                  <strong>
                    Citas
                  </strong>

                  <small>
                    Administrar consultas
                  </small>

                </div>

                <span>
                  ↗
                </span>

              </Link>


              <Link
                to="/admin/mensajes"
                className="admin-action"
              >

                <span className="admin-action-number">
                  03
                </span>

                <div>

                  <strong>
                    Mensajes
                  </strong>

                  <small>
                    Revisar contacto
                  </small>

                </div>

                <span>
                  ↗
                </span>

              </Link>

            </div>

          </article>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="admin-dashboard-footer">

          <span>
            ÁREA PRIVADA · DR. ALEJANDRO ADAME CAFUENTES
          </span>

          <span>
            Administración
          </span>

        </footer>

      </section>

    </main>
  );
}

export default AdminDashboardPage;
