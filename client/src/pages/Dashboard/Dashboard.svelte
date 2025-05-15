<script>
    import { onMount } from "svelte";
    import { fetchGet} from "../../utils/fetch.js";
    import { authStore } from "../../stores/authStore.js";
    import { logout } from "../../utils/logout.js";

    let name = '';

    // onMount(async () => {
    //     console.log("Dashboardroute Mountet");
    //     try {
    //         const res = await fetchGet("/api/protected/user-status");
    //         name = res.user?.name || 'Guest';
    //     } catch (error) {
    //         console.log("Can't get name: ", error);
            
    //     }
    // });

    $: name = $authStore.user ? $authStore.user.name : "";

    
</script>

<div>
    <h1>Dashboard</h1>
    <p>Welcome {name}</p>
    <button on:click={logout}>Log out</button>
</div>
