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

const SUPABASE_URL      = 'https://qjjszmqgajdcfpbjfwjw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqanN6bXFnYWpkY2ZwYmpmd2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMTA2ODMsImV4cCI6MjA4OTY4NjY4M30.Y68DqOHQWjcYpF0xR6XZuD_kDZ675tcVe2Ctjyh6W24';

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
