# Auditoria de segurança da UltraKcalc

Data da revisão: 2026-10-02

## Escopo e resultado

A revisão cobriu o código do frontend, o schema/policies do Supabase e testes anônimos, somente leitura, contra a API publicada. A página do GitHub Pages respondeu por HTTPS. Consultas sem login a `recordatorios` e `recordatorio_items`, usando apenas a chave pública do frontend, retornaram listas vazias; isso é compatível com as policies de Row Level Security (RLS) presentes em `supabase_schema.sql`.

Esse teste confirma o bloqueio anônimo observado, mas não substitui testes de isolamento entre duas contas autenticadas nem uma auditoria das configurações do painel do Supabase.

## Dados disponíveis no navegador

- A base nutricional, as classificações NOVA/POF, as medidas caseiras, o código JavaScript e a chave `anon/publishable` do Supabase são públicos por definição em uma aplicação estática. Tornar o repositório privado não torna esses arquivos secretos enquanto a página continuar pública.
- Sem login, recordatórios, alimentos personalizados, medidas e favoritos ficam em `localStorage`, sem criptografia. Qualquer pessoa com acesso ao mesmo perfil do navegador e qualquer JavaScript executado nessa origem pode lê-los.
- Com login, os mesmos dados são enviados ao Supabase: identificadores de participante e pesquisador, data, refeições, alimentos, observações, nutrientes e classificações. O schema usa RLS por `auth.uid()`.
- A sessão Supabase é persistida no navegador. Portanto, uma injeção de script ou comprometimento de dependência executada na página pode acessar os dados locais e agir como a conta conectada.

## Achados

### Alto - injeção de HTML por nome de alimento (corrigido)

O modal de refeição concatenava o nome de um alimento personalizado/importado em `innerHTML`. Um nome contendo marcação maliciosa poderia executar código na origem da UltraKcalc. A renderização foi trocada por criação de elementos e `textContent`.

### Médio - dependências remotas sem Subresource Integrity

`xlsx.full.min.js` e `@supabase/supabase-js` são carregados de CDNs sem atributo `integrity`. Se a cadeia de fornecimento ou a resposta do CDN for comprometida, o script terá acesso aos dados e à sessão da aplicação. Recomendação: hospedar versões revisadas no próprio repositório ou fixar versão e hash SRI com `crossorigin="anonymous"`.

### Médio - ausência de Content Security Policy efetiva

Há scripts e estilos inline, inclusive um `onclick`, o que dificulta uma CSP restritiva. Recomendação: remover handlers inline, mover os scripts inline para arquivos próprios e então aplicar CSP limitando `script-src`, `connect-src`, `style-src`, `font-src`, `img-src`, `frame-ancestors` e `base-uri`. Em GitHub Pages, uma meta CSP ajuda, mas cabeçalhos de segurança completos exigem uma hospedagem que permita configurá-los.

### Médio - identificadores potencialmente pessoais sem aviso de minimização

Os campos permitem nomes livres para participante e pesquisador, e observações também são livres. Para pesquisa, prefira IDs pseudonimizados, evite nome, e-mail, telefone ou informação clínica nas observações e documente retenção/consentimento conforme a LGPD e o protocolo institucional.

### Baixo - chave pública exposta (esperado)

A chave `sb_publishable_...` não é segredo e precisa estar no frontend. A proteção depende de RLS, grants mínimos e configuração de autenticação. Nunca incluir `service_role` no frontend.

## Verificações recomendadas antes de produção

1. Criar duas contas de teste e confirmar que a conta A não consegue ler, alterar ou excluir dados da conta B em todas as cinco tabelas.
2. Conferir no painel do Supabase que RLS está ativa nas tabelas reais e que não existem policies adicionais para `anon` ou `public`.
3. Restringir URLs de redirecionamento e origens permitidas de autenticação às URLs oficiais.
4. Revisar logs, backups, política de retenção, exclusão de conta e resposta a incidentes.
5. Pseudonimizar participantes e publicar uma política de privacidade clara na própria página.
6. Hospedar dependências localmente ou usar SRI e adotar CSP sem `unsafe-inline`.

## Observação sobre repositório privado e página pública

A visibilidade do repositório e a visibilidade do GitHub Pages são controles diferentes. Mesmo com o repositório privado, uma página publicada pode continuar acessível ao público e seus arquivos entregues ao navegador continuam inspecionáveis. Não coloque segredos, dados de participantes ou chaves privilegiadas no código estático.
