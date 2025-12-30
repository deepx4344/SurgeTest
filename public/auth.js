document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('auth-form');
  if (!form) return;

  const endpoint = form.dataset.endpoint;
  const submitBtn = form.querySelector('button[type="submit"]');
  const msg = document.getElementById('msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value;

    if (!email || !password) {
      showMessage('Please provide both email and password', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    // show a neutral processing message while awaiting server work
    showMessage('Processing request — this may take a few seconds...', '');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      // Try to parse JSON, fallback to plain text
      let parsedBody;
      let rawText = '';
      try {
        parsedBody = await res.clone().json();
      } catch (_) {
        rawText = await res.clone().text();
      }

      // Prepare message and details depending on response shape
      if (res.ok) {
        let message = 'Success!';
        if (parsedBody && (parsedBody.message || parsedBody.success)) {
          message = parsedBody.message || (parsedBody.success ? 'Success' : message);
        } else if (rawText) {
          message = rawText;
        } else {
          message = 'Success! Check your email if verification is required.';
        }
        showMessage(message, 'success', parsedBody || rawText || '', `${res.status} ${res.statusText}`);
        // If this was a registration and the server returned 201, offer a quick link to login
        if (endpoint && endpoint.endsWith('/register') && res.status === 201) {
          const link = document.createElement('a');
          link.href = '/login.html';
          link.textContent = 'Proceed to login';
          link.className = 'link';
          link.style.marginLeft = '12px';
          msg.appendChild(link);
        }
      } else {
        // Non-2xx response might include structured errors
        let errMsg = '';
        if (parsedBody) {
          if (parsedBody.message) errMsg = parsedBody.message;
          else if (parsedBody.error) errMsg = parsedBody.error;
          else errMsg = JSON.stringify(parsedBody);
        } else if (rawText) {
          errMsg = rawText;
        } else {
          errMsg = res.statusText || `HTTP ${res.status}`;
        }
        showMessage(errMsg, 'error', parsedBody || rawText || '', `${res.status} ${res.statusText}`);
      }
    } catch (err) {
      showMessage(`Network error: ${err.message}`, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }
  });

  function escapeHtml(unsafe) {
    if (!unsafe && unsafe !== 0) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showMessage(txt, type, details = '', status = '') {
    if (!msg) return;
    msg.className = '';
    if (type === 'success') msg.classList.add('msg-success');
    else if (type === 'error') msg.classList.add('msg-error');

    let html = '';
    if (status) html += `<div class="msg-status">Status: ${escapeHtml(status)}</div>`;
    html += `<div class="msg-text">${escapeHtml(txt)}</div>`;
    if (details) {
      const content = typeof details === 'string' ? details : JSON.stringify(details, null, 2);
      html += `<pre class="msg-details">${escapeHtml(content)}</pre>`;
    }
    msg.innerHTML = html;
  }
});
