import React from 'react';
import BackButton from './BackButton';
import styles from './ValoresInstitucionales.module.css'; // Importa los estilos como un módulo

const ValoresInstitucionales = ({ onBack }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Valores Institucionales</h2>

      <p className={styles.mision}><strong>Misión:</strong></p>
      <p className={styles.text}>
        Contribuir activamente a la formación integral de nuestros estudiantes del Bachillerato
        Tecnológico con un enfoque de desarrollo sostenible y emprendedor que los integre plenamente
        a la sociedad.
      </p>

      <p className={styles.vision}><strong>Visión:</strong></p>
      <p className={styles.text}>
        Ser una institución de calidad, formadora de líderes del mañana.
      </p>

      <p className={styles.slogan}><strong>Lema:</strong></p>
      <p className={styles.text}>Formar e innovar para transformar.</p>

      <BackButton onClick={onBack} text="Regresar al Menú Principal" />
    </div>
  );
};

export default ValoresInstitucionales;