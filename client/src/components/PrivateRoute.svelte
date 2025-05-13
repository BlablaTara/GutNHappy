<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";

    export let component;
    let isAuthenticated = false;
    let loading = true;

    onMount(async () => {
        const res = await fetch("/api/protected");
        isAuthenticated = res.ok;
        loading = false;

        if (!isAuthenticated) {
            navigate("/login");
        }
    });
</script>

{#if loading}
    <p>Loading...</p>
{:else if isAuthenticated}
    <svelte:component this={component} />
{/if}        