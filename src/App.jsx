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
      image: "/images/proceso de admincion.jpg",
      title: "Proceso de Admisión",
      description: "Información sobre requisitos y pasos para formar parte de nuestra institución.",
      path: 'admission'
    },
    // Nuevas opciones agregadas
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
    }
  ];

  useEffect(() => {
    const fetchHomeOptions = async () => {
      const { data } = await supabase
        .from('home_options')
        .select('*')
        .order('order_index', { ascending: true });

      if (data && data.length > 0) {
        setHomeOptions(data);
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

  const handleLinkClick = (path) => () => {
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
        return <AdmissionProcess onBack={goBackToHome} />;
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
      case 'baetam':
        return <BAETAM onBack={goBackToHome} />;
      default:
        return (
          <>
            <HeroSection />
            <main className="main-content">
              {/* Carrusel de imágenes principales para la página de inicio */}

              {/* Tarjetas de navegación inferior para teléfono */}
              <div className="navigation-cards">
                <h2 className="navigation-title">Navega por Nuestras Secciones</h2>
                <div className="options-grid">
                  {homeOptions.map((option) => (
                    <div key={option.id} className="option-card" onClick={handleLinkClick(option.path)}>
                      <img src={option.image_url} alt={option.title} className="option-image" />
                      <div className="option-content">
                        <h3 className="option-title">{option.title}</h3>
                        <p className="option-description">{option.description}</p>
                        <button className="option-button">Ver más</button>
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
    location.pathname !== '/chatbot';




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