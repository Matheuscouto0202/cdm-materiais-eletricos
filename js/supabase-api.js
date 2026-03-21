/* ============================================================
   CDM Materiais Elétricos — API Supabase
   Funções CRUD para a tabela "produtos"

   DEPENDÊNCIA: supabase-config.js deve ser carregado antes
   ============================================================ */

// ── Normaliza o formato do Supabase para o formato do frontend ─
// O Supabase usa "imagem_url"; o frontend usa "imagem"
function normalizarProduto(p) {
  return {
    id:        p.id,
    nome:      p.nome,
    preco:     Number(p.preco),
    imagem:    p.imagem_url || 'assets/images/produto-sem-foto.svg',
    imagem_url: p.imagem_url,
    descricao: p.descricao  || '',
    categoria: p.categoria  || 'Geral',
    estoque:   p.estoque    !== false,
    criado_em: p.criado_em,
  };
}

// ────────────────────────────────────────────────────────────
// BUSCAR
// ────────────────────────────────────────────────────────────

/**
 * Busca todos os produtos do Supabase, ordenados por categoria e nome.
 * @returns {Promise<Array>} lista de produtos normalizados
 */
async function buscarProdutos() {
  if (!dbClient) throw new Error('Supabase não configurado');

  const { data, error } = await dbClient
    .from('produtos')
    .select('*')
    .order('categoria', { ascending: true })
    .order('nome',      { ascending: true });

  if (error) throw error;
  return data.map(normalizarProduto);
}

/**
 * Busca um único produto pelo ID.
 * @param {string} id - UUID do produto
 * @returns {Promise<Object>}
 */
async function buscarProdutoPorId(id) {
  if (!dbClient) throw new Error('Supabase não configurado');

  const { data, error } = await dbClient
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return normalizarProduto(data);
}

/**
 * Busca produtos filtrando por categoria.
 * @param {string} categoria
 * @returns {Promise<Array>}
 */
async function buscarPorCategoria(categoria) {
  if (!dbClient) throw new Error('Supabase não configurado');

  const { data, error } = await dbClient
    .from('produtos')
    .select('*')
    .eq('categoria', categoria)
    .order('nome', { ascending: true });

  if (error) throw error;
  return data.map(normalizarProduto);
}

// ────────────────────────────────────────────────────────────
// ADICIONAR
// ────────────────────────────────────────────────────────────

/**
 * Adiciona um novo produto. Requer usuário autenticado no Supabase.
 *
 * @param {{ nome, preco, imagem_url, descricao, categoria, estoque }} produto
 * @returns {Promise<Object>} produto criado
 *
 * EXEMPLO DE USO:
 * await adicionarProduto({
 *   nome:       'Disjuntor 30A',
 *   preco:      28.90,
 *   imagem_url: 'assets/images/produtos/disjuntores/disj-30a.webp',
 *   descricao:  'Disjuntor unipolar 30A Tramontina',
 *   categoria:  'Disjuntores',
 *   estoque:    true
 * });
 */
async function adicionarProduto(produto) {
  if (!dbClient) throw new Error('Supabase não configurado');

  const { data, error } = await dbClient
    .from('produtos')
    .insert([{
      nome:       produto.nome,
      preco:      produto.preco,
      imagem_url: produto.imagem_url || null,
      descricao:  produto.descricao  || null,
      categoria:  produto.categoria  || 'Geral',
      estoque:    produto.estoque    !== false,
    }])
    .select()
    .single();

  if (error) throw error;
  return normalizarProduto(data);
}

// ────────────────────────────────────────────────────────────
// EDITAR
// ────────────────────────────────────────────────────────────

/**
 * Atualiza um produto existente. Requer usuário autenticado.
 *
 * @param {string} id - UUID do produto
 * @param {Object} campos - somente os campos que deseja atualizar
 * @returns {Promise<Object>} produto atualizado
 *
 * EXEMPLO — atualizar só o preço:
 * await editarProduto('uuid-aqui', { preco: 25.90 });
 *
 * EXEMPLO — marcar como esgotado:
 * await editarProduto('uuid-aqui', { estoque: false });
 */
async function editarProduto(id, campos) {
  if (!dbClient) throw new Error('Supabase não configurado');

  // Mapeia "imagem" do frontend para "imagem_url" do banco
  if (campos.imagem && !campos.imagem_url) {
    campos.imagem_url = campos.imagem;
    delete campos.imagem;
  }

  const { data, error } = await dbClient
    .from('produtos')
    .update(campos)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return normalizarProduto(data);
}

// ────────────────────────────────────────────────────────────
// REMOVER
// ────────────────────────────────────────────────────────────

/**
 * Remove um produto pelo ID. Requer usuário autenticado.
 *
 * @param {string} id - UUID do produto
 * @returns {Promise<void>}
 *
 * EXEMPLO:
 * await removerProduto('uuid-aqui');
 */
async function removerProduto(id) {
  if (!dbClient) throw new Error('Supabase não configurado');

  const { error } = await dbClient
    .from('produtos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ────────────────────────────────────────────────────────────
// UTILITÁRIOS
// ────────────────────────────────────────────────────────────

/**
 * Retorna true se o Supabase está configurado e pronto para uso.
 * @returns {boolean}
 */
function supabaseDisponivel() {
  return !!dbClient;
}
