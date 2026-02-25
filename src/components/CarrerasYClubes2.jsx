import React from 'react';
import BackButton from './BackButton';

const useIsDark = () => {
  try {
    return typeof document !== 'undefined' && document.body.classList.contains('dark-mode');
  } catch (e) {
    return false;
  }
};

const CarrerasYClubes = ({ onBack, setCurrentView }) => {
  const isDark = useIsDark();
  
  const carreras = [
    {
      id: 'agropecuario',
      nombre: 'Técnico Agropecuario',
      descripcion: 'Forma profesionales en el área agropecuaria con conocimientos en agricultura, ganadería y desarrollo sustentable.',
      icono: '🌾',
      imagen: '/images/agropecuarios.jpg'
    },
    {
      id: 'spp',
      nombre: 'Sistemas de Producción de Procesos',
      descripcion: 'Prepara técnicos especializados en sistemas de producción industrial y optimización de procesos.',
      icono: '⚙️',
      imagen: '/images/programacion.jpg'
    },
    {
      id: 'ofimatica',
      nombre: 'Técnico en Ofimática',
      descripcion: 'Desarrolla habilidades en herramientas ofimáticas, administración y tecnologías de la información.',
      icono: '💻',
      imagen: '/images/ofimatica.jpg'
    },
    {
      id: 'programacion',
      nombre: 'Técnico en Programación',
      descripcion: 'Forma programadores con conocimientos en desarrollo de software y tecnologías emergentes.',
      icono: '👨‍💻',
      imagen: '/images/programacion.jpg'
    },
    {
      id: 'contabilidad',
      nombre: 'Técnico en Contabilidad',
      descripcion: 'Prepara especialistas en contabilidad, finanzas y administración empresarial.',
      icono: '📊',
      imagen: '/images/contabilidad.jpg'
    }
  ];

  const containerStyle = {
    paddingTop: '80px',
    minHeight: '100vh',
    backgroundColor: isDark ? '#0f1720' : '#f8f9fa',
    padding: '80px 20px 40px 20px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1e3c72',
    textAlign: 'center',
    marginBottom: '20px'
  };

  const subtitleStyle = {
    fontSize: '18px',
    color: isDark ? '#e2e8f0' : '#666',
    textAlign: 'center',
    marginBottom: '40px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const cardStyle = {
    backgroundColor: isDark ? '#1e2a3d' : 'white',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: isDark ? '0 8px 25px rgba(0,0,0,0.6)' : '0 8px 25px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer'
  };

  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  };

  const contentStyle = {
    padding: '25px'
  };

  const careerTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1e3c72',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const descriptionStyle = {
    fontSize: '16px',
    color: isDark ? '#cbd5e0' : '#666',
    lineHeight: '1.6',
    marginBottom: '20px'
  };

  const buttonStyle = {
    backgroundColor: isDark ? '#2d3748' : '#1e3c72',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '100%'
  };

  const handleCareerClick = (carreraId) => {
    setCurrentView(carreraId);
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Carreras Técnicas</h1>
      <p style={subtitleStyle}>
        Conoce nuestras especialidades técnicas y elige tu futuro profesional
      </p>

      <div style={gridStyle}>
        {carreras.map((carrera) => (
          <div 
            key={carrera.id}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = isDark ? '0 12px 35px rgba(0,0,0,0.8)' : '0 12px 35px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isDark ? '0 8px 25px rgba(0,0,0,0.6)' : '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onClick={() => handleCareerClick(carrera.id)}
          >
            <img 
              src={carrera.imagen} 
              alt={carrera.nombre}
              style={imageStyle}
            />
            <div style={contentStyle}>
              <h3 style={careerTitleStyle}>
                <span style={{fontSize: '24px'}}>{carrera.icono}</span>
                {carrera.nombre}
              </h3>
              <p style={descriptionStyle}>
                {carrera.descripcion}
              </p>
              <button 
                style={buttonStyle}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#4a5568' : '#2a5298'}
                onMouseLeave={(e) => e.target.style.backgroundColor = isDark ? '#2d3748' : '#1e3c72'}
              >
                Ver más información
              </button>
            </div>
          </div>
        ))}
      </div>

      <BackButton onBack={onBack} text="Regresar al Menú Principal" />
    </div>
  );
};

export default CarrerasYClubes;
