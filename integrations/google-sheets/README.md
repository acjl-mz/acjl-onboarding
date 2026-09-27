# Google Sheets — ACJL Onboarding

Esta integração usa um **Google Apps Script Web App** como endpoint de entrada.

## 1. Criar a folha

1. Crie uma Google Sheet usando a conta que receberá os diagnósticos.
2. Abra **Extensões → Apps Script**.
3. Substitua o conteúdo do editor pelo ficheiro `Code.gs`.
4. Guarde o projecto.

A folha será criada automaticamente com o nome **Diagnósticos** na primeira submissão.

## 2. Publicar

No Apps Script:

**Deploy → New deployment → Web app**

Use:
- **Execute as:** Me
- **Who has access:** Anyone

O Web App precisa aceitar chamadas do formulário público.

Copie a URL terminada em `/exec`.

## 3. Ligar ao Vercel

No projecto Vercel `acjl-onboarding`, crie a variável:

`GOOGLE_SHEETS_WEBHOOK_URL`

com a URL `/exec` do Web App.

Depois faça um novo deployment.

## 4. Notificação

Cada submissão:
1. é adicionada à folha **Diagnósticos**;
2. gera uma cópia por e-mail para **acjl.corporate@gmail.com**.

Não é necessário Supabase para o armazenamento do formulário.

## Segurança

A URL do Web App é pública para permitir que o formulário seja submetido sem login. O endpoint deve ser usado apenas para este formulário.
