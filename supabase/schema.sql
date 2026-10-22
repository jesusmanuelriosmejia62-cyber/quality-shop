-- ============================================================
-- Quality Shop: base de datos
-- Cómo usarlo: en Supabase abre "SQL Editor", pega TODO este archivo y pulsa "Run".
-- Se puede correr más de una vez sin dañar nada.
-- ============================================================

-- ---------- Tablas ----------

-- Categorías, con subcategorías: parent_id apunta a la categoría "madre" (null = categoría principal)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  parent_id uuid references public.categories(id) on delete cascade,
  photo_url text,
  sort integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Prendas
create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  price numeric,                       -- null = "Consultar precio"
  category_id uuid references public.categories(id) on delete set null,
  photos text[] not null default '{}', -- la primera es la principal
  tag text,                            -- "Nuevo", "Más vendido"...
  featured boolean not null default false, -- sale en "Looks aprobados por nosotros"
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Tallas de cada prenda, con su cantidad. Una prenda está agotada cuando todas sus tallas están en 0.
create table if not exists public.product_sizes (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  size text not null,
  stock integer not null default 0 check (stock >= 0),
  unique (product_id, size)
);

-- Colores de cada prenda: cada color tiene su propio circulito (hex) y sus propias fotos
create table if not exists public.product_colors (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  name text not null,
  hex text not null default '#111111',
  photos text[] not null default '{}',
  sort integer not null default 0,
  unique (product_id, name)
);

-- Quiénes son administradores (los dueños)
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- ---------- Quién es administrador ----------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Seguridad: todos pueden VER, solo los administradores pueden CAMBIAR ----------
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_sizes enable row level security;
alter table public.product_colors enable row level security;
alter table public.admins enable row level security;

drop policy if exists "ver categorias" on public.categories;
create policy "ver categorias" on public.categories for select using (active or public.is_admin());
drop policy if exists "admin categorias" on public.categories;
create policy "admin categorias" on public.categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "ver productos" on public.products;
create policy "ver productos" on public.products for select using (active or public.is_admin());
drop policy if exists "admin productos" on public.products;
create policy "admin productos" on public.products for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "ver tallas" on public.product_sizes;
create policy "ver tallas" on public.product_sizes for select using (true);
drop policy if exists "admin tallas" on public.product_sizes;
create policy "admin tallas" on public.product_sizes for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "ver colores" on public.product_colors;
create policy "ver colores" on public.product_colors for select using (true);
drop policy if exists "admin colores" on public.product_colors;
create policy "admin colores" on public.product_colors for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- La tabla admins no se lee ni se cambia desde la página (solo la usa is_admin())

-- ---------- Fotos: carpeta pública "productos" ----------
insert into storage.buckets (id, name, public) values ('productos', 'productos', true)
on conflict (id) do nothing;

drop policy if exists "ver fotos" on storage.objects;
create policy "ver fotos" on storage.objects for select using (bucket_id = 'productos');
drop policy if exists "admin sube fotos" on storage.objects;
create policy "admin sube fotos" on storage.objects for all to authenticated
  using (bucket_id = 'productos' and public.is_admin())
  with check (bucket_id = 'productos' and public.is_admin());

-- ============================================================
-- PASO FINAL (después de crear tu usuario en Authentication > Users):
-- convierte ese usuario en administrador. Cambia el correo por el tuyo y corre solo esta línea:
--
--   insert into public.admins (user_id) select id from auth.users where email = 'tu-correo@gmail.com'
--   on conflict do nothing;
-- ============================================================
