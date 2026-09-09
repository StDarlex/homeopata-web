import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLoginPage.css";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     COMPROBAR SESIÓN EXISTENTE
  ===================================================== */

  useEffect(() => {
    const storedAdmin = localStorage.getItem("doctorAdmin");
    const storedToken = localStorage.getItem("doctorAdminToken");

    /*
     * Solo comprobamos localStorage.
     * NO hacemos ninguna petición al servidor aquí.
     */

    if (!storedAdmin || !storedToken) {
      return;
    }

    try {
      const admin = JSON.parse(storedAdmin);

      if (!admin || !admin.email) {
        throw new Error("Administrador inválido.");
      }

      /*
       * Ya existe una sesión válida localmente.
       * Mandamos al dashboard una sola vez.
       */

      navigate("/admin/dashboard", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "❌ Datos de sesión inválidos:",
        error
      );

      localStorage.removeItem("doctorAdmin");
      localStorage.removeItem("doctorAdminToken");
    }
  }, [navigate]);

  /* =====================================================
     CAMBIAR CAMPOS
  ===================================================== */

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

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    /*
     * Evita doble click o múltiples envíos.
     */

    if (loading) {
      return;
    }

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError(
        "Ingresa tu correo electrónico y contraseña."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * LIMPIAR CUALQUIER SESIÓN ANTIGUA
       *
       * Importante:
       * El sistema ahora utiliza SOLO doctorAdminToken.
       */

      localStorage.removeItem("adminToken");

      /* =================================================
         PETICIÓN DE LOGIN
      ================================================= */

      const response = await fetch(
        "http://localhost:3000/api/admin/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
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
         VALIDAR LOGIN
      ================================================= */

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Correo o contraseña incorrectos."
        );
      }

      /* =================================================
         VALIDAR SESIÓN DEVUELTA POR BACKEND
      ================================================= */

      if (!data.token) {
        throw new Error(
          "El servidor no devolvió el token de administrador."
        );
      }

      if (!data.admin) {
        throw new Error(
          "El servidor no devolvió los datos del administrador."
        );
      }

      /* =================================================
         GUARDAR SESIÓN
      ================================================= */

      localStorage.setItem(
        "doctorAdmin",
        JSON.stringify(data.admin)
      );

      localStorage.setItem(
        "doctorAdminToken",
        data.token
      );

      console.log(
        "✅ Sesión de administrador iniciada correctamente."
      );

      /* =================================================
         REDIRECCIÓN
      ================================================= */

      navigate("/admin/dashboard", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "❌ Error iniciando sesión:",
        error
      );

      setError(
        error.message ||
          "No se pudo iniciar sesión. Intenta nuevamente."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="admin-login-page">

      <section className="admin-login-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="admin-login-header">

          <span className="admin-login-eyebrow">
            ÁREA PRIVADA
          </span>

          <div className="admin-login-mark">
            AA
          </div>

          <h1>
            Administración
          </h1>

          <p>
            Panel privado del Dr. Alejandro Adame Cafuentes.
          </p>

        </div>


        {/* =================================================
            FORMULARIO
        ================================================= */}

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          {/* CORREO */}

          <div className="admin-field">

            <label htmlFor="admin-email">
              Correo electrónico
            </label>

            <input
              id="admin-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo del administrador"
              autoComplete="username"
              disabled={loading}
              required
            />

          </div>


          {/* CONTRASEÑA */}

          <div className="admin-field">

            <label htmlFor="admin-password">
              Contraseña
            </label>

            <input
              id="admin-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              autoComplete="current-password"
              disabled={loading}
              required
            />

          </div>


          {/* ERROR */}

          {error && (
            <div
              className="admin-login-error"
              role="alert"
            >
              {error}
            </div>
          )}


          {/* BOTÓN */}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >

            {loading
              ? "Verificando..."
              : "Iniciar sesión"}

            {!loading && (
              <span>
                ↗
              </span>
            )}

          </button>

        </form>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="admin-login-footer">

          <span>
            Acceso restringido
          </span>

          <span>
            © {new Date().getFullYear()} Dr. Alejandro
          </span>

        </div>

      </section>

    </main>
  );
}

export default AdminLoginPage;
