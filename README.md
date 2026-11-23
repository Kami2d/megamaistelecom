# MEGA+ Telecom — Website MVP

Landing page institucional e comercial da Mega Mais Telecom, construída com
React + TypeScript + Tailwind CSS + Lucide React.

O redesenho foi inspirado no MVP de referência que o cliente aprovou
(https://vitordesigner.com.br/giga/): linguagem visual de azul marinho profundo,
azul elétrico e ciano como cor de sinal, com acento em laranja. A tipografia
combina Saira em itálico para os títulos de destaque (display) e Onest para o
corpo do texto. A identidade foi desenvolvida com um motivo autoral próprio, o
“signal +” (feixes de fibra, marcas de “+”, fita luminosa e chips de sinal), e
com textos originais, sem reproduzir o conteúdo do exemplo.

## Executar

```bash
npm install
npm run dev
npm run build
```

## Deploy na Vercel

O projeto é uma aplicação **Vite estática**, sem backend obrigatório. O arquivo
`vercel.json` já declara o framework, o comando `npm run build` e o diretório
`dist`, além de uma regra de SPA e headers básicos de segurança.

1. Envie a pasta do projeto para um repositório GitHub, GitLab ou Bitbucket.
2. Na Vercel, clique em **Add New → Project** e selecione esse repositório.
3. Não é preciso alterar nada em **Build & Output Settings**: a Vercel detecta o
   Vite e usa `npm run build` / `dist` conforme `vercel.json`.
4. **(Opcional)** Em **Project Settings → Environment Variables**, defina as
   variáveis listadas em `.env.example` para trocar os dados demonstrativos sem
   editar código:
   - `VITE_WHATSAPP_PHONE` — número comercial em formato internacional, sem `+`.
     Se vazia, o site usa o número padrão `5598992165127` definido em
     `src/data/site.ts`. Definir a variável sobrescreve esse número.
   - `VITE_CUSTOMER_PORTAL_URL` — URL ou âncora da área do cliente. Por padrão,
     aponta para `https://meganettelecom.sgp.net.br/accounts/central/login?next=/central/home/`.

   Com o número padrão, os CTAs de WhatsApp (links `wa.me`, botão flutuante e
   contato do rodapé/menu mobile) já ficam **ativos por padrão**. Para usar outro
   número, configure `VITE_WHATSAPP_PHONE` e republicar.

5. Clique em **Deploy**.

Também é possível publicar pela CLI, sem repositório remoto:

```bash
npx vercel
```

Para conferir o build de produção antes de subir:

```bash
npm run build
npm run preview
```

> **Antes de ir ao ar:** confirme os dados de contato e da empresa obtidos do
> MVP de referência — número de WhatsApp/telefone e CNPJ `46.434.669/0001-92` —
> e as localidades atendidas: São Luís, Rosário, Presidente Juscelino e Barreirinhas. Confira também os
> catálogos em `src/data/` (planos, regiões, FAQ e benefícios) e os dados
> da Central de Status. As variáveis acima cobrem
> apenas WhatsApp e área do cliente. As rotas usam hash (`#status`), por isso não
> há 404 em navegação direta; o rewrite em `vercel.json` cobre outros caminhos.

## Organização

```
src/
  styles/       CSS mestre e camadas (tokens, base, componentes)
  data/         Todo o conteúdo editável (planos, FAQ, objeções, benefícios, status, config)
  lib/          Formatadores e helper do WhatsApp
  context/      Estado compartilhado de seleção de plano
  components/   Componentes reutilizáveis
  sections/     Seções da página
  pages/        Página da Central de Status
  services/     Provider de status
public/images/  Imagens locais usadas no site
```

## Identidade visual

A linguagem visual do redesenho usa azul marinho profundo como fundo, azul
elétrico e ciano como cores de sinal e laranja como acento (tokens em
`src/styles/theme.css`). Os títulos de destaque usam Saira em itálico e o corpo
usa Onest, carregados em `index.html`. O logotipo é híbrido: uma imagem local
(`logotipo.png`) ao lado da marca tipográfica editável (`MEGA+`), montada em
`src/components/BrandLogo.tsx`. O layout foi inspirado no
MVP de referência https://vitordesigner.com.br/giga/; o site atual da empresa
não foi usado como referência de design.

### Movimento e acessibilidade

As animações são CSS e IntersectionObserver, sem novas dependências:

- `src/hooks/useInView.ts` dispara uma entrada única de animação quando o
  elemento entra na viewport (disco de 24h, barras de velocidade e timeline).
- O velocímetro (`src/components/SpeedRing.tsx`) conta da menor até a maior
  velocidade dos planos e anima o arco/ponto de medição na entrada.
- Feixes de fibra, chips flutuantes, órbitas da CTA final e o wordmark gigante
  usam `@keyframes` em `src/styles/components.css`.
- Títulos de seção (`src/components/SectionHeading.tsx`) usam um divisor “+”
  como assinatura visual.
- `prefers-reduced-motion: reduce` mantém o conteúdo visível e desliga o
  movimento, conforme as regras em `src/styles/base.css`.

## Seções da página

A home (`src/App.tsx`) reúne, nesta ordem: Hero, Planos, Simulador, Aplicativo
MEGA+, Objeções, Como contratar, Cobertura, Sobre, Dúvidas (FAQ) e uma CTA final
reforçada. Os componentes ficam em `src/sections/`.

O redesenho acrescentou **Simulador**, **Objeções** e **Como contratar**, além da
**CTA final** mais forte e do wordmark gigante "MEGA+" no rodapé
(`giant-wordmark` em `src/components/Footer.tsx`). A página de **status**
(detalhada abaixo) permanece disponível.

## Conteúdo demonstrativo — confirmar antes de publicar

Todos os dados comerciais ficam centralizados em `src/data/`:

- `site.ts` — o número de WhatsApp padrão é `5598992165127` e a URL da área do
  cliente é `https://meganettelecom.sgp.net.br/accounts/central/login?next=/central/home/`;
  ambos podem ser sobrescritos por `VITE_WHATSAPP_PHONE` e
  `VITE_CUSTOMER_PORTAL_URL`. Com o número padrão, os CTAs de WhatsApp já ficam
  ativos (`isWhatsAppConfigured` em `src/data/site.ts`). O número de
  WhatsApp/telefone e o CNPJ `46.434.669/0001-92` foram obtidos do MVP de
  referência e **precisam ser confirmados** antes da publicação. As localidades
  atendidas são São Luís, Rosário, Presidente Juscelino e Barreirinhas.
- `plans.ts` — catálogo com os planos de 350, 550 e 650 Mbps (R$ 120,00, R$ 140,00 e R$ 160,00 por mês). O campo `punctualityPrice` existe
  para manter separado o preço com desconto por pontualidade, mas permanece
  `null` porque o valor não foi fornecido.
- `objections.ts` — perguntas de objeções exibidas antes da FAQ, com respostas
  genéricas que não inventam políticas contratuais.
- `site.ts` — `playStoreUrl` aponta para o aplicativo da MEGA+ na Google Play e
  pode ser trocado por `VITE_PLAY_STORE_URL`. A seção
  `src/sections/AppPromo.tsx` usa o selo `public/images/playstore.png` como botão
  e mostra o celular flutuante `public/images/celular.png`.
- `faq.ts` — respostas que não inventam políticas contratuais.
- `benefits.ts` e `site.ts` — regiões e serviços baseados na bio oficial do Instagram.

## Central de Status

Página dedicada acessível por `#status` (item “Status” do menu). A rota é
controlada em `src/App.tsx` sem adicionar dependências de roteamento.

- Dados e rótulos: `src/data/status.ts`
- Contrato e provider: `src/services/status.ts` (`StatusProvider`)
- Interface: `src/pages/StatusPage.tsx` e `src/components/Status*`,
  `IncidentHistory`, `InternetDiagnostics`, `NetworkStatus`

O catálogo reúne 45 serviços em seis categorias. Cada entrada declara sua
fonte oficial em `src/data/status.ts`; para adicionar um serviço ou trocar uma
fonte, basta editar esse arquivo — o restante do painel se adapta
automaticamente. O catálogo compartilhado
`src/data/downdetector-services.json` associa cada serviço ao slug/país usados
tanto no link do card (downdetector.com, ou .com.br quando aplicável) quanto no
proxy da API.

O Downdetector é uma fonte independente baseada em relatos de usuários, não uma
fonte oficial das plataformas, e **não oferece API pública gratuita**: a API v2
exige assinatura Enterprise, `client_id`/`client_secret` e token Bearer. Por
isso o navegador nunca consulta o Downdetector diretamente e nenhum status é
inventado a partir da página dele. Com as credenciais configuradas no proxy, o
gráfico de cada serviço é alimentado pelo campo `history` retornado pela API;
sem isso, o gráfico simplesmente não é exibido no card.

Por padrão, o provider consulta diretamente apenas as APIs Statuspage que
liberam CORS (Twitch, Epic Games, Discord, Cloudflare, GitHub, Zoom e Akamai).
Os demais permanecem como **“Informação indisponível”**, com links para a fonte
oficial e para o Downdetector. Nunca é inferido um status a partir do acesso à
página inicial de uma plataforma, e as informações de terceiros não são
apresentadas como monitoramento direto da Mega Mais.

Falhas de consulta não são tratadas como indisponibilidade: o estado atual
passa a `unknown` e o último estado válido é mantido apenas como histórico, com
data. O estado da fonte (`sourceState`) é separado do estado do serviço.

### Backend (opcional)

Defina `VITE_STATUS_API_URL` para que o painel consuma um backend próprio em
vez das fontes com CORS. O endpoint deve responder com:

```json
{
  "checkedAt": "2026-11-18T12:00:00Z",
  "lastSuccessfulAt": "2026-11-18T12:00:00Z",
  "services": [
    {
      "id": "twitch",
      "status": "operational",
      "lastUpdated": "12:00",
      "sourceName": "Twitch Status",
      "sourceUrl": "https://status.twitch.com/",
      "downdetectorUrl": "https://downdetector.com/status/twitch",
      "history": [
        { "at": "2026-11-22T10:00:00Z", "status": "operational", "reports": 4 },
        { "at": "2026-11-22T11:00:00Z", "status": "degraded", "reports": 38 },
        { "at": "2026-11-22T12:00:00Z", "status": "outage", "reports": 210 }
      ],
      "incidentDescription": null,
      "components": null,
      "resolutionEta": null,
      "maintenance": false
    }
  ],
  "incidents": []
}
```

`status` aceita `operational`, `degraded`, `outage`, `maintenance` ou
`unknown`. IDs desconhecidos são ignorados e valores inválidos viram
`unknown`. O campo opcional `history` alimenta o gráfico do card: cada ponto
precisa de `at` (ISO 8601) e `status` (`operational`, `degraded` ou `outage`);
`reports` é opcional e define a altura da barra. São aceitos no máximo 48 pontos,
ordenados por data; pontos inválidos são descartados. O backend é responsável
por consultar APIs sem CORS e com credenciais, aplicar cache, respeitar limites
de requisição e tratar erros. O front também mantém cache em
memória com TTL (`VITE_STATUS_CACHE_TTL_MS`), evita requisições sobrepostas e
só atualiza com a aba visível. `VITE_STATUS_POLL_INTERVAL_MS` define o intervalo
do polling (padrão: 3 minutos, dentro da faixa recomendada de 2 a 5).

### Downdetector API v2 (proxy backend)

O proxy `server/downdetector.mjs` usa a [API v2](https://downdetectorapi.com/v2/docs/api.json)
e mantém as credenciais fora do navegador:

```bash
cp .env.example .env.local
# preencha DOWNDETECTOR_CLIENT_ID e DOWNDETECTOR_CLIENT_SECRET
npm run status:server        # http://localhost:8787/api/downdetector
npm run dev                  # em outro terminal
```

Fluxo do proxy: `POST /v2/tokens` (Basic → Bearer, renovado 5 min antes de
expirar), `GET /v2/companies/search` (resolve `company_id`/`country_id`, cache
de 24 h), `GET /v2/companies/{id}/status` (`success`/`warning`/`danger`) e
`GET /v2/slugs/{slug}/reports` (buckets de 15 min das últimas 24 h). A cor de
cada bucket do gráfico usa a linha de base oficial da API
(`/companies/{id}/baseline`): `≥4x` = fora do ar, `≥2x` = instabilidade,
abaixo disso = operacional. O limite de requisições é respeitado com cache em
memória (`DOWNDETECTOR_CACHE_TTL_MS`) e concorrência configurável
(`DOWNDETECTOR_CONCURRENCY`).

Defina `VITE_DOWNDETECTOR_API_URL` no front (padrão no `.env.example`) para
anexar os dados ao painel. O status da API substitui apenas serviços sem fonte
oficial consultável; os demais mantêm o status oficial e recebem só o gráfico.
Se as credenciais estiverem ausentes, o proxy responde `503`, o front segue
funcionando e os gráficos permanecem sem dados. Serviços sem empresa
correspondente na API são ignorados — nunca recebem um status inventado.

“Status da Rede Mega Mais” é uma área independente e permanece com a mensagem
“Informações da rede indisponíveis no momento.” até existir integração com a
infraestrutura da empresa.

## Área do cliente

Rota `#cliente` (`src/pages/CustomerPortalPage.tsx`), acessível pelo botão
“Área do cliente” do cabeçalho e do menu mobile. A página mantém o acesso dentro
do site, mas abre a Central do Assinante em uma nova aba apontando para
`siteConfig.customerPortalUrl` (sobrescrevível por `VITE_CUSTOMER_PORTAL_URL`).

**Não usamos iframe para o login.** Em 23/11/2026 o portal enviava o cookie
`csrftoken` sem `SameSite` e sem `Secure`; o navegador trata isso como
`SameSite=Lax` e não envia o cookie no POST de login dentro de um iframe
cross-site, derrubando a validação de CSRF. Somado ao bloqueio de cookies de
terceiros do Chrome/Safari/Firefox, o login não funciona embutido. Abrir em nova
aba torna o portal first-party e a autenticação funciona normalmente.

Se o portal passar a enviar `SameSite=None; Secure` nos cookies de sessão e
CSRF (e incluir o domínio do site em `CSRF_TRUSTED_ORIGINS`), o iframe volta a
ser viável — desde que o navegador do usuário permita cookies de terceiros.

## Ookla — Provider Enrichment API (lado do provedor)

A [Speedtest Provider Enrichment API (1.0.8)](https://www.ookla.com/enrichment-api/)
é um contrato em que a **operadora expõe dados do assinante à Ookla** quando um
cliente faz um Speedtest. Ela **não mede velocidade** e não fornece resultados de
teste — para exibir números da Ookla no site seria necessário o Speedtest Web
SDK (licença paga). Aqui implementamos o papel de **provedor**, que é o que essa
API descreve.

O endpoint fica em `GET/POST /v1/subscriber-service` (alias
`/api/v1/subscriber-service`) no mesmo servidor (`npm run enrichment:server`).
O Vite faz proxy de `/v1` em `dev` e `preview`.

**Autenticação** — configure ao menos um esquema (a Ookla exige isso):

| Esquema | Variáveis |
| --- | --- |
| `bearerAuth` | `ENRICHMENT_BEARER_TOKEN` |
| `oauth2` | `ENRICHMENT_OAUTH2_TOKEN` (Bearer) |
| `basicAuth` | `ENRICHMENT_BASIC_USER` + `ENRICHMENT_BASIC_PASSWORD` |
| `apiKeyAuth` | `ENRICHMENT_API_KEY` + `ENRICHMENT_API_KEY_NAME` / `ENRICHMENT_API_KEY_IN` (`header`, `query` ou `cookie`) |

**Identificadores** — `ipv4` e/ou `ipv6` (obrigatório ao menos um) e `port`
(opcional, 1–65535). No `GET` vão na query string; no `POST`, em JSON:

```bash
curl 'http://localhost:8787/v1/subscriber-service?ipv4=192.0.2.10&port=12974' \
  -H 'Authorization: Bearer SEU_TOKEN'

curl -X POST 'http://localhost:8787/v1/subscriber-service' \
  -H 'Authorization: Bearer SEU_TOKEN' -H 'Content-Type: application/json' \
  -d '{"ipv4":"192.0.2.10","port":12974}'
```

**Fonte de dados** — por padrão, `server/subscribers.json` (copie de
`server/subscribers.example.json`), com entradas `{ ipv4, ipv6, ports, service }`.
O campo `service` segue o contrato (`type`, `technology`, `display`,
`location`, `supplementalData`) e é filtrado antes de sair: só campos válidos
são devolvidos. Alternativamente, defina `ENRICHMENT_SUBSCRIBER_UPSTREAM_URL`
para consultar o CRM/billing da operadora (com `ENRICHMENT_UPSTREAM_TOKEN`).
Sem registro, a resposta é `404 Subscriber Service Not Found` — **nenhum dado é
inventado**.

Status codes: `200` sucesso, `400` identificadores inválidos, `401` sem
autenticação válida, `404` assinante não encontrado, `405` método não suportado,
`502` falha na base do provedor e `503` API não configurada. `GET /api/health`
informa `enrichment.configured` e os esquemas ativos.

Em produção hospedada estaticamente, `/v1/subscriber-service` precisa de uma
rewrite/Function apontando para este servidor (ou o gateway da operadora).

A consulta de cobertura é feita pelo WhatsApp: o visitante envia seu endereço
ou cidade e a equipe comercial confirma a disponibilidade. Não há consulta
automática de CEP, backend de cobertura nem cobrança nesta etapa.
