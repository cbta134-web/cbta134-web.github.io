import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';
import { supabase } from '../lib/supabaseClient';


const useIsDark = () => {
  try {
    return typeof document !== 'undefined' && document.body.classList.contains('dark-mode');
  } catch (e) {
    return false;
  }
};

const Maestros = () => {
  const navigate = useNavigate();
  const onBack = () => navigate('/');

  const defaultRecursos = [
    {
      name: "Cuadernillos",
      description: "Planeación didáctica y recursos educativos",
      icon: "📚",
      url: "http://www.planeaciondidactica.sems.gob.mx/login",
      color: "#007bff"
    },
    {
      name: "SISEEMS",
      description: "Sistema de Evaluación y Seguimiento",
      icon: "📊",
      url: "http://168.255.121.25/develop/index.php?",
      color: "#28a745"
    },
    {
      name: "Talón de Pago",
      description: "Portal de autoservicios SEMS",
      icon: "💰",
      url: "https://portalautoservicios-sems.sep.gob.mx/login.jsp",
      color: "#ffc107"
    },
    {
      name: "DGETAYCM México",
      description: "Dirección General de Educación Tecnológica Agropecuaria y Ciencias del Mar",
      icon: "🏛️",
      url: "https://dgetaycm.sep.gob.mx/",
      color: "#dc3545"
    },
    {
      name: "SEP Tlaxcala",
      description: "Secretaría de Educación Pública Tlaxcala",
      icon: "🏢",
      url: "https://www.septlaxcala.gob.mx",
      color: "#6f42c1"
    },
    {
      name: "Oficina Virtual ISSSTE",
      description: "Instituto de Seguridad y Servicios Sociales",
      icon: "🏥",
      url: "https://oficinavirtual.issste.gob.mx/",
      color: "#20c997"
    }
  ];

  const [teachersConfig, setTeachersConfig] = useState(null);
  const [teacherLinks, setTeacherLinks] = useState([]);

  useEffect(() => {
    const fetchTeachersData = async () => {
      const { data: configData } = await supabase
        .from('teachers_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: linksData } = await supabase
        .from('teachers_links')
        .select('*')
        .order('order_index', { ascending: true });

      setTeachersConfig(configData || null);
      setTeacherLinks((linksData || []).filter((item) => item.is_active !== false));
    };

    fetchTeachersData();
  }, []);

  const recursos = teacherLinks.length > 0 ? teacherLinks : defaultRecursos;

  const isDark = useIsDark();

  const containerStyle = {
    padding: 0,
    minHeight: '100vh',
    backgroundColor: isDark ? '#0f1720' : '#f8f9fa',
    fontFamily: "'Inter', sans-serif"
  };

  const heroStyle = {
    height: '400px',
    backgroundImage: `url("${teachersConfig?.hero_image_url || '/images/maestros-hero.png'}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '40px'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 60, 114, 0.7)',
    zIndex: 1
  };


  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: isDark ? '#e6eef8' : '#1e3c72',
    textAlign: 'center',
    marginBottom: '20px'
  };

  const subtitleStyle = {
    fontSize: '18px',
    color: isDark ? '#bfc7cf' : '#666',
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
    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'white',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: isDark ? '0 12px 40px rgba(2,6,23,0.7)' : '0 8px 25px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit'
  };

  const contentStyle = {
    padding: '25px'
  };

  const recursoTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const descriptionStyle = {
    fontSize: '16px',
    color: isDark ? '#c8cdd3' : '#666',
    lineHeight: '1.6',
    marginBottom: '20px'
  };

  const buttonStyle = {
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    textDecoration: 'none',
    display: 'block',
    textAlign: 'center'
  };

  const handleResourceClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={containerStyle}>
      <div style={heroStyle}>
        <div style={overlayStyle}></div>
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 20px' }}>
          <h1 style={{ ...titleStyle, color: 'white', marginBottom: '10px' }}>
            {teachersConfig?.title || '👨‍🏫 Portal Docente'}
          </h1>
          <p style={{ ...subtitleStyle, color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>
            {teachersConfig?.subtitle || 'Gestiona los recursos educativos y el control de alumnos de la institución.'}
          </p>
          <button
            onClick={() => navigate('/maestros/admin')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#e67e22',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            {teachersConfig?.cta_label || '⚙️ Panel Administrativo (Ingresar)'}
          </button>
        </div>
      </div>


      <div style={{ padding: '0 20px' }}>


        <div style={gridStyle}>
          {recursos.map((recurso, index) => (
            <div
              key={index}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
              }}
              onClick={() => handleResourceClick(recurso.url)}
            >
              <div style={contentStyle}>
                <h3 style={{ ...recursoTitleStyle, color: recurso.color }}>
                  <span style={{ fontSize: '24px' }}>{recurso.icon}</span>
                  {recurso.name}
                </h3>
                <p style={descriptionStyle}>
                  {recurso.description}
                </p>
                <button
                  style={{ ...buttonStyle, backgroundColor: 'var(--primary-color)' }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Acceder al Portal 🔗
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
          borderRadius: '15px',
          padding: '25px',
          marginTop: '40px',
          boxShadow: isDark ? '0 12px 35px rgba(2,6,23,0.7)' : '0 8px 25px rgba(0,0,0,0.1)',
          maxWidth: '800px',
          margin: '40px auto 0 auto'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1e3c72',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            📋 Información Importante
          </h2>
          <div style={{
            background: isDark ? 'rgba(30,60,114,0.12)' : '#e3f2fd',
            padding: '20px',
            borderRadius: '10px',
            borderLeft: '4px solid #1e3c72'
          }}>
            <p style={{
              fontSize: '16px',
              color: '#555',
              lineHeight: '1.6',
              marginBottom: '10px'
            }}>
              <strong>📌 Nota:</strong> Todos los enlaces externos se abrirán en una nueva ventana para tu comodidad.
            </p>
            <p style={{
              fontSize: '16px',
              color: '#555',
              lineHeight: '1.6',
              marginBottom: '10px'
            }}>
              <strong>🔐 Acceso:</strong> Algunos portales requieren credenciales específicas proporcionadas por la institución.
            </p>
            <p style={{
              fontSize: '16px',
              color: '#555',
              lineHeight: '1.6',
              marginBottom: '0'
            }}>
              <strong>📞 Soporte:</strong> Para problemas técnicos, contacta al departamento de TI del CBTa 134.
            </p>
          </div>
        </div>

        <BackButton onBack={onBack} text="Regresar al Menú Principal" />
      </div>
    </div>
  );
};

export default Maestros;
