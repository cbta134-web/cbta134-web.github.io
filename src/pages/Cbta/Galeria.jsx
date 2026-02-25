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

  // Datos de la galería (fallback si la BD está vacía)
  const instalaciones = [
    {
      src: '/assets/instalaciones/uno.jpg',
      title: 'Instalación Principal',
      desc: 'Vista general de nuestras instalaciones educativas'
    },
    {
      src: '/assets/instalaciones/laboratorio.jpg',
      title: 'Laboratorio',
      desc: 'Modernos laboratorios para el desarrollo académico'
    },
    {
      src: '/assets/instalaciones/cafeteria.jpg',
      title: 'Cafetería',
      desc: 'Espacio de alimentación y convivencia estudiantil'
    },
    {
      src: '/assets/instalaciones/almacen.jpg',
      title: 'Almacén',
      desc: 'Área de almacenamiento y recursos institucionales'
    },
    {
      src: '/assets/instalaciones/bosque.jpg',
      title: 'Área Verde',
      desc: 'Espacios naturales dentro del campus'
    },
    {
      src: '/assets/instalaciones/invern.jpg',
      title: 'Invernadero',
      desc: 'Instalaciones para prácticas agropecuarias'
    },
    {
      src: '/assets/instalaciones/radio.jpg',
      title: 'Estación de Radio',
      desc: 'Estudio de radio estudiantil'
    },
    {
      src: '/assets/instalaciones/tres.jpg',
      title: 'Edificio Académico',
      desc: 'Aulas y espacios de enseñanza'
    },
    {
      src: '/assets/instalaciones/cuatro.jpg',
      title: 'Área Deportiva',
      desc: 'Instalaciones para actividades físicas'
    },
    {
      src: '/assets/instalaciones/cinco.jpg',
      title: 'Zona de Talleres',
      desc: 'Espacios para prácticas técnicas'
    },
    {
      src: '/assets/instalaciones/seis.jpg',
      title: 'Biblioteca',
      desc: 'Centro de recursos bibliográficos'
    },
    {
      src: '/assets/instalaciones/siete.jpg',
      title: 'Auditorio',
      desc: 'Espacio para eventos y ceremonias'
    }
  ];

  const actividades = [
    {
      src: '/img/basquet.jpg',
      title: 'Torneo de Básquetbol',
      desc: 'Competencias deportivas entre equipos estudiantiles'
    },
    {
      src: '/img/futbol.jpg',
      title: 'Liga de Fútbol',
      desc: 'Actividades deportivas que fomentan el trabajo en equipo'
    },
    {
      src: '/img/boleibol.jpg',
      title: 'Voleibol Escolar',
      desc: 'Deportes que promueven la disciplina y el compañerismo'
    },
    {
      src: '/img/banda de guerra.jpg',
      title: 'Banda de Guerra',
      desc: 'Grupo musical que representa a nuestra institución'
    },
    {
      src: '/img/baile folclorico.jpg',
      title: 'Ballet Folklórico',
      desc: 'Preservación de nuestras tradiciones culturales'
    }
  ];

  const clubs = [
    {
      src: '/assets/clubs/banda.jpeg',
      title: 'Banda de Guerra',
      desc: 'Grupo musical que representa a la institución'
    },
    {
      src: '/assets/clubs/basquet.jpg',
      title: 'Club de Básquetbol',
      desc: 'Desarrollo de habilidades deportivas y trabajo en equipo'
    },
    {
      src: '/assets/clubs/voli.jpg',
      title: 'Club de Voleibol',
      desc: 'Deporte que fomenta la comunicación y el compañerismo'
    },
    {
      src: '/assets/clubs/robotica.jpg',
      title: 'Club de Robótica',
      desc: 'Tecnología, programación e innovación estudiantil'
    },
    {
      src: '/assets/clubs/robot.jpg',
      title: 'Taller de Robótica',
      desc: 'Construcción y programación de robots'
    },
    {
      src: '/assets/clubs/rondalla.jpg',
      title: 'Rondalla y Canto',
      desc: 'Expresión musical y vocal tradicional'
    }
  ];

  const cbta = [
    {
      src: '/assets/cbta/logo.jpg',
      title: 'Logo Institucional',
      desc: 'Símbolo que nos representa como institución educativa'
    },
    {
      src: '/assets/cbta/cbta.png',
      title: 'CBTa 134',
      desc: 'Centro de Bachillerato Tecnológico Agropecuario No. 134'
    },
    {
      src: '/assets/cbta/cbb.jpg',
      title: 'Campus Educativo',
      desc: 'Nuestras instalaciones educativas de calidad'
    },
    {
      src: '/assets/cbta/cbtaj.jpg',
      title: 'Actividades Institucionales',
      desc: 'Eventos y ceremonias de nuestra comunidad educativa'
    },
    {
      src: '/assets/cbta/SAE.jpg',
      title: 'Sistema de Apoyo Educativo',
      desc: 'Programas de apoyo para el desarrollo estudiantil'
    },
    {
      src: '/assets/cbta/cct.png',
      title: 'Clave del Centro de Trabajo',
      desc: 'Identificación oficial de nuestra institución'
    },
    {
      src: '/assets/cbta/guardian.jpg',
      title: 'Seguridad Escolar',
      desc: 'Medidas de protección y seguridad en el campus'
    }
  ];

  const galeria = [
    {
      src: '/assets/galeria/1.jpg',
      title: 'Momentos Especiales',
      desc: 'Recuerdos de la vida estudiantil'
    },
    {
      src: '/assets/galeria/2.jpg',
      title: 'Actividades Estudiantiles',
      desc: 'Participación activa de nuestros alumnos'
    },
    {
      src: '/assets/galeria/3.jpg',
      title: 'Eventos Académicos',
      desc: 'Celebraciones del logro educativo'
    },
    {
      src: '/assets/galeria/4.jpg',
      title: 'Convivencia Escolar',
      desc: 'Momentos de unión y compañerismo'
    },
    {
      src: '/assets/galeria/5.jpg',
      title: '',
      desc: ''
    },
    {
      src: '/assets/galeria/6.jpg',
      title: 'Comunidad Educativa',
      desc: 'Unidos por la educación de calidad'
    }
  ];

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

  const grouped = useMemo(() => {
    if (galleryItems.length === 0) {
      return {
        instalaciones,
        actividades,
        clubs,
        cbta,
        galeria
      };
    }

    return {
      instalaciones: galleryItems.filter((i) => i.section === 'instalaciones'),
      actividades: galleryItems.filter((i) => i.section === 'actividades'),
      clubs: galleryItems.filter((i) => i.section === 'clubs'),
      cbta: galleryItems.filter((i) => i.section === 'cbta'),
      galeria: galleryItems.filter((i) => i.section === 'galeria')
    };
  }, [galleryItems]);

  return (
    <div style={pageStyle}>
      <BackButton onClick={() => setCurrentView('home')} />
      <div style={containerStyle}>
        <h1 style={titleStyle}>📸 Galería CBTA 134</h1>
        
        <section>
          <h2 style={sectionTitleStyle}>🏫 Nuestras Instalaciones</h2>
          <div style={galleryStyle}>
            {grouped.instalaciones.map((item, index) => (
              <ImageCard key={item.id || index} src={item.image_url || item.src} title={item.title} desc={item.desc || item.description} />
            ))}
          </div>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>🏃‍♂️ Actividades Deportivas</h2>
          <div style={galleryStyle}>
            {grouped.actividades.map((item, index) => (
              <ImageCard key={item.id || index} src={item.image_url || item.src} title={item.title} desc={item.desc || item.description} />
            ))}
          </div>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>🎭Participaciones de nuestros Clubes</h2>
          <div style={galleryStyle}>
            {grouped.clubs.map((item, index) => (
              <ImageCard key={item.id || index} src={item.image_url || item.src} title={item.title} desc={item.desc || item.description} />
            ))}
          </div>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>️ CBTa 134</h2>
          <div style={galleryStyle}>
            {grouped.cbta.map((item, index) => (
              <ImageCard key={item.id || index} src={item.image_url || item.src} title={item.title} desc={item.desc || item.description} />
            ))}
          </div>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>📸 Galería General</h2>
          <div style={galleryStyle}>
            {grouped.galeria.map((item, index) => (
              <ImageCard key={item.id || index} src={item.image_url || item.src} title={item.title} desc={item.desc || item.description} />
            ))}
          </div>
        </section>

        <section style={{textAlign: 'center', marginTop: '50px', padding: '30px', background: isDark ? 'rgba(255,255,255,0.02)' : 'white', borderRadius: '10px', boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.6)' : '0 4px 15px rgba(0,0,0,0.1)'}}>
          <h3 style={{color: '#2c3e50', marginBottom: '15px'}}>¿Quieres ver más?</h3>
          <p style={{color: '#666', marginBottom: '20px'}}>
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