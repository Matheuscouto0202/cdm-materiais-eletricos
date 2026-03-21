/* ============================================================
   CDM Materiais Elétricos — Checkout / Finalização de Orçamento

   FLUXO:
   1. Usuário preenche nome, CPF, WhatsApp e aceita LGPD
   2. Clica em "Finalizar" → valida tudo
   3. Dispara eventos Lead + InitiateCheckout (analytics)
   4. Oferece opção de Copiar ou ir direto ao WhatsApp
   ============================================================ */

// ── Número WhatsApp da empresa (somente dígitos, com DDI) ────
// Para alterar: troque apenas os números abaixo
const WA_NUMERO = '5511921300534';

document.addEventListener('DOMContentLoaded', function() {
  const form     = document.getElementById('form-orcamento');
  const inputCPF = document.getElementById('campo-cpf');
  const inputTel = document.getElementById('campo-telefone');

  if (!form) return;

  // ── Máscaras automáticas ─────────────────────────────────
  inputCPF?.addEventListener('input', function() {
    this.value = mascaraCPF(this.value);
    limparErro(this);
  });
  inputTel?.addEventListener('input', function() {
    this.value = mascaraTelefone(this.value);
    limparErro(this);
  });
  document.getElementById('campo-nome')?.addEventListener('input', function() {
    limparErro(this);
  });
  document.getElementById('campo-lgpd')?.addEventListener('change', function() {
    const erroLgpd = document.getElementById('erro-lgpd');
    if (this.checked && erroLgpd) erroLgpd.classList.remove('visible');
  });

  // ── Submit → WhatsApp ────────────────────────────────────
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    finalizarOrcamento();
  });

  // ── Botão "Copiar pedido" ────────────────────────────────
  document.getElementById('btn-copiar-pedido')?.addEventListener('click', copiarPedido);

  // ── Ver carrinho (link no resumo) ────────────────────────
  document.getElementById('btn-ver-carrinho')?.addEventListener('click', function(e) {
    e.preventDefault();
    abrirCarrinho();
  });
});

// ── Finalizar orçamento → WhatsApp ───────────────────────────
function finalizarOrcamento() {
  if (!validarFormulario()) return;
  if (carrinho.length === 0) {
    mostrarToast('⚠️ Adicione produtos ao carrinho antes de finalizar!');
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const { nome, cpf, telefone, total, mensagem } = montarDados();

  // Dispara eventos analytics ANTES do redirect
  if (typeof trackLead             === 'function') trackLead({ nome, total });
  if (typeof trackInitiateCheckout === 'function') trackInitiateCheckout({ itens: carrinho, total });

  // Pequeno delay para garantir que os pixels registrem o evento
  setTimeout(function() {
    const url = `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  }, 400);
}

// ── Copiar pedido para a área de transferência ───────────────
function copiarPedido() {
  if (!validarFormulario()) return;
  if (carrinho.length === 0) {
    mostrarToast('⚠️ Adicione produtos ao carrinho antes de copiar!');
    return;
  }

  const { mensagem } = montarDados();

  if (!navigator.clipboard) {
    mostrarToast('❌ Seu navegador não suporta cópia automática. Use o botão do WhatsApp.');
    return;
  }

  navigator.clipboard.writeText(mensagem)
    .then(() => mostrarToast('✓ Pedido copiado! Cole no WhatsApp.', 3500))
    .catch(() => mostrarToast('❌ Não foi possível copiar. Use o botão do WhatsApp.'));
}

// ── Monta os dados do pedido ─────────────────────────────────
function montarDados() {
  const nome     = document.getElementById('campo-nome').value.trim();
  const cpf      = document.getElementById('campo-cpf').value.trim();
  const telefone = document.getElementById('campo-telefone').value.trim();
  const total    = calcularTotal();

  const itensTexto = carrinho.map(item =>
    `• ${item.nome} (x${item.qty}) - ${formatarMoeda(item.preco * item.qty)}`
  ).join('\n');

  const mensagem =
    `🔧 *Novo Orçamento — CDM Materiais Elétricos*\n\n` +
    `👤 *Cliente:* ${nome}\n` +
    `🪪 *CPF:* ${cpf}\n` +
    `📱 *Telefone:* ${telefone}\n\n` +
    `🛒 *Produtos:*\n${itensTexto}\n\n` +
    `💰 *Total:* ${formatarMoeda(total)}\n\n` +
    `_Mensagem gerada pelo site CDM Materiais Elétricos_`;

  return { nome, cpf, telefone, total, mensagem };
}

// ── Validação do formulário ──────────────────────────────────
function validarFormulario() {
  let valido = true;

  const nome     = document.getElementById('campo-nome');
  const cpf      = document.getElementById('campo-cpf');
  const telefone = document.getElementById('campo-telefone');
  const lgpd     = document.getElementById('campo-lgpd');

  if (!nome.value.trim() || nome.value.trim().length < 3) {
    exibirErro(nome, 'Informe seu nome completo (mínimo 3 caracteres).');
    valido = false;
  }
  if (!validarCPF(cpf.value)) {
    exibirErro(cpf, 'CPF inválido. Verifique e tente novamente.');
    valido = false;
  }
  if (!validarTelefone(telefone.value)) {
    exibirErro(telefone, 'WhatsApp inválido. Use o formato (11) 99999-9999.');
    valido = false;
  }
  if (!lgpd.checked) {
    const erroLgpd = document.getElementById('erro-lgpd');
    if (erroLgpd) {
      erroLgpd.textContent = 'Você precisa aceitar a política de privacidade para continuar.';
      erroLgpd.classList.add('visible');
    }
    valido = false;
  }

  if (!valido) {
    mostrarToast('⚠️ Corrija os campos destacados em vermelho.');
    document.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return valido;
}

// ── Helpers de erro nos campos ───────────────────────────────
function exibirErro(input, mensagem) {
  input.classList.add('error');
  const erroEl = input.parentElement.querySelector('.form-error');
  if (erroEl) { erroEl.textContent = mensagem; erroEl.classList.add('visible'); }
}

function limparErro(input) {
  input.classList.remove('error');
  const erroEl = input.parentElement.querySelector('.form-error');
  if (erroEl) { erroEl.textContent = ''; erroEl.classList.remove('visible'); }
}
