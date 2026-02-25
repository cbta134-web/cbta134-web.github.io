import React from 'react';
import BackButton from '../../components/BackButton';

// Hook personalizado para detectar si el modo oscuro está activo
const useIsDark = () => {
  if (typeof document === 'undefined') return false;
  return document.body.classList.contains('dark-mode');
};

const Ofimatica = ({ setCurrentView }) => {
  const isDark = useIsDark();

  const pageStyle = {
    paddingTop: '80px',
    minHeight: '100vh',
    backgroundColor: isDark ? 'transparent' : '#f1f8f4' // verde muy claro en modo claro
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
    background: 'linear-gradient(135deg, #2e7d32, #43a047)', // degradado verde
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 8px 25px rgba(46, 125, 50, 0.3)'
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
    color: isDark ? '#81c784' : '#2e7d32',
    marginBottom: '20px',
    borderBottom: '3px solid #2e7d32',
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
    background: 'linear-gradient(135deg, #2e7d32, #43a047)',
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
    background: 'linear-gradient(135deg, rgba(46,125,50,0.1), rgba(67,160,71,0.1))',
    borderLeft: '4px solid #2e7d32',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '20px'
  };

  const competencyCardStyle = {
    background: isDark ? 'rgba(255,255,255,0.02)' : '#f1f8f4',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '15px',
    borderLeft: '4px solid #2e7d32'
  };

  return (
    <div style={pageStyle}>
      <BackButton onBack={() => setCurrentView('programas')} />

      <div style={containerStyle}>
        <h1 style={titleStyle}>💻 Técnico en Ofimática</h1>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📋 Justificación de la Carrera</h2>
          <p style={textStyle}>
            En el contexto regional y nacional, la formación de Técnico en Ofimática es relevante porque ofrece competencias profesionales
            que permiten al estudiante obtener y gestionar información de manera digital mediante el uso eficaz y eficiente de los recursos informáticos disponibles.
          </p>
          <p style={textStyle}>
            Esta carrera atiende las nuevas exigencias en la gestión y procesamiento de datos, bajo normas y estándares de calidad que
            responden a las demandas de sectores estratégicos, especialmente en tecnologías de la información y comunicación.
          </p>
          <p style={textStyle}>
            Permite gestionar hardware y software de ofimática, información local y remota, y bases de datos, además de establecer comunicación digital.
            Las competencias se desarrollan mediante actividades interdisciplinarias y socioemocionales, promoviendo habilidades como autoconciencia, autorregulación y toma de decisiones.
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
            <tbody></tbody>
          </table>

          <div style={highlightBoxStyle}>
            <p style={{ ...textStyle, fontWeight: 'bold', color: isDark ? '#81c784' : '#2e7d32' }}>
              📊 Total de horas de formación laboral: 1,200 horas
            </p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🎯 Perfil de Egreso</h2>
          <p style={textStyle}>
            El Técnico en Ofimática permite adquirir competencias integrales, sustentadas en competencias genéricas, disciplinares, profesionales y de empleabilidad.
          </p>

          <div style={competencyCardStyle}>
            <h3 style={{ ...sectionTitleStyle, fontSize: '18px', marginBottom: '15px' }}>💡 Competencias Clave</h3>
            <ul style={listStyle}>
              <li>Utiliza tecnologías de la información para investigar, resolver problemas y transmitir información.</li>
              <li>Gestiona hardware y software, además de información local y remota.</li>
              <li>Desarrolla capacidad de organizar actividades, cumplir compromisos y trabajar en equipo.</li>
              <li>Aplica normas de seguridad y se adapta a cambios en herramientas y procedimientos de trabajo.</li>
            </ul>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🛠️ Áreas de Especialización</h2>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🌟 Habilidades Socioemocionales</h2>
        </section>

        <section
          style={{
            ...sectionStyle,
            background: 'linear-gradient(135deg, #2e7d32, #43a047)',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <h2 style={{ ...sectionTitleStyle, color: 'white', borderColor: 'white' }}>🚀 Oportunidades Profesionales</h2>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📚 Plan de Estudios Oficial</h2>
          <p style={textStyle}>
            Consulta el programa de estudios completo y oficial de la carrera Técnico en Ofimática.
          </p>
          <div
            style={{
              background: isDark ? '#1e2a3d' : 'white',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: isDark ? '0 8px 25px rgba(0,0,0,0.6)' : '0 8px 25px rgba(0,0,0,0.1)',
              marginTop: '20px'
            }}
          >
            <iframe
              src="/programa de estudios/Ofimatica.pdf"
              style={{ width: '100%', height: '600px', border: 'none', borderRadius: '10px' }}
              title="Plan de Estudios - Técnico en Ofimática"
            />
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <a
                href="/programa de estudios/Ofimatica.pdf"
                download="Plan_Estudios_Ofimatica.pdf"
                style={{
                  display: 'inline-block',
                  backgroundColor: isDark ? '#81c784' : '#2e7d32',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  transition: 'background-color 0.3s ease',
                  boxShadow: '0 4px 15px rgba(67, 160, 71, 0.3)'
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

export default Ofimatica;
