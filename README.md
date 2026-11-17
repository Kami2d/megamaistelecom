# MEGA+ Telecom — Website MVP

Landing page institucional e comercial da Mega Mais Telecom, construída com
React + TypeScript + Tailwind CSS + Lucide React.

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
   - `VITE_CUSTOMER_PORTAL_URL` — URL ou âncora da área do cliente.

   Enquanto `VITE_WHATSAPP_PHONE` não for definido (ou continuar com o número
   demonstrativo), **nenhum link `wa.me` é gerado**: os CTAs aparecem
   desabilitados como “Em breve”, o botão flutuante fica oculto e o rodapé/menu
   mobile mostram “WhatsApp em breve”. Ao configurar um número real e
   republicar, todos os CTAs voltam ao normal automaticamente.

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

> **Antes de ir ao ar:** substitua os demais valores demonstrativos em
> `src/data/` (preços, regiões, telefone, e-mail e endereço) e confirme os dados
> da Central de Status. As variáveis acima cobrem apenas WhatsApp e área do
> cliente. As rotas usam hash (`#status`), por isso não há 404 em navegação
> direta; o rewrite em `vercel.json` cobre outros caminhos.

## Organização

```
src/
  styles/       CSS mestre e camadas (tokens, base, componentes)
  data/         Todo o conteúdo editável (planos, combos, FAQ, benefícios, config)
  lib/          Formatadores, helper do WhatsApp e lógica do speed test
  components/   Componentes reutilizáveis
  sections/     Seções da página
public/images/  Imagens locais usadas no site
public/speedtest/ Arquivo de 2 MB usado na medição de download
```

## Identidade visual

A paleta foi extraída das publicações do Instagram oficial
(`@megamais.telecom`): azul marinho profundo, azul elétrico e ciano como cor de
sinal, com acentos secundários ocasionais. O logotipo é uma marca tipográfica
editável (`MEGA+`) em `src/components/BrandLogo.tsx`. O site atual da empresa
não foi usado como referência de design.

## Conteúdo demonstrativo — confirmar antes de publicar

Todos os dados comerciais ficam centralizados em `src/data/`:

- `site.ts` — número de WhatsApp e URL da área do cliente são demonstrativos,
  mas podem ser sobrescritos por `VITE_WHATSAPP_PHONE` e
  `VITE_CUSTOMER_PORTAL_URL`; enquanto o número demonstrativo estiver ativo,
  os CTAs de WhatsApp ficam em estado “Em breve” (`isWhatsAppConfigured` em
  `src/data/site.ts`); telefone, e-mail e endereço estão como `null` porque não
  foram informados.
- `plans.ts` — preços de catálogo dos quatro planos. O campo
  `punctualityPrice` existe para manter separado o preço com desconto por
  pontualidade, mas está `null` porque o valor não foi fornecido.
- `combos.ts` — combos sem valores comerciais; CTAs abrem o WhatsApp com
  mensagem pré-preenchida.
- `faq.ts` — respostas que não inventam políticas contratuais.
- `benefits.ts` e `site.ts` — regiões e serviços baseados na bio oficial do Instagram.

## Central de Status

Página dedicada acessível por `#status` (menu “Status dos Serviços”). A rota é
controlada em `src/App.tsx` sem adicionar dependências de roteamento.

- Dados e rótulos: `src/data/status.ts`
- Contrato e provider: `src/services/status.ts` (`StatusProvider`)
- Interface: `src/pages/StatusPage.tsx` e `src/components/Status*`,
  `IncidentHistory`, `InternetDiagnostics`, `NetworkStatus`

Todos os estados de plataformas externas são **demonstrativos** e exibidos com
aviso explícito. O provider local não faz requisições nem finge verificação em
tempo real; para integrar fontes oficiais no futuro, basta substituir
`statusProvider` por um adaptador que implemente `StatusProvider` e normalize
as respostas em `StatusSnapshot`.

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
