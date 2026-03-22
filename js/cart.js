/* ============================================================
   CDM Materiais Elétricos — Carrinho de Compras
   Persiste o estado no localStorage ('cdm_cart')
   ============================================================ */

const CART_KEY = 'cdm_cart';

// ── Estado do carrinho (carregado do localStorage) ───────────
let carrinho = carregarCarrinho();

/** Carrega o carrinho salvo no navegador. */
function carregarCarrinho() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

/** Salva o estado atual no localStorage. */
function salvarCarrinho() {
  localStorage.setItem(CART_KEY, JSON.stringify(carrinho));
}

/**
 * Adiciona um produto ao carrinho.
 * Se já existir, incrementa a quantidade em 1.
 * @param {{ id, nome, preco, imagem, categoria }} produto
 */
function adicionarItem(produto) {
  const existente = carrinho.find(item => item.id === produto.id);
  if (existente) {
    existente.qty += 1;
  } else {
    carrinho.push({
      id:        produto.id,
      nome:      produto.nome,
      preco:     produto.preco,
      imagem:    produto.imagem,
      categoria: produto.categoria,
      qty:       1,
    });
  }
  salvarCarrinho();
  renderCarrinho();
  atualizarBadge();
  animarBadge();

  // Rastreamento
  if (typeof trackAddToCart === 'function') trackAddToCart(produto);
}

/**
 * Remove completamente um item do carrinho pelo id.
 * @param {string} id
 */
function removerItem(id) {
  carrinho = carrinho.filter(item => item.id !== id);
  salvarCarrinho();
  renderCarrinho();
  atualizarBadge();
}

/**
 * Atualiza a quantidade de um item. Se qty <= 0, remove o item.
 * @param {string} id
 * @param {number} qty
 */
function atualizarQtd(id, qty) {
  if (qty <= 0) { removerItem(id); return; }
  const item = carrinho.find(i => i.id === id);
  if (item) { item.qty = qty; salvarCarrinho(); renderCarrinho(); }
}

/** Esvazia todo o carrinho. */
function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
  renderCarrinho();
  atualizarBadge();
}

/**
 * Retorna o valor total do carrinho.
 * @returns {number}
 */
function calcularTotal() {
  return carrinho.reduce((acc, item) => acc + item.preco * item.qty, 0);
}

/**
 * Retorna a quantidade total de itens (somando qtds).
 * @returns {number}
 */
function totalItens() {
  return carrinho.reduce((acc, item) => acc + item.qty, 0);
}

// ── Atualização do badge no header ──────────────────────────
function atualizarBadge() {
  const badge = document.querySelector('.cart-badge');
  if (!badge) return;
  const total = totalItens();
  if (total > 0) {
    badge.textContent = total > 99 ? '99+' : total;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }

  // Atualiza também o label de contagem no header do sidebar
  const countLabel = document.querySelector('.cart-count-label');
  if (countLabel) countLabel.textContent = `${total} ${total === 1 ? 'item' : 'itens'}`;

  // Botão flutuante "Ver Carrinho"
  const btnFlutuante = document.getElementById('btn-ver-carrinho-flutuante');
  const badgeFlutuante = document.getElementById('btn-ver-carrinho-badge');
  if (btnFlutuante) btnFlutuante.style.display = total > 0 ? 'flex' : 'none';
  if (badgeFlutuante) badgeFlutuante.textContent = total > 99 ? '99+' : total;
}

function animarBadge() {
  const badge = document.querySelector('.cart-badge');
  if (!badge) return;
  badge.classList.remove('cart-badge-animate');
  void badge.offsetWidth; // reflow para reiniciar animação
  badge.classList.add('cart-badge-animate');
}

// ── Renderização da sidebar do carrinho ──────────────────────

/**
 * Renderiza a lista de itens e o total dentro da sidebar.
 * Também sincroniza o resumo no formulário de checkout.
 */
function renderCarrinho() {
  renderSidebar();
  renderResumoCheckout();
}

