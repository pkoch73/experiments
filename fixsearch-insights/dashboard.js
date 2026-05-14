// ─────────────────────────────────────────────────────────────────────────────
// DAM Analytics Dashboard — fixsearchresultreport.assets.coke.com
// Pure Canvas 2D, no external dependencies.
// ─────────────────────────────────────────────────────────────────────────────

// ── DESIGN TOKENS ────────────────────────────────────────────────────────────
var C = {
  bg:       '#0f1014',
  surface:  '#1a1c22',
  surface2: '#22252e',
  border:   '#2e3140',
  text:     '#e8eaf0',
  muted:    '#8b8fa8',
  dim:      '#5a5e72',
  red:      '#F40009',
  green:    '#22c55e',
  orange:   '#fb923c',
  yellow:   '#fbbf24',
  blue:     '#3b82f6',
  purple:   '#a855f7'
};

// ── CORE UTILITY ─────────────────────────────────────────────────────────────
function initCanvas(id, heightPx) {
  var canvas = document.getElementById(id);
  if (!canvas) return null;
  var dpr = window.devicePixelRatio || 1;
  var w = canvas.parentElement.clientWidth || 600;
  canvas.width  = w * dpr;
  canvas.height = heightPx * dpr;
  canvas.style.width  = w + 'px';
  canvas.style.height = heightPx + 'px';
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx: ctx, w: w, H: heightPx };
}

function fmtNum(n) {
  return n.toLocaleString();
}

function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ── ZERO RESULT TABLE ────────────────────────────────────────────────────────
(function buildZeroResultTable() {
  var data = [
    { rank:1,  term: '8250485155',                    searches: 43,  searchers: 4  },
    { rank:2,  term: '#fantapackagingsystemtemplates', searches: 24,  searchers: 17 },
    { rank:3,  term: '#projectsolokvimpulse',          searches: 23,  searchers: 1  },
    { rank:4,  term: '#AnthemLaunchCharacterCards',    searches: 16,  searchers: 13 },
    { rank:5,  term: '#CAFH25POSSES',                  searches: 15,  searchers: 2  },
    { rank:6,  term: '#TCCCXA250SHOPPERKVS',           searches: 15,  searchers: 14 },
    { rank:7,  term: '#fwc26ccfootball',               searches: 14,  searchers: 7  },
    { rank:8,  term: '#AnthemLaunchAlbumArtwork',      searches: 13,  searchers: 13 },
    { rank:9,  term: '#KOOCArdenUS',                   searches: 13,  searchers: 3  },
    { rank:10, term: '2549353434',                     searches: 13,  searchers: 1  },
    { rank:11, term: 'JackCoke',                       searches: 13,  searchers: 9  },
    { rank:12, term: '#ussac25staticsocial',            searches: 12,  searchers: 1  },
    { rank:13, term: '46126182',                       searches: 12,  searchers: 1  },
    { rank:14, term: '6614636981',                     searches: 12,  searchers: 2  },
    { rank:15, term: 'US AND SOCCER AND SPANISH',      searches: 12,  searchers: 2  },
    { rank:16, term: '#fwc26shopperQ2',                searches: 10,  searchers: 7  },
    { rank:17, term: '2071248569 POI',                 searches: 10,  searchers: 5  },
    { rank:18, term: '#DKOMyTasteMasterToolkit',       searches: 9,   searchers: 3  },
    { rank:19, term: '#ccfwc26pmsguide',               searches: 9,   searchers: 6  },
    { rank:20, term: '#fwc26poweradeshopperguide',     searches: 9,   searchers: 3  }
  ];

  var tbody = document.getElementById('zero-result-tbody');
  if (!tbody) return;

  data.forEach(function(d) {
    var isHashtag = d.term.startsWith('#');
    var isNumeric = /^\d/.test(d.term);
    var typeClass = isHashtag ? 'tag' : (isNumeric ? '' : '');
    var style = isHashtag ? ' style="color:var(--orange);font-family:\'SF Mono\',monospace;font-size:11px"' :
                isNumeric ? ' style="color:var(--dim);font-family:\'SF Mono\',monospace;font-size:11px"' : '';
    var tr = '<tr>' +
      '<td class="rank">' + d.rank + '</td>' +
      '<td' + style + '>' + escHtml(d.term) + '</td>' +
      '<td class="num">' + d.searches + '</td>' +
      '<td class="num muted">' + d.searchers + '</td>' +
      '</tr>';
    tbody.insertAdjacentHTML('beforeend', tr);
  });
})();

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── REGION TABLE ─────────────────────────────────────────────────────────────
(function buildRegionTable() {
  var data = [
    { region:'NA',    users:2600, searches:145015, downloads:14629, su:55.8, du:5.6,  lu:17.1, yoy:-17 },
    { region:'JSK',   users:524,  searches:24947,  downloads:5794,  su:47.6, du:11.1, lu:6.2,  yoy:1   },
    { region:'EU',    users:636,  searches:24554,  downloads:3816,  su:38.6, du:6.0,  lu:4.8,  yoy:-25 },
    { region:'LA',    users:544,  searches:14187,  downloads:2334,  su:26.1, du:4.3,  lu:3.4,  yoy:-5  },
    { region:'ASP',   users:291,  searches:11716,  downloads:1465,  su:40.3, du:5.0,  lu:4.9,  yoy:6   },
    { region:'AFR',   users:166,  searches:6196,   downloads:1555,  su:37.3, du:9.4,  lu:4.4,  yoy:107 },
    { region:'INSWA', users:85,   searches:3626,   downloads:658,   su:42.7, du:7.7,  lu:6.4,  yoy:167 },
    { region:'GCM',   users:53,   searches:2381,   downloads:312,   su:44.9, du:5.9,  lu:4.9,  yoy:-16 },
    { region:'EME',   users:106,  searches:2038,   downloads:270,   su:19.2, du:2.5,  lu:3.1,  yoy:-6  }
  ];

  var tbody = document.getElementById('region-tbody');
  if (!tbody) return;

  data.forEach(function(d) {
    var yoyStr = (d.yoy > 0 ? '+' : '') + d.yoy + '%';
    var yoyClass = d.yoy > 0 ? 'yoy-pos' : 'yoy-neg';
    var tr = '<tr>' +
      '<td><strong>' + d.region + '</strong></td>' +
      '<td class="num">' + fmtNum(d.users) + '</td>' +
      '<td class="num">' + fmtNum(d.searches) + '</td>' +
      '<td class="num">' + fmtNum(d.downloads) + '</td>' +
      '<td class="num">' + d.su.toFixed(1) + '</td>' +
      '<td class="num">' + d.du.toFixed(1) + '</td>' +
      '<td class="num">' + d.lu.toFixed(1) + '</td>' +
      '<td class="num"><span class="' + yoyClass + '">' + yoyStr + '</span></td>' +
      '</tr>';
    tbody.insertAdjacentHTML('beforeend', tr);
  });
})();

