import React from 'react';
import BackButton from './BackButton';

const useIsDark = () => {
  try {
    return typeof document !== 'undefined' && document.body.classList.contains('dark-mode');
  } catch (e) {
    return false;
  }
};

const SAETAMComponent = ({ onBack }) => {
  const isDark = useIsDark();

  const container = {
    ...styles.container,
    backgroundColor: isDark ? '#07111a' : styles.container.backgroundColor,
    color: isDark ? '#d6dbe3' : undefined
  };

  const contentStyle = {
    ...styles.content,
    background: isDark ? 'rgba(255,255,255,0.03)' : styles.content.background,
    boxShadow: isDark ? '0 10px 30px rgba(2,6,23,0.7)' : styles.content.boxShadow,
    color: isDark ? '#c8cdd3' : undefined
  };

  const headerStyle = {
    ...styles.header,
    backgroundColor: isDark ? 'rgba(76,175,80,0.12)' : styles.header.backgroundColor
  };

  const contactInfoStyle = {
    ...styles.contactInfo,
    backgroundColor: isDark ? 'rgba(76,175,80,0.08)' : styles.contactInfo.backgroundColor
  };

  return (
    <div style={container}>
      <header style={styles.header}>
        <h1>Centro de Bachillerato Tecnológico Agropecuario No. 134</h1>
        <h2>"Efraím Hernández Xolocotzi"</h2>
      </header>

      <div style={contentStyle}>
        <h2>Prepa Abierta</h2>
        <p>Estudia tu bachillerato y una carrera técnica en el área agropecuaria, los días sábado.</p>

        <h3>Requisitos:</h3>
        <ul style={styles.list}>
          <li>Ser mayor de 18 años</li>
          <li>Certificado de secundaria (original y 1 copia)</li>
          <li>Acta de nacimiento reciente (original y 1 copia)</li>
          <li>6 fotografías tamaño infantil, blanco y negro (en papel mate, no instantáneas)</li>
          <li>Credencial de elector (original para cotejar y 1 copia)</li>
          <li>CURP (reciente)</li>
          <li>Comprobante de domicilio (original para cotejar y 1 copia)</li>
          <li>Número de seguridad social (IMSS)</li>
        </ul>

        <p><strong>Nota:</strong> La apertura de esta modalidad dependerá del número de interesados en inscribirse.</p>

        <div style={contactInfoStyle}>
          <p><strong>Dirección:</strong> Calle Josefa Ortiz de Domínguez s/n, Barrio de Jesús Xolalpan, San Francisco Tetlanohcan, Tlax.</p>
          <p><strong>Teléfono:</strong> 246 467 42 37</p>
          <p>
            <strong>Más información:</strong>{' '}
            <a href="http://www.cbta134.edu.mx" style={styles.link}>
              www.cbta134.edu.mx
            </a>
          </p>
          <p>
            Síguenos en redes sociales:{' '}
            <a href="https://www.facebook.com/micbta134" style={styles.link}>
              Facebook
            </a>
          </p>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>&copy; 2025 CBTa 134 - Secretaría de Educación Pública</p>
      </footer>

      <BackButton onBack={onBack} text="Regresar al Menú Principal" />
    </div>
  );
};

// Estilos en línea
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
    paddingTop: '80px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#4caf50',
    color: 'white',
    textAlign: 'center',
    padding: '10px 0',
  },
  content: {
    maxWidth: '800px',
    margin: '20px auto',
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  list: {
    listStyleType: 'disc',
    marginLeft: '20px',
  },
  contactInfo: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'underline',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '0.9em',
    color: '#666',
  },
};

export default SAETAMComponent;