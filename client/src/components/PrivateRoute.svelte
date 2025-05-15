<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { authStore } from "../stores/authStore.js";
    import { fetchGet } from "../utils/fetch.js";

    export let component;
    // let isAuthenticated = false;
    // let loading = true;


    onMount(async () => {
        console.log("Private route Mountet");
        
        const result = await fetchGet("/api/protected/user-status");

        if (result.error || !result.isLoggedIn) {
            authStore.set({ isLoggedIn: false, user: null, loading: false });
            //isAuthenticated = false;
            navigate("/login");
        } else {
            authStore.set({ isLoggedIn: true, user: result.user, loading: false });
            //isAuthenticated = true;
        }
        //loading = false;

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

{#if $authStore.loading}
    <p>Loading...</p>
{:else if $authStore.isLoggedIn}
    <svelte:component this={component} />
{/if}   

<!-- {#if loading}
    <p>Loading...</p>
{:else if isAuthenticated}
    <svelte:component this={component} />
{/if}         -->