import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Navbar = ({ setCurrentView, setMenuOpen: setParentMenuOpen }) => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const handleNavClick = (view) => {
    if (view === 'alumnos') {
      navigate('/alumnos');
    } else if (view === 'maestros') {
      navigate('/maestros');
    } else {
      setCurrentView(view);
      navigate('/');
    }
    setMenuOpen(false);
    if (setParentMenuOpen) {
      setParentMenuOpen(false);
    }
  };


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen === true) setSubmenuOpen(false);
  };

  const toggleSubmenu = (e) => {
    e.stopPropagation();
    setSubmenuOpen(!submenuOpen);
  };

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(135deg, #1e3c72, #2a5298, #3b73c2)',
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '10px 0'
  };

  const isDark = (typeof document !== 'undefined') && document.body.classList.contains('dark-mode');

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    maxWidth: '100%'
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const logoImgStyle = {
    height: '40px',
    width: 'auto'
  };

  const titleStyle = {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0
  };

  const hamburgerStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '5px'
  };

  const menuStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: isDark ? 'rgba(8,12,18,0.85)' : 'white',
    color: isDark ? '#e6f0ff' : '#333',
    boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.6)' : '0 2px 10px rgba(0,0,0,0.1)',
    transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
    opacity: menuOpen ? 1 : 0,
    visibility: menuOpen ? 'visible' : 'hidden',
    transition: 'all 0.3s ease',
    maxHeight: '80vh',
    overflowY: 'auto'
  };

  const ulStyle = {
    listStyle: 'none',
    margin: 0,
    padding: 0
  };

  const liStyle = {
    borderBottom: isDark ? '1px solid rgba(255,255,255,0.03)' : '1px solid #eee'
  };

  const linkStyle = {
    display: 'block',
    padding: '15px 20px',
    color: isDark ? '#e6f0ff' : '#333',
    textDecoration: 'none',
    fontSize: '16px',
    transition: 'background-color 0.3s'
  };

  const submenuStyle = {
    background: '#f8f9fa'
  };

  const submenuToggleStyle = {
    width: '100%',
    padding: '15px 20px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#ffffff',
    fontWeight: 'bold'
  };

  const submenuItemsStyle = {
    background: '#ffffff',
    paddingLeft: '0px',
    borderLeft: '4px solid #1e3c72',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    borderRadius: '0 0 8px 8px',
    overflow: 'hidden',
    marginTop: '2px'
  };

  const submenuItemStyle = {
    ...linkStyle,
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    color: '#333',
    paddingLeft: '30px',
    fontSize: '15px',
    fontWeight: '500',
    padding: '12px 30px',
    transition: 'all 0.3s ease'
  };

  return (
    <header style={navStyle}>
      <div style={logoContainerStyle}>
        <div style={logoStyle}>
          <img src="/images/cbta134.png" alt="Logo CBTA" style={logoImgStyle} />
          <h1 style={titleStyle}>CBTA 134</h1>
        </div>

        <button style={hamburgerStyle} onClick={toggleMenu}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      <nav style={menuStyle}>
        <ul style={ulStyle}>
          <li style={liStyle}>
            <button
              style={{ ...linkStyle, background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#333' }}
              onClick={() => handleNavClick('home')}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Inicio
            </button>
          </li>
          <li style={liStyle}>
            <button
              style={{ ...linkStyle, background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#333' }}
              onClick={() => handleNavClick('acerca')}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              🏛️ Acerca de CBTa 134
            </button>
          </li>
          <li style={liStyle}>
            <button
              style={{ ...linkStyle, background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#333' }}
              onClick={() => handleNavClick('noticias')}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              📰 Noticias
            </button>
          </li>
          <li style={{ ...liStyle, ...submenuStyle }}>
            <button
              style={{ ...submenuToggleStyle, color: '#ffffff', fontSize: '16px', fontWeight: 'bold' }}
              onClick={toggleSubmenu}
            >
              Carreras ▾
            </button>
            {submenuOpen && (
              <ul style={{ ...ulStyle, ...submenuItemsStyle }}>
                <li style={{ ...liStyle, borderBottom: '1px solid #f0f0f0' }}>
                  <button
                    style={submenuItemStyle}
                    onClick={() => handleNavClick('agropecuario')}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e8f4f8';
                      e.target.style.color = '#1e3c72';
                      e.target.style.paddingLeft = '35px';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#333';
                      e.target.style.paddingLeft = '30px';
                    }}
                  >
                    🌾 Agropecuario
                  </button>
                </li>
                <li style={{ ...liStyle, borderBottom: '1px solid #f0f0f0' }}>
                  <button
                    style={submenuItemStyle}
                    onClick={() => handleNavClick('spp')}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e8f4f8';
                      e.target.style.color = '#1e3c72';
                      e.target.style.paddingLeft = '35px';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#333';
                      e.target.style.paddingLeft = '30px';
                    }}
                  >
                    ⚙️ SPP
                  </button>
                </li>
                <li style={{ ...liStyle, borderBottom: '1px solid #f0f0f0' }}>
                  <button
                    style={submenuItemStyle}
                    onClick={() => handleNavClick('ofimatica')}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e8f4f8';
                      e.target.style.color = '#1e3c72';
                      e.target.style.paddingLeft = '35px';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#333';
                      e.target.style.paddingLeft = '30px';
                    }}
                  >
                    💻 Ofimática
                  </button>
                </li>
                <li style={{ ...liStyle, borderBottom: '1px solid #f0f0f0' }}>
                  <button
                    style={submenuItemStyle}
                    onClick={() => handleNavClick('programacion')}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e8f4f8';
                      e.target.style.color = '#1e3c72';
                      e.target.style.paddingLeft = '35px';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#333';
                      e.target.style.paddingLeft = '30px';
                    }}
                  >
                    💻 Programación
                  </button>
                </li>
                <li style={{ ...liStyle, borderBottom: 'none' }}>
                  <button
                    style={submenuItemStyle}
                    onClick={() => handleNavClick('contabilidad')}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e8f4f8';
                      e.target.style.color = '#1e3c72';
                      e.target.style.paddingLeft = '35px';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#333';
                      e.target.style.paddingLeft = '30px';
                    }}
                  >
                    📊 Contabilidad
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li style={liStyle}>
            <button
              style={{ ...linkStyle, background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#333' }}
              onClick={() => handleNavClick('clubs')}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Clubs
            </button>
          </li>
          <li style={liStyle}>
            <button
              style={{ ...linkStyle, background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#333' }}
              onClick={() => handleNavClick('galeria')}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Galería
            </button>
          </li>
          <li style={liStyle}>
            <button
              style={{ ...linkStyle, background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#333' }}
              onClick={() => handleNavClick('saetam')}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              SAETAM
            </button>
          </li>
          <li style={liStyle}>
            <button
              style={{ ...linkStyle, background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#333' }}
              onClick={() => handleNavClick('admission')}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Admisión
            </button>
          </li>

          <li style={liStyle}>
            <button
              style={{ ...linkStyle, background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#333' }}
              onClick={() => handleNavClick('maestros')}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              👨‍🏫 Maestros
            </button>
          </li>
          <li style={liStyle}>
            <button
              style={{ ...linkStyle, background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#333' }}
              onClick={() => handleNavClick('alumnos')}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              🎓 Alumnos
            </button>
          </li>
          <li style={liStyle}>
            <button
              style={{ ...linkStyle, background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#333' }}
              onClick={() => handleNavClick('contacto')}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Contacto
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
