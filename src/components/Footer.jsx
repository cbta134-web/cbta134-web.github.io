import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';


const Footer = () => {
  const navigate = useNavigate();
  const [footerConfig, setFooterConfig] = useState(null);
  const [footerLinks, setFooterLinks] = useState([]);

  useEffect(() => {
    const fetchFooter = async () => {
      const { data: configData } = await supabase
        .from('ui_footer_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: linksData } = await supabase
        .from('ui_footer_links')
        .select('*')
        .order('order_index', { ascending: true });

      setFooterConfig(configData || null);
      setFooterLinks(linksData || []);
    };

    fetchFooter();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>{footerConfig?.school_name || 'CBTA 134'}</h3>
          <p>{footerConfig?.location_text || 'San Francisco Tetlanohcan'}</p>
          <p>{footerConfig?.tagline_text || 'Educación de calidad para el futuro'}</p>
        </div>

        <div className="footer-section">
          <h3>Autores</h3>
          <p>Créditos de la página</p>
          <a
            href="#/creditos"
            className="footer-link"
            onClick={(event) => {
              event.preventDefault();
              navigate('/creditos');
              window.location.hash = '#/creditos';
            }}
          >
            Ver autores
          </a>
        </div>

    

        <div className="footer-section">
          <h3>Síguenos</h3>
          <div className="social-buttons">
            {footerLinks.length > 0 ? (
              footerLinks.map((link) => (
                <a key={link.id} href={link.href} target="_blank" className={`social-button ${link.style_class || ''}`}>
                  {link.icon_url && <img src={link.icon_url} alt={link.label} />}
                  {link.label}
                </a>
              ))
            ) : (
              <>
                <a href="https://www.facebook.com" target="_blank" className="social-button facebook">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" />
                  Facebook
                </a>
                <a href="https://maps.google.com" target="_blank" className="social-button maps">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Google_Maps_icon_%282020%29.svg" alt="Maps" />
                  Maps
                </a>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-copyright">
          <p>{footerConfig?.copyright_text || '© 2025, Centro de Bachillerato Tecnológico Agropecuario No. 134.'}</p>
          <p><strong>{footerConfig?.rights_text || 'Todos los derechos reservados.'}</strong></p>
          
          <div className="copyright-details">
            <p>{footerConfig?.legal_text_1 || 'El contenido de este sitio, incluyendo textos, imágenes, documentos, logotipos y demás materiales, es propiedad del Centro de Bachillerato Tecnológico Agropecuario No. 134 y se encuentra protegido por la legislación nacional e internacional sobre derechos de autor.'}</p>
            
            <p>{footerConfig?.legal_text_2 || 'Queda prohibida la reproducción, distribución, comunicación pública o modificación total o parcial de los materiales sin autorización previa y por escrito de los responsables del sitio.'}</p>
            
            <p>{footerConfig?.legal_text_3 || 'Este sitio tiene fines académicos y de divulgación estudiantil. Los contenidos compartidos pertenecen a sus autores originales y se citan únicamente con fines educativos.'}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;