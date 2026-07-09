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

  function getLocalCustomFoods() {
    try {
      var stored = localStorage.getItem('ultrakcalc_customFoods');
      if (!stored) return [];
      var parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function getLocalCustomFoodMeasures() {
    try {
      var stored = localStorage.getItem('ultrakcalc_customFoodMeasures');
      if (!stored) return {};
      var parsed = JSON.parse(stored);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function getLocalFavoriteFoods() {
    try {
      var stored = localStorage.getItem('ultrakcalc_favoriteFoods');
      if (!stored) return [];
      var parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
      if (parsed && typeof parsed === 'object') {
        return Object.keys(parsed).map(function (key) { return parsed[key]; }).filter(Boolean);
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  function getMeasureLabel(measure) {
    if (!measure) return '';
    if (measure.label) return measure.label;
    var grams = parseFloat(measure.grams);
    var amount = isFinite(grams) ? String(Number(grams.toFixed(2))).replace(/\.0+$/, '') : '';
    var unit = measure.unit || 'g';
    return (measure.name || 'Medida') + (amount ? ' (' + amount + ' ' + unit + ')' : '');
  }

  function countFoodMeasures(measuresByFood) {
    return Object.keys(measuresByFood || {}).reduce(function (count, foodName) {
      var measures = measuresByFood[foodName];
      return count + (Array.isArray(measures) ? measures.length : 0);
    }, 0);
  }

  function toDbCustomFood(food) {
    var userId = currentUser && currentUser.id ? currentUser.id : undefined;
    var foodData = Object.assign({}, food || {});
    var name = foodData['Alimento'] || foodData.name || '';
    var processingLevel = foodData.customProcessingLevel || 'nonUltra';
    foodData['Alimento'] = name;
    foodData.customAdded = true;
    foodData.customProcessingLevel = processingLevel;

    var payload = {
      name: name,
      normalized_name: normalizeText(name),
      processing_level: processingLevel,
      food_data: foodData
    };
    if (userId) payload.user_id = userId;
    return payload;
  }

  function fromDbCustomFood(row) {
    var food = Object.assign({}, row.food_data || {});
    food['Alimento'] = food['Alimento'] || row.name || '';
    food.customAdded = true;
    food.customProcessingLevel = row.processing_level || food.customProcessingLevel || 'nonUltra';
    return food;
  }

  function toDbCustomFoodMeasure(foodName, measure) {
    var userId = currentUser && currentUser.id ? currentUser.id : undefined;
    var label = getMeasureLabel(measure);
    var payload = {
      food_name: foodName || '',
      normalized_food_name: normalizeText(foodName),
      measure_name: measure && measure.name ? measure.name : label,
      grams: parseFloat(measure && measure.grams) || 0,
      unit: measure && measure.unit ? measure.unit : 'g',
      label: label,
      normalized_label: normalizeText(label)
    };
    if (userId) payload.user_id = userId;
    return payload;
  }

  function toDbFavoriteFood(foodName) {
    var userId = currentUser && currentUser.id ? currentUser.id : undefined;
    var name = String(foodName || '').trim();
    var payload = {
      food_name: name,
      normalized_name: normalizeText(name)
    };
    if (userId) payload.user_id = userId;
    return payload;
  }

  function fromDbCustomFoodMeasures(rows) {
    var measuresByFood = {};
    (rows || []).forEach(function (row) {
      var foodName = row.food_name || '';
      if (!foodName) return;
      measuresByFood[foodName] = measuresByFood[foodName] || [];
      measuresByFood[foodName].push({
        name: row.measure_name || row.label || '',
        grams: parseFloat(row.grams) || 0,
        unit: row.unit || 'g',
        label: row.label || ''
      });
    });
    return measuresByFood;
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

    // O PostgREST limita cada consulta a ~1000 linhas; com muitos recordatorios
    // os itens finais (refeicoes mais tardias) eram cortados silenciosamente.
    // Buscamos os itens em paginas ate esgotar.
    var PAGE = 1000;
    var allItems = [];
    var from = 0;
    while (true) {
      var itemsResult = await supabaseClient
        .from('recordatorio_items')
        .select('recordatorio_id, meal, food, unit, portion, qty, obs, nutrients, class_nova, class_pof, item_order')
        .in('recordatorio_id', ids)
        .order('item_order', { ascending: true })
        .range(from, from + PAGE - 1);

      if (itemsResult.error) throw itemsResult.error;
      var page = itemsResult.data || [];
      allItems = allItems.concat(page);
      if (page.length < PAGE) break;
      from += PAGE;
    }

    var itemsByRecordatorio = {};
    allItems.forEach(function (item) {
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

  async function fetchCustomFoods() {
    var supabaseClient = getClient();
    if (!supabaseClient || !currentUser) return [];

    var result = await supabaseClient
      .from('custom_foods')
      .select('id, name, processing_level, food_data, updated_at')
      .order('name', { ascending: true });

    if (result.error) throw result.error;
    return (result.data || []).map(fromDbCustomFood);
  }

  async function saveCustomFood(food) {
    var supabaseClient = getClient();
    if (!supabaseClient || !currentUser) throw new Error('Entre na conta para salvar o alimento na nuvem.');

    var payload = toDbCustomFood(food);
    if (!payload.name || !payload.normalized_name) {
      throw new Error('Nome do alimento personalizado ausente.');
    }

    var result = await supabaseClient
      .from('custom_foods')
      .upsert(payload, { onConflict: 'user_id,normalized_name' })
      .select('id')
      .single();

    if (result.error) throw result.error;
    return result.data && result.data.id;
  }

  async function deleteCustomFood(foodName) {
    var supabaseClient = getClient();
    if (!supabaseClient || !currentUser) throw new Error('Entre na conta para excluir o alimento na nuvem.');

    var normalized = normalizeText(foodName);
    if (!normalized) return false;

    var result = await supabaseClient
      .from('custom_foods')
      .delete()
      .eq('normalized_name', normalized);

    if (result.error) throw result.error;
    return true;
  }

  async function fetchCustomFoodMeasures() {
    var supabaseClient = getClient();
    if (!supabaseClient || !currentUser) return {};

    var result = await supabaseClient
      .from('custom_food_measures')
      .select('food_name, measure_name, grams, unit, label, updated_at')
      .order('food_name', { ascending: true })
      .order('label', { ascending: true });

    if (result.error) throw result.error;
    return fromDbCustomFoodMeasures(result.data || []);
  }

  async function saveCustomFoodMeasure(foodName, measure) {
    var supabaseClient = getClient();
    if (!supabaseClient || !currentUser) throw new Error('Entre na conta para salvar a medida na nuvem.');

    var payload = toDbCustomFoodMeasure(foodName, measure);
    if (!payload.food_name || !payload.normalized_food_name || !payload.label || payload.grams <= 0) {
      throw new Error('Dados da medida caseira incompletos.');
    }

    var result = await supabaseClient
      .from('custom_food_measures')
      .upsert(payload, { onConflict: 'user_id,normalized_food_name,normalized_label' })
      .select('id')
      .single();

    if (result.error) throw result.error;
    return result.data && result.data.id;
  }

  async function fetchFavoriteFoods() {
    var supabaseClient = getClient();
    if (!supabaseClient || !currentUser) return [];

    var result = await supabaseClient
      .from('favorite_foods')
      .select('food_name, updated_at')
      .order('food_name', { ascending: true });

    if (result.error) throw result.error;
    return (result.data || []).map(function (row) { return row.food_name; }).filter(Boolean);
  }

  async function saveFavoriteFood(foodName) {
    var supabaseClient = getClient();
    if (!supabaseClient || !currentUser) throw new Error('Entre na conta para salvar o favorito na nuvem.');

    var payload = toDbFavoriteFood(foodName);
    if (!payload.food_name || !payload.normalized_name) {
      throw new Error('Nome do alimento favorito ausente.');
    }

    var result = await supabaseClient
      .from('favorite_foods')
      .upsert(payload, { onConflict: 'user_id,normalized_name' })
      .select('id')
      .single();

    if (result.error) throw result.error;
    return result.data && result.data.id;
  }

  async function deleteFavoriteFood(foodName) {
    var supabaseClient = getClient();
    if (!supabaseClient || !currentUser) throw new Error('Entre na conta para remover o favorito da nuvem.');

    var payload = toDbFavoriteFood(foodName);
    if (!payload.normalized_name) return false;

    var result = await supabaseClient
      .from('favorite_foods')
      .delete()
      .eq('normalized_name', payload.normalized_name);

    if (result.error) throw result.error;
    return true;
  }

  async function syncLocalCustomFoodsToCloud() {
    if (!getClient() || !currentUser) {
      throw new Error('Entre na conta para enviar alimentos locais.');
    }

    var localFoods = getLocalCustomFoods();
    var summary = {
      total: localFoods.length,
      synced: 0,
      skippedLocalDuplicates: 0
    };
    var seen = {};

    for (var i = 0; i < localFoods.length; i++) {
      var food = localFoods[i];
      var name = food && (food['Alimento'] || food.name);
      var normalized = normalizeText(name);
      if (!normalized) continue;
      if (seen[normalized]) {
        summary.skippedLocalDuplicates++;
        continue;
      }
      await saveCustomFood(food);
      seen[normalized] = true;
      summary.synced++;
    }

    return summary;
  }

  async function syncLocalCustomFoodMeasuresToCloud() {
    if (!getClient() || !currentUser) {
      throw new Error('Entre na conta para enviar medidas locais.');
    }

    var measuresByFood = getLocalCustomFoodMeasures();
    var summary = {
      total: countFoodMeasures(measuresByFood),
      synced: 0,
      skippedLocalDuplicates: 0
    };
    var seen = {};
    var foodNames = Object.keys(measuresByFood || {});

    for (var i = 0; i < foodNames.length; i++) {
      var foodName = foodNames[i];
      var measures = Array.isArray(measuresByFood[foodName]) ? measuresByFood[foodName] : [];
      for (var j = 0; j < measures.length; j++) {
        var measure = measures[j];
        var normalizedFood = normalizeText(foodName);
        var normalizedLabel = normalizeText(getMeasureLabel(measure));
        if (!normalizedFood || !normalizedLabel) continue;
        var key = normalizedFood + '::' + normalizedLabel;
        if (seen[key]) {
          summary.skippedLocalDuplicates++;
          continue;
        }
        await saveCustomFoodMeasure(foodName, measure);
        seen[key] = true;
        summary.synced++;
      }
    }

    return summary;
  }

  async function syncLocalFavoriteFoodsToCloud() {
    if (!getClient() || !currentUser) {
      throw new Error('Entre na conta para enviar favoritos locais.');
    }

    var favorites = getLocalFavoriteFoods();
    var summary = {
      total: favorites.length,
      synced: 0,
      skippedLocalDuplicates: 0
    };
    var seen = {};

    for (var i = 0; i < favorites.length; i++) {
      var foodName = favorites[i];
      var normalized = normalizeText(foodName);
      if (!normalized) continue;
      if (seen[normalized]) {
        summary.skippedLocalDuplicates++;
        continue;
      }
      await saveFavoriteFood(foodName);
      seen[normalized] = true;
      summary.synced++;
    }

    return summary;
  }

  async function syncLocalRecordsToCloud() {
    if (!getClient() || !currentUser) {
      throw new Error('Entre na conta para enviar os salvos locais.');
    }

    var localRecords = getLocalRecords();
    var foodSummary = await syncLocalCustomFoodsToCloud();
    var measureSummary = await syncLocalCustomFoodMeasuresToCloud();
    var favoriteSummary = await syncLocalFavoriteFoodsToCloud();
    var summary = {
      total: localRecords.length,
      uploaded: 0,
      skippedCloudDuplicates: 0,
      skippedLocalDuplicates: 0,
      foodsTotal: foodSummary.total,
      foodsSynced: foodSummary.synced,
      foodsSkippedLocalDuplicates: foodSummary.skippedLocalDuplicates,
      measuresTotal: measureSummary.total,
      measuresSynced: measureSummary.synced,
      measuresSkippedLocalDuplicates: measureSummary.skippedLocalDuplicates,
      favoritesTotal: favoriteSummary.total,
      favoritesSynced: favoriteSummary.synced,
      favoritesSkippedLocalDuplicates: favoriteSummary.skippedLocalDuplicates
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
    getLocalCustomFoods: getLocalCustomFoods,
    getLocalCustomFoodMeasures: getLocalCustomFoodMeasures,
    getLocalFavoriteFoods: getLocalFavoriteFoods,
    fetchCustomFoods: fetchCustomFoods,
    saveCustomFood: saveCustomFood,
    deleteCustomFood: deleteCustomFood,
    fetchCustomFoodMeasures: fetchCustomFoodMeasures,
    saveCustomFoodMeasure: saveCustomFoodMeasure,
    fetchFavoriteFoods: fetchFavoriteFoods,
    saveFavoriteFood: saveFavoriteFood,
    deleteFavoriteFood: deleteFavoriteFood,
    syncLocalCustomFoodsToCloud: syncLocalCustomFoodsToCloud,
    syncLocalCustomFoodMeasuresToCloud: syncLocalCustomFoodMeasuresToCloud,
    syncLocalFavoriteFoodsToCloud: syncLocalFavoriteFoodsToCloud,
    syncLocalRecordsToCloud: syncLocalRecordsToCloud
  };
})();