// ── CAMPAIGN TABLE ────────────────────────────────────────────────────────────
(function buildCampaignTable() {
  var data = [
    { name:'None / Coca-Cola Zero',    downloads:10477, dlrs:1431, ous:82 },
    { name:'FIFA WC 2026 / Coca-Cola', downloads:4991,  dlrs:508,  ous:75 },
    { name:'Unknown / Coca-Cola',      downloads:3731,  dlrs:1070, ous:67 },
    { name:'America 250 / Coca-Cola',  downloads:1720,  dlrs:219,  ous:9  },
    { name:'Sprite Summer 2026',       downloads:886,   dlrs:153,  ous:54 },
    { name:'Coca-Cola Sustaining',     downloads:746,   dlrs:262,  ous:56 },
    { name:'Ice Cold 2026',            downloads:591,   dlrs:63,   ous:32 },
    { name:'Fanta Gaming 2026',        downloads:548,   dlrs:103,  ous:32 },
    { name:'Powerade FIFA',            downloads:327,   dlrs:86,   ous:31 },
    { name:'Always On Soccer',         downloads:303,   dlrs:127,  ous:25 }
  ];

  var tbody = document.getElementById('campaign-tbody');
  if (!tbody) return;

  var isGray = { 'None / Coca-Cola Zero': true, 'Unknown / Coca-Cola': true };

  data.forEach(function(d, i) {
    var color = isGray[d.name] ? C.muted : C.red;
    var dlPerDl = (d.downloads / d.dlrs).toFixed(1);
    var tr = '<tr>' +
      '<td class="rank">' + (i + 1) + '</td>' +
      '<td><span class="campaign-dot" style="background:' + color + '"></span>' + d.name + '</td>' +
      '<td class="num">' + fmtNum(d.downloads) + '</td>' +
      '<td class="num">' + fmtNum(d.dlrs) + '</td>' +
      '<td class="num">' + d.ous + '</td>' +
      '</tr>';
    tbody.insertAdjacentHTML('beforeend', tr);
  });
})();

