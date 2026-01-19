import React from "react";

const useIsDark = () => {
  if (typeof document === 'undefined') return false;
  return document.body.classList.contains('dark-mode');
};

const Inicio = () => {
  const pageStyle = {
    paddingTop: '80px',
    minHeight: '100vh'
  };

  const heroStyle = {
    color: 'white',
    padding: '60px 20px',
    textAlign: 'center',
    marginBottom: '30px'
  };

  const heroImageStyle = {
    maxWidth: '100%'
  };

  const heroTitleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '15px'
  };

  const heroSubtitleStyle = {
    fontSize: '18px',
    marginBottom: '30px',
    opacity: '0.9'
  };

  const heroImgStyle = {
    maxWidth: '200px',
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
    marginBottom: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  };

  const btnFacebookStyle = {
    display: 'inline-block',
    background: '#1877f2',
    color: 'white',
    padding: '12px 25px',
    textDecoration: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'transform 0.3s, box-shadow 0.3s'
  };

  const sectionStyle = {
    padding: '40px 20px',
    maxWidth: '100%',
    margin: '0 auto'
  };

  const sectionTitleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '25px',
    textAlign: 'center'
  };

  const carruselStyle = {
    display: 'flex',
    overflowX: 'auto',
    gap: '20px',
    padding: '10px',
    marginBottom: '20px',
    scrollbarWidth: 'thin'
  };

  const isDark = useIsDark();

  const carruselItemStyle = {
    minWidth: '280px',
    background: isDark ? 'rgba(255,255,255,0.02)' : 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.6)' : '0 4px 15px rgba(0,0,0,0.1)',
    textAlign: 'center'
  };

  const carruselImgStyle = {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '15px'
  };

  const infoBoxStyle = {
    background: isDark ? 'rgba(255,255,255,0.02)' : 'white',
    borderRadius: '10px',
    padding: '30px 20px',
    marginBottom: '30px',
    boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.6)' : '0 4px 15px rgba(0,0,0,0.1)',
    lineHeight: '1.6'
  };

  const ccContainerStyle = {
    textAlign: 'center',
    marginBottom: '20px'
  };

  const logoStyle = {
    maxWidth: '150px',
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
    marginBottom: '20px'
  };

  const mapaStyle = {
    marginTop: '20px',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  };

  return (
    <div className="inicio-page" style={pageStyle}>
      <main>
        <section className="inicio-hero" style={heroStyle}>
          <div style={heroImageStyle}>
            <h2 style={heroTitleStyle}>Bienvenidos al CBTA 134</h2>
            <p style={heroSubtitleStyle}>Formando futuros líderes.</p>
            <img src="/images/cbta134.png" alt="CBTA 134" style={heroImgStyle} />
            <br />
            <a
              href="https://www.facebook.com/share/15g75ZdJRg/"
              style={btnFacebookStyle}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Síguenos en Facebook
            </a>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Noticias Destacadas</h2>
          <div style={carruselStyle}>
            <div style={carruselItemStyle}>
              <img src="/images/campus.png" alt="Campus" style={carruselImgStyle} />
              <h3 style={{color: '#2c3e50', marginBottom: '10px'}}>Regreso a Clases</h3>
              <p style={{color: '#666', fontSize: '14px'}}>
                Después de vacaciones decembrinas, recuerda que este 6 de enero regresamos a clases.
              </p>
            </div>
            <div style={carruselItemStyle}>
              <img src="/images/programacion.jpg" alt="Programación" style={carruselImgStyle} />
              <h3 style={{color: '#2c3e50', marginBottom: '10px'}}>Nuevos Programas</h3>
              <p style={{color: '#666', fontSize: '14px'}}>
                Conoce nuestros programas educativos actualizados para el nuevo ciclo escolar.
              </p>
            </div>
            <div style={carruselItemStyle}>
              <img src="/images/ofimatica.jpg" alt="Ofimática" style={carruselImgStyle} />
              <h3 style={{color: '#2c3e50', marginBottom: '10px'}}>Talleres Especializados</h3>
              <p style={{color: '#666', fontSize: '14px'}}>
                Participa en nuestros talleres de capacitación técnica especializada.
              </p>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Historia</h2>
          <div style={infoBoxStyle}>
            <div style={ccContainerStyle}>
              <h3 style={{color: '#2c3e50', marginBottom: '15px'}}>Historia del CBTA 134</h3>
              <p style={{marginBottom: '15px', color: '#555'}}>
                El Centro de Bachillerato Tecnológico Agropecuario número 134 (CBTA 134) fue fundado en el año 1981 en San Francisco Tetlanohcan, Tlaxcala, con el objetivo de brindar educación técnica de calidad a los jóvenes de la región.
              </p>
              <p style={{marginBottom: '15px', color: '#555'}}>
                A lo largo de los años, el CBTA 134 ha ampliado su oferta educativa, incorporando diversas especialidades técnicas que responden a las necesidades del mercado laboral actual.
              </p>
              <p style={{marginBottom: '20px', color: '#555'}}>
                El plantel también ha sido un punto de encuentro para la comunidad, promoviendo valores de excelencia académica, responsabilidad social y desarrollo sustentable.
              </p>
              
              <h3 style={{color: '#2c3e50', marginBottom: '15px'}}>Misión</h3>
              <p style={{marginBottom: '15px', color: '#555'}}>
                Contribuir activamente en la formación integral de nuestros estudiantes del Bachillerato Tecnológico, proporcionando una educación de calidad que combine conocimientos académicos sólidos con competencias técnicas especializadas.
              </p>
              
              <h3 style={{color: '#2c3e50', marginBottom: '15px'}}>Visión</h3>
              <p style={{marginBottom: '15px', color: '#555'}}>
                Ser una institución de calidad formadora de líderes del mañana, reconocida por su excelencia educativa y su compromiso con el desarrollo sustentable de la comunidad.
              </p>
            </div>
          </div>

          <h2 style={sectionTitleStyle}>Ubicación</h2>
          <div style={infoBoxStyle}>
            <p style={{marginBottom: '15px', color: '#555', textAlign: 'center'}}>
              El CBTA 134 se encuentra ubicado en:
            </p>
            <p style={{marginBottom: '20px', color: '#333', textAlign: 'center', fontSize: '16px'}}>
              <strong>Dirección:</strong> C. Josefa Ortiz de Domínguez, 90840, San Francisco Tetlanohcan, Tlaxcala.
            </p>
            <div style={ccContainerStyle}>
              <img src="/images/cbta134.png" alt="Logo CBTA 134" style={logoStyle} />
            </div>
            <div style={mapaStyle}>
              <iframe
                title="Ubicación CBTA 134"
                src="https://www.google.com/maps/dir//C.+Josefa+Ortiz+de+Dominguez,+90840+Tlax./@19.2616032,-98.2224024,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x85cfdd8ebaaaaaab:0x27dafbca82bfb2a0!2m2!1d-98.1400007!2d19.2616217?entry=ttu&g_ep=EgoyMDI1MDEwNy4wIKXMDSoASAFQAw%3D%3D"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Inicio;
