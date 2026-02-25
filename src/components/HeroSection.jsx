import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';


const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([
    '/images/camaleon.jpg',
    '/images/campus.png'
  ]);

  useEffect(() => {
    const fetchSlides = async () => {
      const { data } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_index', { ascending: true });

      if (data && data.length > 0) {
        setSlides(data.map((s) => s.image_url));
      }
    };

    fetchSlides();
  }, []);

  // Cambia automáticamente las imágenes cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, [slides.length]);

  return (
    <section className="hero-section">
      <div className="slides-container">
        {slides.map((image, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        ))}
      </div>
      <div className="slides-controls">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slide-indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;