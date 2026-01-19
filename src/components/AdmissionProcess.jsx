import React, { useEffect, useState } from "react";
import BackButton from "./BackButton";
import styles from "./AdmissionProcess.module.css";
import { supabase } from "../lib/supabaseClient";

const AdmissionProcess = ({ onBack }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [admissionConfig, setAdmissionConfig] = useState(null);
  const [admissionDates, setAdmissionDates] = useState([]);
  const [admissionRequirements, setAdmissionRequirements] = useState([]);
  const [admissionSpecialties, setAdmissionSpecialties] = useState([]);
  const [admissionContact, setAdmissionContact] = useState(null);
  const [admissionTimeLeft, setAdmissionTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.body.classList.contains('dark-mode');
      setIsDarkMode(isDark);
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const calculateAdmissionTimeLeft = () => {
      const targetDateValue = admissionConfig?.target_date || '2026-04-01T00:00:00';
      const targetDate = new Date(targetDateValue);
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        setAdmissionTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setAdmissionTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateAdmissionTimeLeft();
    const timer = setInterval(calculateAdmissionTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [admissionConfig]);

  useEffect(() => {
    const fetchAdmissionData = async () => {
      setLoading(true);
      const { data: configData } = await supabase
        .from('admission_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: datesData } = await supabase
        .from('admission_dates')
        .select('*')
        .order('order_index', { ascending: true });

      const { data: requirementsData } = await supabase
        .from('admission_requirements')
        .select('*')
        .order('order_index', { ascending: true });

      const { data: specialtiesData } = await supabase
        .from('admission_specialties')
        .select('*')
        .order('order_index', { ascending: true });

      const { data: contactData } = await supabase
        .from('admission_contact')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setAdmissionConfig(configData || null);
      setAdmissionDates(datesData || []);
      setAdmissionRequirements(requirementsData || []);
      setAdmissionSpecialties(specialtiesData || []);
      setAdmissionContact(contactData || null);
      setLoading(false);
    };

    fetchAdmissionData();
  }, []);

  const containerStyle = {
    backgroundColor: isDarkMode ? '#07111a' : '#f0f2f5',
    color: isDarkMode ? '#d6dbe3' : '#333'
  };

  const cardStyle = {
    background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'white',
    color: isDarkMode ? '#d0d7de' : '#333',
    boxShadow: isDarkMode ? '0 10px 30px rgba(2,6,23,0.6)' : '0 4px 15px rgba(0, 0, 0, 0.1)'
  };

  const fechaCardStyle = {
    background: isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8f9fa',
    color: isDarkMode ? '#d0d7de' : '#333'
  };

  const especialidadCardStyle = {
    background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'white',
    color: isDarkMode ? '#d0d7de' : '#333',
    boxShadow: isDarkMode ? '0 10px 30px rgba(2,6,23,0.6)' : '0 4px 15px rgba(0, 0, 0, 0.1)'
  };

  const listItemStyle = {
    background: isDarkMode ? 'rgba(255,255,255,0.02)' : '#f8f9fa',
    color: isDarkMode ? '#d0d7de' : '#333'
  };

  return React.createElement('div', 
    { 
      className: `${styles.admissionProcess} ${isDarkMode ? 'dark-mode-content' : ''}`, 
      style: containerStyle 
    },
    React.createElement('header', { className: styles.header },
      React.createElement('h1', null, admissionConfig?.header_title || '¡Bienvenido al CBTA 134! 🎓'),
      React.createElement('p', { className: styles.welcomeText }, 
        admissionConfig?.header_subtitle || 'Tu futuro comienza aquí en San Francisco Tetlanohcan'
      )
    ),
    React.createElement('div', { className: styles.container },
      React.createElement('div', { className: styles.countdownContainer },
        React.createElement('h2', null, '🎓 ¡Próximos Procesos de Admisión 2026!'),
        React.createElement('div', { className: styles.countdown },
          React.createElement('div', { className: styles.countdownItem },
            React.createElement('span', null, admissionTimeLeft.days),
            React.createElement('p', null, 'Días')
          ),
          React.createElement('div', { className: styles.countdownItem },
            React.createElement('span', null, admissionTimeLeft.hours.toString().padStart(2, '0')),
            React.createElement('p', null, 'Horas')
          ),
          React.createElement('div', { className: styles.countdownItem },
            React.createElement('span', null, admissionTimeLeft.minutes.toString().padStart(2, '0')),
            React.createElement('p', null, 'Minutos')
          ),
          React.createElement('div', { className: styles.countdownItem },
            React.createElement('span', null, admissionTimeLeft.seconds.toString().padStart(2, '0')),
            React.createElement('p', null, 'Segundos')
          )
        ),
        React.createElement('div', { className: styles.countdownMessage },
          admissionConfig?.countdown_message || '¡Procesos de admisión inician el 1 de abril de 2026!'
        )
      ),
      React.createElement('div', { className: styles.card, style: cardStyle },
        React.createElement('h2', { className: styles.emojiTitle }, '📅 ¡Fechas Importantes!'),
        React.createElement('div', { className: styles.fechasGrid },
          (admissionDates.length > 0 ? admissionDates : []).map((item) => (
            React.createElement('div', { key: item.id, className: styles.fechaCard, style: fechaCardStyle },
              React.createElement('h3', null, item.title),
              React.createElement('p', null, item.date_range),
              React.createElement('p', null, item.subtitle)
            )
          ))
        )
      ),
      React.createElement('div', { className: styles.card, style: cardStyle },
        React.createElement('h2', { className: styles.emojiTitle }, '📋 ¿Qué necesitas traer?'),
        React.createElement('ul', { className: styles.requisitosList },
          (admissionRequirements.length > 0 ? admissionRequirements : []).map((item) => (
            React.createElement('li', { key: item.id, style: listItemStyle }, item.requirement)
          ))
        )
      ),
      React.createElement('div', { className: styles.card, style: cardStyle },
        React.createElement('h2', { className: styles.emojiTitle }, '🌟 ¡Elige tu camino!'),
        React.createElement('div', { className: styles.especialidadesGrid },
          (admissionSpecialties.length > 0 ? admissionSpecialties : []).map((item) => (
            React.createElement('div', { key: item.id, className: styles.especialidadCard, style: especialidadCardStyle },
              React.createElement('div', { className: styles.emojiIcon }, item.emoji),
              React.createElement('h3', null, item.name),
              React.createElement('p', null, item.description)
            )
          ))
        )
      ),
      React.createElement('div', { className: styles.card, style: cardStyle },
        React.createElement('h2', { className: styles.emojiTitle }, '📞 ¡Contáctanos!'),
        React.createElement('div', { className: styles.contactoInfo },
          React.createElement('p', null, `📍 Dirección: ${admissionContact?.address || 'CARRETERA TETLANOHCAN A MALINTZIN KILÓMETRO NUM. 3, San Francisco, México, 90800'}`),
          React.createElement('p', null, `${admissionContact?.phone_label || '📞 Teléfono'}: `,
            React.createElement('a', { 
              href: admissionContact?.phone_value ? `tel:${admissionContact.phone_value.replace(/\s/g, '')}` : 'tel:+522464623456', 
              style: { color: isDarkMode ? '#93c5fd' : '#3498db', textDecoration: 'none' }
            }, admissionContact?.phone_value || '01 (246) 46 2 34 56')
          ),
          React.createElement('p', null, `${admissionContact?.email_label || '📧 Correo'}: `,
            React.createElement('a', { 
              href: admissionContact?.email_value ? `mailto:${admissionContact.email_value}` : 'mailto:cbta134@yahoo.com.mx', 
              target: '_blank',
              rel: 'noopener noreferrer',
              style: { color: isDarkMode ? '#93c5fd' : '#3498db', textDecoration: 'none' }
            }, admissionContact?.email_value || 'cbta134@yahoo.com.mx')
          ),
          React.createElement('p', null, `${admissionContact?.website_label || '🌐 Sitio Web'}: `,
            React.createElement('a', { 
              href: admissionContact?.website_value || 'http://www.cbta134.edu.mx/', 
              target: '_blank',
              rel: 'noopener noreferrer',
              style: { color: isDarkMode ? '#93c5fd' : '#3498db', textDecoration: 'none' }
            }, admissionContact?.website_value || 'www.cbta134.edu.mx')
          ),
          React.createElement('p', null, admissionContact?.schedule || '🕒 Horario: Lunes a Viernes 7:00 AM - 4:00 PM, Sábados 8:00 AM - 12:00 PM')
        )
      )
    ),
    React.createElement(BackButton, { 
      onBack: onBack, 
      text: 'Regresar al Menú Principal' 
    })
  );
};

export default AdmissionProcess;
