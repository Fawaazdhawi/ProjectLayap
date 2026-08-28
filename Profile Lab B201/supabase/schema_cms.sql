-- ── Task 1: news gets a body field ───────────────────────────────────
alter table public.news add column if not exists content text;

-- ── Task 3a: site_settings (singleton) ────────────────────────────────
create table if not exists public.site_settings (
  id integer primary key default 1,
  constraint single_row check (id = 1),

  logo_url text,
  lab_title text,
  lab_subtitle text,

  about_heading_line1 text,
  about_heading_line2 text,
  about_description text,
  about_background_image text,

  video_heading text,
  video_subtitle text,
  video_url text,
  culture_title text,

  whatwedo_title text,
  whatwedo_description text,

  team_title text,
  team_lecturers_title text,
  team_assistants_title text,
  team_teaching_description text,

  practicum_title text,
  practicum_description text,

  footer_text text,

  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
create policy "site_settings_public_read" on public.site_settings for select using (true);
create policy "site_settings_auth_update" on public.site_settings for update to authenticated using (true) with check (true);

insert into public.site_settings (
  id, logo_url, lab_title, lab_subtitle,
  about_heading_line1, about_heading_line2, about_description, about_background_image,
  video_heading, video_subtitle, video_url, culture_title,
  whatwedo_title, whatwedo_description,
  team_title, team_lecturers_title, team_assistants_title, team_teaching_description,
  practicum_title, practicum_description,
  footer_text
) values (
  1, '/images/logob201.png', 'LAB B201', 'Telematics and Intelligent Multimedia Laboratory',
  'Welcome to', 'B201 Lab',
  'B201 Lab - Telematics and Intelligent Multimedia is a laboratory under the Department of Computer Engineering at ITS that focuses on research and development in telematics, multimedia, deep learning and game technology.',
  '/images/Kondisi_lab1.jpg',
  'About Our Lab', 'Watch the Department of Computer Engineering FTEIC-ITS profile',
  'https://www.youtube.com/embed/pJ7XZRFgeBU', 'Our Culture And Values',
  'What We Do',
  'At Lab B201, we conduct research and development in various areas, including computer networks, multimedia processing, artificial intelligence and deep learning applications, machine learning in health informatics, as well as game technology focusing on computational intelligence and dynamic difficulty adjustment.',
  'Meet our Team', 'Lecturer', 'Lab Assistants',
  'An experienced team of educators in telematics and intelligent multimedia, committed to delivering high-quality education and guiding students in the development of cutting-edge technology.',
  'B201 Practicum',
  'Lab B201 offers two main practicums for students: Advanced Programming Practicum and Database Practicum. Both practicums are conducted during the even semester and are designed to strengthen students'' technical foundation through hands-on learning with practical implementation and problem solving.',
  '© 2025 Lab B201 Profile. All Rights Reserved.'
)
on conflict (id) do nothing;

-- ── Task 3b.1: whatwedo_services ───────────────────────────────────────
create table if not exists public.whatwedo_services (
  id uuid primary key default gen_random_uuid(),
  image text,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);
alter table public.whatwedo_services enable row level security;
create policy "whatwedo_services_public_read" on public.whatwedo_services for select using (true);
create policy "whatwedo_services_auth_insert" on public.whatwedo_services for insert to authenticated with check (true);
create policy "whatwedo_services_auth_update" on public.whatwedo_services for update to authenticated using (true) with check (true);
create policy "whatwedo_services_auth_delete" on public.whatwedo_services for delete to authenticated using (true);

insert into public.whatwedo_services (image, title, description, created_at)
select v.image, v.title, v.description, v.created_at
from (values
  ('/images/App.png', 'Web & App Development', 'We build modern, scalable web and mobile applications using cutting-edge frameworks and technologies, from UI/UX design to full-stack deployment.', now()),
  ('/images/Legion-2.png', 'Game Design & Development', 'Our team develops immersive games with a focus on computational intelligence, procedural generation, and dynamic difficulty adjustment systems.', now() + interval '1 second'),
  ('/images/deep_learning.png', 'Artificial Intelligence & Deep Learning', 'We conduct research in AI and deep learning, applying neural networks to computer vision, natural language processing, and health informatics.', now() + interval '2 seconds'),
  ('/images/Praktikum.png', 'Project & Practicum', 'Students gain hands-on experience through structured practicums covering advanced programming, database systems, and real-world engineering projects.', now() + interval '3 seconds')
) as v(image, title, description, created_at)
where not exists (select 1 from public.whatwedo_services limit 1);

-- ── Task 3b.2: culture_tabs ──────────────────────────────────────────
create table if not exists public.culture_tabs (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  content text,
  image text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.culture_tabs enable row level security;
create policy "culture_tabs_public_read" on public.culture_tabs for select using (true);
create policy "culture_tabs_auth_insert" on public.culture_tabs for insert to authenticated with check (true);
create policy "culture_tabs_auth_update" on public.culture_tabs for update to authenticated using (true) with check (true);
create policy "culture_tabs_auth_delete" on public.culture_tabs for delete to authenticated using (true);

insert into public.culture_tabs (label, content, image, sort_order)
select v.label, v.content, v.image, v.sort_order
from (values
  ('Collaboration', 'Our team is the best of the best. Collaboration isn''t just about working together, but also about working in a structured and efficient manner.', '/images/Kondisi_lab3.jpg', 1),
  ('Innovation', 'Our values on innovation is everything we do. How we provide our services to our clients, our employees and to the people we serve in every way. We believe that innovation is a key to success for every one.', '/images/Kondisi_lab2.jpg', 2),
  ('Advanced Technology', 'Our technology is proof that we are serious. With our sophistication, we can support all elements of society.', '/images/Kondisi_lab1.jpg', 3)
) as v(label, content, image, sort_order)
where not exists (select 1 from public.culture_tabs limit 1);

-- ── Task 3b.3: team_lecturers ──────────────────────────────────────────
create table if not exists public.team_lecturers (
  id uuid primary key default gen_random_uuid(),
  image text,
  name text not null,
  role text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.team_lecturers enable row level security;
create policy "team_lecturers_public_read" on public.team_lecturers for select using (true);
create policy "team_lecturers_auth_insert" on public.team_lecturers for insert to authenticated with check (true);
create policy "team_lecturers_auth_update" on public.team_lecturers for update to authenticated using (true) with check (true);
create policy "team_lecturers_auth_delete" on public.team_lecturers for delete to authenticated using (true);

insert into public.team_lecturers (image, name, role, sort_order)
select v.image, v.name, v.role, v.sort_order
from (values
  ('https://www.its.ac.id/komputer/wp-content/uploads/sites/28/2020/07/197003131995120001_Departemen-Teknik-Komputer-683x1024.jpg', 'Dr. Supeno Mardi Susiki Nugroho, S.T., M.T.', 'Head of Lab B201', 1),
  ('https://www.its.ac.id/komputer/wp-content/uploads/sites/28/2020/07/198504032012121001_Departemen-Teknik-Komputer-682x1024.jpg', 'Reza Fuad Rachmadi, S.T., M.T., Ph.D', 'Lecturer', 2),
  ('https://www.its.ac.id/komputer/wp-content/uploads/sites/28/2022/10/Pak-surya.png', 'Dr. Surya Sumpeno, S.T., M.Sc.', 'Lecturer', 3),
  ('https://www.its.ac.id/komputer/wp-content/uploads/sites/28/2020/07/196912091997031002_Departemen-Teknik-Komputer-1-682x1024.png', 'Mochamad Hariadi, S.T.,M.Sc.,Ph.D', 'Lecturer', 4),
  ('https://www.its.ac.id/komputer/wp-content/uploads/sites/28/2022/10/Pak-ketut.jpg', 'Prof. Dr. I Ketut Eddy Purnama, S.T., M.T.', 'Lecturer', 5),
  ('https://www.its.ac.id/komputer/wp-content/uploads/sites/28/2022/10/bu-susi.png', 'Dr. Susi Juniastuti, S.T.,M.Eng.', 'Lecturer', 6),
  ('https://www.its.ac.id/komputer/wp-content/uploads/sites/28/2023/11/Bakground-Putih.png', 'Arta Kusuma Hernanda, S.T., M.T..', 'Lecturer', 7)
) as v(image, name, role, sort_order)
where not exists (select 1 from public.team_lecturers limit 1);

-- ── Task 3b.4: team_assistants ─────────────────────────────────────────
create table if not exists public.team_assistants (
  id uuid primary key default gen_random_uuid(),
  image text,
  name text not null,
  role text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.team_assistants enable row level security;
create policy "team_assistants_public_read" on public.team_assistants for select using (true);
create policy "team_assistants_auth_insert" on public.team_assistants for insert to authenticated with check (true);
create policy "team_assistants_auth_update" on public.team_assistants for update to authenticated using (true) with check (true);
create policy "team_assistants_auth_delete" on public.team_assistants for delete to authenticated using (true);

insert into public.team_assistants (image, name, role, sort_order)
select v.image, v.name, v.role, v.sort_order
from (values
  ('/images/Anggota.png', 'Lab Assistant', '', 1)
) as v(image, name, role, sort_order)
where not exists (select 1 from public.team_assistants limit 1);

-- ── Task 3b.5: contact_details ─────────────────────────────────────────
create table if not exists public.contact_details (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text,
  icon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.contact_details enable row level security;
create policy "contact_details_public_read" on public.contact_details for select using (true);
create policy "contact_details_auth_insert" on public.contact_details for insert to authenticated with check (true);
create policy "contact_details_auth_update" on public.contact_details for update to authenticated using (true) with check (true);
create policy "contact_details_auth_delete" on public.contact_details for delete to authenticated using (true);

insert into public.contact_details (label, value, icon, sort_order)
select v.label, v.value, v.icon, v.sort_order
from (values
  ('Address', 'Laboratorium B201 Telematika, Departemen Teknik Komputer, Institut Teknologi Sepuluh Nopember, Gedung A, B dan AJ, Kampus ITS Sukolilo, Surabaya, Jawa Timur 60111, ID', '/images/address.png', 1),
  ('Email', 'lab.b201@its.ac.id', '/images/email.png', 2),
  ('Phone', '+62 31 5994251', '/images/phone.png', 3)
) as v(label, value, icon, sort_order)
where not exists (select 1 from public.contact_details limit 1);

-- ── Realtime ───────────────────────────────────────────────────────────
alter publication supabase_realtime add table
  public.whatwedo_services, public.culture_tabs, public.team_lecturers,
  public.team_assistants, public.contact_details;

-- ── Storage buckets + policies ───────────────────────────────────────
insert into storage.buckets (id, name, public) values ('site-settings', 'site-settings', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('whatwedo', 'whatwedo', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('culture', 'culture', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('team', 'team', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('contact', 'contact', true) on conflict (id) do nothing;

create policy "site_settings_bucket_public_read" on storage.objects for select using (bucket_id = 'site-settings');
create policy "site_settings_bucket_auth_insert" on storage.objects for insert to authenticated with check (bucket_id = 'site-settings');
create policy "site_settings_bucket_auth_update" on storage.objects for update to authenticated using (bucket_id = 'site-settings') with check (bucket_id = 'site-settings');
create policy "site_settings_bucket_auth_delete" on storage.objects for delete to authenticated using (bucket_id = 'site-settings');

create policy "whatwedo_bucket_public_read" on storage.objects for select using (bucket_id = 'whatwedo');
create policy "whatwedo_bucket_auth_insert" on storage.objects for insert to authenticated with check (bucket_id = 'whatwedo');
create policy "whatwedo_bucket_auth_update" on storage.objects for update to authenticated using (bucket_id = 'whatwedo') with check (bucket_id = 'whatwedo');
create policy "whatwedo_bucket_auth_delete" on storage.objects for delete to authenticated using (bucket_id = 'whatwedo');

create policy "culture_bucket_public_read" on storage.objects for select using (bucket_id = 'culture');
create policy "culture_bucket_auth_insert" on storage.objects for insert to authenticated with check (bucket_id = 'culture');
create policy "culture_bucket_auth_update" on storage.objects for update to authenticated using (bucket_id = 'culture') with check (bucket_id = 'culture');
create policy "culture_bucket_auth_delete" on storage.objects for delete to authenticated using (bucket_id = 'culture');

create policy "team_bucket_public_read" on storage.objects for select using (bucket_id = 'team');
create policy "team_bucket_auth_insert" on storage.objects for insert to authenticated with check (bucket_id = 'team');
create policy "team_bucket_auth_update" on storage.objects for update to authenticated using (bucket_id = 'team') with check (bucket_id = 'team');
create policy "team_bucket_auth_delete" on storage.objects for delete to authenticated using (bucket_id = 'team');

create policy "contact_bucket_public_read" on storage.objects for select using (bucket_id = 'contact');
create policy "contact_bucket_auth_insert" on storage.objects for insert to authenticated with check (bucket_id = 'contact');
create policy "contact_bucket_auth_update" on storage.objects for update to authenticated using (bucket_id = 'contact') with check (bucket_id = 'contact');
create policy "contact_bucket_auth_delete" on storage.objects for delete to authenticated using (bucket_id = 'contact');
