import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import Gallery from "./components/Gallery";
import ValoresInstitucionales from "./components/ValoresInstitucionales";
import AcercaDeCBTa134 from "./components/AcercaDeCBTa134";
import AdmissionProcess from "./components/AdmissionProcess";
// CarrerasYClubes removido - ahora se usa Programas.jsx dinámico
import SAETAMComponent from "./components/SAETAMComponent";
import Maestros from "./components/Maestros";
import Noticias from "./components/Noticias";
import Alumnos from "./components/Alumnos";
import MaestrosAdmin from "./components/MaestrosAdmin";
import PreRegistro from "./pages/PreRegistro";
import PreRegistroLanding from "./pages/PreRegistroLanding";


// Nuevos componentes importados del CBTa-134-PAG-master
import Nosotros from "./pages/Cbta/Nosotros";
import Galeria from "./pages/Cbta/Galeria";
import Clubs from "./pages/Cbta/Clubs";
import Programas from "./pages/Cbta/Programas";
import Contacto from "./pages/Contacto";
import Creditos from "./pages/Creditos";
import ChatbotFull from "./pages/ChatbotFull";
// Carreras individuales removidas - ahora se gestionan dinámicamente desde la BD
import BAETAM from "./components/BAETAM";
import AdmissionCountdown from "./components/AdmissionCountdown";
import './App.css'; // Estilos principales
import './day-mode.css'; // Modo día

