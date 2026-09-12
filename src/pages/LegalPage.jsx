import React from "react";
import { Link } from "react-router-dom";
import "./LegalPage.css";

function LegalPage() {
  return (
    <main className="legal-page">
      <div className="legal-container">

        <Link to="/" className="legal-back">
          ← Volver al inicio
        </Link>

        <header className="legal-header">
          <span>INFORMACIÓN LEGAL</span>

          <h1>
            Aviso
            <em> Legal</em>
          </h1>

          <p>
            Información general sobre el uso y funcionamiento de este
            sitio web.
          </p>
        </header>

        <div className="legal-content">

          <section>
            <span className="legal-number">01</span>

            <div>
              <h2>Identificación</h2>

              <p>
                Este sitio web corresponde al espacio digital del
                Dr. Alejandro Adame Cafuentes y tiene como finalidad
                proporcionar información sobre su práctica profesional,
                servicios y medios de contacto.
              </p>
            </div>
          </section>

          <section>
            <span className="legal-number">02</span>

            <div>
              <h2>Uso del sitio</h2>

              <p>
                El contenido de este sitio se proporciona con fines
                informativos y de orientación general.
              </p>

              <p>
                La información publicada no sustituye una valoración
                profesional individual ni debe interpretarse como un
                diagnóstico o indicación personalizada.
              </p>
            </div>
          </section>

          <section>
            <span className="legal-number">03</span>

            <div>
              <h2>Contenido</h2>

              <p>
                Se procura que la información publicada sea clara,
                adecuada y se mantenga actualizada. Sin embargo, pueden
                existir cambios, errores u omisiones.
              </p>

              <p>
                El contenido del sitio puede modificarse, actualizarse
                o retirarse sin previo aviso.
              </p>
            </div>
          </section>

          <section>
            <span className="legal-number">04</span>

            <div>
              <h2>Propiedad intelectual</h2>

              <p>
                Los textos, elementos gráficos, identidad visual,
                fotografías, logotipos y demás contenidos originales
                publicados en este sitio pertenecen a sus respectivos
                titulares y se encuentran protegidos por la legislación
                aplicable.
              </p>

              <p>
                No está autorizada la reproducción, distribución,
                modificación o utilización comercial de los contenidos
                sin la autorización correspondiente.
              </p>
            </div>
          </section>

          <section>
            <span className="legal-number">05</span>

            <div>
              <h2>Enlaces externos</h2>

              <p>
                El sitio puede contener enlaces hacia plataformas o
                servicios externos. Estos sitios cuentan con sus propias
                condiciones y políticas, por lo que no se garantiza el
                contenido o funcionamiento de páginas que se encuentren
                fuera de este dominio.
              </p>
            </div>
          </section>

          <section>
            <span className="legal-number">06</span>

            <div>
              <h2>Contacto y citas</h2>

              <p>
                Los formularios y medios de contacto disponibles en el
                sitio tienen como finalidad facilitar la comunicación y,
                cuando corresponda, la solicitud de una cita.
              </p>

              <p>
                El envío de una solicitud no implica por sí mismo que
                una cita haya quedado confirmada. La confirmación deberá
                realizarse por el medio correspondiente.
              </p>
            </div>
          </section>

          <section>
            <span className="legal-number">07</span>

            <div>
              <h2>Limitación de responsabilidad</h2>

              <p>
                El uso de la información publicada en este sitio es
                responsabilidad del visitante. La información general
                disponible en la página no sustituye la atención
                profesional que corresponda a cada caso.
              </p>
            </div>
          </section>

          <section>
            <span className="legal-number">08</span>

            <div>
              <h2>Actualizaciones</h2>

              <p>
                Este aviso puede actualizarse cuando resulte necesario
                debido a cambios en el sitio, sus servicios o las
                disposiciones aplicables.
              </p>
            </div>
          </section>

        </div>

        <div className="legal-footer">
          <span>Última actualización</span>
          <strong>{new Date().getFullYear()}</strong>
        </div>

      </div>
    </main>
  );
}

export default LegalPage;
