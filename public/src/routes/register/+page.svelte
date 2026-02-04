<script lang="ts">
  import { api } from '$lib/api';
  import {goto} from "$app/navigation"

  let email = '', password = '', error = '';

  async function submit() {
    try {
      await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      await goto("/login")
    }catch (e) { error = e instanceof Error? e.message : "Registration failed"; }

  }
</script>

<h1>Register</h1>
<form on:submit|preventDefault={submit}>
<input bind:value={email} placeholder="Email" />
<input type="password" bind:value={password} placeholder="Password" />
<button on:click={submit}>Register</button>
</form>
{#if error}<p>{error}</p>{/if}