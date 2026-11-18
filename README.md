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

O projeto é uma aplicação **Vite estática**, sem backend. O arquivo
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
   - `VITE_CUSTOMER_PORTAL_URL` — URL ou âncora da área do cliente.

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
> MVP de referência — número de WhatsApp/telefone, CNPJ `46.434.669/0001-92` e
> unidades em Rosário, São Luís, Codó e São João Batista. Confira também os
> catálogos em `src/data/` (planos, combos, regiões, FAQ e benefícios) e os dados
> da Central de Status. As variáveis acima cobrem
> apenas WhatsApp e área do cliente. As rotas usam hash (`#status`), por isso não
> há 404 em navegação direta; o rewrite em `vercel.json` cobre outros caminhos.

## Organização

```
src/
  styles/       CSS mestre e camadas (tokens, base, componentes)
  data/         Todo o conteúdo editável (planos, combos, FAQ, objeções, benefícios, status, speed test, config)
  lib/          Formatadores, helper do WhatsApp e lógica do speed test
  context/      Estado compartilhado de seleção de plano
  components/   Componentes reutilizáveis
  sections/     Seções da página
  pages/        Página da Central de Status
  services/     Provider de status
public/images/  Imagens locais usadas no site
public/speedtest/ Arquivo de 2 MB usado na medição de download
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
- O velocímetro (`src/components/SpeedRing.tsx`) conta de 400 até a velocidade
  selecionada e anima o arco/ponto de medição na entrada.
- Feixes de fibra, chips flutuantes, órbitas da CTA final e o wordmark gigante
  usam `@keyframes` em `src/styles/components.css`.
- Títulos de seção (`src/components/SectionHeading.tsx`) usam um divisor “+”
  como assinatura visual.
- `prefers-reduced-motion: reduce` mantém o conteúdo visível e desliga o
  movimento, conforme as regras em `src/styles/base.css`.

## Seções da página

A home (`src/App.tsx`) reúne, nesta ordem: Hero, Planos, Simulador, Diferenciais,
Combos, Objeções, Como contratar, Cobertura, Speed test, Sobre, Dúvidas (FAQ) e
uma CTA final reforçada. Os componentes ficam em `src/sections/`.

O redesenho acrescentou **Simulador**, **Diferenciais**, **Objeções** e
**Como contratar**, além da **CTA final** mais forte e do wordmark gigante
"MEGA+" no rodapé (`giant-wordmark` em `src/components/Footer.tsx`). O **speed
test** e a página de **status** (detalhados abaixo) permanecem disponíveis.

## Conteúdo demonstrativo — confirmar antes de publicar

Todos os dados comerciais ficam centralizados em `src/data/`:

- `site.ts` — o número de WhatsApp padrão é `5598992165127` e a URL da área do
  cliente é `#contato`; ambos podem ser sobrescritos por `VITE_WHATSAPP_PHONE` e
  `VITE_CUSTOMER_PORTAL_URL`. Com o número padrão, os CTAs de WhatsApp já ficam
  ativos (`isWhatsAppConfigured` em `src/data/site.ts`). O número de
  WhatsApp/telefone, o CNPJ `46.434.669/0001-92` e as unidades em Rosário, São
  Luís, Codó e São João Batista foram obtidos do MVP de referência e **precisam
  ser confirmados** antes da publicação.
- `plans.ts` — catálogo com os planos de 400, 500, 600 e 800 Mbps (R$ 99,90,
  R$ 119,90, R$ 129,90 e R$ 149,90 por mês). O campo `punctualityPrice` existe
  para manter separado o preço com desconto por pontualidade, mas permanece
  `null` porque o valor não foi fornecido.
- `objections.ts` — perguntas de objeções exibidas antes da FAQ, com respostas
  genéricas que não inventam políticas contratuais.
- `combos.ts` — combos sem valores comerciais; CTAs abrem o WhatsApp com
  mensagem pré-preenchida.
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
automaticamente.

Por padrão, o provider consulta diretamente apenas as APIs Statuspage que
liberam CORS (Twitch, Epic Games, Discord, Cloudflare, GitHub, Zoom e Akamai).
Os demais permanecem como **“Informação indisponível”**, com link para a fonte
oficial. Nunca é inferido um status a partir do acesso à página inicial de uma
plataforma, e as informações de terceiros não são apresentadas como
monitoramento direto da Mega Mais.

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
`unknown`. O backend é responsável por consultar APIs sem CORS, aplicar cache,
respeitar limites de requisição e tratar erros. O front também mantém cache em
memória com TTL (`VITE_STATUS_CACHE_TTL_MS`), evita requisições sobrepostas e
só atualiza com a aba visível. `VITE_STATUS_POLL_INTERVAL_MS` define o intervalo
do polling (padrão: 3 minutos, dentro da faixa recomendada de 2 a 5).

“Status da Rede Mega Mais” é uma área independente e permanece com a mensagem
“Informações da rede indisponíveis no momento.” até existir integração com a
infraestrutura da empresa.

## Speed test

O teste mede **download real** (streaming de um arquivo local de 2 MB com cache
desabilitado) e **latência** (média de três requisições a um asset pequeno), tudo
no navegador e sem serviços externos. A configuração fica em
`src/data/speedTest.ts` e a lógica em `src/lib/speedTest.ts`.

A medição de upload foi deliberadamente omitida: sem um endpoint de recebimento
ela seria apenas simulada. O resultado pode ser enviado à equipe pelo WhatsApp.

A consulta de CEP valida apenas o formato. Não há backend, autenticação,
integração de cobertura nem cobrança.
