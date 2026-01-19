-- SQL: Portal Docente (Maestros) - Tablas, políticas públicas y ejemplos

-- 1) Tablas
create table if not exists public.teachers_config (
  id bigserial primary key,
  title text,
  subtitle text,
  hero_image_url text,
  cta_label text,
  created_at timestamptz default now()
);

create table if not exists public.teachers_links (
  id bigserial primary key,
  name text not null,
  description text,
  icon text,
  url text not null,
  color text,
  order_index integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 2) Habilitar RLS
alter table public.teachers_config enable row level security;
alter table public.teachers_links enable row level security;

-- 3) Lectura pública (sin auth)
drop policy if exists "public read teachers_config" on public.teachers_config;
create policy "public read teachers_config"
  on public.teachers_config
  for select
  using (true);

drop policy if exists "public read teachers_links" on public.teachers_links;
create policy "public read teachers_links"
  on public.teachers_links
  for select
  using (true);

-- 4) Escritura solo autenticados (para EduPanel)
drop policy if exists "authenticated insert teachers_config" on public.teachers_config;
create policy "authenticated insert teachers_config"
  on public.teachers_config
  for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "authenticated update teachers_config" on public.teachers_config;
create policy "authenticated update teachers_config"
  on public.teachers_config
  for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "authenticated delete teachers_config" on public.teachers_config;
create policy "authenticated delete teachers_config"
  on public.teachers_config
  for delete
  using (auth.role() = 'authenticated');

drop policy if exists "authenticated insert teachers_links" on public.teachers_links;
create policy "authenticated insert teachers_links"
  on public.teachers_links
  for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "authenticated update teachers_links" on public.teachers_links;
create policy "authenticated update teachers_links"
  on public.teachers_links
  for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "authenticated delete teachers_links" on public.teachers_links;
create policy "authenticated delete teachers_links"
  on public.teachers_links
  for delete
  using (auth.role() = 'authenticated');

-- 5) Datos de ejemplo (opcionales)
insert into public.teachers_config (title, subtitle, hero_image_url, cta_label)
values (
  '👨‍🏫 Portal Docente',
  'Gestiona los recursos educativos y el control de alumnos de la institución.',
  '/images/maestros-hero.png',
  '⚙️ Panel Administrativo (Ingresar)'
);

insert into public.teachers_links (name, description, icon, url, color, order_index, is_active)
values
  ('Cuadernillos', 'Planeación didáctica y recursos educativos', '📚', 'http://www.planeaciondidactica.sems.gob.mx/login', '#007bff', 1, true),
  ('SISEEMS', 'Sistema de Evaluación y Seguimiento', '📊', 'http://168.255.121.25/develop/index.php?', '#28a745', 2, true),
  ('Talón de Pago', 'Portal de autoservicios SEMS', '💰', 'https://portalautoservicios-sems.sep.gob.mx/login.jsp', '#ffc107', 3, true),
  ('DGETAYCM México', 'Dirección General de Educación Tecnológica Agropecuaria y Ciencias del Mar', '🏛️', 'https://dgetaycm.sep.gob.mx/', '#dc3545', 4, true),
  ('SEP Tlaxcala', 'Secretaría de Educación Pública Tlaxcala', '🏢', 'https://www.septlaxcala.gob.mx', '#6f42c1', 5, true),
  ('Oficina Virtual ISSSTE', 'Instituto de Seguridad y Servicios Sociales', '🏥', 'https://oficinavirtual.issste.gob.mx/', '#20c997', 6, true);

-- 6) Ejemplos de actualización y eliminación
-- Actualizar un recurso por ID
-- update public.teachers_links set name = 'Nuevo nombre', url = 'https://nuevo-url.com' where id = 1;

-- Ocultar un recurso sin borrarlo
-- update public.teachers_links set is_active = false where id = 1;

-- Eliminar un recurso
-- delete from public.teachers_links where id = 1;
