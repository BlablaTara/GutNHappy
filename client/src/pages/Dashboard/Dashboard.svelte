<script>
    import { onMount } from "svelte";
    import { fetchGet} from "../../utils/fetch.js";
    import { logout } from "../../utils/logout.js";

    let name = '';

    onMount(async () => {
        try {
            const res = await fetchGet("/api/protected/user-status");
            name = res.user?.name || 'Guest';
        } catch (error) {
            console.log("Can't get name: ", error);
            
        }
    });

    
</script>

<div>
    <h1>Dashboard</h1>
    <p>Welcome {name}</p>
    <button on:click={logout}>Log out</button>
</div>
