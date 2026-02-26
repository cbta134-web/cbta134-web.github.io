-- =========================================================
-- MÓDULO DE PRE-REGISTRO - CBTa 134
-- Ejecuta este script en el SQL Editor de Supabase
-- =========================================================

-- ─── TABLA PRINCIPAL DE PRE-REGISTROS ────────────────────
CREATE TABLE IF NOT EXISTS preregistros (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  folio                 TEXT UNIQUE NOT NULL,     -- Folio generado: PRE-AAAA-NNNN

  -- Datos del aspirante
  nombre                TEXT NOT NULL,
  apellido_paterno      TEXT NOT NULL,
  apellido_materno      TEXT NOT NULL,
  curp                  TEXT NOT NULL,
  sexo                  TEXT NOT NULL CHECK (sexo IN ('Masculino','Femenino','Otro')),
  fecha_nacimiento      DATE NOT NULL,
  correo                TEXT NOT NULL,
  estado_civil          TEXT NOT NULL CHECK (estado_civil IN ('Soltero/a','Casado/a','Otro')),
  telefono              TEXT NOT NULL,
  lugar_nacimiento      TEXT NOT NULL,

  -- Domicilio
  domicilio             TEXT NOT NULL,
  colonia               TEXT NOT NULL,
  municipio             TEXT NOT NULL,
  codigo_postal         TEXT NOT NULL,

  -- Carrera elegida
  carrera_id            BIGINT REFERENCES carreras_tecnicas(id),
  carrera_nombre        TEXT NOT NULL,
  segunda_opcion_carrera TEXT,          -- 2ª opción de carrera (opcional)
  tercera_opcion_carrera TEXT,          -- 3ª opción de carrera (opcional)

  -- Procedencia escolar
  escuela_tipo          TEXT NOT NULL CHECK (escuela_tipo IN ('Pública','Privada','Indígena','Comunitaria')),
  escuela_nombre        TEXT NOT NULL,
  escuela_municipio     TEXT NOT NULL,
  promedio_general      NUMERIC(4,2) NOT NULL CHECK (promedio_general BETWEEN 0 AND 10),

  -- Datos del tutor
  tutor_nombre          TEXT NOT NULL,
  tutor_ocupacion       TEXT NOT NULL,
  tutor_curp            TEXT NOT NULL,
  tutor_grado_estudios  TEXT NOT NULL,
  tutor_telefono        TEXT NOT NULL,
  tutor_parentesco      TEXT NOT NULL CHECK (tutor_parentesco IN ('Padre','Madre','Tutor/a','Otro')),

  -- Metadatos
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ÍNDICES ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_preregistros_folio ON preregistros(folio);
CREATE INDEX IF NOT EXISTS idx_preregistros_curp  ON preregistros(curp);
CREATE INDEX IF NOT EXISTS idx_preregistros_created ON preregistros(created_at DESC);

-- ─── FUNCIÓN PARA GENERAR FOLIO AUTOMÁTICO ────────────────
CREATE OR REPLACE FUNCTION generar_folio_preregistro()
RETURNS TRIGGER AS $$
DECLARE
  anio     TEXT := TO_CHAR(NOW(), 'YYYY');
  contador INT;
  nuevo_folio TEXT;
BEGIN
  SELECT COUNT(*) + 1
    INTO contador
    FROM preregistros
   WHERE folio LIKE 'PRE-' || anio || '-%';
  nuevo_folio := 'PRE-' || anio || '-' || LPAD(contador::TEXT, 4, '0');
  NEW.folio := nuevo_folio;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_folio_preregistro
  BEFORE INSERT ON preregistros
  FOR EACH ROW
  WHEN (NEW.folio IS NULL OR NEW.folio = '')
  EXECUTE FUNCTION generar_folio_preregistro();

-- ─── FUNCIÓN PARA updated_at AUTOMÁTICO ──────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_preregistros_updated_at
  BEFORE UPDATE ON preregistros
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─── RLS (Row Level Security) ─────────────────────────────
ALTER TABLE preregistros ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "preregistros_insert_public" ON preregistros;
DROP POLICY IF EXISTS "preregistros_select_admin" ON preregistros;
DROP POLICY IF EXISTS "preregistros_select_by_curp" ON preregistros;
DROP POLICY IF EXISTS "preregistros_update_admin" ON preregistros;
DROP POLICY IF EXISTS "preregistros_delete_admin" ON preregistros;

CREATE POLICY "preregistros_insert_public" ON preregistros FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "preregistros_select_admin" ON preregistros FOR SELECT TO authenticated USING (true);
CREATE POLICY "preregistros_select_by_curp" ON preregistros FOR SELECT TO anon USING (true);
CREATE POLICY "preregistros_update_admin" ON preregistros FOR UPDATE TO authenticated USING (true);
CREATE POLICY "preregistros_delete_admin" ON preregistros FOR DELETE TO authenticated USING (true);

-- ─── VISTA RESUMIDA PARA ADMINISTRACIÓN ──────────────────
CREATE OR REPLACE VIEW v_preregistros_resumen AS
SELECT
  id, folio,
  nombre || ' ' || apellido_paterno || ' ' || apellido_materno AS nombre_completo,
  curp, carrera_nombre, promedio_general, estado_registro, created_at
FROM preregistros
ORDER BY created_at DESC;

COMMENT ON TABLE preregistros IS 'Tabla de pre-registros de aspirantes de nuevo ingreso - CBTa 134';

-- ═══════════════════════════════════════════════════════════
-- CONFIGURACIÓN COMPLETA DEL MÓDULO (LANDING + FORMULARIO)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS preregistro_config (
  id                    INT PRIMARY KEY DEFAULT 1,
  habilitado            BOOLEAN DEFAULT true,

  -- ═══ HERO / ENCABEZADO ═══
  titulo_header         TEXT DEFAULT '¡Tu futuro comienza en el CBTa 134!',
  subtitulo_header      TEXT DEFAULT 'Realiza tu pre-registro en línea de forma rápida y segura.',
  badge_texto           TEXT DEFAULT '📋 Convocatoria Abierta · Ciclo 2025–2026',
  cta_texto             TEXT DEFAULT '¡Pre-Regístrate Ahora!',
  cta_subtexto          TEXT DEFAULT 'Es rápido, gratuito y 100% en línea',

  -- ═══ VIGENCIA / COUNTDOWN ═══
  fecha_cierre          TIMESTAMPTZ DEFAULT '2025-05-01T00:00:00Z',
  mensaje_cierre        TEXT DEFAULT 'Cierre de convocatoria en:',

  -- ═══ TARJETA PRINCIPAL ═══
  card_titulo           TEXT DEFAULT 'Pre-Regístrate',
  card_descripcion      TEXT DEFAULT 'Completa el formulario de pre-registro para aspirantes de nuevo ingreso. Al terminar recibirás tu ficha oficial en PDF lista para imprimir.',
  card_checklist_json   JSONB DEFAULT '["Datos personales y de contacto","Elección de carrera técnica","Datos de escuela de procedencia","Información del padre, madre o tutor","Ficha PDF descargable al instante"]',
  card_boton_texto      TEXT DEFAULT 'Iniciar Pre-Registro →',

  -- ═══ SECCIÓN PASOS ═══
  pasos_titulo          TEXT DEFAULT '¿Cómo funciona?',
  pasos_subtitulo       TEXT DEFAULT 'Sigue estos sencillos pasos para completar tu pre-registro',
  pasos_json            JSONB DEFAULT '[{"num":"01","titulo":"Llena el formulario","desc":"Ingresa tus datos personales, carrera y escuela de procedencia."},{"num":"02","titulo":"Selecciona tu carrera","desc":"Elige la especialidad técnica que más te interese."},{"num":"03","titulo":"Descarga tu ficha","desc":"Obtén tu ficha oficial en PDF con tu folio único."},{"num":"04","titulo":"Preséntate al plantel","desc":"Acude con tu ficha impresa en las fechas indicadas."}]',

  -- ═══ SECCIÓN CARRERAS ═══
  carreras_titulo       TEXT DEFAULT 'Carreras Técnicas Disponibles',
  carreras_subtitulo    TEXT DEFAULT 'Elige la que mejor se adapte a tus intereses y vocación',

  -- ═══ SECCIÓN REQUISITOS ═══
  requisitos_titulo     TEXT DEFAULT '¿Qué necesitas para pre-registrarte?',
  requisitos_subtitulo  TEXT DEFAULT 'Ten a la mano la siguiente información antes de iniciar',
  requisitos_json       JSONB DEFAULT '[{"icon":"🪪","txt":"CURP del aspirante"},{"icon":"📅","txt":"Fecha de nacimiento"},{"icon":"📧","txt":"Correo electrónico (Gmail)"},{"icon":"📞","txt":"Teléfono de contacto (10 dígitos)"},{"icon":"🏫","txt":"Datos de escuela de procedencia"},{"icon":"👨‍👩‍👦","txt":"CURP y datos del padre, madre o tutor"}]',

  -- ═══ CTA FINAL ═══
  cta_final_titulo      TEXT DEFAULT '¿Listo para unirte al CBTa 134?',
  cta_final_subtitulo   TEXT DEFAULT 'El proceso tarda menos de 10 minutos. ¡Hazlo ahora!',
  cta_final_boton       TEXT DEFAULT 'Comenzar Pre-Registro',
  cta_final_boton_sub   TEXT DEFAULT 'Formulario en línea · Ficha PDF inmediata',

  -- ═══ CONVOCATORIA CERRADA ═══
  cerrada_badge         TEXT DEFAULT '🚫 Convocatoria Cerrada',
  cerrada_titulo        TEXT DEFAULT 'El proceso de pre-registro ha finalizado',
  cerrada_mensaje       TEXT DEFAULT 'Gracias por tu interés en el CBTa 134. Mantente pendiente de nuestras redes sociales para próximas convocatorias.',

  -- ═══ FORMULARIO ═══
  form_badge            TEXT DEFAULT 'Nuevo Ingreso 2025–2026',
  form_titulo           TEXT DEFAULT 'Pre-Registro de Aspirantes',
  form_subtitulo        TEXT DEFAULT 'Completa tu pre-registro para obtener tu ficha de inscripción. Es rápido y seguro.',
  indicaciones_ficha    TEXT DEFAULT 'Acude con tu ficha impresa en las fechas indicadas.',

  -- ═══ TARJETA EN PÁGINA PRINCIPAL (HOME) ═══
  home_badge            TEXT DEFAULT 'NUEVO INGRESO 2025',
  home_titulo           TEXT DEFAULT '¡Pre-Regístrate Hoy!',
  home_descripcion      TEXT DEFAULT 'Inicia tu proceso de admisión para el próximo ciclo escolar. Obtén tu ficha oficial de manera fácil y rápida.',
  home_boton            TEXT DEFAULT 'Ir al Pre-Registro →',
  home_icono            TEXT DEFAULT '📝',

  -- ═══ TÍTULOS DE SECCIONES DEL FORMULARIO ═══
  form_titulo_paso1     TEXT DEFAULT '👤 Datos del Aspirante',
  form_titulo_paso2     TEXT DEFAULT '🎓 Carrera Técnica',
  form_desc_paso2       TEXT DEFAULT 'Selecciona la carrera técnica de tu preferencia. Considera tus intereses y vocación.',
  form_titulo_paso3     TEXT DEFAULT '🏫 Escuela de Procedencia',
  form_desc_paso3       TEXT DEFAULT 'Proporciona los datos de la secundaria de la que egresaste o estás por egresar.',
  form_titulo_paso4     TEXT DEFAULT '👨‍👩‍👦 Datos del Tutor / Padre o Madre',
  form_desc_paso4       TEXT DEFAULT 'Proporciona los datos de la persona responsable del aspirante.',
  form_titulo_paso5     TEXT DEFAULT '✅ Confirmación de Datos',
  form_desc_paso5       TEXT DEFAULT 'Revisa que todos tus datos sean correctos antes de enviar.',

  -- ═══ PÁGINA DE ÉXITO ═══
  exito_icono           TEXT DEFAULT '🎉',
  exito_titulo          TEXT DEFAULT '¡Pre-Registro Exitoso!',
  exito_mensaje         TEXT DEFAULT 'Tu pre-registro ha sido recibido. Guarda tu folio y descarga tu ficha.',
  exito_btn_pdf         TEXT DEFAULT '📄 Descargar Ficha PDF',
  exito_btn_inicio      TEXT DEFAULT 'Ir al Inicio',

  -- ═══ STEPPER LABELS ═══
  stepper_json          JSONB DEFAULT '[{"id":1,"label":"Datos Personales","icon":"👤"},{"id":2,"label":"Carrera","icon":"🎓"},{"id":3,"label":"Escuela Origen","icon":"🏫"},{"id":4,"label":"Datos del Tutor","icon":"👨‍👩‍👦"},{"id":5,"label":"Confirmación","icon":"✅"}]',

  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insertar configuración inicial
INSERT INTO preregistro_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ─── Agregar columnas nuevas si la tabla ya existe ───────
DO $$
BEGIN
  -- Hero
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='badge_texto') THEN
    ALTER TABLE preregistro_config ADD COLUMN badge_texto TEXT DEFAULT '📋 Convocatoria Abierta · Ciclo 2025–2026';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='cta_texto') THEN
    ALTER TABLE preregistro_config ADD COLUMN cta_texto TEXT DEFAULT '¡Pre-Regístrate Ahora!';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='cta_subtexto') THEN
    ALTER TABLE preregistro_config ADD COLUMN cta_subtexto TEXT DEFAULT 'Es rápido, gratuito y 100% en línea';
  END IF;

  -- Card
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='card_titulo') THEN
    ALTER TABLE preregistro_config ADD COLUMN card_titulo TEXT DEFAULT 'Pre-Regístrate';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='card_descripcion') THEN
    ALTER TABLE preregistro_config ADD COLUMN card_descripcion TEXT DEFAULT 'Completa el formulario de pre-registro para aspirantes de nuevo ingreso. Al terminar recibirás tu ficha oficial en PDF lista para imprimir.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='card_checklist_json') THEN
    ALTER TABLE preregistro_config ADD COLUMN card_checklist_json JSONB DEFAULT '["Datos personales y de contacto","Elección de carrera técnica","Datos de escuela de procedencia","Información del padre, madre o tutor","Ficha PDF descargable al instante"]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='card_boton_texto') THEN
    ALTER TABLE preregistro_config ADD COLUMN card_boton_texto TEXT DEFAULT 'Iniciar Pre-Registro →';
  END IF;

  -- Pasos section
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='pasos_titulo') THEN
    ALTER TABLE preregistro_config ADD COLUMN pasos_titulo TEXT DEFAULT '¿Cómo funciona?';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='pasos_subtitulo') THEN
    ALTER TABLE preregistro_config ADD COLUMN pasos_subtitulo TEXT DEFAULT 'Sigue estos sencillos pasos para completar tu pre-registro';
  END IF;

  -- Carreras section
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='carreras_titulo') THEN
    ALTER TABLE preregistro_config ADD COLUMN carreras_titulo TEXT DEFAULT 'Carreras Técnicas Disponibles';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='carreras_subtitulo') THEN
    ALTER TABLE preregistro_config ADD COLUMN carreras_subtitulo TEXT DEFAULT 'Elige la que mejor se adapte a tus intereses y vocación';
  END IF;

  -- Requisitos section
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='requisitos_titulo') THEN
    ALTER TABLE preregistro_config ADD COLUMN requisitos_titulo TEXT DEFAULT '¿Qué necesitas para pre-registrarte?';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='requisitos_subtitulo') THEN
    ALTER TABLE preregistro_config ADD COLUMN requisitos_subtitulo TEXT DEFAULT 'Ten a la mano la siguiente información antes de iniciar';
  END IF;

  -- CTA final
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='cta_final_titulo') THEN
    ALTER TABLE preregistro_config ADD COLUMN cta_final_titulo TEXT DEFAULT '¿Listo para unirte al CBTa 134?';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='cta_final_subtitulo') THEN
    ALTER TABLE preregistro_config ADD COLUMN cta_final_subtitulo TEXT DEFAULT 'El proceso tarda menos de 10 minutos. ¡Hazlo ahora!';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='cta_final_boton') THEN
    ALTER TABLE preregistro_config ADD COLUMN cta_final_boton TEXT DEFAULT 'Comenzar Pre-Registro';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='cta_final_boton_sub') THEN
    ALTER TABLE preregistro_config ADD COLUMN cta_final_boton_sub TEXT DEFAULT 'Formulario en línea · Ficha PDF inmediata';
  END IF;

  -- Cerrada
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='cerrada_badge') THEN
    ALTER TABLE preregistro_config ADD COLUMN cerrada_badge TEXT DEFAULT '🚫 Convocatoria Cerrada';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='cerrada_titulo') THEN
    ALTER TABLE preregistro_config ADD COLUMN cerrada_titulo TEXT DEFAULT 'El proceso de pre-registro ha finalizado';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='cerrada_mensaje') THEN
    ALTER TABLE preregistro_config ADD COLUMN cerrada_mensaje TEXT DEFAULT 'Gracias por tu interés en el CBTa 134. Mantente pendiente de nuestras redes sociales para próximas convocatorias.';
  END IF;

  -- Form
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='form_badge') THEN
    ALTER TABLE preregistro_config ADD COLUMN form_badge TEXT DEFAULT 'Nuevo Ingreso 2025–2026';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='form_titulo') THEN
    ALTER TABLE preregistro_config ADD COLUMN form_titulo TEXT DEFAULT 'Pre-Registro de Aspirantes';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='form_subtitulo') THEN
    ALTER TABLE preregistro_config ADD COLUMN form_subtitulo TEXT DEFAULT 'Completa tu pre-registro para obtener tu ficha de inscripción. Es rápido y seguro.';
  END IF;

  -- Home card
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='home_badge') THEN
    ALTER TABLE preregistro_config ADD COLUMN home_badge TEXT DEFAULT 'NUEVO INGRESO 2025';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='home_titulo') THEN
    ALTER TABLE preregistro_config ADD COLUMN home_titulo TEXT DEFAULT '¡Pre-Regístrate Hoy!';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='home_descripcion') THEN
    ALTER TABLE preregistro_config ADD COLUMN home_descripcion TEXT DEFAULT 'Inicia tu proceso de admisión para el próximo ciclo escolar. Obtén tu ficha oficial de manera fácil y rápida.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='home_boton') THEN
    ALTER TABLE preregistro_config ADD COLUMN home_boton TEXT DEFAULT 'Ir al Pre-Registro →';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='home_icono') THEN
    ALTER TABLE preregistro_config ADD COLUMN home_icono TEXT DEFAULT '📝';
  END IF;

  -- Form section titles
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='form_titulo_paso1') THEN
    ALTER TABLE preregistro_config ADD COLUMN form_titulo_paso1 TEXT DEFAULT '👤 Datos del Aspirante';
    ALTER TABLE preregistro_config ADD COLUMN form_titulo_paso2 TEXT DEFAULT '🎓 Carrera Técnica';
    ALTER TABLE preregistro_config ADD COLUMN form_desc_paso2 TEXT DEFAULT 'Selecciona la carrera técnica de tu preferencia.';
    ALTER TABLE preregistro_config ADD COLUMN form_titulo_paso3 TEXT DEFAULT '🏫 Escuela de Procedencia';
    ALTER TABLE preregistro_config ADD COLUMN form_desc_paso3 TEXT DEFAULT 'Proporciona los datos de la secundaria de la que egresaste.';
    ALTER TABLE preregistro_config ADD COLUMN form_titulo_paso4 TEXT DEFAULT '👨‍👩‍👦 Datos del Tutor / Padre o Madre';
    ALTER TABLE preregistro_config ADD COLUMN form_desc_paso4 TEXT DEFAULT 'Proporciona los datos de la persona responsable del aspirante.';
    ALTER TABLE preregistro_config ADD COLUMN form_titulo_paso5 TEXT DEFAULT '✅ Confirmación de Datos';
    ALTER TABLE preregistro_config ADD COLUMN form_desc_paso5 TEXT DEFAULT 'Revisa que todos tus datos sean correctos antes de enviar.';
  END IF;

  -- Success page
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='exito_titulo') THEN
    ALTER TABLE preregistro_config ADD COLUMN exito_icono TEXT DEFAULT '🎉';
    ALTER TABLE preregistro_config ADD COLUMN exito_titulo TEXT DEFAULT '¡Pre-Registro Exitoso!';
    ALTER TABLE preregistro_config ADD COLUMN exito_mensaje TEXT DEFAULT 'Tu pre-registro ha sido recibido. Guarda tu folio y descarga tu ficha.';
    ALTER TABLE preregistro_config ADD COLUMN exito_btn_pdf TEXT DEFAULT '📄 Descargar Ficha PDF';
    ALTER TABLE preregistro_config ADD COLUMN exito_btn_inicio TEXT DEFAULT 'Ir al Inicio';
  END IF;

  -- Stepper
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistro_config' AND column_name='stepper_json') THEN
    ALTER TABLE preregistro_config ADD COLUMN stepper_json JSONB DEFAULT '[{"id":1,"label":"Datos Personales","icon":"👤"},{"id":2,"label":"Carrera","icon":"🎓"},{"id":3,"label":"Escuela Origen","icon":"🏫"},{"id":4,"label":"Datos del Tutor","icon":"👨‍👩‍👦"},{"id":5,"label":"Confirmación","icon":"✅"}]';
  END IF;
END $$;

-- RLS para configuración
ALTER TABLE preregistro_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "config_select_public" ON preregistro_config;
DROP POLICY IF EXISTS "config_update_admin" ON preregistro_config;
CREATE POLICY "config_select_public" ON preregistro_config FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "config_update_admin" ON preregistro_config FOR UPDATE TO authenticated USING (true);

-- ─── MIGRACIÓN: Agregar columnas de 2ª y 3ª opción de carrera ───
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistros' AND column_name='segunda_opcion_carrera') THEN
    ALTER TABLE preregistros ADD COLUMN segunda_opcion_carrera TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='preregistros' AND column_name='tercera_opcion_carrera') THEN
    ALTER TABLE preregistros ADD COLUMN tercera_opcion_carrera TEXT;
  END IF;
END $$;
