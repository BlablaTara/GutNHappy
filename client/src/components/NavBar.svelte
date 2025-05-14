<script>
    import { onMount } from 'svelte';
    import { Link, useLocation } from 'svelte-routing';
    import { fetchGet } from '../utils/fetch.js';
    import { logout } from '../utils/logout.js';
    import { isLoggedIn } from '../stores/auth.js';

    const location = useLocation();
    //let isLoggedIn = false;

    onMount(async () => {
        const result = await fetchGet("/api/user-status");
        isLoggedIn.set(!!result.isLoggedIn);
    });

    async function handleLogout() {
        await logout();
        isLoggedIn.set(false);
    }

</script>

<nav class="navbar">
    <div class="navbar-left">
        <Link to="/" class="logo">
            <img src="/gnh_logo.png" alt="Logo" />
        </Link>
    </div>
    <div  class="navbar-right">
        {#if $isLoggedIn}
         <Link to="/dashboard">Dashboard</Link>
         <button on:click={handleLogout}>Logout</button>
        {:else if $location.pathname === '/' || $location.pathname === '/login' || $location.pathname === '/about'}
            <Link to="/login">Login</Link>
            <Link to="/about">About</Link>
            <Link to="/add-health">Add Health</Link>

        {/if}        
    </div>
</nav>