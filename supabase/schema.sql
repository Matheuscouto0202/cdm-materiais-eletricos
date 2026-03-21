-- ============================================================
-- CDM Materiais Elétricos — Schema Supabase
--
-- COMO USAR:
-- 1. Acesse seu projeto no Supabase → SQL Editor
-- 2. Cole TODO este conteúdo e clique em "Run"
-- 3. Pronto! Tabela criada com segurança e dados de exemplo.
-- ============================================================


-- ── 1. CRIAR TABELA DE PRODUTOS ──────────────────────────────

CREATE TABLE IF NOT EXISTS produtos (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT        NOT NULL,
  preco       NUMERIC(10,2) NOT NULL CHECK (preco >= 0),
  imagem_url  TEXT,                          -- URL ou caminho relativo da imagem
  descricao   TEXT,                          -- Descrição curta do produto
  categoria   TEXT        NOT NULL DEFAULT 'Geral',
  estoque     BOOLEAN     NOT NULL DEFAULT true,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para buscas por categoria (melhora performance)
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);

-- Índice para ordenação por nome
CREATE INDEX IF NOT EXISTS idx_produtos_nome ON produtos(nome);


-- ── 2. ROW LEVEL SECURITY (RLS) ──────────────────────────────
-- Garante que cada operação só seja permitida para quem tem acesso

ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- Política: qualquer pessoa pode LER os produtos (catálogo público)
CREATE POLICY "Leitura pública de produtos"
  ON produtos
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Política: apenas usuários AUTENTICADOS podem CRIAR produtos
CREATE POLICY "Autenticado pode inserir produtos"
  ON produtos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política: apenas usuários AUTENTICADOS podem EDITAR produtos
CREATE POLICY "Autenticado pode atualizar produtos"
  ON produtos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: apenas usuários AUTENTICADOS podem REMOVER produtos
CREATE POLICY "Autenticado pode deletar produtos"
  ON produtos
  FOR DELETE
  TO authenticated
  USING (true);


-- ── 3. DADOS INICIAIS (produtos de exemplo) ──────────────────

INSERT INTO produtos (nome, preco, imagem_url, descricao, categoria, estoque) VALUES

  -- Disjuntores
  ('Disjuntor Tramontina 1P 6A Curva C',  15.90,
   'assets/images/produtos/disjuntores/disjuntor-unipolar-6a.webp',
   'Disjuntor unipolar 6A curva C, marca Tramontina. Proteção contra sobrecarga e curto-circuito.',
   'Disjuntores', true),

  ('Disjuntor Tramontina 1P 10A Curva C', 18.50,
   'assets/images/produtos/disjuntores/disjuntor-unipolar-10a.webp',
   'Disjuntor unipolar 10A curva C, marca Tramontina. Ideal para circuitos de iluminação.',
   'Disjuntores', true),

  ('Disjuntor Tramontina 1P 16A Curva C', 20.30,
   'assets/images/produtos/disjuntores/disjuntor-unipolar-16a.webp',
   'Disjuntor unipolar 16A curva C, marca Tramontina.',
   'Disjuntores', true),

  ('Disjuntor Tramontina 1P 20A Curva C', 22.50,
   'assets/images/produtos/disjuntores/disjuntor-unipolar-20a.webp',
   'Disjuntor unipolar 20A curva C, marca Tramontina. Ideal para tomadas e chuveiros.',
   'Disjuntores', true),

  ('Disjuntor Tramontina 1P 25A Curva C', 30.00,
   'assets/images/produtos/disjuntores/disjuntor-unipolar-25a.webp',
   'Disjuntor unipolar 25A curva C, marca Tramontina.',
   'Disjuntores', true),

  ('Disjuntor Tramontina 1P 32A Curva C', 33.50,
   'assets/images/produtos/disjuntores/disjuntor-unipolar-32a.webp',
   'Disjuntor unipolar 32A curva C, marca Tramontina. Para circuitos de maior potência.',
   'Disjuntores', true),

  ('Disjuntor Tramontina 1P 40A Curva C', 35.90,
   'assets/images/produtos/disjuntores/disjuntor-unipolar-40a.jpg',
   'Disjuntor unipolar 40A curva C, marca Tramontina.',
   'Disjuntores', true),

  ('Disjuntor Tramontina 1P 50A Curva C', 40.20,
   'assets/images/produtos/disjuntores/disjuntor-unipolar-50a.webp',
   'Disjuntor unipolar 50A curva C, marca Tramontina.',
   'Disjuntores', true),

  ('Disjuntor Tramontina 1P 63A Curva C', 50.00,
   'assets/images/produtos/disjuntores/disjuntor-unipolar-63a.webp',
   'Disjuntor unipolar 63A curva C, marca Tramontina. Para quadros de distribuição.',
   'Disjuntores', true),

  -- Cabos
  ('Cabo Flexível 2,5mm Azul 100m',  189.90,
   'assets/images/produtos/cabos/cabo-25mm-azul.jpg',
   'Cabo flexível de cobre 2,5mm cor azul, rolo com 100 metros. Ideal para instalações residenciais.',
   'Cabos', true),

  ('Cabo Flexível 2,5mm Preto 100m', 189.90,
   'assets/images/produtos/cabos/cabo-25mm-preto.jpg',
   'Cabo flexível de cobre 2,5mm cor preta, rolo com 100 metros.',
   'Cabos', true),

  ('Cabo Flexível 4,0mm 100m',       289.90,
   'assets/images/produtos/cabos/cabo-40mm.jpg',
   'Cabo flexível de cobre 4,0mm, rolo com 100 metros. Para circuitos de maior potência.',
   'Cabos', true),

  -- Lâmpadas
  ('Lâmpada LED 9W E27 Branco Frio',      14.90,
   'assets/images/produtos/lampadas/lampada-led-9w.jpg',
   'Lâmpada LED 9W, base E27, luz branco frio 6500K. Alta eficiência energética.',
   'Lâmpadas', true),

  ('Lâmpada LED 12W E27 Branco Frio',     18.90,
   'assets/images/produtos/lampadas/lampada-led-12w.jpg',
   'Lâmpada LED 12W, base E27, luz branco frio 6500K.',
   'Lâmpadas', true),

  ('Lâmpada LED Tubular T8 18W 120cm',    29.90,
   'assets/images/produtos/lampadas/lampada-tubular-18w.jpg',
   'Lâmpada LED tubular T8 18W, 120cm, bivolt. Substitui fluorescente.',
   'Lâmpadas', true),

  -- Tomadas e Interruptores
  ('Tomada 2P+T 10A Branca',         8.90,
   'assets/images/produtos/tomadas/tomada-2pt-10a.jpg',
   'Tomada padrão brasileiro 2P+T 10A, cor branca.',
   'Tomadas e Interruptores', true),

  ('Interruptor Simples 10A Branco',  7.90,
   'assets/images/produtos/tomadas/interruptor-simples.jpg',
   'Interruptor simples 10A, cor branca. Para acionar pontos de iluminação.',
   'Tomadas e Interruptores', true),

  -- Quadros
  ('Quadro de Distribuição 12 Disjuntores', 89.90,
   'assets/images/produtos/quadros/quadro-12.jpg',
   'Quadro de distribuição para até 12 disjuntores. Com barramento e tampa.',
   'Quadros Elétricos', true);


-- ── 4. VERIFICAÇÃO ───────────────────────────────────────────
-- Rode para confirmar que tudo foi criado corretamente:

-- SELECT * FROM produtos ORDER BY categoria, nome;
-- SELECT COUNT(*) FROM produtos;
