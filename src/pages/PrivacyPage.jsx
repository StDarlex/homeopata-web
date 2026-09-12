import React from "react";
import { Link } from "react-router-dom";
import "./PrivacyPage.css";

function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-container">

        <Link to="/" className="legal-back">
          ← Volver al inicio
        </Link>

        <header className="legal-header">
          <span>INFORMACIÓN LEGAL</span>

          <h1>
            Política de
            <em> Privacidad</em>
          </h1>

          <p>
            Tu privacidad y el cuidado responsable de tu información
            son importantes para nosotros.
          </p>
        </header>

        <div className="legal-content">

          <section>
            <span className="legal-number">01</span>

            <div>
              <h2>Responsable del tratamiento</h2>

              <p>
                La presente Política de Privacidad describe la manera en
                que el sitio web del Dr. Alejandro Adame Cafuentes puede
                recopilar, utilizar y proteger la información que
                proporcionan sus visitantes y usuarios.
              </p>

              <p>
                Para cualquier asunto relacionado con la privacidad de
                sus datos, puedes utilizar los medios de contacto
                disponibles en este sitio.
              </p>
            </div>
          </section>

          <section>
            <span className="legal-number">02</span>

            <div>
              <h2>Información que podemos recopilar</h2>

              <p>
                Dependiendo de las funciones que utilices en el sitio,
                podemos solicitar información como nombre, correo
                electrónico, teléfono, fecha de cita y datos necesarios
                para atender una solicitud de contacto o agendamiento.
              </p>

              <p>
                Te recomendamos proporcionar únicamente la información
                necesaria para la finalidad correspondiente.
              </p>
            </div>
          </section>

          <section>
            <span className="legal-number">03</span>

            <div>
              <h2>Uso de la información</h2>

              <p>
                La información proporcionada podrá utilizarse para
                responder solicitudes, gestionar citas, establecer
                comunicación relacionada con los servicios solicitados
                y mejorar la experiencia dentro del sitio.
              </p>

              <p>
                La información no deberá utilizarse para finalidades
                distintas de aquellas para las que fue proporcionada,
                salvo cuando exista una obligación legal aplicable.
              </p>
            </div>
          </section>

          <section>
            <span className="legal-number">04</span>

            <div>
              <h2>Información sensible</h2>

              <p>
                Si utilizas los formularios del sitio para solicitar
                atención, evita proporcionar información médica,
                diagnósticos o cualquier otro dato sensible que no sea
                necesario para realizar tu solicitud inicial.
              </p>

              <p>
                La información clínica que corresponda a una consulta
                deberá tratarse por los medios y procedimientos destinados
                específicamente para la atención profesional.
              </p>
            </div>
          </section>

          <section>
            <span className="legal-number">05</span>

            <div>
              <h2>Protección de la información</h2>

              <p>
                Se procura implementar medidas razonables para proteger
                la información recibida mediante este sitio frente a
                accesos, usos o divulgaciones no autorizadas.
              </p>

              <p>
                Ningún sistema de transmisión o almacenamiento de
                información por internet puede garantizar una seguridad
                absoluta.
              </p>
            </div>
          </section>

          <section>
            <span className="legal-number">06</span>

            <div>
              <h2>Servicios de terceros</h2>

              <p>
                Algunas funciones del sitio pueden apoyarse en servicios
                tecnológicos de terceros, por ejemplo, herramientas de
                correo electrónico, alojamiento web, formularios o
                sistemas de agenda.
              </p>

              <p>
                El tratamiento de información realizado directamente por
                dichos servicios puede estar sujeto también a sus propias
                políticas de privacidad.
              </p>
            </div>
          </section>

          <section>
            <span className="legal-number">07</span>

            <div>
              <h2>Derechos sobre tus datos</h2>

              <p>
                Puedes solicitar información acerca del tratamiento de
                tus datos personales y, cuando corresponda, ejercer los
                derechos que la legislación aplicable reconozca respecto
                de ellos.
              </p>

              <p>
                Para realizar una solicitud, puedes comunicarte mediante
                los datos de contacto publicados en este sitio.
              </p>
            </div>
          </section>

          <section>
            <span className="legal-number">08</span>

            <div>
              <h2>Actualizaciones</h2>

              <p>
                Esta política puede actualizarse cuando sea necesario
                para reflejar cambios en el funcionamiento del sitio,
                los servicios utilizados o las obligaciones aplicables.
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

export default PrivacyPage;
