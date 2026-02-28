import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      const { data } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_index', { ascending: true });

      if (data && data.length > 0) {
        setSlides(data);
      }
      setLoading(false);
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (loading) return (
    <div className="h-[60vh] bg-slate-100 animate-pulse flex items-center justify-center">
      <div className="text-slate-400">Cargando portada...</div>
    </div>
  );

  return (
    <section className="hero-section relative overflow-hidden group">
      <div className="slides-container absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`slide absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{
              backgroundImage: `url(${slide.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: slide.overlay_opacity || 0.4 }}
            ></div>

            {(slide.title || slide.subtitle || slide.button_text) && (
              <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                <div className={`max-w-3xl transform transition-all duration-1000 delay-300 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  {slide.title && (
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md max-w-2xl mx-auto">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.button_text && (
                    <a
                      href={slide.button_link || '#'}
                      className="inline-block px-8 py-3 bg-white text-emerald-800 font-bold rounded-full hover:bg-emerald-50 transition-colors shadow-xl text-lg transform hover:scale-105 active:scale-95"
                    >
                      {slide.button_text}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <div className="slides-controls absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125 w-8' : 'bg-white/40 hover:bg-white/60'}`}
                onClick={() => setCurrentSlide(index)}
              ></button>
            ))}
          </div>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          >
            <span className="material-symbols-outlined text-4xl">chevron_left</span>
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          >
            <span className="material-symbols-outlined text-4xl">chevron_right</span>
          </button>
        </>
      )}
    </section>
  );
};

export default HeroSection;