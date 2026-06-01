(function () {
  var client = null;
  var currentUser = null;

  function getConfig() {
    return window.ULTRAKCALC_SUPABASE_CONFIG || {};
  }

  function hasRealValue(value) {
    return typeof value === 'string' && value.trim() && value.indexOf('YOUR_') === -1;
  }

  function isConfigured() {
    var config = getConfig();
    return hasRealValue(config.url) && hasRealValue(config.anonKey);
  }

  function getClient() {
    if (client) return client;
    if (!isConfigured() || !window.supabase || !window.supabase.createClient) return null;

    var config = getConfig();
    client = window.supabase.createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return client;
  }

  async function init() {
    var supabaseClient = getClient();
    if (!supabaseClient) return null;

    var result = await supabaseClient.auth.getSession();
    currentUser = result && result.data && result.data.session
      ? result.data.session.user
      : null;
    return currentUser;
  }

  function onAuthStateChange(callback) {
    var supabaseClient = getClient();
    if (!supabaseClient) return null;

    return supabaseClient.auth.onAuthStateChange(function (_event, session) {
      currentUser = session && session.user ? session.user : null;
      if (typeof callback === 'function') callback(currentUser);
    });
  }

  async function signIn(email, password) {
    var supabaseClient = getClient();
    if (!supabaseClient) throw new Error('Supabase nao configurado.');

    var result = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });
    if (result.error) throw result.error;
    currentUser = result.data && result.data.user ? result.data.user : null;
    return currentUser;
  }

  async function signUp(email, password) {
    var supabaseClient = getClient();
    if (!supabaseClient) throw new Error('Supabase nao configurado.');

    var result = await supabaseClient.auth.signUp({
      email: email,
      password: password
    });
    if (result.error) throw result.error;
    currentUser = result.data && result.data.session && result.data.session.user
      ? result.data.session.user
      : currentUser;
    return result.data;
  }

  async function signOut() {
    var supabaseClient = getClient();
    if (!supabaseClient) return;

    var result = await supabaseClient.auth.signOut({ scope: 'local' });
    if (result.error) throw result.error;
    currentUser = null;
  }

  function toDbRecord(session, sortOrder) {
    var userId = currentUser && currentUser.id ? currentUser.id : undefined;
    var payload = {
      participant_id: session.participantId || '',
      researcher_id: session.researcherId || '',
      record_group: session.recordGroup || 'Individual',
      recall_date: session.date || null,
      classification_type: session.classificationType || 'NOVA',
      record_signature: createRecordSignature(session)
    };
    if (typeof sortOrder === 'number') payload.sort_order = sortOrder;
    if (userId) payload.user_id = userId;
    return payload;
  }

  function normalizeText(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function normalizeValue(value) {
    if (value === null || typeof value === 'undefined' || value === '') return '';
    var num = typeof value === 'number'
      ? value
      : parseFloat(String(value).replace(',', '.'));
    if (isFinite(num)) return Number(num.toFixed(4));
    return normalizeText(value);
  }

  function normalizeNutrients(nutrients) {
    var normalized = {};
    Object.keys(nutrients || {}).sort().forEach(function (key) {
      normalized[normalizeText(key)] = normalizeValue(nutrients[key]);
    });
    return normalized;
  }

  function hashString(value) {
    var h1 = 0xdeadbeef;
    var h2 = 0x41c6ce57;

    for (var i = 0; i < value.length; i++) {
      var ch = value.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
      Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
      Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return (h2 >>> 0).toString(16).padStart(8, '0') +
      (h1 >>> 0).toString(16).padStart(8, '0');
  }

  function createRecordCanonicalValue(session) {
    var records = (session.records || []).map(function (item) {
      return {
        meal: normalizeText(item.meal),
        food: normalizeText(item.food),
        unit: normalizeText(item.unit),
        portion: normalizeValue(item.portion),
        qty: normalizeValue(item.qty),
        obs: normalizeText(item.obs),
        classNova: normalizeText(item.classNova),
        classPof: normalizeText(item.classPof),
        nutrients: normalizeNutrients(item.nutrients)
      };
    });

    return {
      participantId: normalizeText(session.participantId),
      researcherId: normalizeText(session.researcherId),
      date: normalizeText(session.date),
      classificationType: normalizeText(session.classificationType || 'NOVA'),
      records: records
    };
  }

  function createRecordSignature(session) {
    return 'v1:' + hashString(JSON.stringify(createRecordCanonicalValue(session)));
  }

  function getLocalRecords() {
    try {
      var stored = localStorage.getItem('ultrakcalc_allRecords');
      if (!stored) return [];
      var parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (session) { return !session.cloudId; });
    } catch (e) {
      return [];
    }
  }

  function clearLocalRecords() {
    localStorage.removeItem('ultrakcalc_allRecords');
  }

  function toDbItems(recordatorioId, records) {
    return (records || []).map(function (item, index) {
      return {
        recordatorio_id: recordatorioId,
        meal: item.meal || '',
        food: item.food || '',
        unit: item.unit || '',
        portion: item.portion || '',
        qty: item.qty || '',
        obs: item.obs || '',
        nutrients: item.nutrients || {},
        class_nova: item.classNova || '',
        class_pof: item.classPof || '',
        item_order: index
      };
    });
  }

  function fromDbRecord(row, itemsByRecordatorio) {
    var items = itemsByRecordatorio[row.id] || [];
    items.sort(function (a, b) {
      return (a.item_order || 0) - (b.item_order || 0);
    });

    return {
      cloudId: row.id,
      participantId: row.participant_id || '',
      researcherId: row.researcher_id || '',
      recordGroup: row.record_group || 'Individual',
      date: row.recall_date || '',
      classificationType: row.classification_type || 'NOVA',
      records: items.map(function (item) {
        return {
          meal: item.meal || '',
          food: item.food || '',
          unit: item.unit || '',
          portion: item.portion || '',
          qty: item.qty || '',
          obs: item.obs || '',
          nutrients: item.nutrients || {},
          classNova: item.class_nova || '',
          classPof: item.class_pof || ''
        };
      })
    };
  }

  async function fetchRecords() {
    var supabaseClient = getClient();
    if (!supabaseClient || !currentUser) return [];

    var recordsResult = await supabaseClient
      .from('recordatorios')
      .select('id, participant_id, researcher_id, record_group, recall_date, classification_type, sort_order, created_at')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (recordsResult.error) throw recordsResult.error;

    var dbRecords = recordsResult.data || [];
    if (dbRecords.length === 0) return [];

    var ids = dbRecords.map(function (row) { return row.id; });
    var itemsResult = await supabaseClient
      .from('recordatorio_items')
      .select('recordatorio_id, meal, food, unit, portion, qty, obs, nutrients, class_nova, class_pof, item_order')
      .in('recordatorio_id', ids)
      .order('item_order', { ascending: true });

    if (itemsResult.error) throw itemsResult.error;

    var itemsByRecordatorio = {};
    (itemsResult.data || []).forEach(function (item) {
      if (!itemsByRecordatorio[item.recordatorio_id]) {
        itemsByRecordatorio[item.recordatorio_id] = [];
      }
      itemsByRecordatorio[item.recordatorio_id].push(item);
    });

    return dbRecords.map(function (row) {
      return fromDbRecord(row, itemsByRecordatorio);
    });
  }

  async function saveRecord(session, sortOrder) {
    var supabaseClient = getClient();
    if (!supabaseClient || !currentUser) throw new Error('Entre na conta para salvar na nuvem.');

    var signature = createRecordSignature(session);
    var existingResult = await supabaseClient
      .from('recordatorios')
      .select('id')
      .eq('record_signature', signature)
      .maybeSingle();

    if (existingResult.error) throw existingResult.error;
    if (existingResult.data && existingResult.data.id) {
      var existingUpdate = await supabaseClient
        .from('recordatorios')
        .update({
          participant_id: session.participantId || '',
          researcher_id: session.researcherId || '',
          record_group: session.recordGroup || 'Individual',
          recall_date: session.date || null,
          classification_type: session.classificationType || 'NOVA'
        })
        .eq('id', existingResult.data.id);
      if (existingUpdate.error) throw existingUpdate.error;
      return existingResult.data.id;
    }

    var recordResult = await supabaseClient
      .from('recordatorios')
      .insert(toDbRecord(session, sortOrder))
      .select('id')
      .single();

    if (recordResult.error) throw recordResult.error;

    var items = toDbItems(recordResult.data.id, session.records || []);
    if (items.length > 0) {
      var itemsResult = await supabaseClient
        .from('recordatorio_items')
        .insert(items);
      if (itemsResult.error) throw itemsResult.error;
    }

    return recordResult.data.id;
  }

  async function updateRecord(recordId, session) {
    var supabaseClient = getClient();
    if (!supabaseClient || !currentUser) throw new Error('Entre na conta para atualizar na nuvem.');

    var recordResult = await supabaseClient
      .from('recordatorios')
      .update(toDbRecord(session))
      .eq('id', recordId)
      .select('id')
      .single();

    if (recordResult.error) throw recordResult.error;

    var deleteItemsResult = await supabaseClient
      .from('recordatorio_items')
      .delete()
      .eq('recordatorio_id', recordId);
    if (deleteItemsResult.error) throw deleteItemsResult.error;

    var items = toDbItems(recordId, session.records || []);
    if (items.length > 0) {
      var itemsResult = await supabaseClient
        .from('recordatorio_items')
        .insert(items);
      if (itemsResult.error) throw itemsResult.error;
    }

    return recordId;
  }

  async function deleteRecord(recordId) {
    var supabaseClient = getClient();
    if (!supabaseClient || !currentUser) throw new Error('Entre na conta para excluir na nuvem.');

    var result = await supabaseClient
      .from('recordatorios')
      .delete()
      .eq('id', recordId);

    if (result.error) throw result.error;
  }

  async function updateRecordOrder(records) {
    var supabaseClient = getClient();
    if (!supabaseClient || !currentUser) return;

    var updates = (records || [])
      .filter(function (session) { return session.cloudId; })
      .map(function (session, index) {
        return supabaseClient
          .from('recordatorios')
          .update({ sort_order: index })
          .eq('id', session.cloudId);
      });

    var results = await Promise.all(updates);
    var failed = results.find(function (result) { return result.error; });
    if (failed) throw failed.error;
  }

  async function syncLocalRecordsToCloud() {
    if (!getClient() || !currentUser) {
      throw new Error('Entre na conta para enviar os salvos locais.');
    }

    var localRecords = getLocalRecords();
    var summary = {
      total: localRecords.length,
      uploaded: 0,
      skippedCloudDuplicates: 0,
      skippedLocalDuplicates: 0
    };

    if (localRecords.length === 0) return summary;

    var cloudRecords = await fetchRecords();
    var cloudSignatures = {};
    cloudRecords.forEach(function (session) {
      cloudSignatures[createRecordSignature(session)] = true;
    });

    var localSignatures = {};
    for (var i = 0; i < localRecords.length; i++) {
      var session = localRecords[i];
      var signature = createRecordSignature(session);

      if (cloudSignatures[signature]) {
        summary.skippedCloudDuplicates++;
        continue;
      }
      if (localSignatures[signature]) {
        summary.skippedLocalDuplicates++;
        continue;
      }

      await saveRecord(session, cloudRecords.length + summary.uploaded);
      localSignatures[signature] = true;
      cloudSignatures[signature] = true;
      summary.uploaded++;
    }

    clearLocalRecords();
    return summary;
  }

  window.UltraKcalcCloud = {
    isConfigured: isConfigured,
    init: init,
    onAuthStateChange: onAuthStateChange,
    getClient: getClient,
    getCurrentUser: function () { return currentUser; },
    signIn: signIn,
    signUp: signUp,
    signOut: signOut,
    fetchRecords: fetchRecords,
    saveRecord: saveRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord,
    updateRecordOrder: updateRecordOrder,
    createRecordSignature: createRecordSignature,
    getLocalRecords: getLocalRecords,
    clearLocalRecords: clearLocalRecords,
    syncLocalRecordsToCloud: syncLocalRecordsToCloud
  };
})();
