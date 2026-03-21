# CDM Materiais Elétricos — Site Institucional

Site profissional com catálogo de produtos e geração de orçamentos via WhatsApp.

---

## 🚀 Como rodar localmente

### Opção 1 — VSCode com Live Server (recomendado)
1. Instale a extensão **Live Server** no VSCode
2. Abra a pasta `cdm-materiais-eletricos/` no VSCode
3. Clique com botão direito em `index.html` → **"Open with Live Server"**
4. O site abrirá em `http://127.0.0.1:5500`

> **Por que usar Live Server?** O catálogo carrega via `fetch()` do arquivo `data/produtos.json`.
> Abrir `index.html` diretamente no browser (sem servidor local) pode bloquear esse carregamento por segurança (CORS).

### Opção 2 — Python (se tiver instalado)
```bash
cd cdm-materiais-eletricos
python -m http.server 8080
# Acesse: http://localhost:8080
```

---

## ⚙️ Configurar Analytics (tráfego pago)

Abra o arquivo `js/analytics.js` e substitua os valores:

```js
const META_PIXEL_ID = 'SEU_PIXEL_ID';       // Ex: '1234567890123456'
const GA4_ID        = 'SEU_GA4_ID';         // Ex: 'G-XXXXXXXXXX'
const GTM_ID        = 'SEU_GTM_ID';         // Ex: 'GTM-XXXXXXX'
```

Após preencher os IDs, os eventos serão disparados automaticamente:
- `PageView` — ao abrir o site
- `ViewContent` — ao visualizar produto
- `AddToCart` — ao adicionar ao carrinho
- `InitiateCheckout` — ao abrir formulário de orçamento
- `Lead` — ao finalizar e ir para o WhatsApp

---

## 📦 Adicionar / Editar produtos

Edite o arquivo `data/produtos.json`. Cada produto segue este formato:

```json
{
  "id": "id-unico-do-produto",
  "nome": "Nome do Produto",
  "preco": 29.90,
  "imagem": "assets/images/produtos/categoria/arquivo.webp",
  "categoria": "Nome da Categoria",
  "estoque": true
}
```

- `id` — texto único, sem espaços (use hífens)
- `preco` — número decimal, use ponto (não vírgula)
- `estoque` — `true` (disponível) ou `false` (esgotado)

---

## 🐙 Publicar no GitHub (passo a passo)

### 1. Inicializar o repositório Git
```bash
cd cdm-materiais-eletricos
git init
git add .
git commit -m "feat: site CDM Materiais Elétricos - versão inicial"
```

### 2. Criar repositório no GitHub
- Acesse [github.com](https://github.com) → **New repository**
- Nome sugerido: `cdm-materiais-eletricos`
- Deixe **público** (para usar Netlify gratuito) ou **privado**
- **NÃO** marque "Initialize with README" (já temos um)

### 3. Conectar e enviar
```bash
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/cdm-materiais-eletricos.git
git push -u origin main
```

### 4. Fazer atualizações futuras
```bash
git add .
git commit -m "update: descrição da mudança"
git push
```

---

## 🌐 Publicar no Netlify (hospedagem gratuita)

### Opção A — Drag & Drop (mais rápido)
1. Acesse [netlify.com/drop](https://app.netlify.com/drop)
2. Arraste a pasta `cdm-materiais-eletricos/` para a área indicada
3. Pronto! O site estará online em segundos

### Opção B — Via GitHub (deploy automático)
1. Conecte sua conta Netlify ao GitHub
2. Selecione o repositório `cdm-materiais-eletricos`
3. Build command: *(deixe vazio)*
4. Publish directory: `.` (ponto)
5. Clique em **Deploy site**

> A cada `git push`, o Netlify atualiza o site automaticamente.

---

## 📁 Estrutura do projeto

```
cdm-materiais-eletricos/
├── index.html              ← Página principal
├── privacidade.html        ← Política de privacidade (LGPD)
├── .gitignore              ← Arquivos ignorados pelo Git
├── README.md               ← Este arquivo
├── assets/
│   └── images/
│       ├── logo.png        ← Logo sem fundo
│       ├── hero.avif       ← Imagem do hero
│       └── produtos/
│           └── disjuntores/← Fotos dos disjuntores
├── css/
│   ├── style.css           ← Estilos globais
│   └── cart.css            ← Estilos do carrinho
├── js/
│   ├── analytics.js        ← Meta Pixel, GA4, GTM
│   ├── utils.js            ← Validações e formatações
│   ├── cart.js             ← Lógica do carrinho
│   ├── catalog.js          ← Catálogo e filtros
│   ├── checkout.js         ← Orçamento e WhatsApp
│   └── main.js             ← Inicialização geral
└── data/
    └── produtos.json       ← Catálogo de produtos (edite aqui!)
```

---

## 📞 Contato CDM

- WhatsApp: (11) 92130-0534
- Telefone: (11) 4708-7475
- Email: cdmmateriaiseletricos@gmail.com
- Endereço: Rua Antônio Anhaia, 56 — Mairinque/SP — CEP 18120-000
- CNPJ: 58.376.662/0001-40
