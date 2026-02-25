import React, { useEffect, useState } from 'react';
import BackButton from './BackButton';
import { supabase } from '../lib/supabaseClient';

const AcercaDeCBTa134 = ({ onBack }) => {
  const [aboutConfig, setAboutConfig] = useState(null);
  const [aboutValues, setAboutValues] = useState([]);

  useEffect(() => {
    const fetchAboutData = async () => {
      const { data: configData } = await supabase
        .from('about_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: valuesData } = await supabase
        .from('about_values')
        .select('*')
        .order('order_index', { ascending: true });

      setAboutConfig(configData || null);
      setAboutValues(valuesData || []);
    };

    fetchAboutData();
  }, []);
  const containerStyle = {
    minHeight: '100vh',
    paddingTop: '80px',
    padding: '80px 20px 40px',
    backgroundColor: '#ffffff' // Fondo blanco
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '1000px',
    width: '100%',
    margin: '0 auto',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '40px',
    color: '#28a745'
  };

  const sectionStyle = {
    marginBottom: '40px',
    padding: '20px',
    borderRadius: '15px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #28a745'
  };

  const sectionTitleStyle = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: '20px',
    textAlign: 'center'
  };

  const subsectionStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
  };

  const subsectionTitleStyle = {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const textStyle = {
    fontSize: '1rem',
    color: '#555',
    lineHeight: '1.8',
    textAlign: 'justify',
    marginBottom: '0'
  };

  const valoresGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  };

  const valorStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease'
  };

  const logoStyle = {
    textAlign: 'center',
    marginBottom: '30px'
  };

  const croquisStyle = {
    textAlign: 'center',
    marginBottom: '30px'
  };

  const croquisImgStyle = {
    width: '100%',
    maxWidth: '900px',
    borderRadius: '15px',
    border: '2px solid #28a745',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)'
  };

  const logoImgStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '4px solid #28a745',
    marginBottom: '15px'
  };

  return (
    <div style={containerStyle}>
      <BackButton onBack={onBack} />
      <div style={cardStyle}>
        {aboutConfig?.croquis_image_url && (
          <div style={croquisStyle}>
            <img src={aboutConfig.croquis_image_url} alt="Croquis CBTa 134" style={croquisImgStyle} />
          </div>
        )}
        <div style={logoStyle}>
          <img src={aboutConfig?.logo_url || "/images/cbta134.png"} alt="Logo CBTa 134" style={logoImgStyle} />
          <h1 style={titleStyle}>{aboutConfig?.title || 'Acerca de CBTa 134'}</h1>
        </div>

        {/* Historia e Identidad Institucional */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🏛️ Historia e Identidad Institucional</h2>
          
          <div style={subsectionStyle}>
            <h3 style={subsectionTitleStyle}>📖 Nuestra Historia</h3>
            <p style={textStyle}>
              {aboutConfig?.history_text || 'El Centro de Bachillerato Tecnológico Agropecuario No. 134 es una institución educativa que ha forjado su prestigio a través de décadas de excelencia académica. Fundado con el propósito de brindar educación técnica de calidad en el área agropecuaria, hemos evolucionado para convertirnos en un referente educativo que forma profesionales competentes y ciudadanos comprometidos con el desarrollo de nuestra comunidad.'}
            </p>
          </div>

          <div style={subsectionStyle}>
            <h3 style={subsectionTitleStyle}>🎯 Misión</h3>
            <p style={textStyle}>
              {aboutConfig?.mission_text || 'Contribuir activamente a la formación integral de nuestros estudiantes del Bachillerato Tecnológico, con un enfoque de desarrollo sostenible y emprendedor que los integre plenamente a la sociedad, proporcionando herramientas académicas y técnicas que les permitan enfrentar los retos del mundo moderno con competencia y valores sólidos.'}
            </p>
          </div>

          <div style={subsectionStyle}>
            <h3 style={subsectionTitleStyle}>🔭 Visión</h3>
            <p style={textStyle}>
              {aboutConfig?.vision_text || 'Ser una institución de calidad, formadora de líderes del mañana, reconocida por su excelencia educativa, innovación tecnológica y compromiso con el desarrollo sustentable, que contribuya al progreso social y económico de la región.'}
            </p>
          </div>

          <div style={subsectionStyle}>
            <h3 style={subsectionTitleStyle}>💫 Lema Institucional</h3>
            <p style={{...textStyle, fontSize: '1.2rem', fontWeight: 'bold', color: '#28a745', textAlign: 'center'}}>
              {aboutConfig?.lema_text || '"Formar e innovar para transformar"'}
            </p>
          </div>
        </div>

        {/* Valores Institucionales */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>⭐ Nuestros Valores</h2>
          
          <div style={valoresGridStyle}>
            {aboutValues.map((value) => (
              <div key={value.id} style={valorStyle}>
                <h3 style={{...subsectionTitleStyle, justifyContent: 'center'}}>{value.icon} {value.title}</h3>
                <p style={{...textStyle, textAlign: 'center', fontSize: '0.95rem'}}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Compromiso Social */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🌱 Nuestro Compromiso</h2>
          <div style={subsectionStyle}>
            <p style={textStyle}>
              {aboutConfig?.commitment_text_1 || 'El CBTa 134 se compromete a formar ciudadanos integrales que contribuyan al desarrollo sustentable de su comunidad. Nuestro enfoque educativo combina la excelencia académica con la formación en valores, preparando a nuestros estudiantes para ser agentes de cambio positivo en la sociedad.'}
            </p>
            <p style={textStyle}>
              {aboutConfig?.commitment_text_2 || 'A través de nuestros programas técnicos especializados, fomentamos el emprendimiento, la innovación tecnológica y el cuidado del medio ambiente, formando profesionales competentes que respondan a las necesidades del mercado laboral actual.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcercaDeCBTa134;
