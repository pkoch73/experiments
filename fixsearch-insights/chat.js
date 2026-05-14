// DAM Insights chat — Option C hybrid
// 1. If slicc bridge is available → slicc.lick('dam-chat', ...) → cone answers via window.__damChatAnswer
// 2. Otherwise → direct Anthropic API call with context baked in

(function () {

  var msgs = document.getElementById('chat-messages');
  var input = document.getElementById('chat-input');
  var sendBtn = document.getElementById('chat-send');
  var pending = false;

  var SYSTEM_PROMPT = [
    "You are a data analyst assistant embedded in a Coca-Cola Digital Asset Management (DAM) analytics dashboard.",
    "Answer questions concisely and conversationally (2–5 sentences). Be specific with numbers from the data.",
    "Do not invent data not listed below. If unsure, say so.",
    "",
    "=== DATASET: fixsearchresultreport.assets.coke.com — 2026 YTD (Jan–May) ===",
    "",
    "USERS / LOGINS",
    "- Unique Users: 5,147 | First Time Users: 5,148",
    "- Monthly Unique Users: Feb:3, Mar:2335, Apr:3752, May:2314",
    "- Monthly Login Events: Feb:9, Mar:7240, Apr:34567, May:14951",
    "- Total Logins: 55,985",
    "- Users by Role: Associate:2636, Agency:963, Bottler:1645, Other:66",
    "- Logins/User by Role: Associate:4.2, Agency:7.3, Bottler:5.6, Other:12.3",
    "- Users by Region: AFR:166, ASP:291, EME:106, EU:636, GCM:53, INSWA:85, JSK:524, LA:544, NA:2600",
    "- Logins by Region: AFR:734, ASP:1412, EME:333, EU:3043, GCM:258, INSWA:543, JSK:3242, LA:1856, NA:44564",
    "- Logins/User by Region: AFR:4.4, ASP:4.9, EME:3.1, EU:4.8, GCM:4.9, INSWA:6.4, JSK:6.2, LA:3.4, NA:17.1",
    "- New user onboarding: Mar:100% new, Apr:59% new/41% returning, May:26% new/74% returning",
    "",
    "SEARCHES",
    "- Unique Searchers: 4,527 (88.0% of users)",
    "- Total Search Events: 234,660",
    "- Zero-result searches: 3,265 of 50,321 non-backfilled = 6.5%",
    "- Pre-migration backfilled data: 184,357 (not real zero-results)",
    "- Search type: Assets:197,919 (84.3%), Templates:26,516 (11.3%), Products:18,237 (7.8%)",
    "- Searches/User by Role: Associate:31.7, Agency:69.6, Bottler:50.6, Other:116.7",
    "- Searches/User by Region: NA:55.8, JSK:47.6, INSWA:42.7, GCM:44.9, EU:38.6, ASP:40.3, AFR:37.3, LA:26.1, EME:19.2",
    "- Top searches: a250:1266, fifa:1199, #CCIconDesign2Lifestylephoto:1176, fanta:1096, #fwc26cchumanity:1021, #FWC26photos:1008, sprite:860, coca-cola:726, FIFA:725, powerade:625",
    "- Top zero-result (all obscure IDs/hashtags — brand terms ARE working): 8250485155:43, #fantapackagingsystemtemplates:24, #projectsolokvimpulse:23",
    "- Filter usage: No filters:34,645 | With filters:23,676",
    "",
    "DOWNLOADS",
    "- Unique Downloaders: 2,689 (52.2% of users)",
    "- Total Downloads: 30,833 (Assets:28,191 + Templates:2,642)",
    "- Monthly: Mar:5649, Apr:18063, May:8056",
    "- Downloads/Downloader by Role: Associate:7.2, Agency:16.4, Bottler:15.9",
    "- Downloads by Region: JSK:5794, NA:14629, EU:3816, LA:2334, AFR:1555, ASP:1465, INSWA:658, GCM:312, EME:270",
    "- Downloads/User by Region: JSK:11.1, AFR:9.4, INSWA:7.7, EU:6.0, GCM:5.9, NA:5.6, ASP:5.0, LA:4.3, EME:2.5",
    "- YoY vs 2025: Total -11%, AFR:+107%, INSWA:+167%, JSK:+1%, ASP:+6%, EME:-6%, GCM:-16%, EU:-25%, NA:-17%, LA:-5%",
    "",
    "TOP CAMPAIGNS (by downloads)",
    "None/Coca-Cola Zero:10477, FIFA WC 2026:4991, unknown/Coca-Cola:3731, America 250:1720, Sprite Summer 2026:886, Coca-Cola Sustaining:746, Ice Cold 2026:591, Fanta Gaming 2026:548",
    "Unattributed (None+unknown): 14,208 = 46.1% of total",
    "",
    "ENGAGEMENT FUNNEL",
    "Users:5147 → Searchers:4527 (88.0%) → Downloaders:2689 (52.2%)",
    "Gap: 620 never searched (12%), 1838 searched but never downloaded (35.7%)"
  ].join("\n");

  // Auto-resize textarea
  input.addEventListener('input', function () {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  // ── API key management ──────────────────────────────────────────────────────
  var storedKey = null;

  function getApiKey() {
    if (storedKey) return storedKey;
    try { storedKey = sessionStorage.getItem('dam_chat_api_key'); } catch (e) {}
    return storedKey;
  }

  function promptForKey() {
    return new Promise(function (resolve) {
      // Build a small inline prompt inside the chat panel
      var keyDiv = document.createElement('div');
      keyDiv.className = 'chat-msg assistant';
      keyDiv.id = 'key-prompt-msg';
      keyDiv.innerHTML = [
        '<div class="chat-bubble" style="padding:12px 14px;">',
        '<div style="margin-bottom:8px;font-size:12px;color:#8b8fa8;">',
        'SLICC is not available. Enter an Anthropic API key to use chat directly.',
        '<br><span style="font-size:11px;opacity:0.7;">Stored in sessionStorage only — cleared when tab closes.</span>',
        '</div>',
        '<div style="display:flex;gap:6px;">',
        '<input id="api-key-input" type="password" placeholder="sk-ant-..." ',
        'style="flex:1;background:#0f1014;border:1px solid #2e3140;border-radius:6px;',
        'color:#e8eaf0;padding:6px 8px;font-size:12px;font-family:monospace;outline:none;" />',
        '<button id="api-key-submit" ',
        'style="background:#F40009;color:#fff;border:none;border-radius:6px;padding:6px 12px;',
        'font-size:12px;cursor:pointer;white-space:nowrap;">Save</button>',
        '</div>',
        '</div>'
      ].join('');
      msgs.appendChild(keyDiv);
      msgs.scrollTop = msgs.scrollHeight;

      var keyInput = document.getElementById('api-key-input');
      var keySubmit = document.getElementById('api-key-submit');
      keyInput.focus();

      function submit() {
        var k = keyInput.value.trim();
        if (!k) return;
        keyDiv.remove();
        storedKey = k;
        try { sessionStorage.setItem('dam_chat_api_key', k); } catch (e) {}
        resolve(k);
      }

      keySubmit.addEventListener('click', submit);
      keyInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') submit();
      });
    });
  }

  // ── Main send handler ───────────────────────────────────────────────────────
  window.sendQuestion = function () {
    var q = input.value.trim();
    if (!q || pending) return;

    addMsg('user', q);
    input.value = '';
    input.style.height = 'auto';

    var thinkingId = 'thinking-' + Date.now();
    addMsg('thinking', 'sliccy is thinking…', thinkingId);
    pending = true;
    sendBtn.disabled = true;

    // ── Path A: SLICC bridge ────────────────────────────────────────────────
    if (typeof slicc !== 'undefined' && typeof slicc.lick === 'function') {
      setStatusDot('slicc');
      window.__damChatAnswer = function (answer) {
        removeMsg(thinkingId);
        addMsg('assistant', answer);
        pending = false;
        sendBtn.disabled = false;
        window.__damChatAnswer = null;
      };
      slicc.lick('dam-chat', {
        question: q,
        context: 'fixsearch-insights-dashboard',
        source: location.href
      });
      return;
    }

    // ── Path B: Direct Anthropic API ────────────────────────────────────────
    setStatusDot('api');

    function callApi(key) {
      fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 512,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: q }]
        })
      })
        .then(function (r) {
          if (!r.ok) {
            return r.json().then(function (e) {
              throw new Error((e.error && e.error.message) || ('HTTP ' + r.status));
            });
          }
          return r.json();
        })
        .then(function (data) {
          removeMsg(thinkingId);
          var text = data.content && data.content[0] && data.content[0].text;
          addMsg('assistant', text || '(empty response)');
        })
        .catch(function (err) {
          removeMsg(thinkingId);
          // If auth error, clear stored key so user can re-enter
          if (String(err.message).match(/auth|key|401|invalid/i)) {
            storedKey = null;
            try { sessionStorage.removeItem('dam_chat_api_key'); } catch (e) {}
            addMsg('assistant', '⚠️ API key invalid or expired. Click send again to enter a new key.');
          } else {
            addMsg('assistant', '⚠️ Error: ' + err.message);
          }
        })
        .finally(function () {
          pending = false;
          sendBtn.disabled = false;
        });
    }

    var key = getApiKey();
    if (key) {
      callApi(key);
    } else {
      promptForKey().then(function (k) {
        callApi(k);
      });
    }
  };

  // ── Status dot ──────────────────────────────────────────────────────────────
  function setStatusDot(mode) {
    var dot = document.getElementById('chat-status-dot');
    if (!dot) return;
    if (mode === 'slicc') {
      dot.title = 'Connected via SLICC';
      dot.style.background = '#22c55e';
    } else if (mode === 'api') {
      dot.title = 'Connected via Anthropic API';
      dot.style.background = '#3b82f6';
    } else {
      dot.style.background = '#5a5e72';
    }
  }

  // Set initial status
  (function () {
    var dot = document.getElementById('chat-status-dot');
    if (dot) {
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.borderRadius = '50%';
      dot.style.background = '#5a5e72';
      dot.style.flexShrink = '0';
    }
    // Resolve mode after a tick (slicc bridge may inject async)
    setTimeout(function () {
      if (typeof slicc !== 'undefined' && typeof slicc.lick === 'function') {
        setStatusDot('slicc');
        updateNote('Powered by SLICC · responses from sliccy');
      } else {
        setStatusDot('api');
        updateNote('Powered by Claude · API key required');
      }
    }, 300);
  })();

  function updateNote(text) {
    var n = document.getElementById('chat-slicc-note');
    if (n) n.textContent = text;
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function addMsg(role, text, id) {
    var div = document.createElement('div');
    div.className = 'chat-msg ' + role;
    if (id) div.id = id;
    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = text.replace(/\n/g, '<br>');
    div.appendChild(bubble);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeMsg(id) {
    var el = document.getElementById(id);
    if (el) el.remove();
  }

})();
