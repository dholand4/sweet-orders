-- ============================================================
-- DANY RUIVO - BOLOS E TORTAS
-- Execute no SQL Editor do Supabase para recriar as tabelas
-- Os dados devem ser cadastrados manualmente no admin
-- ============================================================

-- Drop tudo na ordem certa
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_decoration_styles CASCADE;
DROP TABLE IF EXISTS product_flavors CASCADE;
DROP TABLE IF EXISTS product_toppings CASCADE;
DROP TABLE IF EXISTS decoration_styles CASCADE;
DROP TABLE IF EXISTS flavor_options CASCADE;
DROP TABLE IF EXISTS product_sizes CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Tabelas legadas (caso existam)
DROP TABLE IF EXISTS product_types CASCADE;
DROP TABLE IF EXISTS flavors CASCADE;
DROP TABLE IF EXISTS fillings CASCADE;
DROP TABLE IF EXISTS toppings CASCADE;

-- ============================================================
-- PRODUTOS
-- ============================================================
CREATE TABLE products (
  id                 uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name               text        NOT NULL,
  type               text        NOT NULL DEFAULT 'bolo'
                                 CHECK (type IN ('bolo', 'torta', 'outro')),
  description        text,
  image_url          text,
  max_flavors        integer     NOT NULL DEFAULT 1 CHECK (max_flavors IN (1, 2)),
  max_toppings       integer     NOT NULL DEFAULT 1 CHECK (max_toppings IN (0, 1, 2)),
  allow_dough_choice boolean     NOT NULL DEFAULT true,
  is_active          boolean     NOT NULL DEFAULT true,
  sort_order         integer     NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TAMANHOS DOS PRODUTOS
-- ============================================================
CREATE TABLE product_sizes (
  id          uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  uuid          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name        text          NOT NULL,
  servings    text,
  price       numeric(10,2) NOT NULL CHECK (price >= 0),
  is_active   boolean       NOT NULL DEFAULT true,
  sort_order  integer       NOT NULL DEFAULT 0,
  created_at  timestamptz   NOT NULL DEFAULT now()
);

-- ============================================================
-- OPÇÕES DE SABOR / RECHEIO / COBERTURA (creme base)
-- ============================================================
CREATE TABLE flavor_options (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text        NOT NULL,
  type        text        NOT NULL DEFAULT 'ambos'
                          CHECK (type IN ('recheio', 'cobertura', 'ambos')),
  description text,
  is_active   boolean     NOT NULL DEFAULT true,
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- ESTILOS DECORATIVOS
-- price_type:
--   included    → sem custo extra
--   fixed_extra → adiciona valor fixo (price_extra)
--   negotiate   → preço a combinar pelo WhatsApp
-- ============================================================
CREATE TABLE decoration_styles (
  id          uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text          NOT NULL,
  price_type  text          NOT NULL DEFAULT 'included'
              CHECK (price_type IN ('included', 'fixed_extra', 'negotiate')),
  price_extra numeric(10,2),
  description text,
  is_active   boolean       NOT NULL DEFAULT true,
  sort_order  integer       NOT NULL DEFAULT 0,
  created_at  timestamptz   NOT NULL DEFAULT now()
);

-- ============================================================
-- RECHEIOS PERMITIDOS POR PRODUTO
-- ============================================================
CREATE TABLE product_flavors (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id        uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  flavor_option_id  uuid NOT NULL REFERENCES flavor_options(id) ON DELETE CASCADE,
  UNIQUE (product_id, flavor_option_id)
);

-- ============================================================
-- COBERTURAS (creme) PERMITIDAS POR PRODUTO
-- ============================================================
CREATE TABLE product_toppings (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id        uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  flavor_option_id  uuid NOT NULL REFERENCES flavor_options(id) ON DELETE CASCADE,
  UNIQUE (product_id, flavor_option_id)
);

-- ============================================================
-- ESTILOS DECORATIVOS PERMITIDOS POR PRODUTO
-- ============================================================
CREATE TABLE product_decoration_styles (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id          uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  decoration_style_id uuid NOT NULL REFERENCES decoration_styles(id) ON DELETE CASCADE,
  UNIQUE (product_id, decoration_style_id)
);

-- ============================================================
-- PEDIDOS
-- topping_1_id        → tipo de cobertura/creme (chantininho, ganache...)
-- topping_flavor_1_id → sabor do creme (chocolate, morango...) — oculto p/ chantininho
-- topping_2_id        → segunda cobertura (quando max_toppings = 2)
-- decoration_style_id → estilo visual (tema padrão, 3D, papel foto...)
-- ============================================================
CREATE TABLE orders (
  id                   uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name        text          NOT NULL,
  whatsapp             text          NOT NULL,
  product_id           uuid          REFERENCES products(id),
  product_size_id      uuid          REFERENCES product_sizes(id),
  flavor_1_id          uuid          REFERENCES flavor_options(id),
  flavor_2_id          uuid          REFERENCES flavor_options(id),
  topping_1_id         uuid          REFERENCES flavor_options(id),
  topping_flavor_1_id  uuid          REFERENCES flavor_options(id),
  topping_2_id         uuid          REFERENCES flavor_options(id),
  decoration_style_id  uuid          REFERENCES decoration_styles(id),
  dough_type           text          CHECK (dough_type IN ('massa_branca', 'massa_chocolate')),
  theme                text,
  notes                text,
  delivery_date        date          NOT NULL,
  delivery_time        text          NOT NULL,
  cep                  text,
  street               text          NOT NULL,
  "number"             text          NOT NULL,
  district             text          NOT NULL,
  city                 text          NOT NULL,
  reference            text,
  status               text          NOT NULL DEFAULT 'novo'
                                     CHECK (status IN ('novo', 'confirmado', 'finalizado', 'cancelado')),
  total_price          numeric(10,2) NOT NULL,
  created_at           timestamptz   NOT NULL DEFAULT now()
);

-- ============================================================
-- DESABILITAR RLS
-- ============================================================
ALTER TABLE products                  DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes             DISABLE ROW LEVEL SECURITY;
ALTER TABLE flavor_options            DISABLE ROW LEVEL SECURITY;
ALTER TABLE decoration_styles         DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_flavors           DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_toppings          DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_decoration_styles DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders                    DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_orders_status               ON orders(status);
CREATE INDEX idx_orders_delivery_date        ON orders(delivery_date);
CREATE INDEX idx_orders_created_at           ON orders(created_at DESC);
CREATE INDEX idx_product_sizes_pid           ON product_sizes(product_id);
CREATE INDEX idx_product_flavors_pid         ON product_flavors(product_id);
CREATE INDEX idx_product_toppings_pid        ON product_toppings(product_id);
CREATE INDEX idx_product_deco_styles_pid     ON product_decoration_styles(product_id);
