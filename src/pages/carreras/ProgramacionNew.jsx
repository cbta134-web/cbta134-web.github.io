import React from 'react';
import BackButton from '../../components/BackButton';

const Programacion = ({ setCurrentView }) => {
  const pageStyle = {
    paddingTop: '80px',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '100%',
    margin: '0 auto'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '25px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #6f42c1, #007bff)',
    padding: '20px',
    borderRadius: '10px'
  };

  const sectionStyle = {
    background: 'white',
    borderRadius: '10px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  };

  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#6f42c1',
    marginBottom: '15px'
  };

  const textStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#555',
    marginBottom: '15px',
    textAlign: 'justify'
  };

  const listStyle = {
    paddingLeft: '20px',
    marginBottom: '15px'
  };

  const listItemStyle = {
    marginBottom: '8px',
    color: '#555',
    lineHeight: '1.5'
  };

  const highlightStyle = {
    background: 'linear-gradient(135deg, #e8e9ff, #d6d8ff)',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #6f42c1'
  };

  const techStackStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '15px'
  };

  const techItemStyle = {
    background: '#6f42c1',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold'
  };

  return (
    <div style={pageStyle}>
      <BackButton onClick={() => setCurrentView('home')} text="Volver al inicio" />
      <div style={containerStyle}>
        <h1 style={titleStyle}>💻 Técnico en Programación</h1>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📋 Descripción de la Carrera</h2>
          <p style={textStyle}>
            La carrera de Técnico en Programación forma profesionales capaces de desarrollar aplicaciones de software, páginas web, 
            sistemas móviles y soluciones tecnológicas innovadoras. Los estudiantes adquieren competencias en múltiples lenguajes 
            de programación y frameworks modernos.
          </p>
          
          <div style={highlightStyle}>
            <h3 style={{...sectionTitleStyle, marginBottom: '10px', fontSize: '18px'}}>🎯 Objetivo Principal</h3>
            <p style={{...textStyle, marginBottom: '0'}}>
              Formar técnicos especializados en el desarrollo de software que puedan integrarse exitosamente 
              al sector productivo y continuar con estudios superiores.
            </p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🛠️ Áreas de Especialización</h2>
          <ul style={listStyle}>
            <li style={listItemStyle}>💻 Desarrollo Web Frontend y Backend</li>
            <li style={listItemStyle}>📱 Aplicaciones Móviles (Android/iOS)</li>
            <li style={listItemStyle}>🖥️ Desarrollo de Software de Escritorio</li>
            <li style={listItemStyle}>🌐 Desarrollo Full Stack</li>
            <li style={listItemStyle}>🗄️ Bases de Datos y Sistemas de Información</li>
            <li style={listItemStyle}>🔧 Mantenimiento y Soporte Técnico</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>⚡ Tecnologías que Aprenderás</h2>
          <p style={textStyle}>
            Nuestro programa educativo está actualizado con las tecnologías más demandadas en el mercado laboral:
          </p>
          <div style={techStackStyle}>
            <span style={techItemStyle}>JavaScript</span>
            <span style={techItemStyle}>Python</span>
            <span style={techItemStyle}>Java</span>
            <span style={techItemStyle}>HTML/CSS</span>
            <span style={techItemStyle}>React</span>
            <span style={techItemStyle}>Node.js</span>
            <span style={techItemStyle}>MySQL</span>
            <span style={techItemStyle}>Git</span>
            <span style={techItemStyle}>Bootstrap</span>
            <span style={techItemStyle}>Android Studio</span>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🎓 Plan de Estudios</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px'}}>
            <div>
              <h4 style={{color: '#6f42c1', marginBottom: '10px'}}>📚 Primer Año</h4>
              <ul style={listStyle}>
                <li style={listItemStyle}>Fundamentos de Programación</li>
                <li style={listItemStyle}>Algoritmos y Estructuras de Datos</li>
                <li style={listItemStyle}>HTML y CSS Básico</li>
                <li style={listItemStyle}>Introducción a Bases de Datos</li>
              </ul>
            </div>
            <div>
              <h4 style={{color: '#6f42c1', marginBottom: '10px'}}>📚 Segundo Año</h4>
              <ul style={listStyle}>
                <li style={listItemStyle}>Programación Orientada a Objetos</li>
                <li style={listItemStyle}>Desarrollo Web Frontend</li>
                <li style={listItemStyle}>JavaScript Avanzado</li>
                <li style={listItemStyle}>Diseño de Interfaces</li>
              </ul>
            </div>
            <div>
              <h4 style={{color: '#6f42c1', marginBottom: '10px'}}>📚 Tercer Año</h4>
              <ul style={listStyle}>
                <li style={listItemStyle}>Desarrollo Web Backend</li>
                <li style={listItemStyle}>Aplicaciones Móviles</li>
                <li style={listItemStyle}>Proyectos Integradores</li>
                <li style={listItemStyle}>Prácticas Profesionales</li>
              </ul>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>💼 Campo Laboral</h2>
          <p style={textStyle}>
            Como egresado de la carrera de Técnico en Programación, podrás trabajar en:
          </p>
          <ul style={listStyle}>
            <li style={listItemStyle}>🏢 Empresas de desarrollo de software</li>
            <li style={listItemStyle}>🌐 Agencias de marketing digital</li>
            <li style={listItemStyle}>🏭 Departamentos de TI en empresas</li>
            <li style={listItemStyle}>👨‍💼 Freelancer o consultor independiente</li>
            <li style={listItemStyle}>🚀 Startups tecnológicas</li>
            <li style={listItemStyle}>🎓 Continuar estudios universitarios en Ingeniería en Sistemas</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📞 Información de Contacto</h2>
          <div style={highlightStyle}>
            <p style={textStyle}>
              <strong>📍 Ubicación:</strong> CBTa 134, Calle Josefa Ortiz de Domínguez s/n, 
              Barrio de Jesús Xolalpan, San Francisco Tetlanohcan, Tlaxcala
            </p>
            <p style={textStyle}>
              <strong>📞 Teléfono:</strong> 246 467 42 37
            </p>
            <p style={textStyle}>
              <strong>🌐 Sitio Web:</strong> www.cbta134.edu.mx
            </p>
            <p style={{...textStyle, marginBottom: '0'}}>
              <strong>📧 Más información:</strong> Visita nuestras redes sociales o acércate directamente a la institución
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Programacion;
