import React, { useState } from 'react';
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
      imagen: '/assets/carreras/agrope.jpg'
    },
    {
      id: 'spp',
      nombre: 'Sistemas de Producción Pecuaria',
      descripcion: 'Prepara técnicos especializados en ganadería y producción animal sustentable.',
      icono: '🐄',
      imagen: '/assets/carreras/pecuarios.jpg'
    },
    {
      id: 'ofimatica',
      nombre: 'Técnico en Ofimática',
      descripcion: 'Desarrolla habilidades en herramientas ofimáticas, administración y tecnologías de la información.',
      icono: '💻',
      imagen: '/assets/carreras/ofam.jpg'
    },
    {
      id: 'contabilidad',
      nombre: 'Técnico en Contabilidad',
      descripcion: 'Prepara especialistas en contabilidad, finanzas y administración empresarial.',
      icono: '📊',
      imagen: '/assets/carreras/conta.jpg'
    },
    {
      id: 'programacion',
      nombre: 'Técnico en Programación',
      descripcion: 'Forma programadores con conocimientos en desarrollo de software, aplicaciones web y tecnologías emergentes.',
      icono: '👨‍💻',
      imagen: '/images/programacion.jpg'
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
    backgroundColor: 'var(--primary-color)',
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
    // Mapeo de IDs de carreras a nombres de componentes
    const careerComponentMap = {
      'agropecuario': 'agropecuario',
      'spp': 'spp',
      'ofimatica': 'ofimatica',
      'contabilidad': 'contabilidad',
      'programacion': 'programacion'
    };
    
    // Navegar directamente al componente de la carrera
    const componentName = careerComponentMap[carreraId];
    if (componentName && setCurrentView) {
      setCurrentView(componentName);
    }
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
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--link-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary-color)'}
              >
                Ver más información
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de Programas de Estudio */}
      <section style={{marginTop: '60px', textAlign: 'center'}}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: isDark ? '#ffffff' : '#1e3c72',
          marginBottom: '20px'
        }}>
          📚 Programas de Estudio
        </h2>
        <p style={{
          fontSize: '16px',
          color: isDark ? '#e2e8f0' : '#666',
          marginBottom: '30px'
        }}>
          Descarga los programas de estudio oficiales de nuestras carreras técnicas
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <a 
            href="/programa de estudios/PROGRAMA_DE_ESTUDIOS_AGROPECUARIO.pdf"
            download
            style={{
              backgroundColor: isDark ? '#1e2a3d' : 'white',
              padding: '20px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: isDark ? '#ffffff' : '#1e3c72',
              boxShadow: isDark ? '0 4px 15px rgba(0,0,0,0.6)' : '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              display: 'block'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{fontSize: '24px', marginBottom: '10px'}}>🌾</div>
            <h4 style={{margin: '0 0 8px 0', fontSize: '16px'}}>Técnico Agropecuario</h4>
            <span style={{fontSize: '14px', color: isDark ? '#cbd5e0' : '#666'}}>Descargar PDF</span>
          </a>

          <a 
            href="/programa de estudios/Sistemas_Produccion_Pecuaria.pdf"
            download
            style={{
              backgroundColor: isDark ? '#1e2a3d' : 'white',
              padding: '20px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: isDark ? '#ffffff' : '#1e3c72',
              boxShadow: isDark ? '0 4px 15px rgba(0,0,0,0.6)' : '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              display: 'block'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{fontSize: '24px', marginBottom: '10px'}}>🐄</div>
            <h4 style={{margin: '0 0 8px 0', fontSize: '16px'}}>Sistemas de Producción Pecuaria</h4>
            <span style={{fontSize: '14px', color: isDark ? '#cbd5e0' : '#666'}}>Descargar PDF</span>
          </a>

          <a 
            href="/programa de estudios/Ofimatica.pdf"
            download
            style={{
              backgroundColor: isDark ? '#1e2a3d' : 'white',
              padding: '20px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: isDark ? '#ffffff' : '#1e3c72',
              boxShadow: isDark ? '0 4px 15px rgba(0,0,0,0.6)' : '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              display: 'block'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{fontSize: '24px', marginBottom: '10px'}}>💻</div>
            <h4 style={{margin: '0 0 8px 0', fontSize: '16px'}}>Técnico en Ofimática</h4>
            <span style={{fontSize: '14px', color: isDark ? '#cbd5e0' : '#666'}}>Descargar PDF</span>
          </a>

          <a 
            href="/programa de estudios/CONTABILIDAD1.pdf"
            download
            style={{
              backgroundColor: isDark ? '#1e2a3d' : 'white',
              padding: '20px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: isDark ? '#ffffff' : '#1e3c72',
              boxShadow: isDark ? '0 4px 15px rgba(0,0,0,0.6)' : '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              display: 'block'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{fontSize: '24px', marginBottom: '10px'}}>📊</div>
            <h4 style={{margin: '0 0 8px 0', fontSize: '16px'}}>Técnico en Contabilidad</h4>
            <span style={{fontSize: '14px', color: isDark ? '#cbd5e0' : '#666'}}>Descargar PDF</span>
          </a>

          <a 
            href="/programa de estudios/PROGRAMA DE ESTUDIOS PROGRAMACION.pdf"
            download
            style={{
              backgroundColor: isDark ? '#1e2a3d' : 'white',
              padding: '20px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: isDark ? '#ffffff' : '#1e3c72',
              boxShadow: isDark ? '0 4px 15px rgba(0,0,0,0.6)' : '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              display: 'block'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{fontSize: '24px', marginBottom: '10px'}}>👨‍💻</div>
            <h4 style={{margin: '0 0 8px 0', fontSize: '16px'}}>Técnico en Programación</h4>
            <span style={{fontSize: '14px', color: isDark ? '#cbd5e0' : '#666'}}>Descargar PDF</span>
          </a>
        </div>
      </section>

      <BackButton onBack={onBack} text="Regresar al Menú Principal" />
    </div>
  );
};

export default CarrerasYClubes;
