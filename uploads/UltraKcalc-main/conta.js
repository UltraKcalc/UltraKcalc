(function () {
  var statusText = document.getElementById('accountStatusText');
  var statusDot = document.getElementById('accountStatusDot');
  var authForm = document.getElementById('authForm');
  var sessionPanel = document.getElementById('sessionPanel');
  var messageBox = document.getElementById('accountMessage');
  var lastUser = undefined; // undefined = ainda não carregado; null = sem sessão

  function t(pt, en, es) {
    return window.UltraKcalcI18n ? window.UltraKcalcI18n.t(pt, en, es) : pt;
  }

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
    lastUser = user;
    var cloud = window.UltraKcalcCloud;
    var configured = cloud && cloud.isConfigured && cloud.isConfigured();

    if (statusDot) statusDot.classList.remove('online');

    if (!configured) {
      if (statusText) statusText.textContent = t('Supabase nao configurado', 'Supabase not configured', 'Supabase no configurado');
      if (authForm) authForm.hidden = false;
      if (sessionPanel) sessionPanel.hidden = true;
      setAuthEnabled(false);
      setMessage(t('Preencha supabase_config.js para ativar login e cadastro.', 'Fill in supabase_config.js to enable sign-in and sign-up.', 'Complete supabase_config.js para activar el inicio de sesión y el registro.'), 'warning');
      return;
    }

    if (!cloud.getClient || !cloud.getClient()) {
      if (statusText) statusText.textContent = t('SDK do Supabase nao carregado', 'Supabase SDK not loaded', 'SDK de Supabase no cargado');
      if (authForm) authForm.hidden = false;
      if (sessionPanel) sessionPanel.hidden = true;
      setAuthEnabled(false);
      setMessage(t('Nao foi possivel carregar o cliente do Supabase.', 'Could not load the Supabase client.', 'No fue posible cargar el cliente de Supabase.'), 'warning');
      return;
    }

    setAuthEnabled(true);
    if (user) {
      if (statusText) statusText.textContent = t('Conectado: ', 'Signed in: ', 'Conectado: ') + (user.email || t('usuario', 'user', 'usuario'));
      if (statusDot) statusDot.classList.add('online');
      if (authForm) authForm.hidden = true;
      if (sessionPanel) sessionPanel.hidden = false;
      var localCounts = getLocalDataCounts(cloud);
      var totalLocal = localCounts.records + localCounts.foods + localCounts.measures;
      setMessage(totalLocal > 0
        ? t('Sessao ativa. Ha ', 'Active session. There are ', 'Sesión activa. Hay ') + totalLocal + t(' dado(s) local(is) que podem ser enviados.', ' local item(s) that can be uploaded.', ' dato(s) local(es) que se pueden enviar.')
        : t('Sessao ativa.', 'Active session.', 'Sesión activa.'),
        'success');
    } else {
      if (statusText) statusText.textContent = t('Pronto para entrar', 'Ready to sign in', 'Listo para entrar');
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
      setMessage(t('Informe e-mail e senha.', 'Enter e-mail and password.', 'Ingrese correo y contraseña.'), 'warning');
      return;
    }

    setBusy(true);
    try {
      var user = await window.UltraKcalcCloud.signIn(credentials.email, credentials.password);
      updateUi(user);
    } catch (e) {
      console.error(e);
      setMessage(t('Nao foi possivel entrar. Confira e-mail e senha.', 'Could not sign in. Check your e-mail and password.', 'No fue posible entrar. Revise el correo y la contraseña.'), 'warning');
    } finally {
      setBusy(false);
    }
  }

  async function signup() {
    var credentials = getCredentials();
    if (!credentials.email || !credentials.password) {
      setMessage(t('Informe e-mail e senha.', 'Enter e-mail and password.', 'Ingrese correo y contraseña.'), 'warning');
      return;
    }

    setBusy(true);
    try {
      var data = await window.UltraKcalcCloud.signUp(credentials.email, credentials.password);
      var user = window.UltraKcalcCloud.getCurrentUser();
      updateUi(user);
      if (data && data.session) {
        setMessage(t('Conta criada e conectada.', 'Account created and signed in.', 'Cuenta creada y conectada.'), 'success');
      } else {
        setMessage(t('Conta criada. Verifique seu e-mail antes de entrar.', 'Account created. Check your e-mail before signing in.', 'Cuenta creada. Verifique su correo antes de entrar.'), 'success');
      }
    } catch (e) {
      console.error(e);
      setMessage(t('Nao foi possivel criar a conta.', 'Could not create the account.', 'No fue posible crear la cuenta.'), 'warning');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      await window.UltraKcalcCloud.signOut();
      updateUi(null);
      setMessage(t('Voce saiu da conta.', 'You have signed out.', 'Ha salido de la cuenta.'), 'success');
    } catch (e) {
      console.error(e);
      setMessage(t('Nao foi possivel sair da conta.', 'Could not sign out.', 'No fue posible salir de la cuenta.'), 'warning');
    } finally {
      setBusy(false);
    }
  }

  function buildSyncMessage(summary) {
    var recordTotal = summary && summary.total ? summary.total : 0;
    var foodTotal = summary && summary.foodsTotal ? summary.foodsTotal : 0;
    var measureTotal = summary && summary.measuresTotal ? summary.measuresTotal : 0;
    if (!summary || (recordTotal + foodTotal + measureTotal) === 0) {
      return t('Nao ha dados locais para enviar.', 'There is no local data to upload.', 'No hay datos locales para enviar.');
    }

    var parts = [];
    if (summary.uploaded > 0) parts.push(summary.uploaded + ' ' + t('recordatorio(s)', 'dietary recall(s)', 'recordatorio(s)'));
    if (summary.foodsSynced > 0) parts.push(summary.foodsSynced + ' ' + t('alimento(s)', 'food(s)', 'alimento(s)'));
    if (summary.measuresSynced > 0) parts.push(summary.measuresSynced + ' ' + t('medida(s)', 'measure(s)', 'medida(s)'));

    var skipped = (summary.skippedCloudDuplicates || 0) +
      (summary.skippedLocalDuplicates || 0) +
      (summary.foodsSkippedLocalDuplicates || 0) +
      (summary.measuresSkippedLocalDuplicates || 0);
    var message = parts.length > 0
      ? parts.join(', ') + ' ' + t('sincronizado(s) com a nuvem.', 'synced with the cloud.', 'sincronizado(s) con la nube.')
      : t('Nenhum dado novo enviado.', 'No new data uploaded.', 'Ningún dato nuevo enviado.');
    if (skipped > 0) message += ' ' + skipped + ' ' + t('duplicata(s) ignorada(s).', 'duplicate(s) skipped.', 'duplicado(s) ignorado(s).');
    return message;
  }

  async function syncLocalRecords() {
    if (!window.UltraKcalcCloud || !window.UltraKcalcCloud.getCurrentUser || !window.UltraKcalcCloud.getCurrentUser()) {
      setMessage(t('Entre na conta para enviar os salvos locais.', 'Sign in to upload local saves.', 'Entre a la cuenta para enviar los guardados locales.'), 'warning');
      return;
    }

    var localCounts = getLocalDataCounts(window.UltraKcalcCloud);
    if (localCounts.records + localCounts.foods + localCounts.measures === 0) {
      setMessage(t('Nao ha dados locais para enviar.', 'There is no local data to upload.', 'No hay datos locales para enviar.'), 'warning');
      return;
    }

    setBusy(true);
    try {
      var summary = await window.UltraKcalcCloud.syncLocalRecordsToCloud();
      updateUi(window.UltraKcalcCloud.getCurrentUser());
      setMessage(buildSyncMessage(summary), 'success');
    } catch (e) {
      console.error(e);
      setMessage(t('Nao foi possivel enviar todos os dados locais.', 'Could not upload all local data.', 'No fue posible enviar todos los datos locales.'), 'warning');
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
      setMessage(t('Nao foi possivel iniciar a sessao.', 'Could not start the session.', 'No fue posible iniciar la sesión.'), 'warning');
    }

    if (window.UltraKcalcI18n) {
      window.UltraKcalcI18n.onChange(function () {
        if (lastUser !== undefined) updateUi(lastUser);
      });
    }
  }

  init();
})();
