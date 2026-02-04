  import { onDestroy } from 'svelte';
  import { api } from '$lib/api';
  let url = '', concurrency = 50, duration = 30, status = '';
  let method = 'GET';
  let headers = `{
    "Content-Type":"application/json"
  }`;
  let body = '';
  let pollInterval = any;

  async function pollStatus(testId: string) {
    try {
      const res = await api(`/api/load/${testId}`);
      status = `Status: ${res.status}`;
      
      if (res.status === 'completed' || res.status === 'failed') {
        clearInterval(pollInterval);
        status = `Test finished: ${res.status}. ${JSON.stringify(res.results || '')}`;
      }
    } catch (e) {
      console.error('Polling error', e);
    }
  }

  async function startTest() {
    status = 'Starting...';
    try {
      const parsedHeaders = headers ? JSON.parse(headers) : {};
      const parsedBody = body ? JSON.parse(body) : undefined;
      
      const res = await api('/api/load/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          url, 
          concurrency, 
          duration,
          method,
          headers: parsedHeaders,
          body: parsedBody
        })
      });
      
      const testId = res.test_id;
      status = `Test started: ${testId}. Waiting for results...`;
      
      if (pollInterval) clearInterval(pollInterval);
      pollInterval = setInterval(() => pollStatus(testId), 60000);
      
    } catch (e) {
      status = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  onDestroy(() => {
    if (pollInterval) clearInterval(pollInterval);
  });

<div class="container">
  <h1>Dashboard</h1>
  
  <div class="form-group">
    <label>Target URL</label>
    <input bind:value={url} placeholder="https://api.example.com/endpoint" />
  </div>

  <div class="row">
    <div class="form-group">
      <label>Method</label>
      <select bind:value={method}>
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>DELETE</option>
        <option>PATCH</option>
      </select>
    </div>

    <div class="form-group">
      <label>Concurrency</label>
      <input type="number" bind:value={concurrency} min="1" />
    </div>

    <div class="form-group">
      <label>Duration (s)</label>
      <input type="number" bind:value={duration} min="1" />
    </div>
  </div>

  <div class="form-group">
    <label>Headers (JSON)</label>
    <textarea bind:value={headers} rows="4"></textarea>
  </div>

  <div class="form-group">
    <label>Request Body (JSON)</label>
    <textarea bind:value={body} rows="6" placeholder="{JSON.stringify({ key: 'value' }, null, 2)}"></textarea>
  </div>

  <button on:click={startTest}>Run Load Test</button>
  
  {#if status}
    <p class="status {status.startsWith('Error') ? 'error' : 'success'}">{status}</p>
  {/if}
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: sans-serif;
  }
  .form-group {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
    gap: 1rem;
  }
  .row .form-group {
    flex: 1;
  }
  label {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  input, select, textarea {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    padding: 0.75rem 1.5rem;
    background-color: #0070f3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  button:hover {
    background-color: #0051a2;
  }
  .status {
    margin-top: 1rem;
    padding: 1rem;
    background: #f0f0f0;
    border-radius: 4px;
  }
  .error {
    background: #ffebee;
    color: #c62828;
  }
  .success {
    background: #e8f5e9;
    color: #2e7d32;
  }
</style>