import React, { useEffect, useState } from 'react';
import BackButton from '../../components/BackButton';
import { supabase } from '../../lib/supabaseClient';

const useIsDark = () => {
  if (typeof document === 'undefined') return false;
  return document.body.classList.contains('dark-mode');
};

const Clubs = ({ setCurrentView }) => {
  const isDark = useIsDark();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClubs(data || []);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    paddingTop: '80px',
    minHeight: '100vh',
    backgroundColor: isDark ? 'transparent' : '#f8f9fa'
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: isDark ? '#e6eef8' : '#2c3e50',
    marginBottom: '25px',
    textAlign: 'center'
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: isDark ? '#bfc7cf' : '#666',
    textAlign: 'center',
    marginBottom: '40px',
    lineHeight: '1.6',
    maxWidth: '800px',
    margin: '0 auto 40px auto'
  };

  const clubsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px',
    marginBottom: '40px'
  };

  const clubContentStyle = {
    padding: '20px'
  };

  const clubTitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: isDark ? '#e6eef8' : '#2c3e50',
    marginBottom: '10px'
  };

  const clubDescStyle = {
    fontSize: '14px',
    color: isDark ? '#c8cdd3' : '#666',
    lineHeight: '1.5',
    marginBottom: '15px'
  };

  const clubBenefitsStyle = {
    fontSize: '13px',
    color: '#28a745',
    fontWeight: 'bold'
  };

  const sectionTitleStyle = {
    fontSize: '22px',
    fontWeight: 'bold',
    color: isDark ? '#e6eef8' : '#2c3e50',
    marginBottom: '20px',
    marginTop: '50px',
    textAlign: 'center',
    borderBottom: '3px solid #3498db',
    paddingBottom: '10px'
  };

  const ClubCard = ({ club }) => {
    const cardStyle = {
      background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: isDark ? '0 12px 36px rgba(0,0,0,0.6)' : '0 8px 25px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      border: isDark ? '1px solid rgba(255,255,255,0.03)' : 'none',
      position: 'relative',
      cursor: club.link ? 'pointer' : 'default',
      display: 'flex',
      flexDirection: 'column',
      height: '100%' // Asegura altura igual en grid
    };

    const handleCardClick = () => {
      if (club.link) {
        window.open(club.link, '_blank');
      }
    };

    return (
      <div
        style={cardStyle}
        onClick={handleCardClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = isDark ? '0 15px 35px rgba(0,0,0,0.8)' : '0 15px 35px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = isDark ? '0 12px 36px rgba(0,0,0,0.6)' : '0 8px 25px rgba(0,0,0,0.1)';
        }}
      >
        {club.foto_url ? (
          <div style={{
            width: '100%',
            height: '180px',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <img
              src={club.foto_url}
              alt={club.nombre}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        ) : (
          <div style={{
            width: '100%',
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '56px',
            background: club.color || 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
            color: 'white',
            flexShrink: 0
          }}>
            <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
              {club.icono || '🏆'}
            </span>
          </div>
        )}

        <div style={clubContentStyle}>
          <h3 style={clubTitleStyle}>
            {club.nombre}
            {club.link && <span style={{ fontSize: '12px', marginLeft: '5px' }}>🔗</span>}
          </h3>
          <p style={clubDescStyle}>{club.descripcion}</p>
          <div style={{ marginTop: 'auto' }}>
            <p style={clubBenefitsStyle}>{club.beneficios}</p>
          </div>
        </div>
      </div>
    );
  };

  // Group clubs by category
  const deportivos = clubs.filter(c => c.categoria === 'Deportivo');
  const culturales = clubs.filter(c => c.categoria === 'Cultural');
  const academicos = clubs.filter(c => c.categoria === 'Academico');

  return (
    <div style={pageStyle}>
      <BackButton onBack={() => setCurrentView('home')} />
      <div style={containerStyle}>
        <h1 style={titleStyle}>🏆 Clubes y Actividades Extracurriculares</h1>

        <p style={subtitleStyle}>
          En el CBTA 134 creemos en la formación integral de nuestros estudiantes. Por eso ofrecemos una amplia variedad de clubes y actividades que complementan tu educación académica, desarrollando habilidades sociales, físicas y culturales.
        </p>

        {loading ? (
          <p style={{ textAlign: 'center', color: isDark ? 'white' : 'black' }}>Cargando clubes...</p>
        ) : (
          <>
            {deportivos.length > 0 && (
              <section>
                <h2 style={sectionTitleStyle}>🏃‍♂️ Clubes Deportivos</h2>
                <div style={clubsGridStyle}>
                  {deportivos.map(club => <ClubCard key={club.id} club={club} />)}
                </div>
              </section>
            )}

            {culturales.length > 0 && (
              <section>
                <h2 style={sectionTitleStyle}>🎭 Clubes Culturales</h2>
                <div style={clubsGridStyle}>
                  {culturales.map(club => <ClubCard key={club.id} club={club} />)}
                </div>
              </section>
            )}

            {academicos.length > 0 && (
              <section>
                <h2 style={sectionTitleStyle}>📚 Clubes Académicos</h2>
                <div style={clubsGridStyle}>
                  {academicos.map(club => <ClubCard key={club.id} club={club} />)}
                </div>
              </section>
            )}

            {clubs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <p>No hay clubes registrados por el momento.</p>
              </div>
            )}
          </>
        )}

        <section style={{
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          borderRadius: '20px',
          padding: '40px 20px',
          textAlign: 'center',
          color: 'white',
          marginTop: '50px'
        }}>
          <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>🌟 ¿Por qué unirte a un club?</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '30px'
          }}>
            <div>
              <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>🤝 Socialización</h4>
              <p style={{ fontSize: '14px', opacity: '0.9' }}>Conoce nuevos amigos con intereses similares</p>
            </div>
            <div>
              <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>🎯 Habilidades</h4>
              <p style={{ fontSize: '14px', opacity: '0.9' }}>Desarrolla talentos y competencias especiales</p>
            </div>
            <div>
              <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>🏆 Logros</h4>
              <p style={{ fontSize: '14px', opacity: '0.9' }}>Participa en competencias y eventos</p>
            </div>
            <div>
              <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>📈 Crecimiento</h4>
              <p style={{ fontSize: '14px', opacity: '0.9' }}>Fortalece tu desarrollo personal</p>
            </div>
          </div>
        </section>

        <section style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
          borderRadius: '15px',
          padding: '30px',
          marginTop: '30px',
          boxShadow: isDark ? '0 12px 35px rgba(0,0,0,0.6)' : '0 8px 25px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: isDark ? '#e6eef8' : '#2c3e50', marginBottom: '15px' }}>📝 ¿Cómo inscribirse?</h3>
          <p style={{ color: isDark ? '#c8cdd3' : '#666', marginBottom: '20px', lineHeight: '1.6' }}>
            Las inscripciones a clubes se realizan al inicio de cada semestre. Acércate con el coordinador de actividades extracurriculares o pregunta a tu maestro tutor para más información sobre horarios y requisitos.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Clubs;