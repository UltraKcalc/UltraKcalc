# Ampliação da base TBCA

Importação realizada em 2 de outubro de 2026 a partir do arquivo `index.html` fornecido pelo responsável pelo projeto, contendo uma compilação de dados da TBCA usada para pesquisa científica.

## Conteúdo incorporado

- 4.055 registros alimentares adicionais com composição nutricional;
- 4.055 correspondências de descrição para os códigos POF presentes na compilação;
- 3.091 vínculos diretos de medidas caseiras da TBCA, relativos a 1.739 descrições de alimentos;
- 5.242 registros alimentares e 3.101 medidas caseiras no total após a união com a base anterior.

Dos novos registros, 573 possuem ao menos uma medida caseira diretamente associada na compilação. Para os demais, a entrada em gramas permanece disponível.

## Classificação NOVA

As classificações NOVA existentes no arquivo de origem não foram importadas automaticamente, pois incluem associações que exigem revisão de ingredientes e processamento. Os 4.055 novos registros entram como `classificação NOVA incerta`; o usuário pode definir a categoria adequada em cada lançamento. As classificações já revisadas da base anterior foram preservadas.

## Implementação

O arquivo `tbca_extra_data.js` contém os registros adicionais e as medidas. O carregamento evita duplicar alimentos já existentes e combina medidas por nome, peso e unidade.
