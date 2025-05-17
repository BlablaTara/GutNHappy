<script>
    import { onMount } from 'svelte';
    import { Link, useLocation } from 'svelte-routing';
    import { fetchGet } from '../utils/fetch.js';
    import { logout } from '../utils/logout.js';
    import { authStore } from '../stores/authStore.js';

    const location = useLocation();

    onMount(async () => {
        console.log("NavBar route Mountet");
        const result = await fetchGet("/api/protected");
        if (result.error || !result.data) {
            authStore.set({ isLoggedIn: false, user: null, loading: false });
        } else {
            authStore.set({ isLoggedIn: true, user: result.user, loading: false });
        }
    });

    async function handleLogout() {
        await logout();
        authStore.set({ isLoggedIn: false, user: null, loading: false})
    }

</script>

<nav class="navbar">
    <div class="navbar-left">
        <Link to="/" class="logo">
            <img src="/gnh_logo.png" alt="Logo" />
        </Link>
    </div>
    <div  class="navbar-right">
        {#if $authStore.isLoggedIn}
         <Link to="/dashboard">Dashboard</Link>
         <Link to="/add-health">Add Health</Link>
         <button on:click={handleLogout}>Logout</button>
        {:else if $location.pathname === '/' || $location.pathname === '/login' || $location.pathname === '/about'}
            <Link to="/login">Login</Link>
            <Link to="/about">About</Link>


        {/if}        
    </div>
</nav>