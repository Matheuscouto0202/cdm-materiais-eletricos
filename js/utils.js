/* ============================================================
   CDM Materiais Elétricos — Utilitários
   Validações, máscaras e formatações reutilizáveis
   ============================================================ */

/**
 * Valida CPF brasileiro.
 * Verifica os dois dígitos verificadores pelo algoritmo oficial.
 * @param {string} cpf - CPF com ou sem formatação
 * @returns {boolean}
 */
function validarCPF(cpf) {
  // Remove tudo que não for dígito
  cpf = cpf.replace(/\D/g, '');

  // Deve ter exatamente 11 dígitos
  if (cpf.length !== 11) return false;

  // Rejeita sequências conhecidas inválidas (111.111.111-11, etc.)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Calcula primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }
  let digito1 = (soma * 10) % 11;
  if (digito1 === 10 || digito1 === 11) digito1 = 0;
  if (digito1 !== parseInt(cpf[9])) return false;

  // Calcula segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  let digito2 = (soma * 10) % 11;
  if (digito2 === 10 || digito2 === 11) digito2 = 0;
  if (digito2 !== parseInt(cpf[10])) return false;

  return true;
}

/**
 * Valida número de telefone/WhatsApp brasileiro.
 * Aceita: (11) 92130-0534 / (11) 921300534 / 11921300534
 * @param {string} tel
 * @returns {boolean}
 */
function validarTelefone(tel) {
  const nums = tel.replace(/\D/g, '');
  // Celular: 11 dígitos (com DDD) ou 9 (sem DDD — não recomendado)
  // Exige DDD de 2 dígitos + 9 dígitos = 11 total
  // Ou DDD + 8 dígitos (fixo) = 10 total
  return /^[1-9]{2}9[0-9]{8}$/.test(nums) || /^[1-9]{2}[2-9][0-9]{7}$/.test(nums);
}

/**
 * Formata valor numérico como moeda brasileira (R$ 1.234,56).
 * @param {number} valor
 * @returns {string}
 */
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(valor);
}

/**
 * Aplica máscara de CPF: XXX.XXX.XXX-XX
 * @param {string} valor - dígitos brutos
 * @returns {string}
 */
function mascaraCPF(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/**
 * Aplica máscara de telefone: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 * @param {string} valor
 * @returns {string}
 */
function mascaraTelefone(valor) {
  const nums = valor.replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 10) {
    // Fixo: (XX) XXXX-XXXX
    return nums
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  // Celular: (XX) XXXXX-XXXX
  return nums
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

/**
 * Remove toda formatação de um CPF ou telefone, deixando só dígitos.
 * @param {string} valor
 * @returns {string}
 */
function apenasNumeros(valor) {
  return valor.replace(/\D/g, '');
}

/**
 * Trunca um texto ao número máximo de caracteres, adicionando "...".
 * @param {string} texto
 * @param {number} max
 * @returns {string}
 */
function truncar(texto, max = 60) {
  return texto.length > max ? texto.slice(0, max) + '…' : texto;
}

/**
 * Exibe um toast de notificação na tela.
 * @param {string} mensagem
 * @param {number} duracao - em ms (padrão 2500)
 */
function mostrarToast(mensagem, duracao = 2500) {
  let toast = document.getElementById('toast-global');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-global';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = mensagem;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duracao);
}
