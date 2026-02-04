<script lang="ts">
  import { api } from '$lib/api';
  import {goto} from "$app/navigation"
  let email = '', password = '', error = '';

  async function submit() {
    try {
      await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      await goto("/dashboard")
    } catch (e) { error = e instanceof Error? e.message : "Login failed"; }
  }
</script>

<h1>Login</h1>
<form on:submit|preventDefault={submit}>
<input bind:value={email} placeholder="Email" />
<input type="password" bind:value={password} placeholder="Password" />
<button on:click={submit}>Login</button>
</form>
{#if error}<p>{error}</p>{/if}