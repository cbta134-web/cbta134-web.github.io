import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import { supabase } from '../../lib/supabaseClient';

const Programas = ({ setCurrentView }) => {
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState(null);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const { data, error } = await supabase
        .from('carreras_tecnicas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProgramas(data || []);
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Si hay una carrera seleccionada, mostrar vista de detalle
  if (selectedCareer) {
    return <CareerDetailView career={selectedCareer} onBack={() => setSelectedCareer(null)} setCurrentView={setCurrentView} />;
  }

  const pageStyle = {
    paddingTop: '80px',
    minHeight: '100vh',
    backgroundColor: '#ffffff'
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '100%',
    margin: '0 auto'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: '25px',
    textAlign: 'center'
  };

  const introStyle = {
    background: '#e9f7ef',
    borderRadius: '15px',
    padding: '25px',
    marginBottom: '30px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    textAlign: 'center'
  };

  const programsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
    marginBottom: '40px'
  };

  const programCardStyle = {
    background: '#f8fdf8',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '1px solid #28a745',
    cursor: 'pointer'
  };

  const programContentStyle = {
    padding: '25px'
  };

  const programTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#28a745'
  };

  const programDescStyle = {
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '20px',
    minHeight: '60px'
  };

  const ProgramCard = ({ career }) => (
    <div
      style={programCardStyle}
      onClick={() => setSelectedCareer(career)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 15px 35px rgba(40, 167, 69, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
      }}
    >
      {career.imagen_url && (
        <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
          <img
            src={career.imagen_url}
            alt={career.nombre}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
      <div style={programContentStyle}>
        <h3 style={programTitleStyle}>{career.nombre}</h3>
        <p style={programDescStyle}>{career.descripcion || 'Formación técnica de excelencia'}</p>

        <button
          style={{
            display: 'inline-block',
            background: '#28a745',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            border: 'none',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            width: '100%'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
        >
          Ver más información →
        </button>
      </div>
    </div>
  );

  return (
    <div style={pageStyle}>
      <BackButton onClick={() => setCurrentView('home')} />
      <div style={containerStyle}>
        <h1 style={titleStyle}>📚 Programas Educativos</h1>

        <section style={introStyle}>
          <h2 style={{ color: '#28a745', marginBottom: '20px' }}>Formación Técnica de Excelencia</h2>
          <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
            En el CBTA 134 ofrecemos programas educativos de nivel medio superior que combinan formación académica sólida con competencias técnicas especializadas. Nuestros egresados están preparados tanto para incorporarse al mercado laboral como para continuar estudios superiores.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px',
            marginTop: '30px'
          }}>
            <div>
              <h4 style={{ color: '#28a745', fontSize: '24px', margin: '0 0 5px 0' }}>{programas.length}</h4>
              <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>Carreras Técnicas</p>
            </div>
            <div>
              <h4 style={{ color: '#28a745', fontSize: '24px', margin: '0 0 5px 0' }}>3</h4>
              <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>Años de Duración</p>
            </div>
            <div>
              <h4 style={{ color: '#28a745', fontSize: '24px', margin: '0 0 5px 0' }}>100%</h4>
              <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>Validez Oficial</p>
            </div>
          </div>
        </section>

        <section>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Cargando carreras técnicas...</p>
          ) : programas.length > 0 ? (
            <div style={programsGridStyle}>
              {programas.map((programa) => (
                <ProgramCard key={programa.id} career={programa} />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>No hay carreras registradas por el momento.</p>
          )}
        </section>
      </div>
    </div>
  );
};

// Componente de vista detallada de carrera
const CareerDetailView = ({ career, onBack, setCurrentView }) => {
  const pageStyle = {
    paddingTop: '80px',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    padding: '80px 20px 40px 20px'
  };

  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto'
  };

  const headerStyle = {
    background: '#28a745',
    color: 'white',
    padding: '40px',
    borderRadius: '15px',
    marginBottom: '30px',
    textAlign: 'center'
  };

  const sectionStyle = {
    background: 'white',
    padding: '30px',
    borderRadius: '15px',
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0'
  };

  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const contentStyle = {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.8',
    whiteSpace: 'pre-wrap'
  };

  return (
    <div style={pageStyle}>
      <BackButton onClick={onBack} text="← Regresar a Carreras" />

      <div style={containerStyle}>
        {/* Header con imagen */}
        {career.imagen_url && (
          <div style={{ width: '100%', height: '300px', borderRadius: '15px', overflow: 'hidden', marginBottom: '20px' }}>
            <img
              src={career.imagen_url}
              alt={career.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        <div style={headerStyle}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>{career.nombre}</h1>
          {career.descripcion && <p style={{ margin: 0, fontSize: '18px', opacity: 0.95 }}>{career.descripcion}</p>}
        </div>

        {/* Programa de Competencias */}
        {career.programa_competencia && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>📋 Programa de Competencias</h2>
            <p style={contentStyle}>{career.programa_competencia}</p>
          </div>
        )}

        {/* Justificación */}
        {career.justificacion && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>💡 Justificación</h2>
            <p style={contentStyle}>{career.justificacion}</p>
          </div>
        )}

        {/* Perfil de Egreso */}
        {career.perfil_egreso && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>🎓 Perfil de Egreso</h2>
            <p style={contentStyle}>{career.perfil_egreso}</p>
          </div>
        )}

        {/* Área de Especialización */}
        {career.area_especializacion && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>🔧 Área de Especialización</h2>
            <p style={contentStyle}>{career.area_especializacion}</p>
          </div>
        )}

        {/* Habilidades Socioemocionales */}
        {career.habilidades_socioemocionales && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>🤝 Habilidades Socioemocionales</h2>
            <p style={contentStyle}>{career.habilidades_socioemocionales}</p>
          </div>
        )}

        {/* Oportunidades Profesionales */}
        {career.oportunidades_profesionales && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>💼 Oportunidades Profesionales</h2>
            <p style={contentStyle}>{career.oportunidades_profesionales}</p>
          </div>
        )}

        {/* Plan de Estudios PDF con Previsualización */}
        {career.plan_estudios_url && (
          <div style={{ ...sectionStyle, padding: '30px' }}>
            <h2 style={{ ...sectionTitleStyle, justifyContent: 'center', textAlign: 'center' }}>📄 Plan de Estudios</h2>
            <p style={{ marginBottom: '20px', color: '#555', textAlign: 'center' }}>Vista previa del documento oficial del plan de estudios</p>

            {/* PDF Viewer */}
            <div style={{ marginBottom: '20px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
              <iframe
                src={`${career.plan_estudios_url}#page=${career.pdf_start_page || 1}`}
                style={{
                  width: '100%',
                  height: '600px',
                  border: 'none'
                }}
                title="Plan de Estudios"
              />
            </div>

            {/* Download Button */}
            <div style={{ textAlign: 'center' }}>
              <a
                href={career.plan_estudios_url}
                download
                style={{
                  display: 'inline-block',
                  background: '#28a745',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s ease',
                  boxShadow: '0 4px 10px rgba(40, 167, 69, 0.3)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
              >
                📥 Descargar Plan de Estudios (PDF)
              </a>
              <p style={{ marginTop: '10px', fontSize: '13px', color: '#777' }}>Mostrando desde la página {career.pdf_start_page || 1}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Programas;
