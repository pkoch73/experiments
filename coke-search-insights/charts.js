
(function() {

  // ─── DATA ────────────────────────────────────────────────────────────────────
  var top20 = [
    { rank:1,  term:'a250',                          type:'Assets',    searches:1254, zeroSearches:970 },
    { rank:2,  term:'fifa',                          type:'Assets',    searches:1175, zeroSearches:917 },
    { rank:3,  term:'#CCIconDesign2Lifestylephoto',  type:'Assets',    searches:1142, zeroSearches:850 },
    { rank:4,  term:'fanta',                         type:'Assets',    searches:1054, zeroSearches:743 },
    { rank:5,  term:'#fwc26cchumanity',              type:'Assets',    searches:976,  zeroSearches:792 },
    { rank:6,  term:'#FWC26photos',                  type:'Assets',    searches:931,  zeroSearches:585 },
    { rank:7,  term:'#fwc26compositelogos',          type:'Assets',    searches:873,  zeroSearches:664 },
    { rank:8,  term:'sprite',                        type:'Assets',    searches:852,  zeroSearches:662 },
    { rank:9,  term:'\u30AF\u30ED\u30B9\u30D6\u30E9\u30F3\u30C9', type:'Assets', searches:719, zeroSearches:582 },
    { rank:10, term:'A250',                          type:'Assets',    searches:717,  zeroSearches:495 },
    { rank:11, term:'coca-cola',                     type:'Assets',    searches:703,  zeroSearches:407 },
    { rank:12, term:'FIFA',                          type:'Assets',    searches:698,  zeroSearches:609 },
    { rank:13, term:'#fwc26ccfootball',              type:'Assets',    searches:571,  zeroSearches:440 },
    { rank:14, term:'powerade',                      type:'Assets',    searches:562,  zeroSearches:450 },
    { rank:15, term:'smartwater',                    type:'Assets',    searches:548,  zeroSearches:0 },
    { rank:16, term:'56507529',                      type:'Templates', searches:543,  zeroSearches:404 },
    { rank:17, term:'america 250',                   type:'Assets',    searches:537,  zeroSearches:411 },
    { rank:18, term:'intrinsic',                     type:'Assets',    searches:514,  zeroSearches:345 },
    { rank:19, term:'#CCIconDesign2Productphoto',    type:'Assets',    searches:484,  zeroSearches:0 },
    { rank:20, term:'meals',                         type:'Assets',    searches:479,  zeroSearches:355 }
  ];

  var buckets = [
    { label:'0 results',       count:187379, color:'#f87171' },
    { label:'1–10 results',    count:6834,   color:'#fb923c' },
    { label:'11–50 results',   count:7224,   color:'#fbbf24' },
    { label:'51–100 results',  count:4719,   color:'#22c55e' },
    { label:'101–500 results', count:11749,  color:'#3b82f6' },
    { label:'501–1000 results',count:4216,   color:'#a855f7' },
    { label:'1001+ results',   count:15407,  color:'#06b6d4' }
  ];
  var totalSearches = 237528;

  var regions = [
    { code:'NA',    searchers:2286, total:141937 },
    { code:'JSK',   searchers:488,  total:24476 },
    { code:'EU',    searchers:536,  total:24094 },
    { code:'LA',    searchers:450,  total:13848 },
    { code:'ASP',   searchers:258,  total:11359 },
    { code:'AFR',   searchers:149,  total:6130 },
    { code:'INSWA', searchers:67,   total:3454 },
    { code:'GCM',   searchers:43,   total:2354 },
    { code:'EME',   searchers:88,   total:1961 }
  ];

  var monthly = [
    { month:'Jan', assets:0,      products:0,    templates:0,    searchers:0 },
    { month:'Feb', assets:16,     products:0,    templates:0,    searchers:2 },
    { month:'Mar', assets:46210,  products:4159, templates:7180, searchers:2026 },
    { month:'Apr', assets:111875, products:10422,templates:14146,searchers:3296 },
    { month:'May', assets:35657,  products:3335, templates:4522, searchers:1856 }
  ];

  var roles = [
    { name:'Associate', searchers:2256, searches:82045 },
    { name:'Agency',    searchers:856,  searches:65870 },
    { name:'Bottler',   searchers:1474, searches:81595 },
    { name:'Other',     searchers:65,   searches:7015 }
  ];

  var bothTerms = [
    'a250','fifa','#CCIconDesign2Lifestylephoto','fanta',
    '#fwc26cchumanity','#FWC26photos','#fwc26compositelogos','sprite',
    '\u30AF\u30ED\u30B9\u30D6\u30E9\u30F3\u30C9','A250','coca-cola','FIFA',
    '#fwc26ccfootball','powerade','56507529','america 250','intrinsic','meals'
  ];

  // ─── HELPERS ─────────────────────────────────────────────────────────────────
  function pct(a, b) { return b === 0 ? 0 : (a / b * 100); }
  function fmt(n) { return n.toLocaleString(); }
  function rateColor(r) {
    if (r >= 75) return '#f87171';
    if (r >= 50) return '#fb923c';
    if (r >= 25) return '#fbbf24';
    return '#4ade80';
  }

  // ─── KPI STRIP ───────────────────────────────────────────────────────────────
  var kpiStrip = document.getElementById('kpi-strip');
  var kpis = [
    { value:'5,098', label:'Unique Users' },
    { value:'4,479', label:'Unique Searchers' },
    { value:'237,528', label:'Total Searches' },
    { value:'78.9%', label:'Zero-Result Rate', red:true }
  ];
  kpis.forEach(function(k) {
    var div = document.createElement('div');
    div.className = 'kpi-card';
    div.innerHTML = '<div class="kpi-value' + (k.red ? ' red' : '') + '">' + k.value + '</div>'
      + '<div class="kpi-label">' + k.label + '</div>';
    kpiStrip.appendChild(div);
  });

  // ─── S1: ZERO-RESULT TABLE ────────────────────────────────────────────────────
  var zrTbody = document.getElementById('zr-tbody');
  top20.forEach(function(d) {
    var rate = d.zeroSearches === 0 ? null : pct(d.zeroSearches, d.searches);
    var tr = document.createElement('tr');
    var rateCell;
    if (rate === null) {
      rateCell = '<td><span style="color:var(--dim)">—</span> <span style="font-size:10px;color:var(--dim)">&lt; est.</span></td>';
    } else {
      var col = rateColor(rate);
      rateCell = '<td><div class="bar-wrap">'
        + '<div class="mini-bar-track"><div class="mini-bar-fill" style="width:' + rate.toFixed(1) + '%;background:' + col + ';"></div></div>'
        + '<span class="rate-pct" style="color:' + col + '">' + rate.toFixed(1) + '%</span>'
        + '</div></td>';
    }
    tr.innerHTML = '<td class="rank-num">' + d.rank + '</td>'
      + '<td style="font-weight:600;color:var(--text);font-size:13px;">' + d.term + '</td>'
      + '<td><span class="term-tag' + (d.type === 'Templates' ? ' templates' : '') + '">' + d.type + '</span></td>'
      + '<td style="color:var(--muted);font-weight:600;">' + fmt(d.searches) + '</td>'
      + '<td style="color:var(--muted);">' + (d.zeroSearches === 0 ? '<span style="color:var(--dim)">0</span>' : fmt(d.zeroSearches)) + '</td>'
      + rateCell;
    zrTbody.appendChild(tr);
  });

  // ─── S2: FUNNEL BARS ─────────────────────────────────────────────────────────
  var funnelBars = document.getElementById('funnel-bars');
  buckets.forEach(function(b) {
    var p = pct(b.count, totalSearches);
    var row = document.createElement('div');
    row.className = 'funnel-row';
    row.innerHTML = '<div class="funnel-label">' + b.label + '</div>'
      + '<div class="funnel-track"><div class="funnel-fill" style="width:' + Math.max(p, 0.5).toFixed(2) + '%;background:' + b.color + ';">'
      + (p > 6 ? p.toFixed(1) + '%' : '') + '</div></div>'
      + '<div class="funnel-meta">' + fmt(b.count) + '<br><span style="color:var(--dim)">' + p.toFixed(1) + '%</span></div>';
    funnelBars.appendChild(row);
  });

  // ─── S2: FUNNEL DONUT CANVAS ─────────────────────────────────────────────────
  function drawFunnelDonut() {
    var canvas = document.getElementById('funnelDonut');
    var parent = canvas.parentElement;
    var dpr = window.devicePixelRatio || 1;
    var w = parent.clientWidth;
    var h = 260;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    var legendW = 130;
    var chartW = w - legendW;
    var cx = chartW / 2;
    var cy = h / 2;
    var outerR = Math.min(cx, cy) - 10;
    var innerR = outerR * 0.62;

    var total = buckets.reduce(function(s, b) { return s + b.count; }, 0);
    var startAngle = -Math.PI / 2;

    buckets.forEach(function(b) {
      var sweep = (b.count / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outerR, startAngle, startAngle + sweep);
      ctx.closePath();
      ctx.fillStyle = b.color;
      ctx.fill();
      startAngle += sweep;
    });

    // inner hole
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1c22';
    ctx.fill();

    // center text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 22px system-ui';
    ctx.fillText('78.9%', cx, cy - 9);
    ctx.fillStyle = '#8b8fa8';
    ctx.font = '11px system-ui';
    ctx.fillText('zero results', cx, cy + 12);

    // legend
    var lx = chartW + 8;
    var ly = 20;
    buckets.forEach(function(b) {
      var p = (b.count / total * 100).toFixed(1);
      ctx.fillStyle = b.color;
      ctx.fillRect(lx, ly, 10, 10);
      ctx.fillStyle = '#8b8fa8';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = '10px system-ui';
      ctx.fillText(b.label, lx + 14, ly);
      ctx.fillStyle = '#5a5e72';
      ctx.fillText(p + '%', lx + 14, ly + 12);
      ly += 30;
    });
  }

  // ─── S3: BOTH TERMS ──────────────────────────────────────────────────────────
  var bothContainer = document.getElementById('both-terms');
  bothTerms.forEach(function(t) {
    var d = document.createElement('div');
    d.className = 'overlap-term';
    d.textContent = t;
    bothContainer.appendChild(d);
  });

  // ─── S4: REGIONAL TABLE ──────────────────────────────────────────────────────
  var regTotal = regions.reduce(function(s, r) { return s + r.total; }, 0);
  var maxSpu = Math.max.apply(null, regions.map(function(r) { return r.total / r.searchers; }));
  var regTbody = document.getElementById('reg-tbody');
  regions.forEach(function(r) {
    var pctTotal = pct(r.total, regTotal);
    var spu = (r.total / r.searchers).toFixed(1);
    var barW = Math.round((r.total / r.searchers / maxSpu) * 80);
    var tr = document.createElement('tr');
    tr.innerHTML = '<td style="font-weight:700;color:var(--text);">' + r.code + '</td>'
      + '<td style="color:var(--muted);">' + fmt(r.searchers) + '</td>'
      + '<td style="color:var(--muted);">' + fmt(r.total) + '</td>'
      + '<td style="color:var(--muted);">' + pctTotal.toFixed(1) + '%</td>'
      + '<td><div class="bar-wrap">'
      + '<div class="mini-bar-track" style="width:80px;"><div class="mini-bar-fill" style="width:' + barW + 'px;background:#F40009;height:6px;"></div></div>'
      + '<span style="font-size:12px;font-weight:700;color:var(--text);min-width:36px;">' + spu + '</span>'
      + '</div></td>';
    regTbody.appendChild(tr);
  });

  // ─── S4: REGIONAL CHART ──────────────────────────────────────────────────────
  function drawRegionalChart() {
    var canvas = document.getElementById('regionalChart');
    var parent = canvas.parentElement;
    var dpr = window.devicePixelRatio || 1;
    var w = parent.clientWidth;
    var h = 320;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    var pad = { top: 20, right: 60, bottom: 30, left: 60 };
    var chartW = w - pad.left - pad.right;
    var chartH = h - pad.top - pad.bottom;

    var spuVals = regions.map(function(r) { return r.total / r.searchers; });
    var maxVal = Math.max.apply(null, spuVals) * 1.1;
    var barH = Math.floor(chartH / regions.length) - 4;

    // grid lines (vertical)
    ctx.strokeStyle = '#2e3140';
    ctx.lineWidth = 1;
    for (var g = 0; g <= 5; g++) {
      var gx = pad.left + (g / 5) * chartW;
      ctx.beginPath();
      ctx.moveTo(gx, pad.top);
      ctx.lineTo(gx, pad.top + chartH);
      ctx.stroke();
    }

    regions.forEach(function(r, i) {
      var spu = r.total / r.searchers;
      var barLen = (spu / maxVal) * chartW;
      var by = pad.top + i * (chartH / regions.length) + 2;

      // bar
      ctx.fillStyle = '#F40009';
      ctx.globalAlpha = 0.85;
      ctx.fillRect(pad.left, by, barLen, barH);
      ctx.globalAlpha = 1;

      // region label
      ctx.fillStyle = '#e8eaf0';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(r.code, pad.left - 8, by + barH / 2);

      // value label
      ctx.fillStyle = '#8b8fa8';
      ctx.font = '11px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(spu.toFixed(1), pad.left + barLen + 6, by + barH / 2);
    });

    // blue dot overlay for % of total
    var totalVol = regions.reduce(function(s, r) { return s + r.total; }, 0);
    var maxPct = pct(regions[0].total, totalVol);
    regions.forEach(function(r, i) {
      var p = pct(r.total, totalVol);
      var dotX = pad.left + (p / (maxPct * 1.1)) * chartW;
      var by = pad.top + i * (chartH / regions.length) + 2;
      ctx.beginPath();
      ctx.arc(dotX, by + barH / 2, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
    });

    // X axis labels
    ctx.fillStyle = '#5a5e72';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (var g2 = 0; g2 <= 5; g2++) {
      var gv = (maxVal * g2 / 5).toFixed(0);
      ctx.fillText(gv, pad.left + (g2 / 5) * chartW, pad.top + chartH + 6);
    }

    // legend
    ctx.fillStyle = '#F40009';
    ctx.fillRect(pad.left, h - 12, 10, 8);
    ctx.fillStyle = '#8b8fa8';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Searches/Searcher', pad.left + 14, h - 8);

    ctx.beginPath();
    ctx.arc(pad.left + 120 + 5, h - 8, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    ctx.fillStyle = '#8b8fa8';
    ctx.fillText('% of Total Volume', pad.left + 132, h - 8);
  }

  // ─── S5: TREND CHART ─────────────────────────────────────────────────────────
  function drawTrendChart() {
    var canvas = document.getElementById('trendChart');
    var parent = canvas.parentElement;
    var dpr = window.devicePixelRatio || 1;
    var w = parent.clientWidth;
    var h = 340;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    var pad = { top: 50, right: 70, bottom: 50, left: 70 };
    var chartW = w - pad.left - pad.right;
    var chartH = h - pad.top - pad.bottom;
    var n = monthly.length;
    var barGroupW = chartW / n;
    var barW = barGroupW * 0.55;

    var maxSearches = Math.max.apply(null, monthly.map(function(m) { return m.assets + m.products + m.templates; })) * 1.1;
    var maxSearchers = Math.max.apply(null, monthly.map(function(m) { return m.searchers; })) * 1.15;

    // grid
    ctx.strokeStyle = '#2e3140';
    ctx.lineWidth = 1;
    for (var g = 0; g <= 5; g++) {
      var gy = pad.top + (g / 5) * chartH;
      ctx.beginPath();
      ctx.moveTo(pad.left, gy);
      ctx.lineTo(pad.left + chartW, gy);
      ctx.stroke();
      var gv = Math.round(maxSearches * (1 - g / 5));
      ctx.fillStyle = '#5a5e72';
      ctx.font = '10px system-ui';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(gv > 1000 ? (gv / 1000).toFixed(0) + 'k' : gv, pad.left - 8, gy);
    }

    // right axis (searchers)
    for (var g2 = 0; g2 <= 4; g2++) {
      var gv2 = Math.round(maxSearchers * (1 - g2 / 4));
      ctx.fillStyle = '#f87171';
      ctx.font = '10px system-ui';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(gv2, pad.left + chartW + 8, pad.top + (g2 / 4) * chartH);
    }

    var colors = { assets: '#3b82f6', products: '#22c55e', templates: '#a855f7' };

    monthly.forEach(function(m, i) {
      var bx = pad.left + i * barGroupW + (barGroupW - barW) / 2;
      var total = m.assets + m.products + m.templates;

      // stacked bars
      var keys = ['assets', 'products', 'templates'];
      var yOff = pad.top + chartH;
      keys.forEach(function(k) {
        var val = m[k];
        if (val === 0) return;
        var bh = (val / maxSearches) * chartH;
        yOff -= bh;
        ctx.fillStyle = colors[k];
        ctx.globalAlpha = 0.85;
        ctx.fillRect(bx, yOff, barW, bh);
        ctx.globalAlpha = 1;
      });

      // X axis month labels
      ctx.fillStyle = '#8b8fa8';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(m.month, bx + barW / 2, pad.top + chartH + 8);
    });

    // red line: searchers
    ctx.beginPath();
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    monthly.forEach(function(m, i) {
      var bx = pad.left + i * barGroupW + barGroupW / 2;
      var sy = pad.top + chartH - (m.searchers / maxSearchers) * chartH;
      if (i === 0) ctx.moveTo(bx, sy);
      else ctx.lineTo(bx, sy);
    });
    ctx.stroke();

    // dots + labels
    monthly.forEach(function(m, i) {
      var bx = pad.left + i * barGroupW + barGroupW / 2;
      var sy = pad.top + chartH - (m.searchers / maxSearchers) * chartH;
      ctx.beginPath();
      ctx.arc(bx, sy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f87171';
      ctx.fill();
      if (m.searchers > 0) {
        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 11px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(fmt(m.searchers), bx, sy - 6);
      }
    });

    // legend
    var lItems = [
      { color: '#3b82f6', label: 'Assets' },
      { color: '#22c55e', label: 'Products' },
      { color: '#a855f7', label: 'Templates' },
      { color: '#f87171', label: 'Searchers →' }
    ];
    var lx = pad.left;
    lItems.forEach(function(li) {
      ctx.fillStyle = li.color;
      ctx.fillRect(lx, 14, 12, 12);
      ctx.fillStyle = '#8b8fa8';
      ctx.font = '11px system-ui';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(li.label, lx + 16, 20);
      lx += ctx.measureText(li.label).width + 36;
    });

    // right axis label
    ctx.save();
    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 10px system-ui';
    ctx.textAlign = 'center';
    ctx.translate(w - 12, pad.top + chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Searchers', 0, 0);
    ctx.restore();
  }

  // ─── S6: ROLE CARDS ──────────────────────────────────────────────────────────
  var roleColors = ['#3b82f6', '#fb923c', '#22c55e', '#a855f7'];
  var roleCards = document.getElementById('role-cards');
  roles.forEach(function(r, i) {
    var spu = (r.searches / r.searchers).toFixed(1);
    var intensity, iClass;
    var spuN = parseFloat(spu);
    if (spuN < 40) { intensity = 'Low'; iClass = 'intensity-low'; }
    else if (spuN < 60) { intensity = 'Medium'; iClass = 'intensity-medium'; }
    else if (spuN < 80) { intensity = 'High'; iClass = 'intensity-high'; }
    else { intensity = 'Power'; iClass = 'intensity-power'; }

    var card = document.createElement('div');
    card.className = 'role-card';
    card.innerHTML = '<div class="role-name">' + r.name + '</div>'
      + '<div class="role-spu" style="color:' + roleColors[i] + '">' + spu + '</div>'
      + '<div class="role-spu-label">searches / user</div>'
      + '<div class="role-stat"><strong>' + fmt(r.searchers) + '</strong> searchers</div>'
      + '<div class="role-stat"><strong>' + fmt(r.searches) + '</strong> total searches</div>'
      + '<span class="intensity-badge ' + iClass + '">' + intensity + '</span>';
    roleCards.appendChild(card);
  });

  // ─── S6: ROLE CHART ──────────────────────────────────────────────────────────
  function drawRoleChart() {
    var canvas = document.getElementById('roleChart');
    var parent = canvas.parentElement;
    var dpr = window.devicePixelRatio || 1;
    var w = parent.clientWidth;
    var h = 280;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    var pad = { top: 40, right: 70, bottom: 50, left: 70 };
    var chartW = w - pad.left - pad.right;
    var chartH = h - pad.top - pad.bottom;
    var n = roles.length;
    var groupW = chartW / n;
    var barW = groupW * 0.28;
    var gap = barW * 0.3;

    var maxSearchers = Math.max.apply(null, roles.map(function(r) { return r.searchers; })) * 1.2;
    var maxSearches  = Math.max.apply(null, roles.map(function(r) { return r.searches; }))  * 1.2;

    // grid
    ctx.strokeStyle = '#2e3140';
    ctx.lineWidth = 1;
    for (var g = 0; g <= 4; g++) {
      var gy = pad.top + (g / 4) * chartH;
      ctx.beginPath();
      ctx.moveTo(pad.left, gy);
      ctx.lineTo(pad.left + chartW, gy);
      ctx.stroke();
    }

    roles.forEach(function(r, i) {
      var cx = pad.left + i * groupW + groupW / 2;
      var col = roleColors[i];

      // searchers bar (left scale)
      var sbH = (r.searchers / maxSearchers) * chartH;
      var sbX = cx - barW - gap / 2;
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(sbX, pad.top + chartH - sbH, barW, sbH);
      ctx.globalAlpha = 1;

      // searches bar (right scale, transparent)
      var schH = (r.searches / maxSearches) * chartH;
      var schX = cx + gap / 2;
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.35;
      ctx.fillRect(schX, pad.top + chartH - schH, barW, schH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = col;
      ctx.lineWidth = 1;
      ctx.strokeRect(schX, pad.top + chartH - schH, barW, schH);

      // label above group
      var spu = (r.searches / r.searchers).toFixed(1);
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 11px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(spu + 'x/user', cx, pad.top + chartH - Math.max(sbH, schH) - 4);

      // x axis label
      ctx.fillStyle = '#8b8fa8';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(r.name, cx, pad.top + chartH + 8);
    });

    // left axis
    for (var g2 = 0; g2 <= 4; g2++) {
      var gv2 = Math.round(maxSearchers * (1 - g2 / 4));
      ctx.fillStyle = '#5a5e72';
      ctx.font = '10px system-ui';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(gv2 > 1000 ? (gv2 / 1000).toFixed(1) + 'k' : gv2, pad.left - 8, pad.top + (g2 / 4) * chartH);
    }

    // right axis
    for (var g3 = 0; g3 <= 4; g3++) {
      var gv3 = Math.round(maxSearches * (1 - g3 / 4));
      ctx.fillStyle = '#5a5e72';
      ctx.font = '10px system-ui';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(gv3 > 1000 ? (gv3 / 1000).toFixed(0) + 'k' : gv3, pad.left + chartW + 8, pad.top + (g3 / 4) * chartH);
    }

    // legend
    ctx.fillStyle = '#8b8fa8';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillRect(pad.left, 12, 12, 10);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(pad.left, 12, 12, 10);
    ctx.fillStyle = '#8b8fa8';
    ctx.fillText('Searchers (solid)', pad.left + 16, 17);

    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(pad.left + 130, 12, 12, 10);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#3b82f6';
    ctx.strokeRect(pad.left + 130, 12, 12, 10);
    ctx.fillStyle = '#8b8fa8';
    ctx.fillText('Total Searches (outline)', pad.left + 146, 17);
  }

  // ─── DRAW ALL CANVAS ─────────────────────────────────────────────────────────
  function drawAll() {
    drawFunnelDonut();
    drawRegionalChart();
    drawTrendChart();
    drawRoleChart();
  }

  drawAll();

  window.addEventListener('resize', function() {
    drawAll();
  });

})();
