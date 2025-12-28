document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sendBtn = document.getElementById('send-btn');
    const urlInput = document.getElementById('url');
    const methodSelect = document.getElementById('method');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const addHeaderBtn = document.getElementById('add-header-btn');
    const headersList = document.getElementById('headers-list');
    const bodyOptions = document.querySelectorAll('input[name="body-type"]');
    const bodyEditorContainer = document.getElementById('body-editor-container');
    const requestBodyInput = document.getElementById('request-body');
    const responseContainer = document.getElementById('response-container');
    const responseOutput = document.getElementById('response-output');
    const responseCode = document.getElementById('response-code');
    const placeholderContent = document.querySelector('.placeholder-content');
    const responseMeta = document.getElementById('response-meta');
    const statusCodeEl = document.getElementById('status-code');
    const responseTimeEl = document.getElementById('response-time');
    const responseSizeEl = document.getElementById('response-size');

    // Tab Switching Logic
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Header Management
    addHeaderBtn.addEventListener('click', () => {
        const row = document.createElement('div');
        row.className = 'key-value-row';
        row.innerHTML = `
            <input type="text" placeholder="Key" class="header-key">
            <input type="text" placeholder="Value" class="header-value">
            <button class="remove-row-btn" title="Remove header">&times;</button>
        `;
        headersList.appendChild(row);

        // Add remove listener
        row.querySelector('.remove-row-btn').addEventListener('click', () => {
            row.remove();
        });
    });

    // Initial remove buttons
    document.querySelectorAll('.remove-row-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.key-value-row').remove();
        });
    });

    // Body Type Switching
    bodyOptions.forEach(opt => {
        opt.addEventListener('change', (e) => {
            if (e.target.value === 'none') {
                bodyEditorContainer.classList.add('hidden');
            } else {
                bodyEditorContainer.classList.remove('hidden');
            }
        });
    });

    // Send Request
    sendBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        if (!url) {
            alert('Please enter a URL');
            return;
        }

        const method = methodSelect.value;
        
        // Collect Headers
        const headers = {};
        document.querySelectorAll('.key-value-row').forEach(row => {
            const key = row.querySelector('.header-key').value.trim();
            const value = row.querySelector('.header-value').value.trim();
            if (key) {
                headers[key] = value;
            }
        });

        // Collect Body
        let body = null;
        const bodyType = document.querySelector('input[name="body-type"]:checked').value;
        if (bodyType !== 'none') {
            const rawBody = requestBodyInput.value;
            if (bodyType === 'json') {
                try {
                    // Validate JSON
                    if (rawBody.trim()) {
                        JSON.parse(rawBody);
                        body = JSON.parse(rawBody); // Send as object if it's JSON
                    }
                } catch (e) {
                    alert('Invalid JSON in body');
                    return;
                }
            } else {
                body = rawBody;
            }
        }

        // Prepare Config for Backend
        const config = {
            url,
            method,
            headers,
            body
        };

        // UI Loading State
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span>Sending...</span>';
        placeholderContent.classList.add('hidden');
        responseOutput.classList.add('hidden');
        responseMeta.classList.add('hidden');

        const startTime = performance.now();

        try {
            const response = await fetch('/api/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            });

            const endTime = performance.now();
            const duration = Math.round(endTime - startTime);
            
            // Assuming the backend returns the response from the target URL
            // Structure: { status: 200, statusText: "OK", headers: {}, data: ... }
            const result = await response.json();

            // Display Meta
            responseMeta.classList.remove('hidden');
            statusCodeEl.textContent = `${result.status} ${result.statusText || ''}`;
            statusCodeEl.className = 'value ' + (result.status >= 200 && result.status < 300 ? 'status-success' : 'status-error');
            responseTimeEl.textContent = `${duration}ms`;
            
            // Estimate size (rough)
            const size = new TextEncoder().encode(JSON.stringify(result.data || '')).length;
            responseSizeEl.textContent = formatBytes(size);

            // Display Body
            responseOutput.classList.remove('hidden');
            
            let displayContent = result.data;
            if (typeof displayContent === 'object') {
                displayContent = JSON.stringify(displayContent, null, 2);
            }
            
            responseCode.textContent = displayContent;
            
        } catch (error) {
            responseOutput.classList.remove('hidden');
            responseCode.textContent = `Error: ${error.message}`;
            statusCodeEl.textContent = 'Error';
            statusCodeEl.className = 'value status-error';
            responseMeta.classList.remove('hidden');
        } finally {
            sendBtn.disabled = false;
            sendBtn.innerHTML = `
                <span>Send</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            `;
        }
    });

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }
});
