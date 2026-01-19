import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Header = ({ 
  toggleMode, 
  toggleAutoMode,
  isLightMode, 
  isAutoMode,
  toggleNav, 
  isNavActive, 
  currentView, 
  setCurrentView, 
  carrerasOptions 
}) => {
  const [showCarrerasMenu, setShowCarrerasMenu] = useState(false);
  const [headerConfig, setHeaderConfig] = useState(null);
  const [headerLinks, setHeaderLinks] = useState([]);

  const handleNavClick = (path) => (e) => {
    e.preventDefault();
    setCurrentView(path);
    toggleNav();
  };

  const toggleCarrerasMenu = () => {
    setShowCarrerasMenu(!showCarrerasMenu);
  };

  useEffect(() => {
    const fetchHeader = async () => {
      const { data: configData } = await supabase
        .from('ui_header_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: linksData } = await supabase
        .from('ui_header_links')
        .select('*')
        .order('order_index', { ascending: true });

      setHeaderConfig(configData || null);
      setHeaderLinks(linksData || []);
    };

    fetchHeader();
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-title">
          <img 
            src={headerConfig?.logo_url || "/images/cbta134.png"} 
            alt="Logo CBTA 134" 
            className="logo"
            onClick={() => setCurrentView('home')}
            style={{ cursor: 'pointer' }}
          />
          <h1 
            className="site-title"
            onClick={() => setCurrentView('home')}
            style={{ cursor: 'pointer' }}
          >
            {headerConfig?.title_text || 'Centro de Bachillerato Tecnológico Agropecuario 134'}
          </h1>
        </div>

        <nav className={`main-nav ${isNavActive ? 'active' : ''}`}>
          {headerLinks.length > 0 && (
            <ul>
              {headerLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={handleNavClick(link.path)}
                    className="nav-link"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;