# Ampliação da base TBCA

Importação realizada em 2 de outubro de 2026 a partir do arquivo `index.html` fornecido pelo responsável pelo projeto, contendo uma compilação de dados da TBCA usada para pesquisa científica.

## Conteúdo incorporado

- 4.055 registros alimentares adicionais com composição nutricional;
- 4.055 correspondências de descrição para os códigos POF presentes na compilação;
- 5.546 vínculos diretos de medidas caseiras da TBCA, incluindo 2.441 vínculos confirmados na auditoria das fichas oficiais atuais;
- 15.677 vínculos de medidas de referência recuperados do arquivo enviado, associados a 1.255 descrições;
- 5.242 registros alimentares, 21.223 opções de medidas e 4.970 descrições de alimentos com ao menos uma medida após a união das fontes.

As medidas diretamente vinculadas à TBCA permanecem sem alteração. As opções recuperadas do arquivo enviado são identificadas na interface pelo sufixo `referência adicional`: 24 foram associadas por igualdade normalizada de nome e as demais por correspondência do nome principal do alimento, nunca por ingredientes citados dentro da receita. Esse procedimento cobriu 1.251 alimentos que antes ofereciam somente gramas. A auditoria posterior consultou as 2.248 descrições restantes: 1.977 receberam ao menos uma medida oficial confirmada e 271 continuam apenas com entrada em gramas por não apresentarem uma medida nomeada e segura na ficha pública.

Na auditoria oficial foram lidos somente o nome da medida caseira e o peso ou volume indicado no cabeçalho da ficha; os valores da tabela de nutrientes não foram copiados. Cabeçalhos que continham apenas um peso, sem nome de medida, foram descartados. Também foram excluídas 166 ocorrências de “porção Anvisa” presentes no acesso técnico em inglês, mas ausentes da ficha pública atual em português.

## Classificação NOVA

As classificações NOVA existentes no arquivo de origem não foram importadas automaticamente, pois incluíam associações que exigiam revisão de ingredientes e processamento. Uma revisão conservadora posterior classificou 887 dos 4.055 novos registros e manteve 3.168 como `classificação NOVA incerta`. Preparações culinárias compostas foram mantidas como incertas quando a classificação correta exigiria desagregar os ingredientes. O usuário pode definir ou corrigir a categoria adequada em cada lançamento. As classificações já revisadas da base anterior foram preservadas. A estratégia e a distribuição por grupo estão descritas em `TBCA_NOVA_REVIEW.md`.

## Implementação

O arquivo `tbca_extra_data.js` contém os registros adicionais e a primeira leva de medidas. `tbca_additional_measures.js` acrescenta quatro medidas conferidas em páginas individuais da TBCA para acelga cozida, polpa de araçá e arroz integral com jambu. `reference_household_measures.js` contém as opções recuperadas do arquivo enviado e mantém sua natureza de referência explícita nos rótulos. `tbca_verified_measures.js` registra os 2.441 vínculos confirmados na auditoria oficial, com o código TBCA usado em cada correspondência. O carregamento evita duplicar alimentos e combina medidas por nome, peso e unidade.

A conferência considerou a página oficial atual de composição em medidas caseiras e a versão 7.3 (2025) identificada no catálogo da FAO. Os 2.238 registros que já possuíam código foram consultados por código; os dez itens antigos sem código foram pesquisados pelo nome e todos tiveram sua correspondência verificada manualmente. Nenhum peso ausente ou nome de medida incompleto foi inferido.
