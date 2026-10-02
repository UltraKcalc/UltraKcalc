// Medidas caseiras adicionais conferidas nas páginas individuais da TBCA.
// A base mantém os valores publicados, sem estimativas ou extrapolações.
var tbcaCurrentAdditionalMeasureOptions = {
  "Acelga, cozida, drenada, s/ óleo, c/ sal,": [
    { name: "Colher sopa cheia", grams: 25, unit: "g", label: "Colher sopa cheia (25 g)" }
  ],
  "Araça, polpa, com casca, sem semente, in natura, Psidium cattleianum,": [
    { name: "Porção média", grams: 50, unit: "g", label: "Porção média (50 g)" }
  ],
  "Arroz com jambu, c/ arroz integral, c/ sal, (arroz integral, jambu, c/ óleo, cebola e alho, c/ sal),": [
    { name: "Colher servir cheia", grams: 55, unit: "g", label: "Colher servir cheia (55 g)" },
    { name: "Colher servir rasa", grams: 40, unit: "g", label: "Colher servir rasa (40 g)" }
  ]
};

if (typeof foodMeasureOptions !== "undefined" && foodMeasureOptions) {
  Object.keys(tbcaCurrentAdditionalMeasureOptions).forEach(function(foodName) {
    var existing = foodMeasureOptions[foodName] || [];
    tbcaCurrentAdditionalMeasureOptions[foodName].forEach(function(measure) {
      var duplicate = existing.some(function(current) {
        return current.name === measure.name && current.grams === measure.grams && current.unit === measure.unit;
      });
      if (!duplicate) existing.push(measure);
    });
    foodMeasureOptions[foodName] = existing;
  });
}
