import React from 'react';
import BackButton from '../../components/BackButton';

const useIsDark = () => {
  try {
    return typeof document !== 'undefined' && document.body.classList.contains('dark-mode');
  } catch (e) {
    return false;
  }
};

const Nosotros = ({ setCurrentView }) => {
  const isDark = useIsDark();

  const pageStyle = {
    paddingTop: '80px',
    minHeight: '100vh',
    backgroundColor: isDark ? '#07111a' : '#f8f9fa'
  };

  const sectionStyle = {
    padding: '40px 20px',
    maxWidth: '100%',
    margin: '0 auto'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '25px',
    textAlign: 'center'
  };

  const textStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: isDark ? '#c8cdd3' : '#555',
    marginBottom: '30px',
    textAlign: 'justify',
    background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: isDark ? '0 10px 30px rgba(2,6,23,0.7)' : '0 4px 15px rgba(0,0,0,0.1)'
  };

  const imageContainerStyle = {
    textAlign: 'center',
    marginBottom: '40px'
  };

  const imageStyle = {
    maxWidth: '300px',
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
    boxShadow: isDark ? '0 10px 30px rgba(2,6,23,0.7)' : '0 4px 15px rgba(0,0,0,0.2)'
  };

  const clubesContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '30px'
  };

  const clubStyle = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: isDark ? '0 12px 36px rgba(2,6,23,0.7)' : '0 4px 15px rgba(0,0,0,0.1)',
    border: isDark ? '1px solid rgba(255,255,255,0.03)' : '2px solid #e9ecef'
  };

  const clubTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: isDark ? '#e6eef8' : '#2c3e50',
    marginBottom: '15px',
    textAlign: 'center'
  };

  const clubTextStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: isDark ? '#c8cdd3' : '#555',
    textAlign: 'center'
  };

  const misionStyle = {
    ...clubStyle,
    borderColor: '#28a745'
  };

  const visionStyle = {
    ...clubStyle,
    borderColor: '#007bff'
  };

  const lemaStyle = {
    ...clubStyle,
    borderColor: '#ffc107'
  };

  return (
    <div style={pageStyle}>
      {/* Botón único de regreso para evitar overlays que bloqueen clicks */}
  <BackButton onBack={() => setCurrentView('home')} />
      <main>
        <section style={sectionStyle}>
          <h2 style={titleStyle}>Nosotros</h2>
          <div style={textStyle}>
            <p style={{marginBottom: '20px'}}>
              El Centro de Bachillerato Tecnológico Agropecuario (CBTA) no. 134 se ha convertido en una de las mejores oportunidades para que las y los jóvenes realicen sus estudios de nivel medio superior, porque al término de estos, no solo reciben su certificado sino también un título de carrera técnica.
            </p>
            <p style={{marginBottom: '20px'}}>
              La escuela se ubica en el municipio de San Francisco Tetlanohcan, cuenta con un área total de 27 hectáreas, de ellas, 5 ya tienen construcción con aulas, canchas y áreas para el fomento agropecuario, que la hace única en su estilo en todo el Estado de Tlaxcala.
            </p>
            <p>
              Los estudiantes pueden optar por las carreras: Técnico Agropecuario, Técnico en Sistemas de Producción Pecuaria, Técnico en Programación, Técnico en Contabilidad y Técnico en Ofimática.
            </p>
          </div>
          
          <div style={imageContainerStyle}>
            <img src="/images/campus.png" alt="Campus CBTA 134" style={imageStyle} />
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>Misión, Visión y Lema</h2>
          <div style={clubesContainerStyle}>
            <div style={misionStyle}>
              <h3 style={clubTitleStyle}>🎯 Misión</h3>
              <p style={clubTextStyle}>
                Contribuir activamente en la formación integral de nuestros estudiantes del bachillerato tecnológico con un enfoque de desarrollo sustentable y emprendedor que los integre plenamente a la sociedad.
              </p>
            </div>
            
            <div style={visionStyle}>
              <h3 style={clubTitleStyle}>🔭 Visión</h3>
              <p style={clubTextStyle}>
                Ser una institución de calidad formadora de líderes del mañana, reconocida por su excelencia educativa y compromiso con el desarrollo sustentable.
              </p>
            </div>
            
            <div style={lemaStyle}>
              <h3 style={clubTitleStyle}>💫 Lema</h3>
              <p style={{...clubTextStyle, fontSize: '18px', fontWeight: 'bold', color: '#2c3e50'}}>
                "Formar e innovar para transformar"
              </p>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>Nuestros Valores</h2>
          <div style={clubesContainerStyle}>
            <div style={clubStyle}>
              <h3 style={clubTitleStyle}>🌟 Excelencia Académica</h3>
              <p style={clubTextStyle}>
                Nos comprometemos a brindar una educación de la más alta calidad, fomentando el pensamiento crítico y la innovación.
              </p>
            </div>
            
            <div style={clubStyle}>
              <h3 style={clubTitleStyle}>🤝 Responsabilidad Social</h3>
              <p style={clubTextStyle}>
                Formamos ciudadanos comprometidos con su comunidad y el desarrollo sostenible de la región.
              </p>
            </div>
            
            <div style={clubStyle}>
              <h3 style={clubTitleStyle}>🌱 Desarrollo Sustentable</h3>
              <p style={clubTextStyle}>
                Promovemos prácticas respetuosas con el medio ambiente y el uso responsable de los recursos naturales.
              </p>
            </div>
            
            <div style={clubStyle}>
              <h3 style={clubTitleStyle}>🚀 Innovación</h3>
              <p style={clubTextStyle}>
                Fomentamos la creatividad y el uso de nuevas tecnologías para preparar a nuestros estudiantes para el futuro.
              </p>
            </div>
          </div>
        </section>
      </main>
      
  {/* Se mantiene un solo BackButton en la parte superior; se eliminó el duplicado inferior */}
    </div>
  );
};

export default Nosotros;
