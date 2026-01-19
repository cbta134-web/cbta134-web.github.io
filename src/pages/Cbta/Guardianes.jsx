import React from 'react';

const useIsDark = () => {
  try {
    return typeof document !== 'undefined' && document.body.classList.contains('dark-mode');
  } catch (e) {
    return false;
  }
};

const Guardianes = () => {
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
    color: '#2c3e50',
    marginBottom: '25px',
    textAlign: 'center'
  };

  const sectionStyle = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
    borderRadius: '15px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: isDark ? '0 12px 35px rgba(2,6,23,0.7)' : '0 8px 25px rgba(0,0,0,0.1)'
  };

  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: '15px'
  };

  const textStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#555',
    marginBottom: '15px',
    textAlign: 'justify'
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>⛰️ Guardianes de la Malinche</h1>
        
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🌿 Proyecto Ambiental</h2>
          <p style={textStyle}>
            El proyecto "Guardianes de la Malinche" es una iniciativa del CBTA 134 que busca promover la conciencia ambiental entre nuestros estudiantes y la comunidad, enfocándose en la conservación del ecosistema del Volcán La Malinche y sus alrededores.
          </p>
          <p style={textStyle}>
            Este programa integra conocimientos técnicos con valores ambientales, formando estudiantes comprometidos con el desarrollo sustentable y la preservación de nuestros recursos naturales.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🎯 Objetivos del Proyecto</h2>
          <ul style={{paddingLeft: '20px'}}>
            <li style={{marginBottom: '10px', color: '#555'}}>
              <strong>Conservación:</strong> Proteger y restaurar el ecosistema de La Malinche.
            </li>
            <li style={{marginBottom: '10px', color: '#555'}}>
              <strong>Educación Ambiental:</strong> Desarrollar conciencia ecológica en la comunidad educativa.
            </li>
            <li style={{marginBottom: '10px', color: '#555'}}>
              <strong>Investigación:</strong> Realizar estudios sobre biodiversidad y cambio climático.
            </li>
            <li style={{marginBottom: '10px', color: '#555'}}>
              <strong>Participación Social:</strong> Involucrar a la comunidad en actividades de conservación.
            </li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🌟 Actividades Principales</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px'}}>
            <div style={{background: isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fa', padding: '20px', borderRadius: '10px'}}>
              <h4 style={{color: isDark ? '#e6eef8' : '#2c3e50', marginBottom: '10px'}}>🌱 Reforestación</h4>
              <p style={{color: isDark ? '#bfc7cf' : '#666', fontSize: '14px'}}>
                Plantación de especies nativas para restaurar áreas degradadas.
              </p>
            </div>
            <div style={{background: isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fa', padding: '20px', borderRadius: '10px'}}>
              <h4 style={{color: isDark ? '#e6eef8' : '#2c3e50', marginBottom: '10px'}}>🔬 Investigación</h4>
              <p style={{color: isDark ? '#bfc7cf' : '#666', fontSize: '14px'}}>
                Estudios de flora, fauna y calidad ambiental.
              </p>
            </div>
            <div style={{background: isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fa', padding: '20px', borderRadius: '10px'}}>
              <h4 style={{color: isDark ? '#e6eef8' : '#2c3e50', marginBottom: '10px'}}>👥 Talleres</h4>
              <p style={{color: isDark ? '#bfc7cf' : '#666', fontSize: '14px'}}>
                Capacitación en temas ambientales para la comunidad.
              </p>
            </div>
            <div style={{background: isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fa', padding: '20px', borderRadius: '10px'}}>
              <h4 style={{color: isDark ? '#e6eef8' : '#2c3e50', marginBottom: '10px'}}>🧹 Limpieza</h4>
              <p style={{color: isDark ? '#bfc7cf' : '#666', fontSize: '14px'}}>
                Jornadas de limpieza y mantenimiento de senderos.
              </p>
            </div>
          </div>
        </section>

        <section style={{
          ...sectionStyle,
          background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{...sectionTitleStyle, color: 'white'}}>🌟 Compromiso Ambiental</h2>
          <p style={{...textStyle, color: 'white', textAlign: 'center'}}>
            Como institución educativa, el CBTA 134 forma jóvenes conscientes de su responsabilidad ambiental, preparándolos para ser agentes de cambio positivo en sus comunidades y contribuir al desarrollo sustentable de nuestro país.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Guardianes;
