(function () {
  var statusText = document.getElementById('accountStatusText');
  var statusDot = document.getElementById('accountStatusDot');
  var authForm = document.getElementById('authForm');
  var sessionPanel = document.getElementById('sessionPanel');
  var messageBox = document.getElementById('accountMessage');

  function setMessage(text, type) {
    if (!messageBox) return;
    messageBox.textContent = text || '';
    messageBox.className = 'account-message' + (type ? ' ' + type : '');
  }

  function setBusy(busy) {
    ['accountEmail', 'accountPassword', 'accountLoginBtn', 'accountSignupBtn', 'accountLogoutBtn', 'accountSyncLocalBtn'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.disabled = busy;
    });
  }

  function setAuthEnabled(enabled) {
    ['accountEmail', 'accountPassword', 'accountLoginBtn', 'accountSignupBtn'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.disabled = !enabled;
    });
  }

  function countCustomMeasures(measuresByFood) {
    return Object.keys(measuresByFood || {}).reduce(function (total, foodName) {
      var measures = measuresByFood[foodName];
      return total + (Array.isArray(measures) ? measures.length : 0);
    }, 0);
  }

  function getLocalDataCounts(cloud) {
    var records = cloud && cloud.getLocalRecords ? cloud.getLocalRecords().length : 0;
    var foods = cloud && cloud.getLocalCustomFoods ? cloud.getLocalCustomFoods().length : 0;
    var measuresByFood = cloud && cloud.getLocalCustomFoodMeasures ? cloud.getLocalCustomFoodMeasures() : {};
    return {
      records: records,
      foods: foods,
      measures: countCustomMeasures(measuresByFood)
    };
  }

  function updateUi(user) {
    var cloud = window.UltraKcalcCloud;
    var configured = cloud && cloud.isConfigured && cloud.isConfigured();

    if (statusDot) statusDot.classList.remove('online');

    if (!configured) {
      if (statusText) statusText.textContent = 'Supabase nao configurado';
      if (authForm) authForm.hidden = false;
      if (sessionPanel) sessionPanel.hidden = true;
      setAuthEnabled(false);
      setMessage('Preencha supabase_config.js para ativar login e cadastro.', 'warning');
      return;
    }

    if (!cloud.getClient || !cloud.getClient()) {
      if (statusText) statusText.textContent = 'SDK do Supabase nao carregado';
      if (authForm) authForm.hidden = false;
      if (sessionPanel) sessionPanel.hidden = true;
      setAuthEnabled(false);
      setMessage('Nao foi possivel carregar o cliente do Supabase.', 'warning');
      return;
    }

    setAuthEnabled(true);
    if (user) {
      if (statusText) statusText.textContent = 'Conectado: ' + (user.email || 'usuario');
      if (statusDot) statusDot.classList.add('online');
      if (authForm) authForm.hidden = true;
      if (sessionPanel) sessionPanel.hidden = false;
      var localCounts = getLocalDataCounts(cloud);
      var totalLocal = localCounts.records + localCounts.foods + localCounts.measures;
      setMessage(totalLocal > 0
        ? 'Sessao ativa. Ha ' + totalLocal + ' dado(s) local(is) que podem ser enviados.'
        : 'Sessao ativa.',
        'success');
    } else {
      if (statusText) statusText.textContent = 'Pronto para entrar';
      if (authForm) authForm.hidden = false;
      if (sessionPanel) sessionPanel.hidden = true;
      setMessage('');
    }
  }

  function getCredentials() {
    var email = document.getElementById('accountEmail');
    var password = document.getElementById('accountPassword');
    return {
      email: email ? email.value.trim() : '',
      password: password ? password.value : ''
    };
  }

  async function login() {
    var credentials = getCredentials();
    if (!credentials.email || !credentials.password) {
      setMessage('Informe e-mail e senha.', 'warning');
      return;
    }

    setBusy(true);
    try {
      var user = await window.UltraKcalcCloud.signIn(credentials.email, credentials.password);
      updateUi(user);
    } catch (e) {
      console.error(e);
      setMessage('Nao foi possivel entrar. Confira e-mail e senha.', 'warning');
    } finally {
      setBusy(false);
    }
  }

  async function signup() {
    var credentials = getCredentials();
    if (!credentials.email || !credentials.password) {
      setMessage('Informe e-mail e senha.', 'warning');
      return;
    }

    setBusy(true);
    try {
      var data = await window.UltraKcalcCloud.signUp(credentials.email, credentials.password);
      var user = window.UltraKcalcCloud.getCurrentUser();
      updateUi(user);
      if (data && data.session) {
        setMessage('Conta criada e conectada.', 'success');
      } else {
        setMessage('Conta criada. Verifique seu e-mail antes de entrar.', 'success');
      }
    } catch (e) {
      console.error(e);
      setMessage('Nao foi possivel criar a conta.', 'warning');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      await window.UltraKcalcCloud.signOut();
      updateUi(null);
      setMessage('Voce saiu da conta.', 'success');
    } catch (e) {
      console.error(e);
      setMessage('Nao foi possivel sair da conta.', 'warning');
    } finally {
      setBusy(false);
    }
  }

  function buildSyncMessage(summary) {
    var recordTotal = summary && summary.total ? summary.total : 0;
    var foodTotal = summary && summary.foodsTotal ? summary.foodsTotal : 0;
    var measureTotal = summary && summary.measuresTotal ? summary.measuresTotal : 0;
    if (!summary || (recordTotal + foodTotal + measureTotal) === 0) {
      return 'Nao ha dados locais para enviar.';
    }

    var parts = [];
    if (summary.uploaded > 0) parts.push(summary.uploaded + ' recordatorio(s)');
    if (summary.foodsSynced > 0) parts.push(summary.foodsSynced + ' alimento(s)');
    if (summary.measuresSynced > 0) parts.push(summary.measuresSynced + ' medida(s)');

    var skipped = (summary.skippedCloudDuplicates || 0) +
      (summary.skippedLocalDuplicates || 0) +
      (summary.foodsSkippedLocalDuplicates || 0) +
      (summary.measuresSkippedLocalDuplicates || 0);
    var message = parts.length > 0
      ? parts.join(', ') + ' sincronizado(s) com a nuvem.'
      : 'Nenhum dado novo enviado.';
    if (skipped > 0) message += ' ' + skipped + ' duplicata(s) ignorada(s).';
    return message;
  }

  async function syncLocalRecords() {
    if (!window.UltraKcalcCloud || !window.UltraKcalcCloud.getCurrentUser || !window.UltraKcalcCloud.getCurrentUser()) {
      setMessage('Entre na conta para enviar os salvos locais.', 'warning');
      return;
    }

    var localCounts = getLocalDataCounts(window.UltraKcalcCloud);
    if (localCounts.records + localCounts.foods + localCounts.measures === 0) {
      setMessage('Nao ha dados locais para enviar.', 'warning');
      return;
    }

    setBusy(true);
    try {
      var summary = await window.UltraKcalcCloud.syncLocalRecordsToCloud();
      updateUi(window.UltraKcalcCloud.getCurrentUser());
      setMessage(buildSyncMessage(summary), 'success');
    } catch (e) {
      console.error(e);
      setMessage('Nao foi possivel enviar todos os dados locais.', 'warning');
    } finally {
      setBusy(false);
    }
  }

  function bindEvents() {
    var loginBtn = document.getElementById('accountLoginBtn');
    var signupBtn = document.getElementById('accountSignupBtn');
    var logoutBtn = document.getElementById('accountLogoutBtn');
    var syncBtn = document.getElementById('accountSyncLocalBtn');
    var password = document.getElementById('accountPassword');

    if (loginBtn) loginBtn.addEventListener('click', login);
    if (signupBtn) signupBtn.addEventListener('click', signup);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (syncBtn) syncBtn.addEventListener('click', syncLocalRecords);
    if (password) {
      password.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') login();
      });
    }
  }

  async function init() {
    var cloud = window.UltraKcalcCloud;
    updateUi(null);
    if (!cloud || !cloud.isConfigured || !cloud.isConfigured()) return;

    bindEvents();
    cloud.onAuthStateChange(function (user) {
      updateUi(user);
    });

    try {
      var user = await cloud.init();
      updateUi(user);
    } catch (e) {
      console.error(e);
      setMessage('Nao foi possivel iniciar a sessao.', 'warning');
    }
  }

  init();
})();