// ─────────────────────────────────────────────────────────────────────────────
// CHART 1 — Overview Combo (Bars + Lines)
// ─────────────────────────────────────────────────────────────────────────────
(function drawOverviewChart() {
  var ci = initCanvas('overviewChart', 280);
  if (!ci) return;
  var ctx = ci.ctx, w = ci.w, H = ci.H;

  var months = ['Feb', 'Mar', 'Apr', 'May'];
  var searches = [16/1000, 46210/1000, 111875/1000, 39818/1000]; // /1000
  var downloads = [0, 4842+807, 16604+1459, 7639+417];
  var logins = [9/100, 7240/100, 34567/100, 14951/100]; // /100

  var pad = { top: 30, bottom: 50, left: 56, right: 120 };
  var chartW = w - pad.left - pad.right;
  var chartH = H - pad.top - pad.bottom;

  var allVals = searches.concat(downloads).concat(logins);
  var maxVal = Math.max.apply(null, allVals) * 1.1;

  var nBars = months.length;
  var groupW = chartW / nBars;
  var barW = groupW * 0.55;

  function toY(v) { return pad.top + chartH - (v / maxVal) * chartH; }
  function toX(i) { return pad.left + i * groupW + groupW / 2; }

  // Grid
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 1;
  var gridLines = 5;
  for (var g = 0; g <= gridLines; g++) {
    var gy = pad.top + (g / gridLines) * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, gy);
    ctx.lineTo(pad.left + chartW, gy);
    ctx.stroke();
    var gVal = maxVal * (1 - g / gridLines);
    ctx.fillStyle = C.dim;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(gVal >= 1000 ? (gVal/1000).toFixed(0)+'k' : gVal.toFixed(0), pad.left - 6, gy + 3);
  }

  // Bars (searches/1000 + downloads + logins/100)
  var barSeries = [
    { data: searches,  color: C.blue,   label: 'Searches/1k' },
    { data: downloads, color: C.green,  label: 'Downloads' },
    { data: logins,    color: C.orange, label: 'Logins/100' }
  ];

  var barCount = barSeries.length;
  var singleBarW = barW / barCount;

  barSeries.forEach(function(series, si) {
    series.data.forEach(function(val, mi) {
      var x = toX(mi) - barW/2 + si * singleBarW;
      var y = toY(val);
      var bh = toY(0) - y;
      if (bh < 1) { bh = 1; y = toY(0) - 1; }
      ctx.fillStyle = series.color + 'cc';
      roundRect(ctx, x, y, singleBarW - 2, bh, 3);
      ctx.fill();
    });
  });

  // X labels
  ctx.textAlign = 'center';
  ctx.fillStyle = C.muted;
  ctx.font = '11px system-ui';
  months.forEach(function(m, mi) {
    ctx.fillText(m, toX(mi), H - 12);
  });

  // Legend
  var legX = pad.left + chartW + 10;
  var legY = pad.top + 10;
  barSeries.forEach(function(s, i) {
    ctx.fillStyle = s.color;
    ctx.fillRect(legX, legY + i * 22, 10, 10);
    ctx.fillStyle = C.muted;
    ctx.font = '11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(s.label, legX + 14, legY + i * 22 + 9);
  });
})();

