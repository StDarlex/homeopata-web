import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   CONFIGURACIÓN GENERAL
========================================================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origen no permitido por CORS."));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================================================
   VARIABLES DE ENTORNO
========================================================= */

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const DOCTOR_EMAIL = process.env.DOCTOR_EMAIL;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

/* =========================================================
   SQLITE
========================================================= */

const db = new Database("homeopata.db");

db.pragma("journal_mode = WAL");

console.log("========================================");
console.log(" SQLite conectado");
console.log("========================================");

/* =========================================================
   TABLA ADMINISTRADORES
========================================================= */

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

/* =========================================================
   TABLA DE SESIONES ADMIN
========================================================= */

db.exec(`
  CREATE TABLE IF NOT EXISTS admin_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE NOT NULL,
    admin_id INTEGER NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES admins(id)
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_admin_sessions_token
  ON admin_sessions(token);
`);

/* =========================================================
   TABLA CONSULTAS
========================================================= */

db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,

    type TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    modality TEXT NOT NULL,

    message TEXT,

    status TEXT DEFAULT 'Pendiente',

    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

/* =========================================================
   TABLA SOLICITUDES DE TRATAMIENTO
========================================================= */

db.exec(`
  CREATE TABLE IF NOT EXISTS treatment_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,

    treatment TEXT NOT NULL,

    delivery TEXT NOT NULL,

    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    postal_code TEXT NOT NULL,

    quantity INTEGER DEFAULT 1,

    message TEXT,

    status TEXT DEFAULT 'Pendiente',

    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

/* =========================================================
   MIGRACIÓN SEGURA DE BASE EXISTENTE
========================================================= */

function addColumnIfMissing(table, column, definition) {
  const columns = db
    .prepare(`PRAGMA table_info(${table})`)
    .all();

  const exists = columns.some(
    (item) => item.name === column
  );

  if (!exists) {
    db.exec(`
      ALTER TABLE ${table}
      ADD COLUMN ${column} ${definition}
    `);

    console.log(
      `✅ Columna agregada: ${table}.${column}`
    );
  }
}

addColumnIfMissing(
  "treatment_requests",
  "quantity",
  "INTEGER DEFAULT 1"
);

/* =========================================================
   CREAR ADMIN INICIAL
========================================================= */

function createInitialAdmin() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn("");
    console.warn(
      "⚠️ ADMIN_EMAIL o ADMIN_PASSWORD no están configurados."
    );
    console.warn("");
    return;
  }

  const normalizedEmail =
    ADMIN_EMAIL.trim().toLowerCase();

  const existingAdmin = db
    .prepare(`
      SELECT id
      FROM admins
      WHERE email = ?
    `)
    .get(normalizedEmail);

  if (existingAdmin) {
    console.log(
      `✅ Administrador existente: ${normalizedEmail}`
    );

    return;
  }

  const passwordHash = bcrypt.hashSync(
    ADMIN_PASSWORD,
    12
  );

  db.prepare(`
    INSERT INTO admins (
      email,
      password_hash
    )
    VALUES (?, ?)
  `).run(
    normalizedEmail,
    passwordHash
  );

  console.log(
    `✅ Administrador creado: ${normalizedEmail}`
  );
}

createInitialAdmin();

/* =========================================================
   GMAIL
========================================================= */

let transporter = null;

if (EMAIL_USER && EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },

    tls: {
      family: 4,
    },
  });

  transporter.verify((error) => {
    if (error) {
      console.error(
        "❌ Error conectando Gmail:"
      );

      console.error(error.message);
    } else {
      console.log(
        "✅ GMAIL CONECTADO CORRECTAMENTE"
      );
    }
  });
} else {
  console.warn(
    "⚠️ Gmail no está configurado."
  );
}

/* =========================================================
   FUNCIÓN PARA ENVIAR CORREOS
========================================================= */

async function sendEmail(options) {
  if (!transporter) {
    console.warn(
      "⚠️ Correo no enviado: Gmail no está configurado."
    );

    return;
  }

  try {
    await transporter.sendMail(options);

    console.log(
      `📧 Correo enviado a: ${options.to}`
    );
  } catch (error) {
    console.error(
      "❌ Error enviando correo:"
    );

    console.error(error.message);
  }
}

/* =========================================================
   LIMPIEZA DE SESIONES EXPIRADAS
========================================================= */

function cleanExpiredSessions() {
  try {
    db.prepare(`
      DELETE FROM admin_sessions
      WHERE datetime(expires_at) <= datetime('now')
    `).run();
  } catch (error) {
    console.error(
      "❌ Error limpiando sesiones:",
      error.message
    );
  }
}

cleanExpiredSessions();

setInterval(
  cleanExpiredSessions,
  30 * 60 * 1000
);

/* =========================================================
   CREAR SESIÓN ADMIN
========================================================= */

function createAdminSession(admin) {
  const token = crypto
    .randomBytes(48)
    .toString("hex");

  /*
    Sesión válida durante 24 horas.
  */

  const expiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ).toISOString();

  db.prepare(`
    INSERT INTO admin_sessions (
      token,
      admin_id,
      email,
      expires_at
    )
    VALUES (?, ?, ?, ?)
  `).run(
    token,
    admin.id,
    admin.email,
    expiresAt
  );

  return token;
}

/* =========================================================
   OBTENER SESIÓN
========================================================= */

function getAdminSession(token) {
  if (!token) {
    return null;
  }

  const session = db
    .prepare(`
      SELECT
        id,
        token,
        admin_id,
        email,
        created_at,
        expires_at
      FROM admin_sessions
      WHERE token = ?
        AND datetime(expires_at) > datetime('now')
    `)
    .get(token);

  if (!session) {
    return null;
  }

  return {
    sessionId: session.id,
    adminId: session.admin_id,
    email: session.email,
    createdAt: session.created_at,
    expiresAt: session.expires_at,
  };
}

/* =========================================================
   MIDDLEWARE ADMIN
========================================================= */

function requireAdmin(req, res, next) {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message:
          "No autorizado. No se recibió token.",
      });
    }

    const parts =
      authorization.split(" ");

    const type = parts[0];
    const token = parts[1];

    if (
      type !== "Bearer" ||
      !token
    ) {
      return res.status(401).json({
        success: false,
        message: "Token inválido.",
      });
    }

    const session =
      getAdminSession(token);

    if (!session) {
      return res.status(401).json({
        success: false,
        message:
          "Sesión inválida o expirada.",
      });
    }

    req.admin = session;
    req.adminToken = token;

    next();

  } catch (error) {
    console.error(
      "❌ Error verificando administrador:"
    );

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Error verificando sesión.",
    });
  }
}

/* =========================================================
   RUTA PRINCIPAL
========================================================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Servidor de Homeopatía Web funcionando.",
  });
});

/* =========================================================
   STATUS
========================================================= */

app.get("/api/status", (req, res) => {
  let activeSessions = 0;

  try {
    const result = db
      .prepare(`
        SELECT COUNT(*) AS total
        FROM admin_sessions
        WHERE datetime(expires_at) > datetime('now')
      `)
      .get();

    activeSessions = result.total;
  } catch {
    activeSessions = 0;
  }

  res.json({
    success: true,

    server: "online",

    database: true,

    emailConfigured: Boolean(
      EMAIL_USER &&
      EMAIL_PASSWORD &&
      DOCTOR_EMAIL
    ),

    adminConfigured: Boolean(
      ADMIN_EMAIL &&
      ADMIN_PASSWORD
    ),

    activeAdminSessions:
      activeSessions,
  });
});

/* =========================================================
   LOGIN ADMIN
========================================================= */

app.post(
  "/api/admin/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Correo y contraseña son obligatorios.",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      console.log(
        `🔐 Intento de login: ${normalizedEmail}`
      );

      const admin = db
        .prepare(`
          SELECT
            id,
            email,
            password_hash
          FROM admins
          WHERE email = ?
        `)
        .get(normalizedEmail);

      if (!admin) {
        console.log(
          "❌ Administrador no encontrado."
        );

        return res.status(401).json({
          success: false,
          message:
            "Credenciales incorrectas.",
        });
      }

      const passwordCorrect =
        await bcrypt.compare(
          password,
          admin.password_hash
        );

      if (!passwordCorrect) {
        console.log(
          "❌ Contraseña incorrecta."
        );

        return res.status(401).json({
          success: false,
          message:
            "Credenciales incorrectas.",
        });
      }

      /*
        Eliminamos sesiones antiguas
        del mismo administrador.
      */

      db.prepare(`
        DELETE FROM admin_sessions
        WHERE admin_id = ?
      `).run(admin.id);

      const token =
        createAdminSession(admin);

      console.log(
        `✅ Admin inició sesión: ${admin.email}`
      );

      return res.json({
        success: true,

        message:
          "Inicio de sesión correcto.",

        token,

        /*
          Compatibilidad con versiones
          anteriores del frontend.
        */
        adminToken: token,

        admin: {
          id: admin.id,
          email: admin.email,
        },
      });

    } catch (error) {
      console.error(
        "❌ ERROR LOGIN ADMIN:"
      );

      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Error interno del servidor.",
      });
    }
  }
);

/* =========================================================
   VERIFICAR ADMIN
========================================================= */

app.get(
  "/api/admin/me",
  requireAdmin,
  (req, res) => {
    res.json({
      success: true,

      admin: {
        id: req.admin.adminId,
        email: req.admin.email,
      },
    });
  }
);

/* =========================================================
   LOGOUT
========================================================= */

app.post(
  "/api/admin/logout",
  requireAdmin,
  (req, res) => {
    try {
      db.prepare(`
        DELETE FROM admin_sessions
        WHERE token = ?
      `).run(req.adminToken);

      console.log(
        `👋 Admin cerró sesión: ${req.admin.email}`
      );

      res.json({
        success: true,
        message:
          "Sesión cerrada correctamente.",
      });

    } catch (error) {
      console.error(
        "❌ ERROR LOGOUT:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "No se pudo cerrar la sesión.",
      });
    }
  }
);

/* =========================================================
   DASHBOARD
========================================================= */

app.get(
  "/api/admin/dashboard",
  requireAdmin,
  (req, res) => {
    try {
      const bookingsTotal =
        db.prepare(`
          SELECT COUNT(*) AS total
          FROM bookings
        `).get();

      const treatmentsTotal =
        db.prepare(`
          SELECT COUNT(*) AS total
          FROM treatment_requests
        `).get();

      const bookingsPending =
        db.prepare(`
          SELECT COUNT(*) AS total
          FROM bookings
          WHERE status = 'Pendiente'
        `).get();

      const treatmentsPending =
        db.prepare(`
          SELECT COUNT(*) AS total
          FROM treatment_requests
          WHERE status = 'Pendiente'
        `).get();

      res.json({
        success: true,

        statistics: {
          bookings:
            bookingsTotal.total,

          treatments:
            treatmentsTotal.total,

          bookingsPending:
            bookingsPending.total,

          treatmentsPending:
            treatmentsPending.total,

          totalRequests:
            bookingsTotal.total +
            treatmentsTotal.total,

          totalPending:
            bookingsPending.total +
            treatmentsPending.total,
        },
      });

    } catch (error) {
      console.error(
        "❌ ERROR DASHBOARD:"
      );

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "No se pudo cargar el dashboard.",
      });
    }
  }
);

/* =========================================================
   LISTAR CONSULTAS
========================================================= */

app.get(
  "/api/admin/bookings",
  requireAdmin,
  (req, res) => {
    try {
      const bookings =
        db.prepare(`
          SELECT *
          FROM bookings
          ORDER BY id DESC
        `).all();

      res.json({
        success: true,
        bookings,
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "No se pudieron obtener las consultas.",
      });
    }
  }
);

/* =========================================================
   LISTAR TRATAMIENTOS
========================================================= */

app.get(
  "/api/admin/treatments",
  requireAdmin,
  (req, res) => {
    try {
      const treatments =
        db.prepare(`
          SELECT
            id,
            name,
            email,
            phone,
            treatment,
            delivery,
            address,
            city,
            state,
            country,
            postal_code,
            postal_code AS postalCode,
            quantity,
            message,
            status,
            created_at
          FROM treatment_requests
          ORDER BY id DESC
        `).all();

      res.json({
        success: true,
        treatments,
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "No se pudieron obtener las solicitudes.",
      });
    }
  }
);

/* =========================================================
   COMPATIBILIDAD CON /SOLICITUDES
========================================================= */

app.get(
  "/api/admin/solicitudes",
  requireAdmin,
  (req, res) => {
    try {
      const solicitudes =
        db.prepare(`
          SELECT
            id,
            name,
            email,
            phone,
            treatment,
            delivery,
            address,
            city,
            state,
            country,
            postal_code,
            postal_code AS postalCode,
            quantity,
            message,
            status,
            created_at
          FROM treatment_requests
          ORDER BY id DESC
        `).all();

      res.json({
        success: true,
        solicitudes,
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "No se pudieron cargar las solicitudes.",
      });
    }
  }
);

/* =========================================================
   ESTADO CONSULTA
========================================================= */

app.put(
  "/api/admin/bookings/:id/status",
  requireAdmin,
  (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = [
        "Pendiente",
        "Confirmada",
        "Completada",
        "Cancelada",
      ];

      if (
        !validStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Estado inválido.",
        });
      }

      const result =
        db.prepare(`
          UPDATE bookings
          SET status = ?
          WHERE id = ?
        `).run(status, id);

      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Consulta no encontrada.",
        });
      }

      res.json({
        success: true,
        message:
          "Estado actualizado.",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "No se pudo actualizar la consulta.",
      });
    }
  }
);

/* =========================================================
   ESTADO TRATAMIENTO
========================================================= */

app.put(
  "/api/admin/treatments/:id/status",
  requireAdmin,
  (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = [
        "Pendiente",
        "En revisión",
        "Confirmada",
        "Enviado",
        "Completada",
        "Cancelada",
      ];

      if (
        !validStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Estado inválido.",
        });
      }

      const result =
        db.prepare(`
          UPDATE treatment_requests
          SET status = ?
          WHERE id = ?
        `).run(status, id);

      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Solicitud no encontrada.",
        });
      }

      res.json({
        success: true,
        message:
          "Estado actualizado.",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "No se pudo actualizar la solicitud.",
      });
    }
  }
);

/* =========================================================
   COMPATIBILIDAD /SOLICITUDES/:ID/STATUS
========================================================= */

app.put(
  "/api/admin/solicitudes/:id/status",
  requireAdmin,
  (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = [
        "Pendiente",
        "En revisión",
        "Confirmada",
        "Enviado",
        "Completada",
        "Revisada",
        "Cancelada",
      ];

      if (
        !validStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Estado inválido.",
        });
      }

      const result =
        db.prepare(`
          UPDATE treatment_requests
          SET status = ?
          WHERE id = ?
        `).run(status, id);

      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Solicitud no encontrada.",
        });
      }

      res.json({
        success: true,
        message:
          "Estado actualizado.",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "No se pudo actualizar la solicitud.",
      });
    }
  }
);

/* =========================================================
   ELIMINAR CONSULTA
========================================================= */

app.delete(
  "/api/admin/bookings/:id",
  requireAdmin,
  (req, res) => {
    try {
      const { id } = req.params;

      const result =
        db.prepare(`
          DELETE FROM bookings
          WHERE id = ?
        `).run(id);

      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Consulta no encontrada.",
        });
      }

      res.json({
        success: true,
        message:
          "Consulta eliminada.",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "No se pudo eliminar.",
      });
    }
  }
);

/* =========================================================
   ELIMINAR TRATAMIENTO
========================================================= */

app.delete(
  "/api/admin/treatments/:id",
  requireAdmin,
  (req, res) => {
    try {
      const { id } = req.params;

      const result =
        db.prepare(`
          DELETE FROM treatment_requests
          WHERE id = ?
        `).run(id);

      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Solicitud no encontrada.",
        });
      }

      res.json({
        success: true,
        message:
          "Solicitud eliminada.",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "No se pudo eliminar.",
      });
    }
  }
);

/* =========================================================
   AGENDAR CONSULTA
========================================================= */

app.post(
  "/api/booking",
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        type,
        date,
        time,
        modality,
        message,
      } = req.body;

      if (
        !name ||
        !email ||
        !phone ||
        !type ||
        !date ||
        !time ||
        !modality
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Faltan datos obligatorios.",
        });
      }

      const result =
        db.prepare(`
          INSERT INTO bookings (
            name,
            email,
            phone,
            type,
            date,
            time,
            modality,
            message,
            status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente')
        `).run(
          name,
          email,
          phone,
          type,
          date,
          time,
          modality,
          message || ""
        );

      const bookingId =
        result.lastInsertRowid;

      res.json({
        success: true,
        message:
          "Solicitud enviada correctamente.",
        id: bookingId,
      });

      /* CORREO AL DOCTOR */

      sendEmail({
        from:
          `"Página Web" <${EMAIL_USER}>`,

        to: DOCTOR_EMAIL,

        replyTo: email,

        subject:
          `Nueva solicitud de consulta — ${name}`,

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: auto;
            color: #3f3a36;
          ">

            <h2>
              Nueva solicitud de consulta
            </h2>

            <p>
              Se ha recibido una nueva solicitud
              desde la página web.
            </p>

            <h3>
              Datos del paciente
            </h3>

            <p>
              <strong>Nombre:</strong>
              ${name}
            </p>

            <p>
              <strong>Correo:</strong>
              ${email}
            </p>

            <p>
              <strong>Teléfono:</strong>
              ${phone}
            </p>

            <p>
              <strong>Tipo:</strong>
              ${type}
            </p>

            <p>
              <strong>Fecha:</strong>
              ${date}
            </p>

            <p>
              <strong>Horario:</strong>
              ${time}
            </p>

            <p>
              <strong>Modalidad:</strong>
              ${modality}
            </p>

            ${
              message
                ? `
                  <h3>
                    Comentario
                  </h3>

                  <p>
                    ${message}
                  </p>
                `
                : ""
            }

          </div>
        `,
      });

      /* CORREO AL PACIENTE */

      sendEmail({
        from:
          `"Dr. Alejandro Adame Cafuentes" <${EMAIL_USER}>`,

        to: email,

        subject:
          "Hemos recibido tu solicitud de consulta",

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: auto;
            color: #3f3a36;
          ">

            <h2>
              Gracias, ${name}.
            </h2>

            <p>
              Hemos recibido correctamente
              tu solicitud de consulta.
            </p>

            <p>
              <strong>Tipo:</strong>
              ${type}
            </p>

            <p>
              <strong>Fecha:</strong>
              ${date}
            </p>

            <p>
              <strong>Horario:</strong>
              ${time}
            </p>

            <p>
              <strong>Modalidad:</strong>
              ${modality}
            </p>

            <p>
              La solicitud será revisada y
              posteriormente nos pondremos
              en contacto contigo.
            </p>

            <br />

            <p>
              Atentamente,
              <br />

              <strong>
                Dr. Alejandro Adame Cafuentes
              </strong>
            </p>

          </div>
        `,
      });

    } catch (error) {
      console.error(
        "❌ ERROR AL REGISTRAR CONSULTA:"
      );

      console.error(error);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message:
            "No pudimos registrar tu solicitud.",
        });
      }
    }
  }
);

/* =========================================================
   SOLICITUD DE TRATAMIENTO
========================================================= */

app.post(
  "/api/treatment-request",
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        treatment,
        delivery,
        address,
        city,
        state,
        country,
        postalCode,
        quantity,
        message,
      } = req.body;

      if (
        !name ||
        !email ||
        !phone ||
        !treatment ||
        !delivery ||
        !address ||
        !city ||
        !state ||
        !country ||
        !postalCode
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Faltan datos obligatorios.",
        });
      }

      const parsedQuantity =
        Number.parseInt(quantity, 10);

      const safeQuantity =
        Number.isFinite(parsedQuantity) &&
        parsedQuantity > 0
          ? parsedQuantity
          : 1;

      const result =
        db.prepare(`
          INSERT INTO treatment_requests (
            name,
            email,
            phone,
            treatment,
            delivery,
            address,
            city,
            state,
            country,
            postal_code,
            quantity,
            message,
            status
          )
          VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente'
          )
        `).run(
          name,
          email,
          phone,
          treatment,
          delivery,
          address,
          city,
          state,
          country,
          postalCode,
          safeQuantity,
          message || ""
        );

      const treatmentId =
        result.lastInsertRowid;

      res.json({
        success: true,
        message:
          "Solicitud enviada correctamente.",
        id: treatmentId,
      });

      /* CORREO AL DOCTOR */

      sendEmail({
        from:
          `"Página Web" <${EMAIL_USER}>`,

        to: DOCTOR_EMAIL,

        replyTo: email,

        subject:
          `Nueva solicitud de tratamiento — ${name}`,

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 700px;
            margin: auto;
            color: #3f3a36;
          ">

            <h2>
              Nueva solicitud de tratamiento
            </h2>

            <h3>
              Datos del solicitante
            </h3>

            <p>
              <strong>Nombre:</strong>
              ${name}
            </p>

            <p>
              <strong>Correo:</strong>
              ${email}
            </p>

            <p>
              <strong>Teléfono:</strong>
              ${phone}
            </p>

            <p>
              <strong>Tratamiento:</strong>
              ${treatment}
            </p>

            <p>
              <strong>Cantidad:</strong>
              ${safeQuantity}
            </p>

            <h3>
              Datos de entrega
            </h3>

            <p>
              <strong>Entrega:</strong>
              ${delivery}
            </p>

            <p>
              <strong>Dirección:</strong>
              ${address}
            </p>

            <p>
              <strong>Ciudad:</strong>
              ${city}
            </p>

            <p>
              <strong>Estado:</strong>
              ${state}
            </p>

            <p>
              <strong>País:</strong>
              ${country}
            </p>

            <p>
              <strong>Código postal:</strong>
              ${postalCode}
            </p>

            ${
              message
                ? `
                  <h3>
                    Información adicional
                  </h3>

                  <p>
                    ${message}
                  </p>
                `
                : ""
            }

          </div>
        `,
      });

      /* CORREO AL SOLICITANTE */

      sendEmail({
        from:
          `"Dr. Alejandro Adame Cafuentes" <${EMAIL_USER}>`,

        to: email,

        subject:
          "Hemos recibido tu solicitud de tratamiento",

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: auto;
            color: #3f3a36;
          ">

            <h2>
              Solicitud recibida
            </h2>

            <p>
              Hola ${name}.
            </p>

            <p>
              Hemos recibido correctamente
              tu solicitud de tratamiento.
            </p>

            <p>
              <strong>
                Tratamiento:
              </strong>
              ${treatment}
            </p>

            <p>
              <strong>
                Cantidad:
              </strong>
              ${safeQuantity}
            </p>

            <p>
              <strong>
                Entrega:
              </strong>
              ${delivery}
            </p>

            <p>
              <strong>
                Destino:
              </strong>
              ${city}, ${state}, ${country}
            </p>

            <p>
              La solicitud será revisada
              antes de confirmar el tratamiento
              y los detalles de entrega.
            </p>

            <p>
              Nos pondremos en contacto contigo
              para continuar con el proceso.
            </p>

            <br />

            <p>
              Atentamente,
              <br />

              <strong>
                Dr. Alejandro Adame Cafuentes
              </strong>
            </p>

          </div>
        `,
      });

    } catch (error) {
      console.error(
        "❌ ERROR AL REGISTRAR TRATAMIENTO:"
      );

      console.error(error);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message:
            "No pudimos registrar tu solicitud.",
        });
      }
    }
  }
);

/* =========================================================
   404
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================================================
   MANEJO DE ERRORES
========================================================= */

app.use(
  (error, req, res, next) => {
    console.error(
      "❌ ERROR GENERAL:"
    );

    console.error(error);

    if (res.headersSent) {
      return next(error);
    }

    res.status(500).json({
      success: false,
      message:
        "Error interno del servidor.",
    });
  }
);

/* =========================================================
   INICIAR SERVIDOR
========================================================= */

app.listen(
  PORT,
  () => {
    console.log("");
    console.log(
      "========================================"
    );
    console.log(
      " HOMEOPATÍA WEB"
    );
    console.log(
      " SERVIDOR FUNCIONANDO"
    );
    console.log(
      ` http://localhost:${PORT}`
    );
    console.log(
      " SQLITE CONECTADO"
    );
    console.log(
      " ADMIN DISPONIBLE"
    );
    console.log(
      " SESIONES SQLITE ACTIVAS"
    );
    console.log(
      "========================================"
    );
    console.log("");
  }
);
