# Google Sheets — ACJL Onboarding

A integração usa um **Google Apps Script Web App** como endpoint de entrada.

## Estrutura

Um único workbook Google Sheets contém duas folhas:

- **ACJL - Diagnosticos** — preenchimento autónomo pela empresa.
- **ACJL - Briefing** — diagnóstico conduzido por consultor ACJL.

O script selecciona automaticamente a folha com base em `diagnosticType`.

## Configuração do workbook

No Apps Script, em **Project Settings → Script properties**, crie:

- **Name:** `SPREADSHEET_ID`
- **Value:** o ID do workbook que contém as duas folhas.

O ID é o trecho entre `/d/` e `/edit` no URL do Google Sheets.

Exemplo:

`https://docs.google.com/spreadsheets/d/ABC123XYZ/edit`

ID:

`ABC123XYZ`

O Web App deve ser publicado para **Execute as: Me** e **Who has access: Anyone**, para permitir a submissão pública.

## Ligação ao Vercel

No projecto Vercel `acjl-onboarding`, configurar:

`GOOGLE_SHEETS_WEBHOOK_URL`

com a URL do Web App terminada em `/exec`.

## Funcionamento

Cada submissão:

1. é validada;
2. é gravada na folha correspondente;
3. mantém uma cópia integral em **Dados completos (JSON)**;
4. tenta enviar uma cópia por e-mail para `acjl.corporate@gmail.com`.

A falha do e-mail **não invalida uma gravação que já foi realizada**.

O `diagnosticId` é persistido durante o preenchimento e usado para evitar a criação de um segundo registo quando a mesma submissão é reenviada.

## Segurança

A URL do Apps Script é pública porque o formulário público precisa de a chamar indirectamente através do servidor Vercel. O código de acesso do briefing é validado no servidor Vercel antes de permitir a área de consultor.

Não colocar IDs, códigos de acesso ou outros segredos no código-fonte.