// ─────────────────────────────────────────────────────────────────────────────
// CHART 2 — Result Size Donut
// ─────────────────────────────────────────────────────────────────────────────
(function drawResultDonut() {
  var ci = initCanvas('resultDonut', 260);
  if (!ci) return;
  var ctx = ci.ctx, w = ci.w, H = ci.H;

  var segments = [
    { label: '0 results (6.5%)',     value: 3265,  color: C.red },
    { label: '1–10 (14.8%)',         value: 7451,  color: '#ef4444' },
    { label: '11–50 (15.9%)',        value: 7990,  color: C.orange },
    { label: '51–100 (10.3%)',       value: 5175,  color: C.yellow },
    { label: '101–500 (25.8%)',      value: 12992, color: C.green },
    { label: '501–1k (8.9%)',        value: 4498,  color: '#16a34a' },
    { label: '1k–10k (33.7%)',       value: 16950, color: C.blue },
    { label: 'Pre-migration data',   value: 184357,color: C.border }
  ];

  var total = segments.reduce(function(s, d) { return s + d.value; }, 0);
  var cx = w * 0.38;
  var cy = H / 2;
  var outerR = Math.min(cx, cy) - 10;
  var innerR = outerR * 0.62;

  var angle = -Math.PI / 2;
  segments.forEach(function(seg) {
    var sweep = (seg.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    angle += sweep;
  });

  // Inner hole
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fillStyle = C.surface;
  ctx.fill();

  // Center label
  ctx.fillStyle = C.text;
  ctx.font = 'bold 20px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('50,321', cx, cy - 4);
  ctx.fillStyle = C.muted;
  ctx.font = '10px system-ui';
  ctx.fillText('non-backfilled', cx, cy + 12);

  // Legend
  var legX = w * 0.62;
  var legY = 18;
  var lineH = 26;
  segments.forEach(function(seg, i) {
    var y = legY + i * lineH;
    ctx.fillStyle = seg.color;
    roundRect(ctx, legX, y, 10, 10, 2);
    ctx.fill();
    ctx.fillStyle = seg.label.startsWith('Pre-migration') ? C.dim : C.text;
    ctx.font = (seg.label.startsWith('Pre-migration') ? 'italic ' : '') + '11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(seg.label, legX + 14, y + 9);
    ctx.fillStyle = C.muted;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(fmtNum(seg.value), w - 8, y + 9);
  });
})();

// ─────────────────────────────────────────────────────────────────────────────
// CHART 3 — Funnel (trapezoid)
// ─────────────────────────────────────────────────────────────────────────────
(function drawFunnelChart() {
  var ci = initCanvas('funnelCanvas', 300);
  if (!ci) return;
  var ctx = ci.ctx, w = ci.w, H = ci.H;

  var stages = [
    { label: 'Unique Users',        value: 5147,  pct: 100,  color: C.blue },
    { label: 'Searchers',           value: 4527,  pct: 87.9, color: C.purple },
    { label: 'Downloaders',         value: 2689,  pct: 52.2, color: C.green }
  ];

  var dropNotes = [
    '−620 never searched (−12.1%)',
    '−1,838 searched, never downloaded (−35.7%)'
  ];

  var pad = { top: 24, bottom: 40, left: 20, right: 200 };
  var chartW = w - pad.left - pad.right;
  var chartH = H - pad.top - pad.bottom;

  var nStages = stages.length;
  var slotH = chartH / nStages;
  var gapH = 8;

  stages.forEach(function(stage, i) {
    var topW = chartW * (stage.pct / 100) * 0.95;
    var botPct = i + 1 < nStages ? stages[i + 1].pct : stage.pct * 0.7;
    var botW = chartW * (botPct / 100) * 0.95;

    var topLeft  = pad.left + (chartW - topW) / 2;
    var topRight = topLeft + topW;
    var y = pad.top + i * slotH;
    var bh = slotH - gapH;
    var botLeft  = pad.left + (chartW - botW) / 2;
    var botRight = botLeft + botW;

    // Gradient fill
    var grad = ctx.createLinearGradient(topLeft, y, topRight, y + bh);
    grad.addColorStop(0, stage.color + '55');
    grad.addColorStop(1, stage.color + '22');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(topLeft, y);
    ctx.lineTo(topRight, y);
    ctx.lineTo(botRight, y + bh);
    ctx.lineTo(botLeft, y + bh);
    ctx.closePath();
    ctx.fill();

    // Top stroke
    ctx.strokeStyle = stage.color + 'aa';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(topLeft, y);
    ctx.lineTo(topRight, y);
    ctx.stroke();

    // Labels
    var midY = y + bh / 2 + 1;
    ctx.fillStyle = stage.color;
    ctx.font = 'bold 22px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(fmtNum(stage.value), pad.left + chartW / 2, midY - 3);
    ctx.fillStyle = C.muted;
    ctx.font = '11px system-ui';
    ctx.fillText(stage.label + '  (' + stage.pct + '%)', pad.left + chartW / 2, midY + 14);

    // Drop annotation
    if (i < dropNotes.length) {
      var dropY = y + slotH - gapH / 2;
      ctx.fillStyle = C.dim;
      ctx.font = '11px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(dropNotes[i], pad.left + chartW + 12, dropY);
      // Arrow
      ctx.strokeStyle = C.dim;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left + chartW / 2, dropY - 8);
      ctx.lineTo(pad.left + chartW + 10, dropY - 2);
      ctx.stroke();
    }
  });

  // X-axis label
  ctx.fillStyle = C.dim;
  ctx.font = '10px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('2026 YTD (Jan–May) · fixsearchresultreport.assets.coke.com', pad.left + chartW / 2, H - 8);
})();

