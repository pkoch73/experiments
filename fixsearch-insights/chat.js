// DAM Insights chat — routes questions to sliccy via slicc.lick
// Answers are posted back by the cone via window.__damChatAnswer(text)

(function() {

  var msgs = document.getElementById('chat-messages');
  var input = document.getElementById('chat-input');
  var sendBtn = document.getElementById('chat-send');
  var pending = false;

  // Auto-resize textarea
  input.addEventListener('input', function() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  window.sendQuestion = function() {
    var q = input.value.trim();
    if (!q || pending) return;

    // Add user message
    addMsg('user', q);
    input.value = '';
    input.style.height = 'auto';

    // Show thinking indicator
    var thinkingId = 'thinking-' + Date.now();
    addMsg('thinking', 'sliccy is thinking…', thinkingId);

    pending = true;
    sendBtn.disabled = true;

    // Check if slicc is available
    if (typeof slicc === 'undefined' || typeof slicc.lick !== 'function') {
      removeMsg(thinkingId);
      addMsg('assistant', '⚠️ SLICC is not detected. This chat requires the SLICC extension to route questions to sliccy. Open this dashboard from within SLICC to use the chat feature.');
      pending = false;
      sendBtn.disabled = false;
      return;
    }

    // Register the answer callback before licking
    window.__damChatAnswer = function(answer) {
      removeMsg(thinkingId);
      addMsg('assistant', answer);
      pending = false;
      sendBtn.disabled = false;
      window.__damChatAnswer = null;
    };

    // Send to sliccy with full context
    slicc.lick('dam-chat', {
      question: q,
      context: 'fixsearch-insights-dashboard',
      source: location.href
    });
  };

  function addMsg(role, text, id) {
    var div = document.createElement('div');
    div.className = 'chat-msg ' + role;
    if (id) div.id = id;
    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    // Render newlines
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
