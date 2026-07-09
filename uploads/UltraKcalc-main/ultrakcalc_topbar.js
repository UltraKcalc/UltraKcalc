/* UltraKcalc — Barra superior compartilhada.
   Preenche <header class="topbar"></header> com o logo, os links de
   navegação e o menu mobile (hambúrguer). */
(function () {
  var header = document.querySelector('header.topbar');
  if (!header) return;

  var links = [
    { href: 'apresentacao.html', label: 'Apresentação' },
    { href: 'citacao.html', label: 'Como citar' },
    { href: 'comparar.html', label: 'Comparar' },
    { href: 'manual.html', label: 'Manual' },
    { href: 'conta.html', label: 'Entrar', cls: 'uk-outline' },
    { href: 'calculadora.html', label: 'Usar a calculadora', cls: 'uk-cta' }
  ];

  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  function anchor(l, mobile) {
    var cls = l.cls || '';
    if (!l.ext && page === l.href.toLowerCase() && !l.cls) cls += ' uk-active';
    return '<a href="' + l.href + '"' +
      (cls ? ' class="' + cls.trim() + '"' : '') +
      (l.ext ? ' target="_blank" rel="noopener noreferrer"' : '') +
      '>' + (mobile && l.label === 'Manual' ? 'Manual do usuário' : l.label) + '</a>';
  }

  header.innerHTML =
    '<a href="index.html" class="uk-logo">' +
      '<img src="new_logo.png" alt="UltraKcalc logo">' +
      '<span><span class="uk-g">Ultra</span><span class="uk-t">Kcalc</span></span>' +
    '</a>' +
    '<nav class="uk-nav">' + links.map(function (l) { return anchor(l, false); }).join('') + '</nav>' +
    '<button class="uk-burger" type="button" aria-label="Abrir menu" aria-expanded="false">' +
      '<span></span><span></span><span></span>' +
    '</button>';

  var menu = document.createElement('nav');
  menu.className = 'uk-menu';
  // No mobile o CTA vem primeiro
  var mobileOrder = [links[5], links[0], links[1], links[2], links[3], links[4]];
  menu.innerHTML = mobileOrder.map(function (l) { return anchor(l, true); }).join('');
  document.body.appendChild(menu);

  var burger = header.querySelector('.uk-burger');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('uk-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 880) {
      menu.classList.remove('uk-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
})();
