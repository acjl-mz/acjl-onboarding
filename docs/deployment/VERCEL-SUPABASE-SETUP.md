# Setup progressivo — Vercel + Supabase

## Ordem recomendada

### 1. Supabase Development
Criar o projeto de desenvolvimento e obter:
- Project URL
- anon/public key
- service role key

Criar inicialmente:
- PostgreSQL
- Auth para utilizadores internos
- Storage
- bucket `acjl-onboarding` (quando o módulo de anexos for ativado)

### 2. Aplicação local
Copiar `.env.example` para `.env.local` e preencher os valores do Supabase Development.

### 3. Vercel
Criar o projeto apontando para `acjl-mz/acjl-onboarding`.

Configurar três ambientes:
- Development
- Preview
- Production

As variáveis devem ser inseridas separadamente em cada ambiente.

### 4. Supabase Production
Antes do primeiro uso real, criar projeto Supabase Production separado e colocar os respetivos valores apenas no ambiente Production da Vercel.

### 5. Storage
O Storage será usado para anexos futuros, documentos de suporte, propostas e outros artefactos autorizados. A política de acesso deve ser criada por bucket e por papel, nunca como bucket público por defeito.

## Não versionar

Nunca versionar:
- `.env.local`
- service role keys
- tokens
- passwords
- credenciais Vercel
- credenciais Supabase
