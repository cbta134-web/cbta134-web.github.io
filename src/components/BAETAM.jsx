import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const BAETAM = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);
  const [infoCards, setInfoCards] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [advantages, setAdvantages] = useState([]);
  const [contactLines, setContactLines] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDateValue = config?.target_date || '2026-06-15T00:00:00';
      const targetDate = new Date(targetDateValue);
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [config]);

  useEffect(() => {
    const fetchBaetamData = async () => {
      setLoading(true);
      const { data: configData } = await supabase
        .from('baetam_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: infoData } = await supabase
        .from('baetam_info_cards')
        .select('*')
        .order('order_index', { ascending: true });

      const { data: requirementsData } = await supabase
        .from('baetam_requirements')
        .select('*')
        .order('order_index', { ascending: true });

      const { data: advantagesData } = await supabase
        .from('baetam_advantages')
        .select('*')
        .order('order_index', { ascending: true });

      const { data: contactData } = await supabase
        .from('baetam_contact_lines')
        .select('*')
        .order('order_index', { ascending: true });

      setConfig(configData || null);
      setInfoCards(infoData || []);
      setRequirements(requirementsData || []);
      setAdvantages(advantagesData || []);
      setContactLines(contactData || []);
      setLoading(false);
    };

    fetchBaetamData();
  }, []);

  return (
    <div className="baetam-page">
      {/* Botón de regreso */}
      <button className="back-button" onClick={onBack}>
        ← Regresar al inicio
      </button>
      
      <div className="baetam-container">
        {/* Header de BAETAM */}
        <div className="baetam-header">
          <img 
            src={config?.hero_image_url || "/baetam/baetam.jpg"} 
            alt="BAETAM - Bachillerato Autoplaneado" 
            className="baetam-hero-image"
          />
          <div className="baetam-header-content">
            <h1 className="baetam-title">{config?.title || 'BAETAM'}</h1>
            <h2 className="baetam-subtitle">
              {config?.subtitle || 'Bachillerato Autoplaneado de Educación Tecnológica Agropecuaria y del Mar'}
            </h2>
          </div>
        </div>

        {/* Información principal */}
        <div className="baetam-info">
          {infoCards.map((card) => (
            <div key={card.id} className="info-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>

        {/* Sección de inscripciones */}
        <div className="inscriptions-section">
          <h2 className="section-title">{config?.inscriptions_title || 'Próximas Inscripciones'}</h2>
          <div className="inscription-period">
            <h3>{config?.inscriptions_period_title || '📝 Período de Inscripciones: Mayo - Junio 2026'}</h3>
            <p>{config?.inscriptions_period_description || 'Las inscripciones para el nuevo ciclo escolar estarán abiertas durante los meses de mayo y junio de 2026.'}</p>
          </div>

          {/* Cuenta regresiva */}
          <div className="countdown-section">
            <h3>{config?.countdown_label || '⏰ Tiempo restante para las inscripciones:'}</h3>
            <div className="countdown-timer">
              <div className="time-unit">
                <span className="time-number">{timeLeft.days}</span>
                <span className="time-label">Días</span>
              </div>
              <div className="time-separator">:</div>
              <div className="time-unit">
                <span className="time-number">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="time-label">Horas</span>
              </div>
              <div className="time-separator">:</div>
              <div className="time-unit">
                <span className="time-number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="time-label">Minutos</span>
              </div>
              <div className="time-separator">:</div>
              <div className="time-unit">
                <span className="time-number">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="time-label">Segundos</span>
              </div>
            </div>
            <p className="countdown-date">{config?.countdown_date_text || '🗓️ Inicio de inscripciones: 15 de Junio de 2026'}</p>
          </div>
        </div>

        {/* Requisitos */}
        <div className="requirements-section">
          <h2 className="section-title">{config?.requirements_title || 'Requisitos de Ingreso'}</h2>
          <div className="requirements-grid">
            {requirements.map((req) => (
              <div key={req.id} className="requirement-item">
                <span className="requirement-icon">{req.icon}</span>
                <p>{req.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ventajas */}
        <div className="advantages-section">
          <h2 className="section-title">{config?.advantages_title || '¿Por qué elegir BAETAM?'}</h2>
          <div className="advantages-grid">
            {advantages.map((adv) => (
              <div key={adv.id} className="advantage-card">
                <h4>{adv.title}</h4>
                <p>{adv.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div className="contact-section">
          <h2 className="section-title">{config?.contact_title || '¿Necesitas más información?'}</h2>
          <p>{config?.contact_description || 'Contáctanos para resolver todas tus dudas sobre BAETAM'}</p>
          <div className="contact-info">
            {contactLines.map((line) => (
              <p key={line.id}>{line.line_text}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BAETAM;