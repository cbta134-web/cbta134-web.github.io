import React from 'react';

/* 
  Componente principal: SAETAM
  Este componente muestra información sobre el Sistema de Apoyo 
  para la Educación Técnica Agropecuaria y de Mar (SAETAM),
  incluyendo su historia, objetivos, servicios e impacto institucional.
*/

const Saetam = () => {
  // 🎨 Paleta principal de colores verdes
  const verdePrincipal = '#2ecc71';    // Verde brillante
  const verdeOscuro = '#27ae60';       // Verde profundo
  const verdeSuave = '#a9dfbf';        // Verde claro pastel
  const grisTexto = '#555';            // Gris para textos secundarios
  const fondoClaro = '#f8f9fa';        // Fondo base claro

  // 🧱 Estilos generales de la página
  const pageStyle = {
    paddingTop: '80px',
    minHeight: '100vh',
    backgroundColor: fondoClaro
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '100%',
    margin: '0 auto'
  };

  // 🏛️ Título principal
  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: verdeOscuro,
    marginBottom: '25px',
    textAlign: 'center'
  };

  // 📦 Estilo base para cada sección
  const sectionStyle = {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
  };

  // 🟩 Subtítulos de secciones
  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: verdeOscuro,
    marginBottom: '15px'
  };

  // ✍️ Texto descriptivo
  const textStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: grisTexto,
    marginBottom: '15px',
    textAlign: 'justify'
  };

  // 🖼️ Logo centrado
  const logoStyle = {
    width: '200px',
    height: 'auto',
    display: 'block',
    margin: '20px auto',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  };

  // 🧩 Estilo de las tarjetas de servicios
  const servicioCard = {
    background: verdeSuave,
    padding: '20px',
    borderRadius: '10px',
    transition: 'transform 0.3s, box-shadow 0.3s'
  };

  const servicioCardHover = {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.15)'
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* 🏫 Encabezado principal */}
        <h1 style={titleStyle}>🏛️ SAETAM</h1>

        {/* 📖 Sección: Descripción general */}
        <section style={sectionStyle}>
          <img src="/images/saetam.jpg" alt="SAETAM" style={logoStyle} />
          <h2 style={sectionTitleStyle}>
            Sistema de Apoyo para la Educación Técnica Agropecuaria y de Mar
          </h2>
          <p style={textStyle}>
            El SAETAM (Sistema de Apoyo para la Educación Técnica Agropecuaria y de Mar) 
            es un organismo dependiente de la Dirección General de Educación Tecnológica 
            Agropecuaria y Ciencias del Mar (DGETAyCM), cuyo propósito es brindar apoyo 
            técnico, administrativo y académico a los planteles del subsistema.
          </p>
          <p style={textStyle}>
            En el CBTA 134, el SAETAM desempeña un papel fundamental en el desarrollo 
            y mejoramiento continuo de nuestros programas educativos, garantizando el 
            cumplimiento de los estándares de calidad establecidos a nivel nacional.
          </p>
        </section>

        {/* 🎯 Sección: Objetivos */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🎯 Objetivos del SAETAM</h2>
          <ul style={{ paddingLeft: '20px', color: grisTexto }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>Apoyo técnico:</strong> Brindar asistencia especializada en proyectos 
              productivos y educativos.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Capacitación:</strong> Ofrecer programas de actualización para docentes 
              y personal administrativo.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Vinculación:</strong> Fortalecer la conexión entre las instituciones 
              educativas y el sector productivo.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Desarrollo curricular:</strong> Colaborar en la actualización de los 
              planes y programas de estudio.
            </li>
          </ul>
        </section>

        {/* 💼 Sección: Servicios */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🌟 Servicios que Ofrece</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}
          >
            {/* Tarjeta 1 */}
            <div
              style={servicioCard}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, servicioCardHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, servicioCard)}
            >
              <h4 style={{ color: verdeOscuro, marginBottom: '10px' }}>📚 Asesoría Académica</h4>
              <p style={{ color: grisTexto, fontSize: '14px' }}>
                Orientación en metodologías de enseñanza y desarrollo curricular.
              </p>
            </div>

            {/* Tarjeta 2 */}
            <div
              style={servicioCard}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, servicioCardHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, servicioCard)}
            >
              <h4 style={{ color: verdeOscuro, marginBottom: '10px' }}>🔬 Apoyo Técnico</h4>
              <p style={{ color: grisTexto, fontSize: '14px' }}>
                Asistencia en proyectos de investigación y desarrollo tecnológico.
              </p>
            </div>

            {/* Tarjeta 3 */}
            <div
              style={servicioCard}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, servicioCardHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, servicioCard)}
            >
              <h4 style={{ color: verdeOscuro, marginBottom: '10px' }}>👥 Capacitación</h4>
              <p style={{ color: grisTexto, fontSize: '14px' }}>
                Programas de actualización profesional para docentes.
              </p>
            </div>

            {/* Tarjeta 4 */}
            <div
              style={servicioCard}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, servicioCardHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, servicioCard)}
            >
              <h4 style={{ color: verdeOscuro, marginBottom: '10px' }}>🤝 Vinculación</h4>
              <p style={{ color: grisTexto, fontSize: '14px' }}>
                Enlace con empresas y organizaciones del sector productivo.
              </p>
            </div>
          </div>
        </section>

        {/* 🌿 Sección: Impacto */}
        <section
          style={{
            ...sectionStyle,
            background: `linear-gradient(135deg, ${verdeOscuro}, ${verdePrincipal})`,
            color: 'white',
            textAlign: 'center'
          }}
        >
          <h2 style={{ ...sectionTitleStyle, color: 'white' }}>
            🌟 Impacto en Nuestra Institución
          </h2>
          <p style={{ ...textStyle, color: 'white', textAlign: 'center' }}>
            Gracias al apoyo del SAETAM, el CBTA 134 ha logrado mantener altos estándares 
            de calidad educativa, implementar nuevas tecnologías en los procesos de 
            enseñanza-aprendizaje y fortalecer los vínculos con el sector productivo 
            de la región.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Saetam;
