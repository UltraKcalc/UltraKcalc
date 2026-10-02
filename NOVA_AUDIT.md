# Revisão preliminar da classificação NOVA

Data da revisão: 2026-10-02

Fonte metodológica: Martinez-Steele et al., *Best practices for applying the Nova food classification system*, Nature Food 4 (2023), 445-448, DOI 10.1038/s43016-023-00779-w.

## Critérios usados

O artigo recomenda: (1) separar preparações culinárias de produtos industrializados; (2) desagregar preparações caseiras/restaurantes em seus ingredientes; (3) usar lista de ingredientes para itens que podem ser processados ou ultraprocessados; e (4) sinalizar itens incertos para análise de sensibilidade. A presença de substâncias sem uso culinário ou aditivos cosméticos distingue operacionalmente ultraprocessados de processados.

## Resultado da triagem da base

A base contém 1.186 chaves NOVA: 745 no grupo 1, 43 no grupo 2, 121 no grupo 3 e 277 no grupo 4. A revisão automatizada encontrou conjuntos que merecem validação humana; ela não substitui a lista de ingredientes nem o contexto do consumo.

### Divergências fortes

- Vinho (genérico, branco, rosé e tinto) e saquê estão como `ultraprocessado`. A nota da Tabela 1 do artigo orienta, por analogia, bebidas obtidas por fermentação de alimentos do grupo 1 para o grupo 3; destiladas ficam no grupo 4. Assim, esses cinco itens são candidatos fortes a `processado`, salvo informação específica de formulação.
- Alimentos não encontrados no mapeamento recebem automaticamente `in natura ou minimamente processado`. Essa regra não é sustentada pelo artigo e pode subestimar ultraprocessados. Um item desconhecido deve ser marcado como incerto e exigir revisão, não receber grupo 1 por padrão.

### Preparações que não deveriam receber um grupo único sem ressalva

Os itens abaixo estão no grupo 1, mas são preparações com vários ingredientes. Segundo o artigo, o procedimento preferido é desagregá-los em ingredientes; se isso não for possível, a decisão precisa ser explícita e sinalizada para análise de sensibilidade:

- bolinho de chuva com farinha, leite, ovo, óleo e açúcar;
- bolos caseiros inglês, banana, cenoura, fubá, laranja e trigo;
- waffle com farinha, amido, leite, manteiga, ovos, fermento, sal e açúcar;
- carnes empanadas ou preparadas com farinha/óleo e diversos pratos descritos com óleo, cebola, alho, molho ou sal;
- caldos e vitaminas compostos por dois ou mais ingredientes.

Para a análise binária atual (AUP versus não AUP), muitas dessas preparações continuarão no lado “não AUP” quando feitas do zero. Porém, exportá-las como grupo 1 é metodologicamente diferente de desagregar os ingredientes, sobretudo porque açúcar, óleo, manteiga e sal pertencem ao grupo 2.

### Itens dependentes de composição

Pães, bolos, biscoitos, pizzas, massas prontas, hambúrgueres, carnes curadas e pratos prontos podem pertencer ao grupo 3 ou 4. A classificação deve depender da lista de ingredientes: somente alimentos do grupo 1 e ingredientes do grupo 2 favorecem grupo 3; substâncias sem uso culinário e aditivos cosméticos favorecem grupo 4. Descrições genéricas precisam ser marcadas como incertas.

## Mudança implementada

Cada alimento lançado agora oferece um seletor com os quatro grupos NOVA e a opção de restaurar o valor da base. A alteração é específica daquele lançamento e passa a alimentar os gráficos, o recordatório salvo, a nuvem e as exportações CSV/XLSX/PDF.

## Próximo passo recomendado para a base

Não foi feita uma reclassificação em massa: o artigo exige contexto e, em muitos casos, lista de ingredientes. Recomenda-se uma planilha de adjudicação com `classificação atual`, `alternativa`, `grau de certeza`, `justificativa`, `fonte/ingredientes` e revisão independente por dois avaliadores. Vinho e saquê podem ser priorizados como correções de alta confiança; descrições genéricas e preparações multingredientes devem ser priorizadas para marcação de incerteza e análise de sensibilidade.
