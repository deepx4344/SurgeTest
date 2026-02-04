<script lang="ts">
  import { api } from '$lib/api';
  let email = '', password = '', error = '';

  async function submit() {
    try {
      await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      window.location.href = '/dashboard';
    } catch (e) { error = e.message; }
  }
</script>

<h1>Login</h1>
<input bind:value={email} placeholder="Email" />
<input type="password" bind:value={password} placeholder="Password" />
<button on:click={submit}>Login</button>
{#if error}<p>{error}</p>{/if}