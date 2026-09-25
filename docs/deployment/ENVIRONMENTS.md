# Ambientes — ACJL Onboarding

## Matriz

### Development
- Aplicação: execução local
- URL: http://localhost:3000
- Supabase: projeto Development
- `NEXT_PUBLIC_APP_ENV=development`
- Segredos: `.env.local`, nunca versionados

### Preview
- Aplicação: Vercel Preview
- Supabase: projeto Staging/Development
- `NEXT_PUBLIC_APP_ENV=preview`
- Variáveis configuradas no ambiente **Preview** da Vercel

### Production
- Aplicação: Vercel Production
- Supabase: projeto Production
- `NEXT_PUBLIC_APP_ENV=production`
- Variáveis configuradas no ambiente **Production** da Vercel

## Variáveis

| Variável | Cliente | Uso |
|---|---|---|
| NEXT_PUBLIC_APP_ENV | Sim | Identificação do ambiente |
| NEXT_PUBLIC_APP_URL | Sim | URL pública do ambiente |
| NEXT_PUBLIC_SUPABASE_URL | Sim | Endpoint Supabase |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Sim | Chave pública Supabase |
| SUPABASE_SERVICE_ROLE_KEY | Não | Operações privilegiadas no servidor |
| SUPABASE_STORAGE_BUCKET | Não/Servidor | Bucket principal |
| DIAGNOSTIC_TOKEN_SECRET | Não | Assinatura/segurança dos links de diagnóstico |

## Regras de segurança

- Nunca colocar chaves reais no GitHub.
- `SUPABASE_SERVICE_ROLE_KEY` só pode ser usada no servidor.
- Nunca expor service role key em componentes client.
- Tokens de diagnóstico devem ser aleatórios, não sequenciais.
- Links de diagnóstico devem possuir validade e controle de submissão.
- Production deve utilizar projeto Supabase separado quando a operação entrar em produção.