function renderSidebar() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  if (carrinho.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <svg width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
        </svg>
        <p>Seu carrinho está vazio</p>
        <small>Adicione produtos do catálogo</small>
      </div>`;
    // Desabilita botões do footer
    const btnIr = document.getElementById('btn-ir-checkout');
    const btnLimpar = document.getElementById('btn-limpar');
    if (btnIr) btnIr.disabled = true;
    if (btnLimpar) btnLimpar.disabled = true;
    return;
  }

  // Habilita botões
  const btnIr = document.getElementById('btn-ir-checkout');
  const btnLimpar = document.getElementById('btn-limpar');
  if (btnIr) btnIr.disabled = false;
  if (btnLimpar) btnLimpar.disabled = false;

  container.innerHTML = carrinho.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img class="cart-item-img"
           src="${item.imagem}"
           alt="${item.nome}"
           onerror="this.src='assets/images/produto-sem-foto.svg'">
      <div class="cart-item-info">
        <div class="cart-item-nome">${item.nome}</div>
        <div class="cart-item-preco-unit">${formatarMoeda(item.preco)} / un.</div>
        <div class="cart-item-subtotal">${formatarMoeda(item.preco * item.qty)}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="atualizarQtd('${item.id}', ${item.qty - 1})" title="Diminuir">−</button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-btn" onclick="atualizarQtd('${item.id}', ${item.qty + 1})" title="Aumentar">+</button>
        <button class="qty-btn remove" onclick="removerItem('${item.id}')" title="Remover">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  // Atualiza total no footer (ambos os elementos)
  const totalFormatado = formatarMoeda(calcularTotal());
  const totalEl  = document.getElementById('cart-total-valor');
  const totalEl2 = document.getElementById('cart-total-valor-2');
  if (totalEl)  totalEl.textContent  = totalFormatado;
  if (totalEl2) totalEl2.textContent = totalFormatado;
}

/** Renderiza o resumo do carrinho no painel de checkout */
function renderResumoCheckout() {
  const container = document.getElementById('resumo-items');
  const totalEl   = document.getElementById('resumo-total-valor');
  if (!container) return;

  if (carrinho.length === 0) {
    container.innerHTML = `
      <div class="checkout-vazio">
        <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75"/>
        </svg>
        <p>Nenhum produto no carrinho</p>
      </div>`;
    if (totalEl) totalEl.textContent = formatarMoeda(0);
    return;
  }

  container.innerHTML = carrinho.map(item => `
    <div class="resumo-item">
      <img class="resumo-item-img"
           src="${item.imagem}"
           alt="${item.nome}"
           onerror="this.src='assets/images/produto-sem-foto.svg'">
      <div class="resumo-item-info">
        <div class="resumo-item-nome">${item.nome}</div>
        <div class="resumo-item-qtd">Qtd: ${item.qty}</div>
      </div>
      <div class="resumo-item-preco">${formatarMoeda(item.preco * item.qty)}</div>
    </div>
  `).join('');

  if (totalEl) totalEl.textContent = formatarMoeda(calcularTotal());
}

// ── Controles de abrir/fechar a sidebar ─────────────────────
function abrirCarrinho() {
  document.getElementById('cart-sidebar')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharCarrinho() {
  document.getElementById('cart-sidebar')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Inicialização ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  // Renderiza o estado inicial (itens salvos no localStorage)
  renderCarrinho();
  atualizarBadge();

  // Botão abrir carrinho (header)
  document.getElementById('btn-carrinho')?.addEventListener('click', abrirCarrinho);

  // Fechar ao clicar no X
  document.getElementById('btn-close-cart')?.addEventListener('click', fecharCarrinho);

  // Fechar ao clicar no overlay
  document.getElementById('cart-overlay')?.addEventListener('click', fecharCarrinho);

  // Limpar carrinho
  document.getElementById('btn-limpar')?.addEventListener('click', function() {
    if (confirm('Deseja remover todos os itens do carrinho?')) {
      limparCarrinho();
    }
  });

  // Ir para checkout (scroll até a seção)
  document.getElementById('btn-ir-checkout')?.addEventListener('click', function() {
    fecharCarrinho();
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
    if (typeof trackInitiateCheckout === 'function') {
      trackInitiateCheckout({ itens: carrinho, total: calcularTotal() });
    }
  });
});