// ─────────────────────────────────────────────────────────────────────────────
// CHART 4 — Filter Usage Donut
// ─────────────────────────────────────────────────────────────────────────────
(function drawFilterUsageDonut() {
  var ci = initCanvas('filterUsageDonut', 240);
  if (!ci) return;
  var ctx = ci.ctx, w = ci.w, H = ci.H;

  var segs = [
    { label: 'With Filters',          value: 23676,  color: C.blue },
    { label: 'No Filters',            value: 34645,  color: C.purple },
    { label: 'Pre-migration',         value: 184357, color: C.border }
  ];

  var total = segs.reduce(function(s, d) { return s + d.value; }, 0);
  var cx = w * 0.38, cy = H / 2;
  var outerR = Math.min(cx, cy) - 10;
  var innerR = outerR * 0.6;

  var angle = -Math.PI / 2;
  segs.forEach(function(seg) {
    var sweep = (seg.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    angle += sweep;
  });

  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fillStyle = C.surface;
  ctx.fill();

  ctx.fillStyle = C.text;
  ctx.font = 'bold 15px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('242,678', cx, cy - 3);
  ctx.fillStyle = C.muted;
  ctx.font = '10px system-ui';
  ctx.fillText('total', cx, cy + 11);

  var legX = w * 0.64;
  var legY = 30;
  segs.forEach(function(seg, i) {
    var y = legY + i * 40;
    ctx.fillStyle = seg.color;
    roundRect(ctx, legX, y, 10, 10, 2);
    ctx.fill();
    ctx.fillStyle = seg.label === 'Pre-migration' ? C.dim : C.text;
    ctx.font = (seg.label === 'Pre-migration' ? 'italic ' : '') + '12px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(seg.label, legX + 14, y + 9);
    ctx.fillStyle = C.muted;
    ctx.font = '11px system-ui';
    ctx.fillText(fmtNum(seg.value), legX + 14, y + 23);
  });
})();

// ─────────────────────────────────────────────────────────────────────────────
// CHART 5 — Filter Combinations Horizontal Bars
// ─────────────────────────────────────────────────────────────────────────────
(function drawFilterBarsChart() {
  var ci = initCanvas('filterBarsChart', 300);
  if (!ci) return;
  var ctx = ci.ctx, w = ci.w, H = ci.H;

  var data = [
    { label: 'templateStatus',                      value: 4284 },
    { label: 'brand | intendedBottlerCountry',      value: 2724 },
    { label: 'brand',                               value: 2140 },
    { label: 'campaignName',                        value: 1827 },
    { label: 'assetCategoryAndType',                value: 1564 },
    { label: 'intendedBottlerCountry',              value: 1210 },
    { label: 'assetCategoryAndType | brand',        value: 804  },
    { label: 'readyToUse',                          value: 589  },
    { label: 'intendedBusinessUnitOrMarket',        value: 564  },
    { label: 'assetCategoryAndType | readyToUse',   value: 480  }
  ];

  var pad = { top: 12, bottom: 12, left: 8, right: 70 };
  var chartW = w - pad.left - pad.right;
  var chartH = H - pad.top - pad.bottom;

  var maxVal = data[0].value;
  var rowH = chartH / data.length;
  var barH = rowH - 8;

  data.forEach(function(d, i) {
    var y = pad.top + i * rowH;
    var barLen = (d.value / maxVal) * chartW * 0.75;
    var hue = i / data.length;
    var color = i === 0 ? C.blue : (i < 3 ? C.purple : C.muted + '88');

    // Bar
    ctx.fillStyle = i === 0 ? C.blue + 'cc' : i < 6 ? C.purple + '88' : C.dim + '88';
    roundRect(ctx, pad.left, y + (rowH - barH) / 2, barLen, barH, 3);
    ctx.fill();

    // Label
    ctx.fillStyle = i < 4 ? C.text : C.muted;
    ctx.font = (i < 3 ? 'bold ' : '') + '10px system-ui';
    ctx.textAlign = 'left';
    var labelX = pad.left + barLen + 6;
    ctx.fillText(fmtNum(d.value), labelX, y + rowH / 2 + 3);

    // Filter name — below bar
    ctx.fillStyle = C.muted;
    ctx.font = '9px system-ui';
    ctx.fillText(d.label, pad.left + 4, y + rowH - 2);
  });
})();

// ─────────────────────────────────────────────────────────────────────────────
// CHART 6 — Region Grouped Bars
// ─────────────────────────────────────────────────────────────────────────────
(function drawRegionChart() {
  var ci = initCanvas('regionChart', 300);
  if (!ci) return;
  var ctx = ci.ctx, w = ci.w, H = ci.H;

  var regions = ['NA','JSK','EU','LA','ASP','AFR','INSWA','GCM','EME'];
  var searches = [145015,24947,24554,14187,11716,6196,3626,2381,2038];
  var downloads = [14629,5794,3816,2334,1465,1555,658,312,270];

  var pad = { top: 30, bottom: 50, left: 56, right: 100 };
  var chartW = w - pad.left - pad.right;
  var chartH = H - pad.top - pad.bottom;

  var maxVal = Math.max.apply(null, searches) * 1.1;

  var nGroups = regions.length;
  var groupW = chartW / nGroups;
  var barW = groupW * 0.7;

  function toY(v) { return pad.top + chartH - (v / maxVal) * chartH; }
  function toX(i) { return pad.left + i * groupW + groupW / 2; }

  // Grid
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 1;
  var gridN = 5;
  for (var g = 0; g <= gridN; g++) {
    var gy = pad.top + (g / gridN) * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, gy);
    ctx.lineTo(pad.left + chartW, gy);
    ctx.stroke();
    var gv = maxVal * (1 - g / gridN);
    ctx.fillStyle = C.dim;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(gv >= 1000 ? (gv/1000).toFixed(0)+'k' : Math.round(gv), pad.left - 6, gy + 3);
  }

  // Searches bar
  searches.forEach(function(v, i) {
    var x = toX(i) - barW/2;
    var y = toY(v);
    var bh = toY(0) - y;
    ctx.fillStyle = C.blue + 'cc';
    roundRect(ctx, x, y, barW/2 - 1, bh, 3);
    ctx.fill();
  });

  // Downloads bar
  downloads.forEach(function(v, i) {
    var x = toX(i);
    var y = toY(v);
    var bh = toY(0) - y;
    ctx.fillStyle = C.green + 'cc';
    roundRect(ctx, x + 1, y, barW/2 - 1, bh, 3);
    ctx.fill();
  });

  // X labels
  ctx.textAlign = 'center';
  ctx.fillStyle = C.muted;
  ctx.font = '11px system-ui';
  regions.forEach(function(r, i) {
    ctx.fillText(r, toX(i), H - 12);
  });

  // Legend
  var legX = w - 90;
  ctx.fillStyle = C.blue + 'cc';
  ctx.fillRect(legX, pad.top, 10, 10);
  ctx.fillStyle = C.muted;
  ctx.font = '11px system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('Searches', legX + 14, pad.top + 9);

  ctx.fillStyle = C.green + 'cc';
  ctx.fillRect(legX, pad.top + 20, 10, 10);
  ctx.fillStyle = C.muted;
  ctx.fillText('Downloads', legX + 14, pad.top + 29);
})();

