-- ===========================================
-- POLÍTICAS DE LECTURA PÚBLICA PARA SUPABASE
-- Ejecuta este script en el SQL Editor de Supabase
-- Esto permitirá que los datos se muestren sin iniciar sesión
-- ===========================================

-- ============ BAETAM ============
DROP POLICY IF EXISTS "Permitir lectura pública de baetam_config" ON public.baetam_config;
CREATE POLICY "Permitir lectura pública de baetam_config" 
ON public.baetam_config FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de baetam_info_cards" ON public.baetam_info_cards;
CREATE POLICY "Permitir lectura pública de baetam_info_cards" 
ON public.baetam_info_cards FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de baetam_requirements" ON public.baetam_requirements;
CREATE POLICY "Permitir lectura pública de baetam_requirements" 
ON public.baetam_requirements FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de baetam_advantages" ON public.baetam_advantages;
CREATE POLICY "Permitir lectura pública de baetam_advantages" 
ON public.baetam_advantages FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de baetam_contact_lines" ON public.baetam_contact_lines;
CREATE POLICY "Permitir lectura pública de baetam_contact_lines" 
ON public.baetam_contact_lines FOR SELECT 
TO anon, authenticated
USING (true);

-- ============ ADMISIÓN ============
DROP POLICY IF EXISTS "Permitir lectura pública de admission_config" ON public.admission_config;
CREATE POLICY "Permitir lectura pública de admission_config" 
ON public.admission_config FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de admission_dates" ON public.admission_dates;
CREATE POLICY "Permitir lectura pública de admission_dates" 
ON public.admission_dates FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de admission_requirements" ON public.admission_requirements;
CREATE POLICY "Permitir lectura pública de admission_requirements" 
ON public.admission_requirements FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de admission_specialties" ON public.admission_specialties;
CREATE POLICY "Permitir lectura pública de admission_specialties" 
ON public.admission_specialties FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de admission_contact" ON public.admission_contact;
CREATE POLICY "Permitir lectura pública de admission_contact" 
ON public.admission_contact FOR SELECT 
TO anon, authenticated
USING (true);

-- ============ ACERCA DE CBTa ============
DROP POLICY IF EXISTS "Permitir lectura pública de about_config" ON public.about_config;
CREATE POLICY "Permitir lectura pública de about_config" 
ON public.about_config FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de about_values" ON public.about_values;
CREATE POLICY "Permitir lectura pública de about_values" 
ON public.about_values FOR SELECT 
TO anon, authenticated
USING (true);

-- ============ CONTACTO ============
DROP POLICY IF EXISTS "Permitir lectura pública de contact_main" ON public.contact_main;
CREATE POLICY "Permitir lectura pública de contact_main" 
ON public.contact_main FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de contact_directory" ON public.contact_directory;
CREATE POLICY "Permitir lectura pública de contact_directory" 
ON public.contact_directory FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de contact_social" ON public.contact_social;
CREATE POLICY "Permitir lectura pública de contact_social" 
ON public.contact_social FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de contact_location" ON public.contact_location;
CREATE POLICY "Permitir lectura pública de contact_location" 
ON public.contact_location FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de contact_faq" ON public.contact_faq;
CREATE POLICY "Permitir lectura pública de contact_faq" 
ON public.contact_faq FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de contact_cta" ON public.contact_cta;
CREATE POLICY "Permitir lectura pública de contact_cta" 
ON public.contact_cta FOR SELECT 
TO anon, authenticated
USING (true);

-- ============ GALERÍA ============
DROP POLICY IF EXISTS "Permitir lectura pública de gallery_items" ON public.gallery_items;
CREATE POLICY "Permitir lectura pública de gallery_items" 
ON public.gallery_items FOR SELECT 
TO anon, authenticated
USING (true);

-- ============ HERO / INICIO ============
DROP POLICY IF EXISTS "Permitir lectura pública de hero_slides" ON public.hero_slides;
CREATE POLICY "Permitir lectura pública de hero_slides" 
ON public.hero_slides FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de home_options" ON public.home_options;
CREATE POLICY "Permitir lectura pública de home_options" 
ON public.home_options FOR SELECT 
TO anon, authenticated
USING (true);

-- ============ UI HEADER / FOOTER ============
DROP POLICY IF EXISTS "Permitir lectura pública de ui_header_config" ON public.ui_header_config;
CREATE POLICY "Permitir lectura pública de ui_header_config" 
ON public.ui_header_config FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de ui_header_links" ON public.ui_header_links;
CREATE POLICY "Permitir lectura pública de ui_header_links" 
ON public.ui_header_links FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de ui_footer_config" ON public.ui_footer_config;
CREATE POLICY "Permitir lectura pública de ui_footer_config" 
ON public.ui_footer_config FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de ui_footer_links" ON public.ui_footer_links;
CREATE POLICY "Permitir lectura pública de ui_footer_links" 
ON public.ui_footer_links FOR SELECT 
TO anon, authenticated
USING (true);

-- ============ CARRERAS Y CLUBS ============
DROP POLICY IF EXISTS "Permitir lectura pública de carreras_tecnicas" ON public.carreras_tecnicas;
CREATE POLICY "Permitir lectura pública de carreras_tecnicas" 
ON public.carreras_tecnicas FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de clubs" ON public.clubs;
CREATE POLICY "Permitir lectura pública de clubs" 
ON public.clubs FOR SELECT 
TO anon, authenticated
USING (true);

-- ============ CRÉDITOS ============
DROP POLICY IF EXISTS "Permitir lectura pública de credits_config" ON public.credits_config;
CREATE POLICY "Permitir lectura pública de credits_config" 
ON public.credits_config FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de credits_authors" ON public.credits_authors;
CREATE POLICY "Permitir lectura pública de credits_authors" 
ON public.credits_authors FOR SELECT 
TO anon, authenticated
USING (true);

-- ============ CHATBOT (solo lectura de config pública) ============
DROP POLICY IF EXISTS "Permitir lectura pública de ai_models" ON public.ai_models;
CREATE POLICY "Permitir lectura pública de ai_models" 
ON public.ai_models FOR SELECT 
TO anon, authenticated
USING (true);

-- ===========================================
-- VERIFICAR QUE RLS ESTÁ HABILITADO EN CADA TABLA
-- Si no está habilitado, las políticas no funcionarán
-- ===========================================
ALTER TABLE public.baetam_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baetam_info_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baetam_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baetam_advantages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baetam_contact_lines ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.admission_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_contact ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.about_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_values ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.contact_main ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_social ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_location ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_cta ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_options ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.ui_header_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_header_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_footer_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_footer_links ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.carreras_tecnicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.credits_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits_authors ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- ¡LISTO! Después de ejecutar este script, los datos
-- se mostrarán sin necesidad de iniciar sesión
-- ===========================================
