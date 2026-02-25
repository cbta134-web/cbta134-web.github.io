import React, { useState } from "react";
import "./Gallery.css"; // Archivo de estilos para la galería

const Gallery = ({ onBack }) => {
  // Array de imágenes (sin el prefijo /public)
  const images = [
    "/img/agropecuarios.jpg",
    "/img/ajedres.jpg",
    "/img/baile folclorico.jpg",
    "/img/banda de guerra.jpg",
    "/img/basquet.jpg",
    "/img/bastoneras.jpg",
    "/img/boleibol.jpg",
    "/img/camaleon.jpg",
    "/img/club de ciencias.jpg",
    "/img/contabilidad.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.37_92b4b73a.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.37_b8ec2b8d.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.37_decd205e.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.38_14ea3982.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.38_44632326.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.38_9ca78683.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.38_f78edd50.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.39_9a94a2a2.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.39_d04e3c20.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.39_dd2daf12.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.39_f766f3e0.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.40_01d12ec6.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.40_ab7ebd9b.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.41_43833731.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.41_e0b46b86.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.42_259df5b1.jpg",
    "/img/Imagen de WhatsApp 2024-09-19 a las 11.22.43_62f9ee7d.jpg",
  ];

  // Estado para controlar la imagen seleccionada y la visibilidad del modal
  const [selectedImage, setSelectedImage] = useState(null);

  // Función para abrir el modal
  const openModal = (src) => {
    setSelectedImage(src);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-container">
      <header>
        <h1>Galería de Imágenes - Escuela CBTA 134</h1>
        <button className="back-button" onClick={onBack}>
          Regresar al Menú Principal
        </button>
      </header>

      <div className="gallery">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Imagen ${index + 1}`}
            onClick={() => openModal(src)}
          />
        ))}
      </div>

      {/* Modal para mostrar la imagen ampliada */}
      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          <img src={selectedImage} alt="Imagen Ampliada" className="modal-image" />
        </div>
      )}
    </div>
  );
};

export default Gallery;