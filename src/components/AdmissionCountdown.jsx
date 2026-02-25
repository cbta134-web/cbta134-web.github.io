import React, { useState, useEffect } from 'react';

const AdmissionCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date('2026-04-01T00:00:00');
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
  }, []);

  const CountdownUnit = ({ value, label }) => (
    React.createElement('div', { className: 'countdown-unit' },
      React.createElement('span', { className: 'countdown-number' }, value),
      React.createElement('span', { className: 'countdown-label' }, label)
    )
  );

  const CountdownSeparator = () => (
    React.createElement('div', { className: 'countdown-separator' }, ':')
  );

  return React.createElement('div', { className: 'admission-countdown-section' },
    React.createElement('h2', { className: 'countdown-title' }, 
      '🎓 Próximos Procesos de Admisión'
    ),
    React.createElement('p', { className: 'countdown-subtitle' }, 
      'Prepárate para el proceso de admisión de abril 2026'
    ),
    React.createElement('div', { className: 'countdown-container' },
      React.createElement(CountdownUnit, { 
        value: timeLeft.days, 
        label: 'Días' 
      }),
      React.createElement(CountdownSeparator),
      React.createElement(CountdownUnit, { 
        value: timeLeft.hours.toString().padStart(2, '0'), 
        label: 'Horas' 
      }),
      React.createElement(CountdownSeparator),
      React.createElement(CountdownUnit, { 
        value: timeLeft.minutes.toString().padStart(2, '0'), 
        label: 'Minutos' 
      }),
      React.createElement(CountdownSeparator),
      React.createElement(CountdownUnit, { 
        value: timeLeft.seconds.toString().padStart(2, '0'), 
        label: 'Segundos' 
      })
    ),
    React.createElement('div', { className: 'admission-info' },
      React.createElement('p', { className: 'admission-date' }, 
        '📅 Inicio de procesos: 1 de Abril de 2026'
      ),
      React.createElement('p', { className: 'admission-details' }, 
        'Mantente atento a las fechas oficiales y requisitos de admisión'
      )
    )
  );
};

export default AdmissionCountdown;