/* ============================================================
   CDM Materiais Elétricos — Checkout / Finalização de Orçamento
   Valida formulário e redireciona para WhatsApp com mensagem
   ============================================================ */

// Número do WhatsApp da empresa (somente dígitos, com DDI)
const WA_NUMERO = '5511921300534';

document.addEventListener('DOMContentLoaded', function() {
  const form     = document.getElementById('form-orcamento');
  const inputCPF = document.getElementById('campo-cpf');
  const inputTel = document.getElementById('campo-telefone');

  if (!form) return;

  // ── Máscara automática nos campos ───────────────────────────
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

  // ── Submit do formulário ─────────────────────────────────────
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    finalizarOrcamento();
  });

  // ── Link "ver carrinho" no checkout ─────────────────────────
  document.getElementById('btn-ver-carrinho')?.addEventListener('click', function(e) {
    e.preventDefault();
    abrirCarrinho();
  });
});

// ── Finalizar orçamento ──────────────────────────────────────
function finalizarOrcamento() {
  if (!validarFormulario()) return;

  // Verifica carrinho não vazio
  if (carrinho.length === 0) {
    mostrarToast('⚠️ Adicione produtos ao carrinho antes de finalizar!');
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const nome      = document.getElementById('campo-nome').value.trim();
  const cpf       = document.getElementById('campo-cpf').value.trim();
  const telefone  = document.getElementById('campo-telefone').value.trim();
  const total     = calcularTotal();

  // Dispara eventos de analytics antes do redirect
  if (typeof trackLead === 'function')             trackLead({ nome, total });
  if (typeof trackInitiateCheckout === 'function') trackInitiateCheckout({ itens: carrinho, total });

  // Monta a mensagem
  const mensagem = montarMensagem(nome, cpf, telefone);

  // Pequeno delay para garantir que os eventos sejam disparados
  setTimeout(function() {
    const url = `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  }, 350);
}

// ── Monta mensagem estruturada para o WhatsApp ───────────────
function montarMensagem(nome, cpf, telefone) {
  const itensTexto = carrinho.map(item => {
    const subtotal = formatarMoeda(item.preco * item.qty);
    return `• ${item.nome} (x${item.qty}) - ${subtotal}`;
  }).join('\n');

  const total = formatarMoeda(calcularTotal());

  return (
    `🔧 *Novo Orçamento — CDM Materiais Elétricos*\n\n` +
    `👤 *Cliente:* ${nome}\n` +
    `🪪 *CPF:* ${cpf}\n` +
    `📱 *Telefone:* ${telefone}\n\n` +
    `🛒 *Produtos:*\n${itensTexto}\n\n` +
    `💰 *Total:* ${total}\n\n` +
    `_Mensagem gerada automaticamente pelo site CDM Materiais Elétricos_`
  );
}

// ── Validação do formulário ──────────────────────────────────
function validarFormulario() {
  let valido = true;

  const nome      = document.getElementById('campo-nome');
  const cpf       = document.getElementById('campo-cpf');
  const telefone  = document.getElementById('campo-telefone');
  const lgpd      = document.getElementById('campo-lgpd');

  // Nome
  if (!nome.value.trim() || nome.value.trim().length < 3) {
    exibirErro(nome, 'Informe seu nome completo (mínimo 3 caracteres).');
    valido = false;
  }

  // CPF
  if (!validarCPF(cpf.value)) {
    exibirErro(cpf, 'CPF inválido. Verifique e tente novamente.');
    valido = false;
  }

  // Telefone
  if (!validarTelefone(telefone.value)) {
    exibirErro(telefone, 'WhatsApp inválido. Use o formato (11) 99999-9999.');
    valido = false;
  }

  // LGPD
  if (!lgpd.checked) {
    const erroLgpd = document.getElementById('erro-lgpd');
    if (erroLgpd) { erroLgpd.textContent = 'Você precisa aceitar a política de privacidade.'; erroLgpd.classList.add('visible'); }
    valido = false;
  }

  if (!valido) {
    mostrarToast('⚠️ Corrija os campos destacados em vermelho.');
    // Rola até o primeiro campo com erro
    const primeiroErro = document.querySelector('.error');
    primeiroErro?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return valido;
}

// ── Helpers de erro ──────────────────────────────────────────
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
