-- =============================================
-- MEJORA DINÁMICA: Contenido de Portada (Slides) y Tarjetas
-- Ejecutar en el SQL Editor de Supabase
-- =============================================

-- 1. Mejorar tabla hero_slides para permitir texto y botones
ALTER TABLE IF EXISTS public.hero_slides 
ADD COLUMN IF NOT EXISTS title text DEFAULT '',
ADD COLUMN IF NOT EXISTS subtitle text DEFAULT '',
ADD COLUMN IF NOT EXISTS button_text text DEFAULT '',
ADD COLUMN IF NOT EXISTS button_link text DEFAULT '',
ADD COLUMN IF NOT EXISTS overlay_opacity decimal DEFAULT 0.4;

-- 2. Asegurar que las tarjetas de home_options tengan campos de contenido extendido
ALTER TABLE IF EXISTS public.home_options
ADD COLUMN IF NOT EXISTS external_url text DEFAULT '',
ADD COLUMN IF NOT EXISTS post_id bigint REFERENCES public.publicaciones_globales(id) ON DELETE SET NULL;

-- 3. Comentario informativo
COMMENT ON COLUMN public.hero_slides.title IS 'Título principal que aparece sobre la imagen de portada';
COMMENT ON COLUMN public.hero_slides.subtitle IS 'Subtítulo o descripción corta sobre la imagen';
COMMENT ON COLUMN public.hero_slides.button_text IS 'Texto del botón de acción (CTA)';
COMMENT ON COLUMN public.hero_slides.button_link IS 'URL o path a donde redirige el botón';
