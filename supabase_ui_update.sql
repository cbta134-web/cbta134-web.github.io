-- =============================================
-- ACTUALIZACIÓN COMPLETA: Sección Interfaz
-- Ejecutar en el SQL Editor de Supabase
-- =============================================

-- 1. Agregar campo para texto del botón de cada tarjeta
ALTER TABLE public.home_options 
ADD COLUMN IF NOT EXISTS button_text text DEFAULT 'Ver más';

-- 2. Agregar campo para visibilidad (ocultar/mostrar tarjetas)
ALTER TABLE public.home_options 
ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;

-- 3. Insertar las tarjetas iniciales si la tabla está vacía
-- (Si ya tienes datos, este comando no hará nada por el WHERE NOT EXISTS)

INSERT INTO public.home_options (image_url, title, description, path, button_text, is_locked, is_visible, order_index)
SELECT * FROM (VALUES
  ('/images/valores.png',         'Acerca de CBTa 134',    'Conoce nuestra historia, misión, visión y valores que nos definen como institución.',                          'acerca',       'Ver más',          true,  true, 1),
  ('/images/programacion.jpg',    'Carreras Técnicas',     'Descubre nuestras especialidades técnicas y elige tu futuro profesional.',                                      'carreras',     'Ver carreras',     true,  true, 2),
  ('/images/galeria.png',         'Galería',               'Explora nuestra colección de fotos y eventos destacados.',                                                      'galeria',      'Ver galería',      false, true, 3),
  ('/images/proceso de admincion.jpg', 'Proceso de Admisión', 'Información sobre requisitos y pasos para formar parte de nuestra institución.',                            'admission',    'Saber más',        false, true, 4),
  ('/images/campus.png',          'Clubs Estudiantiles',   'Únete a nuestros clubs deportivos, culturales y académicos.',                                                  'clubs',        'Ver clubs',        false, true, 5),
  ('/images/ofimatica.jpg',       'Contacto',              'Información de contacto y ubicación de nuestra institución.',                                                  'contacto',     'Contactarnos',     false, true, 6),
  ('/images/baetam.jpg',          'BAETAM',                'Bachillerato Autoplaneado - Educación flexible para adultos.',                                                  'baetam',       'Conocer BAETAM',   false, true, 7),
  ('/images/maestros-hero.png',   'Maestros',              'Recursos y enlaces útiles para el personal docente.',                                                           'maestros',     'Portal Maestros',  false, true, 8),
  ('/images/alumnos-hero.png',    'Alumnos',               'Portal de alumnos para acceso a calificaciones y servicios.',                                                  'alumnos',      'Portal Alumnos',   false, true, 9),
  ('/images/proceso de admincion.jpg', 'Pre-Registro',     'Realiza tu pre-registro como aspirante de nuevo ingreso y obtén tu ficha.',                                    'preregistro',  'Pre-Registrarme',  false, true, 10)
) AS v(image_url, title, description, path, button_text, is_locked, is_visible, order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.home_options LIMIT 1);

-- 4. Actualizar las tarjetas existentes para que tengan button_text si no lo tienen
UPDATE public.home_options 
SET button_text = 'Ver más'
WHERE button_text IS NULL OR button_text = '';

-- =============================================
-- VERIFICAR (opcional - ejecutar por separado)
-- =============================================
-- SELECT id, title, button_text, is_visible, order_index FROM public.home_options ORDER BY order_index;
