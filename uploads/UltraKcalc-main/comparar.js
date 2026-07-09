(function () {
  var compareRecords = [];
  var compareDataSource = 'local';

  function t(pt, en, es) {
    return window.UltraKcalcI18n ? window.UltraKcalcI18n.t(pt, en, es) : pt;
  }

  function nutrientDefs() {
    return [
      { id: 'energy', key: 'Energia (kcal)', label: t('Energia', 'Energy', 'Energía'), unit: 'kcal' },
      { id: 'carbs', key: 'Carboidrato total', label: t('Carboidratos', 'Carbohydrates', 'Carbohidratos'), unit: 'g' },
      { id: 'protein', key: 'Prote\u00edna', label: t('Prote\u00ednas', 'Proteins', 'Proteínas'), unit: 'g' },
      { id: 'lipids', key: 'Lip\u00eddios', label: t('Lip\u00eddios', 'Lipids', 'Lípidos'), unit: 'g' }
    ];
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    var el = byId(id);
    if (el) el.textContent = value;
  }

  function clearNode(node) {
    if (!node) return;
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function normalizeString(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');
  }

  function normalizeRecordGroup(value) {
    var normalized = String(value || '').trim().replace(/\s+/g, ' ');
    return normalized || 'Individual';
  }

  function formatDate(value) {
    if (!value) return '--';
    var parts = String(value).split('-');
    if (parts.length !== 3) return value;
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  function formatNumber(value, digits) {
    var number = parseFloat(value) || 0;
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    });
  }

  function formatPercent(value) {
    return formatNumber(value, 1) + '%';
  }

  function isUltraProcessingLabel(label) {
    var normalized = normalizeString(label || '');
    if (!normalized) return false;
    if (normalized.indexOf('nao ultraprocess') !== -1) return false;
    return normalized.indexOf('ultraprocess') !== -1;
  }

  function getLocalStoredRecords() {
    try {
      var stored = localStorage.getItem('ultrakcalc_allRecords');
      if (!stored) return [];
      var parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function getComparableRecords(records) {
    return (records || []).filter(function (session) {
      return session && Array.isArray(session.records) && session.records.length > 0;
    });
  }

  function fallbackRecordSignature(session) {
    return JSON.stringify({
      participantId: normalizeString(session && session.participantId),
      date: normalizeString(session && session.date),
      group: normalizeString(session && session.recordGroup),
      records: (session && session.records || []).map(function (item) {
        return {
          meal: normalizeString(item.meal),
          food: normalizeString(item.food),
          unit: normalizeString(item.unit),
          portion: String(item.portion || ''),
          qty: String(item.qty || ''),
          classNova: normalizeString(item.classNova),
          nutrients: item.nutrients || {}
        };
      })
    });
  }

  function getRecordSignature(session) {
    if (window.UltraKcalcCloud && typeof window.UltraKcalcCloud.createRecordSignature === 'function') {
      try {
        return window.UltraKcalcCloud.createRecordSignature(session);
      } catch (e) {}
    }
    return fallbackRecordSignature(session);
  }

  function mergeRecords(primary, secondary) {
    var seen = {};
    var merged = [];
    (primary || []).concat(secondary || []).forEach(function (session) {
      var signature = getRecordSignature(session);
      if (seen[signature]) return;
      seen[signature] = true;
      merged.push(session);
    });
    return merged;
  }

  async function loadCompareRecords() {
    var localRecords = getComparableRecords(getLocalStoredRecords());
    compareDataSource = 'local';

    if (window.UltraKcalcCloud && window.UltraKcalcCloud.isConfigured && window.UltraKcalcCloud.isConfigured()) {
      try {
        var user = await window.UltraKcalcCloud.init();
        if (user) {
          var cloudRecords = getComparableRecords(await window.UltraKcalcCloud.fetchRecords());
          var unsyncedLocal = localRecords.filter(function (session) { return !session.cloudId; });
          compareRecords = mergeRecords(cloudRecords, unsyncedLocal);
          compareDataSource = unsyncedLocal.length > 0
            ? t('nuvem + locais', 'cloud + local', 'nube + locales')
            : t('nuvem', 'cloud', 'nube');
          setText('compareDataStatus', compareRecords.length + ' ' + t('recordatorios carregados', 'dietary recalls loaded', 'recordatorios cargados') + ' (' + compareDataSource + ')');
          return;
        }
      } catch (e) {
        console.error(e);
        compareDataSource = 'local';
      }
    }

    compareRecords = localRecords;
    setText('compareDataStatus', compareRecords.length + ' ' + t('recordatorios carregados', 'dietary recalls loaded', 'recordatorios cargados') + ' (' + t('local', 'local', 'local') + ')');
  }

  function buildRecordLabel(session, index) {
    var participant = session && session.participantId ? session.participantId : t('Sem ID', 'No ID', 'Sin ID');
    var group = normalizeRecordGroup(session && session.recordGroup);
    var date = formatDate(session && session.date);
    return '#' + (index + 1) + ' - ' + participant + ' - ' + group + ' - ' + date;
  }

  function getCompareGroups() {
    var groups = {};
    compareRecords.forEach(function (session) {
      groups[normalizeRecordGroup(session.recordGroup)] = true;
    });
    return Object.keys(groups).sort(function (a, b) {
      if (a === 'Individual') return -1;
      if (b === 'Individual') return 1;
      return a.localeCompare(b, 'pt-BR');
    });
  }

  function fillOptions(select, options, emptyLabel) {
    if (!select) return;
    var previous = select.value;
    clearNode(select);

    if (!options.length) {
      var empty = document.createElement('option');
      empty.value = '';
      empty.textContent = emptyLabel;
      select.appendChild(empty);
      select.disabled = true;
      return;
    }

    select.disabled = false;
    options.forEach(function (item) {
      var option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.label;
      select.appendChild(option);
    });

    if (options.some(function (item) { return item.value === previous; })) {
      select.value = previous;
    }
  }

  function updateSideOptions(side) {
    var typeEl = byId('compareType' + side);
    var targetEl = byId('compareTarget' + side);
    if (!typeEl || !targetEl) return;

    if (typeEl.value === 'group') {
      fillOptions(targetEl, getCompareGroups().map(function (group) {
        return { value: group, label: group === 'Individual' ? t('Individual', 'Individual', 'Individual') : group };
      }), t('Nenhum grupo salvo', 'No saved groups', 'Ningún grupo guardado'));
      return;
    }

    fillOptions(targetEl, compareRecords.map(function (session, index) {
      return { value: String(index), label: buildRecordLabel(session, index) };
    }), t('Nenhum recordatorio salvo', 'No saved dietary recalls', 'Ningún recordatorio guardado'));
  }

  function updateGroupModeState() {
    var typeA = byId('compareTypeA');
    var typeB = byId('compareTypeB');
    var mode = byId('compareGroupMode');
    var modeCard = byId('compareModeCard');
    var hasGroup = (typeA && typeA.value === 'group') || (typeB && typeB.value === 'group');
    if (mode) mode.disabled = !hasGroup;
    if (modeCard) modeCard.classList.toggle('is-disabled', !hasGroup);
  }

  function updateCompareSelectors() {
    updateSideOptions('A');
    updateSideOptions('B');
    updateGroupModeState();
  }

  function getNutrientValue(nutrients, key) {
    if (!nutrients) return 0;
    if (Object.prototype.hasOwnProperty.call(nutrients, key)) {
      return parseFloat(nutrients[key]) || 0;
    }
    var normalizedKey = normalizeString(key);
    var keys = Object.keys(nutrients);
    for (var i = 0; i < keys.length; i++) {
      if (normalizeString(keys[i]) === normalizedKey) {
        return parseFloat(nutrients[keys[i]]) || 0;
      }
    }
    return 0;
  }

  function isRecordItemUltra(item) {
    if (!item) return false;
    if (item.classNova && isUltraProcessingLabel(item.classNova)) return true;
    if (item.classNova && !isUltraProcessingLabel(item.classNova)) return false;
    if (item.classPof && isUltraProcessingLabel(item.classPof)) return true;
    return false;
  }

  function createEmptySummary(label, type, mode, count) {
    var totals = {};
    var ultra = {};
    var percent = {};
    nutrientDefs().forEach(function (def) {
      totals[def.id] = 0;
      ultra[def.id] = 0;
      percent[def.id] = 0;
    });
    return {
      label: label,
      type: type,
      mode: mode,
      count: count || 0,
      totals: totals,
      ultra: ultra,
      percent: percent
    };
  }

  function calculateSessionSummary(session, label) {
    var summary = createEmptySummary(label || buildRecordLabel(session, 0), 'record', 'record', 1);
    (session.records || []).forEach(function (item) {
      var nutrients = item.nutrients || {};
      var isUltra = isRecordItemUltra(item);
      nutrientDefs().forEach(function (def) {
        var value = getNutrientValue(nutrients, def.key);
        summary.totals[def.id] += value;
        if (isUltra) summary.ultra[def.id] += value;
      });
    });
    nutrientDefs().forEach(function (def) {
      summary.percent[def.id] = summary.totals[def.id] > 0
        ? (summary.ultra[def.id] / summary.totals[def.id]) * 100
        : 0;
    });
    return summary;
  }

  function calculateGroupSummary(groupName, mode) {
    var sessions = compareRecords.filter(function (session) {
      return normalizeRecordGroup(session.recordGroup).toLowerCase() === normalizeRecordGroup(groupName).toLowerCase();
    });
    var summaries = sessions.map(function (session, index) {
      return calculateSessionSummary(session, buildRecordLabel(session, index));
    });
    var summary = createEmptySummary(groupName, 'group', mode, summaries.length);

    if (!summaries.length) return summary;

    if (mode === 'average') {
      nutrientDefs().forEach(function (def) {
        summaries.forEach(function (sessionSummary) {
          summary.totals[def.id] += sessionSummary.totals[def.id];
          summary.ultra[def.id] += sessionSummary.ultra[def.id];
          summary.percent[def.id] += sessionSummary.percent[def.id];
        });
        summary.totals[def.id] = summary.totals[def.id] / summaries.length;
        summary.ultra[def.id] = summary.ultra[def.id] / summaries.length;
        summary.percent[def.id] = summary.percent[def.id] / summaries.length;
      });
      return summary;
    }

    nutrientDefs().forEach(function (def) {
      summaries.forEach(function (sessionSummary) {
        summary.totals[def.id] += sessionSummary.totals[def.id];
        summary.ultra[def.id] += sessionSummary.ultra[def.id];
      });
      summary.percent[def.id] = summary.totals[def.id] > 0
        ? (summary.ultra[def.id] / summary.totals[def.id]) * 100
        : 0;
    });
    return summary;
  }

  function getSelectionSummary(side) {
    var typeEl = byId('compareType' + side);
    var targetEl = byId('compareTarget' + side);
    var modeEl = byId('compareGroupMode');
    if (!typeEl || !targetEl || !targetEl.value) return null;

    if (typeEl.value === 'group') {
      return calculateGroupSummary(targetEl.value, modeEl ? modeEl.value : 'average');
    }

    var index = parseInt(targetEl.value, 10);
    var session = compareRecords[index];
    if (!session) return null;
    return calculateSessionSummary(session, buildRecordLabel(session, index));
  }

  function modeLabel(summary) {
    if (!summary) return '';
    if (summary.type === 'record') return t('Recordatorio individual', 'Individual dietary recall', 'Recordatorio individual');
    if (summary.mode === 'average') return t('Media por recordatorio', 'Average per recall', 'Media por recordatorio');
    return t('Soma total do grupo', 'Group total sum', 'Suma total del grupo');
  }

  function appendMetric(panel, def, summary) {
    var row = document.createElement('div');
    row.className = 'compare-metric';

    var label = document.createElement('span');
    label.className = 'compare-metric-label';
    label.textContent = def.label;

    var value = document.createElement('strong');
    value.className = 'compare-metric-value';
    value.textContent = formatNumber(summary.totals[def.id], def.id === 'energy' ? 0 : 2) + ' ' + def.unit;

    var detail = document.createElement('span');
    detail.className = 'compare-metric-detail';
    detail.textContent = t('AUP', 'UPF', 'AUP') + ': ' +
      formatNumber(summary.ultra[def.id], def.id === 'energy' ? 0 : 2) + ' ' + def.unit +
      ' (' + formatPercent(summary.percent[def.id]) + ')';

    row.appendChild(label);
    row.appendChild(value);
    row.appendChild(detail);
    panel.appendChild(row);
  }

  function renderPanel(panelId, sideLabel, summary) {
    var panel = byId(panelId);
    if (!panel) return;
    clearNode(panel);

    var title = document.createElement('h3');
    title.textContent = sideLabel + ': ' + summary.label;

    var meta = document.createElement('div');
    meta.className = 'compare-meta';
    meta.textContent = modeLabel(summary) + ' - n = ' + summary.count;

    var metricList = document.createElement('div');
    metricList.className = 'compare-metric-list';
    nutrientDefs().forEach(function (def) {
      appendMetric(metricList, def, summary);
    });

    panel.appendChild(title);
    panel.appendChild(meta);
    panel.appendChild(metricList);
  }

  function makeLegendChip(kind, label, value, total, unit) {
    var chip = document.createElement('span');
    chip.className = 'legend-chip';

    var dot = document.createElement('i');
    dot.className = kind === 'aup' ? 'legend-dot aup' : 'legend-dot';

    var percent = total > 0 ? (value / total) * 100 : 0;
    var text = document.createElement('span');
    text.textContent = label + ': ' + formatNumber(value, unit === 'kcal' ? 0 : 2) + ' ' + unit + ' (' + formatPercent(percent) + ')';

    chip.appendChild(dot);
    chip.appendChild(text);
    return chip;
  }

  function renderEnergyChart(container, summary) {
    var card = document.createElement('section');
    card.className = 'compare-chart-card';

    var title = document.createElement('h2');
    title.textContent = t('Energia por processamento', 'Energy by processing level', 'Energía por procesamiento');

    var layout = document.createElement('div');
    layout.className = 'compare-energy-layout';

    var pieWrap = document.createElement('div');
    pieWrap.className = 'compare-energy-pie-wrap';

    var pie = document.createElement('div');
    pie.className = 'compare-energy-pie';

    var total = summary.totals.energy || 0;
    var aup = summary.ultra.energy || 0;
    var naup = Math.max(0, total - aup);
    var aupDegrees = total > 0 ? (aup / total) * 360 : 0;
    if (total > 0) {
      pie.style.background = 'conic-gradient(var(--uk-warn) 0deg ' + aupDegrees.toFixed(2) + 'deg, var(--uk-secondary) ' + aupDegrees.toFixed(2) + 'deg 360deg)';
    }

    var center = document.createElement('div');
    center.className = 'compare-energy-center';
    center.textContent = formatNumber(total, 0) + ' kcal';

    pieWrap.appendChild(pie);
    pieWrap.appendChild(center);

    var legend = document.createElement('div');
    legend.className = 'compare-chart-legend';
    legend.appendChild(makeLegendChip('naup', t('NAUP', 'Non-UPF', 'NAUP'), naup, total, 'kcal'));
    legend.appendChild(makeLegendChip('aup', t('AUP', 'UPF', 'AUP'), aup, total, 'kcal'));

    layout.appendChild(pieWrap);
    layout.appendChild(legend);
    card.appendChild(title);
    card.appendChild(layout);
    container.appendChild(card);
  }

  function renderMacroSegment(kind, value, total) {
    var segment = document.createElement('div');
    var percent = total > 0 ? (value / total) * 100 : 0;
    segment.className = 'compare-macro-segment ' + kind;
    segment.style.width = Math.max(0, Math.min(100, percent)) + '%';
    segment.textContent = percent >= 10 ? formatPercent(percent) : '';
    return segment;
  }

  function renderMacroCharts(container, summary) {
    var card = document.createElement('section');
    card.className = 'compare-chart-card';

    var title = document.createElement('h2');
    title.textContent = t('Macronutrientes por processamento', 'Macronutrients by processing level', 'Macronutrientes por procesamiento');

    var list = document.createElement('div');
    list.className = 'compare-macro-list';

    nutrientDefs().filter(function (def) {
      return def.id !== 'energy';
    }).forEach(function (def) {
      var total = summary.totals[def.id] || 0;
      var aup = summary.ultra[def.id] || 0;
      var naup = Math.max(0, total - aup);

      var block = document.createElement('div');

      var heading = document.createElement('div');
      heading.className = 'compare-macro-heading';

      var label = document.createElement('span');
      label.textContent = def.label;

      var totalText = document.createElement('span');
      totalText.textContent = formatNumber(total, 2) + ' ' + def.unit;

      var track = document.createElement('div');
      track.className = 'compare-macro-track';
      track.appendChild(renderMacroSegment('naup', naup, total));
      track.appendChild(renderMacroSegment('aup', aup, total));

      var detail = document.createElement('div');
      detail.className = 'compare-macro-detail';
      detail.textContent = t('NAUP', 'Non-UPF', 'NAUP') + ': ' + formatNumber(naup, 2) + ' ' + def.unit + ' (' + formatPercent(total > 0 ? (naup / total) * 100 : 0) + ') | ' + t('AUP', 'UPF', 'AUP') + ': ' + formatNumber(aup, 2) + ' ' + def.unit + ' (' + formatPercent(total > 0 ? (aup / total) * 100 : 0) + ')';

      heading.appendChild(label);
      heading.appendChild(totalText);
      block.appendChild(heading);
      block.appendChild(track);
      block.appendChild(detail);
      list.appendChild(block);
    });

    card.appendChild(title);
    card.appendChild(list);
    container.appendChild(card);
  }

  function renderSideCharts(containerId, summary) {
    var container = byId(containerId);
    if (!container) return;
    clearNode(container);
    renderEnergyChart(container, summary);
    renderMacroCharts(container, summary);
  }

  function renderComparison() {
    var empty = byId('compareEmptyState');
    var results = byId('compareResults');
    var summaryA = getSelectionSummary('A');
    var summaryB = getSelectionSummary('B');

    if (!summaryA || !summaryB || !compareRecords.length) {
      if (results) results.hidden = true;
      if (empty) {
        empty.hidden = false;
        empty.textContent = t('Salve recordatorios na calculadora ou entre na conta para comparar dados da nuvem.',
          'Save dietary recalls in the calculator or sign in to compare cloud data.',
          'Guarde recordatorios en la calculadora o entre a la cuenta para comparar datos de la nube.');
      }
      return;
    }

    renderPanel('comparePanelA', 'A', summaryA);
    renderPanel('comparePanelB', 'B', summaryB);
    renderSideCharts('compareChartsA', summaryA);
    renderSideCharts('compareChartsB', summaryB);

    if (empty) empty.hidden = true;
    if (results) results.hidden = false;
  }

  function wireEvents() {
    ['A', 'B'].forEach(function (side) {
      var typeEl = byId('compareType' + side);
      var targetEl = byId('compareTarget' + side);
      if (typeEl) {
        typeEl.addEventListener('change', function () {
          updateSideOptions(side);
          updateGroupModeState();
        });
      }
      if (targetEl) targetEl.addEventListener('change', updateGroupModeState);
    });

    var runBtn = byId('compareRunBtn');
    if (runBtn) runBtn.addEventListener('click', renderComparison);
  }

  async function initComparePage() {
    wireEvents();
    await loadCompareRecords();
    updateCompareSelectors();
    renderComparison();

    if (window.UltraKcalcI18n) {
      window.UltraKcalcI18n.onChange(function () {
        updateCompareSelectors();
        renderComparison();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initComparePage);
})();