// ─────────────────────────────────────────────────────────────────────────────
// CHART 7 — Role Normalized Bar (S/User, D/User, L/User)
// ─────────────────────────────────────────────────────────────────────────────
(function drawRoleChart() {
  var ci = initCanvas('roleChart', 280);
  if (!ci) return;
  var ctx = ci.ctx, w = ci.w, H = ci.H;

  var roles = ['Associate','Agency','Bottler','Other'];
  var metrics = [
    { label: 'S/User', data: [31.7, 69.6, 50.6, 116.7], color: C.blue   },
    { label: 'D/User', data: [7.2,  16.4, 15.7, 0],     color: C.green  },
    { label: 'L/User', data: [4.2,  7.3,  5.6,  12.3],  color: C.orange }
  ];

  var pad = { top: 30, bottom: 50, left: 56, right: 120 };
  var chartW = w - pad.left - pad.right;
  var chartH = H - pad.top - pad.bottom;

  var allVals = [];
  metrics.forEach(function(m) { allVals = allVals.concat(m.data); });
  var maxVal = Math.max.apply(null, allVals) * 1.15;

  var nGroups = roles.length;
  var groupW = chartW / nGroups;
  var barTotal = groupW * 0.75;
  var nMetrics = metrics.length;
  var barW = barTotal / nMetrics;

  function toY(v) { return pad.top + chartH - (v / maxVal) * chartH; }
  function toX(g) { return pad.left + g * groupW + (groupW - barTotal) / 2; }

  // Grid
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 1;
  for (var g = 0; g <= 5; g++) {
    var gy = pad.top + (g / 5) * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, gy);
    ctx.lineTo(pad.left + chartW, gy);
    ctx.stroke();
    var gv = maxVal * (1 - g / 5);
    ctx.fillStyle = C.dim;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(gv.toFixed(0), pad.left - 6, gy + 3);
  }

  roles.forEach(function(role, ri) {
    metrics.forEach(function(metric, mi) {
      var x = toX(ri) + mi * barW;
      var v = metric.data[ri];
      var y = toY(v);
      var bh = toY(0) - y;
      if (bh < 2) { bh = 2; y = toY(0) - 2; }
      ctx.fillStyle = metric.color + 'cc';
      roundRect(ctx, x, y, barW - 2, bh, 3);
      ctx.fill();

      // Value label on bar
      if (v > 3) {
        ctx.fillStyle = C.text;
        ctx.font = 'bold 9px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(v.toFixed(v < 10 ? 1 : 0), x + barW/2 - 1, y - 3);
      }
    });

    // Role label
    ctx.fillStyle = C.muted;
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(role, toX(ri) + barTotal / 2, H - 12);
  });

  // Legend
  var legX = w - 110;
  metrics.forEach(function(m, i) {
    ctx.fillStyle = m.color + 'cc';
    ctx.fillRect(legX, pad.top + i * 22, 10, 10);
    ctx.fillStyle = C.muted;
    ctx.font = '11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(m.label, legX + 14, pad.top + i * 22 + 9);
  });
})();

// ─────────────────────────────────────────────────────────────────────────────
// CHART 8 — Campaign Horizontal Bars
// ─────────────────────────────────────────────────────────────────────────────
(function drawCampaignChart() {
  var ci = initCanvas('campaignChart', 320);
  if (!ci) return;
  var ctx = ci.ctx, w = ci.w, H = ci.H;

  var campaigns = [
    { name: 'None/Coca-Cola Zero',    downloads: 10477, color: C.muted  },
    { name: 'FIFA WC 2026',           downloads: 4991,  color: C.red    },
    { name: 'Unknown/Coca-Cola',      downloads: 3731,  color: C.dim    },
    { name: 'America 250',            downloads: 1720,  color: C.red    },
    { name: 'Sprite Summer 2026',     downloads: 886,   color: C.green  },
    { name: 'Coca-Cola Sustaining',   downloads: 746,   color: C.red    },
    { name: 'Ice Cold 2026',          downloads: 591,   color: C.blue   },
    { name: 'Fanta Gaming 2026',      downloads: 548,   color: C.orange },
    { name: 'Powerade FIFA',          downloads: 327,   color: C.purple },
    { name: 'Always On Soccer',       downloads: 303,   color: C.blue   }
  ];

  var pad = { top: 10, bottom: 10, left: 10, right: 70 };
  var chartW = w - pad.left - pad.right;
  var chartH = H - pad.top - pad.bottom;

  var maxVal = campaigns[0].downloads;
  var rowH = chartH / campaigns.length;
  var barH = rowH - 8;

  campaigns.forEach(function(d, i) {
    var y = pad.top + i * rowH;
    var barLen = (d.downloads / maxVal) * chartW * 0.65;

    // Bar
    ctx.fillStyle = d.color + (d.color === C.muted || d.color === C.dim ? '88' : 'cc');
    roundRect(ctx, pad.left, y + (rowH - barH) / 2, barLen, barH, 3);
    ctx.fill();

    // OUs
    ctx.fillStyle = d.color + '44';
    var ouLen = (d.downloads / maxVal) * chartW * 0.65 * 0.15;
    roundRect(ctx, pad.left + barLen, y + (rowH - barH) / 2, ouLen, barH, 2);
    ctx.fill();

    // Value
    ctx.fillStyle = C.text;
    ctx.font = '11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(fmtNum(d.downloads), pad.left + barLen + ouLen + 6, y + rowH / 2 + 3);

    // Name
    ctx.fillStyle = d.color === C.muted || d.color === C.dim ? C.muted : C.text;
    ctx.font = (i < 4 ? 'bold ' : '') + '10px system-ui';
    ctx.textAlign = 'left';
    // clip long names
    var maxNameLen = 28;
    var name = d.name.length > maxNameLen ? d.name.slice(0, maxNameLen - 1) + '…' : d.name;
    ctx.fillText(name, pad.left + 5, y + rowH - 3);
  });
})();

