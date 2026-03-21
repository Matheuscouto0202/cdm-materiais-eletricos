/* ============================================================
   CDM Materiais Elétricos — Catálogo de Produtos

   ESTRATÉGIA DE CARREGAMENTO (4 camadas, em ordem):
   1. Supabase API     → fonte principal quando configurado
   2. produtos.json    → fallback local (fetch), salva cache
   3. localStorage     → cache do fetch anterior
   4. PRODUTOS_DATA    → último recurso embutido (produtos-data.js)
   ============================================================ */

let todosProdutos  = [];
let categoriaAtiva = 'Todos';
let termoBusca     = '';

// ── Carregamento ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async function() {
  mostrarSkeleton();

  try {
    todosProdutos = await carregarProdutos();
  } catch (err) {
    mostrarErroCatalogo();
    return;
  }

  renderFiltros();
  renderProdutos();
  iniciarBusca();
});

async function carregarProdutos() {
  // Camada 1: Supabase — fonte principal (quando configurado)
  if (typeof supabaseDisponivel === 'function' && supabaseDisponivel()) {
    try {
      const dados = await buscarProdutos();
      if (dados.length > 0) {
        // Salva cache local para fallback offline
        try { localStorage.setItem('cdm_produtos', JSON.stringify(dados)); } catch {}
        return dados;
      }
    } catch (err) {
      console.warn('[Catálogo] Supabase falhou, tentando fallback:', err.message);
    }
  }

  // Camada 2: fetch do produtos.json — fallback local
  try {
    const res = await fetch('data/produtos.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const dados = await res.json();
    try { localStorage.setItem('cdm_produtos', JSON.stringify(dados)); } catch {}
    return dados;
  } catch {}

  // Camada 3: cache do localStorage (da última busca bem-sucedida)
  try {
    const cached = localStorage.getItem('cdm_produtos');
    if (cached) {
      const dados = JSON.parse(cached);
      if (Array.isArray(dados) && dados.length > 0) return dados;
    }
  } catch {}

  // Camada 4: dados embutidos em produtos-data.js (último recurso)
  if (Array.isArray(window.PRODUTOS_DATA) && window.PRODUTOS_DATA.length > 0) {
    return window.PRODUTOS_DATA;
  }

  throw new Error('Nenhuma fonte de dados disponível');
}

// ── Filtros por categoria ────────────────────────────────────
function renderFiltros() {
  const container = document.getElementById('filtros');
  if (!container) return;

  const categorias = ['Todos', ...new Set(todosProdutos.map(p => p.categoria))];

  container.innerHTML = categorias.map(cat => `
    <button
      class="filtro-btn ${cat === categoriaAtiva ? 'active' : ''}"
      data-categoria="${cat}"
      onclick="selecionarFiltro('${cat}')"
    >${cat}</button>
  `).join('');
}

function selecionarFiltro(categoria) {
  categoriaAtiva = categoria;
  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.categoria === categoria);
  });
  renderProdutos();
}

// ── Busca em tempo real ──────────────────────────────────────
function iniciarBusca() {
  const input = document.getElementById('busca-produto');
  if (!input) return;
  input.addEventListener('input', function() {
    termoBusca = this.value.trim().toLowerCase();
    renderProdutos();
  });
}

// ── Filtrar produtos ─────────────────────────────────────────
function filtrarProdutos() {
  return todosProdutos.filter(p => {
    const matchCategoria = categoriaAtiva === 'Todos' || p.categoria === categoriaAtiva;
    const matchBusca     = p.nome.toLowerCase().includes(termoBusca) ||
                           p.categoria.toLowerCase().includes(termoBusca);
    return matchCategoria && matchBusca;
  });
}

// ── Renderizar grid ──────────────────────────────────────────
function renderProdutos() {
  const grid = document.getElementById('produtos-grid');
  if (!grid) return;

  const produtos = filtrarProdutos();

  if (produtos.length === 0) {
    grid.innerHTML = `
      <div class="sem-resultados">
        <svg width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
        </svg>
        <p>Nenhum produto encontrado para "<strong>${termoBusca || categoriaAtiva}</strong>"</p>
      </div>`;
    return;
  }

  grid.innerHTML = produtos.map(p => criarCardProduto(p)).join('');
}

// ── Card de produto ──────────────────────────────────────────
function criarCardProduto(produto) {
  const semEstoque = !produto.estoque;
  // Serializa o objeto para uso no onclick de forma segura
  const dadosBtn = JSON.stringify(produto).replace(/"/g, '&quot;');

  return `
    <article class="produto-card" data-id="${produto.id}">
      <div class="produto-img-wrapper">
        <img
          src="${produto.imagem}"
          alt="${produto.nome}"
          loading="lazy"
          decoding="async"
          onerror="this.src='assets/images/produto-sem-foto.svg'"
        >
      </div>
      <div class="produto-info">
        <span class="produto-categoria">${produto.categoria}</span>
        <h3 class="produto-nome">${produto.nome}</h3>
        <div class="produto-preco">
          <span class="produto-preco-label">Preço unitário</span><br>
          ${formatarMoeda(produto.preco)}
        </div>
        ${semEstoque ? '<p class="produto-estoque-esgotado">Produto esgotado</p>' : ''}
        <button
          class="btn-add-cart"
          ${semEstoque ? 'disabled' : ''}
          onclick="onAddToCart(${dadosBtn})"
          title="${semEstoque ? 'Produto esgotado' : 'Adicionar ao carrinho'}"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
          </svg>
          ${semEstoque ? 'Esgotado' : 'Adicionar'}
        </button>
      </div>
    </article>`;
}

function onAddToCart(produto) {
  if (!produto.estoque) return;
  adicionarItem(produto);
  mostrarToast(`✓ ${produto.nome} adicionado!`);
}

// ── Skeleton loading ─────────────────────────────────────────
function mostrarSkeleton() {
  const grid = document.getElementById('produtos-grid');
  if (!grid) return;
  grid.innerHTML = Array(8).fill(`
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton skeleton-text" style="margin-top:12px"></div>
      <div class="skeleton skeleton-text short"></div>
      <div class="skeleton skeleton-btn"></div>
    </div>
  `).join('');
}

// ── Erro de carregamento ─────────────────────────────────────
function mostrarErroCatalogo() {
  const grid = document.getElementById('produtos-grid');
  if (!grid) return;
  grid.innerHTML = `
    <div class="sem-resultados" style="grid-column:1/-1">
      <svg width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
      </svg>
      <p>Não foi possível carregar o catálogo.<br>
         <small>Abra com Live Server no VSCode ou publique no Netlify.</small></p>
    </div>`;
}
