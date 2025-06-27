<script>
  import { Link, useLocation } from "svelte-routing";

  import { authStore } from "../stores/authStore.js";
  import { logout } from "../utils/logout.js";

  const location = useLocation();

  async function handleLogout() {
    await logout();
    authStore.set({ isLoggedIn: false, user: null, loading: false });
  }
</script>

<nav class="navbar">
  <div class="navbar-left">
    <Link to="/" class="logo">
      <img src="/gnh_logo.png" alt="Logo" />
    </Link>
  </div>
  <div class="navbar-right">
    {#if $authStore.isLoggedIn}
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/add-health">Add Health</Link>
      <Link to="/leaderboard">Leaderboard</Link>
      <Link to="/profile">Profile</Link>
      <button on:click={handleLogout}>Logout</button>
    {:else if $location.pathname === "/" || $location.pathname === "/login"}
      <Link to="/login">Login/Signup</Link>
    {/if}
  </div>

  <!--Small bg-pictures-->
  <div class="nav-bg bg-nav1"></div>
  <div class="nav-bg bg-nav2"></div>
  <div class="nav-bg bg-nav3"></div>
</nav>