// ─────────────────────────────────────────────────────────────────────────────
// CHART 9 — Trend Combo (stacked + lines)
// ─────────────────────────────────────────────────────────────────────────────
(function drawTrendChart() {
  var ci = initCanvas('trendChart', 300);
  if (!ci) return;
  var ctx = ci.ctx, w = ci.w, H = ci.H;

  var months = ['Feb', 'Mar', 'Apr', 'May'];
  // Search events by type
  var assets    = [16,    46210,  111875, 39818];
  var products  = [0,     4159,   10422,  3656];
  var templates = [0,     7180,   14146,  5190];
  // Overlay
  var users     = [3,     2335,   3752,   2314];
  var dlrs      = [0,     5649,   18063,  8056];  // assets+templates monthly

  var pad = { top: 30, bottom: 50, left: 64, right: 120 };
  var chartW = w - pad.left - pad.right;
  var chartH = H - pad.top - pad.bottom;

  var totals = months.map(function(_, i) { return assets[i] + products[i] + templates[i]; });
  var maxBar = Math.max.apply(null, totals) * 1.12;

  function toY(v, max) { return pad.top + chartH - (v / max) * chartH; }
  function toX(i) { return pad.left + (i + 0.5) * (chartW / months.length); }

  // Grid
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 1;
  for (var g = 0; g <= 5; g++) {
    var gy = pad.top + (g / 5) * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, gy);
    ctx.lineTo(pad.left + chartW, gy);
    ctx.stroke();
    var gv = maxBar * (1 - g / 5);
    ctx.fillStyle = C.dim;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(gv >= 1000 ? (gv/1000).toFixed(0)+'k' : Math.round(gv), pad.left - 6, gy + 3);
  }

  // Stacked bars
  var barW = (chartW / months.length) * 0.55;

  months.forEach(function(_, i) {
    var x = toX(i) - barW / 2;
    var baseY = pad.top + chartH;
    var segs = [
      { val: assets[i],    color: C.blue },
      { val: products[i],  color: C.green },
      { val: templates[i], color: C.purple }
    ];
    var cumY = baseY;
    segs.forEach(function(seg) {
      if (seg.val === 0) return;
      var segH = (seg.val / maxBar) * chartH;
      cumY -= segH;
      ctx.fillStyle = seg.color + 'bb';
      roundRect(ctx, x, cumY, barW, segH, i === 0 ? 2 : 3);
      ctx.fill();
    });
  });

  // Each line uses its own scale so both are visible
  var maxUsers = Math.max.apply(null, users) * 1.15;
  var maxDlrs  = Math.max.apply(null, dlrs)  * 1.15;
  function toYUsers(v) { return pad.top + chartH - (v / maxUsers) * chartH; }
  function toYDlrs(v)  { return pad.top + chartH - (v / maxDlrs)  * chartH; }

  // Right axis (users)
  ctx.textAlign = 'left';
  ctx.fillStyle = C.red;
  ctx.font = '9px system-ui';
  for (var r = 0; r <= 3; r++) {
    var rv = Math.round(maxUsers / 3 * r);
    var ry = toYUsers(rv);
    ctx.fillText(rv >= 1000 ? (rv/1000).toFixed(1)+'k' : rv, w - pad.right + 6, ry + 3);
  }

  // Far-right axis (downloads, offset)
  ctx.fillStyle = C.orange;
  ctx.font = '9px system-ui';
  for (var r2 = 0; r2 <= 3; r2++) {
    var rv2 = Math.round(maxDlrs / 3 * r2);
    var ry2 = toYDlrs(rv2);
    ctx.fillText(rv2 >= 1000 ? (rv2/1000).toFixed(0)+'k' : rv2, w - pad.right + 40, ry2 + 3);
  }

  // Downloads line (orange, solid)
  ctx.strokeStyle = C.orange;
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  months.forEach(function(_, i) {
    var x = toX(i);
    var y = toYDlrs(dlrs[i]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Users line (red, solid)
  ctx.strokeStyle = C.red;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  months.forEach(function(_, i) {
    var x = toX(i);
    var y = toYUsers(users[i]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Dots + value labels
  [
    { data: users, color: C.red,    toY: toYUsers },
    { data: dlrs,  color: C.orange, toY: toYDlrs  }
  ].forEach(function(series) {
    months.forEach(function(_, i) {
      if (series.data[i] === 0) return;
      var x = toX(i);
      var y = series.toY(series.data[i]);
      // White outline ring for visibility over bars
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = C.bg;
      ctx.fill();
      // Colored dot
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = series.color;
      ctx.fill();
      // Value label
      ctx.fillStyle = series.color;
      ctx.font = 'bold 10px system-ui';
      ctx.textAlign = 'center';
      var label = series.data[i] >= 1000 ? (series.data[i]/1000).toFixed(1)+'k' : series.data[i];
      ctx.fillText(label, x, y - 12);
    });
  });

  // X labels
  ctx.fillStyle = C.muted;
  ctx.font = '11px system-ui';
  ctx.textAlign = 'center';
  months.forEach(function(m, i) { ctx.fillText(m, toX(i), H - 12); });

  // Legend — horizontal row at top of chart, above the plot area
  var legendItems = [
    { color: C.blue,   label: 'Assets' },
    { color: C.green,  label: 'Products' },
    { color: C.purple, label: 'Templates' },
    { color: C.red,    label: 'Users' },
    { color: C.orange, label: 'Downloads' }
  ];
  ctx.font = '10px system-ui';
  var legCursor = pad.left;
  var legY = 12;
  legendItems.forEach(function(item) {
    ctx.fillStyle = item.color;
    ctx.fillRect(legCursor, legY - 8, 10, 10);
    ctx.fillStyle = C.muted;
    ctx.textAlign = 'left';
    ctx.fillText(item.label, legCursor + 13, legY);
    legCursor += ctx.measureText(item.label).width + 28;
  });
})();

// ─────────────────────────────────────────────────────────────────────────────
// CHART 10 — New vs Returning Stacked Bar
// ─────────────────────────────────────────────────────────────────────────────
(function drawNewReturnChart() {
  var ci = initCanvas('newReturnChart', 180);
  if (!ci) return;
  var ctx = ci.ctx, w = ci.w, H = ci.H;

  var months = ['Mar', 'Apr', 'May'];
  var newUsers = [2333, 2203, 609];
  var retUsers = [2, 1549, 1705];

  var pad = { top: 24, bottom: 40, left: 56, right: 80 };
  var chartW = w - pad.left - pad.right;
  var chartH = H - pad.top - pad.bottom;

  var maxVal = Math.max.apply(null, months.map(function(_, i) { return newUsers[i] + retUsers[i]; })) * 1.1;

  function toY(v) { return pad.top + chartH - (v / maxVal) * chartH; }
  function toX(i) { return pad.left + (i + 0.5) * (chartW / months.length); }

  // Grid
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 1;
  for (var g = 0; g <= 4; g++) {
    var gy = pad.top + (g / 4) * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, gy);
    ctx.lineTo(pad.left + chartW, gy);
    ctx.stroke();
    var gv = maxVal * (1 - g / 4);
    ctx.fillStyle = C.dim;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(gv >= 1000 ? (gv/1000).toFixed(1)+'k' : Math.round(gv), pad.left - 5, gy + 3);
  }

  var barW = (chartW / months.length) * 0.55;

  months.forEach(function(m, i) {
    var x = toX(i) - barW / 2;
    var total = newUsers[i] + retUsers[i];

    // New users (bottom)
    var newH = (newUsers[i] / maxVal) * chartH;
    var baseY = pad.top + chartH - newH;
    ctx.fillStyle = C.blue + 'cc';
    roundRect(ctx, x, baseY, barW, newH, 3);
    ctx.fill();

    // Returning (stacked)
    var retH = (retUsers[i] / maxVal) * chartH;
    var retY = baseY - retH;
    ctx.fillStyle = C.purple + 'cc';
    roundRect(ctx, x, retY, barW, retH, 3);
    ctx.fill();

    // Percentage label
    var retPct = Math.round(retUsers[i] / total * 100);
    ctx.fillStyle = C.text;
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(retPct + '% ret.', toX(i), retY - 4);

    // X label
    ctx.fillStyle = C.muted;
    ctx.font = '11px system-ui';
    ctx.fillText(m, toX(i), H - 12);
  });

  // Legend
  var legX = w - 75;
  ctx.fillStyle = C.blue + 'cc';
  ctx.fillRect(legX, pad.top, 10, 10);
  ctx.fillStyle = C.muted;
  ctx.font = '11px system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('New', legX + 14, pad.top + 9);

  ctx.fillStyle = C.purple + 'cc';
  ctx.fillRect(legX, pad.top + 20, 10, 10);
  ctx.fillStyle = C.muted;
  ctx.fillText('Returning', legX + 14, pad.top + 29);
})();
