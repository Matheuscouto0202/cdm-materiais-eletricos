/* ============================================================
   CDM Materiais Elétricos — Analytics e Rastreamento
   Meta Pixel | Google Analytics 4 | Google Tag Manager

   ⚠️  CONFIGURAÇÃO NECESSÁRIA:
   Substitua os IDs abaixo pelos seus antes de publicar o site.
   ============================================================ */

// ── IDs de configuração ──────────────────────────────────────
// 1. Meta Pixel: acesse business.facebook.com → Gerenciador de Eventos
const META_PIXEL_ID = 'SEU_PIXEL_ID'; // Ex: '1234567890123456'

// 2. Google Analytics 4: acesse analytics.google.com → Administrador → Streams de dados
const GA4_ID = 'SEU_GA4_ID'; // Ex: 'G-XXXXXXXXXX'

// 3. Google Tag Manager: acesse tagmanager.google.com → seu container
const GTM_ID = 'SEU_GTM_ID'; // Ex: 'GTM-XXXXXXX'

// ── Flags de controle ────────────────────────────────────────
// Define se os IDs reais foram configurados
const pixelAtivo = META_PIXEL_ID !== 'SEU_PIXEL_ID';
const ga4Ativo   = GA4_ID        !== 'SEU_GA4_ID';
const gtmAtivo   = GTM_ID        !== 'SEU_GTM_ID';

// ── Inicialização do Meta Pixel ──────────────────────────────
(function initMetaPixel() {
  if (!pixelAtivo) return;

  /* Código base do Meta Pixel — NÃO EDITAR */
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
})();

// ── Inicialização do Google Analytics 4 ─────────────────────
(function initGA4() {
  if (!ga4Ativo) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA4_ID);
})();

// ── Inicialização do Google Tag Manager ─────────────────────
(function initGTM() {
  if (!gtmAtivo) return;

  // Script GTM no <head>
  (function(w,d,s,l,i){
    w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer', GTM_ID);

  // Noscript GTM no <body> (inserido dinamicamente)
  window.addEventListener('DOMContentLoaded', function() {
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.cssText = 'display:none;visibility:hidden';
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);
  });
})();

// ────────────────────────────────────────────────────────────
// FUNÇÕES DE RASTREAMENTO DE EVENTOS
// Use estas funções nos outros arquivos JS
// ────────────────────────────────────────────────────────────

/**
 * Dispara evento PageView (chamado automaticamente na inicialização).
 */
function trackPageView() {
  if (pixelAtivo && typeof fbq === 'function') fbq('track', 'PageView');
  if (ga4Ativo   && typeof gtag === 'function') gtag('event', 'page_view');
  pushDataLayer({ event: 'PageView' });
}

/**
 * Dispara evento ao visualizar um produto no catálogo.
 * @param {{ id: string, nome: string, preco: number, categoria: string }} produto
 */
function trackViewContent(produto) {
  if (pixelAtivo && typeof fbq === 'function') {
    fbq('track', 'ViewContent', {
      content_ids: [produto.id],
      content_name: produto.nome,
      content_category: produto.categoria,
      value: produto.preco,
      currency: 'BRL',
    });
  }
  if (ga4Ativo && typeof gtag === 'function') {
    gtag('event', 'view_item', {
      currency: 'BRL',
      value: produto.preco,
      items: [{ item_id: produto.id, item_name: produto.nome, item_category: produto.categoria, price: produto.preco }],
    });
  }
  pushDataLayer({ event: 'ViewContent', produto });
}

/**
 * Dispara evento ao adicionar produto ao carrinho.
 * @param {{ id: string, nome: string, preco: number, categoria: string }} produto
 */
function trackAddToCart(produto) {
  if (pixelAtivo && typeof fbq === 'function') {
    fbq('track', 'AddToCart', {
      content_ids: [produto.id],
      content_name: produto.nome,
      content_category: produto.categoria,
      value: produto.preco,
      currency: 'BRL',
    });
  }
  if (ga4Ativo && typeof gtag === 'function') {
    gtag('event', 'add_to_cart', {
      currency: 'BRL',
      value: produto.preco,
      items: [{ item_id: produto.id, item_name: produto.nome, item_category: produto.categoria, price: produto.preco, quantity: 1 }],
    });
  }
  pushDataLayer({ event: 'AddToCart', produto });
}

/**
 * Dispara evento ao abrir o formulário de orçamento.
 * @param {{ itens: Array, total: number }} carrinho
 */
function trackInitiateCheckout(carrinho) {
  if (pixelAtivo && typeof fbq === 'function') {
    fbq('track', 'InitiateCheckout', {
      num_items: carrinho.itens.length,
      value: carrinho.total,
      currency: 'BRL',
    });
  }
  if (ga4Ativo && typeof gtag === 'function') {
    gtag('event', 'begin_checkout', {
      currency: 'BRL',
      value: carrinho.total,
    });
  }
  pushDataLayer({ event: 'InitiateCheckout', carrinho });
}

/**
 * Dispara evento Lead ao clicar em "Finalizar Orçamento" (antes do redirect).
 * @param {{ nome: string, total: number }} dados
 */
function trackLead(dados) {
  if (pixelAtivo && typeof fbq === 'function') {
    fbq('track', 'Lead', {
      value: dados.total,
      currency: 'BRL',
      content_name: 'Orçamento WhatsApp',
    });
  }
  if (ga4Ativo && typeof gtag === 'function') {
    gtag('event', 'generate_lead', {
      currency: 'BRL',
      value: dados.total,
    });
  }
  pushDataLayer({ event: 'Lead', dados });
}

/**
 * Helper interno: empurra dados para o dataLayer (GTM).
 * @param {Object} data
 */
function pushDataLayer(data) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}