const App = () => {
  const [homeOptions, setHomeOptions] = useState([]);
  const initialOptions = [
    {
      image: "/images/valores.png",
      title: "Acerca de CBTa 134",
      description: "Conoce nuestra historia, misión, visión y valores que nos definen como institución.",
      path: 'acerca'
    },
    {
      image: "/images/programacion.jpg",
      title: "Carreras Técnicas",
      description: "Descubre nuestras especialidades técnicas y elige tu futuro profesional.",
      path: 'carreras'
    },
    {
      image: "/images/galeria.png",
      title: "Galería",
      description: "Explora nuestra colección de fotos y eventos destacados.",
      path: 'galeria'
    },
    {
      image: "/images/campus.png",
      title: "Clubs Estudiantiles",
      description: "Únete a nuestros clubs deportivos, culturales y académicos.",
      path: 'clubs'
    },
    {
      image: "/images/ofimatica.jpg",
      title: "Contacto",
      description: "Información de contacto y ubicación de nuestra institución.",
      path: 'contacto'
    },
    {
      image: "/images/baetam.jpg",
      title: "BAETAM",
      description: "Bachillerato Autoplaneado - Educación flexible para adultos.",
      path: 'baetam'
    },
    {
      image: "/images/maestros-hero.png",
      title: "Maestros",
      description: "Recursos y enlaces utiles para el personal docente.",
      path: 'maestros'
    },
    {
      image: "/images/alumnos-hero.png",
      title: "Alumnos",
      description: "Portal de alumnos para acceso a calificaciones y servicios.",
      path: 'alumnos'
    },
    {
      image: "/images/proceso de admincion.jpg",
      title: "Proceso de Admisión y Pre-Registro",
      description: "Información sobre requisitos, fechas y pre-registro para nuevo ingreso.",
      path: 'preregistro'
    }
  ];

  useEffect(() => {
    const fetchHomeOptions = async () => {
      const { data } = await supabase
        .from('home_options')
        .select('*')
        .order('order_index', { ascending: true });

      if (data && data.length > 0) {
        // Filtrar tarjetas ocultas (is_visible === false)
        setHomeOptions(data.filter(opt => opt.is_visible !== false));
      } else {
        setHomeOptions(initialOptions.map((opt, idx) => ({
          id: idx + 1,
          image_url: opt.image,
          title: opt.title,
          description: opt.description,
          path: opt.path
        })));
      }
    };

    fetchHomeOptions();
  }, []);



  const [options, setOptions] = useState(() => {
    const savedOptions = localStorage.getItem("appOptions");
    return savedOptions ? JSON.parse(savedOptions) : initialOptions;
  });

  const [currentView, setCurrentView] = useState('home');
  const [isNavActive, setIsNavActive] = useState(false);
  const [deviceType, setDeviceType] = useState('phone'); // Solo teléfono
  // Función para determinar el modo basado en la hora
  const getAutoMode = () => {
    const currentHour = new Date().getHours();
    // Modo día: 6 AM a 6 PM (6-18), modo noche: 6 PM a 6 AM (18-6)
    return currentHour >= 6 && currentHour < 18;
  };

  const navigate = useNavigate();
  const location = useLocation();

  const [isLightMode, setIsLightMode] = useState(() => {

    const savedManualMode = localStorage.getItem("manualModeOverride");
    if (savedManualMode !== null) {
      return JSON.parse(savedManualMode);
    }
    return getAutoMode();
  });

  const [isAutoMode, setIsAutoMode] = useState(() => {
    const savedAutoMode = localStorage.getItem("isAutoMode");
    return savedAutoMode ? JSON.parse(savedAutoMode) : true;
  });

  useEffect(() => {
    localStorage.setItem("appOptions", JSON.stringify(options));
  }, [options]);

  useEffect(() => {
    // Forzar modo claro: guardamos estados pero siempre aplicamos clase `light-mode`.
    localStorage.setItem("isLightMode", JSON.stringify(true));
    localStorage.setItem("isAutoMode", JSON.stringify(isAutoMode));
    document.body.className = 'light-mode';
  }, [isAutoMode]);

  // Effect para cambio automático de modo cada minuto si está activado
  useEffect(() => {
    if (isAutoMode) {
      const interval = setInterval(() => {
        const autoMode = getAutoMode();
        if (autoMode !== isLightMode) {
          setIsLightMode(autoMode);
        }
      }, 60000); // Verificar cada minuto

      return () => clearInterval(interval);
    }
  }, [isAutoMode, isLightMode]);

  const [preregEnabled, setPreregEnabled] = useState(true);
  const [preregHome, setPreregHome] = useState({
    home_badge: 'NUEVO INGRESO 2025',
    home_titulo: '¡Pre-Regístrate Hoy!',
    home_descripcion: 'Inicia tu proceso de admisión para el próximo ciclo escolar. Obtén tu ficha oficial de manera fácil y rápida.',
    home_boton: 'Ir al Pre-Registro →',
    home_icono: '📝',
  });

  useEffect(() => {
    const fetchPreregStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('preregistro_config')
          .select('habilitado, home_badge, home_titulo, home_descripcion, home_boton, home_icono')
          .eq('id', 1)
          .single();
        if (data) {
          setPreregEnabled(data.habilitado);
          setPreregHome({
            home_badge: data.home_badge || 'NUEVO INGRESO 2025',
            home_titulo: data.home_titulo || '¡Pre-Regístrate Hoy!',
            home_descripcion: data.home_descripcion || 'Inicia tu proceso de admisión para el próximo ciclo escolar. Obtén tu ficha oficial de manera fácil y rápida.',
            home_boton: data.home_boton || 'Ir al Pre-Registro →',
            home_icono: data.home_icono || '📝',
          });
        }
      } catch (err) {
        console.error('Error fetching prereg status:', err);
      }
    };
    fetchPreregStatus();
  }, []);

  const handleLinkClick = (option) => () => {
    // 1. Prioridad: Link Externo (URL completo)
    if (option.external_url) {
      window.open(option.external_url, '_blank');
      return;
    }

    // 2. Prioridad: Post específico (Avisos)
    if (option.post_id) {
      setCurrentView('avisos'); // Redigir a la vista de avisos
      // Opcional: Podríamos guardar el post_id en un estado para resaltar ese post
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/');
      setIsNavActive(false);
      return;
    }

    // 3. Fallback: Rutas internas tradicionales
    const path = option.path;
    if (path === 'alumnos') {
      navigate('/alumnos');
    } else if (path === 'maestros') {
      navigate('/maestros');
    } else {
      setCurrentView(path);
      if (location.pathname !== '/') {
        navigate('/');
      }
    }
    setIsNavActive(false);
  };



  const toggleMode = () => {
    if (isAutoMode) {
      // Si está en modo automático, cambiar a modo manual y alternar
      setIsAutoMode(false);
      setIsLightMode(!isLightMode);
      localStorage.setItem("manualModeOverride", JSON.stringify(!isLightMode));
    } else {
      // Si está en modo manual, solo alternar
      setIsLightMode(!isLightMode);
      localStorage.setItem("manualModeOverride", JSON.stringify(!isLightMode));
    }
  };

  const toggleAutoMode = () => {
    if (!isAutoMode) {
      // Cambiar a modo automático
      setIsAutoMode(true);
      setIsLightMode(getAutoMode());
      localStorage.removeItem("manualModeOverride");
    } else {
      // Cambiar a modo manual
      setIsAutoMode(false);
      localStorage.setItem("manualModeOverride", JSON.stringify(isLightMode));
    }
  };

  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  const renderCurrentView = () => {
    const goBackToHome = () => setCurrentView('home');

    switch (currentView) {
      case 'acerca':
        return <AcercaDeCBTa134 onBack={goBackToHome} />;
      case 'valores':
        return <ValoresInstitucionales onBack={goBackToHome} />;
      case 'noticias':
        return <Noticias onBack={goBackToHome} />;
      case 'carreras':
        return <Programas setCurrentView={setCurrentView} />;
      case 'galeria':
        return <Galeria setCurrentView={setCurrentView} />;
      case 'admission':
      case 'preregistro':
        return <PreRegistroLanding setCurrentView={setCurrentView} />;
      case 'nosotros':
        return <Nosotros setCurrentView={setCurrentView} />;
      case 'clubs':
        return <Clubs setCurrentView={setCurrentView} />;
      case 'contacto':
        return <Contacto setCurrentView={setCurrentView} />;
      case 'saetam':
        return <SAETAMComponent onBack={goBackToHome} />;
      case 'maestros':
        // Removido de aquí porque ahora tiene su propia ruta
        return null;


      // Páginas de carreras removidas - ahora se gestionan dinámicamente desde Programas.jsx
      case 'preregistro':
        return <PreRegistroLanding setCurrentView={setCurrentView} />;
      case 'baetam':
        return <BAETAM onBack={goBackToHome} />;
      default:
        return (
          <>
            <HeroSection />
            <main className="main-content">
              {/* Sección destacada de Pre-Registro */}
              {preregEnabled && (
                <div className="home-featured-card" onClick={() => navigate('/preregistro')}>
                  <div className="featured-card-content">
                    <div className="featured-badge">{preregHome.home_badge}</div>
                    <h2 className="featured-title">{preregHome.home_titulo}</h2>
                    <p className="featured-desc">{preregHome.home_descripcion}</p>
                    <button className="featured-btn">{preregHome.home_boton}</button>
                  </div>
                  <div className="featured-icon">{preregHome.home_icono}</div>
                </div>
              )}

              {/* Tarjetas de navegación inferior para teléfono */}
              <div className="navigation-cards">
                <h2 className="navigation-title">Navega por Nuestras Secciones</h2>
                <div className="options-grid">
                  {homeOptions.map((option) => (
                    <div key={option.id} className="option-card" onClick={handleLinkClick(option)}>
                      <img src={option.image_url} alt={option.title} className="option-image" />
                      <div className="option-content">
                        <h3 className="option-title">{option.title}</h3>
                        <p className="option-description">{option.description}</p>
                        <button className="option-button">{option.button_text || 'Ver más'}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </>
        );
    }
  };

  // Carreras ahora se gestionan dinámicamente desde la base de datos
  // Ver src/pages/Cbta/Programas.jsx para la vista pública de carreras

  const isAppView = location.pathname !== '/alumnos' &&
    location.pathname !== '/maestros' &&
    location.pathname !== '/maestros/admin' &&
    location.pathname !== '/chatbot' &&
    !location.pathname.startsWith('/preregistro');




  return (
    <div className={`app light-mode`}>
      {isAppView && (
        <Header
          toggleMode={toggleMode}
          toggleAutoMode={toggleAutoMode}
          isLightMode={isLightMode}
          isAutoMode={isAutoMode}
          toggleNav={toggleNav}
          isNavActive={isNavActive}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      )}

      <div className={isAppView ? "app-content" : "app-content-fullscreen"}>
        <Routes>
          <Route path="/" element={renderCurrentView()} />
          <Route path="/creditos" element={<Creditos />} />
          <Route path="/alumnos" element={<Alumnos />} />
          <Route path="/maestros" element={<Maestros />} />
          <Route path="/maestros/admin" element={<MaestrosAdmin />} />
          <Route path="/chatbot" element={<ChatbotFull />} />
          <Route path="/preregistro" element={<PreRegistroLanding setCurrentView={setCurrentView} />} />
          <Route path="/preregistro/formulario" element={<PreRegistro setCurrentView={setCurrentView} />} />

          {/* Fallback para otras rutas si es necesario */}
          <Route path="*" element={renderCurrentView()} />
        </Routes>

      </div>

      {isAppView && (
        <>
          <Footer />
          <Chatbot />
        </>
      )}
    </div>
  );

};

export default App;