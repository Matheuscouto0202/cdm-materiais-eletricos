/* ============================================================
   CDM Materiais Elétricos — Configuração do Supabase (EXEMPLO)

   COMO USAR:
   1. Copie este arquivo e renomeie para: supabase-config.js
   2. Substitua os valores abaixo pelas suas credenciais reais
   3. Nunca commite o supabase-config.js (já está no .gitignore)

   Onde encontrar as credenciais:
   → Acesse https://supabase.com → seu projeto
   → "Settings" → "API"
   → Copie "Project URL" e "anon public"
   ============================================================ */

const SUPABASE_URL      = 'SUA_URL_AQUI';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANONIMA_AQUI';

// ── Inicialização do cliente ─────────────────────────────────
const supabaseConfigurado =
  SUPABASE_URL      !== 'SUA_URL_AQUI' &&
  SUPABASE_ANON_KEY !== 'SUA_CHAVE_ANONIMA_AQUI' &&
  SUPABASE_URL.startsWith('https://');

let dbClient = null;

if (supabaseConfigurado) {
  if (typeof window.supabase !== 'undefined') {
    dbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('[Supabase] Cliente inicializado com sucesso.');
  } else {
    console.warn('[Supabase] SDK não carregado. Verifique o CDN no index.html.');
  }
} else {
  console.info('[Supabase] Credenciais não configuradas. Usando fallback local.');
}
