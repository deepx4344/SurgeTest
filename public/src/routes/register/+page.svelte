<script lang="ts">
  import { api } from '$lib/api';
  let email = '', password = '', error = '';

  async function submit() {
    try {
      await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      window.location.href = '/login';
    } catch (e) { error = e.message; }
  }
</script>

<h1>Register</h1>
<input bind:value={email} placeholder="Email" />
<input type="password" bind:value={password} placeholder="Password" />
<button on:click={submit}>Register</button>
{#if error}<p>{error}</p>{/if}