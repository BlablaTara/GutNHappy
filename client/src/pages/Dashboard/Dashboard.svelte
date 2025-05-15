<script>
    import { authStore } from "../../stores/authStore.js";
    import { logout } from "../../utils/logout.js";

    let name = '';

    $: name = $authStore.user ? $authStore.user.name : "";
    
</script>

<div>
    <h1>Dashboard</h1>
    <p>Welcome {name}</p>
    <button on:click={logout}>Log out</button>
</div>
