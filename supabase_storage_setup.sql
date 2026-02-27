-- =========================================================
-- CONFIGURACIÓN DE STORAGE - CBTa 134
-- Ejecuta este script en el SQL Editor de Supabase
-- =========================================================

-- ─── CREAR BUCKETS ───────────────────────────────────────
-- Nota: Si el bucket ya existe, insert ignora el registro

INSERT INTO storage.buckets (id, name, public)
VALUES ('carreras_media', 'carreras_media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('posts_media', 'posts_media', true)
ON CONFLICT (id) DO NOTHING;

-- ─── POLÍTICAS DE ACCESO PÚBLICO (LECTURA) ────────────────
-- Permitir que cualquier persona vea los archivos

CREATE POLICY "Acceso Público Lectura Carreras"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'carreras_media');

CREATE POLICY "Acceso Público Lectura Posts"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'posts_media');

-- ─── POLÍTICAS DE CARGA (USUARIOS AUTENTICADOS) ──────────
-- Permitir que los administradores suban archivos

CREATE POLICY "Admin Upload Carreras"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'carreras_media');

CREATE POLICY "Admin Update Carreras"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'carreras_media');

CREATE POLICY "Admin Delete Carreras"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'carreras_media');

CREATE POLICY "Admin Upload Posts"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'posts_media');

CREATE POLICY "Admin Update Posts"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'posts_media');

CREATE POLICY "Admin Delete Posts"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'posts_media');

-- ─── BUCKET UI_MEDIA ─────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('ui_media', 'ui_media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Acceso Público Lectura UI"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'ui_media');

CREATE POLICY "Admin Upload UI"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'ui_media');

CREATE POLICY "Admin Update UI"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'ui_media');

CREATE POLICY "Admin Delete UI"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'ui_media');
