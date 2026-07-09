# Configuracao do Supabase na UltraKcalc

## 1. Criar o projeto

Crie um projeto no Supabase e anote:

- Project URL
- anon/public key

Essas duas informacoes ficam em `Project Settings > API`.

## 2. Criar as tabelas e regras de seguranca

Abra o SQL Editor do Supabase e execute todo o conteudo de:

```text
supabase_schema.sql
```

Esse script cria as tabelas `recordatorios` e `recordatorio_items`, ativa Row Level Security e limita cada usuario aos dados do proprio login.
Se as tabelas ja existirem, execute o script novamente para adicionar o campo `record_group`, usado pelo campo "Grupo" do cadastro.

As policies de `custom_foods` ja permitem editar e excluir (`for all` + grant de `update`/`delete`), entao a edicao e exclusao de alimentos cadastrados funciona sem nenhuma alteracao no schema.

## 3. Configurar o frontend

Edite `supabase_config.js`:

```js
window.ULTRAKCALC_SUPABASE_CONFIG = {
  url: 'https://SEU-PROJETO.supabase.co',
  anonKey: 'SUA_CHAVE_ANON_PUBLICA'
};
```

Nao use a chave `service_role` no site.

## 4. Configurar autenticacao

No Supabase, em `Authentication > URL Configuration`, configure a URL do site publicado.

Durante testes locais, adicione tambem:

```text
http://127.0.0.1:8000
```

Se a confirmacao por e-mail estiver ligada, a pessoa precisara confirmar o e-mail antes de entrar.

## 5. Fluxo esperado

- Sem Supabase configurado: a UltraKcalc continua salvando localmente.
- Com Supabase configurado e sem login: a pessoa pode entrar/criar conta em `conta.html`.
- Com login ativo: o botao "Salvar recordatorio" grava na nuvem.
- Cada usuario ve apenas os recordatorios criados no proprio login.
- O botao "Enviar relatorios para nuvem" migra recordatorios antigos do navegador para a conta logada.
- O campo "Grupo" e salvo localmente e tambem enviado para a coluna `record_group` no Supabase.
- A migracao compara uma assinatura do recordatorio antes de enviar e ignora duplicatas ja existentes na nuvem ou repetidas no proprio armazenamento local.
