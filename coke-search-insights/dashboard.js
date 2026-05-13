
// ─── UTILITIES ──────────────────────────────────────────────────────────────
function initCanvas(id, H) {
  const canvas = document.getElementById(id);
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.parentElement.clientWidth || 600;
  canvas.width = w * dpr;
  canvas.height = H * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, w, H };
}

function fmt(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n/1000).toFixed(1) + 'K';
  return n.toString();
}

function fmtFull(n) {
  return n.toLocaleString();
}

function drawGrid(ctx, x0, y0, x1, y1, steps) {
  ctx.strokeStyle = 'rgba(46,49,64,0.5)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= steps; i++) {
    const y = y0 + (y1 - y0) * (i / steps);
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
  }
}

function roundRect(ctx, x, y, w, h, r) {
  if (w < 0) { x += w; w = -w; }
  if (h < 0) { y += h; h = -h; }
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
}

// ─── COLORS ─────────────────────────────────────────────────────────────────
const C = {
  red: '#F40009', green: '#22c55e', orange: '#fb923c',
  yellow: '#fbbf24', blue: '#3b82f6', purple: '#a855f7',
  teal: '#14b8a6', text: '#e8eaf0', muted: '#8b8fa8',
  dim: '#5a5e72', border: '#2e3140', surface2: '#22252e'
};

