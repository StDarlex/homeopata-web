import "./Approach.css";

function Approach() {
  const steps = [
    {
      number: "01",
      title: "Escuchar",
      text: "Conocer lo que estás viviendo y darte el espacio necesario para expresarlo.",
    },
    {
      number: "02",
      title: "Comprender",
      text: "Observar cada caso de manera individual, respetando la historia y las necesidades de cada persona.",
    },
    {
      number: "03",
      title: "Acompañar",
      text: "Dar seguimiento a tu proceso con cercanía, respeto y atención personalizada.",
    },
  ];

  return (
    <section className="approach" id="enfoque">

      <div className="approach-header">

        <div>
          <span className="approach-eyebrow">
            MI FORMA DE TRABAJAR
          </span>

          <h2>
            Antes de tratar,
            <br />
            hay que <em>escuchar.</em>
          </h2>
        </div>

        <p className="approach-description">
          Cada consulta comienza con tiempo, atención y una conversación
          pensada para comprender a la persona que tengo frente a mí.
        </p>

      </div>

      <div className="approach-steps">

        {steps.map((step) => (
          <article
            className="approach-card"
            key={step.number}
          >

            <span className="approach-number">
              {step.number}
            </span>

            <div className="approach-card-content">

              <h3>{step.title}</h3>

              <p>{step.text}</p>

            </div>

            <span className="approach-arrow">
              ↗
            </span>

          </article>
        ))}

      </div>

    </section>
  );
}

export default Approach;