import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

// =====================================================
// PÁGINAS PÚBLICAS
// =====================================================

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import BookingPage from "./pages/BookingPage";
import TreatmentRequestPage from "./pages/TreatmentRequestPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";

// =====================================================
// PÁGINAS ADMIN
// =====================================================

import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminSolicitudesPage from "./pages/AdminSolicitudesPage";
import AdminRequestsPage from "./pages/AdminRequestsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";

function App() {
  return (
    <BrowserRouter>

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />


      {/* =================================================
          RUTAS
      ================================================= */}

      <Routes>

        {/* =================================================
            PÁGINAS PÚBLICAS
        ================================================= */}

        {/* INICIO */}
        <Route
          path="/"
          element={<HomePage />}
        />

        {/* SOBRE MÍ */}
        <Route
          path="/sobre-mi"
          element={<AboutPage />}
        />

        {/* AGENDAR CONSULTA */}
        <Route
          path="/agendar"
          element={<BookingPage />}
        />

        {/* SOLICITAR TRATAMIENTO */}
        <Route
          path="/solicitar-tratamiento"
          element={<TreatmentRequestPage />}
        />

        {/* SERVICIOS */}
        <Route
          path="/servicios"
          element={<ServicesPage />}
        />

        {/* CONTACTO */}
        <Route
          path="/contacto"
          element={<ContactPage />}
        />


        {/* =================================================
            PANEL DE ADMINISTRACIÓN
        ================================================= */}

        {/* LOGIN */}
        <Route
          path="/admin"
          element={<AdminLoginPage />}
        />

        {/* DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboardPage />}
        />

        {/* SOLICITUDES */}
        <Route
          path="/admin/solicitudes"
          element={<AdminSolicitudesPage />}
        />

        {/* REQUESTS */}
        <Route
          path="/admin/requested"
          element={<AdminRequestsPage />}
        />

        <Route
  path="/admin/citas"
  element={<AdminBookingsPage />}
/>
      </Routes>


      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />

    </BrowserRouter>
  );
}

export default App;