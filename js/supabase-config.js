/* ============================================================
   CDM Materiais Elétricos — Configuração do Supabase

   ⚠️  CONFIGURAÇÃO OBRIGATÓRIA ANTES DE USAR:

   Passo 1: Acesse https://supabase.com → seu projeto
   Passo 2: Clique em "Settings" (ícone de engrenagem) → "API"
   Passo 3: Copie:
     - "Project URL"    → cole em SUPABASE_URL abaixo
     - "anon public"    → cole em SUPABASE_ANON_KEY abaixo

   Exemplo:
     SUPABASE_URL     = 'https://xyzxyzxyz.supabase.co'
     SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   ============================================================ */

const SUPABASE_URL      = 'SUA_URL_AQUI';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANONIMA_AQUI';

// ── Inicialização do cliente ─────────────────────────────────
// Verifica se as credenciais foram preenchidas antes de inicializar
const supabaseConfigurado =
  SUPABASE_URL      !== 'SUA_URL_AQUI' &&
  SUPABASE_ANON_KEY !== 'SUA_CHAVE_ANONIMA_AQUI' &&
  SUPABASE_URL.startsWith('https://');

let dbClient = null;

if (supabaseConfigurado) {
  // window.supabase é exposto pelo CDN carregado no index.html
  if (typeof window.supabase !== 'undefined') {
    dbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('[Supabase] Cliente inicializado com sucesso.');
  } else {
    console.warn('[Supabase] SDK não carregado. Verifique o CDN no index.html.');
  }
} else {
  console.info('[Supabase] Credenciais não configuradas. Usando fallback local.');
}
