-- ============================================================
-- Looks aprobados: pega esto en Supabase > SQL Editor > New query y pulsa Run.
-- Se puede correr más de una vez sin dañar nada.
-- ============================================================

create table if not exists public.looks (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  photo_url text,
  product_id bigint references public.products(id) on delete set null, -- enlace opcional a una prenda
  sort integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.looks enable row level security;

drop policy if exists "ver looks" on public.looks;
create policy "ver looks" on public.looks for select using (active or public.is_admin());
drop policy if exists "admin looks" on public.looks;
create policy "admin looks" on public.looks for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
