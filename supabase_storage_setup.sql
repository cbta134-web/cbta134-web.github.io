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

DROP POLICY IF EXISTS "Acceso Público Lectura Carreras" ON storage.objects;
CREATE POLICY "Acceso Público Lectura Carreras"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'carreras_media');

DROP POLICY IF EXISTS "Acceso Público Lectura Posts" ON storage.objects;
CREATE POLICY "Acceso Público Lectura Posts"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'posts_media');

-- ─── POLÍTICAS DE CARGA (USUARIOS AUTENTICADOS) ──────────
-- Permitir que los administradores suban archivos

DROP POLICY IF EXISTS "Admin Upload Carreras" ON storage.objects;
CREATE POLICY "Admin Upload Carreras"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'carreras_media');

DROP POLICY IF EXISTS "Admin Update Carreras" ON storage.objects;
CREATE POLICY "Admin Update Carreras"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'carreras_media');

DROP POLICY IF EXISTS "Admin Delete Carreras" ON storage.objects;
CREATE POLICY "Admin Delete Carreras"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'carreras_media');

DROP POLICY IF EXISTS "Admin Upload Posts" ON storage.objects;
CREATE POLICY "Admin Upload Posts"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'posts_media');

DROP POLICY IF EXISTS "Admin Update Posts" ON storage.objects;
CREATE POLICY "Admin Update Posts"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'posts_media');

DROP POLICY IF EXISTS "Admin Delete Posts" ON storage.objects;
CREATE POLICY "Admin Delete Posts"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'posts_media');

-- ─── BUCKET UI_MEDIA ─────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('ui_media', 'ui_media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Acceso Público Lectura UI" ON storage.objects;
CREATE POLICY "Acceso Público Lectura UI"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'ui_media');

DROP POLICY IF EXISTS "Admin Upload UI" ON storage.objects;
CREATE POLICY "Admin Upload UI"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'ui_media');

DROP POLICY IF EXISTS "Admin Update UI" ON storage.objects;
CREATE POLICY "Admin Update UI"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'ui_media');

DROP POLICY IF EXISTS "Admin Delete UI" ON storage.objects;
CREATE POLICY "Admin Delete UI"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'ui_media');

-- ─── BUCKET GALLERY_MEDIA ─────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery_media', 'gallery_media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Acceso Público Lectura Galería" ON storage.objects;
CREATE POLICY "Acceso Público Lectura Galería"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'gallery_media');

DROP POLICY IF EXISTS "Admin Upload Galería" ON storage.objects;
CREATE POLICY "Admin Upload Galería"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery_media');

DROP POLICY IF EXISTS "Admin Update Galería" ON storage.objects;
CREATE POLICY "Admin Update Galería"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'gallery_media');

DROP POLICY IF EXISTS "Admin Delete Galería" ON storage.objects;
CREATE POLICY "Admin Delete Galería"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'gallery_media');
