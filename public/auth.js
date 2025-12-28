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
    submitBtn.textContent = 'Sending...';
    showMessage('', '');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        showMessage(data.message || 'Success! Check your email if verification is required.', 'success');
        // Optionally redirect after short delay
        // setTimeout(() => window.location.href = '/', 1500);
      } else {
        showMessage(data.message || `Error: ${res.statusText || res.status}`, 'error');
      }
    } catch (err) {
      showMessage(`Network error: ${err.message}`, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }
  });

  function showMessage(txt, type) {
    if (!msg) return;
    msg.textContent = txt;
    msg.className = '';
    if (type === 'success') msg.classList.add('msg-success');
    else if (type === 'error') msg.classList.add('msg-error');
  }
});
