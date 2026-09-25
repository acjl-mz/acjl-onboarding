# ACJL Onboarding

Sistema ACJL de Diagnóstico, Dimensionamento e Precificação de Serviços.

## Objetivo

Transformar a realidade e as necessidades de uma empresa interessada em uma solução ACJL dimensionada, precificada, aprovada e pronta para proposta e onboarding.

**Fluxo:** Realidade → Necessidades → Volume → Complexidade → Esforço → Serviço → Preço → Proposta → Contratação → Onboarding → Execução → Esforço real → Aprendizagem.

## Stack

- Next.js + TypeScript
- Supabase: PostgreSQL, Auth e Storage
- Vercel: deploy
- Zod: validação
- React Hook Form: formulários
- Tailwind CSS: interface

## Ambientes

| Ambiente | Deploy | Dados |
|---|---|---|
| Development | Local | Supabase Development |
| Preview | Vercel Preview | Supabase Staging/Development |
| Production | Vercel Production | Supabase Production |

Os segredos nunca devem ser commitados. Use `.env.local` localmente e variáveis de ambiente da Vercel nos ambientes remotos.

Consulte `docs/deployment/ENVIRONMENTS.md`.

## Estrutura

- `app/` — rotas e páginas
- `components/` — componentes de interface
- `lib/` — infraestrutura e serviços
- `modules/` — domínios funcionais
- `supabase/` — migrações e seeds
- `docs/` — arquitetura, regras e operação

## Princípios

1. O diagnóstico não exige conta do cliente.
2. O cliente não vê scores ou regras internas.
3. O motor dimensiona esforço; não impõe preço.
4. O técnico pode corrigir o resultado automático, justificando.
5. Preço final exige aprovação.
6. Toda alteração relevante é auditada.
7. Perguntas, pesos e regras devem ser configuráveis.
8. O diagnóstico deve poder ser reutilizado no onboarding.
9. A arquitetura suporta evolução para CRM, contratos, execução e análise histórica.

## Estado inicial

Foundation em construção. As funcionalidades serão ativadas progressivamente sobre uma arquitetura completa.
