# Ampliação da base TBCA

Importação realizada em 2 de outubro de 2026 a partir do arquivo `index.html` fornecido pelo responsável pelo projeto, contendo uma compilação de dados da TBCA usada para pesquisa científica.

## Conteúdo incorporado

- 4.055 registros alimentares adicionais com composição nutricional;
- 4.055 correspondências de descrição para os códigos POF presentes na compilação;
- 3.095 vínculos diretos de medidas caseiras da TBCA, relativos a 1.742 descrições de alimentos;
- 5.242 registros alimentares e 3.105 medidas caseiras no total após a união com a base anterior.

Dos novos registros, 573 possuem ao menos uma medida caseira diretamente associada na compilação. Para os demais, a entrada em gramas permanece disponível.

## Classificação NOVA

As classificações NOVA existentes no arquivo de origem não foram importadas automaticamente, pois incluíam associações que exigiam revisão de ingredientes e processamento. Uma revisão conservadora posterior classificou 887 dos 4.055 novos registros e manteve 3.168 como `classificação NOVA incerta`. Preparações culinárias compostas foram mantidas como incertas quando a classificação correta exigiria desagregar os ingredientes. O usuário pode definir ou corrigir a categoria adequada em cada lançamento. As classificações já revisadas da base anterior foram preservadas. A estratégia e a distribuição por grupo estão descritas em `TBCA_NOVA_REVIEW.md`.

## Implementação

O arquivo `tbca_extra_data.js` contém os registros adicionais e a primeira leva de medidas. `tbca_additional_measures.js` acrescenta quatro medidas conferidas em páginas individuais da TBCA para acelga cozida, polpa de araçá e arroz integral com jambu. O carregamento evita duplicar alimentos e combina medidas por nome, peso e unidade.

A conferência considerou a página oficial atual de composição em medidas caseiras e a versão 7.3 (2025) identificada no catálogo da FAO. A tentativa de auditoria automatizada completa das páginas individuais foi interrompida pelo servidor com HTTP 403; por isso, nenhum valor não conferido foi inferido ou importado.