// ─── CHART 1: Overview Monthly ───────────────────────────────────────────────
(function drawOverviewMonthly() {
  const { ctx, w, H } = initCanvas('overviewMonthlyChart', 280);
  const pad = { top: 36, right: 40, bottom: 52, left: 64 };
  const cw = w - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  const months = ['Feb', 'Mar', 'Apr', 'May'];
  // Scaled values for display — searches/1000, downloads raw, logins/100
  const searchRaw =   [16,    46210+4159+7180, 111875+10422+14146, 35657+3335+4522];
  const dlRaw =       [0,     4842+807,         16604+1459,          7171+394];
  const loginRaw =    [9,     7240,             34567,               14077];

  // Normalize searches/1000 for bar scale
  const searches = searchRaw.map(v => v / 1000);
  const dls = dlRaw;
  const logins = loginRaw.map(v => v / 100);

  const maxVal = Math.max(...searches, ...dls, ...logins) * 1.15;
  const n = months.length;
  const groupW = cw / n;
  const barW = groupW * 0.22;
  const gap = 4;

  // Grid
  const gridSteps = 5;
  ctx.font = '10px system-ui';
  ctx.fillStyle = C.dim;
  ctx.textAlign = 'right';
  for (let i = 0; i <= gridSteps; i++) {
    const v = maxVal * (1 - i / gridSteps);
    const y = pad.top + ch * (i / gridSteps);
    ctx.fillText(fmt(Math.round(v)), pad.left - 8, y + 4);
    ctx.strokeStyle = 'rgba(46,49,64,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + cw, y);
    ctx.stroke();
  }

  // Y label
  ctx.save();
  ctx.translate(14, pad.top + ch / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillStyle = C.dim;
  ctx.font = '10px system-ui';
  ctx.fillText('Scaled Units', 0, 0);
  ctx.restore();

  // Bars
  months.forEach((mo, i) => {
    const cx = pad.left + i * groupW + groupW / 2;
    const datasets = [
      { val: searches[i], color: C.blue },
      { val: dls[i],      color: C.green },
      { val: logins[i],   color: C.red }
    ];
    const totalBarW = datasets.length * barW + (datasets.length - 1) * gap;
    let bx = cx - totalBarW / 2;

    datasets.forEach(ds => {
      const barH = (ds.val / maxVal) * ch;
      const by = pad.top + ch - barH;
      ctx.fillStyle = ds.color;
      ctx.beginPath();
      roundRect(ctx, bx, by, barW, barH, 3);
      ctx.fill();
      bx += barW + gap;
    });

    // X label
    ctx.fillStyle = C.dim;
    ctx.textAlign = 'center';
    ctx.font = '11px system-ui';
    ctx.fillText(mo, cx, pad.top + ch + 16);
  });

  // Legend
  const legendItems = [
    { label: 'Searches ÷1K', color: C.blue },
    { label: 'Downloads', color: C.green },
    { label: 'Logins ÷100', color: C.red }
  ];
  let lx = pad.left;
  const ly = H - 10;
  ctx.font = '11px system-ui';
  legendItems.forEach(li => {
    ctx.fillStyle = li.color;
    ctx.fillRect(lx, ly - 8, 12, 8);
    ctx.fillStyle = C.muted;
    ctx.textAlign = 'left';
    ctx.fillText(li.label, lx + 16, ly);
    lx += ctx.measureText(li.label).width + 36;
  });
})();

// ─── CHART 2: Funnel ─────────────────────────────────────────────────────────
(function drawFunnel() {
  const { ctx, w, H } = initCanvas('funnelCanvas', 320);
  const stages = [
    { label: 'Unique Users',       n: 5117, pct: 1.000, color: C.blue },
    { label: 'Unique Searchers',   n: 4479, pct: 0.875, color: C.orange },
    { label: 'Unique Downloaders', n: 2667, pct: 0.521, color: C.green }
  ];

  const maxW = w * 0.55;
  const minW = maxW * 0.25;
  const stageH = 72;
  const gapH = 20;
  const totalH = stages.length * stageH + (stages.length - 1) * gapH;
  const startY = (H - totalH) / 2;
  const cx = w * 0.38;

  const dropoffs = [
    { text: '−638 never searched', pct: '−12.5%' },
    { text: '−1,812 searched, never downloaded', pct: '−35.4%' }
  ];

  stages.forEach((stage, i) => {
    const trapW = minW + (maxW - minW) * stage.pct;
    const y = startY + i * (stageH + gapH);

    // Trapezoid
    const prevW = i === 0 ? trapW : minW + (maxW - minW) * stages[i-1].pct;
    const topW = i === 0 ? trapW : prevW;
    const botW = trapW;
    const topL = cx - topW / 2;
    const botL = cx - botW / 2;

    ctx.beginPath();
    ctx.moveTo(topL, y);
    ctx.lineTo(topL + topW, y);
    ctx.lineTo(botL + botW, y + stageH);
    ctx.lineTo(botL, y + stageH);
    ctx.closePath();

    ctx.fillStyle = stage.color + '28';
    ctx.fill();
    ctx.strokeStyle = stage.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label inside
    ctx.fillStyle = C.text;
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(stage.label, cx, y + stageH / 2 - 4);
    ctx.font = 'bold 20px system-ui';
    ctx.fillStyle = stage.color;
    ctx.fillText(fmtFull(stage.n), cx, y + stageH / 2 + 16);

    // Percentage pill on left
    ctx.fillStyle = stage.color + '33';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(botL - 60, y + stageH/2 - 11, 52, 22, 11) : ctx.rect(botL - 60, y + stageH/2 - 11, 52, 22);
    ctx.fill();
    ctx.fillStyle = stage.color;
    ctx.font = 'bold 12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText((stage.pct * 100).toFixed(1) + '%', botL - 34, y + stageH/2 + 4);

    // Drop-off annotation on right
    if (i < dropoffs.length) {
      const dropY = y + stageH + gapH / 2;
      const rx = cx + maxW / 2 + 16;
      ctx.fillStyle = C.muted;
      ctx.font = '11px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(dropoffs[i].text, rx, dropY - 4);
      ctx.fillStyle = C.red;
      ctx.font = 'bold 12px system-ui';
      ctx.fillText(dropoffs[i].pct, rx, dropY + 10);

      // Arrow
      ctx.strokeStyle = C.dim;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx + trapW / 2, y + stageH + 2);
      ctx.lineTo(rx - 6, dropY + 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });
})();

// ─── CHART 3: Result Size Donut ──────────────────────────────────────────────
(function drawResultDonut() {
  const { ctx, w, H } = initCanvas('resultSizeDonut', 260);

  const segments = [
    { label: 'Zero results',   val: 187379, color: C.red },
    { label: '1–10',           val: 6834,   color: '#166534' },
    { label: '11–50',          val: 7224,   color: '#15803d' },
    { label: '51–100',         val: 4719,   color: '#16a34a' },
    { label: '101–500',        val: 11749,  color: C.green },
    { label: '501–1000',       val: 4216,   color: '#4ade80' },
    { label: '1001–10000',     val: 15407,  color: '#86efac' }
  ];

  const total = segments.reduce((s, x) => s + x.val, 0);
  const cx = w / 2;
  const cy = H * 0.46;
  const outerR = Math.min(cx, cy) * 0.75;
  const innerR = outerR * 0.6;
  const gap = 0.012;

  let angle = -Math.PI / 2;
  segments.forEach(seg => {
    const sweep = (seg.val / total) * (Math.PI * 2) - gap;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, angle + gap/2, angle + gap/2 + sweep);
    ctx.arc(cx, cy, innerR, angle + gap/2 + sweep, angle + gap/2, true);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    angle += sweep + gap;
  });

  // Center text
  ctx.fillStyle = C.text;
  ctx.font = 'bold 24px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('78.9%', cx, cy - 2);
  ctx.fillStyle = C.red;
  ctx.font = 'bold 12px system-ui';
  ctx.fillText('zero results', cx, cy + 16);

  // Legend
  const legY = H - 10;
  const colW = w / 4;
  segments.forEach((seg, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const lx = col * colW + 8;
    const ly = legY - (Math.ceil(segments.length / 4) - 1 - row) * 18;
    ctx.fillStyle = seg.color;
    ctx.fillRect(lx, ly - 7, 10, 10);
    ctx.fillStyle = C.muted;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(seg.label, lx + 13, ly + 2);
  });
})();

// ─── ZERO RESULT TABLE ───────────────────────────────────────────────────────
(function buildZRTable() {
  const data = [
    ['a250',                    1254, 970],
    ['fifa',                    1175, 917],
    ['#CCIconDesign2Lifestyle',  1142, 850],
    ['fanta',                   1054, 743],
    ['#fwc26cchumanity',         976, 792],
    ['#FWC26photos',             931, 585],
    ['#fwc26compositelogos',      873, 664],
    ['sprite',                    852, 662],
    ['クロスブランド',             719, 582],
    ['A250',                      717, 495],
    ['coca-cola',                 703, 407],
    ['FIFA',                      698, 609],
    ['#fwc26ccfootball',          571, 440],
    ['powerade',                  562, 450],
    ['smartwater',                548,   0],
    ['56507529',                  543, 404],
    ['america 250',               537, 411],
    ['intrinsic',                 514, 345],
    ['#CCIconDesign2Product',      484,   0],
    ['meals',                     479, 355]
  ];

  const tbody = document.getElementById('zr-tbody');
  data.forEach(([term, searches, zr], idx) => {
    const pct = searches > 0 ? (zr / searches * 100) : 0;
    let barColor;
    if (pct >= 75) barColor = C.red;
    else if (pct >= 50) barColor = C.orange;
    else if (pct >= 25) barColor = C.yellow;
    else barColor = C.green;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="rank-cell">${idx + 1}</td>
      <td class="term-cell">${term}</td>
      <td class="num-cell">${fmtFull(searches)}</td>
      <td class="num-cell">${fmtFull(zr)}</td>
      <td class="bar-cell">
        <div class="fail-bar-wrap">
          <div class="fail-bar-bg">
            <div class="fail-bar-fill" style="width:${pct.toFixed(1)}%;background:${barColor};"></div>
          </div>
          <span class="fail-pct" style="color:${barColor}">${pct.toFixed(0)}%</span>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
})();

// ─── CHART 4: Region Grouped Bars ────────────────────────────────────────────
(function drawRegionChart() {
  const { ctx, w, H } = initCanvas('regionChart', 320);
  const pad = { top: 30, right: 20, bottom: 55, left: 60 };
  const cw = w - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  // sorted by searches desc
  const regions = [
    { name: 'NA',    users: 2591, searches: 141937, downloads: 14460 },
    { name: 'JSK',   users: 515,  searches: 24476,  downloads: 5696  },
    { name: 'EU',    users: 633,  searches: 24094,  downloads: 3774  },
    { name: 'LA',    users: 542,  searches: 13848,  downloads: 2313  },
    { name: 'ASP',   users: 289,  searches: 11359,  downloads: 1380  },
    { name: 'AFR',   users: 164,  searches: 6130,   downloads: 1527  },
    { name: 'INSWA', users: 85,   searches: 3454,   downloads: 645   },
    { name: 'GCM',   users: 52,   searches: 2354,   downloads: 302   },
    { name: 'EME',   users: 106,  searches: 1961,   downloads: 260   }
  ];

  // normalize: users raw, searches÷100, downloads×2
  const vals = regions.map(r => [r.users, r.searches / 100, r.downloads * 2]);
  const maxVal = Math.max(...vals.flat()) * 1.15;

  const n = regions.length;
  const groupW = cw / n;
  const barW = groupW * 0.22;
  const gap = 3;
  const colors = [C.blue, C.orange, C.green];
  const gridSteps = 5;

  // Grid & Y axis
  ctx.font = '10px system-ui';
  ctx.fillStyle = C.dim;
  ctx.textAlign = 'right';
  for (let i = 0; i <= gridSteps; i++) {
    const v = maxVal * (1 - i / gridSteps);
    const y = pad.top + ch * (i / gridSteps);
    ctx.fillText(fmt(Math.round(v)), pad.left - 6, y + 4);
    ctx.strokeStyle = 'rgba(46,49,64,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + cw, y);
    ctx.stroke();
  }

  regions.forEach((r, i) => {
    const cx = pad.left + i * groupW + groupW / 2;
    const groupVals = vals[i];
    const totalBarW = 3 * barW + 2 * gap;
    let bx = cx - totalBarW / 2;

    groupVals.forEach((val, j) => {
      const barH = (val / maxVal) * ch;
      const by = pad.top + ch - barH;
      ctx.fillStyle = colors[j];
      ctx.beginPath();
      roundRect(ctx, bx, by, barW, barH, 3);
      ctx.fill();
      bx += barW + gap;
    });

    ctx.fillStyle = C.muted;
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(r.name, cx, pad.top + ch + 16);
  });

  // Legend
  const lItems = ['Users', 'Searches÷100', 'Downloads×2'];
  let lx = pad.left;
  const ly = H - 6;
  lItems.forEach((lbl, i) => {
    ctx.fillStyle = colors[i];
    ctx.fillRect(lx, ly - 8, 10, 8);
    ctx.fillStyle = C.muted;
    ctx.font = '11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(lbl, lx + 14, ly);
    lx += ctx.measureText(lbl).width + 32;
  });
})();

// ─── REGION TABLE ────────────────────────────────────────────────────────────
(function buildRegionTable() {
  const data = [
    { name:'NA',    users:2591, searches:141937, downloads:14460, su:54.8, du:5.6,  lu:16.9, yoy:-17 },
    { name:'JSK',   users:515,  searches:24476,  downloads:5696,  su:47.5, du:11.1, lu:6.1,  yoy:+1  },
    { name:'EU',    users:633,  searches:24094,  downloads:3774,  su:38.1, du:6.0,  lu:4.8,  yoy:-25 },
    { name:'LA',    users:542,  searches:13848,  downloads:2313,  su:25.5, du:4.3,  lu:3.4,  yoy:-5  },
    { name:'ASP',   users:289,  searches:11359,  downloads:1380,  su:39.3, du:4.8,  lu:4.8,  yoy:+6  },
    { name:'AFR',   users:164,  searches:6130,   downloads:1527,  su:37.4, du:9.3,  lu:4.4,  yoy:+107},
    { name:'INSWA', users:85,   searches:3454,   downloads:645,   su:40.6, du:7.6,  lu:6.2,  yoy:+167},
    { name:'GCM',   users:52,   searches:2354,   downloads:302,   su:45.3, du:5.8,  lu:4.8,  yoy:-16 },
    { name:'EME',   users:106,  searches:1961,   downloads:260,   su:18.5, du:2.5,  lu:3.1,  yoy:-6  }
  ];

  const tbody = document.getElementById('region-tbody');
  data.forEach(r => {
    const yoyClass = r.yoy >= 0 ? 'yoy-pos' : 'yoy-neg';
    const yoyStr = (r.yoy >= 0 ? '+' : '') + r.yoy + '%';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:700">${r.name}</td>
      <td class="num-cell">${fmtFull(r.users)}</td>
      <td class="num-cell">${fmtFull(r.searches)}</td>
      <td class="num-cell">${fmtFull(r.downloads)}</td>
      <td class="num-cell">${r.su}</td>
      <td class="num-cell">${r.du}</td>
      <td class="num-cell">${r.lu}</td>
      <td class="num-cell ${yoyClass}">${yoyStr}</td>
    `;
    tbody.appendChild(tr);
  });
})();

// ─── CHART 5: Role Horizontal Bars ───────────────────────────────────────────
(function drawRoleChart() {
  const { ctx, w, H } = initCanvas('roleChart', 280);
  const pad = { top: 20, right: 100, bottom: 30, left: 90 };
  const cw = w - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  const roles = [
    { name: 'Associate', su: 31.3,  du: 7.1,  lu: 4.1 },
    { name: 'Agency',    su: 68.8,  du: 16.3, lu: 7.3 },
    { name: 'Bottler',   su: 50.0,  du: 7.5,  lu: 5.5 },
    { name: 'Other',     su: 106.3, du: 0,    lu: 11.7 }
  ];

  const maxSU = Math.max(...roles.map(r => r.su));
  const maxDU = Math.max(...roles.map(r => r.du));
  const maxLU = Math.max(...roles.map(r => r.lu));

  const rowH = ch / roles.length;
  const barH = rowH * 0.22;
  const gap = 3;
  const colors = [C.blue, C.green, C.red];
  const labels = ['Searches/User', 'Downloads/User', 'Logins/User'];
  const maxes = [maxSU, maxDU, maxLU];

  roles.forEach((role, i) => {
    const y0 = pad.top + i * rowH + rowH * 0.12;
    const vals = [role.su, role.du, role.lu];
    const normVals = vals.map((v, j) => maxes[j] > 0 ? v / maxes[j] : 0);

    // Role label
    ctx.fillStyle = C.text;
    ctx.font = 'bold 13px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(role.name, pad.left - 10, y0 + (3 * barH + 2 * gap) / 2 + 5);

    normVals.forEach((nv, j) => {
      const by = y0 + j * (barH + gap);
      const bw = nv * cw;
      ctx.fillStyle = colors[j];
      ctx.beginPath();
      roundRect(ctx, pad.left, by, bw, barH, 3);
      ctx.fill();

      // Value label
      ctx.fillStyle = C.text;
      ctx.font = 'bold 10px system-ui';
      ctx.textAlign = 'left';
      const rawVal = vals[j];
      ctx.fillText(rawVal > 0 ? rawVal.toFixed(1) : '—', pad.left + bw + 5, by + barH - 2);
    });
  });

  // X axis
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + ch);
  ctx.lineTo(pad.left + cw, pad.top + ch);
  ctx.stroke();

  // Legend
  let lx = pad.left;
  const ly = H - 4;
  labels.forEach((lbl, i) => {
    ctx.fillStyle = colors[i];
    ctx.fillRect(lx, ly - 8, 10, 8);
    ctx.fillStyle = C.muted;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(lbl, lx + 13, ly);
    lx += ctx.measureText(lbl).width + 30;
  });
})();

// ─── CHART 6: Campaign Horizontal Bars ───────────────────────────────────────
(function drawCampaignChart() {
  const { ctx, w, H } = initCanvas('campaignChart', 340);
  const pad = { top: 16, right: 90, bottom: 30, left: 195 };
  const cw = w - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  const campaigns = [
    { name: 'None / Coca-Cola Zero', dl: 10287, dlrs: 1412, ous: 81, tagged: false },
    { name: 'FIFA WC 2026',           dl: 4924,  dlrs: 502,  ous: 74, tagged: true  },
    { name: 'unknown / Coca-Cola',    dl: 3687,  dlrs: 1060, ous: 67, tagged: false },
    { name: 'America 250',            dl: 1711,  dlrs: 218,  ous: 9,  tagged: true  },
    { name: 'Sprite Summer 2026',     dl: 865,   dlrs: 150,  ous: 54, tagged: true  },
    { name: 'CocaCola Sustaining',    dl: 737,   dlrs: 260,  ous: 56, tagged: true  },
    { name: 'Ice Cold 2026',          dl: 543,   dlrs: 61,   ous: 31, tagged: true  },
    { name: 'Fanta Gaming 2026',      dl: 539,   dlrs: 101,  ous: 32, tagged: true  },
    { name: 'Powerade FIFA',          dl: 325,   dlrs: 85,   ous: 31, tagged: true  },
    { name: 'Always On Soccer',       dl: 301,   dlrs: 125,  ous: 24, tagged: true  }
  ];

  const maxDL = campaigns[0].dl * 1.15;
  const rowH = ch / campaigns.length;
  const barH = rowH * 0.48;

  // Grid lines
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const x = pad.left + (i / gridSteps) * cw;
    ctx.strokeStyle = 'rgba(46,49,64,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, pad.top);
    ctx.lineTo(x, pad.top + ch);
    ctx.stroke();
    ctx.fillStyle = C.dim;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(fmt(Math.round(maxDL * i / gridSteps)), x, pad.top + ch + 14);
  }

  campaigns.forEach((camp, i) => {
    const by = pad.top + i * rowH + (rowH - barH) / 2;
    const bw = (camp.dl / maxDL) * cw;
    const barColor = camp.tagged ? C.red : C.dim;
    const fillAlpha = camp.tagged ? '33' : '22';

    ctx.fillStyle = barColor + fillAlpha;
    ctx.beginPath();
    roundRect(ctx, pad.left, by, cw, barH, 4);
    ctx.fill();

    ctx.fillStyle = barColor;
    ctx.beginPath();
    roundRect(ctx, pad.left, by, bw, barH, 4);
    ctx.fill();

    // Campaign name
    ctx.fillStyle = camp.tagged ? C.text : C.muted;
    ctx.font = (i === 0 ? 'bold ' : '') + '12px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(camp.name, pad.left - 8, by + barH / 2 + 4);

    // Download label
    ctx.fillStyle = C.text;
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(fmtFull(camp.dl), pad.left + bw + 6, by + barH / 2 + 4);

    // OUs label
    ctx.fillStyle = C.dim;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(camp.ous + ' OUs', w - 4, by + barH / 2 + 4);
  });
})();

// ─── CAMPAIGN TABLE ───────────────────────────────────────────────────────────
(function buildCampaignTable() {
  const data = [
    { name: 'None / Coca-Cola Zero',  dl: 10287, dlrs: 1412, ous: 81 },
    { name: 'FIFA WC 2026',            dl: 4924,  dlrs: 502,  ous: 74 },
    { name: 'unknown / Coca-Cola',     dl: 3687,  dlrs: 1060, ous: 67 },
    { name: 'America 250',             dl: 1711,  dlrs: 218,  ous: 9  },
    { name: 'Sprite Summer 2026',      dl: 865,   dlrs: 150,  ous: 54 },
    { name: 'CocaCola Sustaining',     dl: 737,   dlrs: 260,  ous: 56 },
    { name: 'Ice Cold 2026',           dl: 543,   dlrs: 61,   ous: 31 },
    { name: 'Fanta Gaming 2026',       dl: 539,   dlrs: 101,  ous: 32 },
    { name: 'Powerade FIFA',           dl: 325,   dlrs: 85,   ous: 31 },
    { name: 'Always On Soccer',        dl: 301,   dlrs: 125,  ous: 24 }
  ];

  const tbody = document.getElementById('campaign-tbody');
  data.forEach(d => {
    const ratio = (d.dl / d.dlrs).toFixed(1);
    const isUntagged = d.name.startsWith('None') || d.name.startsWith('unknown');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="color:${isUntagged ? C.muted : C.text};font-weight:${isUntagged ? '400' : '600'}">${d.name}${isUntagged ? ' <span style="color:var(--yellow);font-size:10px;font-weight:600;background:rgba(251,191,36,0.12);padding:1px 6px;border-radius:4px;margin-left:4px;">UNTAGGED</span>' : ''}</td>
      <td class="num-cell">${fmtFull(d.dl)}</td>
      <td class="num-cell">${fmtFull(d.dlrs)}</td>
      <td class="num-cell">${d.ous}</td>
      <td class="num-cell">${ratio}</td>
    `;
    tbody.appendChild(tr);
  });
})();

// ─── CHART 7: Trend Combo ────────────────────────────────────────────────────
(function drawTrendChart() {
  const { ctx, w, H } = initCanvas('trendChart', 320);
  const pad = { top: 36, right: 80, bottom: 50, left: 72 };
  const cw = w - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  const months = ['Feb', 'Mar', 'Apr', 'May'];
  const assets    = [16,    46210, 111875, 35657];
  const products  = [0,     4159,  10422,  3335 ];
  const templates = [0,     7180,  14146,  4522 ];
  const users     = [3,     2335,  3752,   2230 ];
  const dlrs      = [0,     5649,  18063,  7565 ];

  const maxBar = Math.max(...assets.map((a, i) => a + products[i] + templates[i])) * 1.2;
  const maxLine = Math.max(...users, ...dlrs) * 1.3;

  const n = months.length;
  const barW = cw / n * 0.55;

  // Grid
  const gridSteps = 5;
  for (let i = 0; i <= gridSteps; i++) {
    const v = maxBar * (1 - i / gridSteps);
    const y = pad.top + ch * (i / gridSteps);
    ctx.fillStyle = C.dim;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(fmt(Math.round(v)), pad.left - 6, y + 4);
    ctx.strokeStyle = 'rgba(46,49,64,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + cw, y);
    ctx.stroke();
  }

  // Right Y axis label
  ctx.fillStyle = C.dim;
  ctx.font = '10px system-ui';
  ctx.textAlign = 'left';
  for (let i = 0; i <= 4; i++) {
    const v = maxLine * (1 - i / 4);
    const y = pad.top + ch * (i / 4);
    ctx.fillText(fmt(Math.round(v)), pad.left + cw + 6, y + 4);
  }

  // Stacked bars
  months.forEach((mo, i) => {
    const xc = pad.left + (i + 0.5) * (cw / n);
    const bx = xc - barW / 2;
    const stackData = [
      { val: assets[i],    color: C.blue   },
      { val: products[i],  color: C.green  },
      { val: templates[i], color: C.purple }
    ];
    let cumY = pad.top + ch;
    stackData.forEach(sd => {
      const bh = (sd.val / maxBar) * ch;
      cumY -= bh;
      ctx.fillStyle = sd.color + 'cc';
      ctx.beginPath();
      roundRect(ctx, bx, cumY, barW, bh, 2);
      ctx.fill();
    });

    ctx.fillStyle = C.dim;
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(mo, xc, pad.top + ch + 16);
  });

  // Line: Users
  function drawLine(data, maxV, colorStr, labelStr) {
    const pts = data.map((v, i) => ({
      x: pad.left + (i + 0.5) * (cw / n),
      y: pad.top + ch - (v / maxV) * ch
    }));
    ctx.strokeStyle = colorStr;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    pts.forEach((p, i) => {
      ctx.fillStyle = colorStr;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = C.text;
      ctx.font = 'bold 10px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(fmt(data[i]), p.x, p.y - 9);
    });
  }

  drawLine(users, maxLine, C.red,    'Users');
  drawLine(dlrs,  maxLine, C.orange, 'Downloaders');

  // Legend
  const legItems = [
    { label: 'Assets',      color: C.blue },
    { label: 'Products',    color: C.green },
    { label: 'Templates',   color: C.purple },
    { label: 'Users',       color: C.red },
    { label: 'Downloaders', color: C.orange }
  ];
  let lx = pad.left;
  const ly = H - 6;
  legItems.forEach(li => {
    ctx.fillStyle = li.color;
    ctx.fillRect(lx, ly - 8, 10, 8);
    ctx.fillStyle = C.muted;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(li.label, lx + 13, ly);
    lx += ctx.measureText(li.label).width + 28;
  });
})();

// ─── CHART 8: New vs Returning ────────────────────────────────────────────────
(function drawNewReturn() {
  const { ctx, w, H } = initCanvas('newReturnChart', 200);
  const pad = { top: 28, right: 20, bottom: 40, left: 50 };
  const cw = w - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  // Mar: 2335 total, 2333 new → 2 returning
  // Apr: 3752 total, 2203 new → 1549 returning
  // May: 2230 total,  579 new → 1651 returning
  const months = ['Mar', 'Apr', 'May'];
  const newU = [2333, 2203, 579];
  const retU = [2, 1549, 1651];
  const totals = [2335, 3752, 2230];

  const maxVal = Math.max(...totals) * 1.15;
  const n = months.length;
  const barW = cw / n * 0.6;

  // Grid
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const v = maxVal * (1 - i / gridSteps);
    const y = pad.top + ch * (i / gridSteps);
    ctx.fillStyle = C.dim;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(fmt(Math.round(v)), pad.left - 6, y + 4);
    ctx.strokeStyle = 'rgba(46,49,64,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + cw, y);
    ctx.stroke();
  }

  months.forEach((mo, i) => {
    const xc = pad.left + (i + 0.5) * (cw / n);
    const bx = xc - barW / 2;
    const retH = (retU[i] / maxVal) * ch;
    const newH = (newU[i] / maxVal) * ch;

    // Returning (bottom)
    ctx.fillStyle = C.blue + 'cc';
    ctx.beginPath();
    roundRect(ctx, bx, pad.top + ch - retH, barW, retH, 3);
    ctx.fill();

    // New (top)
    ctx.fillStyle = C.red + 'cc';
    ctx.beginPath();
    roundRect(ctx, bx, pad.top + ch - retH - newH, barW, newH, 3);
    ctx.fill();

    // % new label
    const pctNew = ((newU[i] / totals[i]) * 100).toFixed(0) + '% new';
    ctx.fillStyle = C.text;
    ctx.font = 'bold 10px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(pctNew, xc, pad.top + ch - retH - newH - 6);

    ctx.fillStyle = C.muted;
    ctx.font = '11px system-ui';
    ctx.fillText(mo, xc, pad.top + ch + 16);
  });

  // Legend
  const ly = H - 4;
  ctx.fillStyle = C.red + 'cc';
  ctx.fillRect(pad.left, ly - 8, 10, 8);
  ctx.fillStyle = C.muted;
  ctx.font = '10px system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('New Users', pad.left + 13, ly);

  ctx.fillStyle = C.blue + 'cc';
  ctx.fillRect(pad.left + 80, ly - 8, 10, 8);
  ctx.fillText('Returning', pad.left + 93, ly);
})();
