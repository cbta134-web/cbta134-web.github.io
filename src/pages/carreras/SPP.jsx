import React from 'react';
import BackButton from '../../components/BackButton';

const useIsDark = () => {
  if (typeof document === 'undefined') return false;
  return document.body.classList.contains('dark-mode');
};

const SPP = ({ setCurrentView }) => {
  const isDark = useIsDark();

  const pageStyle = {
    paddingTop: '80px',
    minHeight: '100vh',
    backgroundColor: isDark ? 'transparent' : '#f8f9fa'
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '100%',
    margin: '0 auto'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '30px',
    textAlign: 'center',
    backgroundColor: '#27ae60', // verde sólido
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 8px 25px rgba(39, 174, 96, 0.3)'
  };

  const sectionStyle = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: isDark ? '0 12px 35px rgba(0,0,0,0.6)' : '0 8px 25px rgba(0,0,0,0.1)',
    border: isDark ? '1px solid rgba(255,255,255,0.05)' : 'none'
  };

  const sectionTitleStyle = {
    fontSize: '22px',
    fontWeight: 'bold',
    color: isDark ? '#7bed9f' : '#27ae60',
    marginBottom: '20px',
    borderBottom: '3px solid #27ae60',
    paddingBottom: '10px'
  };

  const textStyle = {
    fontSize: '16px',
    lineHeight: '1.7',
    color: isDark ? '#e2e8f0' : '#4a5568',
    marginBottom: '15px'
  };

  const listStyle = {
    fontSize: '16px',
    color: isDark ? '#e2e8f0' : '#4a5568',
    lineHeight: '1.7',
    paddingLeft: '20px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    background: isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fa',
    borderRadius: '10px',
    overflow: 'hidden'
  };

  const thStyle = {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '15px',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '14px'
  };

  const tdStyle = {
    padding: '15px',
    borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
    color: isDark ? '#e2e8f0' : '#4a5568',
    fontSize: '14px',
    lineHeight: '1.6'
  };

  const highlightBoxStyle = {
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    borderLeft: '4px solid #27ae60',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '20px'
  };

  const competencyCardStyle = {
    background: isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fa',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '15px',
    borderLeft: '4px solid #27ae60'
  };

  return (
    <div style={pageStyle}>
      <BackButton onBack={() => setCurrentView('programas')} />

      <div style={containerStyle}>
        <h1 style={titleStyle}>🐄 Técnico en Sistemas de Producción Pecuaria</h1>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📋 Justificación de la Carrera</h2>
          <p style={textStyle}>
            La carrera de Técnico en Sistemas de Producción Pecuaria es clave para el desarrollo sostenible del sector agropecuario, 
            formando profesionales capaces de mejorar la productividad y el bienestar animal mediante prácticas sustentables y eficientes.
          </p>
          <p style={textStyle}>
            Esta formación técnica responde a las demandas del sector productivo regional, impulsando el aprovechamiento racional 
            de los recursos naturales y la integración de nuevas tecnologías en la producción animal.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📚 Mapa de Competencias Profesionales</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Módulo</th>
                <th style={thStyle}>Competencia Laboral</th>
                <th style={thStyle}>Submódulos</th>
                <th style={thStyle}>Duración (Horas)</th>
              </tr>
            </thead>
            <tbody>
              {/* Ejemplo de fila */}
              <tr>
                <td style={tdStyle}>I</td>
                <td style={tdStyle}>Aplica buenas prácticas pecuarias en la producción animal</td>
                <td style={tdStyle}>Manejo de animales, instalaciones y bioseguridad</td>
                <td style={tdStyle}>280</td>
              </tr>
            </tbody>
          </table>

          <div style={highlightBoxStyle}>
            <p style={{ ...textStyle, fontWeight: 'bold', color: isDark ? '#7bed9f' : '#27ae60' }}>
              📊 Total de horas de formación laboral: 1,200 horas
            </p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🎯 Perfil de Egreso</h2>
          <p style={textStyle}>
            El egresado de Técnico en Sistemas de Producción Pecuaria contará con competencias en el manejo integral de animales,
            la gestión productiva y la aplicación de normativas de sanidad y bienestar animal.
          </p>

          <div style={competencyCardStyle}>
            <h3 style={{ ...sectionTitleStyle, fontSize: '18px', marginBottom: '15px' }}>💡 Competencias Clave</h3>
            <ul style={listStyle}>
              <li>Implementa prácticas sustentables en la producción pecuaria.</li>
              <li>Aplica técnicas de reproducción y nutrición animal.</li>
              <li>Gestiona instalaciones y recursos pecuarios.</li>
              <li>Aplica medidas de bioseguridad y bienestar animal.</li>
            </ul>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🛠️ Áreas de Especialización</h2>
          <p style={textStyle}>Producción bovina, porcina, avícola y caprina, así como manejo de pastizales y alimentación balanceada.</p>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🌟 Habilidades Socioemocionales</h2>
          <ul style={listStyle}>
            <li>Responsabilidad ambiental y ética profesional.</li>
            <li>Trabajo en equipo y liderazgo en entornos rurales.</li>
            <li>Adaptación a nuevas tecnologías agropecuarias.</li>
          </ul>
        </section>

        <section style={{
          ...sectionStyle,
          backgroundColor: '#27ae60',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ ...sectionTitleStyle, color: 'white', borderColor: 'white' }}>🚀 Oportunidades Profesionales</h2>
          <p>El egresado podrá laborar en ranchos, unidades de producción, empresas agroindustriales o emprender su propio negocio pecuario.</p>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📚 Plan de Estudios Oficial</h2>
          <p style={textStyle}>
            Consulta el programa de estudios completo y oficial de la carrera Técnico en Sistemas de Producción Pecuaria.
          </p>
          <div style={{
            background: isDark ? '#1e2a3d' : 'white',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: isDark ? '0 8px 25px rgba(0,0,0,0.6)' : '0 8px 25px rgba(0,0,0,0.1)',
            marginTop: '20px'
          }}>
            <iframe
              src="/programa de estudios/SPP.pdf"
              style={{ width: '100%', height: '600px', border: 'none', borderRadius: '10px' }}
              title="Plan de Estudios - Técnico en SPP"
            />
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <a
                href="/programa de estudios/SPP.pdf"
                download="Plan_Estudios_SPP.pdf"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  transition: 'background-color 0.3s ease',
                  boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)'
                }}
              >
                📥 Descargar Plan de Estudios
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SPP;
