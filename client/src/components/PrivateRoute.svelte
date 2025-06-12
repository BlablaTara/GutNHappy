<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  import { authStore } from "../stores/authStore.js";
  import { fetchGet } from "../utils/fetch.js";

  export let component;

  let loading = true;

  onMount(async () => {
    authStore.set({ isLoggedIn: false, user: null, loading: true });

    const response = await fetchGet("/api/protected");

    if (response.error || !response.isLoggedIn) {
      authStore.set({ isLoggedIn: false, user: null, loading: false });
      navigate("/login");
    } else {
      authStore.set({ isLoggedIn: true, user: response.user, loading: false });
    }
    loading = false;
  });
</script>

{#if loading}
  <p>Loading...</p>
{:else if $authStore.isLoggedIn}
  <svelte:component this={component} />
{/if}
