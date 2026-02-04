<script lang="ts">
  import { api } from '$lib/api';
  let url = '', concurrency = 50, duration = 30, status = '';

  async function startTest() {
    status = 'Starting...';
    const res = await api('/api/tests', {
      method: 'POST',
      body: JSON.stringify({ url, concurrency, duration })
    });
    status = `Test started: ${res.test_id}`;
  }
</script>

<h1>Dashboard</h1>
<input bind:value={url} placeholder="Target URL" />
<input type="number" bind:value={concurrency} />
<input type="number" bind:value={duration} />
<button on:click={startTest}>Run Load Test</button>
<p>{status}</p>