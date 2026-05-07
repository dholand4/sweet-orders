-- ============================================================
-- DANY RUIVO - BOLOS E TORTAS
-- Schema completo - execute no SQL Editor do Supabase
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
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text        NOT NULL,
  type          text        NOT NULL DEFAULT 'bolo'
                            CHECK (type IN ('bolo', 'torta', 'outro')),
  description   text,
  image_url     text,
  max_flavors   integer     NOT NULL DEFAULT 1 CHECK (max_flavors IN (1, 2)),
  max_toppings  integer     NOT NULL DEFAULT 1 CHECK (max_toppings IN (0, 1, 2)),
  allow_dough_choice boolean NOT NULL DEFAULT true,
  is_active     boolean     NOT NULL DEFAULT true,
  sort_order    integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TAMANHOS DOS PRODUTOS
-- ============================================================
CREATE TABLE product_sizes (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  uuid        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name        text        NOT NULL,
  servings    text,
  price       numeric(10,2) NOT NULL CHECK (price >= 0),
  is_active   boolean     NOT NULL DEFAULT true,
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
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
-- ESTILOS DECORATIVOS (tema, acabamento visual + preço)
-- ============================================================
CREATE TABLE decoration_styles (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text        NOT NULL,
  -- included: sem custo extra
  -- fixed_extra: adiciona valor fixo ao pedido
  -- negotiate: preço a combinar com a confeiteira
  price_type  text        NOT NULL DEFAULT 'included'
              CHECK (price_type IN ('included', 'fixed_extra', 'negotiate')),
  price_extra numeric(10,2),
  description text,
  is_active   boolean     NOT NULL DEFAULT true,
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RECHEIOS PERMITIDOS POR PRODUTO (junção)
-- ============================================================
CREATE TABLE product_flavors (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id        uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  flavor_option_id  uuid NOT NULL REFERENCES flavor_options(id) ON DELETE CASCADE,
  UNIQUE (product_id, flavor_option_id)
);

-- ============================================================
-- COBERTURAS (creme) PERMITIDAS POR PRODUTO (junção)
-- ============================================================
CREATE TABLE product_toppings (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id        uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  flavor_option_id  uuid NOT NULL REFERENCES flavor_options(id) ON DELETE CASCADE,
  UNIQUE (product_id, flavor_option_id)
);

-- ============================================================
-- ESTILOS DECORATIVOS PERMITIDOS POR PRODUTO (junção)
-- ============================================================
CREATE TABLE product_decoration_styles (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id          uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  decoration_style_id uuid NOT NULL REFERENCES decoration_styles(id) ON DELETE CASCADE,
  UNIQUE (product_id, decoration_style_id)
);

-- ============================================================
-- PEDIDOS
-- ============================================================
CREATE TABLE orders (
  id                  uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name       text          NOT NULL,
  whatsapp            text          NOT NULL,
  product_id          uuid          REFERENCES products(id),
  product_size_id     uuid          REFERENCES product_sizes(id),
  flavor_1_id         uuid          REFERENCES flavor_options(id),
  flavor_2_id         uuid          REFERENCES flavor_options(id),
  topping_1_id        uuid          REFERENCES flavor_options(id),
  topping_2_id        uuid          REFERENCES flavor_options(id),
  decoration_style_id uuid          REFERENCES decoration_styles(id),
  dough_type          text          CHECK (dough_type IN ('massa_branca', 'massa_chocolate')),
  theme               text,
  notes               text,
  delivery_date       date          NOT NULL,
  delivery_time       text          NOT NULL,
  cep                 text,
  street              text          NOT NULL,
  "number"            text          NOT NULL,
  district            text          NOT NULL,
  city                text          NOT NULL,
  reference           text,
  status              text          NOT NULL DEFAULT 'novo'
                                    CHECK (status IN ('novo', 'confirmado', 'finalizado', 'cancelado')),
  total_price         numeric(10,2) NOT NULL,
  created_at          timestamptz   NOT NULL DEFAULT now()
);

-- ============================================================
-- DESABILITAR RLS
-- ============================================================
ALTER TABLE products                 DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes            DISABLE ROW LEVEL SECURITY;
ALTER TABLE flavor_options           DISABLE ROW LEVEL SECURITY;
ALTER TABLE decoration_styles        DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_flavors          DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_toppings         DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_decoration_styles DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders                   DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_orders_status              ON orders(status);
CREATE INDEX idx_orders_delivery_date       ON orders(delivery_date);
CREATE INDEX idx_orders_created_at          ON orders(created_at DESC);
CREATE INDEX idx_product_sizes_pid          ON product_sizes(product_id);
CREATE INDEX idx_product_flavors_pid        ON product_flavors(product_id);
CREATE INDEX idx_product_toppings_pid       ON product_toppings(product_id);
CREATE INDEX idx_product_deco_styles_pid    ON product_decoration_styles(product_id);

-- ============================================================
-- DADOS INICIAIS
-- ============================================================
DO $$
DECLARE
  -- Recheios
  choc_id       uuid := gen_random_uuid();
  ninho_id      uuid := gen_random_uuid();
  doce_id       uuid := gen_random_uuid();
  beij_id       uuid := gen_random_uuid();
  cast_id       uuid := gen_random_uuid();
  mora_id       uuid := gen_random_uuid();
  limao_id      uuid := gen_random_uuid();
  red_id        uuid := gen_random_uuid();
  -- Coberturas (creme base)
  chanti_cob_id uuid := gen_random_uuid();
  ganache_id    uuid := gen_random_uuid();
  brig_cob_id   uuid := gen_random_uuid();
  -- Estilos decorativos
  deco_classic_id uuid := gen_random_uuid();
  deco_padrao_id  uuid := gen_random_uuid();
  deco_foto_id    uuid := gen_random_uuid();
  deco_3d_id      uuid := gen_random_uuid();
  -- Produtos
  naked_id      uuid := gen_random_uuid();
  scrap_id      uuid := gen_random_uuid();
  chanti_id     uuid := gen_random_uuid();
  chanti2_id    uuid := gen_random_uuid();
  scrap2_id     uuid := gen_random_uuid();
  torta_id      uuid := gen_random_uuid();
BEGIN

  -- ── Sabores / Recheios ──────────────────────────────────────
  INSERT INTO flavor_options (id, name, type, sort_order) VALUES
    (choc_id,       'Chocolate',        'ambos',     1),
    (ninho_id,      'Ninho',            'ambos',     2),
    (doce_id,       'Doce de Leite',    'ambos',     3),
    (beij_id,       'Beijinho',         'ambos',     4),
    (cast_id,       'Castanha',         'ambos',     5),
    (mora_id,       'Morango',          'ambos',     6),
    (limao_id,      'Limão',            'ambos',     7),
    (red_id,        'Red Velvet',       'ambos',     8),
    (chanti_cob_id, 'Chantininho',      'cobertura', 10),
    (ganache_id,    'Ganache de Chocolate', 'cobertura', 11),
    (brig_cob_id,   'Brigadeiro',       'cobertura', 12);

  -- ── Estilos decorativos ─────────────────────────────────────
  -- price_type: included / fixed_extra / negotiate
  INSERT INTO decoration_styles (id, name, price_type, price_extra, description, sort_order) VALUES
    (deco_classic_id, 'Clássico / Sem tema',    'included',    NULL,  'Acabamento simples e elegante, sem tema personalizado.', 1),
    (deco_padrao_id,  'Tema Padrão',            'fixed_extra', 10.00, 'Decoração com tema simples: nome, balões ou detalhes básicos.', 2),
    (deco_foto_id,    'Papel Fotográfico',      'fixed_extra', 25.00, 'Impressão em papel fotográfico comestível com o tema escolhido.', 3),
    (deco_3d_id,      'Tema 3D Elaborado',      'negotiate',   NULL,  'Decoração 3D artesanal — o valor é combinado conforme o projeto.', 4);

  -- ── Produtos ────────────────────────────────────────────────
  INSERT INTO products (id, name, type, description, max_flavors, max_toppings, allow_dough_choice, sort_order) VALUES
    (naked_id,   'Naked Cake',            'bolo', 'Bolo semi pelado com frutas e flores, elegante e sofisticado.',               2, 1, true,  1),
    (scrap_id,   'Scrap Cake',            'bolo', 'Bolo decorado com camadas e texturas de pasta americana.',                    2, 1, true,  2),
    (chanti_id,  'Chantininho',           'bolo', 'Bolo coberto com creme de chantininho, suave e irresistível.',                2, 1, true,  3),
    (chanti2_id, 'Chantininho 2 Andares', 'bolo', 'Bolo de dois andares coberto com chantininho, perfeito para grandes festas.', 2, 1, true,  4),
    (scrap2_id,  'Scrap Cake 2 Andares',  'bolo', 'Bolo de dois andares com decoração artesanal em scrap cake.',                2, 1, true,  5),
    (torta_id,   'Torta Gelada',          'torta','Torta gelada cremosa com base de biscoito, refrescante e deliciosa.',         1, 0, false, 6);

  -- ── Tamanhos ────────────────────────────────────────────────
  INSERT INTO product_sizes (product_id, name, servings, price, sort_order) VALUES
    (naked_id,   '15cm',    '10 a 15 fatias', 120.00, 1),
    (naked_id,   '20cm',    '20 a 25 fatias', 165.00, 2),
    (naked_id,   '25cm',    '35 a 40 fatias', 230.00, 3),
    (scrap_id,   '15cm',    '10 a 15 fatias', 135.00, 1),
    (scrap_id,   '20cm',    '20 a 25 fatias', 185.00, 2),
    (scrap_id,   '25cm',    '35 a 40 fatias', 260.00, 3),
    (chanti_id,  '15cm',    '10 a 15 fatias', 110.00, 1),
    (chanti_id,  '20cm',    '20 a 25 fatias', 155.00, 2),
    (chanti_id,  '25cm',    '35 a 40 fatias', 210.00, 3),
    (chanti2_id, '20+15cm', '30 a 35 fatias', 290.00, 1),
    (chanti2_id, '25+20cm', '50 a 55 fatias', 395.00, 2),
    (scrap2_id,  '20+15cm', '30 a 35 fatias', 320.00, 1),
    (scrap2_id,  '25+20cm', '50 a 55 fatias', 430.00, 2),
    (torta_id,   'Pequena', '6 a 8 fatias',    75.00, 1),
    (torta_id,   'Média',   '10 a 12 fatias', 115.00, 2),
    (torta_id,   'Grande',  '18 a 20 fatias', 165.00, 3);

  -- ── Recheios vinculados ──────────────────────────────────────
  INSERT INTO product_flavors (product_id, flavor_option_id) VALUES
    (naked_id,   choc_id),(naked_id,   ninho_id),(naked_id,   doce_id),
    (naked_id,   beij_id),(naked_id,   cast_id), (naked_id,   mora_id),
    (naked_id,   limao_id),(naked_id,  red_id),
    (scrap_id,   choc_id),(scrap_id,   ninho_id),(scrap_id,   doce_id),
    (scrap_id,   beij_id),(scrap_id,   cast_id), (scrap_id,   mora_id),
    (scrap_id,   limao_id),(scrap_id,  red_id),
    (chanti_id,  choc_id),(chanti_id,  ninho_id),(chanti_id,  doce_id),
    (chanti_id,  beij_id),(chanti_id,  cast_id), (chanti_id,  mora_id),
    (chanti_id,  limao_id),(chanti_id, red_id),
    (chanti2_id, choc_id),(chanti2_id, ninho_id),(chanti2_id, doce_id),
    (chanti2_id, beij_id),(chanti2_id, cast_id), (chanti2_id, mora_id),
    (chanti2_id, limao_id),(chanti2_id,red_id),
    (scrap2_id,  choc_id),(scrap2_id,  ninho_id),(scrap2_id,  doce_id),
    (scrap2_id,  beij_id),(scrap2_id,  cast_id), (scrap2_id,  mora_id),
    (scrap2_id,  limao_id),(scrap2_id, red_id),
    (torta_id,   choc_id),(torta_id,   ninho_id),(torta_id,   doce_id),
    (torta_id,   mora_id),(torta_id,   limao_id);

  -- ── Coberturas (creme) vinculadas ────────────────────────────
  INSERT INTO product_toppings (product_id, flavor_option_id) VALUES
    (naked_id,   chanti_cob_id),(naked_id,   ganache_id),
    (scrap_id,   chanti_cob_id),(scrap_id,   ganache_id),(scrap_id,   brig_cob_id),
    (chanti_id,  chanti_cob_id),(chanti_id,  ganache_id),
    (chanti2_id, chanti_cob_id),(chanti2_id, ganache_id),
    (scrap2_id,  chanti_cob_id),(scrap2_id,  ganache_id),(scrap2_id,  brig_cob_id);

  -- ── Estilos decorativos vinculados ───────────────────────────
  -- Bolos aceitam todos os estilos
  INSERT INTO product_decoration_styles (product_id, decoration_style_id) VALUES
    (naked_id,   deco_classic_id),(naked_id,   deco_padrao_id),(naked_id,   deco_foto_id),(naked_id,   deco_3d_id),
    (scrap_id,   deco_classic_id),(scrap_id,   deco_padrao_id),(scrap_id,   deco_foto_id),(scrap_id,   deco_3d_id),
    (chanti_id,  deco_classic_id),(chanti_id,  deco_padrao_id),(chanti_id,  deco_foto_id),(chanti_id,  deco_3d_id),
    (chanti2_id, deco_classic_id),(chanti2_id, deco_padrao_id),(chanti2_id, deco_foto_id),(chanti2_id, deco_3d_id),
    (scrap2_id,  deco_classic_id),(scrap2_id,  deco_padrao_id),(scrap2_id,  deco_foto_id),(scrap2_id,  deco_3d_id);
  -- Torta não tem estilo decorativo (max_toppings = 0)

END $$;
