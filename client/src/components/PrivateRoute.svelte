<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { fetchGet } from "../utils/fetch";

    export let component;
    let isAuthenticated = false;
    let loading = true;


    onMount(async () => {
        const result = await fetchGet("/api/user-status");

        if (result.error || !result.isLoggedIn) {
            isAuthenticated = false;
            navigate("/login");
        } else {
            isAuthenticated = true;
        }
        loading = false;

    });

    // onMount(async () => {
    //     const res = await fetch("/api/protected");
    //     isAuthenticated = res.ok;
    //     loading = false;

    //     if (!isAuthenticated) {
    //         navigate("/login");
    //     }
    // });
</script>

{#if loading}
    <p>Loading...</p>
{:else if isAuthenticated}
    <svelte:component this={component} />
{/if}        