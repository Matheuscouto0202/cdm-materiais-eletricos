/* ============================================================
   CDM Materiais Elétricos — Main
   Inicialização geral, menu mobile, scroll e utilitários de UI
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ── Menu hambúrguer (mobile) ─────────────────────────────────
  const btnHamburger = document.getElementById('btn-hamburger');
  const mobileMenu   = document.getElementById('mobile-menu');

  btnHamburger?.addEventListener('click', function() {
    const aberto = mobileMenu.classList.toggle('open');
    btnHamburger.classList.toggle('active', aberto);
    btnHamburger.setAttribute('aria-expanded', aberto);
  });

  // Fecha o menu ao clicar em qualquer link
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
      btnHamburger?.classList.remove('active');
      btnHamburger?.setAttribute('aria-expanded', false);
    });
  });

  // ── Header com sombra ao rolar ───────────────────────────────
  const header = document.getElementById('header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 10) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // ── Scroll suave para âncoras (links internos #) ─────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const id = this.getAttribute('href').slice(1);
      const alvo = document.getElementById(id);
      if (alvo) {
        e.preventDefault();
        alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Botão "Ver Produtos" do hero ─────────────────────────────
  document.getElementById('btn-ver-produtos')?.addEventListener('click', function() {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  });

  // ── Botão "Finalizar Orçamento" da seção hero/topo ───────────
  document.getElementById('btn-hero-orcamento')?.addEventListener('click', function() {
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
  });

  // ── Lazy loading de imagens (fallback para browsers antigos) ──
  if ('IntersectionObserver' in window) {
    const imgs = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.src = entry.target.dataset.src;
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });
    imgs.forEach(img => observer.observe(img));
  }

  // ── Animação de entrada dos cards de diferenciais ────────────
  if ('IntersectionObserver' in window) {
    const cards = document.querySelectorAll('.diferencial-card, .produto-card');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      observer.observe(card);
    });
  }

  // ── Ano dinâmico no rodapé ───────────────────────────────────
  const anoEl = document.getElementById('ano-atual');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  // ── Rastreamento de PageView (analytics.js) ──────────────────
  if (typeof trackPageView === 'function') trackPageView();

});

// ── Utilitário global: formatar preço na página ──────────────
// Atualiza o total do checkout em tempo real quando o carrinho muda
// (Chamado pelos outros módulos)
function atualizarTotalCheckout() {
  const el = document.getElementById('resumo-total-valor');
  if (el && typeof calcularTotal === 'function') {
    el.textContent = formatarMoeda(calcularTotal());
  }
}
