import React, { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import { supabase } from '../lib/supabaseClient';

const useIsDark = () => {
  try {
    return typeof document !== 'undefined' && document.body.classList.contains('dark-mode');
  } catch (e) {
    return false;
  }
};

const Contacto = ({ setCurrentView }) => {
  const isDark = useIsDark();
  const [contactMain, setContactMain] = useState(null);
  const [directory, setDirectory] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [location, setLocation] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [cta, setCta] = useState(null);

  useEffect(() => {
    const fetchContactData = async () => {
      const { data: mainData } = await supabase
        .from('contact_main')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: directoryData } = await supabase
        .from('contact_directory')
        .select('*')
        .order('order_index', { ascending: true });

      const { data: socialData } = await supabase
        .from('contact_social')
        .select('*')
        .order('order_index', { ascending: true });

      const { data: locationData } = await supabase
        .from('contact_location')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: faqData } = await supabase
        .from('contact_faq')
        .select('*')
        .order('order_index', { ascending: true });

      const { data: ctaData } = await supabase
        .from('contact_cta')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setContactMain(mainData || null);
      setDirectory(directoryData || []);
      setSocialLinks(socialData || []);
      setLocation(locationData || null);
      setFaqs(faqData || []);
      setCta(ctaData || null);
    };

    fetchContactData();
  }, []);

  const pageStyle = {
    paddingTop: '80px',
    minHeight: '100vh',
    backgroundColor: isDark ? '#0f1720' : '#f8f9fa'
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '100%',
    margin: '0 auto'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: isDark ? '#e6eef8' : '#2c3e50',
    marginBottom: '25px',
    textAlign: 'center'
  };

  const sectionStyle = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
    borderRadius: '15px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: isDark ? '0 12px 35px rgba(2,6,23,0.7)' : '0 8px 25px rgba(0,0,0,0.1)'
  };

  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: isDark ? '#93c5fd' : '#3498db',
    marginBottom: '20px',
    textAlign: 'center'
  };

  const contactInfoStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fa',
    borderRadius: '10px',
    border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e9ecef'
  };

  const iconStyle = {
    fontSize: '24px',
    marginRight: '15px',
    marginTop: '2px',
    flexShrink: 0
  };

  const linkStyle = {
    color: isDark ? '#93c5fd' : '#3498db',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  };

  const mapStyle = {
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: isDark ? '0 8px 25px rgba(0,0,0,0.6)' : '0 4px 15px rgba(0,0,0,0.2)'
  };

  const facebookStyle = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #1877f2, #42a5f5)',
    color: 'white',
    padding: '15px 30px',
    borderRadius: '25px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(24, 119, 242, 0.3)'
  };

  return (
    <div style={pageStyle}>
      <BackButton onClick={() => setCurrentView('home')} />
      
      <div style={containerStyle}>
        <h1 style={titleStyle}>📞 Contacto</h1>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📍 Información de Contacto</h2>
          
          <div style={contactInfoStyle}>
            <span style={iconStyle}>🏫</span>
            <div>
              <strong>Dirección:</strong><br/>
              {contactMain?.address_line1 || 'CARRETERA TETLANOHCAN A MALINTZIN KILÓMETRO NUM. 3'}<br/>
              {contactMain?.address_line2 || 'San Francisco, México, 90800'}
              {contactMain?.address_line3 ? (<><br/>{contactMain.address_line3}</>) : null}
            </div>
          </div>

          <div style={contactInfoStyle}>
            <span style={iconStyle}>📞</span>
            <div>
              <strong>Teléfono:</strong><br/>
              <a href={contactMain?.phone ? `tel:${contactMain.phone.replace(/\s/g, '')}` : 'tel:+522464623456'} style={linkStyle}>
                {contactMain?.phone || '01 (246) 46 2 34 56'}
              </a>
            </div>
          </div>

          <div style={contactInfoStyle}>
            <span style={iconStyle}>📧</span>
            <div>
              <strong>Correo Electrónico:</strong><br/>
              <a href={contactMain?.email ? `mailto:${contactMain.email}` : 'mailto:cbta134@yahoo.com.mx'} style={linkStyle}>
                {contactMain?.email || 'cbta134@yahoo.com.mx'}
              </a>
            </div>
          </div>

          <div style={contactInfoStyle}>
            <span style={iconStyle}>🌐</span>
            <div>
              <strong>Sitio Web:</strong><br/>
              <a href={contactMain?.website || 'http://www.cbta134.edu.mx/'} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                {contactMain?.website || 'www.cbta134.edu.mx'}
              </a>
            </div>
          </div>

          <div style={contactInfoStyle}>
            <span style={iconStyle}>⭐</span>
            <div>
              <strong>Calificación:</strong><br/>
              {contactMain?.rating_text || 'Recomendado por el 92% (17 opiniones)'}
            </div>
          </div>

          <div style={contactInfoStyle}>
            <span style={iconStyle}>🕒</span>
            <div>
              <strong>Horario de Atención:</strong><br/>
              <span style={{color: '#28a745', fontWeight: 'bold'}}>{contactMain?.status_text || '🟢 Abierto ahora'}</span><br/>
              {contactMain?.hours_line1 || 'Lunes a Viernes: 7:00 AM - 4:00 PM'}<br/>
              {contactMain?.hours_line2 || 'Sábados: 8:00 AM - 12:00 PM'}
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>👥 Directorio</h2>
          {directory.map((item) => (
            <div key={item.id} style={contactInfoStyle}>
              <span style={iconStyle}>{item.icon || '👤'}</span>
              <div>
                <strong>{item.title}</strong><br/>
                {item.detail}
              </div>
            </div>
          ))}
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🌐 Síguenos en Redes Sociales</h2>
          <div style={{textAlign: 'center'}}>
            {socialLinks.length === 0 ? (
              <>
                <a 
                  href="https://www.facebook.com/share/15g75ZdJRg/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={facebookStyle}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  📘 Facebook Oficial
                </a>
                <p style={{color: isDark ? '#bfc7cf' : '#666', marginTop: '15px'}}>
                  Mantente informado sobre noticias, eventos y actividades de nuestra institución
                </p>
              </>
            ) : (
              socialLinks.map((item) => (
                <div key={item.id} style={{ marginBottom: '16px' }}>
                  <a 
                    href={item.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={facebookStyle}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    {item.icon || '🔗'} {item.name}
                  </a>
                  <p style={{color: isDark ? '#bfc7cf' : '#666', marginTop: '10px'}}>
                    {item.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🗺️ Ubicación</h2>
          <p style={{textAlign: 'center', marginBottom: '20px', color: '#666'}}>
            {location?.address_text || 'CARRETERA TETLANOHCAN A MALINTZIN KILÓMETRO NUM. 3, San Francisco, México'}
          </p>
          <div style={mapStyle}>
            <iframe
              title="Ubicación CBTA 134"
              src={location?.map_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8962250553377!2d-98.14220228509102!3d19.261621686935783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cfdd8ebaaaaaab%3A0x27dafbca82bfb2a0!2sCarretera%20Tetlanohcan%20a%20Malintzin%2C%20San%20Francisco%2C%20Tlax.!5e0!3m2!1sen!2smx!4v1648000000000!5m2!1sen!2smx'}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>❓ Preguntas Frecuentes</h2>
          {faqs.map((item) => (
            <div key={item.id} style={{marginBottom: '20px'}}>
              <h4 style={{color: isDark ? '#e6eef8' : '#2c3e50', marginBottom: '8px'}}>{item.question}</h4>
              <p style={{color: isDark ? '#bfc7cf' : '#666', marginBottom: '15px'}}>
                {item.answer}
              </p>
            </div>
          ))}
        </section>

        <section className="contacto-info-section" style={{
          ...sectionStyle,
          background: isDark ? 'linear-gradient(135deg, #1e3c72, #2a5298)' : 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{...sectionTitleStyle, color: 'white'}}>{cta?.title || '📩 ¿Necesitas más información?'}</h2>
          <p style={{marginBottom: '20px', fontSize: '16px', color: 'white'}}>
            {cta?.description || 'Estamos aquí para ayudarte. No dudes en contactarnos para resolver todas tus dudas sobre nuestros programas educativos, proceso de admisión o cualquier otra consulta.'}
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '10px',
            padding: '20px',
            marginTop: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{margin: 0, fontWeight: 'bold', color: 'white'}}>
              {cta?.highlight_text || '🌟 ¡Tu futuro comienza aquí en el CBTA 134! 🌟'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contacto;