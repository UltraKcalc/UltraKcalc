/* UltraKcalc — Troca de idioma (PT / EN / ES).
   Traduz textos estáticos das páginas via dicionário e adiciona o seletor
   de bandeiras na barra superior. A escolha fica salva em localStorage
   ('ukLang') e vale para todas as páginas.
   Incluir por último: <script src="ultrakcalc_i18n.js" defer></script> */
(function () {
  'use strict';

  // ---------- Dicionário ----------
  // chave: texto PT normalizado (espaços colapsados) -> [EN, ES]
  // Entradas em H usam innerHTML (para trechos com links/negrito/spans).
  var T = {
    // ===== Barra superior / menus / rodapé =====
    'Apresentação': ['About', 'Presentación'],
    'Como citar': ['How to cite', 'Cómo citar'],
    'Comparar': ['Compare', 'Comparar'],
    'Manual': ['Manual', 'Manual'],
    'Manual do usuário': ['User manual', 'Manual del usuario'],
    'Entrar': ['Sign in', 'Entrar'],
    'Usar a calculadora': ['Use the calculator', 'Usar la calculadora'],
    'Entrar / Criar conta': ['Sign in / Create account', 'Entrar / Crear cuenta'],
    'Calculadora': ['Calculator', 'Calculadora'],
    'Ver referência completa →': ['See full reference →', 'Ver referencia completa →'],
    '© 2026 UltraKcalc · Instituto de Nutrição · UERJ': ['© 2026 UltraKcalc · Institute of Nutrition · UERJ', '© 2026 UltraKcalc · Instituto de Nutrición · UERJ'],
    'Ultra-Processed Food Energy and Nutrients Calculator. Desenvolvida no Instituto de Nutrição da Universidade do Estado do Rio de Janeiro (UERJ).': [
      'Ultra-Processed Food Energy and Nutrients Calculator. Developed at the Institute of Nutrition of the Rio de Janeiro State University (UERJ).',
      'Ultra-Processed Food Energy and Nutrients Calculator. Desarrollada en el Instituto de Nutrición de la Universidad del Estado de Río de Janeiro (UERJ).'],

    // ===== Index =====
    'Instituto de Nutrição · UERJ': ['Institute of Nutrition · UERJ', 'Instituto de Nutrición · UERJ'],
    'Base TBCA, classificação assistida por inteligência artificial e resultados prontos para a sua pesquisa.': [
      'TBCA database, AI-assisted classification and results ready for your research.',
      'Base TBCA, clasificación asistida por inteligencia artificial y resultados listos para su investigación.'],
    'Conheça a ferramenta': ['Learn more', 'Conozca la herramienta'],
    'Recordatório · exemplo': ['Dietary recall · example', 'Recordatorio · ejemplo'],
    'de ultraprocessados': ['from ultra-processed', 'de ultraprocesados'],
    'Carboidratos': ['Carbohydrates', 'Carbohidratos'],
    'Proteínas': ['Proteins', 'Proteínas'],
    'Lipídios': ['Lipids', 'Lípidos'],
    'Sódio': ['Sodium', 'Sodio'],
    'Classificação': ['Classification', 'Clasificación'],
    'Ultraprocessados · 59%': ['Ultra-processed · 59%', 'Ultraprocesados · 59%'],
    'Não ultraprocessados · 41%': ['Non-ultra-processed · 41%', 'No ultraprocesados · 41%'],
    'O que é a UltraKcalc?': ['What is UltraKcalc?', '¿Qué es UltraKcalc?'],
    'Ferramenta científica desenvolvida no Instituto de Nutrição da UERJ para padronizar a avaliação do consumo de alimentos ultraprocessados — dados nutricionais quantitativos e nível de processamento em uma única plataforma.': [
      'A scientific tool developed at the UERJ Institute of Nutrition to standardize the assessment of ultra-processed food consumption — quantitative nutritional data and processing level in a single platform.',
      'Herramienta científica desarrollada en el Instituto de Nutrición de la UERJ para estandarizar la evaluación del consumo de alimentos ultraprocesados — datos nutricionales cuantitativos y nivel de procesamiento en una sola plataforma.'],
    'Base de dados TBCA': ['TBCA database', 'Base de datos TBCA'],
    'Energia, macro e micronutrientes calculados a partir da Tabela Brasileira de Composição de Alimentos.': [
      'Energy, macro and micronutrients calculated from the Brazilian Food Composition Table (TBCA).',
      'Energía, macro y micronutrientes calculados a partir de la Tabla Brasileña de Composición de Alimentos.'],
    'Classificação com IA': ['AI-powered classification', 'Clasificación con IA'],
    'Alimentos classificados como ultraprocessados ou não ultraprocessados com apoio de modelos de linguagem, validado em estudo científico.': [
      'Foods classified as ultra-processed or non-ultra-processed with the support of language models, validated in a scientific study.',
      'Alimentos clasificados como ultraprocesados o no ultraprocesados con apoyo de modelos de lenguaje, validado en un estudio científico.'],
    'Evidência e registro': ['Evidence and registration', 'Evidencia y registro'],
    'Fundamentada em artigo científico publicado e registrada como programa de computador no INPI.': [
      'Grounded in a published scientific article and registered as a computer program with the Brazilian INPI.',
      'Fundamentada en un artículo científico publicado y registrada como programa de computadora en el INPI.'],
    'Comece por aqui': ['Start here', 'Comience por aquí'],
    'Monte recordatórios e calcule energia e nutrientes.': ['Build dietary recalls and calculate energy and nutrients.', 'Cree recordatorios y calcule energía y nutrientes.'],
    'Compare resultados entre registros e grupos.': ['Compare results between records and groups.', 'Compare resultados entre registros y grupos.'],
    'Entenda a metodologia e a origem da ferramenta.': ['Understand the methodology and origin of the tool.', 'Conozca la metodología y el origen de la herramienta.'],
    'Referência oficial para trabalhos acadêmicos.': ['Official reference for academic work.', 'Referencia oficial para trabajos académicos.'],
    'Minha conta': ['My account', 'Mi cuenta'],
    'Entre para salvar e sincronizar seus registros.': ['Sign in to save and sync your records.', 'Entre para guardar y sincronizar sus registros.'],
    'Guia passo a passo de todas as funções.': ['Step-by-step guide to every feature.', 'Guía paso a paso de todas las funciones.'],

    // ===== Conta =====
    'Seus recordatórios na nuvem': ['Your dietary recalls in the cloud', 'Sus recordatorios en la nube'],
    'Entre para salvar recordatórios e acessar seus dados em qualquer dispositivo.': [
      'Sign in to save recalls and access your data from any device.',
      'Entre para guardar recordatorios y acceder a sus datos desde cualquier dispositivo.'],
    'Recordatórios sincronizados': ['Synced dietary recalls', 'Recordatorios sincronizados'],
    'Alimentos e medidas personalizados': ['Custom foods and measures', 'Alimentos y medidas personalizados'],
    'Acesso de qualquer dispositivo': ['Access from any device', 'Acceso desde cualquier dispositivo'],
    'Acessar conta': ['Access account', 'Acceder a la cuenta'],
    'Use o mesmo e-mail sempre que quiser recuperar seus recordatórios salvos.': [
      'Always use the same e-mail to retrieve your saved recalls.',
      'Use siempre el mismo correo para recuperar sus recordatorios guardados.'],
    'Verificando conexao': ['Checking connection', 'Verificando conexión'],
    'E-mail': ['E-mail', 'Correo electrónico'],
    'Senha': ['Password', 'Contraseña'],
    'Criar conta': ['Create account', 'Crear cuenta'],
    'Ir para calculadora': ['Go to calculator', 'Ir a la calculadora'],
    'Enviar relatórios para nuvem': ['Send reports to the cloud', 'Enviar informes a la nube'],
    'Sair': ['Sign out', 'Salir'],

    // ===== Comparar =====
    'Comparar recordatorios': ['Compare dietary recalls', 'Comparar recordatorios'],
    'Analise energia e macronutrientes de AUP entre dois recordatorios, dois grupos ou um recordatorio contra um grupo.': [
      'Analyze UPF energy and macronutrients between two recalls, two groups, or one recall against a group.',
      'Analice energía y macronutrientes de AUP entre dos recordatorios, dos grupos o un recordatorio contra un grupo.'],
    'Carregando dados': ['Loading data', 'Cargando datos'],
    'Comparar A': ['Compare A', 'Comparar A'],
    'Comparar B': ['Compare B', 'Comparar B'],
    'Tipo': ['Type', 'Tipo'],
    'Selecao': ['Selection', 'Selección'],
    'Recordatorio': ['Dietary recall', 'Recordatorio'],
    'Grupo': ['Group', 'Grupo'],
    'Modo de calculo para grupos': ['Calculation mode for groups', 'Modo de cálculo para grupos'],
    'Media por recordatorio': ['Average per recall', 'Media por recordatorio'],
    'Soma total do grupo': ['Group total sum', 'Suma total del grupo'],
    'Nenhum resultado calculado.': ['No results calculated yet.', 'Ningún resultado calculado.'],

    // ===== Calculadora =====
    'Calculadora de nutrientes e energia de alimentos ultraprocessados': [
      'Ultra-processed food energy and nutrient calculator',
      'Calculadora de nutrientes y energía de alimentos ultraprocesados'],
    'Recordatório Alimentar de 24 horas': ['24-hour Dietary Recall', 'Recordatorio Alimentario de 24 horas'],
    'Adicione itens de consumo informando a refeição, o alimento, a porção em gramas (ou medida caseira) e a quantidade. Informe o ID do participante e a data do recordatório antes de adicionar itens.': [
      'Add consumption items by entering the meal, the food, the portion in grams (or household measure) and the quantity. Enter the participant ID and the recall date before adding items.',
      'Agregue ítems de consumo indicando la comida, el alimento, la porción en gramos (o medida casera) y la cantidad. Ingrese el ID del participante y la fecha del recordatorio antes de agregar ítems.'],
    'Fluxo': ['Workflow', 'Flujo'],
    'Entrada por refeição e porção': ['Input by meal and portion', 'Entrada por comida y porción'],
    'Com classificação de grupos pela POF': ['With group classification by POF', 'Con clasificación de grupos por la POF'],
    'Saídas': ['Outputs', 'Salidas'],
    'Relatórios e planilha completa': ['Reports and full spreadsheet', 'Informes y planilla completa'],
    'Cadastro': ['Registration', 'Registro'],
    'Identificação do recordatório': ['Recall identification', 'Identificación del recordatorio'],
    'Participante, pesquisador, data e padrão de classificação.': ['Participant, researcher, date and classification standard.', 'Participante, investigador, fecha y estándar de clasificación.'],
    'ID do participante:': ['Participant ID:', 'ID del participante:'],
    'ID do pesquisador:': ['Researcher ID:', 'ID del investigador:'],
    'Data do recordatório:': ['Recall date:', 'Fecha del recordatorio:'],
    'Grupo:': ['Group:', 'Grupo:'],
    'Tipo de classificação:': ['Classification type:', 'Tipo de clasificación:'],
    'Individual': ['Individual', 'Individual'],
    'Salvar recordatório': ['Save recall', 'Guardar recordatorio'],
    'Salvar planilha': ['Save spreadsheet', 'Guardar planilla'],
    'Salvar PDF': ['Save PDF', 'Guardar PDF'],
    'Criar grupo': ['Create group', 'Crear grupo'],
    'Participante': ['Participant', 'Participante'],
    'Pesquisador': ['Researcher', 'Investigador'],
    'Não informado': ['Not provided', 'No informado'],
    'ID do recordatório': ['Recall ID', 'ID del recordatorio'],
    'Coleta atual': ['Current collection', 'Recolección actual'],
    'Data': ['Date', 'Fecha'],
    'Recordatório 24h': ['24h recall', 'Recordatorio 24h'],
    'Agrupamento': ['Grouping', 'Agrupación'],
    'Itens': ['Items', 'Ítems'],
    'Linhas lançadas': ['Rows entered', 'Filas ingresadas'],
    'Energia': ['Energy', 'Energía'],
    'Total calculado': ['Calculated total', 'Total calculado'],
    'Classificação NOVA': ['NOVA classification', 'Clasificación NOVA'],
    'Recordatório Alimentar 24h': ['24h Dietary Recall', 'Recordatorio Alimentario 24h'],
    'Lançamento alimentar e análise': ['Food entry and analysis', 'Registro alimentario y análisis'],
    'Blocos de refeição e gráficos consolidados.': ['Meal blocks and consolidated charts.', 'Bloques de comida y gráficos consolidados.'],
    'Registro alimentar': ['Food record', 'Registro alimentario'],
    'Não AUP': ['Non-UPF', 'No AUP'],
    'AUP': ['UPF', 'AUP'],
    'Refeições do recordatório': ['Recall meals', 'Comidas del recordatorio'],
    'Adicione uma refeição e lance todos os alimentos dentro do modal.': ['Add a meal and enter all foods inside the dialog.', 'Agregue una comida y registre todos los alimentos en la ventana.'],
    'Café da manhã': ['Breakfast', 'Desayuno'],
    'Lanche da manhã': ['Morning snack', 'Merienda de la mañana'],
    'Almoço': ['Lunch', 'Almuerzo'],
    'Lanche da tarde': ['Afternoon snack', 'Merienda de la tarde'],
    'Jantar': ['Dinner', 'Cena'],
    'Ceia': ['Supper', 'Colación nocturna'],
    'Extra': ['Extra', 'Extra'],
    'Adicionar refeição': ['Add meal', 'Agregar comida'],
    'Nenhuma refeição adicionada': ['No meals added', 'Ninguna comida agregada'],
    'Nenhuma refeição lançada': ['No meals entered', 'Ninguna comida registrada'],
    'Resumo dos principais nutrientes': ['Summary of main nutrients', 'Resumen de los principales nutrientes'],
    'Carboidrato total': ['Total carbohydrate', 'Carbohidrato total'],
    'Proteína': ['Protein', 'Proteína'],
    'Fibra alimentar': ['Dietary fiber', 'Fibra alimentaria'],
    'Refeições': ['Meals', 'Comidas'],
    'Gráfico de energia por processamento': ['Energy by processing level', 'Gráfico de energía por procesamiento'],
    'Gráfico de macronutrientes por processamento': ['Macronutrients by processing level', 'Gráfico de macronutrientes por procesamiento'],
    'Totais de todos os nutrientes': ['Totals for all nutrients', 'Totales de todos los nutrientes'],
    'Nutriente': ['Nutrient', 'Nutriente'],
    'Total': ['Total', 'Total'],
    'Ferramentas': ['Tools', 'Herramientas'],
    'Base, IA e registros': ['Database, AI and records', 'Base, IA y registros'],
    'Alimentos, medidas caseiras, classificação com IA e recordatórios salvos.': ['Foods, household measures, AI classification and saved recalls.', 'Alimentos, medidas caseras, clasificación con IA y recordatorios guardados.'],
    'Ações rápidas': ['Quick actions', 'Acciones rápidas'],
    'Lançamento': ['Entry', 'Registro'],
    'Nutrientes': ['Nutrients', 'Nutrientes'],
    'Classificar IA': ['AI classify', 'Clasificar IA'],
    'Recordatórios salvos': ['Saved recalls', 'Recordatorios guardados'],
    'Adicionar novo alimento não cadastrado': ['Add a new unregistered food', 'Agregar nuevo alimento no registrado'],
    'Adicionar alimento': ['Add food', 'Agregar alimento'],
    'Novo alimento': ['New food', 'Nuevo alimento'],
    'Cadastrar novo alimento': ['Register new food', 'Registrar nuevo alimento'],
    'Valores nutricionais considerados por 100 g do alimento.': ['Nutritional values per 100 g of food.', 'Valores nutricionales considerados por 100 g del alimento.'],
    'Nome do alimento:': ['Food name:', 'Nombre del alimento:'],
    'Energia (kcal):': ['Energy (kcal):', 'Energía (kcal):'],
    'Carboidrato total (g):': ['Total carbohydrate (g):', 'Carbohidrato total (g):'],
    'Proteína (g):': ['Protein (g):', 'Proteína (g):'],
    'Lipídios (g):': ['Lipids (g):', 'Lípidos (g):'],
    'Fibra alimentar (g):': ['Dietary fiber (g):', 'Fibra alimentaria (g):'],
    'Nível de processamento:': ['Processing level:', 'Nivel de procesamiento:'],
    'Selecione': ['Select', 'Seleccione'],
    'Não ultraprocessado': ['Non-ultra-processed', 'No ultraprocesado'],
    'Ultraprocessado': ['Ultra-processed', 'Ultraprocesado'],
    'Informe a energia, carboidratos, proteínas, lipídios e fibra considerando 100 g do alimento que está sendo adicionado.': [
      'Enter energy, carbohydrates, proteins, lipids and fiber per 100 g of the food being added.',
      'Informe la energía, carbohidratos, proteínas, lípidos y fibra considerando 100 g del alimento que se está agregando.'],
    'Micronutrientes (valores por 100 g)': ['Micronutrients (values per 100 g)', 'Micronutrientes (valores por 100 g)'],
    'Preencha os valores em 100 g do alimento. Todos os demais nutrientes não informados serão registrados com valor zero. Você poderá editar esses valores posteriormente na planilha.': [
      'Fill in the values per 100 g of the food. Any nutrients left blank will be recorded as zero. You can edit these values later in the spreadsheet.',
      'Complete los valores por 100 g del alimento. Los nutrientes no informados se registrarán con valor cero. Podrá editar estos valores más tarde en la planilla.'],
    'Salvar alimento': ['Save food', 'Guardar alimento'],
    'Cancelar': ['Cancel', 'Cancelar'],
    'Adicionar medida caseira por alimento': ['Add household measure per food', 'Agregar medida casera por alimento'],
    'Alimento:': ['Food:', 'Alimento:'],
    'Nome da medida:': ['Measure name:', 'Nombre de la medida:'],
    'Equivalência (g):': ['Equivalence (g):', 'Equivalencia (g):'],
    'Adicionar medida': ['Add measure', 'Agregar medida'],
    'Classificar alimento com inteligência artificial': ['Classify food with artificial intelligence', 'Clasificar alimento con inteligencia artificial'],
    'Clique no botão para utilizar a classificação do nível de processamento do alimento por IA:': [
      'Click the button to use AI-based food processing level classification:',
      'Haga clic en el botón para usar la clasificación del nivel de procesamiento del alimento por IA:'],
    'Classificar': ['Classify', 'Clasificar'],
    'Importar Excel': ['Import Excel', 'Importar Excel'],
    'Selecionar': ['Select', 'Seleccionar'],
    'ID do participante': ['Participant ID', 'ID del participante'],
    'Editar': ['Edit', 'Editar'],
    'Excluir': ['Delete', 'Eliminar'],
    'Nenhum recordatório salvo': ['No saved recalls', 'Ningún recordatorio guardado'],
    'Nenhuma refeição adicionada': ['No meals added', 'Ninguna comida agregada'],
    'Nenhuma refeição lançada': ['No meals entered', 'Ninguna comida registrada'],
    'Nome do grupo': ['Group name', 'Nombre del grupo'],
    'Salvar grupo': ['Save group', 'Guardar grupo'],
    'Duplicar refeição': ['Duplicate meal', 'Duplicar comida'],
    'Escolher destino': ['Choose destination', 'Elegir destino'],
    'Refeição de destino': ['Destination meal', 'Comida de destino'],
    'Refeição': ['Meal', 'Comida'],
    'Alimento': ['Food', 'Alimento'],
    'Todos': ['All', 'Todos'],
    'Alimentos Favoritos': ['Favorite foods', 'Alimentos favoritos'],
    'Alimentos Adicionados': ['Added foods', 'Alimentos agregados'],
    'Nome do alimento': ['Food name', 'Nombre del alimento'],
    'Origem': ['Source', 'Origen'],
    'Quantidade': ['Quantity', 'Cantidad'],
    'Calorias': ['Calories', 'Calorías'],
    'Medidas caseiras': ['Household measures', 'Medidas caseras'],
    'Medida caseira': ['Household measure', 'Medida casera'],
    'Porção': ['Portion', 'Porción'],
    'Porção (g ou mL)': ['Portion (g or mL)', 'Porción (g o mL)'],
    'Qtd.': ['Qty.', 'Cant.'],
    'Observação': ['Note', 'Observación'],
    'gramas': ['grams', 'gramos'],
    'Micronutrientes': ['Micronutrients', 'Micronutrientes'],
    'Contribuição do alimento': ['Food contribution', 'Contribución del alimento'],

    // ===== Apresentação =====
    'Conheça a UltraKcalc': ['Meet UltraKcalc', 'Conozca UltraKcalc'],
    'A solução tecnológica baseada em evidência científica para a análise do consumo de alimentos ultraprocessados.': [
      'The evidence-based technological solution for analyzing ultra-processed food consumption.',
      'La solución tecnológica basada en evidencia científica para el análisis del consumo de alimentos ultraprocesados.'],
    'Como surgiu a UltraKcalc?': ['How did UltraKcalc come about?', '¿Cómo surgió UltraKcalc?'],
    'Inteligência Artificial': ['Artificial Intelligence', 'Inteligencia Artificial'],
    'Público-alvo': ['Target audience', 'Público objetivo'],
    'Pesquisadores da área da Nutrição e da Saúde': ['Researchers in Nutrition and Health', 'Investigadores del área de Nutrición y Salud'],
    'Nutricionistas em contextos clínicos, coletivos e institucionais': ['Dietitians in clinical, community and institutional settings', 'Nutricionistas en contextos clínicos, colectivos e institucionales'],
    'Projetos de extensão universitária': ['University outreach projects', 'Proyectos de extensión universitaria'],
    'Grupos de pesquisa': ['Research groups', 'Grupos de investigación'],
    'Instituições acadêmicas': ['Academic institutions', 'Instituciones académicas'],
    'Profissionais da saúde pública interessados no monitoramento do consumo de alimentos ultraprocessados': [
      'Public health professionals interested in monitoring ultra-processed food consumption',
      'Profesionales de la salud pública interesados en monitorear el consumo de alimentos ultraprocesados'],
    'Qual é a base de dados utilizada na UltraKcalc?': ['Which database does UltraKcalc use?', '¿Cuál es la base de datos utilizada en UltraKcalc?'],

    // ===== Citação =====
    'Como citar a UltraKcalc': ['How to cite UltraKcalc', 'Cómo citar UltraKcalc'],
    'Utilize as referências oficiais para citar esta ferramenta em seus trabalhos científicos e acadêmicos.': [
      'Use the official references to cite this tool in your scientific and academic work.',
      'Utilice las referencias oficiales para citar esta herramienta en sus trabajos científicos y académicos.'],
    'Citação Sugerida': ['Suggested citation', 'Cita sugerida'],
    'Autores': ['Authors', 'Autores'],
    'Currículo Lattes': ['Lattes CV', 'Currículum Lattes'],
    'Graduando em Nutrição pela Universidade do Estado do Rio de Janeiro': [
      'Undergraduate Nutrition student at the Rio de Janeiro State University',
      'Estudiante de Nutrición en la Universidad del Estado de Río de Janeiro'],
    'Nutricionista, Mestre em Alimentação, Nutrição e Saúde (UERJ), Doutor em Ciências (UERJ)': [
      'Dietitian, MSc in Food, Nutrition and Health (UERJ), PhD in Sciences (UERJ)',
      'Nutricionista, Máster en Alimentación, Nutrición y Salud (UERJ), Doctor en Ciencias (UERJ)'],
    'Nutricionista, Professora Doutora em Alimentação, Nutrição, Saúde pela UERJ': [
      'Dietitian, Professor, PhD in Food, Nutrition and Health (UERJ)',
      'Nutricionista, Profesora Doctora en Alimentación, Nutrición y Salud por la UERJ'],
    'Nutricionista, Doutora em Ciências pela UFRJ, Professora Titular do Instituto de Nutrição (UERJ)': [
      'Dietitian, PhD in Sciences (UFRJ), Full Professor at the Institute of Nutrition (UERJ)',
      'Nutricionista, Doctora en Ciencias por la UFRJ, Profesora Titular del Instituto de Nutrición (UERJ)'],

    // ===== Manual =====
    'Guia passo a passo de todas as funções da UltraKcalc — do primeiro recordatório à comparação entre grupos.': [
      'Step-by-step guide to every UltraKcalc feature — from your first dietary recall to group comparisons.',
      'Guía paso a paso de todas las funciones de UltraKcalc: del primer recordatorio a la comparación entre grupos.'],
    'Sumário': ['Contents', 'Índice'],
    'Ações principais': ['Main actions', 'Acciones principales'],
    'O que é sincronizado': ['What gets synced', 'Qué se sincroniza'],
    '3. Corrigir um alimento já lançado': ['3. Fix a food already logged', '3. Corregir un alimento ya registrado'],
    'Editar ou excluir alimentos cadastrados': ['Edit or delete registered foods', 'Editar o eliminar alimentos registrados'],
    'Exportar apenas recordatórios específicos': ['Export only specific recalls', 'Exportar solo recordatorios específicos'],
    'Grupos': ['Groups', 'Grupos'],
    'Quando há mais de um recordatório salvo, você não precisa exportar tudo:': [
      'When more than one recall is saved, you don\u2019t need to export everything:',
      'Cuando hay más de un recordatorio guardado, no necesita exportar todo:'],
    'Não é preciso excluir e lançar de novo. Em cada linha da lista de alimentos da refeição há três botões:': [
      'There\u2019s no need to delete and re-enter. Each row in the meal\u2019s food list has three buttons:',
      'No es necesario eliminar y registrar de nuevo. Cada fila de la lista de alimentos de la comida tiene tres botones:'],
    'Visão geral': ['Overview', 'Visión general'],
    'Conta e nuvem': ['Account and cloud', 'Cuenta y nube'],
    'Montar um recordatório': ['Build a dietary recall', 'Crear un recordatorio'],
    'Alimentos e medidas': ['Foods and measures', 'Alimentos y medidas'],
    'Resultados e gráficos': ['Results and charts', 'Resultados y gráficos'],
    'Salvar, exportar e grupos': ['Save, export and groups', 'Guardar, exportar y grupos'],
    '1. Identificação': ['1. Identification', '1. Identificación'],
    '2. Refeições': ['2. Meals', '2. Comidas'],
    'Cadastrar alimento que não está na base': ['Register a food not in the database', 'Registrar un alimento que no está en la base'],
    'Medida caseira personalizada': ['Custom household measure', 'Medida casera personalizada'],
    'Classificação com inteligência artificial': ['Classification with artificial intelligence', 'Clasificación con inteligencia artificial'],
    'Conforme você lança alimentos, a análise é atualizada automaticamente:': [
      'As you enter foods, the analysis updates automatically:',
      'A medida que registra alimentos, el análisis se actualiza automáticamente:'],
    'Use sempre o mesmo e-mail para recuperar seus recordatórios. O indicador no topo do painel mostra se a conexão com a nuvem está ativa.': [
      'Always use the same e-mail to retrieve your recalls. The indicator at the top of the panel shows whether the cloud connection is active.',
      'Use siempre el mismo correo para recuperar sus recordatorios. El indicador en la parte superior del panel muestra si la conexión con la nube está activa.'],
    'O resultado mostra, lado a lado, energia e macronutrientes, a fração de energia proveniente de ultraprocessados e os gráficos de macros por processamento de cada lado.': [
      'The result shows, side by side, energy and macronutrients, the fraction of energy from ultra-processed foods, and each side\u2019s macros-by-processing charts.',
      'El resultado muestra, lado a lado, energía y macronutrientes, la fracción de energía proveniente de ultraprocesados y los gráficos de macros por procesamiento de cada lado.']
  };

  // Traduções aplicadas via innerHTML (trechos com links/negrito/spans)
  var H = {
    'Programa registrado · BR 51 2025 005845-4': [
      'Registered software · <a href="https://revistas.inpi.gov.br/pdf/Programa_de_computador2863.pdf" target="_blank" rel="noopener noreferrer">BR 51 2025 005845-4</a>',
      'Programa registrado · <a href="https://revistas.inpi.gov.br/pdf/Programa_de_computador2863.pdf" target="_blank" rel="noopener noreferrer">BR 51 2025 005845-4</a>'],
    'Patente BR 51 2025 005845-4': [
      'Patent <a href="https://revistas.inpi.gov.br/pdf/Programa_de_computador2863.pdf" target="_blank" rel="noopener noreferrer">BR 51 2025 005845-4</a>',
      'Patente <a href="https://revistas.inpi.gov.br/pdf/Programa_de_computador2863.pdf" target="_blank" rel="noopener noreferrer">BR 51 2025 005845-4</a>'],
    'Quantifique energia e nutrientes de alimentos ultraprocessados': [
      'Quantify <span style="color:#59b440">energy and nutrients</span> of <span style="color:#017d6e">ultra-processed</span> foods',
      'Cuantifique <span style="color:#59b440">energía y nutrientes</span> de alimentos <span style="color:#017d6e">ultraprocesados</span>'],

    // ===== Apresentação — parágrafos longos =====
    'A UltraKcalc (Ultra‑Processed Food Energy and Nutrients Calculator) é uma ferramenta científica desenvolvida no Instituto de Nutrição da Universidade do Estado do Rio de Janeiro (UERJ) com o objetivo de aprimorar a análise do consumo alimentar a partir da integração entre o cálculo de energia e nutrientes e a classificação dos alimentos segundo o grau de processamento. A ferramenta foi concebida para apoiar avaliações dietéticas mais precisas, padronizadas e reprodutíveis, especialmente em estudos que investigam o consumo de alimentos ultraprocessados.': [
      'UltraKcalc (Ultra-Processed Food Energy and Nutrients Calculator) is a scientific tool developed at the Institute of Nutrition of Rio de Janeiro State University (UERJ) to improve dietary intake analysis by integrating energy and nutrient calculations with food classification by processing level. The tool was designed to support more accurate, standardized and reproducible dietary assessments, especially in studies investigating ultra-processed food consumption.',
      'UltraKcalc (Ultra-Processed Food Energy and Nutrients Calculator) es una herramienta científica desarrollada en el Instituto de Nutrición de la Universidad del Estado de Río de Janeiro (UERJ) con el objetivo de mejorar el análisis del consumo alimentario integrando el cálculo de energía y nutrientes con la clasificación de los alimentos según el grado de procesamiento. La herramienta fue concebida para apoyar evaluaciones dietéticas más precisas, estandarizadas y reproducibles, especialmente en estudios que investigan el consumo de alimentos ultraprocesados.'],
    'Apesar do avanço consistente da literatura que relaciona o consumo de alimentos ultraprocessados a desfechos adversos em saúde, ainda existem limitações metodológicas importantes na forma como esse consumo é mensurado. A UltraKcalc foi desenvolvida justamente para preencher essa lacuna, oferecendo uma solução tecnológica baseada em evidência científica, capaz de reduzir vieses de classificação, aumentar a eficiência das análises e contribuir para a qualificação da produção científica e da prática profissional em nutrição.': [
      'Despite the consistent growth of literature linking ultra-processed food consumption to adverse health outcomes, important methodological limitations still exist in how this consumption is measured. UltraKcalc was developed precisely to fill this gap, offering an evidence-based technological solution capable of reducing classification bias, increasing analytical efficiency, and contributing to the quality of scientific output and professional practice in nutrition.',
      'A pesar del avance constante de la literatura que relaciona el consumo de alimentos ultraprocesados con desenlaces adversos en salud, todavía existen limitaciones metodológicas importantes en la forma en que se mide ese consumo. UltraKcalc fue desarrollada precisamente para llenar ese vacío, ofreciendo una solución tecnológica basada en evidencia científica, capaz de reducir sesgos de clasificación, aumentar la eficiencia de los análisis y contribuir a la calidad de la producción científica y de la práctica profesional en nutrición.'],
    'A UltraKcalc surgiu a partir de uma demanda metodológica concreta identificada no campo da pesquisa em nutrição, especialmente no âmbito da avaliação do consumo de alimentos ultraprocessados por meio de recordatórios alimentares de 24 horas. Embora amplamente utilizados em estudos epidemiológicos e clínicos, esses instrumentos impõem desafios significativos quando se trata da classificação dos alimentos segundo o nível de processamento. Esse processo exige análise detalhada dos ingredientes e da forma de preparo, o que torna a classificação altamente dependente do julgamento do pesquisador.': [
      'UltraKcalc emerged from a concrete methodological need identified in nutrition research, particularly in assessing ultra-processed food consumption through 24-hour dietary recalls. Although widely used in epidemiological and clinical studies, these instruments pose significant challenges when it comes to classifying foods by processing level. This process requires detailed analysis of ingredients and preparation methods, making classification highly dependent on the researcher\u2019s judgment.',
      'UltraKcalc surgió a partir de una necesidad metodológica concreta identificada en el campo de la investigación en nutrición, especialmente en la evaluación del consumo de alimentos ultraprocesados mediante recordatorios alimentarios de 24 horas. Aunque ampliamente utilizados en estudios epidemiológicos y clínicos, estos instrumentos imponen desafíos significativos en cuanto a la clasificación de los alimentos según el nivel de procesamiento. Este proceso exige un análisis detallado de los ingredientes y de la forma de preparación, lo que hace que la clasificación dependa en gran medida del juicio del investigador.'],
    'Tradicionalmente, a classificação dos alimentos segundo a classificação NOVA é realizada de forma manual, alimento por alimento, a partir da interpretação individual dos critérios conceituais da classificação. Esse procedimento, além de ser extremamente trabalhoso e demorado, está sujeito a erros operacionais e, sobretudo, a discordâncias entre pesquisadores, mesmo quando todos possuem treinamento prévio e utilizam as mesmas diretrizes teóricas. Essas inconsistências comprometem a padronização das análises, dificultam a reprodutibilidade dos estudos e representam uma limitação metodológica relevante na investigação do consumo de alimentos ultraprocessados.': [
      'Traditionally, food classification under the NOVA system is done manually, food by food, based on each researcher\u2019s individual interpretation of the classification\u2019s conceptual criteria. Besides being extremely laborious and time-consuming, this procedure is prone to operational errors and, above all, to disagreement between researchers, even when all have prior training and use the same theoretical guidelines. These inconsistencies compromise the standardization of analyses, hinder study reproducibility, and represent a significant methodological limitation in ultra-processed food consumption research.',
      'Tradicionalmente, la clasificación de los alimentos según la clasificación NOVA se realiza de forma manual, alimento por alimento, a partir de la interpretación individual de los criterios conceptuales de la clasificación. Este procedimiento, además de ser extremadamente laborioso y demorado, está sujeto a errores operativos y, sobre todo, a discrepancias entre investigadores, incluso cuando todos cuentan con formación previa y utilizan las mismas pautas teóricas. Estas inconsistencias comprometen la estandarización de los análisis, dificultan la reproducibilidad de los estudios y representan una limitación metodológica relevante en la investigación del consumo de alimentos ultraprocesados.'],
    'Diante desse cenário, foi desenvolvido um estudo científico com o objetivo de avaliar a viabilidade do uso de modelos de inteligência artificial baseados em linguagem natural na classificação de alimentos segundo a classificação NOVA. O estudo buscou verificar se esses modelos seriam capazes de reproduzir, de forma consistente, decisões classificatórias semelhantes às realizadas por um nutricionista pesquisador treinado, considerado o padrão de referência.': [
      'Given this scenario, a scientific study was developed to assess the feasibility of using natural-language artificial intelligence models to classify foods under the NOVA system. The study sought to verify whether these models could consistently reproduce classification decisions similar to those made by a trained nutritionist researcher, taken as the reference standard.',
      'Ante este escenario, se desarrolló un estudio científico con el objetivo de evaluar la viabilidad del uso de modelos de inteligencia artificial basados en lenguaje natural en la clasificación de alimentos según la clasificación NOVA. El estudio buscó verificar si estos modelos serían capaces de reproducir, de forma consistente, decisiones de clasificación similares a las realizadas por un nutricionista investigador entrenado, considerado el estándar de referencia.'],
    'Os resultados desse estudo deram origem ao artigo científico “Comparing ChatGPT and DeepSeek for ultra-processed food classification: AI models for nutritional research and dietary assessment”, publicado na revista Nutrition, e forneceram o embasamento conceitual e metodológico para o desenvolvimento da UltraKcalc. A partir dessas evidências, tornou‑se possível avançar da investigação científica para a construção de uma ferramenta aplicada, capaz de transformar um problema metodológico recorrente em uma solução tecnológica alinhada ao rigor científico, à padronização das análises e às necessidades atuais da pesquisa em nutrição.': [
      'The results of this study led to the scientific article “<a href="https://www.sciencedirect.com/science/article/abs/pii/S0899900725003831?via%3Dihub" target="_blank" rel="noopener noreferrer">Comparing ChatGPT and DeepSeek for ultra-processed food classification: AI models for nutritional research and dietary assessment</a>”, published in the journal Nutrition, which provided the conceptual and methodological foundation for developing UltraKcalc. Building on this evidence, it became possible to move from scientific investigation to building an applied tool — turning a recurring methodological problem into a technological solution aligned with scientific rigor, analytical standardization, and the current needs of nutrition research.',
      'Los resultados de este estudio dieron origen al artículo científico “<a href="https://www.sciencedirect.com/science/article/abs/pii/S0899900725003831?via%3Dihub" target="_blank" rel="noopener noreferrer">Comparing ChatGPT and DeepSeek for ultra-processed food classification: AI models for nutritional research and dietary assessment</a>”, publicado en la revista Nutrition, y proporcionaron la base conceptual y metodológica para el desarrollo de UltraKcalc. A partir de esta evidencia, fue posible avanzar de la investigación científica a la construcción de una herramienta aplicada, capaz de transformar un problema metodológico recurrente en una solución tecnológica alineada con el rigor científico, la estandarización de los análisis y las necesidades actuales de la investigación en nutrición.'],
    'A UltraKcalc integra a inteligência artificial de forma criteriosa e metodologicamente orientada ao processo de classificação de alimentos segundo o nível de processamento. Essa integração se apoia nos resultados do estudo que fundamentou o desenvolvimento da ferramenta, o qual demonstrou que o modelo ChatGPT, quando orientado por um prompt estruturado e alinhado aos critérios oficiais da classificação NOVA, apresentou desempenho muito próximo ao de um nutricionista pesquisador treinado, com elevados níveis de acurácia e concordância.': [
      'UltraKcalc integrates artificial intelligence carefully and methodologically into the process of classifying foods by processing level. This integration is grounded in the results of the study that underpinned the tool\u2019s development, which showed that the ChatGPT model, when guided by a structured prompt aligned with the official NOVA criteria, performed very close to a trained nutritionist researcher, with high levels of accuracy and agreement.',
      'UltraKcalc integra la inteligencia artificial de forma cuidadosa y metodológicamente orientada al proceso de clasificación de alimentos según el nivel de procesamiento. Esta integración se apoya en los resultados del estudio que fundamentó el desarrollo de la herramienta, el cual demostró que el modelo ChatGPT, cuando se orienta mediante un prompt estructurado y alineado con los criterios oficiales de la clasificación NOVA, presentó un desempeño muy cercano al de un nutricionista investigador entrenado, con altos niveles de precisión y concordancia.'],
    'Esses achados indicam que modelos de linguagem, quando utilizados de maneira controlada e cientificamente orientada, podem atuar como ferramentas de apoio confiáveis na avaliação dietética. Na UltraKcalc, a inteligência artificial é empregada para padronizar decisões classificatórias, reduzir erros decorrentes de interpretações individuais e aumentar a reprodutibilidade das análises, especialmente em contextos que envolvem grandes volumes de dados alimentares.': [
      'These findings indicate that language models, when used in a controlled and scientifically guided manner, can serve as reliable support tools in dietary assessment. In UltraKcalc, artificial intelligence is used to standardize classification decisions, reduce errors from individual interpretation, and increase the reproducibility of analyses, especially in contexts involving large volumes of dietary data.',
      'Estos hallazgos indican que los modelos de lenguaje, cuando se utilizan de manera controlada y con orientación científica, pueden actuar como herramientas de apoyo confiables en la evaluación dietética. En UltraKcalc, la inteligencia artificial se utiliza para estandarizar las decisiones de clasificación, reducir errores derivados de interpretaciones individuales y aumentar la reproducibilidad de los análisis, especialmente en contextos que involucran grandes volúmenes de datos alimentarios.'],
    'Além de contribuir para a padronização, a incorporação da inteligência artificial torna os processos analíticos mais eficientes, reduzindo o tempo necessário para a classificação dos alimentos sem comprometer o rigor metodológico. A IA é utilizada de forma complementar ao conhecimento técnico do nutricionista e do pesquisador, preservando o papel central do julgamento profissional e reforçando a UltraKcalc como uma aplicação responsável e inovadora da inteligência artificial na área da nutrição.': [
      'Besides contributing to standardization, incorporating artificial intelligence makes analytical processes more efficient, reducing the time needed to classify foods without compromising methodological rigor. AI is used to complement the technical knowledge of nutritionists and researchers, preserving the central role of professional judgment and reinforcing UltraKcalc as a responsible, innovative application of artificial intelligence in nutrition.',
      'Además de contribuir a la estandarización, la incorporación de la inteligencia artificial hace que los procesos analíticos sean más eficientes, reduciendo el tiempo necesario para la clasificación de los alimentos sin comprometer el rigor metodológico. La IA se utiliza de forma complementaria al conocimiento técnico del nutricionista y del investigador, preservando el papel central del juicio profesional y reforzando a UltraKcalc como una aplicación responsable e innovadora de la inteligencia artificial en el área de la nutrición.'],
    'Na prática, a inteligência artificial está integrada à UltraKcalc por meio da aba “Adicionar alimentos”, oferecendo suporte direto ao usuário no momento da inserção de novos itens alimentares. Quando o usuário não possui clareza sobre o nível de processamento de determinado alimento, a ferramenta disponibiliza um link de acesso a um modelo de ChatGPT previamente treinado, permitindo que, a partir das informações fornecidas sobre a composição, ingredientes e forma de preparo do alimento, o modelo indique o nível de processamento correspondente segundo a classificação NOVA. Esse recurso foi desenvolvido como um apoio à tomada de decisão, auxiliando o usuário a realizar classificações mais consistentes e alinhadas aos critérios científicos adotados pela ferramenta, sem substituir a análise crítica e o julgamento técnico do profissional.': [
      'In practice, artificial intelligence is integrated into UltraKcalc through the “Add foods” tab, offering direct support to the user when entering new food items. When the user is unsure about a food\u2019s processing level, the tool provides a link to a pre-trained ChatGPT model, allowing the model — based on information provided about the food\u2019s composition, ingredients and preparation method — to indicate the corresponding processing level according to the NOVA classification. This feature was designed as decision-support, helping the user make more consistent classifications aligned with the scientific criteria adopted by the tool, without replacing the professional\u2019s critical analysis and technical judgment.',
      'En la práctica, la inteligencia artificial está integrada en UltraKcalc a través de la pestaña “Agregar alimentos”, ofreciendo apoyo directo al usuario al insertar nuevos ítems alimentarios. Cuando el usuario no tiene claridad sobre el nivel de procesamiento de determinado alimento, la herramienta ofrece un enlace de acceso a un modelo de ChatGPT previamente entrenado, permitiendo que, a partir de la información proporcionada sobre la composición, los ingredientes y la forma de preparación del alimento, el modelo indique el nivel de procesamiento correspondiente según la clasificación NOVA. Este recurso fue desarrollado como apoyo a la toma de decisiones, ayudando al usuario a realizar clasificaciones más consistentes y alineadas con los criterios científicos adoptados por la herramienta, sin sustituir el análisis crítico y el juicio técnico del profesional.'],
    'A UltraKcalc utiliza como base para o cálculo de energia, macronutrientes e micronutrientes os dados da Tabela Brasileira de Composição de Alimentos (TBCA), uma referência oficial amplamente utilizada em pesquisas científicas, inquéritos alimentares e na prática profissional em nutrição no Brasil. A incorporação da TBCA à ferramenta garante padronização dos valores nutricionais, confiabilidade das estimativas e comparabilidade dos resultados com estudos nacionais, além de assegurar alinhamento com bases de dados reconhecidas e atualizadas.': [
      'UltraKcalc uses data from the <a href="https://www.tbca.net.br/" target="_blank" rel="noopener noreferrer">Brazilian Food Composition Table (TBCA)</a> as the basis for calculating energy, macronutrients and micronutrients — an official reference widely used in scientific research, dietary surveys and professional nutrition practice in Brazil. Incorporating the TBCA into the tool ensures standardized nutritional values, reliable estimates and comparability of results with national studies, while ensuring alignment with recognized, up-to-date databases.',
      'UltraKcalc utiliza como base para el cálculo de energía, macronutrientes y micronutrientes los datos de la <a href="https://www.tbca.net.br/" target="_blank" rel="noopener noreferrer">Tabla Brasileña de Composición de Alimentos (TBCA)</a>, una referencia oficial ampliamente utilizada en investigaciones científicas, encuestas alimentarias y en la práctica profesional en nutrición en Brasil. La incorporación de la TBCA a la herramienta garantiza la estandarización de los valores nutricionales, la confiabilidad de las estimaciones y la comparabilidad de los resultados con estudios nacionales, además de asegurar la alineación con bases de datos reconocidas y actualizadas.'],
    'Para além do cálculo nutricional, a UltraKcalc integra de forma estruturada a classificação dos alimentos segundo o nível de processamento, adotando como referencial conceitual a classificação NOVA, amplamente utilizada na literatura científica e em documentos de saúde pública. Cada alimento presente na TBCA foi associado a um nível de processamento específico, com base em critérios padronizados e previamente definidos, respeitando os princípios conceituais da NOVA e garantindo uniformidade na classificação dos itens alimentares.': [
      'Beyond nutritional calculation, UltraKcalc structurally integrates food classification by processing level, adopting the NOVA classification — widely used in the scientific literature and public health documents — as its conceptual framework. Each food in the TBCA was assigned a specific processing level based on standardized, pre-defined criteria, respecting NOVA\u2019s conceptual principles and ensuring consistency in food item classification.',
      'Además del cálculo nutricional, UltraKcalc integra de forma estructurada la clasificación de los alimentos según el nivel de procesamiento, adoptando como referente conceptual la clasificación NOVA, ampliamente utilizada en la literatura científica y en documentos de salud pública. Cada alimento presente en la TBCA fue asociado a un nivel de procesamiento específico, con base en criterios estandarizados y previamente definidos, respetando los principios conceptuales de la NOVA y garantizando uniformidad en la clasificación de los ítems alimentarios.'],
    'Os dados referentes à classificação do nível de processamento dos alimentos utilizados na UltraKcalc são provenientes diretamente do artigo científico que fundamentou o desenvolvimento da ferramenta, no qual os alimentos da TBCA foram classificados de forma sistemática, tendo como referência um nutricionista pesquisador treinado na aplicação da classificação NOVA. A utilização desses dados permite que a ferramenta opere com uma base de classificação previamente estruturada, reduzindo inconsistências, aumentando a reprodutibilidade das análises e minimizando variações decorrentes de interpretações individuais.': [
      'The processing-level classification data used in UltraKcalc come directly from the scientific article that underpinned the tool\u2019s development, in which TBCA foods were systematically classified using a nutritionist researcher trained in applying the NOVA classification as the reference. Using this data allows the tool to operate with a pre-structured classification base, reducing inconsistencies, increasing analysis reproducibility, and minimizing variations arising from individual interpretation.',
      'Los datos referentes a la clasificación del nivel de procesamiento de los alimentos utilizados en UltraKcalc provienen directamente del artículo científico que fundamentó el desarrollo de la herramienta, en el cual los alimentos de la TBCA fueron clasificados de forma sistemática, tomando como referencia a un nutricionista investigador entrenado en la aplicación de la clasificación NOVA. El uso de estos datos permite que la herramienta opere con una base de clasificación previamente estructurada, reduciendo inconsistencias, aumentando la reproducibilidad de los análisis y minimizando variaciones derivadas de interpretaciones individuales.'],
    'Dessa forma, a UltraKcalc consolida, em uma única plataforma, dados nutricionais quantitativos e informações estruturadas sobre o nível de processamento dos alimentos, possibilitando análises mais integradas e metodologicamente consistentes do consumo alimentar. Essa abordagem contribui para o avanço das avaliações dietéticas em contextos clínicos, acadêmicos e de saúde pública, ao oferecer uma ferramenta que articula rigor científico, padronização metodológica e aplicabilidade prática.': [
      'In this way, UltraKcalc consolidates, on a single platform, quantitative nutritional data and structured information on food processing level, enabling more integrated and methodologically consistent analyses of dietary intake. This approach contributes to advancing dietary assessments in clinical, academic and public health contexts by offering a tool that combines scientific rigor, methodological standardization and practical applicability.',
      'De esta forma, UltraKcalc consolida, en una única plataforma, datos nutricionales cuantitativos e información estructurada sobre el nivel de procesamiento de los alimentos, posibilitando análisis más integrados y metodológicamente consistentes del consumo alimentario. Este enfoque contribuye al avance de las evaluaciones dietéticas en contextos clínicos, académicos y de salud pública, al ofrecer una herramienta que articula rigor científico, estandarización metodológica y aplicabilidad práctica.'],

    // ===== Citação — aviso de patente =====
    '✉️ Contato: para sugestões, reclamações ou auxílio, escreva para ultrakcalc@uerj.br.': [
      '✉️ <strong>Contact:</strong> for suggestions, complaints or help, write to <a href="mailto:ultrakcalc@uerj.br">ultrakcalc@uerj.br</a>.',
      '✉️ <strong>Contacto:</strong> para sugerencias, reclamos o ayuda, escriba a <a href="mailto:ultrakcalc@uerj.br">ultrakcalc@uerj.br</a>.'],
    'Contato: ultrakcalc@uerj.br': [
      'Contact: <a href="mailto:ultrakcalc@uerj.br">ultrakcalc@uerj.br</a>',
      'Contacto: <a href="mailto:ultrakcalc@uerj.br">ultrakcalc@uerj.br</a>'],
    '⚖️ Proteção Intelectual: Esta ferramenta encontra-se protegida por patente BR 51 2025 005845‑4. Consulte o documento oficial neste link.': [
      '⚖️ <strong>Intellectual Property:</strong> This tool is protected by patent BR 51 2025 005845‑4. See the official document <a href="https://revistas.inpi.gov.br/pdf/Programa_de_computador2863.pdf" target="_blank" rel="noopener noreferrer" style="color: inherit;">at this link</a>.',
      '⚖️ <strong>Propiedad Intelectual:</strong> Esta herramienta está protegida por la patente BR 51 2025 005845‑4. Consulte el documento oficial <a href="https://revistas.inpi.gov.br/pdf/Programa_de_computador2863.pdf" target="_blank" rel="noopener noreferrer" style="color: inherit;">en este enlace</a>.'],

    // ===== Manual — listas e parágrafos com <span class="ui"> / <strong> =====
    'A UltraKcalc calcula energia e nutrientes de recordatórios alimentares de 24 horas (R24h) a partir da TBCA e classifica os alimentos como ultraprocessados ou não ultraprocessados. O site tem quatro áreas principais:': [
      'UltraKcalc calculates energy and nutrients from 24-hour dietary recalls (R24h) using the <a href="https://www.tbca.net.br/" target="_blank" rel="noopener noreferrer">TBCA</a> and classifies foods as <strong>ultra-processed</strong> or <strong>non-ultra-processed</strong>. The site has four main areas:',
      'UltraKcalc calcula energía y nutrientes de recordatorios alimentarios de 24 horas (R24h) a partir de la <a href="https://www.tbca.net.br/" target="_blank" rel="noopener noreferrer">TBCA</a> y clasifica los alimentos como <strong>ultraprocesados</strong> o <strong>no ultraprocesados</strong>. El sitio tiene cuatro áreas principales:'],
    'Calculadora — monte recordatórios por refeição e obtenha nutrientes, gráficos e relatórios.': [
      '<span class="ui">Calculator</span> — build dietary recalls by meal and get nutrients, charts and reports.',
      '<span class="ui">Calculadora</span> — cree recordatorios por comida y obtenga nutrientes, gráficos e informes.'],
    'Comparar — compare dois recordatórios, dois grupos, ou um recordatório contra um grupo.': [
      '<span class="ui">Compare</span> — compare two dietary recalls, two groups, or one recall against a group.',
      '<span class="ui">Comparar</span> — compare dos recordatorios, dos grupos, o un recordatorio contra un grupo.'],
    'Minha conta — crie uma conta para salvar seus dados na nuvem e acessá-los de qualquer dispositivo.': [
      '<span class="ui">My account</span> — create an account to save your data in the cloud and access it from any device.',
      '<span class="ui">Mi cuenta</span> — cree una cuenta para guardar sus datos en la nube y acceder a ellos desde cualquier dispositivo.'],
    'Apresentação e Como citar — metodologia, origem científica e referência oficial.': [
      '<span class="ui">About</span> and <span class="ui">How to cite</span> — methodology, scientific origin and official reference.',
      '<span class="ui">Presentación</span> y <span class="ui">Cómo citar</span> — metodología, origen científico y referencia oficial.'],
    'Sem conta também funciona: os recordatórios ficam salvos no navegador. A conta serve para sincronizar entre dispositivos e proteger seus dados.': [
      '<strong>It also works without an account:</strong> recalls are saved in the browser. The account is used to sync across devices and protect your data.',
      '<strong>También funciona sin cuenta:</strong> los recordatorios quedan guardados en el navegador. La cuenta sirve para sincronizar entre dispositivos y proteger sus datos.'],
    'Acesse Entrar na barra superior.': [
      'Go to <span class="ui">Sign in</span> on the top bar.',
      'Acceda a <span class="ui">Entrar</span> en la barra superior.'],
    'Informe e-mail e senha e toque em Criar conta (primeira vez) ou Entrar. Dependendo da configuração, pode ser necessário confirmar o e-mail antes do primeiro acesso.': [
      'Enter your e-mail and password and tap <span class="ui">Create account</span> (first time) or <span class="ui">Sign in</span>. Depending on the configuration, you may need to confirm your e-mail before the first access.',
      'Ingrese correo y contraseña y toque en <span class="ui">Crear cuenta</span> (primera vez) o <span class="ui">Entrar</span>. Según la configuración, puede ser necesario confirmar el correo antes del primer acceso.'],
    'Informe e-mail e senha e toque em Criar conta (primeira vez) ou Entrar.': [
      'Enter your e-mail and password and tap <span class="ui">Create account</span> (first time) or <span class="ui">Sign in</span>.',
      'Ingrese correo y contraseña y toque en <span class="ui">Crear cuenta</span> (primera vez) o <span class="ui">Entrar</span>.'],
    'Depois de entrar, use Enviar relatórios para nuvem para subir os recordatórios que já estavam salvos apenas neste navegador.': [
      'After signing in, use <span class="ui">Send reports to the cloud</span> to upload recalls that were only saved in this browser.',
      'Después de entrar, use <span class="ui">Enviar informes a la nube</span> para subir los recordatorios que solo estaban guardados en este navegador.'],
    'No topo da Calculadora, preencha Participante, Pesquisador e Data. Esses dados identificam o recordatório nos relatórios e na comparação. A classificação dos alimentos segue sempre a classificação NOVA.': [
      'At the top of the Calculator, fill in <span class="ui">Participant</span>, <span class="ui">Researcher</span> and <span class="ui">Date</span>. This data identifies the recall in reports and comparisons. Food classification always follows the <strong>NOVA classification</strong>.',
      'En la parte superior de la Calculadora, complete <span class="ui">Participante</span>, <span class="ui">Investigador</span> y <span class="ui">Fecha</span>. Estos datos identifican el recordatorio en los informes y en la comparación. La clasificación de los alimentos sigue siempre la <strong>clasificación NOVA</strong>.'],
    'No topo da Calculadora, preencha Participante, Pesquisador, Data e o padrão de classificação. Esses dados identificam o recordatório nos relatórios e na comparação.': [
      'At the top of the Calculator, fill in <span class="ui">Participant</span>, <span class="ui">Researcher</span>, <span class="ui">Date</span> and the classification standard. This data identifies the recall in reports and comparisons.',
      'En la parte superior de la Calculadora, complete <span class="ui">Participante</span>, <span class="ui">Investigador</span>, <span class="ui">Fecha</span> y el estándar de clasificación. Estos datos identifican el recordatorio en los informes y en la comparación.'],
    'Em Refeições do recordatório, escolha o tipo (café da manhã, almoço, jantar…) e toque em Adicionar refeição.': [
      'In <span class="ui">Recall meals</span>, choose the type (breakfast, lunch, dinner…) and tap <span class="ui">Add meal</span>.',
      'En <span class="ui">Comidas del recordatorio</span>, elija el tipo (desayuno, almuerzo, cena…) y toque en <span class="ui">Agregar comida</span>.'],
    'No campo Alimento, digite para buscar na base TBCA. Use as abas para filtrar e a estrela para favoritar os itens que você usa com frequência.': [
      'In the <span class="ui">Food</span> field, type to search the TBCA database. Use the tabs to filter and the star to favorite items you use often.',
      'En el campo <span class="ui">Alimento</span>, escriba para buscar en la base TBCA. Use las pestañas para filtrar y la estrella para marcar como favoritos los ítems que usa con frecuencia.'],
    'Escolha a medida caseira (ou gramas), informe a porção e a quantidade, e toque em Adicionar alimento.': [
      'Choose the <span class="ui">household measure</span> (or grams), enter the <span class="ui">portion</span> and <span class="ui">quantity</span>, and tap <span class="ui">Add food</span>.',
      'Elija la <span class="ui">medida casera</span> (o gramos), indique la <span class="ui">porción</span> y la <span class="ui">cantidad</span>, y toque en <span class="ui">Agregar alimento</span>.'],
    'Duplicar refeição: no cartão da refeição, o botão de duplicar copia todos os alimentos para outra refeição de destino — útil para dias com repetições.': [
      '<strong>Duplicate meal:</strong> on the meal card, the duplicate button copies all foods to another destination meal — useful for days with repeated meals.',
      '<strong>Duplicar comida:</strong> en la tarjeta de la comida, el botón de duplicar copia todos los alimentos a otra comida de destino — útil para días con repeticiones.'],
    'Na seção Ferramentas, toque em Adicionar alimento.': [
      'In the <span class="ui">Tools</span> section, tap <span class="ui">Add food</span>.',
      'En la sección <span class="ui">Herramientas</span>, toque en <span class="ui">Agregar alimento</span>.'],
    'Preencha nome, nível de processamento e os valores nutricionais por 100 g. Nutrientes não informados entram como zero.': [
      'Fill in the name, processing level and nutritional values <strong>per 100 g</strong>. Nutrients left blank are recorded as zero.',
      'Complete el nombre, el nivel de procesamiento y los valores nutricionales <strong>por 100 g</strong>. Los nutrientes no informados se registran como cero.'],
    'Toque em Salvar alimento — ele passa a aparecer na busca como os demais.': [
      'Tap <span class="ui">Save food</span> — it will then appear in searches like any other food.',
      'Toque en <span class="ui">Guardar alimento</span> — pasará a aparecer en la búsqueda como los demás.'],
    'Em Adicionar medida caseira por alimento, associe uma medida (ex.: "colher de sopa") e sua equivalência em gramas a um alimento específico. A medida ficará disponível no lançamento.': [
      'In <span class="ui">Add household measure per food</span>, link a measure (e.g., "tablespoon") and its gram equivalent to a specific food. The measure will then be available when logging items.',
      'En <span class="ui">Agregar medida casera por alimento</span>, asocie una medida (por ej., "cucharada") y su equivalencia en gramos a un alimento específico. La medida quedará disponible al registrar.'],
    'Se tiver dúvida sobre o nível de processamento de um alimento, use a seção Classificar alimento com inteligência artificial: ela abre um modelo de ChatGPT treinado com os critérios da classificação NOVA. Informe composição, ingredientes e forma de preparo, e use a resposta como apoio à sua decisão — o julgamento profissional continua sendo seu.': [
      'If you\u2019re unsure about a food\u2019s processing level, use the <span class="ui">Classify food with artificial intelligence</span> section: it opens a ChatGPT model trained on the NOVA classification criteria. Provide the composition, ingredients and preparation method, and use the response as support for your decision — the professional judgment remains yours.',
      'Si tiene dudas sobre el nivel de procesamiento de un alimento, use la sección <span class="ui">Clasificar alimento con inteligencia artificial</span>: abre un modelo de ChatGPT entrenado con los criterios de la clasificación NOVA. Informe la composición, los ingredientes y la forma de preparación, y use la respuesta como apoyo a su decisión — el juicio profesional sigue siendo suyo.'],
    'Resumo dos principais nutrientes — energia e macronutrientes totais do recordatório.': [
      '<strong>Summary of main nutrients</strong> — total energy and macronutrients of the recall.',
      '<strong>Resumen de los principales nutrientes</strong> — energía y macronutrientes totales del recordatorio.'],
    'Refeições — blocos expansíveis com os alimentos, macros por refeição e detalhes de micronutrientes por item.': [
      '<strong>Meals</strong> — expandable blocks with foods, macros per meal and micronutrient details per item.',
      '<strong>Comidas</strong> — bloques expandibles con los alimentos, macros por comida y detalles de micronutrientes por ítem.'],
    'Energia por processamento — gráfico com a fração de energia vinda de ultraprocessados (AUP) e não ultraprocessados.': [
      '<strong>Energy by processing level</strong> — chart with the share of energy from ultra-processed (UPF) and non-ultra-processed foods.',
      '<strong>Energía por procesamiento</strong> — gráfico con la fracción de energía proveniente de ultraprocesados (AUP) y no ultraprocesados.'],
    'Macronutrientes por processamento — carboidratos, proteínas e lipídios divididos por origem AUP × não AUP.': [
      '<strong>Macronutrients by processing level</strong> — carbohydrates, proteins and lipids split by UPF × non-UPF origin.',
      '<strong>Macronutrientes por procesamiento</strong> — carbohidratos, proteínas y lípidos divididos por origen AUP × no AUP.'],
    'Totais de todos os nutrientes — tabela completa, incluindo micronutrientes.': [
      '<strong>Totals for all nutrients</strong> — full table, including micronutrients.',
      '<strong>Totales de todos los nutrientes</strong> — tabla completa, incluyendo micronutrientes.'],
    'Salvar recordatório — guarda o recordatório atual e libera a tela para lançar outro participante.': [
      '<span class="ui">Save recall</span> — stores the current recall and frees the screen to log another participant.',
      '<span class="ui">Guardar recordatorio</span> — guarda el recordatorio actual y libera la pantalla para registrar a otro participante.'],
    'Salvar planilha — exporta a planilha completa em Excel (XLSX).': [
      '<span class="ui">Save spreadsheet</span> — exports the full spreadsheet as Excel (XLSX).',
      '<span class="ui">Guardar planilla</span> — exporta la planilla completa en Excel (XLSX).'],
    'Salvar PDF — gera um relatório em PDF com tabelas e gráficos.': [
      '<span class="ui">Save PDF</span> — generates a PDF report with tables and charts.',
      '<span class="ui">Guardar PDF</span> — genera un informe en PDF con tablas y gráficos.'],
    'Importar Excel — recarrega um recordatório exportado anteriormente.': [
      '<span class="ui">Import Excel</span> — reloads a previously exported recall.',
      '<span class="ui">Importar Excel</span> — recarga un recordatorio exportado anteriormente.'],
    'Enviar relatórios para nuvem — sincroniza os recordatórios locais com a sua conta.': [
      '<span class="ui">Send reports to the cloud</span> — syncs local recalls with your account.',
      '<span class="ui">Enviar informes a la nube</span> — sincroniza los recordatorios locales con su cuenta.'],
    'Criar grupo — agrupe recordatórios salvos (ex.: uma amostra de estudo) para analisá-los em conjunto na aba Comparar.': [
      '<span class="ui">Create group</span> — group saved recalls (e.g., a study sample) to analyze them together in the Compare tab.',
      '<span class="ui">Crear grupo</span> — agrupe recordatorios guardados (por ej., una muestra de estudio) para analizarlos en conjunto en la pestaña Comparar.'],
    'Os recordatórios salvos aparecem na seção Recordatórios salvos, de onde podem ser reabertos, agrupados ou excluídos.': [
      'Saved recalls appear in the <span class="ui">Saved recalls</span> section, where they can be reopened, grouped, or deleted.',
      'Los recordatorios guardados aparecen en la sección <span class="ui">Recordatorios guardados</span>, desde donde pueden reabrirse, agruparse o eliminarse.'],
    'Na aba Comparar, defina o lado A e o lado B: cada um pode ser um recordatório ou um grupo.': [
      'On the <span class="ui">Compare</span> tab, set side <span class="ui">A</span> and side <span class="ui">B</span>: each can be a recall or a group.',
      'En la pestaña <span class="ui">Comparar</span>, defina el lado <span class="ui">A</span> y el lado <span class="ui">B</span>: cada uno puede ser un recordatorio o un grupo.'],
    'Se houver grupos, escolha o modo de cálculo: média por recordatório ou soma total do grupo.': [
      'If there are groups, choose the calculation mode: <span class="ui">average per recall</span> or <span class="ui">group total sum</span>.',
      'Si hay grupos, elija el modo de cálculo: <span class="ui">media por recordatorio</span> o <span class="ui">suma total del grupo</span>.'],
    'Toque em Comparar.': [
      'Tap <span class="ui">Compare</span>.',
      'Toque en <span class="ui">Comparar</span>.'],
    'Recordatórios salvos — com todos os alimentos, refeições e classificações.': [
      '<strong>Saved recalls</strong> — with all foods, meals and classifications.',
      '<strong>Recordatorios guardados</strong> — con todos los alimentos, comidas y clasificaciones.'],
    'Alimentos cadastrados por você — incluindo edições e exclusões feitas depois.': [
      '<strong>Foods registered by you</strong> — including later edits and deletions.',
      '<strong>Alimentos registrados por usted</strong> — incluyendo ediciones y eliminaciones posteriores.'],
    'Medidas caseiras personalizadas e alimentos favoritos.': [
      '<strong>Custom household measures</strong> and <strong>favorite foods</strong>.',
      '<strong>Medidas caseras personalizadas</strong> y <strong>alimentos favoritos</strong>.'],
    'Envio automático: com a sessão ativa, tudo que você salvar na Calculadora já vai direto para a nuvem. O botão "Enviar relatórios para nuvem" serve para migrar dados antigos, criados antes do login — duplicatas são detectadas e ignoradas automaticamente.': [
      '<strong>Automatic upload:</strong> with an active session, everything you save in the Calculator goes straight to the cloud. The "Send reports to the cloud" button is for migrating old data created before signing in — duplicates are detected and skipped automatically.',
      '<strong>Envío automático:</strong> con la sesión activa, todo lo que guarde en la Calculadora va directo a la nube. El botón "Enviar informes a la nube" sirve para migrar datos antiguos, creados antes de iniciar sesión — los duplicados se detectan e ignoran automáticamente.'],
    'ID do participante — código ou nome que identifica quem consumiu os alimentos. É ele que aparece na lista de salvos e na aba Comparar.': [
      '<strong>Participant ID</strong> — code or name identifying who consumed the foods. It is what appears in the saved list and the Compare tab.',
      '<strong>ID del participante</strong> — código o nombre que identifica a quien consumió los alimentos. Es lo que aparece en la lista de guardados y en la pestaña Comparar.'],
    'Grupo — opcional; associe o recordatório a um grupo (ex.: "Atletas", "Controle") já no cadastro. Também é possível agrupar depois, na lista de salvos.': [
      '<strong>Group</strong> — optional; link the recall to a group (e.g., "Athletes", "Control") right at registration. You can also group later, in the saved list.',
      '<strong>Grupo</strong> — opcional; asocie el recordatorio a un grupo (ej.: "Atletas", "Control") desde el registro. También es posible agrupar después, en la lista de guardados.'],
    'Tipo de classificação — NOVA (padrão) ou POF; define como os alimentos serão classificados nos gráficos e relatórios.': [
      '<strong>Classification type</strong> — NOVA (default) or POF; defines how foods are classified in charts and reports.',
      '<strong>Tipo de clasificación</strong> — NOVA (predeterminado) o POF; define cómo se clasifican los alimentos en gráficos e informes.'],
    'Em Refeições do recordatório, escolha o tipo (café da manhã, almoço, jantar…) e toque em Adicionar refeição. Você pode adicionar quantas refeições precisar, inclusive repetidas usando o tipo Extra.': [
      'In <span class="ui">Recall meals</span>, choose the type (breakfast, lunch, dinner…) and tap <span class="ui">Add meal</span>. You can add as many meals as needed, including repeats using the <span class="ui">Extra</span> type.',
      'En <span class="ui">Comidas del recordatorio</span>, elija el tipo (desayuno, almuerzo, cena…) y toque en <span class="ui">Agregar comida</span>. Puede agregar tantas comidas como necesite, incluso repetidas usando el tipo <span class="ui">Extra</span>.'],
    'No campo Alimento, digite para buscar na base TBCA. Use as abas Todos, Favoritos e Adicionados para filtrar, e a estrela para favoritar os itens que você usa com frequência.': [
      'In the <span class="ui">Food</span> field, type to search the TBCA database. Use the <span class="ui">All</span>, <span class="ui">Favorites</span> and <span class="ui">Added</span> tabs to filter, and the star to favorite items you use often.',
      'En el campo <span class="ui">Alimento</span>, escriba para buscar en la base TBCA. Use las pestañas <span class="ui">Todos</span>, <span class="ui">Favoritos</span> y <span class="ui">Agregados</span> para filtrar, y la estrella para marcar como favoritos los ítems que usa con frecuencia.'],
    'Escolha a medida caseira (ou gramas), informe a porção e a quantidade, e toque em Adicionar alimento. Ao escolher uma medida caseira, a porção em gramas é calculada automaticamente.': [
      'Choose the <span class="ui">household measure</span> (or grams), enter the <span class="ui">portion</span> and <span class="ui">quantity</span>, and tap <span class="ui">Add food</span>. When choosing a household measure, the portion in grams is calculated automatically.',
      'Elija la <span class="ui">medida casera</span> (o gramos), indique la <span class="ui">porción</span> y la <span class="ui">cantidad</span>, y toque en <span class="ui">Agregar alimento</span>. Al elegir una medida casera, la porción en gramos se calcula automáticamente.'],
    'Repita para todos os itens da refeição. A lista com os alimentos lançados fica logo abaixo do formulário, com energia e macros de cada item.': [
      'Repeat for every item in the meal. The list of logged foods appears just below the form, with each item\u2019s energy and macros.',
      'Repita para todos los ítems de la comida. La lista de alimentos registrados aparece justo debajo del formulario, con la energía y los macros de cada ítem.'],
    'Micros — mostra a contribuição de micronutrientes daquele item.': [
      '<span class="ui">Micros</span> — shows that item\u2019s micronutrient contribution.',
      '<span class="ui">Micros</span> — muestra la contribución de micronutrientes de ese ítem.'],
    '✎ (lápis) — abre um painel para corrigir a porção e a quantidade; ao salvar, nutrientes, totais e gráficos são recalculados na hora.': [
      '<span class="ui">✎ (pencil)</span> — opens a panel to fix the <strong>portion</strong> and <strong>quantity</strong>; on save, nutrients, totals and charts are recalculated instantly.',
      '<span class="ui">✎ (lápiz)</span> — abre un panel para corregir la <strong>porción</strong> y la <strong>cantidad</strong>; al guardar, nutrientes, totales y gráficos se recalculan al instante.'],
    '× — remove o alimento da refeição.': [
      '<span class="ui">×</span> — removes the food from the meal.',
      '<span class="ui">×</span> — elimina el alimento de la comida.'],
    'Preencha o nome e o nível de processamento (ultraprocessado ou não ultraprocessado) — ele define como o alimento entra nos gráficos de AUP.': [
      'Fill in the name and the <span class="ui">processing level</span> (ultra-processed or non-ultra-processed) — it defines how the food enters the UPF charts.',
      'Complete el nombre y el <span class="ui">nivel de procesamiento</span> (ultraprocesado o no ultraprocesado) — define cómo el alimento entra en los gráficos de AUP.'],
    'Informe energia, carboidratos, proteínas, lipídios e fibra por 100 g do alimento. Role para baixo para preencher também os micronutrientes que desejar — os não informados entram como zero.': [
      'Enter energy, carbohydrates, proteins, lipids and fiber <strong>per 100 g</strong> of the food. Scroll down to also fill in any micronutrients you want — those left blank are recorded as zero.',
      'Informe energía, carbohidratos, proteínas, lípidos y fibra <strong>por 100 g</strong> del alimento. Desplácese hacia abajo para completar también los micronutrientes que desee — los no informados se registran como cero.'],
    'Toque em Salvar alimento — ele passa a aparecer na busca como os demais (aba Adicionados) e, se você estiver logado, é salvo também na nuvem.': [
      'Tap <span class="ui">Save food</span> — it will appear in searches like any other food (<span class="ui">Added</span> tab) and, if you are signed in, it is also saved to the cloud.',
      'Toque en <span class="ui">Guardar alimento</span> — aparecerá en la búsqueda como los demás (pestaña <span class="ui">Agregados</span>) y, si ha iniciado sesión, también se guarda en la nube.'],
    'Dica: os valores por 100 g geralmente estão na tabela nutricional do rótulo — atenção à porção de referência do rótulo, que muitas vezes é menor que 100 g e precisa ser convertida.': [
      '<strong>Tip:</strong> per-100 g values are usually on the label\u2019s nutrition table — watch the label\u2019s reference portion, which is often smaller than 100 g and needs converting.',
      '<strong>Consejo:</strong> los valores por 100 g suelen estar en la tabla nutricional de la etiqueta — atención a la porción de referencia de la etiqueta, que muchas veces es menor a 100 g y debe convertirse.'],
    'Na seção Ferramentas, toque em Editar alimentos cadastrados. Abre uma lista com todos os alimentos que você criou, com energia por 100 g e classificação.': [
      'In the <span class="ui">Tools</span> section, tap <span class="ui">Edit registered foods</span>. It opens a list of all the foods you created, with energy per 100 g and classification.',
      'En la sección <span class="ui">Herramientas</span>, toque en <span class="ui">Editar alimentos registrados</span>. Abre una lista con todos los alimentos que creó, con energía por 100 g y clasificación.'],
    'Editar — reabre o formulário de cadastro já preenchido com todos os valores (incluindo micronutrientes). Você pode corrigir o nome, os nutrientes, as calorias e o nível de processamento. Toque em Salvar alterações para aplicar.': [
      '<span class="ui">Edit</span> — reopens the registration form pre-filled with all values (including micronutrients). You can fix the name, nutrients, calories and processing level. Tap <span class="ui">Save changes</span> to apply.',
      '<span class="ui">Editar</span> — reabre el formulario de registro ya completado con todos los valores (incluyendo micronutrientes). Puede corregir el nombre, los nutrientes, las calorías y el nivel de procesamiento. Toque en <span class="ui">Guardar cambios</span> para aplicar.'],
    'Excluir — remove o alimento da sua base após confirmação. Ele some da busca, e a exclusão também é aplicada na nuvem se você estiver logado.': [
      '<span class="ui">Delete</span> — removes the food from your database after confirmation. It disappears from search, and the deletion is also applied in the cloud if you are signed in.',
      '<span class="ui">Eliminar</span> — quita el alimento de su base tras confirmación. Desaparece de la búsqueda, y la eliminación también se aplica en la nube si ha iniciado sesión.'],
    'Importante: editar ou excluir um alimento cadastrado não altera recordatórios já salvos — os itens lançados mantêm os valores da época do lançamento. Para atualizar um recordatório antigo, reabra-o e relance o item.': [
      '<strong>Important:</strong> editing or deleting a registered food <strong>does not change</strong> recalls already saved — logged items keep the values from when they were entered. To update an old recall, reopen it and re-enter the item.',
      '<strong>Importante:</strong> editar o eliminar un alimento registrado <strong>no altera</strong> recordatorios ya guardados — los ítems registrados mantienen los valores del momento del registro. Para actualizar un recordatorio antiguo, reábralo y vuelva a registrar el ítem.'],
    'Em Adicionar medida caseira por alimento, associe uma medida (ex.: "colher de sopa") e sua equivalência em gramas a um alimento específico. A medida ficará disponível no lançamento daquele alimento, e a conversão para gramas é feita automaticamente.': [
      'In <span class="ui">Add household measure per food</span>, link a measure (e.g., "tablespoon") and its gram equivalent to a specific food. The measure becomes available when logging that food, and the conversion to grams is automatic.',
      'En <span class="ui">Agregar medida casera por alimento</span>, asocie una medida (ej.: "cucharada") y su equivalencia en gramos a un alimento específico. La medida quedará disponible al registrar ese alimento, y la conversión a gramos es automática.'],
    'Salvar recordatório — guarda o recordatório atual e libera a tela para lançar outro participante. Com login ativo, ele já é enviado à nuvem.': [
      '<span class="ui">Save recall</span> — stores the current recall and frees the screen for another participant. With an active session, it is uploaded to the cloud right away.',
      '<span class="ui">Guardar recordatorio</span> — guarda el recordatorio actual y libera la pantalla para otro participante. Con sesión activa, se envía a la nube de inmediato.'],
    'Salvar planilha — exporta a planilha completa em Excel (XLSX), com uma aba por recordatório e os totais de todos os nutrientes.': [
      '<span class="ui">Save spreadsheet</span> — exports the full spreadsheet as Excel (XLSX), with one sheet per recall and totals for all nutrients.',
      '<span class="ui">Guardar planilla</span> — exporta la planilla completa en Excel (XLSX), con una hoja por recordatorio y los totales de todos los nutrientes.'],
    'Salvar PDF — gera um relatório em PDF com tabelas e gráficos, pronto para anexar a trabalhos e prontuários.': [
      '<span class="ui">Save PDF</span> — generates a PDF report with tables and charts, ready to attach to papers and records.',
      '<span class="ui">Guardar PDF</span> — genera un informe en PDF con tablas y gráficos, listo para adjuntar a trabajos e historias clínicas.'],
    'Importar Excel — recarrega um recordatório exportado anteriormente, inclusive de outro computador.': [
      '<span class="ui">Import Excel</span> — reloads a previously exported recall, including from another computer.',
      '<span class="ui">Importar Excel</span> — recarga un recordatorio exportado anteriormente, incluso desde otra computadora.'],
    'Na seção Recordatórios salvos, marque a caixa de seleção ao lado de cada recordatório que deseja exportar — por exemplo, só um participante ou todos os membros de um grupo específico.': [
      'In the <span class="ui">Saved recalls</span> section, tick the <strong>checkbox</strong> next to each recall you want to export — for example, just one participant or all members of a specific group.',
      'En la sección <span class="ui">Recordatorios guardados</span>, marque la <strong>casilla de selección</strong> junto a cada recordatorio que desee exportar — por ejemplo, solo un participante o todos los miembros de un grupo específico.'],
    'Toque em Salvar planilha ou Salvar PDF.': [
      'Tap <span class="ui">Save spreadsheet</span> or <span class="ui">Save PDF</span>.',
      'Toque en <span class="ui">Guardar planilla</span> o <span class="ui">Guardar PDF</span>.'],
    'A calculadora exporta apenas os selecionados. Se nenhuma caixa estiver marcada, todos os recordatórios salvos são exportados.': [
      'The calculator exports <strong>only the selected ones</strong>. If no box is ticked, all saved recalls are exported.',
      'La calculadora exporta <strong>solo los seleccionados</strong>. Si ninguna casilla está marcada, se exportan todos los recordatorios guardados.'],
    'Criar grupo — dê um nome (ex.: uma amostra de estudo) e associe recordatórios a ele, no cadastro ou na lista de salvos.': [
      '<span class="ui">Create group</span> — give it a name (e.g., a study sample) and link recalls to it, at registration or in the saved list.',
      '<span class="ui">Crear grupo</span> — déle un nombre (ej.: una muestra de estudio) y asocie recordatorios a él, en el registro o en la lista de guardados.'],
    'Grupos aparecem na aba Comparar, onde podem ser analisados por média ou soma total.': [
      'Groups appear in the <span class="ui">Compare</span> tab, where they can be analyzed by average or total sum.',
      'Los grupos aparecen en la pestaña <span class="ui">Comparar</span>, donde pueden analizarse por media o suma total.'],
    'Combinado com as caixas de seleção, o grupo também facilita exportar de uma vez todos os recordatórios de uma mesma amostra.': [
      'Combined with the checkboxes, groups also make it easy to export all recalls of the same sample at once.',
      'Combinado con las casillas de selección, el grupo también facilita exportar de una vez todos los recordatorios de una misma muestra.'],
    'Os recordatórios salvos aparecem na seção Recordatórios salvos, de onde podem ser reabertos, editados, agrupados ou excluídos.': [
      'Saved recalls appear in the <span class="ui">Saved recalls</span> section, where they can be reopened, edited, grouped, or deleted.',
      'Los recordatorios guardados aparecen en la sección <span class="ui">Recordatorios guardados</span>, desde donde pueden reabrirse, editarse, agruparse o eliminarse.'],
    'Na aba Comparar, defina o lado A e o lado B: cada um pode ser um recordatório ou um grupo. É possível comparar dois participantes, dois grupos, ou um participante contra a média de um grupo.': [
      'On the <span class="ui">Compare</span> tab, set side <span class="ui">A</span> and side <span class="ui">B</span>: each can be a recall or a group. You can compare two participants, two groups, or one participant against a group\u2019s average.',
      'En la pestaña <span class="ui">Comparar</span>, defina el lado <span class="ui">A</span> y el lado <span class="ui">B</span>: cada uno puede ser un recordatorio o un grupo. Es posible comparar dos participantes, dos grupos, o un participante contra la media de un grupo.'],
    'Se houver grupos, escolha o modo de cálculo: média por recordatório (padrão — cada recordatório pesa igual) ou soma total do grupo (valores acumulados).': [
      'If there are groups, choose the calculation mode: <span class="ui">average per recall</span> (default — every recall weighs the same) or <span class="ui">group total sum</span> (accumulated values).',
      'Si hay grupos, elija el modo de cálculo: <span class="ui">media por recordatorio</span> (predeterminado — cada recordatorio pesa igual) o <span class="ui">suma total del grupo</span> (valores acumulados).'],
    'De onde vêm os dados: a aba Comparar usa os recordatórios salvos neste navegador e, se você estiver logado, também os da nuvem — o indicador no topo mostra quantos foram carregados e a origem.': [
      '<strong>Where the data comes from:</strong> the Compare tab uses recalls saved in this browser and, if you are signed in, also those from the cloud — the indicator at the top shows how many were loaded and their source.',
      '<strong>De dónde vienen los datos:</strong> la pestaña Comparar usa los recordatorios guardados en este navegador y, si ha iniciado sesión, también los de la nube — el indicador en la parte superior muestra cuántos se cargaron y su origen.'],
    'Ao usar a UltraKcalc em trabalhos científicos, cite a ferramenta conforme a referência oficial disponível na aba Como citar. A ferramenta é registrada no INPI como programa de computador (BR 51 2025 005845‑4) e fundamentada em artigo publicado na revista Nutrition.': [
      'When using UltraKcalc in scientific work, cite the tool according to the official reference available on the <a href="citacao.html">How to cite</a> tab. The tool is registered with the Brazilian INPI as a computer program (BR 51 2025 005845‑4) and grounded in an <a href="https://www.sciencedirect.com/science/article/abs/pii/S0899900725003831?via%3Dihub" target="_blank" rel="noopener noreferrer">article published in the journal Nutrition</a>.',
      'Al usar UltraKcalc en trabajos científicos, cite la herramienta según la referencia oficial disponible en la pestaña <a href="citacao.html">Cómo citar</a>. La herramienta está registrada en el INPI como programa de computadora (BR 51 2025 005845‑4) y se fundamenta en un <a href="https://www.sciencedirect.com/science/article/abs/pii/S0899900725003831?via%3Dihub" target="_blank" rel="noopener noreferrer">artículo publicado en la revista Nutrition</a>.']
  };

  // ---------- Motor ----------
  var STORAGE_KEY = 'ukLang';
  var norm = function (s) { return (s || '').replace(/\s+/g, ' ').trim(); };
  var savedText = [];   // {node, original}
  var savedHtml = [];   // {el, original}
  var savedAttr = [];   // {el, attr, original}
  var ATTRS = ['placeholder', 'aria-label', 'title'];

  function idx(lang) { return lang === 'en' ? 0 : 1; }

  function restore() {
    savedText.forEach(function (r) { r.node.nodeValue = r.original; });
    savedHtml.forEach(function (r) { r.el.innerHTML = r.original; });
    savedAttr.forEach(function (r) { r.el.setAttribute(r.attr, r.original); });
    savedText = []; savedHtml = []; savedAttr = [];
  }

  function translateEl(el, lang) {
    if (el.nodeType !== 1) return;
    var tag = el.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || el.classList.contains('uk-langswitch')) return;

    // atributos
    ATTRS.forEach(function (a) {
      var v = el.getAttribute && el.getAttribute(a);
      if (v && T[norm(v)]) {
        savedAttr.push({ el: el, attr: a, original: v });
        el.setAttribute(a, T[norm(v)][idx(lang)]);
      }
    });

    // tradução em bloco (innerHTML) quando o texto completo do elemento bate
    var full = norm(el.textContent);
    if (H[full]) {
      savedHtml.push({ el: el, original: el.innerHTML });
      el.innerHTML = H[full][idx(lang)];
      return; // não desce na subárvore substituída
    }

    // nós de texto diretos
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 3) {
        var key = norm(n.nodeValue);
        if (key && T[key]) {
          savedText.push({ node: n, original: n.nodeValue });
          n.nodeValue = n.nodeValue.replace(key.length ? n.nodeValue.trim() : n.nodeValue, T[key][idx(lang)]);
        }
      } else if (n.nodeType === 1) {
        translateEl(n, lang);
      }
    }
  }

  function apply(lang) {
    restore();
    if (lang !== 'pt') translateEl(document.body, lang);
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : (lang === 'en' ? 'en' : 'es');
    var btns = document.querySelectorAll('.uk-langswitch button');
    btns.forEach(function (b) { b.classList.toggle('uk-lang-active', b.dataset.lang === lang); });
  }

  function setLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    apply(lang);
    document.dispatchEvent(new CustomEvent('uk:langchange', { detail: { lang: lang } }));
  }

  function currentLang() {
    try { return localStorage.getItem(STORAGE_KEY) || 'pt'; } catch (e) { return 'pt'; }
  }

  // API pública para conteúdo gerado dinamicamente por outros scripts
  // (comparar.js, conta.js etc.): t(pt, en, es) devolve a string no idioma
  // atual; onChange(fn) chama fn sempre que o idioma mudar, para re-renderizar.
  window.UltraKcalcI18n = {
    t: function (pt, en, es) {
      var lang = currentLang();
      if (lang === 'en') return en;
      if (lang === 'es') return es;
      return pt;
    },
    lang: currentLang,
    onChange: function (fn) {
      document.addEventListener('uk:langchange', function (e) { fn(e.detail.lang); });
    }
  };

  // ---------- Seletor com bandeiras ----------
  var FLAGS = {
    pt: '<svg viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" fill="#009B3A"/><polygon points="10,1.8 18,7 10,12.2 2,7" fill="#FEDF00"/><circle cx="10" cy="7" r="3" fill="#002776"/></svg>',
    en: '<svg viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" fill="#B22234"/><rect y="2" width="20" height="1.6" fill="#fff"/><rect y="5.2" width="20" height="1.6" fill="#fff"/><rect y="8.4" width="20" height="1.6" fill="#fff"/><rect y="11.6" width="20" height="1.6" fill="#fff"/><rect width="9" height="7" fill="#3C3B6E"/></svg>',
    es: '<svg viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" fill="#AA151B"/><rect y="3.5" width="20" height="7" fill="#F1BF00"/></svg>'
  };
  var LABELS = { pt: 'Português', en: 'English', es: 'Español' };

  function buildSwitcher() {
    var header = document.querySelector('header.topbar');
    if (!header || header.querySelector('.uk-langswitch')) return;

    var style = document.createElement('style');
    style.textContent =
      '.uk-langswitch{display:flex;align-items:center;gap:6px;margin-left:4px;}' +
      '.uk-langswitch button{display:flex;align-items:center;justify-content:center;min-height:0;width:32px;height:26px;padding:2px;margin:0;border:1.5px solid #DFEDDD;border-radius:7px;background:#ffffff;cursor:pointer;opacity:0.55;transition:opacity .2s ease,border-color .2s ease;}' +
      '.uk-langswitch button svg{width:22px;height:15px;border-radius:3px;display:block;}' +
      '.uk-langswitch button:hover{opacity:1;border-color:#59b440;background:#ffffff;}' +
      '.uk-langswitch button.uk-lang-active{opacity:1;border-color:#017d6e;box-shadow:0 0 0 2px rgba(1,125,110,0.15);}';
    document.head.appendChild(style);

    var box = document.createElement('div');
    box.className = 'uk-langswitch';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Idioma / Language');
    ['pt', 'en', 'es'].forEach(function (lang) {
      var b = document.createElement('button');
      b.type = 'button';
      b.dataset.lang = lang;
      b.title = LABELS[lang];
      b.setAttribute('aria-label', LABELS[lang]);
      b.innerHTML = FLAGS[lang];
      b.addEventListener('click', function () { setLang(lang); });
      box.appendChild(b);
    });

    // entra antes do botão hambúrguer (mobile) ou no fim da barra (desktop)
    var burger = header.querySelector('.uk-burger');
    if (burger) header.insertBefore(box, burger);
    else header.appendChild(box);
  }

  // Reaplica a tradução quando conteúdo dinâmico é criado depois (refeições
  // adicionadas/removidas, estados vazios, opções recém-preenchidas etc.),
  // sem entrar em loop com as próprias mutações que o tradutor provoca.
  var applyingMutation = false;
  var retranslateTimer = null;
  function scheduleRetranslate() {
    if (applyingMutation) return;
    clearTimeout(retranslateTimer);
    retranslateTimer = setTimeout(function () {
      var lang = currentLang();
      if (lang === 'pt') return;
      applyingMutation = true;
      translateEl(document.body, lang);
      applyingMutation = false;
    }, 180);
  }

  function watchDynamicContent() {
    if (!('MutationObserver' in window)) return;
    var mo = new MutationObserver(function () {
      if (applyingMutation) return;
      scheduleRetranslate();
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function init() {
    buildSwitcher();
    apply(currentLang());
    watchDynamicContent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
