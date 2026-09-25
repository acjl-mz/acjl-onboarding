# Foundation Architecture

## Domínios

- Companies
- Contacts
- Leads
- Diagnostics
- Services
- Questionnaires
- Assessments
- Pricing
- Proposals
- Onboarding
- Users/Roles
- Activities
- Audit Logs
- Settings

## Fluxo

Company/Lead → Diagnostic → Service Requests → Assessment → Pricing → Proposal → Acceptance → Onboarding.

## Dimensionamento

Cada serviço possui fatores próprios. O cálculo inicial considera volume, complexidade, frequência, pendências, urgência e condições especiais.

O resultado automático é armazenado separadamente do resultado final validado pelo técnico.

## Preço

O motor de esforço não determina obrigatoriamente o preço. A precificação é uma etapa posterior, com parâmetros configuráveis, ajustes e aprovação.

## Configuração

Serviços, perguntas, opções, regras, pesos, parâmetros de esforço, preços de referência, templates e estados devem ser administráveis sem alteração do código sempre que possível.
