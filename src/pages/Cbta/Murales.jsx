import React from 'react';
import BackButton from '../../components/BackButton';

const useIsDark = () => {
  try {
    return typeof document !== 'undefined' && document.body.classList.contains('dark-mode');
  } catch (e) {
    return false;
  }
};

const Murales = () => {
  const isDark = useIsDark();
  
  const pageStyle = {
    paddingTop: '80px',
    minHeight: '100vh',
    backgroundColor: isDark ? '#0f1720' : '#f8f9fa'
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '100%',
    margin: '0 auto'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#2c3e50',
    marginBottom: '25px',
    textAlign: 'center'
  };

  const sectionStyle = {
    background: isDark ? '#1e2a3d' : 'white',
    borderRadius: '15px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: isDark ? '0 8px 25px rgba(0,0,0,0.6)' : '0 8px 25px rgba(0,0,0,0.1)'
  };

  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: isDark ? '#9f7bea' : '#8e44ad',
    marginBottom: '15px'
  };

  const textStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: isDark ? '#e2e8f0' : '#555',
    marginBottom: '15px',
    textAlign: 'justify'
  };

  const cardStyle = {
    background: isDark ? '#2d3748' : '#f8f9fa',
    padding: '20px',
    borderRadius: '10px'
  };

  const cardTitleStyle = {
    color: isDark ? '#ffffff' : '#2c3e50',
    marginBottom: '10px'
  };

  const cardTextStyle = {
    color: isDark ? '#cbd5e0' : '#666',
    fontSize: '14px'
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <BackButton onBack={() => window.history.back()} />
        <h1 style={titleStyle}>🎨 Murales y Monumentos</h1>
        
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🖼️ Arte Mural en el CBTA 134</h2>
          <p style={textStyle}>
            Nuestro campus cuenta con hermosos murales que reflejan la identidad cultural de Tlaxcala y los valores institucionales del CBTA 134. Estas obras de arte no solo embellecen nuestras instalaciones, sino que también educan y inspiran a la comunidad estudiantil.
          </p>
          <p style={textStyle}>
            Los murales fueron creados con la participación de estudiantes, docentes y artistas locales, representando temas como la agricultura, la tecnología, la historia de México y la importancia de la educación técnica.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🏛️ Monumentos Históricos</h2>
          <p style={textStyle}>
            En los alrededores de nuestra institución se encuentran diversos monumentos que forman parte del patrimonio histórico y cultural de San Francisco Tetlanohcan. Estos sitios son utilizados como espacios de aprendizaje para complementar la formación integral de nuestros estudiantes.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🎯 Importancia Educativa</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px'}}>
            <div style={cardStyle}>
              <h4 style={cardTitleStyle}>🎨 Expresión Artística</h4>
              <p style={cardTextStyle}>
                Fomentan la creatividad y apreciación del arte entre los estudiantes.
              </p>
            </div>
            <div style={cardStyle}>
              <h4 style={cardTitleStyle}>📚 Valor Educativo</h4>
              <p style={cardTextStyle}>
                Sirven como herramientas pedagógicas para diferentes materias.
              </p>
            </div>
            <div style={cardStyle}>
              <h4 style={cardTitleStyle}>🏛️ Identidad Cultural</h4>
              <p style={cardTextStyle}>
                Preservan y promueven la cultura e historia local.
              </p>
            </div>
            <div style={cardStyle}>
              <h4 style={cardTitleStyle}>🌟 Inspiración</h4>
              <p style={cardTextStyle}>
                Motivan a los estudiantes hacia la excelencia académica.
              </p>
            </div>
          </div>
        </section>

        <section style={{
          ...sectionStyle,
          background: 'linear-gradient(135deg, #8e44ad, #9b59b6)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{...sectionTitleStyle, color: 'white'}}>🌟 Arte y Educación Unidos</h2>
          <p style={{...textStyle, color: 'white', textAlign: 'center'}}>
            En el CBTA 134 creemos que el arte y la cultura son elementos fundamentales en la formación integral de nuestros estudiantes, complementando su preparación técnica con valores estéticos y culturales.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Murales;
