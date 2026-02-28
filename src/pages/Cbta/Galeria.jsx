import React, { useEffect, useMemo, useState } from 'react';
import BackButton from '../../components/BackButton';
import { supabase } from '../../lib/supabaseClient';

const useIsDark = () => {
  if (typeof document === 'undefined') return false;
  return document.body.classList.contains('dark-mode');
};

const Galeria = ({ setCurrentView }) => {
  const isDark = useIsDark();
  const [galleryItems, setGalleryItems] = useState([]);

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
    color: '#2c3e50',
    marginBottom: '25px',
    textAlign: 'center'
  };

  const galleryStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const imageCardStyle = {
    background: isDark ? 'rgba(255,255,255,0.02)' : 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.6)' : '0 4px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease'
  };

  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  };

  const cardContentStyle = {
    padding: '15px'
  };

  const cardTitleStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '8px'
  };

  const cardDescStyle = {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.4'
  };

  const sectionTitleStyle = {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '20px',
    marginTop: '40px',
    textAlign: 'center',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px'
  };

  const ImageCard = ({ src, title, desc }) => (
    <div
      style={imageCardStyle}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <img src={src} alt={title} style={imageStyle} />
      <div style={cardContentStyle}>
        <h3 style={cardTitleStyle}>{title}</h3>
        <p style={cardDescStyle}>{desc}</p>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase
        .from('gallery_items')
        .select('*')
        .order('order_index', { ascending: true });

      setGalleryItems(data || []);
    };

    fetchGallery();
  }, []);

  const sections = useMemo(() => {
    const groups = galleryItems.reduce((acc, item) => {
      const section = item.section || 'galeria';
      if (!acc[section]) acc[section] = [];
      acc[section].push(item);
      return acc;
    }, {});

    // Nombres amigables para las secciones predefinidas
    const sectionNames = {
      instalaciones: '🏫 Nuestras Instalaciones',
      actividades: '🏃‍♂️ Actividades Deportivas',
      clubs: '🎭 Participaciones de nuestros Clubes',
      cbta: '🏫 CBTa 134',
      galeria: '📸 Galería General'
    };

    return Object.entries(groups).map(([id, items]) => ({
      id,
      name: sectionNames[id] || id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, ' '),
      items
    }));
  }, [galleryItems]);

  return (
    <div style={pageStyle}>
      <BackButton onClick={() => setCurrentView('home')} />
      <div style={containerStyle}>
        <h1 style={titleStyle}>📸 Galería CBTA 134</h1>

        {sections.map((section) => (
          <section key={section.id}>
            <h2 style={sectionTitleStyle}>{section.name}</h2>
            <div style={galleryStyle}>
              {section.items.map((item, index) => (
                <ImageCard
                  key={item.id || index}
                  src={item.image_url || item.src}
                  title={item.title}
                  desc={item.desc || item.description}
                />
              ))}
            </div>
          </section>
        ))}

        <section style={{ textAlign: 'center', marginTop: '50px', padding: '30px', background: isDark ? 'rgba(255,255,255,0.02)' : 'white', borderRadius: '10px', boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.6)' : '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>¿Quieres ver más?</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Síguenos en nuestras redes sociales para ver más fotos y videos de la vida estudiantil en el CBTA 134
          </p>
          <a
            href="https://www.facebook.com/share/15g75ZdJRg/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#1877f2',
              color: 'white',
              padding: '12px 25px',
              textDecoration: 'none',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            📘 Visitar Facebook
          </a>
        </section>
      </div>
    </div>
  );
};

export default Galeria;