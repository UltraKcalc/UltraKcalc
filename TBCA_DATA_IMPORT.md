# Ampliação da base TBCA

Importação realizada em 2 de outubro de 2026 a partir do arquivo `index.html` fornecido pelo responsável pelo projeto, contendo uma compilação de dados da TBCA usada para pesquisa científica.

## Conteúdo incorporado

- 4.055 registros alimentares adicionais com composição nutricional;
- 4.055 correspondências de descrição para os códigos POF presentes na compilação;
- 3.095 vínculos diretos de medidas caseiras da TBCA, relativos a 1.742 descrições de alimentos;
- 15.677 vínculos de medidas de referência recuperados do arquivo enviado, associados a 1.255 descrições;
- 5.242 registros alimentares, 18.782 opções de medidas e 2.993 alimentos com ao menos uma medida após a união das fontes.

As medidas diretamente vinculadas à TBCA permanecem sem alteração. As opções recuperadas do arquivo enviado são identificadas na interface pelo sufixo `referência adicional`: 24 foram associadas por igualdade normalizada de nome e as demais por correspondência do nome principal do alimento, nunca por ingredientes citados dentro da receita. Esse procedimento cobriu 1.251 alimentos que antes ofereciam somente gramas. Para os 2.249 ainda sem correspondência segura, a entrada em gramas permanece disponível.

## Classificação NOVA

As classificações NOVA existentes no arquivo de origem não foram importadas automaticamente, pois incluíam associações que exigiam revisão de ingredientes e processamento. Uma revisão conservadora posterior classificou 887 dos 4.055 novos registros e manteve 3.168 como `classificação NOVA incerta`. Preparações culinárias compostas foram mantidas como incertas quando a classificação correta exigiria desagregar os ingredientes. O usuário pode definir ou corrigir a categoria adequada em cada lançamento. As classificações já revisadas da base anterior foram preservadas. A estratégia e a distribuição por grupo estão descritas em `TBCA_NOVA_REVIEW.md`.

## Implementação

O arquivo `tbca_extra_data.js` contém os registros adicionais e a primeira leva de medidas. `tbca_additional_measures.js` acrescenta quatro medidas conferidas em páginas individuais da TBCA para acelga cozida, polpa de araçá e arroz integral com jambu. `reference_household_measures.js` contém as opções recuperadas do arquivo enviado e mantém sua natureza de referência explícita nos rótulos. O carregamento evita duplicar alimentos e combina medidas por nome, peso e unidade.

A conferência considerou a página oficial atual de composição em medidas caseiras e a versão 7.3 (2025) identificada no catálogo da FAO. A tentativa de auditoria automatizada completa das páginas individuais foi interrompida pelo servidor com HTTP 403; por isso, nenhum valor não conferido foi inferido ou importado.
