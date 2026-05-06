create extension if not exists pgcrypto;

drop table if exists orders cascade;
drop table if exists product_sizes cascade;
drop table if exists product_types cascade;
drop table if exists flavors cascade;
drop table if exists fillings cascade;
drop table if exists toppings cascade;

create table product_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  active boolean not null default true,
  created_at timestamp not null default now()
);

create table product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_type_id uuid not null references product_types(id),
  name text not null,
  servings text,
  price numeric(10,2) not null,
  active boolean not null default true,
  created_at timestamp not null default now()
);

create table flavors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  active boolean not null default true,
  created_at timestamp not null default now()
);

create table fillings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  active boolean not null default true,
  created_at timestamp not null default now()
);

create table toppings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  active boolean not null default true,
  created_at timestamp not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  whatsapp text not null,
  product_type_id uuid not null references product_types(id),
  product_size_id uuid not null references product_sizes(id),
  flavor_id uuid not null references flavors(id),
  filling_id uuid not null references fillings(id),
  topping_id uuid not null references toppings(id),
  theme text,
  notes text,
  delivery_date date not null,
  delivery_time time not null,
  street text not null,
  number text not null,
  district text not null,
  city text not null,
  reference text,
  status text not null default 'novo',
  total_price numeric(10,2),
  created_at timestamp not null default now()
);

alter table product_types disable row level security;
alter table product_sizes disable row level security;
alter table flavors disable row level security;
alter table fillings disable row level security;
alter table toppings disable row level security;
alter table orders disable row level security;

insert into product_types (name, slug) values
  ('Naked Cake', 'naked-cake'),
  ('Scrap Cake', 'scrap-cake'),
  ('Chantininho', 'chantininho'),
  ('Tortas', 'tortas'),
  ('Scrap Cake Andar', 'scrap-cake-andar'),
  ('Chantininho Andar', 'chantininho-andar');

with type_map as (
  select id, name from product_types
)
insert into product_sizes (product_type_id, name, servings, price)
select id, size_name, servings, price
from type_map
join (
  values
    ('Naked Cake', 'Bolo 16cm (1 recheio + cobertura)', '10 fatias', 70.00),
    ('Naked Cake', 'Bolo 16cm (2 recheios + cobertura)', '10 fatias', 80.00),
    ('Naked Cake', 'Bolo 18cm (1 recheio + cobertura)', '15 fatias', 85.00),
    ('Naked Cake', 'Bolo 18cm (2 recheios + cobertura)', '15 fatias', 90.00),
    ('Naked Cake', 'Bolo 20cm (1 recheio + cobertura)', '20 fatias', 100.00),
    ('Naked Cake', 'Bolo 20cm (2 recheios + cobertura)', '20 fatias', 115.00),
    ('Naked Cake', 'Bolo 24cm (1 recheio + cobertura)', '30 fatias', 130.00),
    ('Naked Cake', 'Bolo 24cm (2 recheios + cobertura)', '30 fatias', 145.00),
    ('Naked Cake', 'Bolo 28cm (1 recheio + cobertura)', '40 fatias', 170.00),
    ('Naked Cake', 'Bolo 28cm (2 recheios + cobertura)', '40 fatias', 200.00),
    ('Scrap Cake', 'Bolo 16cm (1 recheio + cobertura)', '10 fatias', 85.00),
    ('Scrap Cake', 'Bolo 18cm (1 recheio + cobertura)', '15 fatias', 105.00),
    ('Scrap Cake', 'Bolo 20cm (1 recheio + cobertura)', '20 fatias', 115.00),
    ('Scrap Cake', 'Bolo 24cm (1 recheio + cobertura)', '30 fatias', 145.00),
    ('Scrap Cake', 'Bolo 28cm (1 recheio + cobertura)', '40 fatias', 195.00),
    ('Chantininho', 'Bolo 16cm', '10 fatias', 145.00),
    ('Chantininho', 'Bolo 18cm', '15 fatias', 185.00),
    ('Chantininho', 'Bolo 20cm', '20 fatias', 215.00),
    ('Chantininho', 'Bolo 24cm', '35 fatias', 280.00),
    ('Chantininho', 'Bolo 28cm', '50 fatias', 330.00),
    ('Tortas', 'Torta 20cm', '10 fatias', 40.00),
    ('Tortas', 'Torta 26cm', '20 fatias', 70.00),
    ('Tortas', 'Torta 28cm', '30 fatias', 80.00),
    ('Scrap Cake Andar', 'Bolo 20cm + 16cm', '30 fatias', 200.00),
    ('Scrap Cake Andar', 'Bolo 24cm + 16cm', '45 fatias', 230.00),
    ('Scrap Cake Andar', 'Bolo 20cm + 28cm', '70 fatias', 310.00),
    ('Chantininho Andar', 'Bolo 20cm + 16cm', '30 fatias', 360.00),
    ('Chantininho Andar', 'Bolo 24cm + 16cm', '45 fatias', 425.00),
    ('Chantininho Andar', 'Bolo 20cm + 28cm', '70 fatias', 545.00)
) as source(type_name, size_name, servings, price)
  on source.type_name = type_map.name;

insert into flavors (name) values
  ('Chocolate'),
  ('Ninho'),
  ('Doce de leite'),
  ('Beijinho'),
  ('Castanha');

insert into fillings (name) values
  ('Chocolate'),
  ('Ninho'),
  ('Doce de leite'),
  ('Beijinho'),
  ('Castanha');

insert into toppings (name) values
  ('Chantininho'),
  ('Scrap Cake'),
  ('Naked Cake'),
  ('Cobertura tradicional'),
  ('Tema em papel fotografico'),
  ('Tema 3D a combinar');
