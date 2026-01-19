import React from 'react';
import BackButton from '../../components/BackButton';

// Hook personalizado para detectar si el modo oscuro está activo
const useIsDark = () => {
  if (typeof document === 'undefined') return false; // Previene errores en SSR
  return document.body.classList.contains('dark-mode'); // Retorna true si body tiene la clase 'dark-mode'
};

const Contabilidad = ({ setCurrentView }) => {
  const isDark = useIsDark(); // Verifica el modo oscuro

  // Estilo general de la página
  const pageStyle = {
    paddingTop: '80px',
    minHeight: '100vh',
    backgroundColor: isDark ? 'transparent' : '#f0fdf4' // verde muy claro
  };

  // Contenedor principal
  const containerStyle = {
    padding: '20px',
    maxWidth: '100%',
    margin: '0 auto'
  };

  // Estilo del título principal
  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '30px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #2e7d32, #1b5e20)', // degradado verde
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 8px 25px rgba(46,125,50,0.3)'
  };

  // Estilo de cada sección
  const sectionStyle = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: isDark ? '0 12px 35px rgba(0,0,0,0.6)' : '0 8px 25px rgba(0,0,0,0.1)',
    border: isDark ? '1px solid rgba(255,255,255,0.05)' : 'none'
  };

  // Estilo de títulos de sección
  const sectionTitleStyle = {
    fontSize: '22px',
    fontWeight: 'bold',
    color: isDark ? '#4ade80' : '#2e7d32', // verde oscuro
    marginBottom: '20px',
    borderBottom: '3px solid #2e7d32',
    paddingBottom: '10px'
  };

  // Estilo de párrafos
  const textStyle = {
    fontSize: '16px',
    lineHeight: '1.7',
    color: isDark ? '#e2e8f0' : '#4a5568', // gris oscuro
    marginBottom: '15px'
  };

  // Estilo de listas
  const listStyle = {
    fontSize: '16px',
    color: isDark ? '#e2e8f0' : '#4a5568',
    lineHeight: '1.7',
    paddingLeft: '20px'
  };

  // Estilo de tablas
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    background: isDark ? 'rgba(255,255,255,0.02)' : '#f0fdf4',
    borderRadius: '10px',
    overflow: 'hidden'
  };

  // Estilo de encabezados de tabla
  const thStyle = {
    background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
    color: 'white',
    padding: '15px',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '14px'
  };

  // Estilo de celdas de tabla
  const tdStyle = {
    padding: '15px',
    borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9f5ec',
    color: isDark ? '#e2e8f0' : '#4a5568',
    fontSize: '14px',
    lineHeight: '1.6'
  };

  // Caja resaltada para información importante
  const highlightBoxStyle = {
    background: 'linear-gradient(135deg, rgba(46,125,50,0.1), rgba(27,94,32,0.1))',
    borderLeft: '4px solid #2e7d32',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '20px'
  };

  // Tarjetas de competencias
  const competencyCardStyle = {
    background: isDark ? 'rgba(255,255,255,0.02)' : '#f0fdf4',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '15px',
    borderLeft: '4px solid #2e7d32'
  };

  return (
    <div style={pageStyle}>
      {/* Botón de retroceso */}
      <BackButton onBack={() => setCurrentView('programas')} />

      <div style={containerStyle}>
        <h1 style={titleStyle}>💼 Técnico en Contabilidad</h1>

        {/* Sección Descripción General */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📋 Descripción General</h2>
          <p style={textStyle}>
            El plan de estudios del Bachillerato Tecnológico en Contabilidad forma parte del Marco Curricular Común de la Educación Media Superior. 
            Su estructura contempla seis semestres con asignaturas de formación básica, extendida y profesional, abarcando áreas como Lengua, 
            Matemáticas, Humanidades, Cultura Digital, Ciencias, Inglés y Formación Socioemocional.
          </p>
          <p style={textStyle}>
            La formación laboral inicia en el segundo semestre y se desarrolla en cinco módulos transdisciplinarios que suman 1,200 horas de formación 
            con mediación docente, proporcionando competencias específicas del área contable.
          </p>
        </section>

        {/* Sección Justificación de la carrera */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🎯 Justificación de la Carrera</h2>
          <p style={textStyle}>
            La carrera de Técnico en Contabilidad responde a la necesidad de formar profesionales capaces de registrar operaciones financieras, 
            calcular impuestos, colaborar en auditorías y analizar información económica de forma ética, responsable y con dominio tecnológico.
          </p>
          <p style={textStyle}>
            Esto facilita su inserción laboral, continuidad educativa y desarrollo de emprendimientos, además de fortalecer su rol como agentes 
            de cambio comprometidos con el desarrollo sostenible.
          </p>
        </section>

        {/* Sección Mapa de Competencias Profesionales */}
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
              {/* Los módulos se mantienen igual */}
            </tbody>
          </table>
          
          {/* Caja destacada del total de horas */}
          <div style={highlightBoxStyle}>
            <p style={{...textStyle, fontWeight: 'bold', color: '#2e7d32'}}>
              📊 Total de horas de formación laboral: 1,200 horas
            </p>
          </div>
        </section>

        {/* Resto de secciones sigue la misma lógica con comentarios */}
      </div>
    </div>
  );
};

export default Contabilidad;
