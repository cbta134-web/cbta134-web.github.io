// components/MidSection.jsx
import React, { useState } from "react";

const MidSection = ({ handleLinkClick }) => {
  const [isNavActive, setIsNavActive] = useState(false);

  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  return (
    <div className="mid-section">
      <div className="header-container">
        <div className="logo-title">
          <img 
            src="/images/cbta134.png" 
            alt="Logo CBTA 134" 
            className="logo"
          />
          <h1 className="site-title">
            Centro de Bachillerato Tecnológico Agropecuario 134
          </h1>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={toggleNav}
        >
          <span className="sr-only">Abrir menú</span>
          ☰
        </button>

        <nav className={`main-nav ${isNavActive ? 'active' : ''}`}>
          <ul>
            <li>
              <a 
                href="/valores" 
                onClick={handleLinkClick('valores')}
                className="nav-link"
              >
                Valores
              </a>
            </li>
            <li>
              <a 
                href="/carreras" 
                onClick={handleLinkClick('carreras')}
                className="nav-link"
              >
                Carreras
              </a>
            </li>
            <li>
              <a 
                href="/galeria" 
                onClick={handleLinkClick('galeria')}
                className="nav-link"
              >
                Galería
              </a>
            </li>
            <li>
              <a 
                href="/admission" 
                onClick={handleLinkClick('admission')}
                className="nav-link"
              >
                Admisión
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MidSection;