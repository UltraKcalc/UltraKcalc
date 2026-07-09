/* UltraKcalc — Rodapé compartilhado. Preenche <footer class="uk-rodape">. */
(function () {
  var footer = document.querySelector('footer.uk-rodape');
  if (!footer) {
    footer = document.createElement('footer');
    footer.className = 'uk-rodape';
    document.body.appendChild(footer);
  }
  footer.innerHTML =
    '<div class="uk-rodape-conteudo">' +
      '<div class="uk-rodape-colunas">' +
        '<div class="uk-rodape-marca">' +
          '<div class="uk-logo-linha">' +
            '<img src="new_logo.png" alt="UltraKcalc logo">' +
            '<span class="uk-nome"><span class="uk-g">Ultra</span><span class="uk-k">Kcalc</span></span>' +
          '</div>' +
          '<p>Ultra-Processed Food Energy and Nutrients Calculator. Desenvolvida no Instituto de Nutri\u00e7\u00e3o da Universidade do Estado do Rio de Janeiro (UERJ).</p>' +
          '<p class="uk-patente">Patente <a href="https://revistas.inpi.gov.br/pdf/Programa_de_computador2863.pdf" target="_blank" rel="noopener noreferrer">BR 51 2025 005845-4</a></p>' +
          '<p class="uk-contato">Contato: <a href="mailto:ultrakcalc@uerj.br">ultrakcalc@uerj.br</a></p>' +
        '</div>' +
        '<div class="uk-rodape-citacao">' +
          '<h3>Como citar</h3>' +
          '<p>OLASAGASTI, F.; COELHO, G. M. O.; KOURY, J. C.; CATTEM, M. V. O. <em>Ultra-Processed Food Energy and Nutrients Calculator (UltraKcalc)</em>. Instituto de Nutri\u00e7\u00e3o, Universidade do Estado do Rio de Janeiro.</p>' +
          '<a href="citacao.html">Ver refer\u00eancia completa \u2192</a>' +
        '</div>' +
      '</div>' +
      '<div class="uk-rodape-base">' +
        '<span class="uk-copy">\u00a9 2026 UltraKcalc \u00b7 Instituto de Nutri\u00e7\u00e3o \u00b7 UERJ</span>' +
        '<nav>' +
          '<a href="apresentacao.html">Apresenta\u00e7\u00e3o</a>' +
          '<a href="citacao.html">Como citar</a>' +
          '<a href="calculadora.html">Calculadora</a>' +
          '<a href="comparar.html">Comparar</a>' +
        '</nav>' +
      '</div>' +
    '</div>';
})();
