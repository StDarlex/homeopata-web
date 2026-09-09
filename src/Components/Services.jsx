import { Link } from "react-router-dom";
import "./Services.css";

function Services() {
  const services = [
    {
      number: "01",
      title: "Consulta presencial",
      text: "Atención individual en consulta, con el tiempo necesario para conocer tu caso y establecer un acompañamiento personalizado.",
    },
    {
      number: "02",
      title: "Consulta en línea",
      text: "Una alternativa para recibir atención a distancia desde la comodidad de tu hogar, sin perder la cercanía del acompañamiento.",
    },
    {
      number: "03",
      title: "Seguimiento",
      text: "Espacios destinados a revisar tu evolución, resolver dudas y dar continuidad al proceso de manera ordenada.",
    },
  ];

  return (
    <section className="services" id="servicios">

      <div className="services-header">

        <div className="services-heading">
          <span className="services-eyebrow">
            SERVICIOS
          </span>

          <h2>
            Atención pensada
            <br />
            para <em>ti.</em>
          </h2>
        </div>

        <p className="services-description">
          Diferentes modalidades de atención para adaptarnos
          a tus necesidades y a la forma en que prefieras llevar
          tu proceso.
        </p>

      </div>


      <div className="services-list">

        {services.map((service) => (
          <article
            className="service-card"
            key={service.number}
          >

            <span className="service-number">
              {service.number}
            </span>


            <div className="service-content">

              <h3>
                {service.title}
              </h3>

              <p>
                {service.text}
              </p>

              <Link
                to="/agendar"
                className="service-link"
              >
                Agendar consulta
                <span>↗</span>
              </Link>

            </div>


            <span className="service-arrow">
              ↗
            </span>

          </article>
        ))}

      </div>

    </section>
  );
}

export default Services;
